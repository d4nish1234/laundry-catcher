import { CREATURES, getCreaturesForLocation, type Discovery } from '@/data/creatures';
import { isDebugCatchRate100 } from './debug';

const STORAGE_KEY = 'laundrymon.dex.v1';

export interface DexEntry {
  creatureId: string;
  caughtAt: string; // ISO date
  attempts: number;
}

export interface DexState {
  entries: Record<string, DexEntry>;
}

function loadDexState(): DexState {
  if (typeof window === 'undefined') return { entries: {} };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { entries: {} };
    const parsed = JSON.parse(raw) as DexState;
    if (!parsed || typeof parsed !== 'object' || !parsed.entries) {
      return { entries: {} };
    }
    return parsed;
  } catch {
    return { entries: {} };
  }
}

function saveDexState(state: DexState): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function rollDiscovery(locationId: string): Discovery {
  const locationItems = getCreaturesForLocation(locationId);
  const pool = locationItems.length > 0 ? locationItems : CREATURES;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  return picked ?? CREATURES[0];
}

export type LaundryPullOutcome = 'expected' | 'different' | 'nothing';

export interface LaundryPullResult {
  outcome: LaundryPullOutcome;
  discovery: Discovery | null;
}

/**
 * Resolve a pull independently from the card target.
 * A pull can return the pictured item, another local item, or an empty clip.
 */
export function resolveLaundryPull(expected: Discovery): LaundryPullResult {
  if (isDebugCatchRate100()) {
    return { outcome: 'expected', discovery: expected };
  }

  const roll = Math.random();
  if (roll < 0.55) {
    return { outcome: 'expected', discovery: expected };
  }

  if (roll < 0.8) {
    const alternatives = getCreaturesForLocation(expected.locationId).filter(
      (item) => item.id !== expected.id,
    );
    if (alternatives.length > 0) {
      return {
        outcome: 'different',
        discovery: alternatives[Math.floor(Math.random() * alternatives.length)],
      };
    }
  }

  return { outcome: 'nothing', discovery: null };
}

export function recordCatch(discovery: Discovery): DexState {
  const state = loadDexState();
  const existing = state.entries[discovery.id];
  state.entries[discovery.id] = {
    creatureId: discovery.id,
    caughtAt: existing?.caughtAt || new Date().toISOString(),
    attempts: (existing?.attempts ?? 0) + 1,
  };
  saveDexState(state);
  return state;
}

export function recordAttempt(discovery: Discovery): DexState {
  const state = loadDexState();
  const existing = state.entries[discovery.id];
  if (existing) {
    existing.attempts += 1;
  } else {
    state.entries[discovery.id] = {
      creatureId: discovery.id,
      caughtAt: '',
      attempts: 1,
    };
  }
  saveDexState(state);
  return state;
}

export function isCaught(state: DexState, discoveryId: string): boolean {
  return Boolean(state.entries[discoveryId]?.caughtAt);
}

export function getDexState(): DexState {
  return loadDexState();
}

export function getCaughtCount(state: DexState): number {
  return Object.values(state.entries).filter((e) => e.caughtAt).length;
}

export function getTotalCount(): number {
  return CREATURES.length;
}

export function getCaughtCountForLocation(
  state: DexState,
  locationId: string,
): number {
  const locationCreatureIds = new Set(
    getCreaturesForLocation(locationId).map((c) => c.id),
  );
  return Object.values(state.entries).filter(
    (e) => e.caughtAt && locationCreatureIds.has(e.creatureId),
  ).length;
}

export function getTotalCountForLocation(locationId: string): number {
  return getCreaturesForLocation(locationId).length;
}

export function resetDex(): DexState {
  const empty: DexState = { entries: {} };
  saveDexState(empty);
  return empty;
}
