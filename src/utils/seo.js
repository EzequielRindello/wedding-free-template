const ensureMetaTag = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const ensureCanonical = (href) => {
  if (!href) {
    return;
  }

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }

  canonical.setAttribute('href', href);
};

const ensureJsonLd = (payload) => {
  const scriptId = 'event-jsonld';
  let script = document.getElementById(scriptId);

  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(payload);
};

const toIsoDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toISOString();
};

const isAbsoluteHttpUrl = (value) => {
  if (!value) {
    return false;
  }

  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

export const applySeoData = ({ seo, privacy, ceremony, couple }) => {
  if (typeof document === 'undefined') {
    return;
  }

  const title = seo?.title || `Invitacion de Casamiento | ${couple?.names || ''}`;
  const description = seo?.description || 'Invitacion digital de boda con detalles del evento y RSVP.';
  const configuredCanonical = seo?.canonicalUrl || '';
  const canonicalUrl = isAbsoluteHttpUrl(configuredCanonical)
    ? configuredCanonical
    : `${window.location.origin}${window.location.pathname}`;
  const ogImage = seo?.ogImage || '/images/hero-desktop.webp';
  const allowIndexing = Boolean(privacy?.allowIndexing ?? true);

  if (configuredCanonical && !isAbsoluteHttpUrl(configuredCanonical) && import.meta.env.DEV) {
    console.warn('[seo] canonicalUrl invalido. Usa una URL absoluta (https://dominio.com/).');
  }

  document.title = title;

  ensureMetaTag('meta[name="description"]', {
    name: 'description',
    content: description
  });

  ensureMetaTag('meta[name="theme-color"]', {
    name: 'theme-color',
    content: seo?.themeColor || '#274C77'
  });

  ensureMetaTag('meta[name="robots"]', {
    name: 'robots',
    content: allowIndexing ? 'index, follow' : 'noindex, nofollow'
  });

  ensureMetaTag('meta[property="og:title"]', {
    property: 'og:title',
    content: title
  });

  ensureMetaTag('meta[property="og:description"]', {
    property: 'og:description',
    content: description
  });

  ensureMetaTag('meta[property="og:image"]', {
    property: 'og:image',
    content: ogImage
  });

  ensureCanonical(canonicalUrl);

  ensureMetaTag('meta[property="og:url"]', {
    property: 'og:url',
    content: canonicalUrl
  });

  ensureMetaTag('meta[property="og:locale"]', {
    property: 'og:locale',
    content: seo?.locale || 'es_AR'
  });

  ensureMetaTag('meta[name="twitter:card"]', {
    name: 'twitter:card',
    content: seo?.twitterCard || 'summary_large_image'
  });

  ensureMetaTag('meta[name="twitter:title"]', {
    name: 'twitter:title',
    content: title
  });

  ensureMetaTag('meta[name="twitter:description"]', {
    name: 'twitter:description',
    content: description
  });

  ensureMetaTag('meta[name="twitter:image"]', {
    name: 'twitter:image',
    content: ogImage
  });

  if (ceremony?.calendarEvent?.title) {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: ceremony.calendarEvent.title,
      startDate: toIsoDate(ceremony.calendarEvent.startDateTime),
      endDate: toIsoDate(ceremony.calendarEvent.endDateTime),
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: ceremony.venueName,
        address: ceremony.calendarEvent.location
      },
      description: ceremony.calendarEvent.description
    };

    ensureJsonLd(schema);
  }
};
