# Guia de Configuracion

Esta guia explica como dejar la landing totalmente lista para publicar, tanto en modo frontend como en modo fullstack (Node + Prisma + panel admin).

## 1. Requisitos
- Node.js 18+
- npm 9+

## 2. Instalacion y ejecucion

Instalacion base:
```bash
npm install
```

Modo frontend (sin backend, solo mock/webhook):
```bash
npm run dev
```

Modo fullstack (frontend + API):
```bash
cp .env.example .env
npm run db:push
npm run dev:full
```

Si usas PowerShell en Windows:
```powershell
Copy-Item .env.example .env
```

Comandos utiles de backend:
```bash
npm run dev:api
npm run db:generate
npm run db:push
npm run db:studio
```

Build de produccion:
```bash
npm run build
npm run preview
```

## 3. Archivo principal de configuracion
Toda la personalizacion central esta en:
- `src/content/siteData.js`

### 3.1 SEO dinamico
Objeto: `seo`
- `title`
- `description`
- `canonicalUrl` (OBLIGATORIO formato absoluto, ejemplo: `https://tudominio.com/`)
- `ogImage`
- `themeColor`
- `locale`
- `twitterCard`

### 3.2 Privacidad del sitio
Objeto: `privacy`
- `enabled`
- `password`
- `allowIndexing`
- `accessTitle`
- `accessDescription`
- `accessHint`

Si `enabled` es `true`, se muestra pantalla de clave en frontend.

### 3.3 Datos de pareja y CTAs
Objeto: `couple`
- `names`
- `heroSubtitle`
- `splashButtonLabel`
- `heroPrimaryCtaLabel`
- `heroSecondaryCtaLabel`

Objeto: `stickyCta`
- `primaryLabel`
- `secondaryLabel`

### 3.4 Cuenta regresiva
Objeto: `countdown`
- `targetDate` (ISO)
- `displayDate`
- `introText`

### 3.5 Agenda extendida
Objeto: `eventSchedule`
- `sectionId`
- `title`
- `intro`
- `events[]` con:
  - `id`
  - `type`
  - `dateTime`
  - `venue`
  - `address`
  - `mapUrl`

Si `eventSchedule.events` no tiene datos, se usa el timeline clasico de `ceremony`.

### 3.6 Ceremonia, mapas y calendario
Objeto: `ceremony`
- `venueName`
- `addressLines`
- `mapUrl`
- `wazeUrl`
- `mapCta`, `wazeCta`
- `calendarEvent.*`
- `icsFileName`

Si `mapUrl` o `wazeUrl` estan vacios, los botones quedan deshabilitados.

### 3.7 Travel (hospedaje y traslados)
Objeto: `travel`
- `title`
- `subtitle`
- `hotels[]` con `name`, `distance`, `bookingUrl`
- `transport[]` con `title`, `detail`, `contactLabel`, `contactUrl`
- `notes`

### 3.8 RSVP avanzado (modo mock o webhook)
Objeto: `rsvp`
- Textos principales: `title`, `subtitle`, `description`, `deadlineText`
- Estados: `submitLabel`, `submittingLabel`, `successTitle`, `successMessage`, `errorMessage`
- Modo envio: `webhookUrl` y `formUrl` (fallback externo)
- Configuracion avanzada:
  - `formConfig.maxGuestsPerInvite`
  - `formConfig.requireGuestNames`
  - `formConfig.requireDietaryInfo`
  - `guestNamesLabel`, `guestNamePlaceholder`
  - `dietaryLabel`, `dietaryPlaceholder`
  - `confirmation.*` (referencia y proximos pasos)

Si `webhookUrl` esta vacio, sigue funcionando en modo demo local.

Sugerencia para conectar backend local:
- `webhookUrl: '/api/public/rsvps'`

### 3.9 Regalos y luna de miel
Objeto: `giftRegistry`
- `title`
- `intro`
- `cashGift.alias`, `cashGift.holder`, `cashGift.bank`
- `externalLinks[]`
- `copyCtaLabel`, `copiedText`
- `unavailableText`

### 3.10 Secciones restantes
- `logistics`
- `trust`
- `faq`
- `songRequest`
- `social`

Para SongRequest con backend:
- `songRequest.apiUrl: '/api/public/song-requests'`

## 4. Estrategia SEO implementada
Utilidad:
- `src/utils/seo.js`

Comportamiento actual:
1. Aplica title/meta/OG/Twitter en runtime desde `siteData.seo`.
2. Genera JSON-LD de tipo `Event` desde `ceremony.calendarEvent`.
3. Si `privacy.allowIndexing` es `false`, publica `robots: noindex, nofollow`.
4. Valida `canonicalUrl`:
   - Si es absoluto `http/https`, lo usa.
   - Si es invalido, usa fallback absoluto (`window.location.origin + pathname`) y muestra warning en dev.

Importante:
- En Vite, no uses canonical relativo en `index.html` (ej: `/`) porque puede romper el build.
- Usa siempre URL absoluta (ej: `https://tudominio.com/`).

## 5. Analytics y funnel RSVP
Utilidad:
- `src/utils/analytics.js`

Comportamiento:
- Push a `window.dataLayer`
- Envio opcional a `gtag` si existe
- Enriquecimiento automatico con `deviceType`

Funnel recomendado para GA4/Looker:
1. `landing_view`
2. `cta_rsvp_click`
3. `rsvp_start`
4. `rsvp_submit_attempt`
5. `rsvp_submit_success`

Eventos complementarios:
- `rsvp_submit_error`
- `rsvp_validation_error`
- `rsvp_guest_details_completed`
- `rsvp_confirmation_view`
- `map_click`
- `calendar_click`
- `travel_link_click`
- `gift_copy_click`
- `gift_external_click`

Dashboard sugerido:
- Conversion funnel por dispositivo (`deviceType`)
- Error rate de RSVP
- Click-through a mapa/calendario
- Uso de CTA externo de RSVP

## 6. Payload del webhook RSVP
El formulario envia JSON a `rsvp.webhookUrl` con:
- `fullName`
- `email`
- `attending`
- `guests`
- `guestNames[]`
- `dietaryRestrictions`
- `note`
- `source` (`wedding-landing-page`)
- `submittedAt` (ISO)

## 6.1 Payload de SongRequest
El formulario embebido envia JSON a `songRequest.apiUrl` con:
- `guestName`
- `songTitle`
- `artist`
- `note`
- `source` (`wedding-landing-page`)

## 6.2 API CRUD (Node + Prisma)
Servidor:
- `server/index.js`

Esquema:
- `prisma/schema.prisma`

Health check:
- `GET /api/health`

Publicos:
- `POST /api/public/rsvps`
- `POST /api/public/song-requests`

Admin (requiere header `x-admin-token`):
- `GET /api/admin/capabilities`
- `GET /api/admin/rsvps`
- `PATCH /api/admin/rsvps/:id`
- `DELETE /api/admin/rsvps/:id`
- `GET /api/admin/song-requests`
- `PATCH /api/admin/song-requests/:id`
- `DELETE /api/admin/song-requests/:id`

Panel admin frontend:
- `http://localhost:5173/admin`
- alternativa: `http://localhost:5173/?admin=1`
- pide token y muestra funciones segun capacidades (full o readonly)

Configuracion local:
- Copiar `.env.example` a `.env` si no existe.
- Definir `ADMIN_TOKEN` fuerte para admin.

Variables recomendadas en `.env`:
- `DATABASE_URL="file:./dev.db"`
- `API_PORT=8787`
- `ADMIN_TOKEN=<token-largo-y-privado>`
- `ADMIN_READONLY_TOKEN=<token-opcional-solo-lectura>`

## 6.3 Panel admin frontend (uso)
Ruta de acceso:
- `http://localhost:5173/admin`
- alternativa: `http://localhost:5173/?admin=1`

Funcionamiento:
1. Ingresar token admin.
2. El panel consulta `GET /api/admin/capabilities`.
3. Con esa respuesta, muestra un bloque de "Funciones habilitadas por token".
4. Si el token es full, permite editar/eliminar.
5. Si el token es readonly, deja solo lectura.
6. El token se guarda en `localStorage` (`wedding-admin-token`).
7. "Cerrar sesion" borra token y limpia el estado en pantalla.

## 6.4 Seguridad minima recomendada
1. Cambiar `ADMIN_TOKEN` (y `ADMIN_READONLY_TOKEN` si existe) por valores robustos antes de cualquier deploy.
2. No compartir token por canales abiertos ni dejarlo en capturas/video.
3. Publicar API detras de HTTPS.
4. Restringir CORS en `server/index.js` para produccion (actualmente queda abierto por simplicidad local).

## 7. Performance mobile y baseline
Script disponible:
```bash
npm run perf:check
```

Que hace:
1. Build de produccion.
2. Levanta `vite preview` en `127.0.0.1:4173`.
3. Ejecuta Lighthouse mobile.
4. Guarda baseline en:
- `perf/baseline.mobile.json`

Checklist de performance:
1. Revisar `LCP <= 2.5s`
2. Revisar `CLS <= 0.1`
3. Revisar `INP <= 0.2s`
4. Confirmar que hero y galeria no generan layout shifts visibles.

## 8. Offline fallback
Archivos:
- `public/service-worker.js`
- `public/offline.html`

Comportamiento:
- En produccion, se registra service worker.
- Si falla navegacion por red, muestra `offline.html`.

## 9. Assets
- Hero: `public/images/hero-mobile.webp`, `public/images/hero-desktop.webp`
- Slider: `src/assets/images/slider-*.webp`
- Musica: `src/assets/music/wedding-song.mp3`
- Favicon: `public/favicon/favicono.png`

## 10. Checklist de salida a produccion
1. Completar links y textos reales en `src/content/siteData.js`.
2. Validar fechas reales en `countdown`, `eventSchedule` y `ceremony.calendarEvent`.
3. Configurar `seo.canonicalUrl` absoluto de dominio final.
4. Verificar RSVP con webhook real (o confirmar modo demo).
5. Ejecutar:
   - `npm run lint`
   - `npm run build`
   - `npm run perf:check`
6. Probar mobile real (320px-430px) y desktop.
7. Validar accesibilidad de foco y contrastes en CTAs.
8. Si usas backend, verificar:
  - `GET /api/health`
  - alta de RSVP
  - alta de SongRequest
  - lectura admin con token
  - edicion y eliminacion admin
  - acceso y login en `/admin`

## 11. Opcional: desactivar musica
Si no queres musica:
- Quitar `MusicPlayerButton` en `src/App.jsx`.
- Quitar hook `useAudioPlayer` en `src/App.jsx`.
- Quitar import de `wedding-song.mp3` en `src/App.jsx`.
