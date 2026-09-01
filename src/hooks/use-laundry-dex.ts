import { useCallback, useEffect, useState } from 'react';
import {
  getCaughtCount,
  getCaughtCountForLocation,
  getDexState,
  getTotalCount,
  getTotalCountForLocation,
  isCaught,
  recordAttempt,
  recordCatch,
  resetDex,
  type DexState,
} from '@/lib/game-engine';
import { isSceneSeen } from '@/lib/story-engine';
import type { Discovery } from '@/data/creatures';
import type { Location } from '@/data/locations';

export function useLaundryDex() {
  const [state, setState] = useState<DexState>({ entries: {} });

  useEffect(() => {
    setState(getDexState());
  }, []);

  const markCaught = useCallback((discovery: Discovery) => {
    setState(recordCatch(discovery));
  }, []);

  const markAttempt = useCallback((discovery: Discovery) => {
    setState(recordAttempt(discovery));
  }, []);

  const reset = useCallback(() => {
    setState(resetDex());
  }, []);

  return {
    state,
    caughtCount: getCaughtCount(state),
    totalCount: getTotalCount(),
    isCreatureCaught: (discoveryId: string) => isCaught(state, discoveryId),
    caughtCountForLocation: (locationId: string) =>
      getCaughtCountForLocation(state, locationId),
    totalCountForLocation: (locationId: string) =>
      getTotalCountForLocation(locationId),
    isLocationUnlocked: (location: Location) => {
      if (location.storyGate && !isSceneSeen(location.storyGate)) return false;
      if (!location.unlockedBy) return true;
      return (
        getCaughtCountForLocation(state, location.unlockedBy.locationId) >=
        location.unlockedBy.uniqueCatchesRequired
      );
    },
    markCaught,
    markAttempt,
    reset,
  };
}
