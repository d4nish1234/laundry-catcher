# Laundry Catchers Item Design Guide

Use this guide when adding a hotel, laundry card, or collection item.

## Product rule

Each card reveals a recognizable garment, travel item, laundry tool, or small keepsake connected to the family's journey. Items are objects, not living mascots or battle characters.

Good items are:

- easy for a child to identify from the illustration;
- connected to travel, hotel life, laundry, Madinah, Makkah, or Umrah;
- described with short factual notes rather than powers or moves;
- visually grounded in the hotel's materials, patterns, and atmosphere;
- presented without rarity tiers, combat stats, or “special creature” language.

## Item checklist

- [ ] The name describes a real object.
- [ ] The silhouette is distinct from the other items at the hotel.
- [ ] The description is warm, concise, and factual.
- [ ] The origin explains where a traveler might encounter it.
- [ ] The details teach three small, age-appropriate facts.
- [ ] The artwork does not turn the object into a recognizable monster-catching character.

## Adding a hotel

1. Add the hotel to `src/data/locations.ts`.
2. Add its place in the sequence to `src/data/journey.ts`.
3. Add five or more items in `src/data/creatures.ts`, using the hotel's exact location id.
4. Add the hotel and item artwork mappings in `src/lib/assets.ts`.
5. If a story scene unlocks the hotel, connect the scene id through `storyGate`.
6. Keep saved-progress compatibility in mind. Existing storage identifiers should not be renamed without a migration.
7. Verify the story gate, card reveal, all three pull outcomes, collection updates, and the next journey unlock.

The first hotel intentionally has five items: Ihram Cloth, Walking Sandals, Modest Tunic, Travel Pouch, and Water Flask.