import { useState } from 'react';
import { FaCopy, FaGift, FaExternalLinkAlt } from 'react-icons/fa';
import siteData from '../content/siteData';
import { isConfiguredExternalUrl, openExternalUrl } from '../utils/externalLinks';
import { trackEvent } from '../utils/analytics';

const GiftRegistry = () => {
  const { giftRegistry } = siteData;
  const [copiedField, setCopiedField] = useState('');

  if (!giftRegistry) {
    return null;
  }

  const externalLinks = Array.isArray(giftRegistry.externalLinks)
    ? giftRegistry.externalLinks.filter((link) => isConfiguredExternalUrl(link.url))
    : [];

  const copyToClipboard = async (fieldKey, value) => {
    if (!value || !navigator.clipboard) {
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(fieldKey);
      trackEvent('gift_copy_click', {
        section: 'gift_registry',
        field: fieldKey
      });

      window.setTimeout(() => {
        setCopiedField((previous) => (previous === fieldKey ? '' : previous));
      }, 1800);
    } catch {
      setCopiedField('');
    }
  };

  const openGiftLink = (link) => {
    trackEvent('gift_external_click', {
      section: 'gift_registry',
      label: link.label
    });
    openExternalUrl(link.url);
  };

  return (
    <section className="gift-section" id={giftRegistry.sectionId || 'gift-registry'}>
      <h2 className="section-title">
        <FaGift aria-hidden="true" /> {giftRegistry.title}
      </h2>
      <p className="section-text">{giftRegistry.intro}</p>

      {giftRegistry.cashGift && (
        <div className="gift-card">
          <div className="gift-row">
            <span>Alias</span>
            <strong>{giftRegistry.cashGift.alias}</strong>
            <button
              type="button"
              className="gift-copy-btn"
              onClick={() => copyToClipboard('alias', giftRegistry.cashGift.alias)}
            >
              <FaCopy /> {copiedField === 'alias' ? giftRegistry.copiedText || 'Copiado' : giftRegistry.copyCtaLabel || 'Copiar'}
            </button>
          </div>

          <div className="gift-row">
            <span>Titular</span>
            <strong>{giftRegistry.cashGift.holder}</strong>
          </div>

          <div className="gift-row">
            <span>Entidad</span>
            <strong>{giftRegistry.cashGift.bank}</strong>
          </div>
        </div>
      )}

      {externalLinks.length > 0 ? (
        <div className="gift-links">
          {externalLinks.map((link) => (
            <button
              className="cta-btn"
              type="button"
              key={link.label}
              onClick={() => openGiftLink(link)}
            >
              <FaExternalLinkAlt /> {link.label}
            </button>
          ))}
        </div>
      ) : (
        <p className="link-helper">{giftRegistry.unavailableText}</p>
      )}
    </section>
  );
};

export default GiftRegistry;
