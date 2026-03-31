import { FaCalendarPlus, FaCheckCircle } from 'react-icons/fa';

const formatSubmissionDate = (value) => {
  if (!value) {
    return '';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toLocaleString('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
};

const RsvpConfirmation = ({
  rsvp,
  reference,
  submittedAt,
  calendarUrl,
  onReset,
  onCalendarClick
}) => {
  const formattedDate = formatSubmissionDate(submittedAt);

  return (
    <div className="rsvp-success" role="status" aria-live="polite">
      <h4>
        <FaCheckCircle aria-hidden="true" /> {rsvp.successTitle}
      </h4>
      <p>{rsvp.successMessage}</p>

      {reference && (
        <p className="rsvp-reference">
          <strong>Referencia:</strong> {reference}
        </p>
      )}

      {formattedDate && (
        <p className="rsvp-reference">
          <strong>Enviado:</strong> {formattedDate}
        </p>
      )}

      <div className="rsvp-next-steps">
        <h5>{rsvp.confirmation?.nextStepsTitle || 'Proximos pasos'}</h5>
        <p>{rsvp.confirmation?.nextStepsMessage || rsvp.supportText}</p>
      </div>

      <div className="rsvp-confirmation-actions">
        {calendarUrl && (
          <a
            className="cta-btn"
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onCalendarClick}
          >
            <FaCalendarPlus /> {rsvp.confirmation?.calendarCtaLabel || 'Agregar fecha al calendario'}
          </a>
        )}

        <button className="cta-btn" type="button" onClick={onReset}>
          {rsvp.confirmation?.resetLabel || 'Enviar otra respuesta'}
        </button>
      </div>
    </div>
  );
};

export default RsvpConfirmation;
