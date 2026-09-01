/**
 * Story events for Laundry Catchers — the visual-novel scenes that introduce
 * Hamza and Enayah's Umrah journey before locations unlock.
 *
 * ─── HOW TO ADD A NEW SCENE ───────────────────────────────────────────────
 * 1. Add a StoryEvent entry to STORY_EVENTS below.
 * 2. Add the event id to JOURNEY in journey.ts.
 * 3. If it gates a location, set unlocksLocationId and add storyGate to
 *    that location's entry in locations.ts.
 * 4. Character images: set imageUrl on the character def below, or leave it
 *    undefined to show the placeholder avatar.
 * 5. Background: import an image in assets.ts and reference it here, or
 *    leave backgroundGradient as the fallback.
 * ──────────────────────────────────────────────────────────────────────────
 */

import { LOCATION_IMAGES, STORY_BACKGROUNDS, CHARACTER_IMAGES } from '@/lib/assets';

export type Emotion = 'normal' | 'happy' | 'sad' | 'surprised';

/** A named character that appears in story scenes. */
export interface StoryCharacterDef {
  id: string;
  name: string;
  /** Color used for the name label in the dialogue box. */
  color: string;
  /** Two-letter initials shown in the placeholder avatar. */
  initials: string;
  /** CSS background color for the placeholder avatar circle. */
  avatarBg: string;
  /**
   * Path to character art (portrait, transparent PNG preferred).
   * Leave undefined to fall back to the initials avatar.
   *
   * → Drop the image in attached_assets/generated_images/ and import it in
   *   assets.ts, then reference it here.
   */
  imageUrl?: string;
}

/** One line of dialogue in a scene. */
export interface StoryStep {
  /** Which character is speaking. null = narration (no character highlighted). */
  characterId: string | null;
  text: string;
  /** Optional emotion applied to the speaking character's avatar this step. */
  emotion?: Emotion;
}

/** A full visual-novel scene. */
export interface StoryEvent {
  id: string;
  /** Short title shown in the Journey list card. */
  title: string;
  /** e.g. "Day 1 · Airport" — shown under the title in the journey card. */
  subtitle?: string;
  /** Journey card accent / icon colour (Tailwind class fragment). */
  accentColor: string;
  /** Emoji icon shown on the journey card. */
  icon: string;
  /** Character id positioned on the left side of the scene. */
  leftCharacterId?: string;
  /** Character id positioned on the right side of the scene. */
  rightCharacterId?: string;
  /**
   * Background image for the scene.
   * If undefined, falls back to backgroundGradient.
   */
  backgroundImage?: string;
  /**
   * CSS gradient string used when no backgroundImage is set.
   * e.g. 'linear-gradient(135deg, #1e3a5f 0%, #0f2027 100%)'
   */
  backgroundGradient?: string;
  /** The ordered dialogue steps. */
  steps: StoryStep[];
  /**
   * When set, completing this scene makes this location accessible.
   * Match to a location's `storyGate` field in locations.ts.
   */
  unlocksLocationId?: string;
}

// ─── Characters ────────────────────────────────────────────────────────────

export const CHARACTERS: Record<string, StoryCharacterDef> = {
  hamza: {
    id: 'hamza',
    name: 'Hamza',
    color: '#60a5fa',   // blue-400
    initials: 'H',
    avatarBg: '#1d4ed8', // blue-700
    imageUrl: CHARACTER_IMAGES.hamza,
  },
  enayah: {
    id: 'enayah',
    name: 'Enayah',
    color: '#f472b6',   // pink-400
    initials: 'E',
    avatarBg: '#be185d', // pink-700
    imageUrl: CHARACTER_IMAGES.hanna,
  },
  ibrahim: {
    id: 'ibrahim',
    name: 'Ibrahim',
    color: '#34d399',   // emerald-400
    initials: 'IB',
    avatarBg: '#065f46', // emerald-900
    imageUrl: CHARACTER_IMAGES.ibrahim,
  },
  musa: {
    id: 'musa',
    name: 'Musa',
    color: '#38bdf8',   // sky-400
    initials: 'M',
    avatarBg: '#0369a1', // sky-700
    imageUrl: CHARACTER_IMAGES.musa,
  },
  hanna: {
    id: 'hanna',
    name: 'Hanna',
    color: '#fb7185',   // rose-400
    initials: 'HA',
    avatarBg: '#9f1239', // rose-900
    imageUrl: CHARACTER_IMAGES.enayah,
  },
  zainab: {
    id: 'zainab',
    name: 'Zainab',
    color: '#c084fc',   // purple-400
    initials: 'Z',
    avatarBg: '#6b21a8', // purple-800
    imageUrl: CHARACTER_IMAGES.zainab,
  },
  isa: {
    id: 'isa',
    name: 'Isa',
    color: '#fbbf24',   // amber-400
    initials: 'IS',
    avatarBg: '#b45309', // amber-700
    imageUrl: CHARACTER_IMAGES.isa,
  },
  ismail: {
    id: 'ismail',
    name: 'Ismail',
    color: '#4ade80',   // green-400
    initials: 'IM',
    avatarBg: '#166534', // green-800
    imageUrl: CHARACTER_IMAGES.ismail,
  },
  ilyas: {
    id: 'ilyas',
    name: 'Ilyas',
    color: '#fb923c',   // orange-400
    initials: 'IL',
    avatarBg: '#9a3412', // orange-800
    imageUrl: CHARACTER_IMAGES.ilyas,
  },
};

// ─── Scene content ─────────────────────────────────────────────────────────

export const STORY_EVENTS: StoryEvent[] = [
  // ── Scene 1 ──────────────────────────────────────────────────────────────
  {
    id: 'airport-layover',
    title: 'A Long Journey Begins',
    subtitle: 'Day 1 · The Airport',
    accentColor: 'from-sky-600 to-indigo-700',
    icon: '✈️',
    leftCharacterId: 'hamza',
    rightCharacterId: 'enayah',
    // ← Replace this gradient with a real airport photo once available.
    // Import the image in assets.ts and set backgroundImage here.
    backgroundGradient: 'linear-gradient(160deg, #0f2027 0%, #1a3a5c 50%, #2d6a9f 100%)',
    steps: [
      {
        characterId: null,
        text: 'After an exhausting flight from Canada, Hamza and his family finally landed in Saudi Arabia, one of the holiest places on Earth.',
      },
      {
        characterId: 'hamza',
        text: 'Enayah! We\'re actually HERE. I can\'t believe it!',
        emotion: 'surprised',
      },
      {
        characterId: 'enayah',
        text: 'I know! Baba says millions of Muslims travel here every single year to perform Umrah. The Prophet Muhammad ﷺ himself walked these very lands.',
        emotion: 'happy',
      },
      {
        characterId: 'hamza',
        text: 'What exactly is Umrah again? I know it\'s important but...',
      },
      {
        characterId: 'enayah',
        text: 'It\'s a sacred pilgrimage to Makkah. Muslims visit the Kaaba, the cube-shaped building that\'s the centre of our qibla, and perform special acts of worship. It\'s not required like Hajj, but it\'s a beautiful gift to give yourself.',
      },
      {
        characterId: 'hamza',
        text: 'And we get to go to Madinah first, right? To see the Prophet\'s ﷺ mosque?',
        emotion: 'happy',
      },
      {
        characterId: 'enayah',
        text: 'Masjid Al-Nabawi! It\'s one of the most beloved places in the world. The Prophet ﷺ is buried there. Mama said even the air feels different.',
        emotion: 'happy',
      },
      {
        characterId: 'hamza',
        text: 'We have a little time before the connecting flight. I spotted a play area down that corridor...',
      },
      {
        characterId: 'enayah',
        text: 'Last one there carries all the suitcases!',
        emotion: 'happy',
      },
    ],
  },

  // ── Scene 2 ──────────────────────────────────────────────────────────────
  {
    id: 'hotel-arrival',
    title: 'Stars Over Madinah',
    subtitle: 'Day 1 · Late Night',
    accentColor: 'from-violet-700 to-slate-800',
    icon: '🌙',
    leftCharacterId: 'hamza',
    rightCharacterId: 'enayah',
    backgroundImage: STORY_BACKGROUNDS['stars-madinah'],
    steps: [
      {
        characterId: null,
        text: 'By the time the family reached their hotel in the heart of Madinah, the stars were already blazing overhead. The city was calm, almost sacred.',
      },
      {
        characterId: 'hamza',
        text: 'My legs feel like cooked spaghetti...',
        emotion: 'sad',
      },
      {
        characterId: 'enayah',
        text: 'Mine too. But we made it, Hamza. We\'re actually in Madinah.',
      },
      {
        characterId: 'hamza',
        text: 'What are we doing tomorrow?',
      },
      {
        characterId: 'enayah',
        text: 'Baba said we\'ll go to Masjid Al-Nabawi for Asr prayer. That\'s the afternoon prayer, the fourth of the five daily prayers Muslims perform.',
      },
      {
        characterId: 'hamza',
        text: 'Five prayers a day... I always knew that, but here it feels... real? Like every prayer actually means something?',
      },
      {
        characterId: 'enayah',
        text: 'It always means something. Fajr at dawn, Dhuhr at midday, Asr in the afternoon, Maghrib just after sunset, and Isha at night. Five moments every day where we stop everything and remember Allah.',
        emotion: 'happy',
      },
      {
        characterId: 'hamza',
        text: 'I want to pray inside the Prophet\'s ﷺ mosque tomorrow. Like, properly, in the actual rows.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'With hearts full of hope, the two siblings drifted off to sleep, dreaming of green domes and golden light.',
      },
    ],
  },

  // ── Scene 3 ──────────────────────────────────────────────────────────────
  {
    id: 'madinah-haram',
    title: 'A Prayer Like No Other',
    subtitle: 'Day 2 · Masjid Al-Nabawi',
    accentColor: 'from-emerald-700 to-teal-800',
    icon: '🕌',
    leftCharacterId: 'hamza',
    rightCharacterId: 'enayah',
    backgroundImage: STORY_BACKGROUNDS['madinah-haram'],
    steps: [
      {
        characterId: null,
        text: 'The next afternoon, Hamza\'s family walked through wide marble plazas toward the green dome of Masjid Al-Nabawi, the mosque of the Prophet ﷺ.',
      },
      {
        characterId: 'hamza',
        text: 'It\'s... enormous. And those giant umbrella things in the courtyard, they\'re like something from a dream.',
        emotion: 'surprised',
      },
      {
        characterId: 'enayah',
        text: 'They unfold to shade everyone from the hot sun! The courtyard holds tens of thousands of people. On Hajj, even more.',
        emotion: 'happy',
      },
      {
        characterId: 'hamza',
        text: 'It\'s so peaceful. Like the whole world outside just... stopped.',
      },
      {
        characterId: 'enayah',
        text: 'That feeling is real. The Prophet ﷺ said that one prayer in this mosque is worth a thousand prayers anywhere else. Allah\'s mercy is especially close here.',
      },
      {
        characterId: 'hamza',
        text: 'A THOUSAND? Then why is anyone standing outside?!',
        emotion: 'surprised',
      },
      {
        characterId: null,
        text: 'The family lined up for Asr prayer. Shoulder to shoulder with worshippers from Canada, Egypt, Indonesia, Nigeria, Pakistan, Bosnia, every nationality on Earth, all facing the same direction, all equal before Allah.',
      },
      {
        characterId: 'hamza',
        text: 'I\'ve never felt so... connected. To something so much bigger than me.',
        emotion: 'happy',
      },
      {
        characterId: 'enayah',
        text: 'That\'s the beauty of Islam. No matter where you\'re from, no matter what language you speak: in prayer, we are one.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'As the family walked home beneath the warm Madinah sun, Hamza felt something shift quietly inside him. A sense of belonging he had never quite felt before.',
      },
    ],
  },

  // ── Scene 4 ──────────────────────────────────────────────────────────────
  {
    id: 'first-card-gateway',
    title: 'The Mysterious Card',
    subtitle: 'Day 2 · Outside the Gateway',
    accentColor: 'from-amber-600 to-orange-700',
    icon: '✨',
    leftCharacterId: 'hamza',
    rightCharacterId: 'enayah',
    backgroundImage: LOCATION_IMAGES['madinah-gateway'],
    unlocksLocationId: 'madinah-gateway',
    steps: [
      {
        characterId: null,
        text: 'On the walk back from the mosque, the family passed in front of the grand Gateway Hotel, just a few steps from the Haram gates.',
      },
      {
        characterId: 'enayah',
        text: 'No wonder all these big hotels are built right here. Pilgrims want to be as close to the mosque as possible.',
      },
      {
        characterId: 'hamza',
        text: 'It makes total sense. If you\'re coming all the way from another country for Umrah, every extra step matters.',
      },
      {
        characterId: null,
        text: 'Suddenly, a side door swung open. A laundry worker in a white uniform stepped out and pressed a small card into Hamza\'s hand, then disappeared back inside before Hamza could say a word.',
      },
      {
        characterId: 'hamza',
        text: 'Uh... it\'s just a hotel laundry pickup card?',
        emotion: 'surprised',
      },
      {
        characterId: 'enayah',
        text: 'Why would a laundry worker give a random kid a laundry card? That\'s... weird.',
      },
      {
        characterId: 'hamza',
        text: 'Maybe they thought I was... wait.',
        emotion: 'surprised',
      },
      {
        characterId: null,
        text: 'The card was heavier than it looked. Gold border. A faint shimmer to the paper. Hamza stared at the Gateway crest printed on the front.',
      },
      {
        characterId: 'hamza',
        text: 'Wait — the middle of the card is changing.',
        emotion: 'surprised',
      },
      {
        characterId: 'enayah',
        text: 'You\'re right. A picture is appearing in the paper.',
      },
      {
        characterId: 'hamza',
        text: 'It shows an ihram cloth. And underneath it says, "Find what the card shows."',
        emotion: 'happy',
      },
      {
        characterId: 'enayah',
        text: 'You made that up.',
      },
      {
        characterId: 'hamza',
        text: 'Maybe the card is a clue. Look — there\'s a tiny clothespin tied to a cord along the edge.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'The picture rippled and slipped into an impossible sea of blue fabric folds inside the card. On the back were three instructions: cast the clothespin, wait for a tug, and pull. The first Laundry Catchers card was ready. The Gateway area is now unlocked.',
      },
    ],
  },

  // ── Scene 5 ──────────────────────────────────────────────────────────────
  {
    id: 'tahajjud-night',
    title: 'The Night Prayer',
    subtitle: 'Day 3 · After Midnight',
    accentColor: 'from-indigo-900 to-slate-900',
    icon: '🌟',
    leftCharacterId: 'hamza',
    rightCharacterId: 'ibrahim',
    backgroundImage: STORY_BACKGROUNDS['tahajjud-night'],
    steps: [
      {
        characterId: null,
        text: 'It was well past midnight. The hotel corridor was silent. Then came a soft knock at the door.',
      },
      {
        characterId: 'ibrahim',
        text: 'Hamza! You\'re awake! Me, Isa, and Ilyas are going to pray Tahajjud on the rooftop. Come join us!',
        emotion: 'happy',
      },
      {
        characterId: 'hamza',
        text: 'Tahajjud? Right now? It\'s past midnight!',
        emotion: 'surprised',
      },
      {
        characterId: 'ibrahim',
        text: 'That\'s the whole point! This is the last third of the night, the very best time to talk to Allah.',
        emotion: 'happy',
      },
      {
        characterId: 'hamza',
        text: 'What makes this time so special?',
      },
      {
        characterId: 'ibrahim',
        text: 'The Prophet ﷺ told us: "Allah descends to the lowest heaven in the last third of every night and calls out: Who is calling upon Me, so I may answer? Who is asking of Me, so I may give? Who seeks My forgiveness, so I may forgive?"',
      },
      {
        characterId: 'hamza',
        text: 'Allah calls out to US? Every single night?!',
        emotion: 'surprised',
      },
      {
        characterId: 'ibrahim',
        text: 'Every night without fail. Tahajjud is a voluntary prayer you pray after waking from sleep. You don\'t have to, but the Prophet ﷺ never missed it. The people closest to Allah are the ones who guard their Tahajjud.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'On the rooftop terrace, four boys spread their prayer mats under a sky blazing with stars. The whole city of Madinah lay below them, still, and sacred.',
      },
      {
        characterId: 'hamza',
        text: 'I\'ve never prayed when everything is this quiet. It feels like... just me and Allah.',
      },
      {
        characterId: 'isa',
        text: 'That\'s exactly it. When you choose to get up while the whole world sleeps, Allah knows. That\'s a sincerity no one can fake. Now let\'s make our du\'a.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'They raised their hands and whispered their prayers into the Madinah night. Hamza had never felt so heard.',
      },
    ],
  },

  // ── Scene 6 ──────────────────────────────────────────────────────────────
  {
    id: 'zamzam-well',
    title: 'The Blessed Water',
    subtitle: 'Day 4 · After Maghrib',
    accentColor: 'from-sky-800 to-teal-900',
    icon: '💧',
    leftCharacterId: 'hamza',
    rightCharacterId: 'musa',
    backgroundImage: STORY_BACKGROUNDS['zamzam-well'],
    steps: [
      {
        characterId: null,
        text: 'After Maghrib prayer, as the violet sky deepened over Madinah, Hamza spotted two familiar faces near the Zamzam water coolers outside the mosque.',
      },
      {
        characterId: 'musa',
        text: 'Hamza! Me and Ismail have been looking for you! Have you had your Zamzam yet?',
        emotion: 'happy',
      },
      {
        characterId: 'hamza',
        text: 'A few sips inside, but I don\'t really know the story behind it.',
        emotion: 'happy',
      },
      {
        characterId: 'musa',
        text: 'Then listen carefully. Thousands of years ago, Prophet Ibrahim ﷺ was commanded by Allah to leave his wife Hajar and their baby Ismail alone in the empty desert near Makkah.',
      },
      {
        characterId: 'hamza',
        text: 'He left them ALONE in the desert?!',
        emotion: 'surprised',
      },
      {
        characterId: 'musa',
        text: 'With complete trust in Allah. Their water ran out quickly. Baby Ismail was crying from thirst. Hajar desperately ran seven times between the hills of Safa and Marwa, searching for any sign of water.',
      },
      {
        characterId: 'hamza',
        text: 'Did she find any?',
      },
      {
        characterId: 'musa',
        text: 'Better. The Angel Jibreel struck the earth with his wing, and water burst from the ground! That spring became the Zamzam well. And it has never stopped flowing in over four thousand years.',
        emotion: 'happy',
      },
      {
        characterId: 'hamza',
        text: 'Four thousand years?! And it\'s still running?',
        emotion: 'surprised',
      },
      {
        characterId: 'musa',
        text: 'Never once dried up. Scientists have studied it. It contains minerals found nowhere else on Earth. The Prophet ﷺ said it\'s blessed, and that it fulfils whatever intention you drink it with.',
        emotion: 'happy',
      },
      {
        characterId: 'hamza',
        text: 'So if I drink it making a du\'a for something I really need...',
      },
      {
        characterId: 'musa',
        text: 'You make your intention before you drink, face the direction of the Kaaba if you can, and drink without stopping. It\'s one of the most powerful acts of worship on this whole journey.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'Hamza filled his cup, closed his eyes, made his intention silently, and drank. Cool, clean, and unlike any water he had ever tasted. Ismail stood beside him, doing the same.',
      },
      {
        characterId: 'hamza',
        text: 'SubhanAllah. That\'s not just water.',
        emotion: 'happy',
      },
    ],
  },

  // ── Scene 7 ──────────────────────────────────────────────────────────────
  {
    id: 'rawdah-salaam',
    title: 'Salaam to the Prophet ﷺ',
    subtitle: 'Day 5 · The Rawdah',
    accentColor: 'from-emerald-800 to-amber-900',
    icon: '🟢',
    leftCharacterId: 'hanna',
    rightCharacterId: 'enayah',
    backgroundImage: STORY_BACKGROUNDS['rawdah'],
    steps: [
      {
        characterId: null,
        text: 'During the women\'s session on the fifth day, Enayah and Hanna stepped into a special section of Masjid Al-Nabawi. The carpet beneath their feet changed from red to green.',
      },
      {
        characterId: 'enayah',
        text: 'Hanna. We\'re in the Rawdah.',
        emotion: 'happy',
      },
      {
        characterId: 'hanna',
        text: 'Why does it feel different here? Even the air feels different.',
        emotion: 'surprised',
      },
      {
        characterId: 'enayah',
        text: 'Because this is what the Prophet ﷺ described as a garden from the gardens of Paradise. Right here. These few metres of green carpet.',
      },
      {
        characterId: 'hanna',
        text: 'An actual piece of Jannah? On Earth? While we\'re alive?!',
        emotion: 'surprised',
      },
      {
        characterId: 'enayah',
        text: 'The Prophet ﷺ said: "Between my house and my minbar is a garden from the gardens of Paradise." Those gold pillars mark the exact edges of the Rawdah. We\'re standing inside it right now.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'Ahead of them stood the golden grille of the blessed chamber. Behind it, the Prophet Muhammad ﷺ rests alongside his companions Abu Bakr and Umar, may Allah be pleased with them.',
      },
      {
        characterId: 'hanna',
        text: 'How do I say salaam to him properly?',
      },
      {
        characterId: 'enayah',
        text: 'Face the chamber and say: "As-salamu alayka ya Rasulullah." Peace be upon you, O Messenger of Allah. He hears every salaam that is sent to him.',
      },
      {
        characterId: 'hanna',
        text: 'He actually hears it? Every one?',
        emotion: 'surprised',
      },
      {
        characterId: 'enayah',
        text: 'The Prophet ﷺ said: "Whoever sends salaam upon me, Allah returns my soul so I may return his salaam." Every. Single. One.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'Hanna stood still. She took a breath. Then, in a voice barely above a whisper, she said her salaam. Something warm and certain settled deep in her chest, like finding something she hadn\'t known she was looking for.',
      },
      {
        characterId: 'hanna',
        text: 'I don\'t ever want to leave this place.',
        emotion: 'happy',
      },
      {
        characterId: 'enayah',
        text: 'Me neither.',
        emotion: 'happy',
      },
    ],
  },

  // ── Scene 8 ──────────────────────────────────────────────────────────────
  {
    id: 'rawdah-friends',
    title: 'The Garden of Paradise',
    subtitle: 'Day 5 · Outside the Rawdah',
    accentColor: 'from-emerald-700 to-green-900',
    icon: '🌿',
    leftCharacterId: 'enayah',
    rightCharacterId: 'zainab',
    backgroundImage: STORY_BACKGROUNDS['rawdah'],
    steps: [
      {
        characterId: null,
        text: 'Coming out of the Rawdah, Enayah and Hanna found Zainab waiting for them in the marble corridor. She had been separated in the crowd.',
      },
      {
        characterId: 'zainab',
        text: 'How was it? Tell me everything. I got pushed to the edge and couldn\'t get in.',
        emotion: 'sad',
      },
      {
        characterId: 'hanna',
        text: 'Zainab. I cried.',
        emotion: 'happy',
      },
      {
        characterId: 'zainab',
        text: 'You? No.',
        emotion: 'surprised',
      },
      {
        characterId: 'hanna',
        text: 'The whole time.',
        emotion: 'sad',
      },
      {
        characterId: 'zainab',
        text: 'I said salaam from a distance. Do you think he still heard it?',
        emotion: 'sad',
      },
      {
        characterId: 'enayah',
        text: 'The Prophet ﷺ said: "Whoever sends salaam upon me, Allah returns my soul so I may return his salaam." Distance doesn\'t matter. He heard you.',
        emotion: 'happy',
      },
      {
        characterId: 'zainab',
        text: 'Every salaam? Every single one?',
        emotion: 'surprised',
      },
      {
        characterId: 'enayah',
        text: 'Every. Single. One.',
        emotion: 'happy',
      },
      {
        characterId: 'zainab',
        text: 'Is praying inside the Rawdah different from praying anywhere else in the mosque?',
      },
      {
        characterId: 'enayah',
        text: 'It\'s one of the most sought-after prayers in the world. People plan their whole trip around those two rakaat. That green carpet is a garden from the gardens of Paradise.',
        emotion: 'happy',
      },
      {
        characterId: 'hanna',
        text: 'Next time we come, we plan better. We get you in. Deal?',
        emotion: 'happy',
      },
      {
        characterId: 'zainab',
        text: 'Deal. And honestly... just being here, even from the edge, felt like more than I can explain.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'The three friends sat together in the cool marble corridor, watching pilgrims pour in and out of the mosque, each one carrying a heart full of something too sacred to name.',
      },
    ],
  },

  // ── Scene 8b: Courtyard card ────────────────────────────────────────────
  {
    id: 'courtyard-card',
    title: 'Another One',
    subtitle: 'Day 5 · Outside the Haram',
    accentColor: 'from-stone-700 to-amber-900',
    icon: '🃏',
    leftCharacterId: 'hamza',
    rightCharacterId: 'isa',
    backgroundGradient: 'linear-gradient(160deg, #1c1007 0%, #3d2a0e 50%, #1a1205 100%)',
    steps: [
      {
        characterId: null,
        text: 'Outside the mosque, the boys found a shaded bench and collapsed onto it. Isa was fanning himself with his cap. Hamza was going through his pocket for his phone when his fingers closed around something card-shaped.',
      },
      {
        characterId: 'hamza',
        text: 'Wait. There is another one.',
        emotion: 'surprised',
      },
      {
        characterId: 'isa',
        text: 'Another what.',
        emotion: 'normal',
      },
      {
        characterId: 'hamza',
        text: 'A hotel card. The Courtyard.',
        emotion: 'happy',
      },
      {
        characterId: 'isa',
        text: 'How do you keep finding these.',
        emotion: 'normal',
      },
      {
        characterId: 'hamza',
        text: 'I think they find me.',
        emotion: 'happy',
      },
      {
        characterId: 'isa',
        text: 'That is not a thing that happens.',
        emotion: 'normal',
      },
      {
        characterId: 'hamza',
        text: 'The picture is appearing now. Whatever it shows, we cast the clothespin into the Laundry Sea and try to bring it back.',
        emotion: 'happy',
      },
      {
        characterId: 'isa',
        text: 'Slightly intimidating.',
        emotion: 'normal',
      },
      {
        characterId: 'hamza',
        text: 'The kind of card that probably notices if your clothes have a wrinkle.',
        emotion: 'happy',
      },
      {
        characterId: 'isa',
        text: 'You need to stop.',
        emotion: 'normal',
      },
      {
        characterId: 'hamza',
        text: 'I\'m just saying. The last card worked.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'Isa did not say it could be real. But he did pocket the card without being asked.',
      },
    ],
  },

  // ── Scene 9: Miqat ───────────────────────────────────────────────────────
  {
    id: 'miqat-ihram',
    title: 'The Call of Ihram',
    subtitle: 'Day 6 · Part 1 · Masjid Dhul Hulayfah',
    accentColor: 'from-stone-600 to-amber-900',
    icon: '🤍',
    leftCharacterId: 'hamza',
    rightCharacterId: 'ibrahim',
    backgroundGradient: 'linear-gradient(160deg, #1c1917 0%, #78350f 100%)',
    steps: [
      {
        characterId: null,
        text: 'Before leaving Madinah, the group of boys made a stop at Masjid Dhul Hulayfah. This was the Miqat, the sacred boundary where every pilgrim coming from Madinah must enter the state of Ihram before continuing toward Makkah.',
      },
      {
        characterId: 'hamza',
        text: 'Why does it look like everyone is wearing the same thing?',
      },
      {
        characterId: 'ibrahim',
        text: 'Because they are. Two white cloths. No stitching. No pockets. No shoes. Just that.',
        emotion: 'happy',
      },
      {
        characterId: 'hamza',
        text: 'That\'s it? No special colours? No marks to show where you\'re from?',
        emotion: 'surprised',
      },
      {
        characterId: 'ibrahim',
        text: 'That\'s exactly the point. A king and a cleaner look identical in Ihram. Everyone stands before Allah the same way: equal, humble, and pure.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'The boys took turns changing into their Ihram. Hamza, Ibrahim, Isa, Ismail, Musa, and Ilyas emerged in matching white: barefoot in sandals, watches off, phones pocketed.',
      },
      {
        characterId: 'hamza',
        text: 'So what do we say now?',
      },
      {
        characterId: 'musa',
        text: 'We make our niyyah, our intention. Say in your heart that you\'re entering Ihram for Umrah. Then say: "Labbaik, Allahumma Labbaik, Labbaik La Sharika laka Labbaik. Inn-al-Hamda Wan-Ni\'mata Laka wal-Mulk, La Sharika Lak."',
      },
      {
        characterId: 'hamza',
        text: 'And what are we not allowed to do anymore?',
      },
      {
        characterId: 'ibrahim',
        text: 'No cutting hair or nails. No perfume. No arguing. No hunting. And some other things.',
        emotion: 'happy',
      },
    ],
  },

  // ── Scene 10: Talbiyyah Road ─────────────────────────────────────────────
  {
    id: 'talbiyyah-road',
    title: 'Labbayk',
    subtitle: 'Day 6 · Part 2 · The Road to Makkah',
    accentColor: 'from-amber-700 to-orange-900',
    icon: '🛣️',
    leftCharacterId: 'enayah',
    rightCharacterId: 'hamza',
    backgroundGradient: 'linear-gradient(160deg, #431407 0%, #78350f 50%, #1c1917 100%)',
    steps: [
      {
        characterId: null,
        text: 'The buses left Madinah in the early hours of the morning. As the city lights faded behind them, something filled the air. A sound that would carry them all the way to Makkah.',
      },
      {
        characterId: 'enayah',
        text: 'Labbaik, Allahumma Labbaik, Labbaik La Sharika laka Labbaik. Inn-al-Hamda Wan-Ni\'mata Laka wal-Mulk, La Sharika Lak.',
        emotion: 'happy',
      },
      {
        characterId: 'hamza',
        text: 'What does it mean?',
      },
      {
        characterId: 'enayah',
        text: '"Here I am, O Allah, here I am. You have no partner. Here I am. Surely all praise and blessing is Yours, and all sovereignty. You have no partner."',
      },
      {
        characterId: 'hamza',
        text: 'That\'s it? Just telling Allah you\'re here?',
        emotion: 'surprised',
      },
      {
        characterId: 'enayah',
        text: 'That\'s everything. You\'re answering a call that Prophet Ibrahim made thousands of years ago. Allah told him to call people to Hajj. Ibrahim said: who will even hear me? Allah said: you call. I\'ll make them hear.',
        emotion: 'happy',
      },
      {
        characterId: 'hamza',
        text: 'So every person saying Labbayk right now... is answering Ibrahim\'s call from thousands of years ago?',
        emotion: 'surprised',
      },
      {
        characterId: 'enayah',
        text: 'Every time. Every pilgrim. Since the day he called. Say it with us.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'The bus filled with voices, soft at first, then louder, then one unbroken sound rolling across the desert road. Hamza said his Talbiyyah for the first time, and felt something ancient and certain rising in his chest.',
      },
    ],
  },

  // ── Scene 11: First Sight of the Kaabah ─────────────────────────────────
  {
    id: 'kaabah-first-sight',
    title: 'The House of Allah',
    subtitle: 'Day 6 · Part 3 · Masjid Al-Haram',
    accentColor: 'from-yellow-700 to-amber-900',
    icon: '🕋',
    leftCharacterId: 'enayah',
    rightCharacterId: 'zainab',
    backgroundImage: STORY_BACKGROUNDS['kaabah'],
    steps: [
      {
        characterId: null,
        text: 'The group entered Masjid Al-Haram. After the crowds, the marble corridors, the sound. Hamza looked up and stopped walking entirely.',
      },
      {
        characterId: 'enayah',
        text: 'Don\'t say anything yet. Just look.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'The Kaabah. Black-draped, ancient, impossibly still at the centre of thousands of circling people.',
      },
      {
        characterId: 'zainab',
        text: 'I\'ve seen pictures my whole life. I wasn\'t ready for it to be... real.',
        emotion: 'surprised',
      },
      {
        characterId: 'hanna',
        text: 'My feet stopped. I literally cannot move.',
        emotion: 'surprised',
      },
      {
        characterId: 'enayah',
        text: 'This is one of the moments you\'ve been saving your dua for. The first sight of the Kaabah. Scholars say dua is accepted right here. Don\'t let it pass.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'The group stood together in the crowd, each one holding something privately in their heart. Hamza made his dua in the language he\'d always thought in, and for the first time, it didn\'t feel small.',
      },
      {
        characterId: 'zainab',
        text: 'Why here, though? What makes this spot so special for dua?',
      },
      {
        characterId: 'enayah',
        text: 'Because here, you know with absolute certainty that He is listening. The House is His. And you are standing at His door.',
        emotion: 'happy',
      },
    ],
  },

  // ── Scene 12: Tawaf ──────────────────────────────────────────────────────
  {
    id: 'tawaf-circles',
    title: 'Seven Circles',
    subtitle: 'Day 6 · Part 3 · Around the Kaabah',
    accentColor: 'from-amber-600 to-yellow-900',
    icon: '🌀',
    leftCharacterId: 'hamza',
    rightCharacterId: 'ibrahim',
    backgroundImage: STORY_BACKGROUNDS['black-stone'],
    steps: [
      {
        characterId: null,
        text: 'Together, the group joined the river of pilgrims circling the Kaabah. This was Tawaf: seven rounds, counterclockwise, beginning and ending at the Black Stone.',
      },
      {
        characterId: 'hamza',
        text: 'Ibrahim, are we going the right way?',
      },
      {
        characterId: 'ibrahim',
        text: 'Counterclockwise. Always. We start each round at the Black Stone, that dark corner with the silver frame. Do you see it?',
        emotion: 'happy',
      },
      {
        characterId: 'hamza',
        text: 'Do we kiss it?',
      },
      {
        characterId: 'ibrahim',
        text: 'If you can reach it. Most people just point from a distance and say Bismillah, Allahu Akbar. The stone came from Jannah itself.',
        emotion: 'happy',
      },
      {
        characterId: 'hamza',
        text: 'From Paradise?',
        emotion: 'surprised',
      },
      {
        characterId: 'ibrahim',
        text: 'It descended whiter than milk. The Prophet ﷺ said it was the sins of people that turned it dark. It will testify for those who touched it with true belief on the Day of Judgement.',
        emotion: 'happy',
      },
      {
        characterId: 'hamza',
        text: 'What do we say while we walk?',
      },
      {
        characterId: 'ibrahim',
        text: 'Whatever is in your heart. Dua, dhikr, Quran. The Prophet ﷺ said nothing was prescribed for Tawaf except the remembrance of Allah.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'Round by round, Hamza found his rhythm. The noise of the crowd faded into something that felt like stillness. By the seventh circuit, he had forgotten to count.',
      },
    ],
  },

  // ── Scene 13: After Tawaf — Two Rakah + Zamzam ──────────────────────────
  {
    id: 'after-tawaf-prayer',
    title: 'Maqam Ibrahim & Zamzam',
    subtitle: 'Day 6 · Part 4 · After the Tawaf',
    accentColor: 'from-sky-700 to-teal-900',
    icon: '💧',
    leftCharacterId: 'enayah',
    rightCharacterId: 'hanna',
    backgroundImage: STORY_BACKGROUNDS['maqam-ibrahim'],
    steps: [
      {
        characterId: null,
        text: 'After the seventh circuit, the group moved toward Maqam Ibrahim, the glass-encased station where Prophet Ibrahim\'s footprint is preserved in rock.',
      },
      {
        characterId: 'hanna',
        text: 'His actual footprint is in there?',
        emotion: 'surprised',
      },
      {
        characterId: 'enayah',
        text: 'He stood on it while building the Kaabah, and Allah softened the stone under his feet. The Quran says: "Take the station of Ibrahim as a place of prayer." So we pray two rakah here.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'The group prayed two rakah behind Maqam Ibrahim, reciting Surah Al-Kafirun in the first and Surah Al-Ikhlas in the second. When they finished, they made long, quiet dua.',
      },
      {
        characterId: 'enayah',
        text: 'Now. Zamzam.',
        emotion: 'happy',
      },
      {
        characterId: 'hanna',
        text: 'The same water Hajar found?',
        emotion: 'surprised',
      },
      {
        characterId: 'enayah',
        text: 'The same spring. Four thousand years and it has never stopped. Drink it with intention. The Prophet ﷺ said Zamzam is for whatever you drink it for.',
        emotion: 'happy',
      },
      {
        characterId: 'hanna',
        text: 'So if I drink it for knowledge...',
      },
      {
        characterId: 'enayah',
        text: 'For knowledge. For health. For anything good your heart is asking for. Make your niyyah before you drink.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'They filled their cups and drank slowly. The water was cool and slightly mineral, like nothing else on Earth. Because it wasn\'t from Earth.',
      },
    ],
  },

  // ── Scene 14: Tower Card ───────────────────────────────────────────────
  {
    id: 'tower-card',
    title: 'A Card Near the Tower',
    subtitle: 'Day 6 · Part 4 · Outside The Tower',
    accentColor: 'from-violet-700 to-purple-900',
    icon: '✨',
    leftCharacterId: 'hamza',
    rightCharacterId: 'ibrahim',
    backgroundImage: STORY_BACKGROUNDS['clock-tower'],
    steps: [
      {
        characterId: null,
        text: 'Before the group headed up to rest at the The Tower hotel, just steps from the Haram gates, Hamza spotted something on the ground near the entrance.',
      },
      {
        characterId: 'hamza',
        text: 'Ibrahim. Another laundry card.',
        emotion: 'surprised',
      },
      {
        characterId: 'ibrahim',
        text: 'Which hotel?',
        emotion: 'happy',
      },
      {
        characterId: 'hamza',
        text: 'The Tower. The picture is hidden, but the clothespin cord is right here. This one is ready for the Laundry Sea too.',
        emotion: 'happy',
      },
      {
        characterId: 'ibrahim',
        text: 'You are so weird.',
        emotion: 'happy',
      },
      {
        characterId: 'hamza',
        text: 'You love it.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'The The Tower area is now unlocked. Explore it before continuing your Umrah. Something is waiting in the shadow of the tower.',
      },
    ],
  },

  // ── Scene 15: Sa'i ───────────────────────────────────────────────────────
  {
    id: 'saee-safa-marwah',
    title: 'Between Two Hills',
    subtitle: 'Day 7 · Safa and Marwah',
    accentColor: 'from-teal-700 to-emerald-900',
    icon: '🏃',
    leftCharacterId: 'hamza',
    rightCharacterId: 'enayah',
    backgroundGradient: 'linear-gradient(160deg, #134e4a 0%, #052e16 100%)',
    steps: [
      {
        characterId: null,
        text: 'Rested, the group made their way to the Sa\'i gallery, the long marble corridor connecting the hills of Safa and Marwah. Seven passes. Back and forth.',
      },
      {
        characterId: 'hamza',
        text: 'Are those the two hills? They just look like... bumps.',
      },
      {
        characterId: 'enayah',
        text: 'The city was built around them. But once they were real desert hills. And a mother named Hajar ran between them for the most important reason in the world.',
        emotion: 'happy',
      },
      {
        characterId: 'hamza',
        text: 'Her son.',
      },
      {
        characterId: 'enayah',
        text: 'Ismail. Prophet Ibrahim had left them alone in the desert with almost no water. Ismail was a baby. Hajar ran seven times, back and forth, looking for help. Looking for water. Looking for anything.',
      },
      {
        characterId: 'hamza',
        text: 'And then Zamzam burst from the ground.',
        emotion: 'surprised',
      },
      {
        characterId: 'enayah',
        text: 'Because of her. Her trust in Allah. Her refusal to stop. We do Sa\'i seven times to remember what she did.',
        emotion: 'happy',
      },
      {
        characterId: 'hamza',
        text: 'So every pilgrim who ever lived has walked between these hills because of what she did?',
        emotion: 'surprised',
      },
      {
        characterId: 'enayah',
        text: 'Every Hajj. Every Umrah. Until the end of time. She didn\'t know her act of trust would become one of the pillars of this religion. She just kept running.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'They began their seven passes. Safa to Marwah, Marwah to Safa, making dua at each hill. By the seventh pass, nobody in the group was in a hurry to finish.',
      },
    ],
  },

  // ── Scene 16: Haircut ────────────────────────────────────────────────────
  {
    id: 'halq-complete',
    title: 'The Final Cut',
    subtitle: 'Day 7 · Completing the Umrah',
    accentColor: 'from-rose-700 to-pink-900',
    icon: '✂️',
    leftCharacterId: 'enayah',
    rightCharacterId: 'zainab',
    backgroundGradient: 'linear-gradient(160deg, #4c0519 0%, #1c1917 100%)',
    steps: [
      {
        characterId: null,
        text: 'The final act of Umrah was the simplest. For the boys: a razor or scissors. For everyone else, three finger-widths of hair, snipped and released.',
      },
      {
        characterId: 'zainab',
        text: 'That\'s really all it is? A haircut?',
        emotion: 'surprised',
      },
      {
        characterId: 'enayah',
        text: 'Halq: shaving for men. Taqsir: cutting a portion for women. It\'s the seal. It marks you coming out of Ihram. The restrictions lift the moment you do it.',
        emotion: 'happy',
      },
      {
        characterId: 'zainab',
        text: 'Can I use perfume again?',
      },
      {
        characterId: 'enayah',
        text: 'Yes. And wear your regular clothes. And argue with your brother.',
        emotion: 'happy',
      },
      {
        characterId: 'zainab',
        text: 'Perfect. I\'ve been saving several arguments for after Umrah.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'Hanna cut three finger-widths of her braid. Zainab did the same. Across the corridor, the boys emerged looking lighter, some shaved, some trimmed, all of them blinking like they\'d just woken up.',
      },
      {
        characterId: 'enayah',
        text: 'That\'s it. Umrah is complete.',
        emotion: 'happy',
      },
      {
        characterId: 'zainab',
        text: 'That\'s it?',
        emotion: 'surprised',
      },
      {
        characterId: 'enayah',
        text: 'Tawaf. Two rakah. Zamzam. Sa\'i. Haircut. Done.',
        emotion: 'happy',
      },
      {
        characterId: 'zainab',
        text: 'SubhanAllah. We actually did it.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'For a moment, none of them said anything. They stood at the edge of Masjid Al-Haram, the Kaabah visible in the distance, and felt something settle inside them that they suspected would never fully leave.',
      },
    ],
  },
  // ── Scene 17: Journey Home ───────────────────────────────────────────────
  {
    id: 'journey-home',
    title: 'Until Next Time',
    subtitle: 'Day 8 · The Airport',
    accentColor: 'from-sky-700 to-indigo-900',
    icon: '✈️',
    leftCharacterId: 'hamza',
    rightCharacterId: 'enayah',
    backgroundGradient: 'linear-gradient(160deg, #0c4a6e 0%, #1e1b4b 100%)',
    steps: [
      {
        characterId: null,
        text: 'Bags packed, taxis booked. The group made their way to the airport with tired feet and very full hearts.',
      },
      {
        characterId: 'hamza',
        text: 'I don\'t want to go.',
      },
      {
        characterId: 'enayah',
        text: 'Nobody ever does. That\'s how you know it meant something.',
        emotion: 'happy',
      },
      {
        characterId: 'hamza',
        text: 'Will we come back?',
      },
      {
        characterId: 'enayah',
        text: 'Make the intention right now, in your heart. "O Allah, bring me back." That\'s all it takes to start.',
        emotion: 'happy',
      },
      {
        characterId: 'hamza',
        text: 'Just like that?',
        emotion: 'surprised',
      },
      {
        characterId: 'enayah',
        text: 'Just like that. And the Prophet ﷺ said: whoever makes Umrah, then another Umrah, what falls between them is forgiven. The intention to return is part of the worship.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'Hamza looked out the airport window at the sky above Makkah. The same sky, but everything felt different now. He made his dua quietly, and meant every word.',
      },
      {
        characterId: 'hamza',
        text: 'Until next time.',
        emotion: 'happy',
      },
      {
        characterId: 'enayah',
        text: 'Until next time.',
        emotion: 'happy',
      },
      {
        characterId: null,
        text: 'Somewhere over the clouds, Hamza reached into his jacket pocket and felt something stiff and rectangular. He pulled it out. A hotel key card. The Skyline. He had no idea when it got there.',
      },
      {
        characterId: 'hamza',
        text: 'Okay but what would the Skyline one look like though.',
        emotion: 'happy',
      },
      {
        characterId: 'enayah',
        text: 'Hamza.',
        emotion: 'normal',
      },
      {
        characterId: 'hamza',
        text: 'Very tall. Very serious. Probably speaks three languages. Extremely good posture.',
        emotion: 'happy',
      },
      {
        characterId: 'enayah',
        text: 'Go to sleep.',
        emotion: 'normal',
      },
      {
        characterId: null,
        text: 'He tucked the card back into his pocket and smiled out the window. Maybe next time.',
      },
    ],
  },
];

/** Lookup a story event by id. */
export function getStoryEvent(id: string): StoryEvent | undefined {
  return STORY_EVENTS.find((e) => e.id === id);
}
