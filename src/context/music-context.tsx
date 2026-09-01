/**
 * Global background music context for Laundry Catchers.
 *
 * A single HTMLAudioElement lives here for the app's lifetime so it
 * survives navigation between screens. Consumers call:
 *   - play()   — start music (no-op when user has muted)
 *   - stop()   — pause without changing mute preference (e.g. entering a card search)
 *   - toggle() — flip the muted preference and act on it immediately
 */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

interface MusicContextValue {
  isPlaying: boolean;
  isMuted: boolean;
  play: () => void;
  stop: () => void;
  toggle: () => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Whether the user has explicitly muted — respected by play()
  const mutedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
    const audio = new Audio(`${baseUrl}/audio/acapella.mp3`);
    audio.loop = true;
    audio.volume = 0.65;
    audioRef.current = audio;
    return () => {
      audio.pause();
    };
  }, []);

  /** Start music. No-op if the user has muted. */
  const play = () => {
    const audio = audioRef.current;
    if (!audio || mutedRef.current) return;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => {});
  };

  /** Pause music without changing the muted preference. */
  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  };

  /** Toggle the muted preference and immediately play/pause. */
  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (mutedRef.current) {
      mutedRef.current = false;
      setIsMuted(false);
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      mutedRef.current = true;
      setIsMuted(true);
      audio.pause();
      setIsPlaying(false);
    }
  };

  return (
    <MusicContext.Provider value={{ isPlaying, isMuted, play, stop, toggle }}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within MusicProvider');
  return ctx;
}
