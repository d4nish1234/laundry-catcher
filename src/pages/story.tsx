import { useParams, useLocation } from 'wouter';
import { useCallback } from 'react';
import { StoryScene } from '@/components/story-scene';
import { getStoryEvent } from '@/data/story';
import { getDayForEvent, getNextItemAfterEvent } from '@/data/journey';

/**
 * Full-screen story scene route: /story/:eventId
 *
 * Scenes play as part of a StoryDay. When one scene ends, the next scene
 * in the same day starts automatically. When the last scene of a day ends,
 * the player is returned to the Journey screen (/locations).
 */
export default function StoryPage() {
  const params = useParams<{ eventId: string }>();
  const [, navigate] = useLocation();

  const eventId = params.eventId ?? '';
  const event = getStoryEvent(eventId);

  const handleComplete = useCallback(() => {
    // If there's another scene in the same day, go to it.
    const day = getDayForEvent(eventId);
    if (day) {
      const idx = day.eventIds.indexOf(eventId);
      const nextSceneId = day.eventIds[idx + 1];
      if (nextSceneId) {
        navigate(`/story/${nextSceneId}`);
        return;
      }
    }

    // Last scene of the day — route by whatever comes next in the journey.
    const next = getNextItemAfterEvent(eventId);
    if (next) {
      if (next.kind === 'location') {
        navigate(`/catch/${next.locationId}`);
        return;
      }
      if (next.kind === 'day') {
        navigate(`/story/${next.eventIds[0]}`);
        return;
      }
      if (next.kind === 'credits') {
        navigate('/credits');
        return;
      }
    }

    // End of journey or no next item → back to Journey map.
    navigate('/locations');
  }, [eventId, navigate]);

  if (!event) {
    return (
      <div className="min-h-full bg-slate-900 flex items-center justify-center text-slate-400 p-8 text-center">
        <p>Scene not found.<br />Head back to the Journey to continue.</p>
      </div>
    );
  }

  return <StoryScene event={event} onComplete={handleComplete} onExit={() => navigate('/locations')} />;
}
