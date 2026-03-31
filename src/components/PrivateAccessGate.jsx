import { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import { trackEvent } from '../utils/analytics';

const PrivateAccessGate = ({ privacy, onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    trackEvent('privacy_access_attempt', {
      section: 'privacy_gate'
    });

    if (password.trim() !== String(privacy.password || '').trim()) {
      setError('La clave no es correcta.');
      return;
    }

    setError('');
    trackEvent('privacy_access_success', {
      section: 'privacy_gate'
    });
    onUnlock();
  };

  return (
    <main className="privacy-gate" role="main">
      <section className="privacy-card">
        <h1>
          <FaLock aria-hidden="true" /> {privacy.accessTitle || 'Invitacion privada'}
        </h1>
        <p>{privacy.accessDescription || 'Ingresá la clave para continuar.'}</p>

        <form onSubmit={handleSubmit} className="privacy-form">
          <label htmlFor="privacy-password">Clave de acceso</label>
          <input
            id="privacy-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Ingresa la clave"
            autoComplete="off"
            required
          />
          <button type="submit" className="cta-btn primary">Entrar</button>
          {error && <p className="privacy-error">{error}</p>}
        </form>

        {privacy.accessHint && <p className="privacy-hint">{privacy.accessHint}</p>}
      </section>
    </main>
  );
};

export default PrivateAccessGate;
