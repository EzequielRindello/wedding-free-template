import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { FaPlay } from 'react-icons/fa';
import useAudioPlayer from './hooks/useAudioPlayer';
import MusicPlayerButton from './components/MusicPlayerButton';
import Hero from './components/Hero';
const Countdown = lazy(() => import('./components/Countdown'));
const Gallery = lazy(() => import('./components/Gallery'));
const Ceremony = lazy(() => import('./components/Ceremony'));
const EventSchedule = lazy(() => import('./components/EventSchedule'));
const TravelInfo = lazy(() => import('./components/TravelInfo'));
const EventLogistics = lazy(() => import('./components/EventLogistics'));
const SongRequest = lazy(() => import('./components/SongRequest'));
const FaqAccordion = lazy(() => import('./components/FaqAccordion'));
const Rsvp = lazy(() => import('./components/Rsvp'));
const TrustSignals = lazy(() => import('./components/TrustSignals'));
const GiftRegistry = lazy(() => import('./components/GiftRegistry'));
const AdminPanel = lazy(() => import('./components/AdminPanel'));
import PrivateAccessGate from './components/PrivateAccessGate';
const SocialFooter = lazy(() => import('./components/SocialFooter'));
import StickyCta from './components/StickyCta';
import siteData from './content/siteData';
import { applySeoData } from './utils/seo';
import { trackEvent } from './utils/analytics';
// Ruta al archivo de música, simplemente un ejemplo.
// descarga una canción de tu preferencia y colócala en la carpeta 'src/assets/music' en formato de mp3.
import Song from './assets/music/wedding-song.mp3';

const ACCESS_STORAGE_KEY = 'wedding-private-access';

export default function App() {
  const { isPlaying, togglePlay, showSplash, startMusic } = useAudioPlayer(Song);
  const { names, heroSubtitle, splashButtonLabel } = siteData.couple;
  const normalizedPathname =
    typeof window !== 'undefined' ? window.location.pathname.replace(/\/+$/, '') || '/' : '/';
  const isAdminQueryEnabled =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('admin') === '1';
  const isAdminView = normalizedPathname === '/admin' || isAdminQueryEnabled;
  const landingTrackedRef = useRef(false);
  const [isAccessGranted, setIsAccessGranted] = useState(() => {
    if (!siteData.privacy?.enabled || typeof window === 'undefined') {
      return !siteData.privacy?.enabled;
    }

    return window.sessionStorage.getItem(ACCESS_STORAGE_KEY) === 'granted';
  });

  useEffect(() => {
    if (isAdminView) {
      return;
    }

    applySeoData({
      seo: siteData.seo,
      privacy: siteData.privacy,
      ceremony: siteData.ceremony,
      couple: siteData.couple
    });
  }, [isAdminView]);

  useEffect(() => {
    if (isAdminView || !isAccessGranted || landingTrackedRef.current) {
      return;
    }

    landingTrackedRef.current = true;
    trackEvent('landing_view', {
      section: 'home',
      privacyEnabled: Boolean(siteData.privacy?.enabled)
    });
  }, [isAccessGranted, isAdminView]);

  // Block scrolling when splash screen is shown
  useEffect(() => {
    if (isAdminView) {
      document.body.style.overflow = 'auto';
    } else if (isAccessGranted && showSplash) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showSplash, isAccessGranted, isAdminView]);

  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    startMusic();
  };

  const handlePrivacyUnlock = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(ACCESS_STORAGE_KEY, 'granted');
    }
    setIsAccessGranted(true);
  };

  if (isAdminView) {
    return (
      <div className="app admin-app">
        <Suspense fallback={null}>
          <AdminPanel />
        </Suspense>
      </div>
    );
  }

  if (siteData.privacy?.enabled && !isAccessGranted) {
    return <PrivateAccessGate privacy={siteData.privacy} onUnlock={handlePrivacyUnlock} />;
  }

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
      <Suspense fallback={null}>
        <Countdown />
        <Gallery />
        <Ceremony />
        <EventSchedule />
        <TravelInfo />
        <EventLogistics />
        <Rsvp />
        <TrustSignals />
        <GiftRegistry />
        <FaqAccordion />
        <SongRequest />
        <SocialFooter />
      </Suspense>
    </div>
  );
}