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
  // Precompute Set for O(1) saved session check
  const savedSet = new Set(savedSessionIds);

  if (!selectedInterests.length) {
    // Default recommendations based on popularity / featured status
    return sessions
      .filter((s) => !savedSet.has(s.id))
      .map((session) => ({
        session,
        score: session.isFeatured ? 50 : 20,
        matchReasons: session.isFeatured ? ['Featured Summit Session'] : ['Popular Session'],
      }))
      .sort((a, b) => b.score - a.score);
  }

  // Precompute Set for O(1) interest tag checks
  const interestSet = new Set(selectedInterests);
  const results: RecommendedSession[] = [];

  for (const session of sessions) {
    if (savedSet.has(session.id)) continue; // O(1) exclusion check

    let score = 0;
    const matchReasons: string[] = [];

    // Tag matching (40 points per match)
    const matchingTags: string[] = [];
    for (const tag of session.tags) {
      if (interestSet.has(tag)) {
        matchingTags.push(tag);
      }
    }

    if (matchingTags.length > 0) {
      score += matchingTags.length * 40;
      matchReasons.push(`Matches your interest in ${matchingTags.join(', ')}`);
    }

    // Category matching (30 points)
    if (interestSet.has(session.category)) {
      score += 30;
      matchReasons.push(`Fits your preferred track: ${session.category}`);
    }

    // Featured boost (15 points)
    if (session.isFeatured) {
      score += 15;
      matchReasons.push('Trending spotlight session');
    }

    // Open seating boost (10 points)
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
