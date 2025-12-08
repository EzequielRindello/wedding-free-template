import Marquee from "react-fast-marquee";
import img1 from '../assets/images/slider-1.webp';
import img2 from '../assets/images/slider-2.webp';
import img3 from '../assets/images/slider-3.webp';
import img4 from '../assets/images/slider-4.webp';
import img5 from '../assets/images/slider-5.webp';
import img6 from '../assets/images/slider-6.webp';


const Gallery = () => {
  // acordate de optimizar las imagenes para web antes de subirlas
  // maximo de 200kb por imagen idealmente
  // esto es logrado con https://squoosh.app/ hace un resize y luego guardando con quality 75-80%
  // tambien usar formato webp para mejor compresion
  const images = [img1, img2, img3, img4, img5, img6];

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
        <Marquee speed={40} gradient={false} pauseOnHover={false}>
          {images.map((img, idx) => (
            <div key={idx} className="gallery-item-marquee">
              <img src={img} alt={`Momento ${idx + 1}`} loading="lazy" />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Gallery;