import { useEffect, useState } from 'react';
import Marquee from "react-fast-marquee";
import img1 from '../assets/images/slider-1.webp';
import img2 from '../assets/images/slider-2.webp';
import img3 from '../assets/images/slider-3.webp';
import img4 from '../assets/images/slider-4.webp';
import img5 from '../assets/images/slider-5.webp';
import img6 from '../assets/images/slider-6.webp';


const Gallery = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobileQuery = window.matchMedia('(max-width: 768px)');

    const updatePreferences = () => {
      setPrefersReducedMotion(reducedMotionQuery.matches);
      setIsMobile(mobileQuery.matches);
    };

    updatePreferences();

    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener('change', updatePreferences);
      mobileQuery.addEventListener('change', updatePreferences);
    } else {
      reducedMotionQuery.addListener(updatePreferences);
      mobileQuery.addListener(updatePreferences);
    }

    return () => {
      if (reducedMotionQuery.removeEventListener) {
        reducedMotionQuery.removeEventListener('change', updatePreferences);
        mobileQuery.removeEventListener('change', updatePreferences);
      } else {
        reducedMotionQuery.removeListener(updatePreferences);
        mobileQuery.removeListener(updatePreferences);
      }
    };
  }, []);

  // acordate de optimizar las imagenes para web antes de subirlas
  // maximo de 200kb por imagen idealmente
  // esto es logrado con https://squoosh.app/ hace un resize y luego guardando con quality 75-80%
  // tambien usar formato webp para mejor compresion
  const images = [
    { src: img1, alt: 'Momento 1', width: 900, height: 1200 },
    { src: img2, alt: 'Momento 2', width: 900, height: 1200 },
    { src: img3, alt: 'Momento 3', width: 900, height: 1200 },
    { src: img4, alt: 'Momento 4', width: 900, height: 1200 },
    { src: img5, alt: 'Momento 5', width: 900, height: 1200 },
    { src: img6, alt: 'Momento 6', width: 900, height: 1200 }
  ];
  const marqueeSpeed = isMobile ? 24 : 38;

  return (
    <section className="gallery-section">
      <div className="gallery-header">
        <h2 className="section-title">Nuestra Historia</h2>
        <p className="section-text">
          Cada momento capturado es un recuerdo que atesoramos.
          Aquí están algunos de nuestros instantes favoritos juntos.
        </p>
      </div>
      <div className="gallery-wrapper">
        {prefersReducedMotion ? (
          <div className="gallery-static-track">
            {images.map((image, idx) => (
              <div key={idx} className="gallery-item-marquee">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  width={image.width}
                  height={image.height}
                />
              </div>
            ))}
          </div>
        ) : (
          <Marquee speed={marqueeSpeed} gradient={false} pauseOnHover pauseOnClick>
            {images.map((image, idx) => (
              <div key={idx} className="gallery-item-marquee">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  width={image.width}
                  height={image.height}
                />
              </div>
            ))}
          </Marquee>
        )}
      </div>
    </section>
  );
};

export default Gallery;