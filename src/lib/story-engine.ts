/**
 * Story state persistence — tracks which scenes the player has fully watched.
 *
 * Stored in localStorage under `laundrymon.story.v1` as:
 *   { seenScenes: Record<sceneId, true> }
 *
 * A scene is "seen" the moment the player taps through its last line (or skips,
 * on a revisit). Until then, the Skip button is hidden and the scene must be
 * watched in full.
 */

const STORY_KEY = 'laundrymon.story.v1';

export interface StoryState {
  seenScenes: Record<string, true>;
}

export function getStoryState(): StoryState {
  if (typeof window === 'undefined') return { seenScenes: {} };
  try {
    const raw = window.localStorage.getItem(STORY_KEY);
    if (!raw) return { seenScenes: {} };
    const parsed = JSON.parse(raw) as StoryState;
    if (!parsed?.seenScenes || typeof parsed.seenScenes !== 'object') {
      return { seenScenes: {} };
    }
    return parsed;
  } catch {
    return { seenScenes: {} };
  }
}

function saveStoryState(state: StoryState): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORY_KEY, JSON.stringify(state));
}

/** Returns true if the player has already watched this scene to completion. */
export function isSceneSeen(id: string): boolean {
  return getStoryState().seenScenes[id] === true;
}

/** Marks a scene as fully seen and persists the change. Returns new state. */
export function markSceneSeen(id: string): StoryState {
  const state = getStoryState();
  state.seenScenes[id] = true;
  saveStoryState(state);
  return state;
}

/** Wipes story progress (used by full reset). */
export function resetStoryState(): StoryState {
  const empty: StoryState = { seenScenes: {} };
  saveStoryState(empty);
  return empty;
}
