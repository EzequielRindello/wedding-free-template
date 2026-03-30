const placeholderTokens = [
  'tu-formulario-de-google',
  'direccion-sacada-de-google-maps',
  'ig-de-la-novia',
  'wsp-de-la-novia',
  'ig-del-novio',
  'wsp-del-novio'
];

const hasPlaceholderToken = (value) =>
  placeholderTokens.some((token) => value.toLowerCase().includes(token));

export const isConfiguredExternalUrl = (value) => {
  if (typeof value !== 'string') {
    return false;
  }

  const normalized = value.trim();
  if (!normalized || hasPlaceholderToken(normalized)) {
    return false;
  }

  try {
    const parsed = new URL(normalized);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

export const openExternalUrl = (value) => {
  if (!isConfiguredExternalUrl(value)) {
    return false;
  }

  window.open(value, '_blank', 'noopener,noreferrer');
  return true;
};
