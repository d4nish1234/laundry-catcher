import { useState, useEffect, useRef } from 'react';
import { useRoute, useLocation } from 'wouter';
import {
  rollDiscovery,
  resolveLaundryPull,
  isCaught,
  type LaundryPullOutcome,
} from '@/lib/game-engine';
import { getLocationById, LOCATIONS } from '@/data/locations';
import { JOURNEY } from '@/data/journey';
import type { Discovery } from '@/data/creatures';
import { useLaundryDex } from '@/hooks/use-laundry-dex';
import { DiscoveryArtwork } from '@/components/discovery-artwork';
import { useMusic } from '@/context/music-context';
import { playClothespinPull, playItemFound, playRopeCast } from '@/lib/sound-fx';
import { ArrowLeft, Lock, Unlock, ChevronRight, Compass, Waves, RotateCcw } from 'lucide-react';

type CatchState = 'card' | 'revealing' | 'readyToCast' | 'casting' | 'waiting' | 'pulling' | 'result';

export default function CatchScreen() {
  const [match, params] = useRoute('/catch/:locationId');
  const [, setLocation] = useLocation();
  const locationId = params?.locationId;
  const currentLocation = locationId ? getLocationById(locationId) : undefined;

  const [state, setState] = useState<CatchState>('card');
  const [expectedItem, setExpectedItem] = useState<Discovery | null>(null);
  const [foundItem, setFoundItem] = useState<Discovery | null>(null);
  const [outcome, setOutcome] = useState<LaundryPullOutcome | null>(null);
  const [isNew, setIsNew] = useState(false);
  const pendingTimers = useRef<number[]>([]);
  const sequenceToken = useRef(0);

  const { markCaught, markAttempt, state: dexState, caughtCountForLocation } = useLaundryDex();
  const { play, stop } = useMusic();

  const cancelPendingSequence = () => {
    sequenceToken.current += 1;
    pendingTimers.current.forEach((timer) => window.clearTimeout(timer));
    pendingTimers.current = [];
  };

  const schedule = (token: number, callback: () => void, delay: number) => {
    const timer = window.setTimeout(() => {
      if (sequenceToken.current === token) {
        callback();
      }
    }, delay);
    pendingTimers.current.push(timer);
  };

  useEffect(() => {
    return () => {
      sequenceToken.current += 1;
      pendingTimers.current.forEach((timer) => window.clearTimeout(timer));
      pendingTimers.current = [];
    };
  }, []);

  useEffect(() => {
    if (!currentLocation && match) {
      setLocation('/locations');
    }
  }, [currentLocation, match, setLocation]);

  useEffect(() => {
    stop();
    const THEME_B_LOCATIONS = new Set(['madinah-courtyard', 'makkah-skyline']);
    const themeFile = THEME_B_LOCATIONS.has(locationId ?? '') ? '/audio/catch-theme-b.mp3' : '/audio/catch-theme.mp3';
    const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '');
    const seaAudio = new Audio(`${baseUrl}${themeFile}`);
    seaAudio.loop = true;
    seaAudio.volume = 0.65;
    seaAudio.play().catch(() => {});
    return () => {
      seaAudio.pause();
      seaAudio.currentTime = 0;
      play();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentLocation) return null;

  const nextLocation = LOCATIONS.find(l => l.unlockedBy?.locationId === currentLocation.id);
  const catchesRequired = nextLocation?.unlockedBy?.uniqueCatchesRequired ?? 0;
  const catchesSoFar = nextLocation ? caughtCountForLocation(currentLocation.id) : 0;
  const nextUnlocked = catchesSoFar >= catchesRequired;

  const currentJourneyIdx = JOURNEY.findIndex(item => item.kind === 'location' && item.locationId === currentLocation.id);
  const nextJourneyItem = currentJourneyIdx >= 0 ? JOURNEY[currentJourneyIdx + 1] : undefined;

  const handleContinue = () => {
    cancelPendingSequence();
    play();
    if (!nextJourneyItem) {
      setLocation('/locations');
    } else if (nextJourneyItem.kind === 'day') {
      setLocation(`/story/${nextJourneyItem.eventIds[0]}`);
    } else if (nextJourneyItem.kind === 'credits') {
      setLocation('/credits');
    } else {
      setLocation(`/catch/${nextJourneyItem.locationId}`);
    }
  };

  const handleRevealCard = () => {
    cancelPendingSequence();
    const token = sequenceToken.current;
    const nextExpectedItem = rollDiscovery(currentLocation.id, dexState);
    setExpectedItem(nextExpectedItem);
    setFoundItem(null);
    setOutcome(null);
    setIsNew(false);
    setState('revealing');
    schedule(token, () => {
      setState('readyToCast');
    }, 1700);
  };

  // The pull used to be a second tap ("Pull the rope!"). It now runs on its own
  // once the tug lands, so casting is a single action. Takes the token and item
  // explicitly because it is called from inside an already-scheduled callback.
  const runPull = (token: number, item: Discovery) => {
    setState('pulling');
    playClothespinPull();
    const result = resolveLaundryPull(item, dexState);

    schedule(token, () => {
      setOutcome(result.outcome);
      setFoundItem(result.discovery);
      if (result.discovery) {
        setIsNew(!isCaught(dexState, result.discovery.id));
        markCaught(result.discovery);
        playItemFound();
        if (result.outcome === 'different') {
          markAttempt(item);
        }
      } else {
        markAttempt(item);
      }
      setState('result');
    }, 1000);
  };

  const handleCast = () => {
    if (!expectedItem) return;
    cancelPendingSequence();
    const token = sequenceToken.current;
    const item = expectedItem;
    setState('casting');
    setFoundItem(null);
    setOutcome(null);
    playRopeCast();

    schedule(token, () => {
      setState('waiting');
      schedule(token, () => runPull(token, item), 1600);
    }, 700);
  };

  const handleAnotherCard = () => {
    cancelPendingSequence();
    setExpectedItem(null);
    setFoundItem(null);
    setOutcome(null);
    setIsNew(false);
    setState('card');
  };

  const handleRetry = () => {
    cancelPendingSequence();
    setFoundItem(null);
    setOutcome(null);
    setIsNew(false);
    setState('readyToCast');
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-800 z-0" />

      {/* Top bar */}
      <div className="p-4 flex justify-between items-start gap-2 shrink-0 relative z-50">
        <button
          onClick={() => { cancelPendingSequence(); play(); setLocation('/locations'); }}
          className="shrink-0 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="shrink-0 bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10 text-white text-right">
          <h3 className="font-bold uppercase tracking-wider text-[10px] opacity-70">Location</h3>
          <p className="font-display text-lg text-primary flex items-center justify-end gap-2">
            {currentLocation.shortName} <Compass size={16} />
          </p>
        </div>

        {nextLocation && (
          nextUnlocked ? (
            <button
              onClick={handleContinue}
              className="flex-1 min-w-0 relative overflow-hidden rounded-xl p-3 border border-green-400/70 bg-green-500/20 backdrop-blur-md text-white text-left animate-pulse-slow shadow-[0_0_16px_rgba(74,222,128,0.35)] active:scale-95 transition-transform"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer pointer-events-none" />
              <p className="font-bold uppercase tracking-wider text-[10px] text-green-300 flex items-center gap-1 mb-0.5">
                <Unlock size={9} /> Unlocked
              </p>
              <p className="font-display text-sm leading-tight text-green-100 flex items-center gap-1">
                Continue <ChevronRight size={14} className="shrink-0" />
              </p>
            </button>
          ) : (
            <div className="flex-1 min-w-0 bg-black/40 backdrop-blur-md rounded-xl p-3 border border-white/10 text-white">
              <h3 className="font-bold uppercase tracking-wider text-[10px] opacity-70 flex items-center gap-1">
                <Lock size={9} /> Next zone
              </h3>
              <p className="font-display text-sm leading-tight truncate text-primary">
                {nextLocation.shortName}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-primary"
                    style={{ width: `${Math.min(100, (catchesSoFar / catchesRequired) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold tabular-nums opacity-80 shrink-0">
                  {Math.min(catchesSoFar, catchesRequired)}/{catchesRequired}
                </span>
              </div>
            </div>
          )
        )}
      </div>

      <div className="flex-1 relative flex flex-col items-center justify-center">

        {/* The Laundry Sea */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10" />
          <div className="absolute -left-[10%] bottom-0 w-[120%] h-[60%] bg-blue-900/40 rounded-[100%] animate-wave-sway" style={{ animationDuration: '8s' }} />
          <div className="absolute -left-[10%] -bottom-10 w-[120%] h-[70%] bg-sky-800/30 rounded-[100%] animate-wave-sway" style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
          <div className="absolute -left-[10%] -bottom-20 w-[120%] h-[80%] bg-indigo-950/60 rounded-[100%] animate-wave-sway" style={{ animationDuration: '10s' }} />
        </div>

        {/* Laundry card handoff */}
        {state === 'card' && (
          <div className="relative z-40 w-[min(19rem,calc(100%-2rem))] rounded-3xl border border-amber-300/40 bg-slate-950/80 p-6 text-center shadow-2xl backdrop-blur-md animate-in zoom-in">
            <div className="mx-auto mb-4 flex h-28 w-20 rotate-2 items-center justify-center rounded-xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-amber-200 shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
              <div className="flex h-16 w-12 items-center justify-center rounded-lg border border-amber-500/50 bg-slate-900 text-amber-300">
                <Waves size={26} />
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-300">Laundry card</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-white">A hotel attendant has a card for you</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">Turn it over to see which garment or travel item has entered the Laundry Sea.</p>
          </div>
        )}

        {/* The card reveals the target, then the pictured item sinks away.
            No -translate-x/y-1/2 on the card: Tailwind v4 emits those as the
            standalone `translate` property, which stacks on top of the transform
            inside the card-to-sea keyframes. Those keyframes already carry
            translate(-50%,-50%), so the utilities offset the card by half its own
            width and height. */}
        {state === 'revealing' && expectedItem && (
          <div className="absolute left-1/2 top-[43%] z-40 w-56 rounded-2xl border-4 border-amber-400 bg-card p-4 text-center shadow-2xl animate-card-to-sea">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-400">Find this item</p>
            <DiscoveryArtwork discovery={expectedItem} className="mx-auto mt-2 h-28 w-28 text-[1.1rem]" decorative />
            <h3 className="mt-2 font-display text-xl font-bold text-card-foreground">{expectedItem.name}</h3>
          </div>
        )}

        {/* Rope & Charm */}
        {(state === 'casting' || state === 'waiting' || state === 'pulling') && (
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center transition-all ease-in-out z-30
            ${state === 'casting' ? 'translate-y-[25vh] duration-700' : ''}
            ${state === 'waiting' ? 'translate-y-[25vh] animate-bob duration-100' : ''}
            ${state === 'pulling' ? '-translate-y-[15vh] duration-1000' : ''}
          `}>
            <div className="w-1 h-[40vh] bg-amber-700/80 rounded-full" />
            <div className="w-6 h-12 bg-amber-200 border-2 border-amber-800 rounded-sm relative -mt-2 shadow-lg flex flex-col items-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-2 bg-zinc-400 rounded-full" />
            </div>
          </div>
        )}

        {/* Target reminder */}
        {state === 'readyToCast' && expectedItem && (
          <div className="absolute bottom-[29%] left-1/2 z-40 w-[min(20rem,calc(100%-2rem))] -translate-x-1/2 rounded-xl border border-white/10 bg-black/60 px-4 py-3 text-center backdrop-blur-md animate-in slide-in-from-bottom">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-300">The card showed</p>
            <p className="mt-1 font-display text-xl font-bold text-primary">{expectedItem.name}</p>
            <p className="mt-1 text-xs text-slate-300">Cast the clothespin and wait for a tug.</p>
          </div>
        )}

        {/* Pull result */}
        {state === 'result' && outcome && (
          <div className="absolute left-1/2 top-1/2 z-40 flex w-[min(17rem,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col items-center overflow-hidden rounded-2xl border-4 border-amber-500 bg-card p-4 text-center shadow-2xl animate-in zoom-in slide-in-from-bottom-10 duration-700">
            <div className="absolute inset-0 bg-amber-500/10 mix-blend-overlay" />
            {foundItem ? (
              <>
                {outcome === 'different' && (
                  <p className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">
                    A surprise came back
                  </p>
                )}
                <DiscoveryArtwork discovery={foundItem} className="relative z-10 h-28 w-28 text-[1.1rem] animate-float" />
                <h3 className="relative z-10 mt-2 font-display text-2xl font-bold text-card-foreground">{foundItem.name}</h3>
                <p className="relative z-10 mb-4 mt-1 text-xs italic text-muted-foreground">"{foundItem.tagline}"</p>
                {outcome === 'different' && expectedItem && (
                  <p className="relative z-10 mb-3 rounded-lg bg-sky-500/10 px-3 py-2 text-xs text-sky-200">
                    You were looking for {expectedItem.name}, but found something different.
                  </p>
                )}
                {isNew ? (
                  <span className="relative z-10 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-md animate-bounce">Added to your collection</span>
                ) : (
                  <span className="relative z-10 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground shadow-md">Already in your collection.</span>
                )}
              </>
            ) : (
              <>
                <div className="relative z-10 mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-sky-300/20 bg-sky-900/30">
                  <div className="h-12 w-6 rotate-12 rounded-sm border-2 border-amber-700 bg-amber-200/70" />
                </div>
                <h3 className="relative z-10 font-display text-2xl font-bold text-card-foreground">Nothing this time</h3>
                <p className="relative z-10 mt-2 text-sm text-muted-foreground">The clothespin returned empty. The Laundry Sea is always shifting.</p>
              </>
            )}
          </div>
        )}

      </div>

      {/* Controls */}
      <div className="shrink-0 p-6 bg-slate-950/80 backdrop-blur-lg border-t border-white/10 flex flex-col items-center justify-center gap-4 relative z-50">
        {state === 'card' ? (
          <button onClick={handleRevealCard} className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-xl uppercase tracking-widest shadow-[0_6px_0_hsl(var(--primary-foreground))] hover:translate-y-1 hover:shadow-[0_2px_0_hsl(var(--primary-foreground))] active:translate-y-2 transition-all flex items-center justify-center gap-3">
            Reveal Laundry Card
          </button>
        ) : state === 'revealing' ? (
          <div className="w-full py-4 bg-slate-800 text-slate-400 rounded-2xl font-bold text-xl uppercase tracking-widest text-center shadow-inner">
            The picture enters the sea...
          </div>
        ) : state === 'readyToCast' ? (
          <button onClick={handleCast} className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold text-lg uppercase tracking-wider shadow-[0_6px_0_#1e3a8a] active:translate-y-2 transition-all hover:-translate-y-1">
            Cast Rope &amp; Clothespin
          </button>
        ) : state === 'result' ? (
          <div className="w-full flex flex-col gap-3">
            {nextUnlocked && (
              <button onClick={handleContinue} className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-xl uppercase tracking-widest shadow-[0_6px_0_#166534] active:translate-y-2 transition-all flex items-center justify-center gap-3">
                <ChevronRight size={24} /> Continue Journey
              </button>
            )}
            <button onClick={handleAnotherCard} className={`w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold text-base uppercase tracking-wider shadow-[0_6px_0_hsl(var(--primary-foreground))] active:translate-y-2 transition-all flex items-center justify-center gap-3 ${nextUnlocked ? 'opacity-90' : ''}`}>
              <Waves size={20} /> Look for another card
            </button>
            <button onClick={handleRetry} className="w-full py-3.5 bg-slate-700 text-white rounded-2xl font-bold text-sm uppercase tracking-wider border border-slate-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <RotateCcw size={17} /> Try to find this one again
            </button>
          </div>
        ) : (
          <div className="w-full py-4 bg-slate-800 text-slate-400 rounded-2xl font-bold text-xl uppercase tracking-widest text-center shadow-inner">
            {state === 'casting' ? 'Casting...' : state === 'waiting' ? 'Waiting for a tug...' : 'Pulling!'}
          </div>
        )}
      </div>
    </div>
  );
}
