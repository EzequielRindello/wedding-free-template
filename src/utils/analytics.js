export const trackEvent = (eventName, params = {}) => {
  if (!eventName || typeof window === 'undefined') {
    return;
  }

  const payload = {
    event: eventName,
    ...params,
    timestamp: new Date().toISOString()
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  if (import.meta.env.DEV) {
    console.info('[analytics]', payload);
  }
};
