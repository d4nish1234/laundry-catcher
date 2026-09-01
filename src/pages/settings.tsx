import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'wouter';
import {
  Settings2,
  RotateCcw,
  Trash2,
  Bug,
  Play,
  Square,
  ChevronRight,
} from 'lucide-react';
import { useAudio } from '@/hooks/use-audio';
import { CREATURES } from '@/data/creatures';
import { DiscoveryArtwork } from '@/components/discovery-artwork';
import { resetDex } from '@/lib/game-engine';
import { resetStoryState } from '@/lib/story-engine';
import { isDebugCatchRate100, setDebugCatchRate100 } from '@/lib/debug';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';

type Lyric = { time: number; text: string; isSpecial?: boolean };

const LYRICS: Lyric[] = [
  { time: 0,  text: "Packing our bags for a journey so grand..." },
  { time: 5,  text: "Through the holy cities, hand in hand!" },
  { time: 10, text: "From Ihram Cloths to Zamzam Flasks," },
  { time: 14, text: "Finding every item for our Umrah tasks!" },
  { time: 20, text: "LAUNDRY CATCHERS! We're on our way!" },
  { time: 25, text: "Through the hotel lobbies every day!" },
  { time: 30, text: "Laundry Catchers, through Madinah's glow, whoa-oh~" },
  { time: 35, text: "A special card appears, oh oh oh!" },
  { time: 42, text: "MASHALLAH!", isSpecial: true },
];

function SongCard() {
  const { play, stop, isPlaying, audio } = useAudio('/audio/theme-song.mp3');
  const [activeLyric, setActiveLyric] = useState<Lyric>(LYRICS[0]);
  const [showFlash, setShowFlash] = useState(false);
  const flashPlayed = useRef(false);

  useEffect(() => {
    if (!isPlaying) {
      setActiveLyric(LYRICS[0]);
      setShowFlash(false);
      flashPlayed.current = false;
      return;
    }
    const interval = setInterval(() => {
      if (!audio) return;
      const current = [...LYRICS].reverse().find((l) => audio.currentTime >= l.time);
      if (current && current !== activeLyric) {
        setActiveLyric(current);
        if (current.isSpecial && !flashPlayed.current) {
          setShowFlash(true);
          flashPlayed.current = true;
          setTimeout(() => setShowFlash(false), 2000);
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, audio, activeLyric]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border transition-colors duration-700 ${
        isPlaying
          ? 'border-primary/40 bg-slate-900'
          : 'border-slate-700 bg-slate-800/60'
      }`}
    >
      {isPlaying && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(251,191,36,0.12)_0%,_transparent_70%)] pointer-events-none" />
      )}

      {showFlash && (
        <div className="absolute inset-0 z-10 bg-white/20 animate-flash pointer-events-none rounded-2xl" />
      )}

      {isPlaying &&
        CREATURES.slice(0, 5).map((c, i) => (
          <DiscoveryArtwork
            key={c.id}
            discovery={c}
            decorative
            className="absolute w-10 h-10 text-[0.42rem] opacity-20 fly-across pointer-events-none select-none"
            style={{
              top: `${10 + i * 18}%`,
              animationDelay: `${i * 1.1}s`,
              animationDuration: `${12 + i * 2}s`,
            }}
          />
        ))}

      <div className="relative z-5 p-4 flex items-center gap-4">
        <button
          onClick={isPlaying ? stop : play}
          className={`shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
            isPlaying
              ? 'bg-slate-700 text-destructive border border-slate-600 active:scale-95'
              : 'bg-primary text-primary-foreground hover:scale-105 active:scale-95 shadow-[0_0_22px_rgba(251,191,36,0.35)]'
          }`}
        >
          {isPlaying ? (
            <Square size={22} fill="currentColor" />
          ) : (
            <Play size={24} fill="currentColor" className="ml-1" />
          )}
        </button>

        <div className="flex-1 min-h-[40px] flex items-center overflow-hidden">
          {isPlaying ? (
            <p
              className={`text-sm font-bold leading-snug transition-all duration-300 ${
                activeLyric.isSpecial
                  ? 'text-primary scale-110 animate-pulse'
                  : 'text-white'
              }`}
            >
              {activeLyric.text}
            </p>
          ) : (
            <p className="text-slate-400 text-sm">Tap to play the Journey theme</p>
          )}
        </div>

        {isPlaying && (
          <div className="flex items-end gap-0.5 h-7 shrink-0">
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className="w-1.5 bg-primary rounded-t-full"
                style={{
                  animation: 'float 0.8s ease-in-out infinite alternate',
                  height: `${35 + bar * 14}%`,
                  animationDelay: `${bar * 0.14}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettingsScreen() {
  const [, navigate] = useLocation();
  const [catchRate100, setCatchRate100] = useState(() => isDebugCatchRate100());
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showPasswordPrompt) {
      setTimeout(() => passwordInputRef.current?.focus(), 50);
    }
  }, [showPasswordPrompt]);

  const handleToggleCatchRate = (enabled: boolean) => {
    if (!enabled) {
      setDebugCatchRate100(false);
      setCatchRate100(false);
      return;
    }
    setPasswordInput('');
    setPasswordError(false);
    setShowPasswordPrompt(true);
  };

  const handlePasswordSubmit = useCallback(() => {
    if (passwordInput === 'Buddy') {
      setDebugCatchRate100(true);
      setCatchRate100(true);
      setShowPasswordPrompt(false);
      setPasswordInput('');
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput('');
      passwordInputRef.current?.focus();
    }
  }, [passwordInput]);

  const handlePasswordCancel = () => {
    setShowPasswordPrompt(false);
    setPasswordInput('');
    setPasswordError(false);
  };

  const handleResetDex = () => {
    resetDex();
    navigate('/');
  };

  const handleResetAll = () => {
    resetDex();
    resetStoryState();
    navigate('/');
  };

  return (
    <div className="min-h-full bg-slate-900 pb-10 font-sans text-slate-100">

      <div className="p-4 pb-0">
        <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 border border-slate-700 flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/20 rounded-xl text-primary">
            <Settings2 size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Settings</h1>
            <p className="text-sm text-slate-400">Music, progress &amp; tools</p>
          </div>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-5">

        <section>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 mb-2">
            🎵 &nbsp;Theme Song
          </p>
          <SongCard />
        </section>

        <section>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 mb-2">
            📊 &nbsp;Reset Progress
          </p>
          <div className="bg-slate-800/60 rounded-2xl border border-slate-700 overflow-hidden divide-y divide-slate-700/80">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white/5 active:bg-white/10 transition-colors text-left">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
                    <RotateCcw size={18} className="text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">Reset Collection</p>
                    <p className="text-xs text-slate-400 leading-snug">Clears all discovered items</p>
                  </div>
                  <ChevronRight size={15} className="text-slate-600 shrink-0" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-800 border-slate-700 text-white max-w-xs mx-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset your Collection?</AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-400">
                    All discovered items will be removed. Story progress and location unlocks are kept. This can't be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600 hover:text-white">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleResetDex}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-bold"
                  >
                    Reset Collection
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full flex items-center gap-3 px-4 py-4 hover:bg-white/5 active:bg-white/10 transition-colors text-left">
                  <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
                    <Trash2 size={18} className="text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">Reset All Progress</p>
                    <p className="text-xs text-slate-400 leading-snug">Clears collection + all story progress</p>
                  </div>
                  <ChevronRight size={15} className="text-slate-600 shrink-0" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-800 border-slate-700 text-white max-w-xs mx-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset everything?</AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-400">
                    All item discoveries <em>and</em> all story progress will be wiped. The journey starts over from Day 1. This can't be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-slate-600 bg-slate-700 text-white hover:bg-slate-600 hover:text-white">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleResetAll}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold"
                  >
                    Reset Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

          </div>
        </section>

        <section>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1 mb-2">
            🔧 &nbsp;Developer Tools
          </p>
          <div className="bg-slate-800/60 rounded-2xl border border-slate-700 overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0">
                <Bug size={18} className="text-violet-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">100% Discovery Rate</p>
                <p className="text-xs text-slate-400 leading-snug">Every pull returns the item shown on the card</p>
              </div>
              <Switch
                checked={catchRate100}
                onCheckedChange={handleToggleCatchRate}
                className="shrink-0"
              />
            </div>

            {showPasswordPrompt && (
              <div className="mx-4 mb-4 flex flex-col gap-2">
                <p className="text-xs text-slate-400 px-1">Enter the developer password to enable this.</p>
                <div className="flex gap-2">
                  <input
                    ref={passwordInputRef}
                    type="password"
                    value={passwordInput}
                    onChange={e => { setPasswordInput(e.target.value); setPasswordError(false); }}
                    onKeyDown={e => { if (e.key === 'Enter') handlePasswordSubmit(); if (e.key === 'Escape') handlePasswordCancel(); }}
                    placeholder="Password"
                    className="flex-1 min-w-0 bg-slate-900 border border-slate-600 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-violet-500 transition-colors"
                  />
                  <button
                    onClick={handlePasswordSubmit}
                    className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-400 text-sm font-bold text-white transition-colors shrink-0"
                  >
                    OK
                  </button>
                </div>
                {passwordError && (
                  <p className="text-xs text-red-400 font-bold px-1">Incorrect password.</p>
                )}
              </div>
            )}

            {catchRate100 && (
              <div className="mx-4 mb-4 bg-violet-500/10 border border-violet-500/30 rounded-xl px-3 py-2 flex items-center gap-2">
                <Bug size={12} className="text-violet-400 shrink-0" />
                <p className="text-xs text-violet-300 font-bold">
                  Debug active — every pull returns the card's item
                </p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}