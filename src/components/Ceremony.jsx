import { FaCalendarPlus, FaDownload, FaMapMarkerAlt, FaRoute } from 'react-icons/fa';
import siteData from '../content/siteData';
import { isConfiguredExternalUrl, openExternalUrl } from '../utils/externalLinks';
import { buildGoogleCalendarUrl, buildIcsDataUri } from '../utils/calendarLinks';
import { trackEvent } from '../utils/analytics';

const Ceremony = () => {
  const { ceremony } = siteData;
  const isMapConfigured = isConfiguredExternalUrl(ceremony.mapUrl);
  const isWazeConfigured = isConfiguredExternalUrl(ceremony.wazeUrl);
  const googleCalendarUrl = buildGoogleCalendarUrl(ceremony.calendarEvent);
  const icsDataUri = buildIcsDataUri(ceremony.calendarEvent);
  const isCalendarConfigured = isConfiguredExternalUrl(googleCalendarUrl);
  const hasIcsFile = Boolean(icsDataUri);

  const handleMapClick = () => {
    trackEvent('map_click', {
      provider: 'google_maps',
      source: 'ceremony_section'
    });
    openExternalUrl(ceremony.mapUrl);
  };

  const handleWazeClick = () => {
    trackEvent('map_click', {
      provider: 'waze',
      source: 'ceremony_section'
    });
    openExternalUrl(ceremony.wazeUrl);
  };

  const handleCalendarClick = () => {
    trackEvent('calendar_click', {
      provider: 'google_calendar',
      source: 'ceremony_section'
    });
    openExternalUrl(googleCalendarUrl);
  };

  const handleIcsDownload = () => {
    trackEvent('calendar_click', {
      provider: 'ics_file',
      source: 'ceremony_section'
    });
  };

  return (
    <section className="ceremony-section" id={ceremony.sectionId}>
      <h2 className="section-title">{ceremony.title}</h2>
      <div className="ceremony-content">
        <FaMapMarkerAlt className="ceremony-icon" />
        <p className="ceremony-address">
          {ceremony.venueName}
          <br />
          {ceremony.addressLines.map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </p>
        <div className="ceremony-actions">
          <button
            className="cta-btn"
            onClick={handleMapClick}
            type="button"
            disabled={!isMapConfigured}
            aria-disabled={!isMapConfigured}
          >
            <FaMapMarkerAlt /> {ceremony.mapCta}
          </button>
          <button
            className="cta-btn"
            onClick={handleWazeClick}
            type="button"
            disabled={!isWazeConfigured}
            aria-disabled={!isWazeConfigured}
          >
            <FaRoute /> {ceremony.wazeCta}
          </button>
          <button
            className="cta-btn"
            onClick={handleCalendarClick}
            type="button"
            disabled={!isCalendarConfigured}
            aria-disabled={!isCalendarConfigured}
          >
            <FaCalendarPlus /> {ceremony.calendarCta}
          </button>
          {hasIcsFile ? (
            <a className="cta-btn" href={icsDataUri} download={ceremony.icsFileName} onClick={handleIcsDownload}>
              <FaDownload /> {ceremony.icsCta}
            </a>
          ) : (
            <button className="cta-btn" type="button" disabled aria-disabled="true">
              <FaDownload /> {ceremony.icsCta}
            </button>
          )}
        </div>
        {(!isMapConfigured || !isWazeConfigured) && <p className="link-helper">{ceremony.mapUnavailableText}</p>}
        {(!isCalendarConfigured || !hasIcsFile) && <p className="link-helper">{ceremony.calendarUnavailableText}</p>}
      </div>
      <br />
      <div className="events-timeline">
        {ceremony.timeline.map((event) => (
          <div className="event-item" key={`${event.time}-${event.name}`}>
            <p className="event-time">{event.time}</p>
            <p className="event-name">{event.name}</p>
          </div>
        ))}
      </div>
      <p className="schedule-note">
        <em>* {ceremony.note}</em>
      </p>
    </section>
  );
};
export default Ceremony;