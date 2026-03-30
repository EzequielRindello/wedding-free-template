import { FaShieldAlt, FaUsers, FaWhatsapp } from 'react-icons/fa';
import siteData from '../content/siteData';
import { isConfiguredExternalUrl, openExternalUrl } from '../utils/externalLinks';
import { trackEvent } from '../utils/analytics';

const TrustSignals = () => {
  const { trust } = siteData;
  const targetGuests = Math.max(Number(trust.targetGuests) || 0, 1);
  const confirmedGuests = Math.max(Number(trust.confirmedGuests) || 0, 0);
  const progress = Math.min(100, Math.round((confirmedGuests / targetGuests) * 100));
  const hasSupportWhatsapp = isConfiguredExternalUrl(trust.supportWhatsappUrl);

  const handleSupportClick = () => {
    trackEvent('support_whatsapp_click', {
      source: 'trust_section'
    });
    openExternalUrl(trust.supportWhatsappUrl);
  };

  return (
    <section className="trust-section" id={trust.sectionId}>
      <h2 className="section-title">{trust.title}</h2>

      <div className="trust-grid">
        <article className="trust-card">
          <h3>
            <FaShieldAlt aria-hidden="true" /> {trust.storyTitle}
          </h3>
          <p>{trust.storyText}</p>
          <p className="trust-note">{trust.authenticityNote}</p>
        </article>

        <article className="trust-card">
          <h3>
            <FaUsers aria-hidden="true" /> {trust.hostsTitle}
          </h3>
          <ul className="trust-host-list">
            {trust.hosts.map((host) => (
              <li key={host}>{host}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="rsvp-progress-card">
        <p className="rsvp-progress-label">{trust.rsvpProgressLabel}</p>
        <p className="rsvp-progress-value">{confirmedGuests} / {targetGuests}</p>
        <div className="rsvp-progress-track" aria-label="Progreso de confirmados">
          <div className="rsvp-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {hasSupportWhatsapp ? (
        <button className="cta-btn" type="button" onClick={handleSupportClick}>
          <FaWhatsapp /> {trust.supportCtaLabel}
        </button>
      ) : (
        <p className="link-helper">{trust.supportFallbackText}</p>
      )}
    </section>
  );
};

export default TrustSignals;
