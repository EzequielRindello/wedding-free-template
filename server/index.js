import cors from 'cors';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();

const API_PORT = Number(globalThis.process?.env?.API_PORT || 8787);
const ADMIN_TOKEN = globalThis.process?.env?.ADMIN_TOKEN || 'dev-admin-token';
const ADMIN_READONLY_TOKEN = globalThis.process?.env?.ADMIN_READONLY_TOKEN || '';

const buildAdminCapabilities = (role) => {
  if (role === 'readonly') {
    return {
      role,
      canReadRsvps: true,
      canEditRsvps: false,
      canDeleteRsvps: false,
      canReadSongs: true,
      canEditSongs: false,
      canDeleteSongs: false
    };
  }

  return {
    role: 'full',
    canReadRsvps: true,
    canEditRsvps: true,
    canDeleteRsvps: true,
    canReadSongs: true,
    canEditSongs: true,
    canDeleteSongs: true
  };
};

const getAdminCapabilitiesFromToken = (token) => {
  if (typeof token !== 'string') {
    return null;
  }

  const normalizedToken = token.trim();
  if (!normalizedToken) {
    return null;
  }

  if (normalizedToken === ADMIN_TOKEN) {
    return buildAdminCapabilities('full');
  }

  if (ADMIN_READONLY_TOKEN && normalizedToken === ADMIN_READONLY_TOKEN) {
    return buildAdminCapabilities('readonly');
  }

  return null;
};

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const toBooleanAttending = (value) => {
  if (typeof value === 'boolean') {
    return value;
  }

  return value === 'si';
};

const buildReference = () => {
  const randomChunk = Math.random().toString(36).slice(2, 8).toUpperCase();
  const timeChunk = Date.now().toString(36).slice(-4).toUpperCase();
  return `RSVP-${timeChunk}${randomChunk}`;
};

const parseGuestNamesString = (rawValue) => {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const serializeRsvp = (record) => ({
  ...record,
  guestNames: parseGuestNamesString(record.guestNames)
});

const createRsvpSchema = z.object({
  fullName: z.string().trim().min(2),
  email: z.string().trim().email(),
  attending: z.union([z.boolean(), z.enum(['si', 'no'])]),
  guests: z.number().int().min(0).max(20),
  guestNames: z.array(z.string().trim().min(1)).optional().default([]),
  dietaryRestrictions: z.string().trim().max(240).optional().default(''),
  note: z.string().trim().max(500).optional().default(''),
  source: z.string().trim().max(120).optional().default('wedding-landing-page')
});

const updateRsvpSchema = z.object({
  fullName: z.string().trim().min(2).optional(),
  email: z.string().trim().email().optional(),
  attending: z.union([z.boolean(), z.enum(['si', 'no'])]).optional(),
  guests: z.number().int().min(0).max(20).optional(),
  guestNames: z.array(z.string().trim().min(1)).optional(),
  dietaryRestrictions: z.string().trim().max(240).optional(),
  note: z.string().trim().max(500).optional()
});

const createSongSchema = z.object({
  guestName: z.string().trim().min(2),
  songTitle: z.string().trim().min(1),
  artist: z.string().trim().max(160).optional().default(''),
  note: z.string().trim().max(400).optional().default(''),
  source: z.string().trim().max(120).optional().default('wedding-landing-page')
});

const updateSongSchema = z.object({
  guestName: z.string().trim().min(2).optional(),
  songTitle: z.string().trim().min(1).optional(),
  artist: z.string().trim().max(160).optional(),
  note: z.string().trim().max(400).optional()
});

const requireAdmin = (permissionKey) => (req, res, next) => {
  const token = req.header('x-admin-token');
  const capabilities = getAdminCapabilitiesFromToken(token);

  if (!capabilities) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  if (permissionKey && !capabilities[permissionKey]) {
    return res.status(403).json({ message: 'Token sin permisos para esta accion' });
  }

  req.adminCapabilities = capabilities;
  return next();
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'wedding-api' });
});

app.post('/api/public/rsvps', async (req, res, next) => {
  try {
    const payload = createRsvpSchema.parse(req.body);
    const reference = buildReference();

    const created = await prisma.rsvp.create({
      data: {
        reference,
        fullName: payload.fullName,
        email: payload.email,
        attending: toBooleanAttending(payload.attending),
        guests: payload.guests,
        guestNames: JSON.stringify(payload.guestNames || []),
        dietaryRestrictions: payload.dietaryRestrictions || null,
        note: payload.note || null,
        source: payload.source || null
      }
    });

    res.status(201).json({
      id: created.id,
      reference: created.reference
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/public/song-requests', async (req, res, next) => {
  try {
    const payload = createSongSchema.parse(req.body);

    const created = await prisma.songRequest.create({
      data: {
        guestName: payload.guestName,
        songTitle: payload.songTitle,
        artist: payload.artist || null,
        note: payload.note || null,
        source: payload.source || null
      }
    });

    res.status(201).json({
      id: created.id,
      message: 'Sugerencia recibida'
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/capabilities', requireAdmin(), (req, res) => {
  res.json(req.adminCapabilities);
});

app.get('/api/admin/rsvps', requireAdmin('canReadRsvps'), async (_req, res, next) => {
  try {
    const rows = await prisma.rsvp.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(rows.map(serializeRsvp));
  } catch (error) {
    next(error);
  }
});

app.patch('/api/admin/rsvps/:id', requireAdmin('canEditRsvps'), async (req, res, next) => {
  try {
    const rsvpId = Number(req.params.id);
    if (!Number.isInteger(rsvpId)) {
      return res.status(400).json({ message: 'ID invalido' });
    }

    const payload = updateRsvpSchema.parse(req.body);
    const data = {};

    if (typeof payload.fullName === 'string') data.fullName = payload.fullName;
    if (typeof payload.email === 'string') data.email = payload.email;
    if (typeof payload.attending !== 'undefined') data.attending = toBooleanAttending(payload.attending);
    if (typeof payload.guests === 'number') data.guests = payload.guests;
    if (Array.isArray(payload.guestNames)) data.guestNames = JSON.stringify(payload.guestNames);
    if (typeof payload.dietaryRestrictions === 'string') data.dietaryRestrictions = payload.dietaryRestrictions;
    if (typeof payload.note === 'string') data.note = payload.note;

    const updated = await prisma.rsvp.update({
      where: { id: rsvpId },
      data
    });

    return res.json(serializeRsvp(updated));
  } catch (error) {
    return next(error);
  }
});

app.delete('/api/admin/rsvps/:id', requireAdmin('canDeleteRsvps'), async (req, res, next) => {
  try {
    const rsvpId = Number(req.params.id);
    if (!Number.isInteger(rsvpId)) {
      return res.status(400).json({ message: 'ID invalido' });
    }

    await prisma.rsvp.delete({
      where: { id: rsvpId }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/song-requests', requireAdmin('canReadSongs'), async (_req, res, next) => {
  try {
    const rows = await prisma.songRequest.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

app.patch('/api/admin/song-requests/:id', requireAdmin('canEditSongs'), async (req, res, next) => {
  try {
    const songRequestId = Number(req.params.id);
    if (!Number.isInteger(songRequestId)) {
      return res.status(400).json({ message: 'ID invalido' });
    }

    const payload = updateSongSchema.parse(req.body);
    const data = {};

    if (typeof payload.guestName === 'string') data.guestName = payload.guestName;
    if (typeof payload.songTitle === 'string') data.songTitle = payload.songTitle;
    if (typeof payload.artist === 'string') data.artist = payload.artist;
    if (typeof payload.note === 'string') data.note = payload.note;

    const updated = await prisma.songRequest.update({
      where: { id: songRequestId },
      data
    });

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
});

app.delete('/api/admin/song-requests/:id', requireAdmin('canDeleteSongs'), async (req, res, next) => {
  try {
    const songRequestId = Number(req.params.id);
    if (!Number.isInteger(songRequestId)) {
      return res.status(400).json({ message: 'ID invalido' });
    }

    await prisma.songRequest.delete({
      where: { id: songRequestId }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  void _next;

  if (error instanceof z.ZodError) {
    return res.status(400).json({
      message: 'Payload invalido',
      issues: error.issues
    });
  }

  if (error?.code === 'P2025') {
    return res.status(404).json({ message: 'Registro no encontrado' });
  }

  console.error('[api:error]', error);
  return res.status(500).json({ message: 'Error interno del servidor' });
});

app.listen(API_PORT, () => {
  console.info(`Wedding API corriendo en http://localhost:${API_PORT}`);
});
