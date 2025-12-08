import useCountdown from '../hooks/useCountdown';

const Countdown = () => {
  // usa este formato AAAA-MM-DDTHH:MM:SS
  // es: (año)-(mes)-(día)T(hora):(minuto):(segundo)
  const timeLeft = useCountdown('2070-04-03T00:00:00');

  return (
    <section className="countdown-section">
      <h2 className="section-title">XX • xxxx • 20XX</h2>
      <p className="countdown-text">¡Listos para festejar juntos! Faltan...</p>
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