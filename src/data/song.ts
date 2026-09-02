/**
 * Theme song lyrics — the single source of truth.
 *
 * Displayed by the compact player on Settings (`pages/settings.tsx`). There was
 * a second, unlinked /song screen with its own duplicate copy of this list; the
 * two silently went out of sync when the song was rewritten, and that screen has
 * since been removed. If another player is ever added, import from here rather
 * than pasting a second list.
 *
 * Cue times match `assets/audio/theme-song.mp3`, whose music runs 0.15s-34.20s
 * (the file is 35.97s). Any cue past ~34s would land in the trailing silence.
 */
export interface Lyric {
  time: number;
  text: string;
  /** Triggers the full-screen flash. Nothing sets it on the current song. */
  isSpecial?: boolean;
}

export const LYRICS: Lyric[] = [
  { time: 0, text: "Packing our bags for a journey so grand" },
  { time: 5, text: "Through sacred cities, hand in hand" },
  { time: 10, text: "From white travel cloths to water flasks" },
  { time: 14, text: "Finding every wonder for our journey tasks" },
  { time: 20, text: "Laundry Catchers, we're on our way" },
  { time: 25, text: "Through hotel hallways every day" },
  { time: 30, text: "Laundry Catchers, with joyful hearts aglow" },
];
