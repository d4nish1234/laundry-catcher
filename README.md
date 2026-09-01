# Laundry Catchers: Journey to Umrah

A warm, kid-friendly web game. Two Canadian siblings, Hamza and Enayah, travel for
Umrah; between visual-novel story scenes that teach the rituals and the holy
sites, they collect travel items from the "Laundry Sea" using magical hotel
laundry cards.

**Core idea: fun unlocks learning.** A story scene must be watched before the
location it introduces opens, so the educational content is on the critical path
rather than optional.

Live at **https://laundry-catcher.youngmomins.com**

## Stack

React 19 · Vite 7 · TypeScript 5.9 · Tailwind CSS v4 · wouter · shadcn/ui

No backend. No database. No accounts. All state is browser `localStorage`, which
is what lets the whole thing deploy to a plain static docroot.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
```

| Command | Does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run typecheck` | `tsc --noEmit` — **`npm run build` does not typecheck** |
| `npm run build` | Regenerate `dist/` (committed — see below) |
| `npm run preview` | Serve the built `dist/` at :4173 |

## Deploying

`dist/` is committed to git and deployed as-is; nothing builds on the server.

```bash
npm run build
git add -A && git commit -m "..."
git push both main     # GitHub + live site, in one command
```

The `both` remote pushes to GitHub *and* to Namecheap cPanel, and the Namecheap
push is what triggers the rsync deploy. See
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) and
[docs/GIT-REMOTES.md](docs/GIT-REMOTES.md) — and note that remotes are per-clone,
so a fresh clone has to re-add them.

## Layout

```
src/
  data/         creatures.ts, locations.ts, story.ts, journey.ts — all content
  lib/          game-engine.ts, story-engine.ts, assets.ts
  components/   story-scene.tsx, layout.tsx, ui/ (shadcn)
  pages/        home, locations (Journey), story, catch, dex, song, settings
  assets/       story photos, character stickers, location artwork
public/
  audio/        theme song, catch themes, acapella loop
  .htaccess     HTTPS, SPA fallback, cache headers
docs/
  DEPLOYMENT.md            the pipeline, end to end
  GIT-REMOTES.md           the two upstreams and passwordless SSH
  story-narrative.md       writer's guide: characters, themes, future scenes
  item-design-guide.md     object-first rules for new discoveries
```

## Content notes

- **The hotels are fictional.** Locations are Gateway, Courtyard, Tower and
  Skyline, illustrated as hand-authored SVG in `src/assets/locations/`. Do not use
  a real hotel's name, logo, signage or photograph.
- **The holy-site photographs are the family's own** and are used as story-scene
  backgrounds. That is a separate thing from the hotel rule above.
- Adding a story day, a location, or an item is all data-editing in `src/data/` —
  see [CLAUDE.md](CLAUDE.md) for the recipes.

## Origin

Migrated out of a Replit pnpm monorepo (`artifacts/laundrymon`) into a standalone
npm project: workspace `catalog:` versions pinned, `@replit/*` Vite plugins and
the `PORT`/`BASE_PATH` env requirements removed, and assets moved from a sibling
`attached_assets/` directory into `src/assets/`.
