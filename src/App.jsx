import { useEffect } from 'react';
import { FaPlay } from 'react-icons/fa';
import useAudioPlayer from './hooks/useAudioPlayer';
import MusicPlayerButton from './components/MusicPlayerButton';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import Gallery from './components/Gallery';
import Ceremony from './components/Ceremony';
import EventLogistics from './components/EventLogistics';
import SongRequest from './components/SongRequest';
import FaqAccordion from './components/FaqAccordion';
import Rsvp from './components/Rsvp';
import TrustSignals from './components/TrustSignals';
import SocialFooter from './components/SocialFooter';
import StickyCta from './components/StickyCta';
import siteData from './content/siteData';
// Ruta al archivo de música, simplemente un ejemplo.
// descarga una canción de tu preferencia y colócala en la carpeta 'src/assets/music' en formato de mp3.
import Song from './assets/music/wedding-song.mp3';

export default function App() {
  const { isPlaying, togglePlay, showSplash, startMusic } = useAudioPlayer(Song);
  const { names, heroSubtitle, splashButtonLabel } = siteData.couple;

  // Block scrolling when splash screen is shown
  useEffect(() => {
    if (showSplash) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showSplash]);

  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    startMusic();
  };

  return (
    <div className="app">
      {showSplash && (
        <div className="splash-screen">
          <div className="splash-content">
            <h1 className="splash-title">{names}</h1>
            <p className="splash-subtitle">{heroSubtitle}</p>
            <button
              className="splash-btn"
              onClick={handleButtonClick}
              type="button"
            >
              <FaPlay /> {splashButtonLabel}
            </button>
          </div>
        </div>
      )}
      <MusicPlayerButton isPlaying={isPlaying} onToggle={togglePlay} />
      {!showSplash && <StickyCta />}
      <Hero />
      <Countdown />
      <Gallery />
      <Ceremony />
      <EventLogistics />
      <Rsvp />
      <TrustSignals />
      <FaqAccordion />
      <SongRequest />
      <SocialFooter />
    </div>
  );
}