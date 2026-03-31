import { useEffect, useRef, useState } from 'react';
import siteData from '../content/siteData';
import { buildGoogleCalendarUrl } from '../utils/calendarLinks';
import { trackEvent, trackFunnelStep } from '../utils/analytics';
import RsvpConfirmation from './RsvpConfirmation';

const STORAGE_KEY = 'wedding-rsvp-confirmation';

const initialState = {
  fullName: '',
  email: '',
  attending: 'si',
  guests: '1',
  note: '',
  dietaryRestrictions: '',
  guestNames: []
};

const parseGuestsCount = (value, maxGuests) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }

  const rounded = Math.round(numeric);
  return Math.max(0, Math.min(maxGuests, rounded));
};

const readStoredConfirmation = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue);
    if (!parsed?.reference) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const buildReferenceCode = (prefix) => {
  const normalizedPrefix = (prefix || 'RSVP').toUpperCase();
  const randomChunk = Math.random().toString(36).slice(2, 7).toUpperCase();
  const timeChunk = Date.now().toString(36).slice(-4).toUpperCase();
  return `${normalizedPrefix}-${timeChunk}${randomChunk}`;
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
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

const RsvpForm = () => {
  const { rsvp, ceremony } = siteData;
  const [formData, setFormData] = useState(initialState);
  const [submitState, setSubmitState] = useState('idle');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [confirmationData, setConfirmationData] = useState(() => readStoredConfirmation());
  const [isOnline, setIsOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));
  const hasStartedRef = useRef(false);
  const guestDetailsCompletedRef = useRef(false);

  const maxGuests = Math.max(1, Number(rsvp.formConfig?.maxGuestsPerInvite) || 8);
  const requireGuestNames = Boolean(rsvp.formConfig?.requireGuestNames);
  const requireDietaryInfo = Boolean(rsvp.formConfig?.requireDietaryInfo);
  const hasWebhook = isConfiguredApiTarget(rsvp.webhookUrl);
  const calendarUrl = buildGoogleCalendarUrl(ceremony.calendarEvent);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const markOnline = () => setIsOnline(true);
    const markOffline = () => setIsOnline(false);

    window.addEventListener('online', markOnline);
    window.addEventListener('offline', markOffline);

    return () => {
      window.removeEventListener('online', markOnline);
      window.removeEventListener('offline', markOffline);
    };
  }, []);

  const syncGuestNamesLength = (value, previousNames) => {
    const companionCount = Math.max(0, value - 1);
    const result = [...previousNames];

    if (result.length > companionCount) {
      return result.slice(0, companionCount);
    }

    while (result.length < companionCount) {
      result.push('');
    }

    return result;
  };

  const handleFormStart = () => {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;
    trackFunnelStep('rsvp_start', {
      section: 'rsvp',
      hasWebhook
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'attending' && value === 'no') {
      setFormData((previous) => ({
        ...previous,
        attending: value,
        guests: '0',
        guestNames: []
      }));
      return;
    }

    if (name === 'attending' && value === 'si') {
      setFormData((previous) => ({
        ...previous,
        attending: value,
        guests: previous.guests === '0' ? '1' : previous.guests,
        guestNames: syncGuestNamesLength(parseGuestsCount(previous.guests === '0' ? '1' : previous.guests, maxGuests), previous.guestNames)
      }));
      return;
    }

    if (name === 'guests') {
      const parsedGuests = parseGuestsCount(value, maxGuests);

      setFormData((previous) => ({
        ...previous,
        guests: String(parsedGuests),
        guestNames: syncGuestNamesLength(parsedGuests, previous.guestNames)
      }));

      return;
    }

    if (name.startsWith('guest-name-')) {
      const index = Number(name.replace('guest-name-', ''));

      setFormData((previous) => {
        const updatedNames = [...previous.guestNames];
        if (Number.isInteger(index) && index >= 0 && index < updatedNames.length) {
          updatedNames[index] = value;
        }

        const allGuestsCompleted = updatedNames.length > 0 && updatedNames.every((entry) => entry.trim().length > 0);
        if (requireGuestNames && allGuestsCompleted && !guestDetailsCompletedRef.current) {
          guestDetailsCompletedRef.current = true;
          trackEvent('rsvp_guest_details_completed', {
            section: 'rsvp',
            companions: updatedNames.length,
            hasWebhook
          });
        }

        if (!allGuestsCompleted) {
          guestDetailsCompletedRef.current = false;
        }

        return {
          ...previous,
          guestNames: updatedNames
        };
      });

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return 'Completá tu nombre y apellido.';
    }

    if (!formData.email.trim()) {
      return 'Completá tu email.';
    }

    if (formData.attending === 'si') {
      const guestsCount = parseGuestsCount(formData.guests, maxGuests);
      if (guestsCount < 1) {
        return 'Si asistis, la cantidad minima es 1 persona.';
      }

      if (guestsCount > maxGuests) {
        return `La cantidad maxima para esta invitacion es ${maxGuests}.`;
      }

      if (requireGuestNames && guestsCount > 1) {
        const missingCompanion = formData.guestNames.some((name) => !name.trim());
        if (missingCompanion) {
          return 'Completá los nombres de todos los acompañantes.';
        }
      }
    }

    if (requireDietaryInfo && !formData.dietaryRestrictions.trim()) {
      return 'Completá las restricciones alimentarias.';
    }

    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedbackMessage('');

    if (!isOnline) {
      setSubmitState('error');
      setFeedbackMessage(rsvp.offlineMessage || rsvp.errorMessage);
      trackFunnelStep('rsvp_submit_error', {
        section: 'rsvp',
        reason: 'offline',
        hasWebhook
      });
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      setSubmitState('error');
      setFeedbackMessage(validationError);
      trackEvent('rsvp_validation_error', {
        section: 'rsvp',
        hasWebhook
      });
      return;
    }

    setSubmitState('submitting');
    const normalizedGuests = formData.attending === 'no' ? 0 : parseGuestsCount(formData.guests, maxGuests);

    trackFunnelStep('rsvp_submit_attempt', {
      section: 'rsvp',
      attending: formData.attending,
      guests: normalizedGuests,
      hasWebhook
    });

    try {
      let responseReference = '';

      if (hasWebhook) {
        const response = await fetch(rsvp.webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...formData,
            guests: normalizedGuests,
            guestNames: formData.attending === 'si' ? formData.guestNames.map((value) => value.trim()).filter(Boolean) : [],
            source: 'wedding-landing-page',
            submittedAt: new Date().toISOString()
          })
        });

        if (!response.ok) {
          throw new Error('No se pudo enviar el formulario');
        }

        const responseContentType = response.headers.get('content-type') || '';
        if (responseContentType.includes('application/json')) {
          const responseData = await response.json();
          responseReference = responseData?.reference || responseData?.id || '';
        }
      }

      const reference = responseReference || buildReferenceCode(rsvp.confirmation?.referencePrefix);
      const storedConfirmation = {
        reference,
        submittedAt: new Date().toISOString(),
        attending: formData.attending,
        guests: normalizedGuests
      };

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedConfirmation));
      }
      setConfirmationData(storedConfirmation);
      setSubmitState('success');
      setFormData(initialState);

      trackFunnelStep('rsvp_submit_success', {
        section: 'rsvp',
        mode: hasWebhook ? 'webhook' : 'local-demo',
        hasWebhook
      });

      trackEvent('rsvp_confirmation_view', {
        section: 'rsvp',
        hasWebhook
      });
    } catch (error) {
      console.error('Error al enviar RSVP:', error);
      setSubmitState('error');
      setFeedbackMessage(rsvp.errorMessage);
      trackFunnelStep('rsvp_submit_error', {
        section: 'rsvp',
        mode: hasWebhook ? 'webhook' : 'local-demo',
        reason: 'request_failed',
        hasWebhook
      });
    }
  };

  const handleResetConfirmation = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setConfirmationData(null);
    setSubmitState('idle');
  };

  const handleCalendarClick = () => {
    trackEvent('calendar_click', {
      section: 'rsvp_confirmation',
      provider: 'google_calendar'
    });
  };

  if (confirmationData && submitState !== 'submitting') {
    return (
      <RsvpConfirmation
        rsvp={rsvp}
        reference={confirmationData.reference}
        submittedAt={confirmationData.submittedAt}
        calendarUrl={calendarUrl}
        onReset={handleResetConfirmation}
        onCalendarClick={handleCalendarClick}
      />
    );
  }

  const showGuestNames = formData.attending === 'si' && formData.guestNames.length > 0;

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
        Cantidad de personas (incluyendote)
        <input
          id="rsvp-guests"
          name="guests"
          type="number"
          min="0"
          max={maxGuests}
          value={formData.guests}
          onChange={handleChange}
          disabled={formData.attending === 'no'}
        />
        <span className="rsvp-field-help">Maximo permitido: {maxGuests}</span>
      </label>

      {showGuestNames && (
        <fieldset className="rsvp-fieldset">
          <legend>{rsvp.guestNamesLabel || 'Nombres de acompañantes'}</legend>
          {formData.guestNames.map((guestName, index) => (
            <label className="rsvp-field" htmlFor={`rsvp-guest-name-${index}`} key={`guest-name-${index}`}>
              Acompañante {index + 1}
              <input
                id={`rsvp-guest-name-${index}`}
                name={`guest-name-${index}`}
                type="text"
                value={guestName}
                onChange={handleChange}
                required={requireGuestNames}
                placeholder={rsvp.guestNamePlaceholder || 'Nombre y apellido del invitado'}
              />
            </label>
          ))}
        </fieldset>
      )}

      <label className="rsvp-field" htmlFor="rsvp-dietary">
        {rsvp.dietaryLabel || 'Restricciones alimentarias'}
        <input
          id="rsvp-dietary"
          name="dietaryRestrictions"
          type="text"
          value={formData.dietaryRestrictions}
          onChange={handleChange}
          required={requireDietaryInfo}
          placeholder={rsvp.dietaryPlaceholder || 'Ej: vegetariano, sin TACC'}
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
      {submitState === 'error' && <p className="link-helper rsvp-error-message">{feedbackMessage || rsvp.validationMessage || rsvp.errorMessage}</p>}
    </form>
  );
};

export default RsvpForm;
