/**
 * Debug/developer flags for Laundry Catchers.
 * Stored in localStorage under `laundrymon.debug.v1`.
 *
 * These flags are intentionally toggled from the Settings screen and have
 * no effect in any production build gate — they're purely for testing.
 */

const DEBUG_KEY = 'laundrymon.debug.v1';

interface DebugState {
  catchRate100: boolean;
}

function getDebugState(): DebugState {
  if (typeof window === 'undefined') return { catchRate100: false };
  try {
    const raw = window.localStorage.getItem(DEBUG_KEY);
    if (!raw) return { catchRate100: false };
    return { catchRate100: false, ...(JSON.parse(raw) as Partial<DebugState>) };
  } catch {
    return { catchRate100: false };
  }
}

function saveDebugState(state: DebugState): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DEBUG_KEY, JSON.stringify(state));
}

/** Returns true when the 100% catch-rate debug flag is on. */
export function isDebugCatchRate100(): boolean {
  return getDebugState().catchRate100;
}

/** Enables or disables the 100% catch-rate debug flag. */
export function setDebugCatchRate100(enabled: boolean): void {
  saveDebugState({ ...getDebugState(), catchRate100: enabled });
}
