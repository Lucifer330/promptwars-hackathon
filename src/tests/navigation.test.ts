import { describe, it, expect } from 'vitest';
import { findShortestRoute } from '../utils/pathfinding';
import { INITIAL_LOCATIONS, INITIAL_EDGES } from '../data/mockData';

describe('Navigation & Pathfinding Edge Cases', () => {
  it('returns null when start location ID does not exist', () => {
    const route = findShortestRoute('invalid-start-id', 'loc-main-stage', INITIAL_LOCATIONS, INITIAL_EDGES, false);
    expect(route).toBeNull();
  });

  it('returns null when destination location ID does not exist', () => {
    const route = findShortestRoute('loc-helpdesk', 'invalid-end-id', INITIAL_LOCATIONS, INITIAL_EDGES, false);
    expect(route).toBeNull();
  });

  it('calculates correct step-by-step route and ETA for accessible pathing', () => {
    const route = findShortestRoute('loc-helpdesk', 'loc-firstaid', INITIAL_LOCATIONS, INITIAL_EDGES, true);
    expect(route).not.toBeNull();
    if (route) {
      expect(route.isFullyAccessible).toBe(true);
      expect(route.steps.length).toBeGreaterThan(0);
      expect(route.estimatedMinutes).toBeGreaterThan(0);
      // Verify no step requires stairs
      expect(route.steps.every((s) => !s.requiresStairs)).toBe(true);
    }
  });

  it('correctly flags routes containing stairs when accessibleOnly is false', () => {
    const route = findShortestRoute('loc-workshop-a', 'loc-workshop-b', INITIAL_LOCATIONS, INITIAL_EDGES, false);
    expect(route).not.toBeNull();
    if (route) {
      expect(route.isFullyAccessible).toBe(false);
      expect(route.steps.some((s) => s.requiresStairs)).toBe(true);
    }
  });
});
