import siteData from '../content/siteData';
import { isConfiguredExternalUrl, openExternalUrl } from '../utils/externalLinks';
import RsvpForm from './RsvpForm';
import { trackEvent } from '../utils/analytics';

const Rsvp = () => {
  const { rsvp } = siteData;
  const isRsvpConfigured = isConfiguredExternalUrl(rsvp.formUrl);

  const handleRsvpClick = () => {
    trackEvent('cta_rsvp_click', {
      section: 'rsvp',
      ctaType: 'external_form'
    });
    openExternalUrl(rsvp.formUrl);
  };

  return (
    <section className="rsvp-section" id={rsvp.sectionId}>
      <h2 className="section-title">{rsvp.title}</h2>
      <h3 className="rsvp-subtitle">{rsvp.subtitle}</h3>
      <p className="section-text">
        {rsvp.description}
        <br />
        {rsvp.supportText}
      </p>
      <p className="rsvp-deadline">{rsvp.deadlineText}</p>
      <RsvpForm />
      {isRsvpConfigured ? (
        <button className="cta-btn rsvp-secondary-btn" onClick={handleRsvpClick} type="button">
          {rsvp.externalCtaLabel}
        </button>
      ) : (
        <p className="link-helper">{rsvp.formUnavailableText}</p>
      )}
    </section>
  );
};

export default Rsvp;