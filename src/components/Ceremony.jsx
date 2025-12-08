import { FaMapMarkerAlt } from 'react-icons/fa';

const Ceremony = () => {
  const handleMapClick = () => {
    window.open('https://direccion-sacada-de-google-maps', '_blank');
  };
  return (
    <section className="ceremony-section">
      <h2 className="section-title">Ceremonia y Fiesta</h2>
      <div className="ceremony-content">
        <FaMapMarkerAlt className="ceremony-icon" />
        <p className="ceremony-address">
          Salón de Eventos "Club de Pepito"<br />
          San Juan 1124<br />
          Rosario, Santa Fe
        </p>
        <button className="cta-btn" onClick={handleMapClick}>
          <FaMapMarkerAlt /> Cómo llegar
        </button>
      </div>
      <br />
      <div className="events-timeline">
        <div className="event-item">
          <p className="event-time">21:30 PM</p>
          <p className="event-name">Inicio de ceremonia</p>
        </div>
        <div className="event-item">
          <p className="event-time">04:00 AM</p>
          <p className="event-name">Finalización de la fiesta</p>
        </div>
      </div>
      <p className="schedule-note">
        <em>* Cerca de la fecha se definirán los detalles</em>
      </p>
    </section>
  );
};
export default Ceremony;