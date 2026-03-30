import { useRef, useState } from 'react';
import siteData from '../content/siteData';
import { isConfiguredExternalUrl } from '../utils/externalLinks';
import { trackEvent } from '../utils/analytics';

const initialState = {
  fullName: '',
  email: '',
  attending: 'si',
  guests: '1',
  note: ''
};

const RsvpForm = () => {
  const { rsvp } = siteData;
  const [formData, setFormData] = useState(initialState);
  const [submitState, setSubmitState] = useState('idle');
  const hasStartedRef = useRef(false);

  const hasWebhook = isConfiguredExternalUrl(rsvp.webhookUrl);

  const handleFormStart = () => {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;
    trackEvent('rsvp_start', {
      source: 'embedded_form'
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'attending' && value === 'no') {
      setFormData((previous) => ({
        ...previous,
        attending: value,
        guests: '0'
      }));
      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitState('submitting');
    trackEvent('rsvp_submit_attempt', {
      source: 'embedded_form',
      attending: formData.attending,
      guests: Number(formData.guests) || 0
    });

    try {
      if (hasWebhook) {
        const response = await fetch(rsvp.webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...formData,
            source: 'wedding-landing-page',
            submittedAt: new Date().toISOString()
          })
        });

        if (!response.ok) {
          throw new Error('No se pudo enviar el formulario');
        }
      }

      setSubmitState('success');
      setFormData(initialState);
      trackEvent('rsvp_submit_success', {
        source: 'embedded_form',
        mode: hasWebhook ? 'webhook' : 'local-demo'
      });
    } catch (error) {
      console.error('Error al enviar RSVP:', error);
      setSubmitState('error');
      trackEvent('rsvp_submit_error', {
        source: 'embedded_form',
        mode: hasWebhook ? 'webhook' : 'local-demo'
      });
    }
  };

  if (submitState === 'success') {
    return (
      <div className="rsvp-success" role="status">
        <h4>{rsvp.successTitle}</h4>
        <p>{rsvp.successMessage}</p>
      </div>
    );
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit} onFocusCapture={handleFormStart}>
      <div className="rsvp-form-grid">
        <label className="rsvp-field" htmlFor="rsvp-full-name">
          Nombre y apellido
          <input
            id="rsvp-full-name"
            name="fullName"
            type="text"
            required
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Ej: Ana Perez"
          />
        </label>

        <label className="rsvp-field" htmlFor="rsvp-email">
          Email
          <input
            id="rsvp-email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="ana@email.com"
          />
        </label>
      </div>

      <fieldset className="rsvp-fieldset">
        <legend>Vas a asistir?</legend>
        <label>
          <input
            type="radio"
            name="attending"
            value="si"
            checked={formData.attending === 'si'}
            onChange={handleChange}
          />
          Si, voy
        </label>
        <label>
          <input
            type="radio"
            name="attending"
            value="no"
            checked={formData.attending === 'no'}
            onChange={handleChange}
          />
          No voy a poder asistir
        </label>
      </fieldset>

      <label className="rsvp-field" htmlFor="rsvp-guests">
        Cantidad de personas
        <input
          id="rsvp-guests"
          name="guests"
          type="number"
          min="0"
          max="8"
          value={formData.guests}
          onChange={handleChange}
          disabled={formData.attending === 'no'}
        />
      </label>

      <label className="rsvp-field" htmlFor="rsvp-note">
        Comentarios (opcional)
        <textarea
          id="rsvp-note"
          name="note"
          rows="4"
          value={formData.note}
          onChange={handleChange}
          placeholder="Alergias, menu especial, dudas..."
        />
      </label>

      <button className="cta-btn primary" type="submit" disabled={submitState === 'submitting'}>
        {submitState === 'submitting' ? rsvp.submittingLabel : rsvp.submitLabel}
      </button>

      {!hasWebhook && <p className="link-helper">{rsvp.localModeText}</p>}
      {submitState === 'error' && <p className="link-helper">{rsvp.errorMessage}</p>}
    </form>
  );
};

export default RsvpForm;
