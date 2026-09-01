import { Link, useLocation } from 'wouter';
import { BACKGROUNDS } from '@/lib/assets';
import { Play, Music2 } from 'lucide-react';
import { useMusic } from '@/context/music-context';

export function MusicToggleIcon({ muted }: { muted: boolean }) {
  return (
    <div className="relative">
      <Music2 size={18} />
      {muted && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[130%] h-[1.5px] bg-current rotate-[-45deg] rounded-full opacity-90" />
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [, navigate] = useLocation();
  const { isMuted, toggle, play } = useMusic();

  const handleStartCatching = (e: React.MouseEvent) => {
    e.preventDefault();
    play();
    navigate('/locations');
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BACKGROUNDS.title})` }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      <button
        onClick={toggle}
        title={isMuted ? 'Unmute music' : 'Mute music'}
        className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
      >
        <MusicToggleIcon muted={isMuted} />
      </button>

      <div className="relative z-10 flex flex-col items-center p-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="mb-2 inline-block transform -rotate-3 hover:rotate-3 transition-transform">
          <h1 className="text-6xl md:text-7xl font-display font-bold tracking-tight text-white drop-shadow-[0_6px_0_rgba(0,0,0,0.8)]">
            <span className="text-primary">Laundry</span><br className="sm:hidden" />Catchers
          </h1>
        </div>

        <p className="text-sm font-bold text-white/80 mb-1 drop-shadow-md tracking-widest uppercase">
            Journey to Umrah
        </p>
        <p className="text-xl font-bold text-white mb-12 drop-shadow-md opacity-90 tracking-wide">
          Discover Every Wonder!
        </p>

        <div className="flex flex-col gap-4 w-full max-w-[280px]">
          <a
            href="/locations"
            onClick={handleStartCatching}
            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-xl uppercase tracking-widest shadow-[0_6px_0_hsl(var(--primary-foreground))] hover:translate-y-1 hover:shadow-[0_2px_0_hsl(var(--primary-foreground))] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <Play size={24} fill="currentColor" />
            Begin Journey
          </a>
        </div>
      </div>
    </div>
  );
}
