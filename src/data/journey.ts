/**
 * The ordered Laundry Catchers journey — an interleaved sequence of story
 * days and hotel search locations that the player progresses through.
 *
 * ─── STRUCTURE ────────────────────────────────────────────────────────────
 * • kind: 'day'      — groups one or more story scenes under a single card.
 *                      Scenes play sequentially; the day is complete when
 *                      all its scenes are seen. Add as many scenes as you
 *                      like to a day without the journey feeling long.
 * • kind: 'location' — a hotel search area. Unlocks via its own conditions
 *                      (storyGate on the last scene of the preceding day,
 *                      or a discovery-count requirement).
 *
 * ─── HOW TO EXTEND ────────────────────────────────────────────────────────
 * Add a new day between any two items — it automatically gates what follows.
 * Add a new location after its prerequisite day or location.
 * Define scenes in story.ts first, then reference their ids here.
 *
 * To gate a location with a day, set storyGate on the Location (locations.ts)
 * to the id of the LAST scene in the preceding day. The unlock happens when
 * that scene is marked seen, which is the natural end of the day.
 * ──────────────────────────────────────────────────────────────────────────
 */

export interface StoryDay {
  kind: 'day';
  /** Unique id for this day grouping. */
  dayId: string;
  /** Label shown on the journey card, e.g. "Day 1" */
  dayLabel: string;
  /** Title of this chapter, e.g. "Arriving in Madinah" */
  title: string;
  /** Short flavour line shown under the title */
  subtitle?: string;
  /** Emoji shown on the card */
  icon: string;
  /** Tailwind gradient classes for the card background */
  accentColor: string;
  /** Ordered list of story event ids to play in sequence. */
  eventIds: string[];
}

export interface LocationEntry {
  kind: 'location';
  locationId: string;
  /**
   * How many unique discoveries at this location are required before the NEXT
   * item in the journey (a story day or another location) becomes accessible.
   * Leave undefined if this location doesn't gate what follows it.
   */
  catchesRequiredToAdvance?: number;
}

export interface CreditsEntry {
  kind: 'credits';
}

export type JourneyItem = StoryDay | LocationEntry | CreditsEntry;

export const JOURNEY: JourneyItem[] = [
  // ── Day 1 ──────────────────────────────────────────────────────────────
  {
    kind: 'day',
    dayId: 'day-1',
    dayLabel: 'Day 1',
    title: 'Arriving in Madinah',
    subtitle: 'A long flight, a holy city, and two tired kids',
    icon: '✈️',
    accentColor: 'from-sky-700 to-indigo-800',
    eventIds: ['airport-layover', 'hotel-arrival'],
  },

  // ── Day 2 ──────────────────────────────────────────────────────────────
  {
    kind: 'day',
    dayId: 'day-2',
    dayLabel: 'Day 2',
    title: 'The Haram & A Strange Gift',
    subtitle: 'Asr prayer at the Prophet\'s mosque — and something very weird',
    icon: '🕌',
    accentColor: 'from-emerald-700 to-teal-800',
    // Last scene (first-card-gateway) is the storyGate for madinah-gateway
    eventIds: ['madinah-haram', 'first-card-gateway'],
  },

  // ── Locations (unlock via story gate then discovery counts) ──────────────
  // catchesRequiredToAdvance gates the story days that follow.
  { kind: 'location', locationId: 'madinah-gateway', catchesRequiredToAdvance: 5 },

  // ── Day 3 ──────────────────────────────────────────────────────────────
  {
    kind: 'day',
    dayId: 'day-3',
    dayLabel: 'Day 3',
    title: 'The Night Prayer',
    subtitle: 'Midnight on the rooftop — and a prayer that changes everything',
    icon: '🌟',
    accentColor: 'from-indigo-900 to-slate-900',
    eventIds: ['tahajjud-night'],
  },

  // ── Day 4 ──────────────────────────────────────────────────────────────
  {
    kind: 'day',
    dayId: 'day-4',
    dayLabel: 'Day 4',
    title: 'The Blessed Water',
    subtitle: 'After Maghrib, a four-thousand-year-old miracle in a cup',
    icon: '💧',
    accentColor: 'from-sky-800 to-teal-900',
    eventIds: ['zamzam-well'],
  },

  // ── Day 5 ──────────────────────────────────────────────────────────────
  {
    kind: 'day',
    dayId: 'day-5',
    dayLabel: 'Day 5',
    title: 'The Garden of Paradise',
    subtitle: 'A salaam to the Prophet ﷺ — and a garden found on Earth',
    icon: '🌿',
    accentColor: 'from-emerald-700 to-green-900',
    eventIds: ['rawdah-salaam', 'rawdah-friends', 'courtyard-card'],
  },

  { kind: 'location', locationId: 'madinah-courtyard', catchesRequiredToAdvance: 5 },

  // ── Day 6 · Part 1 ─────────────────────────────────────────────────────
  {
    kind: 'day',
    dayId: 'day-6-pt1',
    dayLabel: 'Day 6',
    title: 'The Call of Ihram',
    subtitle: 'Part 1 · The boys change at Miqat',
    icon: '🤍',
    accentColor: 'from-stone-600 to-amber-900',
    eventIds: ['miqat-ihram'],
  },

  // ── Day 6 · Part 2 ─────────────────────────────────────────────────────
  {
    kind: 'day',
    dayId: 'day-6-pt2',
    dayLabel: 'Day 6',
    title: 'Labbayk',
    subtitle: 'Part 2 · The road to Makkah',
    icon: '🛣️',
    accentColor: 'from-amber-700 to-orange-900',
    eventIds: ['talbiyyah-road'],
  },

  // ── Day 6 · Part 3 ─────────────────────────────────────────────────────
  {
    kind: 'day',
    dayId: 'day-6-pt3',
    dayLabel: 'Day 6',
    title: 'The House of Allah',
    subtitle: 'Part 3 · First sight of the Kaabah and Tawaf',
    icon: '🕋',
    accentColor: 'from-yellow-700 to-amber-900',
    eventIds: ['kaabah-first-sight', 'tawaf-circles'],
  },

  // ── Day 6 · Part 4 ─────────────────────────────────────────────────────
  {
    kind: 'day',
    dayId: 'day-6-pt4',
    dayLabel: 'Day 6',
    title: 'Zamzam & A New Card',
    subtitle: 'Part 4 · Two rakah, Zamzam, and the Tower card',
    icon: '💧',
    accentColor: 'from-sky-700 to-teal-900',
    // Last scene (tower-card) is the storyGate for makkah-tower
    eventIds: ['after-tawaf-prayer', 'tower-card'],
  },

  { kind: 'location', locationId: 'makkah-tower', catchesRequiredToAdvance: 5 },

  // ── Day 7 ──────────────────────────────────────────────────────────────
  {
    kind: 'day',
    dayId: 'day-7',
    dayLabel: 'Day 7',
    title: 'Between Two Hills',
    subtitle: 'Sa\'i, and the moment Umrah is complete',
    icon: '✂️',
    accentColor: 'from-teal-700 to-rose-900',
    eventIds: ['saee-safa-marwah', 'halq-complete'],
  },

  // ── Day 8 ──────────────────────────────────────────────────────────────
  {
    kind: 'day',
    dayId: 'day-8',
    dayLabel: 'Day 8',
    title: 'Until Next Time',
    subtitle: 'The journey home — safe, grateful, and already planning the next trip',
    icon: '✈️',
    accentColor: 'from-sky-700 to-indigo-900',
    // Last scene (journey-home) is the storyGate for makkah-skyline
    eventIds: ['journey-home'],
  },

  { kind: 'credits' },

  { kind: 'location', locationId: 'makkah-skyline' },
];

/**
 * Returns the StoryDay that contains the given eventId, or undefined.
 * Used by story.tsx to determine the next scene to play in sequence.
 */
export function getDayForEvent(eventId: string): StoryDay | undefined {
  return JOURNEY.find(
    (item): item is StoryDay =>
      item.kind === 'day' && item.eventIds.includes(eventId),
  );
}

/**
 * Returns the next JourneyItem after the day that contains eventId.
 * Used by story.tsx to route the player when the last scene of a day ends.
 */
export function getNextItemAfterEvent(eventId: string): JourneyItem | undefined {
  const idx = JOURNEY.findIndex(
    (item): item is StoryDay =>
      item.kind === 'day' && item.eventIds.includes(eventId),
  );
  if (idx === -1) return undefined;
  return JOURNEY[idx + 1];
}
