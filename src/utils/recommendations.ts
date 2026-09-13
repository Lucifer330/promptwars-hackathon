import { Session } from '../types';

export interface RecommendedSession {
  session: Session;
  score: number;
  matchReasons: string[];
}

export function getPersonalizedRecommendations(
  sessions: Session[],
  selectedInterests: string[],
  savedSessionIds: string[]
): RecommendedSession[] {
  if (!selectedInterests.length) {
    // Default recommendations based on popularity / featured status
    return sessions
      .filter((s) => !savedSessionIds.includes(s.id))
      .map((session) => ({
        session,
        score: session.isFeatured ? 50 : 20,
        matchReasons: session.isFeatured ? ['Featured Summit Session'] : ['Popular Session'],
      }))
      .sort((a, b) => b.score - a.score);
  }

  const results: RecommendedSession[] = [];

  for (const session of sessions) {
    if (savedSessionIds.includes(session.id)) continue; // Skip already saved sessions

    let score = 0;
    const matchReasons: string[] = [];

    // Tag matching (40 points per match)
    const matchingTags = session.tags.filter((t) => selectedInterests.includes(t));
    if (matchingTags.length > 0) {
      score += matchingTags.length * 40;
      matchReasons.push(`Matches your interest in ${matchingTags.join(', ')}`);
    }

    // Category matching (30 points)
    if (selectedInterests.includes(session.category)) {
      score += 30;
      matchReasons.push(`Fits your preferred track: ${session.category}`);
    }

    // Featured boost (15 points)
    if (session.isFeatured) {
      score += 15;
      matchReasons.push('Trending spotlight session');
    }

    // High capacity remaining boost (10 points)
    const seatPercentage = (session.enrolledCount / session.capacity) * 100;
    if (seatPercentage < 90) {
      score += 10;
      matchReasons.push('Seats currently available');
    }

    if (score > 0) {
      results.push({
        session,
        score,
        matchReasons,
      });
    }
  }

  // Sort descending by score
  return results.sort((a, b) => b.score - a.score);
}
