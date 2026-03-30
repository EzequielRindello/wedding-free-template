import { FaInstagram, FaWhatsapp, FaHeart } from 'react-icons/fa';
import siteData from '../content/siteData';
import { isConfiguredExternalUrl } from '../utils/externalLinks';

const SocialFooter = () => {
  const { social } = siteData;
  const hasMissingLinks = social.contacts.some(
    (contact) =>
      !isConfiguredExternalUrl(contact.instagramUrl)
      || !isConfiguredExternalUrl(contact.whatsappUrl)
  );

  const renderSocialLink = (url, label, icon) => {
    if (!isConfiguredExternalUrl(url)) {
      return (
        <span
          className="social-link social-link-disabled"
          aria-label={`${label} no configurado`}
          title="Link no configurado"
          role="img"
        >
          {icon}
        </span>
      );
    }

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="social-link"
        aria-label={label}
      >
        {icon}
      </a>
    );
  };

  return (
    <section className="social-section">
      <h2 className="section-title">{social.title}</h2>

      <div className="contacts-grid">
        {social.contacts.map((contact) => (
          <div className="contact-card" key={contact.name}>
            <h3 className="contact-name">{contact.name}</h3>
            <div className="social-links">
              {renderSocialLink(
                contact.instagramUrl,
                `Instagram de ${contact.name}`,
                <FaInstagram />
              )}
              {renderSocialLink(
                contact.whatsappUrl,
                `WhatsApp de ${contact.name}`,
                <FaWhatsapp />
              )}
            </div>
          </div>
        ))}
      </div>

      {hasMissingLinks && <p className="link-helper link-helper-light">{social.linksUnavailableText}</p>}

      <footer className="footer">
        <div className="footer-heart">
          <FaHeart />
        </div>
        <p className="footer-message">{social.footerMessage}</p>
        <p className="footer-date">{social.footerDate}</p>
      </footer>
    </section>
  );
};

export default SocialFooter;