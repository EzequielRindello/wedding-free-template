import { FaCheckCircle } from 'react-icons/fa';
import siteData from '../content/siteData';

const EventLogistics = () => {
  const { logistics } = siteData;

  return (
    <section className="logistics-section" id={logistics.sectionId}>
      <h2 className="section-title">{logistics.title}</h2>
      <p className="section-text">{logistics.subtitle}</p>

      <div className="logistics-grid">
        {logistics.items.map((item) => (
          <article className="logistics-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>

      <div className="includes-box">
        <h3>{logistics.includesTitle}</h3>
        <div className="includes-list">
          {logistics.includes.map((entry) => (
            <p className="includes-item" key={entry}>
              <FaCheckCircle aria-hidden="true" /> {entry}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventLogistics;
