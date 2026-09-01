import { Link, useLocation } from 'wouter';
import { Home, Compass, BookOpen, Settings, Music2 } from 'lucide-react';
import { useMusic } from '@/context/music-context';

export function MusicToggleIcon({ muted, size = 18 }: { muted: boolean; size?: number }) {
  return (
    <div className="relative">
      <Music2 size={size} />
      {muted && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[130%] h-[1.5px] bg-current rotate-[-45deg] rounded-full opacity-90" />
        </div>
      )}
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { isMuted, toggle, play } = useMusic();

  const isStoryRoute = location.startsWith('/story/') || location === '/credits';

  const navItems = [
    { path: '/', label: 'Home', icon: Home, onTap: undefined },
    { path: '/locations', label: 'Journey', icon: Compass, onTap: () => play() },
    {
      path: '/dex',
      label: 'Collection',
      icon: BookOpen,
      onTap: () => play(),
    },
    { path: '/settings', label: 'Settings', icon: Settings, onTap: undefined },
  ];

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto bg-background text-foreground shadow-2xl overflow-hidden relative font-sans">
      <main className="flex-1 overflow-y-auto no-scrollbar relative z-10">
        {children}
      </main>

      {location !== '/' && !isStoryRoute && (
        <button
          onClick={toggle}
          title={isMuted ? 'Unmute music' : 'Mute music'}
          className="absolute top-4 right-4 z-30 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
        >
          <MusicToggleIcon muted={isMuted} />
        </button>
      )}

      {!isStoryRoute && (
        <nav className="h-20 bg-card/95 backdrop-blur-lg border-t border-border flex items-center justify-around px-2 z-20 pb-2">
          {navItems.map((item) => {
            const isActive = item.path === '/locations'
              ? (location === '/locations' || location.startsWith('/catch/'))
              : location === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={item.onTap}
                className={`flex flex-col items-center justify-center w-[72px] h-16 rounded-2xl transition-all ${isActive ? 'text-primary scale-110 drop-shadow-[0_2px_10px_rgba(251,191,36,0.3)]' : 'text-muted-foreground hover:bg-white/5'}`}
              >
                <item.icon size={24} className={isActive ? 'animate-bounce' : ''} />
                <span className="text-[9px] font-bold mt-1 tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
