import { useCallback, useState } from 'react';
import {
  getStoryState,
  markSceneSeen,
  resetStoryState,
  type StoryState,
} from '@/lib/story-engine';

/**
 * React hook wrapping the story-state persistence layer (localStorage).
 * Use in any screen that needs to know which scenes have been watched,
 * or needs to mark a scene as complete.
 */
export function useStory() {
  const [state, setState] = useState<StoryState>(() => getStoryState());

  const markSeen = useCallback((id: string) => {
    setState(markSceneSeen(id));
  }, []);

  const reset = useCallback(() => {
    setState(resetStoryState());
  }, []);

  return {
    state,
    isSceneSeen: (id: string): boolean => state.seenScenes[id] === true,
    markSeen,
    reset,
  };
}
