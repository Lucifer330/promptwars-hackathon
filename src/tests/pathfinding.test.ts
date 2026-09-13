import { describe, it, expect } from 'vitest';
import { findShortestRoute } from '../utils/pathfinding';
import { INITIAL_LOCATIONS, INITIAL_EDGES } from '../data/mockData';

describe('Pathfinding Dijkstra Algorithm', () => {
  it('calculates the shortest route between helpdesk and main stage', () => {
    const route = findShortestRoute('loc-helpdesk', 'loc-main-stage', INITIAL_LOCATIONS, INITIAL_EDGES, false);
    expect(route).not.toBeNull();
    expect(route?.totalDistanceMeters).toBe(40);
    expect(route?.path).toEqual(['loc-helpdesk', 'loc-main-stage']);
  });

  it('returns same node route when start equals destination', () => {
    const route = findShortestRoute('loc-main-stage', 'loc-main-stage', INITIAL_LOCATIONS, INITIAL_EDGES, false);
    expect(route).not.toBeNull();
    expect(route?.totalDistanceMeters).toBe(0);
    expect(route?.estimatedMinutes).toBe(0);
  });

  it('handles accessible route filter bypassing stair-only paths', () => {
    // Standard path to Workshop B includes stairs
    const standardRoute = findShortestRoute('loc-workshop-a', 'loc-workshop-b', INITIAL_LOCATIONS, INITIAL_EDGES, false);
    expect(standardRoute).not.toBeNull();

    // Accessible route only should return null if no stair-free path exists to Workshop B
    const accessibleRoute = findShortestRoute('loc-workshop-a', 'loc-workshop-b', INITIAL_LOCATIONS, INITIAL_EDGES, true);
    expect(accessibleRoute).toBeNull();
  });
});
