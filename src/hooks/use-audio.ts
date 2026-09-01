import { useRef, useEffect, useState } from 'react';

export function useAudio(path: string, options?: { volume?: number, loop?: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Avoid double slashes if base URL ends in slash
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const audio = new Audio(`${baseUrl}${cleanPath}`);
    
    if (options?.volume !== undefined) audio.volume = options.volume;
    if (options?.loop !== undefined) audio.loop = options.loop;
    audioRef.current = audio;
    
    const handleEnd = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnd);
    return () => {
      audio.removeEventListener('ended', handleEnd);
      audio.pause();
    };
  }, [path, options?.volume, options?.loop]);

  const play = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.warn('Audio play failed', e));
      setIsPlaying(true);
    }
  };
  
  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return { play, stop, isPlaying, audio: audioRef.current };
}
