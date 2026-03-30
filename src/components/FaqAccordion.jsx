import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import siteData from '../content/siteData';

const FaqAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const { faq } = siteData;

  return (
    <section className="faq-section">
      <h2 className="section-title">{faq.title}</h2>
      <div className="faq-container">
        {faq.items.map((item, idx) => {
          const isOpen = openIndex === idx;
          const questionId = `faq-question-${item.id}`;
          const answerId = `faq-answer-${item.id}`;

          return (
            <div key={item.id} className="faq-item">
              <button
                id={questionId}
                className={`faq-question ${isOpen ? 'active' : ''}`}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                type="button"
                aria-expanded={isOpen}
                aria-controls={answerId}
              >
                {item.title}
                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              <div
                id={answerId}
                className={`faq-answer ${isOpen ? 'open' : ''}`}
                role="region"
                aria-labelledby={questionId}
                aria-hidden={!isOpen}
              >
                <p>{item.content}</p>
                {item.details?.map((detail) => (
                  <p key={detail.label}>
                    {detail.label}: <strong>{detail.value}</strong>
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FaqAccordion;
