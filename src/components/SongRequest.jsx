import { FaMusic } from 'react-icons/fa';

const SongRequest = () => {
  const handleFormClick = () => {
    window.open('https://tu-formulario-de-google', '_blank');
  };

  return (
    <section className="song-request-section">
      <FaMusic className="song-icon" />
      <h2 className="section-title">¡Que no falte tu tema favorito!</h2>
      <p className="section-text">Ayudanos a armar tu playlist</p>
      <button className="cta-btn" onClick={handleFormClick}>
        Sugerir canción
      </button>
    </section>
  );
};

export default SongRequest;
