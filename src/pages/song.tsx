import { useState, useEffect, useRef } from 'react';
import { useAudio } from '@/hooks/use-audio';
import { Play, Square, Music as MusicIcon } from 'lucide-react';
import { LYRICS as lyrics } from '@/data/song';
import { AUDIO } from '@/lib/assets';

export default function SongScreen() {
  const { play, stop, isPlaying, audio } = useAudio(AUDIO.themeSong);
  
  const [activeLyric, setActiveLyric] = useState(lyrics[0]);
  const [showFlash, setShowFlash] = useState(false);
  const flashPlayed = useRef(false);

  useEffect(() => {
    if (!isPlaying) {
      setActiveLyric(lyrics[0]);
      setShowFlash(false);
      flashPlayed.current = false;
      return;
    }

    const interval = setInterval(() => {
      if (audio) {
        const time = audio.currentTime;
        
        const current = [...lyrics].reverse().find(l => time >= l.time);
        if (current && current !== activeLyric) {
          setActiveLyric(current);
          
          if (current.isSpecial && !flashPlayed.current) {
            setShowFlash(true);
            flashPlayed.current = true;
            setTimeout(() => setShowFlash(false), 2000);
          }
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, audio, activeLyric]);

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden flex flex-col items-center justify-center">
      
      <div className="absolute inset-0 z-0">
        <div className={`w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] transition-colors duration-1000 ${isPlaying ? 'from-primary/30 via-slate-900 to-black' : 'from-slate-800 via-slate-900 to-black'}`} />
      </div>

      {showFlash && (
        <div className="absolute inset-0 z-40 bg-white animate-flash flex items-center justify-center mix-blend-overlay pointer-events-none">
          <div className="w-full h-full bg-yellow-400/50" />
        </div>
      )}

      <div className="relative z-20 flex flex-col items-center w-full max-w-sm px-6">
        
        <div className="w-40 h-40 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center mb-10 shadow-2xl relative overflow-hidden transition-all duration-500">
          {isPlaying ? (
            <div className="absolute inset-0 flex items-end justify-center gap-2 px-6 pb-8">
              {[1, 2, 3, 4, 5, 6].map(bar => (
                <div 
                  key={bar} 
                  className="w-3 bg-primary rounded-t-full shadow-[0_0_10px_hsl(var(--primary))]"
                  style={{ 
                    animation: 'float 0.8s ease-in-out infinite alternate',
                    height: `${30 + Math.random() * 50}%`, 
                    animationDelay: `${bar * 0.15}s`,
                    animationDuration: `${0.4 + Math.random() * 0.4}s`
                  }} 
                />
              ))}
            </div>
          ) : (
            <MusicIcon size={56} className="text-slate-500" />
          )}
        </div>

        <div className="min-h-[140px] w-full flex items-center justify-center mb-10 text-center px-4">
          {isPlaying ? (
            <p className={`text-2xl md:text-3xl font-display font-bold leading-tight transition-all duration-300 ${activeLyric.isSpecial ? 'text-primary scale-125 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)] animate-pulse' : 'text-white'}`}>
              {activeLyric.text}
            </p>
          ) : (
            <p className="text-slate-400 font-medium text-lg">Ready to begin the journey?</p>
          )}
        </div>

        <button
          onClick={isPlaying ? stop : play}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
            isPlaying 
              ? 'bg-slate-800 text-destructive border-2 border-slate-700 hover:bg-slate-700 hover:scale-95' 
              : 'bg-primary text-primary-foreground hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(251,191,36,0.4)]'
          }`}
        >
          {isPlaying ? <Square size={32} fill="currentColor" /> : <Play size={36} fill="currentColor" className="ml-2" />}
        </button>
      </div>

    </div>
  );
}