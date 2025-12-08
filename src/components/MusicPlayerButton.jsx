import { FaPlay, FaPause } from 'react-icons/fa';

const MusicPlayerButton = ({ isPlaying, onToggle }) => {
  return (
    <button className="music-player-btn" onClick={onToggle} aria-label="Reproducir música">
      {isPlaying ? <FaPause /> : <FaPlay />}
    </button>
  );
};

export default MusicPlayerButton;