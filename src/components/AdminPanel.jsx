import { useCallback, useEffect, useMemo, useState } from 'react';

const TOKEN_STORAGE_KEY = 'wedding-admin-token';

const DEFAULT_CAPABILITIES = {
  role: 'none',
  canReadRsvps: false,
  canEditRsvps: false,
  canDeleteRsvps: false,
  canReadSongs: false,
  canEditSongs: false,
  canDeleteSongs: false
};

const CAPABILITY_ITEMS = [
  {
    key: 'canReadRsvps',
    label: 'Ver RSVPs',
    description: 'Permite abrir y consultar el listado de RSVPs.'
  },
  {
    key: 'canEditRsvps',
    label: 'Editar RSVPs',
    description: 'Permite modificar asistencia, acompañantes y notas de RSVP.'
  },
  {
    key: 'canDeleteRsvps',
    label: 'Eliminar RSVPs',
    description: 'Permite borrar registros de RSVP.'
  },
  {
    key: 'canReadSongs',
    label: 'Ver canciones',
    description: 'Permite abrir y consultar sugerencias de canciones.'
  },
  {
    key: 'canEditSongs',
    label: 'Editar canciones',
    description: 'Permite actualizar datos de una sugerencia musical.'
  },
  {
    key: 'canDeleteSongs',
    label: 'Eliminar canciones',
    description: 'Permite borrar sugerencias musicales.'
  }
];

const buildRsvpDraft = (row = {}) => ({
  attending: row.attending ? 'si' : 'no',
  guests: typeof row.guests === 'number' ? row.guests : 0,
  dietaryRestrictions: row.dietaryRestrictions || '',
  note: row.note || ''
});

const buildSongDraft = (row = {}) => ({
  guestName: row.guestName || '',
  songTitle: row.songTitle || '',
  artist: row.artist || '',
  note: row.note || ''
});

const formatDateTime = (value) => {
  if (!value) {
    return 'Sin fecha';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(parsed);
};

const getErrorMessage = async (response) => {
  try {
    const payload = await response.json();
    if (payload && typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message;
    }
  } catch {
    return `Error ${response.status}`;
  }

  return `Error ${response.status}`;
};

const adminRequest = async (endpoint, token, options = {}) => {
  const { method = 'GET', body } = options;
  const headers = {
    'x-admin-token': token
  };

  if (body) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(endpoint, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  const payload = await response.json().catch(() => null);
  return payload;
};

export default function AdminPanel() {
  const initialToken =
    typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_STORAGE_KEY) || '' : '';

  const [authToken, setAuthToken] = useState(initialToken);
  const [tokenInput, setTokenInput] = useState(initialToken);
  const [activeTab, setActiveTab] = useState('rsvps');
  const [isLoading, setIsLoading] = useState(false);
  const [busyKey, setBusyKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [rsvps, setRsvps] = useState([]);
  const [songs, setSongs] = useState([]);
  const [rsvpDrafts, setRsvpDrafts] = useState({});
  const [songDrafts, setSongDrafts] = useState({});
  const [capabilities, setCapabilities] = useState(DEFAULT_CAPABILITIES);

  const hasReadAccess = capabilities.canReadRsvps || capabilities.canReadSongs;
  const canShowRsvpTab = capabilities.canReadRsvps;
  const canShowSongTab = capabilities.canReadSongs;
  const roleDescription =
    capabilities.role === 'full'
      ? 'Token con permisos completos (lectura, edicion y eliminacion).'
      : capabilities.role === 'readonly'
        ? 'Token en modo lectura. Solo puede consultar informacion.'
        : 'Conecta un token para ver las funciones habilitadas.';

  const totals = useMemo(() => {
    const confirmedCount = rsvps.filter((item) => item.attending).length;
    const estimatedGuests = rsvps.reduce((accumulator, item) => {
      if (!item.attending) {
        return accumulator;
      }

      const companions = Number(item.guests || 0);
      return accumulator + 1 + (Number.isFinite(companions) ? companions : 0);
    }, 0);

    return {
      rsvps: rsvps.length,
      songs: songs.length,
      confirmedCount,
      estimatedGuests
    };
  }, [rsvps, songs]);

  const fetchDashboard = useCallback(
    async (tokenValue = authToken) => {
      const normalizedToken = tokenValue.trim();
      if (!normalizedToken) {
        return;
      }

      setIsLoading(true);
      setErrorMessage('');
      setStatusMessage('');

      try {
        const nextCapabilitiesResponse = await adminRequest('/api/admin/capabilities', normalizedToken);
        const nextCapabilities = {
          ...DEFAULT_CAPABILITIES,
          ...(nextCapabilitiesResponse || {})
        };

        setCapabilities(nextCapabilities);

        const [nextRsvps, nextSongs] = await Promise.all([
          nextCapabilities.canReadRsvps
            ? adminRequest('/api/admin/rsvps', normalizedToken)
            : Promise.resolve([]),
          nextCapabilities.canReadSongs
            ? adminRequest('/api/admin/song-requests', normalizedToken)
            : Promise.resolve([])
        ]);

        const parsedRsvps = Array.isArray(nextRsvps) ? nextRsvps : [];
        const parsedSongs = Array.isArray(nextSongs) ? nextSongs : [];
        const nextRsvpDrafts = {};
        const nextSongDrafts = {};

        parsedRsvps.forEach((item) => {
          nextRsvpDrafts[item.id] = buildRsvpDraft(item);
        });

        parsedSongs.forEach((item) => {
          nextSongDrafts[item.id] = buildSongDraft(item);
        });

        setRsvps(parsedRsvps);
        setSongs(parsedSongs);
        setRsvpDrafts(nextRsvpDrafts);
        setSongDrafts(nextSongDrafts);

        if (nextCapabilities.role === 'readonly') {
          setStatusMessage('Token conectado en modo lectura.');
        } else {
          setStatusMessage('Panel actualizado correctamente.');
        }
      } catch (error) {
        setCapabilities({ ...DEFAULT_CAPABILITIES });
        setRsvps([]);
        setSongs([]);
        setRsvpDrafts({});
        setSongDrafts({});
        setErrorMessage(error.message || 'No se pudo cargar el panel admin.');
      } finally {
        setIsLoading(false);
      }
    },
    [authToken]
  );

  useEffect(() => {
    if (!authToken) {
      return;
    }

    void fetchDashboard(authToken);
  }, [authToken, fetchDashboard]);

  useEffect(() => {
    if (activeTab === 'rsvps' && !canShowRsvpTab && canShowSongTab) {
      setActiveTab('songs');
      return;
    }

    if (activeTab === 'songs' && !canShowSongTab && canShowRsvpTab) {
      setActiveTab('rsvps');
    }
  }, [activeTab, canShowRsvpTab, canShowSongTab]);

  const handleConnect = (event) => {
    event.preventDefault();
    const normalizedToken = tokenInput.trim();

    if (!normalizedToken) {
      setErrorMessage('Ingresa el token admin para continuar.');
      return;
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, normalizedToken);
    }

    setErrorMessage('');
    setAuthToken(normalizedToken);

    if (normalizedToken === authToken) {
      void fetchDashboard(normalizedToken);
    }
  };

  const handleClearSession = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }

    setAuthToken('');
    setTokenInput('');
    setRsvps([]);
    setSongs([]);
    setRsvpDrafts({});
    setSongDrafts({});
    setCapabilities({ ...DEFAULT_CAPABILITIES });
    setActiveTab('rsvps');
    setErrorMessage('');
    setStatusMessage('Sesion cerrada.');
  };

  const updateRsvpDraft = (id, field, value, sourceRow) => {
    setRsvpDrafts((previous) => {
      const baseDraft = previous[id] || buildRsvpDraft(sourceRow);
      return {
        ...previous,
        [id]: {
          ...baseDraft,
          [field]: value
        }
      };
    });
  };

  const updateSongDraft = (id, field, value, sourceRow) => {
    setSongDrafts((previous) => {
      const baseDraft = previous[id] || buildSongDraft(sourceRow);
      return {
        ...previous,
        [id]: {
          ...baseDraft,
          [field]: value
        }
      };
    });
  };

  const handleSaveRsvp = async (row) => {
    if (!capabilities.canEditRsvps) {
      setErrorMessage('Tu token no tiene permiso para editar RSVPs.');
      return;
    }

    const draft = rsvpDrafts[row.id] || buildRsvpDraft(row);
    const payload = {
      attending: draft.attending,
      guests: Number(draft.guests) || 0,
      dietaryRestrictions: draft.dietaryRestrictions.trim(),
      note: draft.note.trim()
    };

    setBusyKey(`rsvp-save-${row.id}`);
    setErrorMessage('');

    try {
      const updated = await adminRequest(`/api/admin/rsvps/${row.id}`, authToken, {
        method: 'PATCH',
        body: payload
      });

      setRsvps((previous) => previous.map((item) => (item.id === row.id ? updated : item)));
      setRsvpDrafts((previous) => ({
        ...previous,
        [row.id]: buildRsvpDraft(updated)
      }));
      setStatusMessage(`RSVP #${row.id} actualizado.`);
    } catch (error) {
      setErrorMessage(error.message || 'No se pudo guardar el RSVP.');
    } finally {
      setBusyKey('');
    }
  };

  const handleDeleteRsvp = async (row) => {
    if (!capabilities.canDeleteRsvps) {
      setErrorMessage('Tu token no tiene permiso para eliminar RSVPs.');
      return;
    }

    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(`Eliminar RSVP de ${row.fullName}?`);
      if (!confirmed) {
        return;
      }
    }

    setBusyKey(`rsvp-delete-${row.id}`);
    setErrorMessage('');

    try {
      await adminRequest(`/api/admin/rsvps/${row.id}`, authToken, {
        method: 'DELETE'
      });

      setRsvps((previous) => previous.filter((item) => item.id !== row.id));
      setRsvpDrafts((previous) => {
        const next = { ...previous };
        delete next[row.id];
        return next;
      });
      setStatusMessage(`RSVP #${row.id} eliminado.`);
    } catch (error) {
      setErrorMessage(error.message || 'No se pudo eliminar el RSVP.');
    } finally {
      setBusyKey('');
    }
  };

  const handleSaveSong = async (row) => {
    if (!capabilities.canEditSongs) {
      setErrorMessage('Tu token no tiene permiso para editar canciones.');
      return;
    }

    const draft = songDrafts[row.id] || buildSongDraft(row);
    const payload = {
      guestName: draft.guestName.trim(),
      songTitle: draft.songTitle.trim(),
      artist: draft.artist.trim(),
      note: draft.note.trim()
    };

    setBusyKey(`song-save-${row.id}`);
    setErrorMessage('');

    try {
      const updated = await adminRequest(`/api/admin/song-requests/${row.id}`, authToken, {
        method: 'PATCH',
        body: payload
      });

      setSongs((previous) => previous.map((item) => (item.id === row.id ? updated : item)));
      setSongDrafts((previous) => ({
        ...previous,
        [row.id]: buildSongDraft(updated)
      }));
      setStatusMessage(`Sugerencia #${row.id} actualizada.`);
    } catch (error) {
      setErrorMessage(error.message || 'No se pudo guardar la sugerencia.');
    } finally {
      setBusyKey('');
    }
  };

  const handleDeleteSong = async (row) => {
    if (!capabilities.canDeleteSongs) {
      setErrorMessage('Tu token no tiene permiso para eliminar canciones.');
      return;
    }

    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(`Eliminar sugerencia de ${row.guestName}?`);
      if (!confirmed) {
        return;
      }
    }

    setBusyKey(`song-delete-${row.id}`);
    setErrorMessage('');

    try {
      await adminRequest(`/api/admin/song-requests/${row.id}`, authToken, {
        method: 'DELETE'
      });

      setSongs((previous) => previous.filter((item) => item.id !== row.id));
      setSongDrafts((previous) => {
        const next = { ...previous };
        delete next[row.id];
        return next;
      });
      setStatusMessage(`Sugerencia #${row.id} eliminada.`);
    } catch (error) {
      setErrorMessage(error.message || 'No se pudo eliminar la sugerencia.');
    } finally {
      setBusyKey('');
    }
  };

  return (
    <main className="admin-panel">
      <div className="admin-panel-container">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">Panel admin</p>
            <h1 className="admin-title">Gestion de RSVP y canciones</h1>
            <p className="admin-subtitle">
              Vista simple para administrar respuestas y playlist desde el frontend.
            </p>
          </div>
          <a className="admin-home-link" href="/">
            Volver a la landing
          </a>
        </header>

        <form className="admin-token-form" onSubmit={handleConnect}>
          <label className="admin-token-label" htmlFor="admin-token-input">
            Token admin (header x-admin-token)
            <input
              id="admin-token-input"
              className="admin-token-input"
              name="adminToken"
              type="password"
              autoComplete="off"
              value={tokenInput}
              onChange={(event) => setTokenInput(event.target.value)}
              placeholder="Ingresa tu token"
              required
            />
          </label>

          <div className="admin-token-actions">
            <button className="admin-btn primary" type="submit" disabled={isLoading}>
              {authToken ? 'Actualizar token' : 'Conectar'}
            </button>
            <button
              className="admin-btn ghost"
              type="button"
              disabled={!authToken || isLoading}
              onClick={() => void fetchDashboard(authToken)}
            >
              Refrescar datos
            </button>
            <button
              className="admin-btn ghost"
              type="button"
              disabled={!authToken || isLoading}
              onClick={handleClearSession}
            >
              Cerrar sesion
            </button>
          </div>
        </form>

        {errorMessage && <p className="admin-alert error">{errorMessage}</p>}
        {statusMessage && !errorMessage && <p className="admin-alert success">{statusMessage}</p>}

        <section className="admin-capabilities" aria-label="Funciones habilitadas por token">
          <div className="admin-capabilities-head">
            <h2 className="admin-capabilities-title">Funciones habilitadas por token</h2>
            <span className={`admin-role-pill ${capabilities.role}`}>
              {capabilities.role === 'full'
                ? 'Full Access'
                : capabilities.role === 'readonly'
                  ? 'Read Only'
                  : 'Sin validar'}
            </span>
          </div>
          <p className="admin-capabilities-subtitle">{roleDescription}</p>

          <div className="admin-capabilities-grid">
            {CAPABILITY_ITEMS.map((item) => {
              const enabled = Boolean(capabilities[item.key]);
              return (
                <article
                  key={item.key}
                  className={`admin-capability-item ${enabled ? 'enabled' : 'disabled'}`}
                >
                  <div>
                    <h3>{item.label}</h3>
                    <p>{item.description}</p>
                  </div>
                  <span>{enabled ? 'Habilitado' : 'Bloqueado'}</span>
                </article>
              );
            })}
          </div>
        </section>

        {hasReadAccess && (
          <>
            <section className="admin-stats-grid" aria-label="Resumen del panel admin">
              <article className="admin-stat-card">
                <span className="admin-stat-label">RSVP totales</span>
                <strong className="admin-stat-value">{totals.rsvps}</strong>
              </article>
              <article className="admin-stat-card">
                <span className="admin-stat-label">Confirmados</span>
                <strong className="admin-stat-value">{totals.confirmedCount}</strong>
              </article>
              <article className="admin-stat-card">
                <span className="admin-stat-label">Invitados estimados</span>
                <strong className="admin-stat-value">{totals.estimatedGuests}</strong>
              </article>
              <article className="admin-stat-card">
                <span className="admin-stat-label">Canciones sugeridas</span>
                <strong className="admin-stat-value">{totals.songs}</strong>
              </article>
            </section>

            <nav className="admin-tabs" aria-label="Secciones de administracion">
              {canShowRsvpTab && (
                <button
                  className={`admin-tab ${activeTab === 'rsvps' ? 'active' : ''}`}
                  type="button"
                  onClick={() => setActiveTab('rsvps')}
                >
                  RSVPs
                </button>
              )}

              {canShowSongTab && (
                <button
                  className={`admin-tab ${activeTab === 'songs' ? 'active' : ''}`}
                  type="button"
                  onClick={() => setActiveTab('songs')}
                >
                  Song Requests
                </button>
              )}
            </nav>
          </>
        )}

        {isLoading && <p className="admin-loading">Cargando informacion...</p>}

        {!isLoading && authToken && !hasReadAccess && (
          <p className="admin-empty">Este token no tiene permisos de lectura para cargar datos.</p>
        )}

        {!isLoading && canShowRsvpTab && activeTab === 'rsvps' && (
          <section className="admin-list" aria-label="Listado de RSVPs">
            {rsvps.length === 0 && <p className="admin-empty">No hay RSVPs para mostrar.</p>}
            {rsvps.map((row) => {
              const draft = rsvpDrafts[row.id] || buildRsvpDraft(row);
              const guestNamesText =
                Array.isArray(row.guestNames) && row.guestNames.length > 0
                  ? row.guestNames.join(', ')
                  : 'Sin acompanantes';
              const isSaving = busyKey === `rsvp-save-${row.id}`;
              const isDeleting = busyKey === `rsvp-delete-${row.id}`;

              return (
                <article className="admin-record-card" key={row.id}>
                  <header className="admin-record-header">
                    <h3>{row.fullName}</h3>
                    <span className="admin-record-id">#{row.id}</span>
                  </header>

                  <p className="admin-record-meta">Referencia: {row.reference || 'Sin referencia'}</p>
                  <p className="admin-record-meta">Email: {row.email || 'Sin email'}</p>
                  <p className="admin-record-meta">Creado: {formatDateTime(row.createdAt)}</p>
                  <p className="admin-record-meta">Acompanantes: {guestNamesText}</p>

                  <div className="admin-fields-grid">
                    <label className="admin-field">
                      Asistencia
                      <select
                        value={draft.attending}
                        disabled={!capabilities.canEditRsvps || isSaving || isDeleting}
                        onChange={(event) =>
                          updateRsvpDraft(row.id, 'attending', event.target.value, row)
                        }
                      >
                        <option value="si">Si</option>
                        <option value="no">No</option>
                      </select>
                    </label>

                    <label className="admin-field">
                      Acompanantes
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={draft.guests}
                        disabled={!capabilities.canEditRsvps || isSaving || isDeleting}
                        onChange={(event) =>
                          updateRsvpDraft(row.id, 'guests', event.target.value, row)
                        }
                      />
                    </label>

                    <label className="admin-field admin-field-full">
                      Restricciones alimentarias
                      <textarea
                        rows="2"
                        value={draft.dietaryRestrictions}
                        disabled={!capabilities.canEditRsvps || isSaving || isDeleting}
                        onChange={(event) =>
                          updateRsvpDraft(row.id, 'dietaryRestrictions', event.target.value, row)
                        }
                      />
                    </label>

                    <label className="admin-field admin-field-full">
                      Nota interna
                      <textarea
                        rows="2"
                        value={draft.note}
                        disabled={!capabilities.canEditRsvps || isSaving || isDeleting}
                        onChange={(event) => updateRsvpDraft(row.id, 'note', event.target.value, row)}
                      />
                    </label>
                  </div>

                  <div className="admin-actions">
                    {capabilities.canEditRsvps && (
                      <button
                        className="admin-btn primary"
                        type="button"
                        onClick={() => void handleSaveRsvp(row)}
                        disabled={isSaving || isDeleting}
                      >
                        {isSaving ? 'Guardando...' : 'Guardar'}
                      </button>
                    )}

                    {capabilities.canDeleteRsvps && (
                      <button
                        className="admin-btn danger"
                        type="button"
                        onClick={() => void handleDeleteRsvp(row)}
                        disabled={isSaving || isDeleting}
                      >
                        {isDeleting ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    )}

                    {!capabilities.canEditRsvps && !capabilities.canDeleteRsvps && (
                      <p className="admin-readonly-note">Token en modo lectura para RSVPs.</p>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {!isLoading && canShowSongTab && activeTab === 'songs' && (
          <section className="admin-list" aria-label="Listado de canciones sugeridas">
            {songs.length === 0 && <p className="admin-empty">No hay canciones sugeridas para mostrar.</p>}
            {songs.map((row) => {
              const draft = songDrafts[row.id] || buildSongDraft(row);
              const isSaving = busyKey === `song-save-${row.id}`;
              const isDeleting = busyKey === `song-delete-${row.id}`;

              return (
                <article className="admin-record-card" key={row.id}>
                  <header className="admin-record-header">
                    <h3>{row.songTitle}</h3>
                    <span className="admin-record-id">#{row.id}</span>
                  </header>

                  <p className="admin-record-meta">Invitado: {row.guestName}</p>
                  <p className="admin-record-meta">Artista actual: {row.artist || 'No informado'}</p>
                  <p className="admin-record-meta">Creado: {formatDateTime(row.createdAt)}</p>

                  <div className="admin-fields-grid">
                    <label className="admin-field admin-field-full">
                      Nombre invitado
                      <input
                        type="text"
                        value={draft.guestName}
                        disabled={!capabilities.canEditSongs || isSaving || isDeleting}
                        onChange={(event) =>
                          updateSongDraft(row.id, 'guestName', event.target.value, row)
                        }
                      />
                    </label>

                    <label className="admin-field admin-field-full">
                      Cancion
                      <input
                        type="text"
                        value={draft.songTitle}
                        disabled={!capabilities.canEditSongs || isSaving || isDeleting}
                        onChange={(event) =>
                          updateSongDraft(row.id, 'songTitle', event.target.value, row)
                        }
                      />
                    </label>

                    <label className="admin-field admin-field-full">
                      Artista
                      <input
                        type="text"
                        value={draft.artist}
                        disabled={!capabilities.canEditSongs || isSaving || isDeleting}
                        onChange={(event) => updateSongDraft(row.id, 'artist', event.target.value, row)}
                      />
                    </label>

                    <label className="admin-field admin-field-full">
                      Nota
                      <textarea
                        rows="2"
                        value={draft.note}
                        disabled={!capabilities.canEditSongs || isSaving || isDeleting}
                        onChange={(event) => updateSongDraft(row.id, 'note', event.target.value, row)}
                      />
                    </label>
                  </div>

                  <div className="admin-actions">
                    {capabilities.canEditSongs && (
                      <button
                        className="admin-btn primary"
                        type="button"
                        onClick={() => void handleSaveSong(row)}
                        disabled={isSaving || isDeleting}
                      >
                        {isSaving ? 'Guardando...' : 'Guardar'}
                      </button>
                    )}

                    {capabilities.canDeleteSongs && (
                      <button
                        className="admin-btn danger"
                        type="button"
                        onClick={() => void handleDeleteSong(row)}
                        disabled={isSaving || isDeleting}
                      >
                        {isDeleting ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    )}

                    {!capabilities.canEditSongs && !capabilities.canDeleteSongs && (
                      <p className="admin-readonly-note">Token en modo lectura para canciones.</p>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
