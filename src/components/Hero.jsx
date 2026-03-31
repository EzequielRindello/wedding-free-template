import { FaChevronDown } from 'react-icons/fa';
import siteData from '../content/siteData';
import { trackEvent } from '../utils/analytics';

const Hero = () => {
  const { names, heroSubtitle, heroPrimaryCtaLabel, heroSecondaryCtaLabel } = siteData.couple;

  const handlePrimaryClick = () => {
    trackEvent('cta_rsvp_click', {
      section: 'hero',
      ctaType: 'primary'
    });
  };

  const handleSecondaryClick = () => {
    trackEvent('cta_location_click', {
      section: 'hero',
      ctaType: 'secondary'
    });
  };

  return (
    <section className="hero" id="home">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">{names}</h1>
        <h2 className="hero-subtitle">{heroSubtitle}</h2>
        <div className="hero-actions">
          <a className="cta-btn primary" href="#rsvp" onClick={handlePrimaryClick}>
            {heroPrimaryCtaLabel}
          </a>
          <a className="cta-btn" href="#ceremony" onClick={handleSecondaryClick}>
            {heroSecondaryCtaLabel}
          </a>
        </div>
      </div>
      <div className="hero-scroll-hint">
        <FaChevronDown className="bounce" />
      </div>
    </section>
  );
};

export default Hero;