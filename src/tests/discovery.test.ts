import { describe, it, expect } from 'vitest';
import { getPersonalizedRecommendations } from '../utils/recommendations';
import { INITIAL_SESSIONS } from '../data/mockData';

describe('Event Discovery & Recommendation Engine Edge Cases', () => {
  it('returns default featured/popular recommendations when user has selected no interests', () => {
    const recommendations = getPersonalizedRecommendations(INITIAL_SESSIONS, [], []);
    expect(recommendations.length).toBeGreaterThan(0);
    // Featured session should score highest in fallback mode
    expect(recommendations[0].matchReasons).toContain('Featured Summit Session');
  });

  it('handles empty session array gracefully without throwing', () => {
    const recommendations = getPersonalizedRecommendations([], ['AI & Data'], []);
    expect(recommendations).toEqual([]);
  });

  it('ranks sessions with multiple matching interest tags higher', () => {
    const userInterests = ['AI & Data', 'LLMs', 'Workshop'];
    const recommendations = getPersonalizedRecommendations(INITIAL_SESSIONS, userInterests, []);

    // Workshop session with AI & Data + LLMs tags should rank highest
    const topMatch = recommendations[0];
    expect(topMatch.session.tags).toContain('AI & Data');
    expect(topMatch.score).toBeGreaterThan(50);
  });

  it('does not recommend sessions when all sessions are saved in user agenda', () => {
    const allSessionIds = INITIAL_SESSIONS.map((s) => s.id);
    const recommendations = getPersonalizedRecommendations(INITIAL_SESSIONS, ['AI & Data'], allSessionIds);
    expect(recommendations).toEqual([]);
  });
});
