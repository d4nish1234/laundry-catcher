/**
 * Visual novel scene renderer for Laundry Catchers.
 *
 * Renders a full-screen overlay with:
 *   - A background image or gradient
 *   - Left and right character avatars (placeholder initials circle, or real art)
 *   - A dialogue box at the bottom showing the current step
 *   - Tap anywhere (above dialogue) → advance one step
 *   - ‹ Back button in dialogue box → go back one step (hidden on step 0)
 *   - ✕ Exit button top-left → calls onExit() to leave the scene at any time
 *   - "Skip ›" button top-right → only shown if the scene was already seen
 *   - Step progress dots in the top-left (next to exit button)
 */

import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import type { StoryEvent, StoryCharacterDef, Emotion } from '@/data/story';
import { CHARACTERS } from '@/data/story';
import { markSceneSeen, isSceneSeen } from '@/lib/story-engine';

// ─── Character avatar ───────────────────────────────────────────────────────

interface AvatarProps {
  char: StoryCharacterDef;
  isSpeaking: boolean;
  emotion: Emotion | undefined;
  /** Flip horizontally so the right-side character faces left. */
  flip?: boolean;
  /** Key changes trigger CSS re-animation. */
  animKey: number;
}

function CharacterAvatar({ char, isSpeaking, emotion, flip, animKey }: AvatarProps) {
  const emotionClass =
    isSpeaking && emotion && emotion !== 'normal'
      ? `emotion-${emotion}`
      : '';

  const baseClass = [
    'transition-all duration-300 flex items-end justify-center',
    isSpeaking ? 'opacity-100 scale-100' : 'opacity-40 scale-90',
    flip ? '-scale-x-100' : '',
  ].join(' ');

  return (
    <div className={baseClass}>
      {char.imageUrl ? (
        <img
          key={animKey}
          src={char.imageUrl}
          alt={char.name}
          draggable={false}
          className={`w-28 h-36 object-contain select-none ${isSpeaking && flip ? '-scale-x-100' : ''} ${emotionClass}`}
        />
      ) : (
        // Placeholder avatar — replace when real art is available
        <div
          key={animKey}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-2xl border-4 ${isSpeaking ? 'border-white/60' : 'border-white/10'} ${emotionClass}`}
          style={{ backgroundColor: char.avatarBg }}
        >
          {char.initials}
        </div>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export interface StorySceneProps {
  event: StoryEvent;
  /** Called after the player finishes or skips the scene. */
  onComplete: () => void;
  /** Called when the player taps the exit button to leave mid-scene. */
  onExit: () => void;
}

export function StoryScene({ event, onComplete, onExit }: StorySceneProps) {
  const [stepIndex, setStepIndex] = useState(0);
  // Snapshot whether this scene was already seen BEFORE this viewing starts.
  const [alreadySeen] = useState(() => isSceneSeen(event.id));
  // Increment this key whenever the step changes to re-trigger CSS animations.
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setStepIndex(0);
    setAnimKey(0);
  }, [event.id]);

  const step = event.steps[stepIndex];
  const isLastStep = stepIndex === event.steps.length - 1;
  const isFirstStep = stepIndex === 0;

  const complete = useCallback(() => {
    markSceneSeen(event.id);
    onComplete();
  }, [event.id, onComplete]);

  const advance = useCallback(() => {
    if (isLastStep) {
      complete();
    } else {
      setStepIndex((i) => i + 1);
      setAnimKey((k) => k + 1);
    }
  }, [isLastStep, complete]);

  const goBack = useCallback(() => {
    if (!isFirstStep) {
      setStepIndex((i) => i - 1);
      setAnimKey((k) => k + 1);
    }
  }, [isFirstStep]);

  const skip = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      complete();
    },
    [complete],
  );

  const handleExit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onExit();
    },
    [onExit],
  );

  const leftChar = event.leftCharacterId ? CHARACTERS[event.leftCharacterId] : null;
  const rightChar = event.rightCharacterId ? CHARACTERS[event.rightCharacterId] : null;
  const speakingCharId = step?.characterId ?? null;

  return (
    /* The overlay is fixed to the viewport, but the scene inside it has to
       match the max-w-md app shell in layout.tsx. Without the inner column the
       characters anchor to the window edges on any desktop-width browser and
       drift far away from the dialogue. */
    <div className="fixed inset-0 z-50 flex justify-center bg-black">
    <div
      className="relative w-full max-w-md h-full flex flex-col select-none overflow-hidden"
      style={
        event.backgroundImage
          ? { backgroundImage: `url(${event.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { background: event.backgroundGradient ?? '#0f172a' }
      }
    >
      {/* Dark vignette */}
      <div className="absolute inset-0 bg-black/50 pointer-events-none" />

      {/* ── Top bar (z-30 so buttons sit above the tap target) ── */}
      <div className="relative z-30 flex items-center gap-2 px-4 pt-5 pb-2">

        {/* Exit button — always visible */}
        <button
          onClick={handleExit}
          aria-label="Exit scene"
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white hover:bg-white/10 transition-colors"
        >
          <X size={14} />
        </button>

        {/* Step progress dots */}
        <div className="flex gap-1.5 items-center flex-1">
          {event.steps.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i < stepIndex
                  ? 'w-2 h-2 bg-white/40'
                  : i === stepIndex
                    ? 'w-3 h-3 bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]'
                    : 'w-2 h-2 bg-white/15'
              }`}
            />
          ))}
        </div>

        {/* Skip button — only visible on revisits */}
        {alreadySeen && (
          <button
            onClick={skip}
            className="shrink-0 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
          >
            Skip ›
          </button>
        )}
      </div>

      {/* ── Character area ── */}
      <div className="relative z-10 flex-1 flex items-end justify-between px-6 pb-2 pointer-events-none">
        {leftChar ? (
          <CharacterAvatar
            char={leftChar}
            isSpeaking={speakingCharId === leftChar.id}
            emotion={speakingCharId === leftChar.id ? step?.emotion : undefined}
            animKey={animKey}
          />
        ) : (
          <div />
        )}

        {rightChar ? (
          <CharacterAvatar
            char={rightChar}
            isSpeaking={speakingCharId === rightChar.id}
            emotion={speakingCharId === rightChar.id ? step?.emotion : undefined}
            flip
            animKey={animKey}
          />
        ) : (
          <div />
        )}
      </div>

      {/* ── Tap target (advances scene) — sits above characters, below dialogue & top bar ── */}
      <div className="absolute inset-0 z-20" onClick={advance} />

      {/* ── Dialogue box (z-30 — above tap target; clicking anywhere advances) ── */}
      <div
        className="relative z-30 bg-slate-900/95 backdrop-blur-md rounded-t-3xl border-t border-white/10 px-5 pt-4 pb-6 min-h-[210px] flex flex-col"
        onClick={(e) => { e.stopPropagation(); advance(); }}
      >
        {/* Speaker name */}
        {speakingCharId ? (
          <p
            className="text-xs font-black uppercase tracking-widest mb-2"
            style={{ color: CHARACTERS[speakingCharId]?.color ?? '#fff' }}
          >
            {CHARACTERS[speakingCharId]?.name ?? speakingCharId}
          </p>
        ) : (
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-400 italic">
            Narrator
          </p>
        )}

        {/* Dialogue text */}
        <p className="text-white text-[15px] leading-relaxed flex-1">{step?.text}</p>

        {/* Bottom row: back button (left) + tap hint (right) */}
        <div className="mt-3 flex justify-between items-center">
          {!isFirstStep ? (
            <button
              onClick={(e) => { e.stopPropagation(); goBack(); }}
              className="text-xs font-bold text-slate-400 hover:text-white transition-colors px-2 py-1 -ml-1 rounded-lg hover:bg-white/10"
            >
              ‹ Back
            </button>
          ) : (
            <div />
          )}

          {isLastStep ? (
            <button
              onClick={(e) => { e.stopPropagation(); complete(); }}
              className="text-xs font-bold text-primary animate-pulse"
            >
              Tap to continue →
            </button>
          ) : (
            <span className="text-[11px] text-slate-500 animate-pulse">tap to continue…</span>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
