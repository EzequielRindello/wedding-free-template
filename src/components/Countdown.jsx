import useCountdown from '../hooks/useCountdown';
import siteData from '../content/siteData';

const Countdown = () => {
  const { countdown } = siteData;
  const timeLeft = useCountdown(countdown.targetDate);

  return (
    <section className="countdown-section">
      <h2 className="section-title">{countdown.displayDate}</h2>
      <p className="countdown-text">{countdown.introText}</p>
      <div className="countdown-grid">
        <div className="countdown-item">
          <span className="countdown-number">{timeLeft.days}</span>
          <span className="countdown-label">días</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-number">{timeLeft.hours}</span>
          <span className="countdown-label">horas</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-number">{timeLeft.minutes}</span>
          <span className="countdown-label">minutos</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-number">{timeLeft.seconds}</span>
          <span className="countdown-label">segundos</span>
        </div>
      </div>
    </section>
  );
};

export default Countdown;