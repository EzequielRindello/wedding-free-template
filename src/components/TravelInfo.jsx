import { FaHotel, FaRoute, FaExternalLinkAlt } from 'react-icons/fa';
import siteData from '../content/siteData';
import { isConfiguredExternalUrl, openExternalUrl } from '../utils/externalLinks';
import { trackEvent } from '../utils/analytics';

const TravelInfo = () => {
  const { travel } = siteData;
  const hasHotels = Array.isArray(travel?.hotels) && travel.hotels.length > 0;
  const hasTransport = Array.isArray(travel?.transport) && travel.transport.length > 0;

  if (!travel || (!hasHotels && !hasTransport)) {
    return null;
  }

  const handleExternalClick = (kind, label, url) => {
    trackEvent('travel_link_click', {
      section: 'travel',
      kind,
      label
    });
    openExternalUrl(url);
  };

  return (
    <section className="travel-section" id={travel.sectionId || 'travel'}>
      <h2 className="section-title">{travel.title}</h2>
      <p className="section-text">{travel.subtitle}</p>

      {hasHotels && (
        <div className="travel-group">
          <h3 className="travel-group-title">
            <FaHotel aria-hidden="true" /> Hospedaje sugerido
          </h3>
          <div className="travel-grid">
            {travel.hotels.map((hotel) => {
              const isConfigured = isConfiguredExternalUrl(hotel.bookingUrl);

              return (
                <article className="travel-card" key={hotel.name}>
                  <h4>{hotel.name}</h4>
                  <p>{hotel.distance}</p>
                  {isConfigured ? (
                    <button
                      type="button"
                      className="cta-btn"
                      onClick={() => handleExternalClick('hotel', hotel.name, hotel.bookingUrl)}
                    >
                      <FaExternalLinkAlt /> Ver disponibilidad
                    </button>
                  ) : (
                    <p className="link-helper">Link de reserva no configurado.</p>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      )}

      {hasTransport && (
        <div className="travel-group">
          <h3 className="travel-group-title">
            <FaRoute aria-hidden="true" /> Traslados
          </h3>
          <div className="travel-grid">
            {travel.transport.map((option) => {
              const canOpenContact = isConfiguredExternalUrl(option.contactUrl);

              return (
                <article className="travel-card" key={option.title}>
                  <h4>{option.title}</h4>
                  <p>{option.detail}</p>
                  {canOpenContact && (
                    <button
                      type="button"
                      className="cta-btn"
                      onClick={() => handleExternalClick('transport', option.title, option.contactUrl)}
                    >
                      <FaExternalLinkAlt /> {option.contactLabel || 'Contactar'}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      )}

      {travel.notes && <p className="travel-note">{travel.notes}</p>}
    </section>
  );
};

export default TravelInfo;
