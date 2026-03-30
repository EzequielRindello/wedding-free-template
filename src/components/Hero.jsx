import { FaChevronDown } from 'react-icons/fa';
import siteData from '../content/siteData';

const Hero = () => {
  const { names, heroSubtitle } = siteData.couple;

  return (
    <section className="hero" id="home">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">{names}</h1>
        <h2 className="hero-subtitle">{heroSubtitle}</h2>
      </div>
      <div className="hero-scroll-hint">
        <FaChevronDown className="bounce" />
      </div>
    </section>
  );
};

export default Hero;