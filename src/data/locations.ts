// Laundry Catchers locations — each hotel area has its own laundry-card pool.
//
// ─── HOW TO ADD A NEW LOCATION ────────────────────────────────────────────
// 1. Add a new entry to LOCATIONS below (keep the order: it drives UI order).
// 2. Set `unlockedBy` to the immediately preceding location's id with the
//    project-wide threshold (currently 3). This creates a linear unlock
//    chain: players must discover 3 unique items from hotel N before
//    hotel N+1 opens. The first location never has `unlockedBy`.
// 3. Add travel items tagged with the new location's id in creatures.ts.
// 4. Add a background image entry in assets.ts under LOCATION_IMAGES.
// 5. Drop the background photo in attached_assets/generated_images/.
// ──────────────────────────────────────────────────────────────────────────

export interface Location {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  /**
   * When set, this location is locked until the named story scene has been
   * fully watched (or skipped on a revisit). Use this for the first location
   * in a story arc — the scene dramatically "reveals" the location to the
   * player.
   *
   * Value must match a StoryEvent id in story.ts.
   * Example: storyGate: 'first-card-gateway'
   */
  storyGate?: string;
  /**
   * When set, this location is hard-locked until the player has caught the
   * specified number of **unique** items from the preceding location.
   *
   * Convention: always point at the immediately preceding entry in LOCATIONS
   * so the chain is linear (Gateway → Courtyard → Tower → Skyline → …).
   *
   * Example for a new 5th location:
   *   unlockedBy: { locationId: 'makkah-skyline', uniqueCatchesRequired: 3 }
   */
  unlockedBy?: {
    locationId: string;
    uniqueCatchesRequired: number;
  };
}

export const LOCATIONS: Location[] = [
  {
    id: 'madinah-gateway',
    name: 'The Gateway Hotel',
    shortName: 'Gateway',
    tagline: 'Gate-side hustle, day and night',
    description:
      'A hotel attendant has handed over the first shimmering laundry card. Reveal its picture, then search the rolling folds of the Laundry Sea.',
    // Gated by the story scene where Hamza first receives the laundry card.
    storyGate: 'first-card-gateway',
  },
  {
    id: 'madinah-courtyard',
    name: 'The Courtyard Hotel',
    shortName: 'Courtyard',
    tagline: 'Striped arches and fresh linen',
    description:
      'Beneath the Courtyard\'s striped stone archways, another set of laundry cards waits among the scent of oud and freshly pressed linen.',
    unlockedBy: { locationId: 'madinah-gateway', uniqueCatchesRequired: 3 },
  },
  {
    id: 'makkah-tower',
    name: 'The Tower Hotel',
    shortName: 'Tower',
    tagline: 'Warm wood, warmer service',
    description:
      'Behind the ornate mashrabiya lattice and the soft glow of the Tower\'s chandeliers, each card points toward a useful garment or travel keepsake.',
    storyGate: 'tower-card',
    unlockedBy: { locationId: 'madinah-courtyard', uniqueCatchesRequired: 3 },
  },
  {
    id: 'makkah-skyline',
    name: 'The Skyline Hotel',
    shortName: 'Skyline',
    tagline: 'Golden lattice, crisp standards',
    description:
      'Framed by the Skyline\'s soaring gold geometric archway, the final cards drift through a calm Laundry Sea of crisp folds and precise patterns.',
    storyGate: 'journey-home',
    unlockedBy: { locationId: 'makkah-tower', uniqueCatchesRequired: 3 },
  },
];

export function getLocationById(id: string): Location | undefined {
  return LOCATIONS.find((l) => l.id === id);
}
