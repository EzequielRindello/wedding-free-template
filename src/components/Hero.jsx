import { FaChevronDown } from 'react-icons/fa';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">Juan & Pepita</h1>
        <h2 className="hero-subtitle">¡NOS CASAMOS!</h2>
      </div>
      <div className="hero-scroll-hint">
        <FaChevronDown className="bounce" />
      </div>
    </section>
  );
};

export default Hero;