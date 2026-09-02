# laundry-catcher (laundrycatcher.youngmomins.com)

**Laundry Catchers: Journey to Umrah** — React 19 + Vite 7 + Tailwind v4 single-page
game. `dist/` is committed to git and deployed as-is; there is no server-side build.

Migrated out of a Replit pnpm monorepo. It is now a plain standalone npm project —
do not reintroduce workspace `catalog:` versions, `@replit/*` plugins, or the
`PORT`/`BASE_PATH` env requirements the Replit `vite.config.ts` had.

## Before touching git push

**Always run `npm run build` before staging/committing, if `src/`, `public/` or
`index.html` changed.** Nothing else in the pipeline rebuilds `dist/` — a push
after a source change with no rebuild ships stale HTML next to fresh source,
silently. See the `dual-push` skill and [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Pushing / deploying

**Always use `git push both main`** to ship a change (GitHub + live site).
Only `main` deploys; never edit files on the server directly (a deploy
overwrites them). Full mechanics in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
and [docs/GIT-REMOTES.md](docs/GIT-REMOTES.md).

## Non-negotiable product rules

- **Frontend-only, forever.** No backend, no database, no cross-device sync
  without explicit sign-off. All state is `localStorage`, which is what keeps the
  game deployable to a plain static docroot.
  Keys: `laundrymon.dex.v1`, `laundrymon.story.v1`, `laundrymon.debug.v1`.
  Use `localStorage`, not `sessionStorage` — progress must survive closing the tab.
- **The hotels are fictional.** Never use a real hotel's name, logo, signage or
  photograph. Location art lives in `src/assets/locations/*.svg` and is
  deliberately illustrated rather than photographic. The four locations are
  Gateway, Courtyard, Tower and Skyline.
  (Photographs of the *holy sites* in `src/assets/story/` are the family's own
  and are fine — that restriction is about hotel brands only.)
- **Fun AND learning, equally.** Story scenes must carry real educational content
  about Islamic rituals and holy sites, written warmly for children. Never reduce
  a scene to pure comedy; never let it become a dry lecture.
- **Item design is object-first.** The laundry object (iron, peg, hanger) must be
  the dominant form — never an animal holding laundry. Rules:
  [docs/item-design-guide.md](docs/item-design-guide.md).

## Where things live

```
src/
  data/
    creatures.ts     — 23 discoverable items (Gateway has 5, the rest 6)
    locations.ts     — the 4 locations, unlock chain + storyGate fields
    story.ts         — visual-novel scene definitions
    journey.ts       — ordered sequence of story Day cards + locations
  lib/
    game-engine.ts   — catch/dex logic          (localStorage laundrymon.dex.v1)
    story-engine.ts  — story-seen tracking      (localStorage laundrymon.story.v1)
    assets.ts        — every image import, in one place
  components/
    story-scene.tsx  — visual novel renderer (tap-to-advance, skip on revisit)
    layout.tsx       — nav bar + music toggle (hidden on /story/* routes)
  pages/             — home, locations (Journey), story, catch, dex, song, settings
  assets/
    story/           — holy-site photographs used as scene backgrounds
    characters/      — character sticker portraits
    locations/       — generic hotel artwork, hand-authored SVG
    audio/           — theme song, catch themes, acapella loop
public/
  .htaccess          — HTTPS, SPA fallback, cache headers (ships to the docroot)
```

## Architecture decisions

- **Story gates locations.** `Location.storyGate` names a story event id that must
  be fully watched before the location unlocks. `isLocationUnlocked()` in
  `use-laundry-dex.ts` checks it via `isSceneSeen()` before the catch-count
  prerequisite.
- **Skip button only on revisit.** `isSceneSeen()` is snapshotted into `useState`
  at scene mount. First viewing has no skip; later viewings get a "Skip ›" chip.
- **`LocationId` is `string`.** Adding a location never means touching types.
- **`isNew` badge** in the catch screen is snapshotted at encounter-roll time, not
  recomputed reactively, so it cannot vanish mid-encounter.
- **Cards always point at something new.** `rollDiscovery()` filters the location
  pool down to items with no `caughtAt`, so hunting a card is progress rather
  than a re-roll of the dex. Only when a location is fully caught does it fall
  back to the whole pool. `resolveLaundryPull()` biases its "different" result
  the same way — the odds are unchanged, only *which* alternative surfaces.
- **Casting auto-pulls.** Cast → wait for the tug → pull happens on its own.
  There is no "Pull the rope!" tap and no `readyToPull` state.
- **Journey screen, not a location grid.** `/locations` renders a vertical
  timeline mixing story Day cards and location cards, ordered by `JOURNEY` in
  `journey.ts`. Add a new `{ kind: 'day', ... }` entry anywhere in that array and
  it automatically gates whatever follows — no routing changes needed.

## Adding a location

1. Add an entry to `LOCATIONS` in `src/data/locations.ts` (order drives UI order).
2. Point `unlockedBy` at the immediately preceding location id, threshold 5.
3. Add 6 items tagged with the new location id in `src/data/creatures.ts`.
4. Draw generic SVG art into `src/assets/locations/`, import it in
   `src/lib/assets.ts`, and add it to `LOCATION_IMAGES`.
5. Add a `{ kind: 'location', ... }` entry to `JOURNEY` in `journey.ts`.

## Gotchas

- **Tailwind v4 emits translate utilities as the standalone `translate` CSS
  property, not `transform`.** So `-translate-x-1/2` stacks *on top of* any
  `transform` a keyframe sets rather than being overridden by it. If an
  animation's keyframes already contain `translate(-50%,-50%)` for centring (as
  `card-to-sea` does), adding the utilities offsets the element by half its own
  width and height. Pick one or the other, never both.

- Layout hides the bottom nav and music toggle on `/story/*`. Any new full-screen
  overlay needs the same `isStoryRoute` check in `layout.tsx`.
- Emotion animations (`emotion-happy`, `emotion-surprised`, `emotion-sad`) are CSS
  keyframes at the bottom of `index.css`, triggered by a `key` prop change on the
  character element when a step advances.
- `isSceneSeen()` inside `isLocationUnlocked()` reads `localStorage` directly, not
  React state — intentional, so the hook stays synchronous. The journey screen
  re-renders via `useStory` state updates.
- **Audio must be imported, never put in `public/`.** Every track lives in
  `src/assets/audio/` and is exported from `AUDIO` in `src/lib/assets.ts`, so
  Vite fingerprints the filename. This is not cosmetic: `public/.htaccess` serves
  `.mp3` with `max-age=31536000, immutable`, and files in `public/` keep a stable
  URL — so replacing a track in place left every returning visitor pinned to the
  old recording for a year, with no way to bust it. Importing means a new
  recording gets a new URL automatically. Dropping an mp3 into `public/audio/`
  reintroduces the bug silently.

## Pointers

- Story writer's guide: [docs/story-narrative.md](docs/story-narrative.md)
- Item design rules: [docs/item-design-guide.md](docs/item-design-guide.md)
