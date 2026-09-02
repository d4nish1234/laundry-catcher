// Every image the app imports, in one place.
//
// Assets live under src/assets/ and are imported (not referenced by URL) so
// Vite fingerprints them and they survive being served from a subdirectory.
//
//   src/assets/story/      — photographs used as story-scene backgrounds
//   src/assets/characters/ — character sticker portraits
//   src/assets/locations/  — generic, unbranded hotel artwork (SVG)
//
// NOTE: location art is deliberately illustrated rather than photographic.
// The hotels in this game are fictional — do not swap in photos of real
// properties or use real hotel names. See CLAUDE.md.

// ── Story-scene backgrounds ──────────────────────────────────────────────────
import bgMadinahHaram from '@/assets/story/madinah-haram.jpeg';
import bgMaqamIbrahim from '@/assets/story/maqam-ibrahim.jpeg';
import bgBlackStone from '@/assets/story/black-stone.jpeg';
import bgKaabah from '@/assets/story/kaabah.jpeg';
import bgClockTower from '@/assets/story/clock-tower.jpeg';
import bgStarsMadinah from '@/assets/story/stars-madinah.jpeg';
import bgZamzamWell from '@/assets/story/zamzam-well.jpeg';
import bgRawdah from '@/assets/story/rawdah.jpeg';
import bgTahajjudNight from '@/assets/story/tahajjud-night.jpeg';

// ── Location artwork ─────────────────────────────────────────────────────────
import bgTitle from '@/assets/locations/title-bg.svg';
import locationGateway from '@/assets/locations/gateway.svg';
import locationCourtyard from '@/assets/locations/courtyard.svg';
import locationTower from '@/assets/locations/tower.svg';
import locationSkyline from '@/assets/locations/skyline.svg';

// ── Audio ────────────────────────────────────────────────────────────────────
// Imported, NOT referenced as /audio/*.mp3 from public/. Files in public/ keep a
// stable URL, and the production .htaccess serves .mp3 with
// `max-age=31536000, immutable` — so replacing a track in place left every
// returning visitor pinned to the old one for a year. Importing makes Vite
// fingerprint the filename, so a new recording gets a new URL automatically.
import audioThemeSong from '@/assets/audio/theme-song.mp3';
import audioAcapella from '@/assets/audio/acapella.mp3';
import audioCatchTheme from '@/assets/audio/catch-theme.mp3';
import audioCatchThemeB from '@/assets/audio/catch-theme-b.mp3';

export const AUDIO = {
  themeSong: audioThemeSong,
  acapella: audioAcapella,
  catchTheme: audioCatchTheme,
  catchThemeB: audioCatchThemeB,
};

// ── Story character portraits ────────────────────────────────────────────────
import charHamza from '@/assets/characters/hamza.png';
import charEnayah from '@/assets/characters/enayah.png';
import charIbrahim from '@/assets/characters/ibrahim.png';
import charMusa from '@/assets/characters/musa.png';
import charHanna from '@/assets/characters/hanna.png';
import charZainab from '@/assets/characters/zainab.png';
import charIsa from '@/assets/characters/isa.png';
import charIsmail from '@/assets/characters/ismail.png';
import charIlyas from '@/assets/characters/ilyas.png';

export const CHARACTER_IMAGES: Record<string, string> = {
  hamza: charHamza,
  enayah: charEnayah,
  ibrahim: charIbrahim,
  musa: charMusa,
  hanna: charHanna,
  zainab: charZainab,
  isa: charIsa,
  ismail: charIsmail,
  ilyas: charIlyas,
};

export const BACKGROUNDS = {
  title: bgTitle,
};

export const STORY_BACKGROUNDS: Record<string, string> = {
  'madinah-haram': bgMadinahHaram,
  'stars-madinah': bgStarsMadinah,
  'zamzam-well': bgZamzamWell,
  rawdah: bgRawdah,
  'tahajjud-night': bgTahajjudNight,
  'maqam-ibrahim': bgMaqamIbrahim,
  'black-stone': bgBlackStone,
  kaabah: bgKaabah,
  'clock-tower': bgClockTower,
};

export const LOCATION_IMAGES: Record<string, string> = {
  'madinah-gateway': locationGateway,
  'madinah-courtyard': locationCourtyard,
  'makkah-tower': locationTower,
  'makkah-skyline': locationSkyline,
};
