import { describe, it, expect } from 'vitest';
import { getPersonalizedRecommendations } from '../utils/recommendations';
import { INITIAL_SESSIONS } from '../data/mockData';

describe('Explainable Recommendation Engine', () => {
  it('returns high score matching sessions for user selected interest tags', () => {
    const userInterests = ['AI & Data', 'LLMs'];
    const savedIds: string[] = [];

    const recommendations = getPersonalizedRecommendations(INITIAL_SESSIONS, userInterests, savedIds);

    expect(recommendations.length).toBeGreaterThan(0);
    // Keynote or Workshop with AI & Data tag should rank top
    const topMatch = recommendations[0];
    expect(topMatch.score).toBeGreaterThan(30);
    expect(topMatch.matchReasons.some((r) => r.includes('AI & Data') || r.includes('LLMs'))).toBe(true);
  });

  it('excludes already saved session IDs from recommendation list', () => {
    const userInterests = ['AI & Data'];
    const savedIds = ['sess-101'];

    const recommendations = getPersonalizedRecommendations(INITIAL_SESSIONS, userInterests, savedIds);
    expect(recommendations.some((r) => r.session.id === 'sess-101')).toBe(false);
  });
});
