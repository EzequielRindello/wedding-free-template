import { useState } from 'react';
import { FaMusic } from 'react-icons/fa';
import siteData from '../content/siteData';
import { isConfiguredExternalUrl, openExternalUrl } from '../utils/externalLinks';
import { trackEvent } from '../utils/analytics';

const initialState = {
  guestName: '',
  songTitle: '',
  artist: '',
  note: ''
};

const isConfiguredApiTarget = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  const normalized = value.trim();
  if (!normalized) {
    return false;
  }

  if (normalized.startsWith('/')) {
    return true;
  }

  try {
    const parsed = new URL(normalized);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const SongRequest = () => {
  const { songRequest } = siteData;
  const [formData, setFormData] = useState(initialState);
  const [submitState, setSubmitState] = useState('idle');
  const isSongFormConfigured = isConfiguredExternalUrl(songRequest.formUrl);
  const hasApi = isConfiguredApiTarget(songRequest.apiUrl);

  const handleFormClick = () => {
    trackEvent('song_request_external_click', {
      section: 'song_request'
    });
    openExternalUrl(songRequest.formUrl);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!hasApi) {
      return;
    }

    setSubmitState('submitting');
    trackEvent('song_request_submit_attempt', {
      section: 'song_request'
    });

    try {
      const response = await fetch(songRequest.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          source: 'wedding-landing-page'
        })
      });

      if (!response.ok) {
        throw new Error('Error al guardar sugerencia');
      }

      setSubmitState('success');
      setFormData(initialState);
      trackEvent('song_request_submit_success', {
        section: 'song_request'
      });
    } catch (error) {
      console.error('Error al enviar sugerencia:', error);
      setSubmitState('error');
      trackEvent('song_request_submit_error', {
        section: 'song_request'
      });
    }
  };

  return (
    <section className="song-request-section">
      <FaMusic className="song-icon" />
      <h2 className="section-title">{songRequest.title}</h2>
      <p className="section-text">{songRequest.description}</p>

      {hasApi ? (
        <form className="song-request-form" onSubmit={handleSubmit}>
          <label className="rsvp-field" htmlFor="song-guest-name">
            {songRequest.fields?.guestNameLabel || 'Tu nombre'}
            <input
              id="song-guest-name"
              name="guestName"
              type="text"
              required
              value={formData.guestName}
              onChange={handleChange}
            />
          </label>

          <label className="rsvp-field" htmlFor="song-title">
            {songRequest.fields?.songTitleLabel || 'Cancion'}
            <input
              id="song-title"
              name="songTitle"
              type="text"
              required
              value={formData.songTitle}
              onChange={handleChange}
            />
          </label>

          <label className="rsvp-field" htmlFor="song-artist">
            {songRequest.fields?.artistLabel || 'Artista'}
            <input
              id="song-artist"
              name="artist"
              type="text"
              value={formData.artist}
              onChange={handleChange}
            />
          </label>

          <label className="rsvp-field" htmlFor="song-note">
            {songRequest.fields?.noteLabel || 'Comentario (opcional)'}
            <textarea
              id="song-note"
              name="note"
              rows="3"
              value={formData.note}
              onChange={handleChange}
            />
          </label>

          <button className="cta-btn primary" type="submit" disabled={submitState === 'submitting'}>
            {submitState === 'submitting' ? songRequest.submittingLabel || 'Enviando...' : songRequest.submitLabel || songRequest.ctaLabel}
          </button>

          {submitState === 'success' && <p className="link-helper">{songRequest.successMessage}</p>}
          {submitState === 'error' && <p className="link-helper rsvp-error-message">{songRequest.errorMessage}</p>}
        </form>
      ) : (
        <button
          className="cta-btn"
          onClick={handleFormClick}
          type="button"
          disabled={!isSongFormConfigured}
          aria-disabled={!isSongFormConfigured}
        >
          {songRequest.ctaLabel}
        </button>
      )}

      {hasApi && isSongFormConfigured && (
        <button className="cta-btn song-request-fallback-btn" onClick={handleFormClick} type="button">
          {songRequest.ctaLabel}
        </button>
      )}

      {!hasApi && !isSongFormConfigured && <p className="link-helper">{songRequest.formUnavailableText}</p>}
    </section>
  );
};

export default SongRequest;
