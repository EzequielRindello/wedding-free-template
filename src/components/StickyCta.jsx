import { useEffect, useState } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import siteData from '../content/siteData';
import { trackEvent } from '../utils/analytics';

const StickyCta = () => {
  const { stickyCta } = siteData;
  const [isMobile, setIsMobile] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    const updateMedia = () => {
      const mobile = mobileQuery.matches;
      setIsMobile(mobile);
      if (!mobile) {
        setIsExpanded(false);
      }
    };

    updateMedia();
    if (mobileQuery.addEventListener) {
      mobileQuery.addEventListener('change', updateMedia);
    } else {
      mobileQuery.addListener(updateMedia);
    }

    return () => {
      if (mobileQuery.removeEventListener) {
        mobileQuery.removeEventListener('change', updateMedia);
      } else {
        mobileQuery.removeListener(updateMedia);
      }
    };
  }, []);

  useEffect(() => {
    const footerSection = document.querySelector('.social-section');
    if (!footerSection || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setIsExpanded(false);
        }
      },
      {
        threshold: 0.2
      }
    );

    observer.observe(footerSection);
    return () => observer.disconnect();
  }, []);

  const handlePrimaryClick = () => {
    trackEvent('cta_rsvp_click', {
      section: 'sticky_cta',
      ctaType: 'primary'
    });
    setIsExpanded(false);
  };

  const handleSecondaryClick = () => {
    trackEvent('cta_location_click', {
      section: 'sticky_cta',
      ctaType: 'secondary'
    });
    setIsExpanded(false);
  };

  if (isFooterVisible) {
    return null;
  }

  if (isMobile) {
    return (
      <div className="sticky-cta-mobile" role="region" aria-label="Accesos rapidos">
        {isExpanded && (
          <div className="sticky-cta-popover" id="sticky-cta-actions">
            <a className="sticky-cta-mobile-action" href="#rsvp" onClick={handlePrimaryClick}>
              {stickyCta.primaryLabel}
            </a>
            <a className="sticky-cta-mobile-action" href="#ceremony" onClick={handleSecondaryClick}>
              {stickyCta.secondaryLabel}
            </a>
          </div>
        )}
        <button
          type="button"
          className="sticky-cta-fab"
          onClick={() => setIsExpanded((previous) => !previous)}
          aria-label={isExpanded ? 'Ocultar accesos rapidos' : 'Mostrar accesos rapidos'}
          aria-expanded={isExpanded}
          aria-controls="sticky-cta-actions"
        >
          <FaMapMarkerAlt />
        </button>
      </div>
    );
  }

  return (
    <div className="sticky-cta" role="region" aria-label="Accesos rapidos">
      <a className="sticky-cta-primary" href="#rsvp" onClick={handlePrimaryClick}>
        {stickyCta.primaryLabel}
      </a>
      <a className="sticky-cta-secondary" href="#ceremony" onClick={handleSecondaryClick}>
        {stickyCta.secondaryLabel}
      </a>
    </div>
  );
};

export default StickyCta;
