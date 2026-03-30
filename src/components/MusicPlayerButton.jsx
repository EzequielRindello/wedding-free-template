import { FaPlay, FaPause } from 'react-icons/fa';

const MusicPlayerButton = ({ isPlaying, onToggle }) => {
  const buttonLabel = isPlaying ? 'Pausar música' : 'Reproducir música';

  return (
    <button
      className="music-player-btn"
      onClick={onToggle}
      aria-label={buttonLabel}
      title={buttonLabel}
      type="button"
    >
      {isPlaying ? <FaPause /> : <FaPlay />}
    </button>
  );
};

export default MusicPlayerButton;