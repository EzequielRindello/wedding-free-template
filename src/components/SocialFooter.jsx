import { FaInstagram, FaWhatsapp, FaHeart } from 'react-icons/fa';

const SocialFooter = () => {
  return (
    <section className="social-section">
      <h2 className="section-title">Contactanos</h2>

      <div className="contacts-grid">
        <div className="contact-card">
          <h3 className="contact-name">Nombre 1</h3>
          <div className="social-links">
            <a
              href="https://ig-de-la-novia"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Instagram de Novia"
            >
              <FaInstagram />
            </a>
            <a
              href="https://wsp-de-la-novia"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="WhatsApp de Novia"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

        <div className="contact-card">
          <h3 className="contact-name">Nombre 2</h3>
          <div className="social-links">
            <a
              href="https://ig-del-novio"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Instagram del Novio"
            >
              <FaInstagram />
            </a>
            <a
              href="https://wsp-del-novio"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="WhatsApp del Novio"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-heart">
          <FaHeart />
        </div>
        <p className="footer-message">¡Gracias por acompañarnos en este día tan especial!</p>
        <p className="footer-date">Tu • Fecha • 20XX</p>
      </footer>
    </section>
  );
};

export default SocialFooter;