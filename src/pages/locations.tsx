/**
 * Journey screen — a story-driven timeline mixing StoryDay chapter cards
 * and hotel catch-location cards.
 *
 * Days group multiple scenes under one card. Tapping a day plays its scenes
 * sequentially (story.tsx handles chaining). The day is complete when all
 * its scenes are watched.
 */

import { Link, useLocation } from 'wouter';
import { CheckCircle, Lock, ChevronRight, MapPin, Scroll, Play, RotateCcw, Star } from 'lucide-react';
import { JOURNEY, type StoryDay, type LocationEntry, type CreditsEntry } from '@/data/journey';
import { STORY_EVENTS, getStoryEvent } from '@/data/story';
import { getLocationById } from '@/data/locations';
import { LOCATION_IMAGES } from '@/lib/assets';
import { useLaundryDex } from '@/hooks/use-laundry-dex';
import { useStory } from '@/hooks/use-story';
import { useMusic } from '@/context/music-context';

// ─── Types ─────────────────────────────────────────────────────────────────

type DayStatus = 'active' | 'partial' | 'complete' | 'locked';
type LocationStatus = 'unlocked' | 'locked';

interface ComputedDayItem {
  kind: 'day';
  day: StoryDay;
  status: DayStatus;
  seenCount: number;
  /** First scene in the day that hasn't been seen yet. */
  nextEventId: string | undefined;
}

interface ComputedLocationItem {
  kind: 'location';
  entry: LocationEntry;
  status: LocationStatus;
}

interface ComputedCreditsItem {
  kind: 'credits';
  entry: CreditsEntry;
  unlocked: boolean;
}

type ComputedItem = ComputedDayItem | ComputedLocationItem | ComputedCreditsItem;

// ─── Journey computation ───────────────────────────────────────────────────

function useComputedJourney(): ComputedItem[] {
  const { isSceneSeen } = useStory();
  const { isLocationUnlocked, caughtCountForLocation } = useLaundryDex();

  // Items unlock sequentially: each item only becomes reachable when the
  // preceding item is "complete".
  //   • Day complete     = all its scenes have been watched.
  //   • Location complete = it has a catchesRequiredToAdvance threshold AND
  //                         the player has met it; otherwise it doesn't block.
  let prevComplete = true;

  return JOURNEY.map((item): ComputedItem => {
    if (item.kind === 'day') {
      const seenCount = item.eventIds.filter((id) => isSceneSeen(id)).length;
      const total = item.eventIds.length;
      const allSeen = seenCount === total;
      const nextEventId = item.eventIds.find((id) => !isSceneSeen(id));

      let status: DayStatus;
      if (!prevComplete) {
        status = 'locked';
      } else if (allSeen) {
        status = 'complete';
      } else if (seenCount > 0) {
        status = 'partial';
      } else {
        status = 'active';
      }

      if (!allSeen) prevComplete = false;
      return { kind: 'day', day: item, status, seenCount, nextEventId };
    } else if (item.kind === 'credits') {
      const unlocked = prevComplete;
      return { kind: 'credits', entry: item, unlocked };
    } else {
      const location = getLocationById(item.locationId);
      const unlocked = location ? isLocationUnlocked(location) : false;

      // If this location has a catch gate, check whether it blocks what follows.
      if (item.catchesRequiredToAdvance !== undefined) {
        const caught = caughtCountForLocation(item.locationId);
        if (caught < item.catchesRequiredToAdvance) {
          prevComplete = false;
        }
      }

      return { kind: 'location', entry: item, status: unlocked ? 'unlocked' : 'locked' };
    }
  });
}

// ─── Day chapter card ──────────────────────────────────────────────────────

function DayCard({ item }: { item: ComputedDayItem }) {
  const [, navigate] = useLocation();
  const { day, status, seenCount, nextEventId } = item;
  const total = day.eventIds.length;

  const isLocked = status === 'locked';
  const isComplete = status === 'complete';
  const isPartial = status === 'partial';
  const isActive = status === 'active';

  const handleTap = () => {
    if (isLocked) return;
    // Resume from the first unseen scene, or replay from the start if all seen.
    const target = nextEventId ?? day.eventIds[0];
    navigate(`/story/${target}`);
  };

  return (
    <button
      onClick={handleTap}
      disabled={isLocked}
      className={[
        'w-full text-left rounded-3xl overflow-hidden border transition-all',
        isActive
          ? 'border-primary/50 shadow-[0_0_20px_rgba(251,191,36,0.12)] active:scale-[0.98]'
          : isPartial
            ? 'border-blue-400/30 shadow-[0_0_14px_rgba(96,165,250,0.08)] active:scale-[0.98]'
            : isComplete
              ? 'border-white/10 opacity-75 active:scale-[0.98]'
              : 'border-white/5 opacity-35 cursor-not-allowed',
      ].join(' ')}
    >
      <div className={`relative bg-gradient-to-br ${day.accentColor}`}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />

        <div className="relative p-5">
          {/* Top row: icon + labels + status chip */}
          <div className="flex items-start gap-3">
            <div className="text-3xl leading-none mt-0.5 select-none">{day.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-0.5">
                {day.dayLabel}
              </p>
              <h3 className="text-lg font-display font-bold text-white leading-tight">
                {day.title}
              </h3>
              {day.subtitle && (
                <p className="text-xs text-white/50 mt-0.5 leading-snug">{day.subtitle}</p>
              )}
            </div>

            {/* Status chip */}
            <div className="shrink-0 mt-0.5">
              {isComplete && (
                <div className="flex items-center gap-1 bg-white/10 rounded-full px-2.5 py-1">
                  <CheckCircle size={11} className="text-green-400" />
                  <span className="text-[10px] font-bold text-green-300">Done</span>
                </div>
              )}
              {(isActive || isPartial) && (
                <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 border ${isPartial ? 'bg-blue-500/20 border-blue-400/40' : 'bg-primary/20 border-primary/40 animate-pulse'}`}>
                  <Play size={9} className={isPartial ? 'text-blue-300' : 'text-primary'} fill="currentColor" />
                  <span className={`text-[10px] font-bold ${isPartial ? 'text-blue-300' : 'text-primary'}`}>
                    {isPartial ? 'Continue' : 'Watch'}
                  </span>
                </div>
              )}
              {isLocked && (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Lock size={14} className="text-white/40" />
                </div>
              )}
            </div>
          </div>

          {/* Scene progress row */}
          <div className="mt-4 flex items-center gap-2">
            {/* Scene pip track */}
            <div className="flex items-center gap-1.5 flex-1">
              {day.eventIds.map((id, i) => {
                const seen = i < seenCount;
                const isCurrent = !isLocked && id === nextEventId;
                const event = getStoryEvent(id);
                return (
                  <div key={id} className="flex items-center gap-1.5">
                    <div
                      className={[
                        'rounded-full transition-all',
                        seen ? 'w-2 h-2 bg-white/70' : isCurrent ? 'w-2.5 h-2.5 bg-white shadow-[0_0_5px_rgba(255,255,255,0.6)]' : 'w-2 h-2 bg-white/20',
                      ].join(' ')}
                    />
                    {event && (
                      <span className="text-[10px] text-white/40 hidden sm:inline truncate max-w-[80px]">
                        {event.title}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Count */}
            <span className="text-[10px] font-mono text-white/40 shrink-0">
              {seenCount} / {total} scenes
            </span>

            {/* Revisit icon for complete days */}
            {isComplete && (
              <RotateCcw size={11} className="text-white/30 shrink-0" />
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Location card ─────────────────────────────────────────────────────────

function LocationCard({ item }: { item: ComputedLocationItem }) {
  const { caughtCountForLocation, totalCountForLocation } = useLaundryDex();
  const { stop } = useMusic();

  const loc = getLocationById(item.entry.locationId);
  if (!loc) return null;

  const caught = caughtCountForLocation(loc.id);
  const total = totalCountForLocation(loc.id);
  const progress = total > 0 ? (caught / total) * 100 : 0;
  const isComplete = caught === total && total > 0;

  // ── Locked ────────────────────────────────────────────────────────────
  if (item.status === 'locked') {
    let hintText = 'Complete the story above to unlock.';
    if (loc.unlockedBy) {
      const prereqLoc = getLocationById(loc.unlockedBy.locationId);
      const prereqCaught = caughtCountForLocation(loc.unlockedBy.locationId);
      const remaining = loc.unlockedBy.uniqueCatchesRequired - prereqCaught;
      hintText = `Discover ${remaining} more unique items from ${prereqLoc?.shortName ?? loc.unlockedBy.locationId} to unlock.`;
    }

    return (
      <div className="relative w-full rounded-3xl overflow-hidden shadow-xl border border-white/5 opacity-50 select-none">
        <div
          className="absolute inset-0 bg-cover bg-center z-0 scale-105 blur-[2px]"
          style={{ backgroundImage: `url(${LOCATION_IMAGES[loc.id]})` }}
        />
        <div className="absolute inset-0 bg-slate-950/80 z-10" />
        <div className="relative z-20 p-6 flex flex-col min-h-[180px]">
          <div className="flex justify-between items-start mb-auto">
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-400 mb-1">{loc.shortName}</h2>
              <p className="text-xs font-medium text-slate-500 italic">"{loc.tagline}"</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 text-slate-400 shrink-0 ml-4">
              <Lock size={18} />
            </div>
          </div>
          <div className="mt-4 bg-slate-800/80 rounded-2xl p-3 border border-slate-700">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Locked</p>
            <p className="text-sm text-slate-300 leading-snug">{hintText}</p>
            {loc.unlockedBy && (() => {
              const prereqCaught = caughtCountForLocation(loc.unlockedBy!.locationId);
              return (
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-slate-500 transition-all duration-700"
                      style={{ width: `${Math.min((prereqCaught / loc.unlockedBy!.uniqueCatchesRequired) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-end mt-1">
                    <span className="text-[10px] font-mono text-slate-500">
                      {prereqCaught} / {loc.unlockedBy!.uniqueCatchesRequired}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    );
  }

  // ── Unlocked ──────────────────────────────────────────────────────────
  return (
    <Link
      href={`/catch/${loc.id}`}
      onClick={stop}
      className="block relative w-full rounded-3xl overflow-hidden shadow-xl border border-white/10 group transition-transform active:scale-[0.98]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-700 group-hover:scale-105"
        style={{ backgroundImage: `url(${LOCATION_IMAGES[loc.id]})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/30 z-10" />
      <div className="relative z-20 p-6 flex flex-col min-h-[180px]">
        <div className="flex justify-between items-start mb-auto">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300/60 mb-0.5">
              <MapPin size={9} className="inline mr-1" />
              Discovery Area
            </p>
            <h2 className="text-2xl font-display font-bold text-white mb-1">{loc.shortName}</h2>
            <p className="text-xs font-medium text-slate-300 italic">"{loc.tagline}"</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-white shrink-0 ml-4">
            <ChevronRight size={20} />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Found</span>
            <span className={`text-sm font-bold font-mono ${isComplete ? 'text-green-400' : 'text-primary'}`}>
              {caught} / {total}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${isComplete ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-primary shadow-[0_0_10px_rgba(251,191,36,0.5)]'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Credits card ──────────────────────────────────────────────────────────

function CreditsCard({ item }: { item: ComputedCreditsItem }) {
  const [, navigate] = useLocation();
  if (!item.unlocked) {
    return (
      <div className="relative w-full rounded-3xl overflow-hidden border border-white/5 opacity-35 select-none">
        <div className="bg-gradient-to-br from-violet-950 to-slate-900 p-5 flex items-center gap-3 min-h-[80px]">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <Lock size={14} className="text-white/40" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-0.5">Credits</p>
            <p className="text-base font-display font-bold text-slate-500">A Buddy Production</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <button
      onClick={() => navigate('/credits')}
      className="w-full text-left rounded-3xl overflow-hidden border border-violet-400/30 shadow-[0_0_20px_rgba(167,139,250,0.1)] active:scale-[0.98] transition-all"
    >
      <div className="bg-gradient-to-br from-violet-900 to-indigo-950 p-5 flex items-center justify-between min-h-[80px]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-violet-400/20 border border-violet-400/30 flex items-center justify-center shrink-0">
            <Star size={16} className="text-violet-300" fill="currentColor" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400/70 mb-0.5">Credits</p>
            <p className="text-lg font-display font-bold text-white">A Buddy Production</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-violet-300/60 shrink-0" />
      </div>
    </button>
  );
}

// ─── Main screen ───────────────────────────────────────────────────────────

export default function JourneyScreen() {
  const items = useComputedJourney();

  return (
    <div className="min-h-full bg-slate-900 p-4 pb-8 font-sans text-slate-100 flex flex-col">
      {/* Header */}
      <div className="mb-6 bg-slate-800/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-700 flex items-center gap-3">
        <div className="p-3 bg-primary/20 rounded-xl text-primary">
          <Scroll size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Your Journey</h1>
          <p className="text-sm text-slate-400">Follow Hamza &amp; Enayah's Umrah adventure</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative flex flex-col gap-3">
        <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary/30 via-slate-600/30 to-transparent pointer-events-none" />

        {items.map((item) => {
          if (item.kind === 'credits') return null;

          const key = item.kind === 'day' ? `day-${item.day.dayId}` : `loc-${item.entry.locationId}`;
          const dotColor =
            item.kind === 'day'
              ? item.status === 'complete'
                ? 'bg-green-500 border-green-400'
                : item.status === 'active' || item.status === 'partial'
                  ? 'bg-primary border-primary shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                  : 'bg-slate-700 border-slate-600'
              : item.status === 'unlocked'
                ? 'bg-blue-500 border-blue-400'
                : 'bg-slate-700 border-slate-600';

          return (
            <div key={key} className="relative">
              <div className={`absolute left-4 top-5 w-4 h-4 rounded-full border-2 z-10 ${dotColor}`} />
              <div className="pl-10">
                {item.kind === 'day' ? (
                  <DayCard item={item} />
                ) : (
                  <LocationCard item={item} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
