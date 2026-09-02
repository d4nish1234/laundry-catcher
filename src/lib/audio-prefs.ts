/**
 * The player's audio preference.
 * Stored in localStorage under `laundrymon.audio.v1`.
 *
 * Muting is a preference, not a per-screen state: once set it must survive
 * navigation AND a reload, and every ambient track in the app has to honour it.
 * See the mute rules in CLAUDE.md.
 */

const AUDIO_KEY = 'laundrymon.audio.v1';

interface AudioPrefs {
  muted: boolean;
}

function getAudioPrefs(): AudioPrefs {
  if (typeof window === 'undefined') return { muted: false };
  try {
    const raw = window.localStorage.getItem(AUDIO_KEY);
    if (!raw) return { muted: false };
    return { muted: false, ...(JSON.parse(raw) as Partial<AudioPrefs>) };
  } catch {
    return { muted: false };
  }
}

function saveAudioPrefs(prefs: AudioPrefs): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(AUDIO_KEY, JSON.stringify(prefs));
  } catch {
    /* private mode / storage disabled — preference just won't persist */
  }
}

/** True when the player has muted background music. */
export function isMutedPref(): boolean {
  return getAudioPrefs().muted;
}

/** Persists the player's mute preference. */
export function setMutedPref(muted: boolean): void {
  saveAudioPrefs({ ...getAudioPrefs(), muted });
}
