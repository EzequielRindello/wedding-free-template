const EVENT_ALIASES = {
  hero_cta_click: 'cta_click',
  sticky_cta_click: 'cta_click'
};

const getDeviceType = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'unknown';
  }

  return window.matchMedia('(max-width: 768px)').matches ? 'mobile' : 'desktop';
};

const normalizeEventName = (eventName) => EVENT_ALIASES[eventName] || eventName;

export const trackEvent = (eventName, params = {}) => {
  if (!eventName || typeof window === 'undefined') {
    return;
  }

  const normalizedName = normalizeEventName(eventName);
  const enrichedParams = {
    deviceType: getDeviceType(),
    ...params
  };

  const payload = {
    event: normalizedName,
    ...enrichedParams,
    timestamp: new Date().toISOString()
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  if (typeof window.gtag === 'function') {
    window.gtag('event', normalizedName, enrichedParams);
  }

  if (import.meta.env.DEV) {
    console.info('[analytics]', payload);
  }
};

export const trackFunnelStep = (step, params = {}) => {
  trackEvent(step, {
    funnel: 'rsvp',
    ...params
  });
};
