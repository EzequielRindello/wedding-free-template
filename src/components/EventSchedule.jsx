import { FaCalendarPlus, FaMapMarkerAlt } from 'react-icons/fa';
import siteData from '../content/siteData';
import { buildGoogleCalendarUrl } from '../utils/calendarLinks';
import { isConfiguredExternalUrl, openExternalUrl } from '../utils/externalLinks';
import { trackEvent } from '../utils/analytics';

const formatDateTime = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString('es-AR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const buildScheduleCalendarEvent = (event, coupleNames) => {
  const start = new Date(event.dateTime);
  if (Number.isNaN(start.getTime())) {
    return null;
  }

  const end = new Date(start.getTime() + 90 * 60 * 1000);

  return {
    title: `${event.type} - ${coupleNames}`,
    startDateTime: start.toISOString(),
    endDateTime: end.toISOString(),
    location: [event.venue, event.address].filter(Boolean).join(', '),
    description: `Agenda de ${event.type.toLowerCase()} del casamiento.`
  };
};

const EventSchedule = () => {
  const { eventSchedule, couple } = siteData;
  const events = Array.isArray(eventSchedule?.events) ? eventSchedule.events : [];

  if (events.length === 0) {
    return null;
  }

  const handleMapClick = (event) => {
    trackEvent('schedule_map_click', {
      section: 'event_schedule',
      eventType: event.type
    });
    openExternalUrl(event.mapUrl);
  };

  const handleCalendarClick = (event, calendarUrl) => {
    trackEvent('calendar_click', {
      section: 'event_schedule',
      provider: 'google_calendar',
      eventType: event.type
    });
    openExternalUrl(calendarUrl);
  };

  return (
    <section className="schedule-section" id={eventSchedule.sectionId || 'event-schedule'}>
      <h2 className="section-title">{eventSchedule.title}</h2>
      {eventSchedule.intro && <p className="section-text">{eventSchedule.intro}</p>}

      <div className="schedule-grid">
        {events.map((event) => {
          const mapConfigured = isConfiguredExternalUrl(event.mapUrl);
          const calendarEvent = buildScheduleCalendarEvent(event, couple.names);
          const calendarUrl = buildGoogleCalendarUrl(calendarEvent);
          const hasCalendar = isConfiguredExternalUrl(calendarUrl);

          return (
            <article className="schedule-card" key={event.id || `${event.type}-${event.dateTime}`}>
              <p className="schedule-card-type">{event.type}</p>
              <h3>{formatDateTime(event.dateTime)}</h3>
              <p className="schedule-card-location">{event.venue}</p>
              <p className="schedule-card-address">{event.address}</p>

              <div className="schedule-card-actions">
                <button
                  className="cta-btn"
                  type="button"
                  disabled={!mapConfigured}
                  aria-disabled={!mapConfigured}
                  onClick={() => handleMapClick(event)}
                >
                  <FaMapMarkerAlt /> Mapa
                </button>

                <button
                  className="cta-btn"
                  type="button"
                  disabled={!hasCalendar}
                  aria-disabled={!hasCalendar}
                  onClick={() => handleCalendarClick(event, calendarUrl)}
                >
                  <FaCalendarPlus /> Calendario
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default EventSchedule;
