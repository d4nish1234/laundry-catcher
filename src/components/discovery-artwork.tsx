import type { CSSProperties } from 'react';
import type { Discovery } from '@/data/creatures';

const ITEM_SYMBOLS: Record<string, string> = {
  faisalotl: '🤍',
  sarahchu: '🩴',
  'kaiser-sarahchu': '👕',
  'anwar-iron-wing': '👝',
  giadillo: '🚰',
  'yusuf-peg': '🧷',
  khalidon: '🧖',
  zubairatu: '🧣',
  'rima-rollette': '🏷️',
  'hamza-hanger': '🪵',
  'courtyard-lantern': '🏮',
  'farhan-scrubbo': '🧹',
  'layluna-tub': '◻️',
  'rashid-steamer': '👘',
  'dhobi-hamper': '🧺',
  'nadim-lint': '🛋️',
  'tower-crystal': '💎',
  'bilal-softener': '🧴',
  'majid-scoop': '🥄',
  'skyline-spinner': '🧵',
  'fatin-rack': '🌙',
  'nura-mesh': '🫧',
  'crescent-presser': '🥻',
};

interface DiscoveryArtworkProps {
  discovery: Discovery;
  className?: string;
  decorative?: boolean;
  style?: CSSProperties;
}

export function DiscoveryArtwork({
  discovery,
  className = '',
  decorative = false,
  style,
}: DiscoveryArtworkProps) {
  return (
    <div
      className={`relative isolate flex items-center justify-center overflow-hidden rounded-3xl border border-amber-200/40 bg-gradient-to-br from-amber-50 via-stone-100 to-sky-100 shadow-inner ${className}`}
      style={style}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : discovery.name}
    >
      <div className="absolute inset-0 opacity-35 [background-image:repeating-linear-gradient(135deg,transparent_0,transparent_9px,rgba(15,23,42,0.12)_10px,transparent_11px)]" />
      <div className="absolute inset-x-3 bottom-2 h-2 rounded-full bg-slate-900/10 blur-sm" />
      <span className="relative select-none text-[3.4em] leading-none drop-shadow-[0_5px_4px_rgba(15,23,42,0.22)]" aria-hidden>
        {ITEM_SYMBOLS[discovery.id] ?? '🧳'}
      </span>
    </div>
  );
}