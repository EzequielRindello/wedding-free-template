import { useState, useEffect, useRef } from 'react';

const useAudioPlayer = (audioSrc) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const audioRef = useRef(null);

  const ensureAudio = () => {
    if (!audioRef.current) {
      const audio = new Audio(audioSrc);
      audio.loop = true;
      audio.volume = 0.5;
      audio.preload = 'none';
      audioRef.current = audio;
    }

    return audioRef.current;
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioSrc]);

  const startMusic = () => {
    const audio = ensureAudio();

    audio.play()
      .then(() => {
        setIsPlaying(true);
        setShowSplash(false);
      })
      .catch((err) => {
        console.error('Error al reproducir:', err);
        setShowSplash(false);
      });
  };

  const togglePlay = () => {
    const audio = ensureAudio();

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error('Error al reproducir:', err);
          setIsPlaying(false);
        });
    }
  };

  return { isPlaying, togglePlay, showSplash, startMusic };
};

export default useAudioPlayer;