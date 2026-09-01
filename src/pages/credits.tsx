/**
 * Credits roll — plays automatically after the "Until Next Time" story scene.
 * Auto-navigates to Skyline catch screen when done, or immediately on skip.
 */
import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useAudio } from '@/hooks/use-audio';
import { useMusic } from '@/context/music-context';

const CREDITS: { role: string; name: string }[] = [
  { role: 'A Buddy Production', name: '' },
  { role: 'Story & Screenplay', name: 'Buddy' },
  { role: 'Game Design', name: 'Buddy' },
  { role: 'Art Direction', name: 'Buddy' },
  { role: 'Character Illustrations', name: 'Buddy' },
  { role: 'Animation', name: 'Buddy' },
  { role: 'Sound & Music', name: 'Buddy' },
  { role: 'Development', name: 'Buddy' },
  { role: 'Quality Assurance', name: 'Hamza & Enayah' },
];

const SCROLL_SECONDS = 22;
const ANIM = `credits-scroll ${SCROLL_SECONDS}s linear forwards`;

export default function CreditsPage() {
  const [, navigate] = useLocation();
  const { stop, play } = useMusic();
  const { play: playSong, stop: stopSong } = useAudio('/audio/theme-song.mp3');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleDone = () => {
    stopSong();
    play();
    navigate('/catch/makkah-skyline');
  };

  useEffect(() => {
    stop();
    playSong();

    // Force-restart the CSS animation regardless of any previously cached state.
    // Removing the animation, triggering a reflow, then reapplying it is the
    // only reliable cross-browser way to restart a CSS animation on an element.
    const el = scrollRef.current;
    if (el) {
      el.style.animation = 'none';
      void el.offsetHeight; // force reflow — flushes the "none" state
      el.style.animation = ANIM;
    }

    const t = setTimeout(handleDone, SCROLL_SECONDS * 1000);
    return () => {
      clearTimeout(t);
      stopSong();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-full overflow-hidden bg-[#050a14]">

      {/* Starfield background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 30% 20%, #0f1b35 0%, #050a14 70%)' }}
      />

      {/* Skip button — fixed so it's always visible regardless of stacking */}
      <button
        onClick={handleDone}
        className="fixed top-5 left-5 z-50 bg-white/10 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
      >
        Skip ›
      </button>

      {/* Top fade */}
      <div
        className="absolute top-0 left-0 right-0 h-24 z-20 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, #050a14 40%, transparent)' }}
      />

      {/* Scrolling content */}
      <div
        ref={scrollRef}
        className="relative z-10 flex flex-col items-center gap-14 px-8 pt-0 pb-32 text-center"
        style={{ animation: ANIM }}
      >
        {/* Title card */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400/70">
            Laundry Catchers
          </p>
          <h1 className="text-5xl font-display font-bold text-white leading-tight">
            The End
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Hamza &amp; Enayah's Umrah Adventure
          </p>
        </div>

        <div className="w-16 h-px bg-white/10" />

        {/* Credit rows */}
        {CREDITS.map(({ role, name }) =>
          name ? (
            <div key={role} className="flex flex-col items-center gap-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">
                {role}
              </p>
              <p className="text-2xl font-display font-bold text-white">{name}</p>
            </div>
          ) : (
            <p key={role} className="text-sm font-bold uppercase tracking-[0.3em] text-amber-400/80">
              {role}
            </p>
          )
        )}

        <div className="w-16 h-px bg-white/10 mt-4" />

        {/* Closing blessing */}
        <div className="flex flex-col items-center gap-2 mt-6">
          <p className="text-3xl font-bold text-amber-300" style={{ fontFamily: 'serif' }}>
            جزاكم الله خيراً
          </p>
          <p className="text-slate-400 text-sm">May Allah reward you all with good</p>
        </div>

        {/* Trailing spacer */}
        <div style={{ height: '60vh' }} />
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 z-20 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #050a14 40%, transparent)' }}
      />
    </div>
  );
}
