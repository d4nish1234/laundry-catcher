export type Edition = 'standard' | 'bronze' | 'silver' | 'gold';
export type Material = 'cotton' | 'wool' | 'silk' | 'linen' | 'woven' | 'metal' | 'wood' | 'scent' | 'leather';

export interface Detail {
  name: string;
  description: string;
}

export interface Discovery {
  id: string;
  dexNumber: number;
  name: string;
  edition: Edition;
  material: Material;
  secondaryMaterial?: Material;
  tagline: string;
  description: string;
  origin: string;
  visualHint: string;
  details: Detail[];
  locationId: string;
}

export const EDITION_CONFIG: Record<Edition, { label: string; weight: number; discoverChance: number; color: string }> = {
  standard: { label: 'Standard', weight: 45, discoverChance: 0.9, color: '#a3a3a3' },
  bronze: { label: 'Bronze', weight: 30, discoverChance: 0.75, color: '#cd7f32' },
  silver: { label: 'Silver', weight: 17, discoverChance: 0.6, color: '#c0c0c0' },
  gold: { label: 'Gold', weight: 8, discoverChance: 0.4, color: '#fbbf24' },
};

export const CREATURES: Discovery[] = [
  // The Gateway â first hotel
  {
    id: 'faisalotl',
    dexNumber: 1,
    name: 'Ihram Cloth',
    edition: 'standard',
    material: 'cotton',
    tagline: 'The Sacred Towels',
    description: 'Two pure white, unstitched cotton cloths. Simple, humbling, and the great equalizer of all pilgrims.',
    origin: 'Neatly folded in a pristine travel bag',
    visualHint: 'Soft, bright white folded fabric with a warm aura',
    details: [
      { name: 'Purity', description: 'Represents entering a state of consecration.' },
      { name: 'Simplicity', description: 'No stitches, no seams, no worldly status.' },
      { name: 'Preparation', description: 'Worn before crossing the Miqat.' }
    ],
    locationId: 'madinah-gateway',
  },
  {
    id: 'sarahchu',
    dexNumber: 2,
    name: 'Walking Sandals',
    edition: 'standard',
    material: 'leather',
    tagline: 'The Trusty Companions',
    description: 'Comfortable, well-worn sandals that have traversed the marble courtyards of the Haram many times.',
    origin: 'Waiting patiently by the hotel door',
    visualHint: 'Sturdy leather sandals resting on a vibrant prayer rug',
    details: [
      { name: 'Tawaf Ready', description: 'Endless circles made easier.' },
      { name: 'Marble Grip', description: 'Prevents slipping on smooth polished floors.' },
      { name: 'Breathable', description: 'Keeps the pilgrim cool under the desert sun.' }
    ],
    locationId: 'madinah-gateway',
  },
  {
    id: 'kaiser-sarahchu',
    dexNumber: 3,
    name: 'Modest Tunic',
    edition: 'bronze',
    material: 'linen',
    tagline: 'The Breathable Garb',
    description: 'A flowing, modest tunic that offers protection from the sun while allowing the desert breeze to pass through.',
    origin: 'Hung near an open hotel window',
    visualHint: 'A soft, beige linen tunic gently blowing in the wind',
    details: [
      { name: 'Sun Shield', description: 'Deflects the harsh midday rays.' },
      { name: 'Modesty', description: 'Graceful and dignified appearance.' },
      { name: 'Comfort', description: 'Loose fitting for long walks.' }
    ],
    locationId: 'madinah-gateway',
  },
  {
    id: 'anwar-iron-wing',
    dexNumber: 4,
    name: 'Travel Pouch',
    edition: 'bronze',
    material: 'woven',
    tagline: 'The Secure Keeper',
    description: 'A sturdy woven pouch worn across the chest, holding essential documents, a little money, and hotel keys.',
    origin: 'Tucked safely under a garment',
    visualHint: 'A secure, zippered pouch with intricate geometric weaving',
    details: [
      { name: 'Safe Keep', description: 'Protects valuables in crowded places.' },
      { name: 'Quick Access', description: 'Always right where you need it.' },
      { name: 'Discreet', description: 'Sits close to the heart.' }
    ],
    locationId: 'madinah-gateway',
  },
  {
    id: 'giadillo',
    dexNumber: 5,
    name: 'Water Flask',
    edition: 'silver',
    material: 'metal',
    tagline: 'The Zamzam Vessel',
    description: 'A resilient metal flask designed to carry the blessed water of Zamzam, keeping it cool throughout the day.',
    origin: 'Filled at the cooling stations in the courtyard',
    visualHint: 'A gleaming metallic flask with condensation on the outside',
    details: [
      { name: 'Cooling Draught', description: 'Provides instant refreshment.' },
      { name: 'Blessed Carrier', description: 'Holds the purest water.' },
      { name: 'Durable', description: 'Survives being dropped on marble.' }
    ],
    locationId: 'madinah-gateway',
  },
  // The Courtyard
  {
    id: 'yusuf-peg',
    dexNumber: 7,
    name: 'Wooden Clothespin',
    edition: 'standard',
    material: 'wood',
    tagline: 'The Balcony Grip',
    description: 'A simple wooden clip holding garments fast to the drying lines across the hotel balconies.',
    origin: 'Clipped onto drying lines in the warm breeze',
    visualHint: 'A classic wooden clothespin',
    details: [
      { name: 'Firm Hold', description: 'Resists the strongest desert winds.' },
      { name: 'Sun Dried', description: 'Helps garments dry naturally.' },
      { name: 'Simple Tool', description: 'Unassuming but essential.' }
    ],
    locationId: 'madinah-courtyard',
  },
  {
    id: 'khalidon',
    dexNumber: 8,
    name: 'Fresh Towel',
    edition: 'standard',
    material: 'cotton',
    tagline: 'The Crisp Comfort',
    description: 'A thick, perfectly white towel offering comfort after a long day of travel and prayer.',
    origin: 'Stacked neatly in the hotel bathroom',
    visualHint: 'Fluffy white towel folded perfectly',
    details: [
      { name: 'Refresh', description: 'Wipes away the fatigue of the journey.' },
      { name: 'Absorb', description: 'Soft and highly absorbent.' },
      { name: 'Pristine', description: 'Immaculately clean.' }
    ],
    locationId: 'madinah-courtyard',
  },
  {
    id: 'zubairatu',
    dexNumber: 9,
    name: 'Woven Scarf',
    edition: 'bronze',
    material: 'woven',
    tagline: 'The Elegant Drape',
    description: 'A beautifully patterned scarf that adds a touch of grace while keeping the chill of the evening away.',
    origin: 'Draped elegantly over a chair',
    visualHint: 'A scarf with subtle, intricate patterns in earth tones',
    details: [
      { name: 'Evening Warmth', description: 'Perfect for the cooler nights in Madinah.' },
      { name: 'Style', description: 'Adds character to simple garments.' },
      { name: 'Versatile', description: 'Can be used as a makeshift prayer mat.' }
    ],
    locationId: 'madinah-courtyard',
  },
  {
    id: 'rima-rollette',
    dexNumber: 10,
    name: 'Luggage Tag',
    edition: 'bronze',
    material: 'leather',
    tagline: 'The Journey Marker',
    description: 'A well-stamped tag bearing the marks of multiple airports and spiritual journeys.',
    origin: 'Securely fastened to a rolling suitcase',
    visualHint: 'A worn leather tag with flight details',
    details: [
      { name: 'Identification', description: 'Ensures nothing gets lost in the crowd.' },
      { name: 'Travel History', description: 'A silent witness to many miles.' },
      { name: 'Sturdy Strap', description: 'Never breaks off.' }
    ],
    locationId: 'madinah-courtyard',
  },
  {
    id: 'hamza-hanger',
    dexNumber: 11,
    name: 'Cedar Incense',
    edition: 'silver',
    material: 'scent',
    tagline: 'The Welcoming Aroma',
    description: 'A small block of fragrant cedar wood that fills the hotel lobby with a calming, spiritual scent.',
    origin: 'Gently smoldering in a brass burner',
    visualHint: 'Wisps of fragrant smoke rising from a beautiful burner',
    details: [
      { name: 'Calming', description: 'Relaxes the mind upon entering.' },
      { name: 'Fragrance', description: 'Lingers pleasantly on clothes.' },
      { name: 'Tradition', description: 'A staple of Arabian hospitality.' }
    ],
    locationId: 'madinah-courtyard',
  },
  {
    id: 'courtyard-lantern',
    dexNumber: 12,
    name: 'Golden Lantern',
    edition: 'gold',
    material: 'metal',
    tagline: 'The Guiding Light',
    description: 'An ornate lantern reflecting the beautiful golden light of the hotel\'s arches during dusk.',
    origin: 'Hanging near the grand entrance',
    visualHint: 'A beautiful brass lantern emitting warm golden light',
    details: [
      { name: 'Illumination', description: 'Casts beautiful geometric shadows.' },
      { name: 'Welcome', description: 'Beckons travelers inside.' },
      { name: 'Craftsmanship', description: 'An intricate work of art.' }
    ],
    locationId: 'madinah-courtyard',
  },
  // The Tower
  {
    id: 'farhan-scrubbo',
    dexNumber: 13,
    name: 'Bristle Brush',
    edition: 'standard',
    material: 'wood',
    tagline: 'The Dust Remover',
    description: 'A stiff-bristled brush perfect for removing the fine desert dust from garments after a long day.',
    origin: 'Kept handy in the travel bag',
    visualHint: 'A sturdy wooden brush with natural bristles',
    details: [
      { name: 'Clean Sweep', description: 'Leaves clothes looking pristine.' },
      { name: 'Stiff Bristles', description: 'Tough on dirt, gentle on fabric.' },
      { name: 'Handheld', description: 'Easy to use on the go.' }
    ],
    locationId: 'makkah-tower',
  },
  {
    id: 'layluna-tub',
    dexNumber: 14,
    name: 'Marble Tile',
    edition: 'standard',
    material: 'woven',
    tagline: 'The Cool Foundation',
    description: 'A small, smooth piece of marble, reminiscent of the cool courtyards of the Grand Mosque.',
    origin: 'Resting on a display shelf',
    visualHint: 'A polished, pale marble tile with subtle veins',
    details: [
      { name: 'Cool Touch', description: 'Always cold, no matter the weather.' },
      { name: 'Solid Ground', description: 'Unwavering and strong.' },
      { name: 'Reflection', description: 'Shines beautifully in the light.' }
    ],
    locationId: 'makkah-tower',
  },
  {
    id: 'rashid-steamer',
    dexNumber: 15,
    name: 'Steamed Thobe',
    edition: 'bronze',
    material: 'cotton',
    tagline: 'The Wrinkle-Free Garb',
    description: 'A perfectly pressed thobe, hanging elegantly and ready for the Friday prayer.',
    origin: 'Hanging on a valet stand',
    visualHint: 'A crisp, white garment free of any creases',
    details: [
      { name: 'Immaculate', description: 'Shows respect for the sacred places.' },
      { name: 'Fresh', description: 'Smells faintly of hotel pressing services.' },
      { name: 'Ready', description: 'Perfect for immediate wear.' }
    ],
    locationId: 'makkah-tower',
  },
  {
    id: 'dhobi-hamper',
    dexNumber: 16,
    name: 'Woven Basket',
    edition: 'bronze',
    material: 'woven',
    tagline: 'The Gathering Place',
    description: 'A sturdy basket that holds garments securely, crafted with traditional patterns.',
    origin: 'Resting in the corner of the room',
    visualHint: 'A beautifully woven palm-frond basket',
    details: [
      { name: 'Containment', description: 'Keeps everything organized.' },
      { name: 'Traditional', description: 'Made using age-old techniques.' },
      { name: 'Sturdy', description: 'Holds more than it appears.' }
    ],
    locationId: 'makkah-tower',
  },
  {
    id: 'nadim-lint',
    dexNumber: 17,
    name: 'Velvet Cushion',
    edition: 'silver',
    material: 'silk',
    tagline: 'The Soft Rest',
    description: 'A plush cushion found in the hotel lobbies, offering a soft place to rest after performing Tawaf.',
    origin: 'Arranged on a luxurious lobby sofa',
    visualHint: 'A rich, deep-colored velvet pillow with tassels',
    details: [
      { name: 'Comfort', description: 'Eases weary muscles.' },
      { name: 'Luxury', description: 'A touch of elegance.' },
      { name: 'Support', description: 'Perfect for sitting and reflecting.' }
    ],
    locationId: 'makkah-tower',
  },
  {
    id: 'tower-crystal',
    dexNumber: 18,
    name: 'Chandelier Crystal',
    edition: 'gold',
    material: 'metal',
    tagline: 'The Prism of Light',
    description: 'A brilliant crystal from the grand chandeliers, scattering light into a thousand colors across the lobby.',
    origin: 'Suspended high above, catching the light',
    visualHint: 'A gleaming teardrop crystal refracting golden light',
    details: [
      { name: 'Refraction', description: 'Bends light beautifully.' },
      { name: 'Grandeur', description: 'A symbol of the grand hotels.' },
      { name: 'Clarity', description: 'Perfectly transparent.' }
    ],
    locationId: 'makkah-tower',
  },
  // The Skyline Hotel
  {
    id: 'bilal-softener',
    dexNumber: 19,
    name: 'Rosewater Bottle',
    edition: 'standard',
    material: 'scent',
    tagline: 'The Sweet Splash',
    description: 'A small glass bottle of rosewater used to freshen the hands and face during the journey.',
    origin: 'Sitting on the vanity counter',
    visualHint: 'A delicate glass bottle with pink liquid inside',
    details: [
      { name: 'Refreshment', description: 'A quick splash revives the senses.' },
      { name: 'Floral Aroma', description: 'Leaves a subtle, sweet scent.' },
      { name: 'Hospitality', description: 'Often offered to guests.' }
    ],
    locationId: 'makkah-skyline',
  },
  {
    id: 'majid-scoop',
    dexNumber: 20,
    name: 'Silver Scoop',
    edition: 'standard',
    material: 'metal',
    tagline: 'The Measure of Care',
    description: 'An elegant measuring scoop used in traditional perfumeries or for high-end washing powders.',
    origin: 'Resting beside a container of fine powder',
    visualHint: 'A small, ornate silver measuring scoop',
    details: [
      { name: 'Precision', description: 'Always the exact right amount.' },
      { name: 'Elegance', description: 'A mundane task made beautiful.' },
      { name: 'Shine', description: 'Polished to a mirror finish.' }
    ],
    locationId: 'makkah-skyline',
  },
  {
    id: 'skyline-spinner',
    dexNumber: 21,
    name: 'Archway Tapestry',
    edition: 'bronze',
    material: 'woven',
    tagline: 'The Woven Geometry',
    description: 'A heavy tapestry displaying the Moorish horseshoe arches famous in the region\'s architecture.',
    origin: 'Hanging grandly on a wide wall',
    visualHint: 'A rich tapestry with intricate geometric arch designs',
    details: [
      { name: 'Artistry', description: 'Complex and mesmerizing.' },
      { name: 'Insulation', description: 'Keeps the heat of the day out.' },
      { name: 'Heritage', description: 'Tells a story of design.' }
    ],
    locationId: 'makkah-skyline',
  },
  {
    id: 'fatin-rack',
    dexNumber: 22,
    name: 'Crescent Frame',
    edition: 'bronze',
    material: 'metal',
    tagline: 'The Golden Arc',
    description: 'A decorative metal frame shaped like a crescent moon, often seen adorning the highest peaks.',
    origin: 'Mounted high in the atrium',
    visualHint: 'A shining golden crescent catching the light',
    details: [
      { name: 'Symbolism', description: 'A recognized sign of faith and time.' },
      { name: 'Gleam', description: 'Catches the sun perfectly.' },
      { name: 'Elevation', description: 'Always placed in a place of honor.' }
    ],
    locationId: 'makkah-skyline',
  },
  {
    id: 'nura-mesh',
    dexNumber: 23,
    name: 'Delicate Mesh Bag',
    edition: 'silver',
    material: 'woven',
    tagline: 'The Gentle Protector',
    description: 'A fine mesh bag used to protect the most delicate of garments during washing.',
    origin: 'Tucked away in the laundry hamper',
    visualHint: 'A soft, white woven mesh bag with a zipper',
    details: [
      { name: 'Protection', description: 'Keeps delicate threads safe.' },
      { name: 'Breathable', description: 'Allows water and soap to flow freely.' },
      { name: 'Gentle', description: 'Soft to the touch.' }
    ],
    locationId: 'makkah-skyline',
  },
  {
    id: 'crescent-presser',
    dexNumber: 24,
    name: 'Royal Garment',
    edition: 'gold',
    material: 'silk',
    tagline: 'The Grand Robe',
    description: 'A magnificent robe featuring intricate golden embroidery, usually reserved for special occasions and Eid.',
    origin: 'Displayed proudly in a hotel boutique window',
    visualHint: 'A luxurious dark fabric adorned with heavy gold embroidery',
    details: [
      { name: 'Elegance', description: 'Stunning craftsmanship.' },
      { name: 'Celebration', description: 'Worn on days of joy.' },
      { name: 'Heirloom', description: 'Passed down through generations.' }
    ],
    locationId: 'makkah-skyline',
  }
];

export function getCreaturesForLocation(locationId: string): Discovery[] {
  return CREATURES.filter(c => c.locationId === locationId);
}
