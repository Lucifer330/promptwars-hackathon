import { LocationNode, MapEdge, NavigationRoute, RouteStep } from '../types';
import { MinPriorityQueue } from './priorityQueue';

export function findShortestRoute(
  startId: string,
  endId: string,
  locations: LocationNode[],
  edges: MapEdge[],
  accessibleOnly: boolean = false
): NavigationRoute | null {
  if (startId === endId) {
    return {
      path: [startId],
      totalDistanceMeters: 0,
      estimatedMinutes: 0,
      isFullyAccessible: true,
      steps: [
        {
          stepIndex: 1,
          instruction: 'You are already at your destination.',
          fromNode: startId,
          toNode: startId,
          distanceMeters: 0,
          isAccessible: true,
          requiresStairs: false,
        },
      ],
    };
  }

  const locationMap = new Map<string, LocationNode>(locations.map((l) => [l.id, l]));
  if (!locationMap.has(startId) || !locationMap.has(endId)) return null;

  // Build adjacency list
  const adj = new Map<string, MapEdge[]>();
  locations.forEach((loc) => adj.set(loc.id, []));

  edges.forEach((edge) => {
    // If step-free accessible route requested, filter out edges requiring stairs
    if (accessibleOnly && edge.requiresStairs) return;

    if (adj.has(edge.from)) adj.get(edge.from)!.push(edge);
    if (adj.has(edge.to))
      adj.get(edge.to)!.push({
        from: edge.to,
        to: edge.from,
        distance: edge.distance,
        requiresStairs: edge.requiresStairs,
      });
  });

  const distances = new Map<string, number>();
  const previous = new Map<string, { node: string; edge: MapEdge } | null>();
  const pq = new MinPriorityQueue<string>();

  locations.forEach((loc) => {
    distances.set(loc.id, Infinity);
    previous.set(loc.id, null);
  });

  distances.set(startId, 0);
  pq.enqueue(startId, 0);

  while (!pq.isEmpty()) {
    const current = pq.dequeue();
    if (!current) break;
    if (current === endId) break;

    const currentDist = distances.get(current) ?? Infinity;
    const neighbors = adj.get(current) || [];

    for (const edge of neighbors) {
      const alt = currentDist + edge.distance;
      if (alt < (distances.get(edge.to) ?? Infinity)) {
        distances.set(edge.to, alt);
        previous.set(edge.to, { node: current, edge });
        pq.enqueue(edge.to, alt);
      }
    }
  }

  if (distances.get(endId) === Infinity) {
    return null; // Route not reachable (e.g. no step-free path available)
  }

  // Reconstruct path
  const path: string[] = [];
  const edgeList: MapEdge[] = [];
  let curr: string | null = endId;

  while (curr) {
    path.unshift(curr);
    const prevInfo = previous.get(curr);
    if (prevInfo) {
      edgeList.unshift(prevInfo.edge);
      curr = prevInfo.node;
    } else {
      curr = null;
    }
  }

  const totalDistance = distances.get(endId) || 0;
  // Estimated walking speed: ~1.4 m/s => ~70m per minute
  const estimatedMinutes = Math.max(1, Math.ceil(totalDistance / 70));

  let isFullyAccessible = true;
  const steps: RouteStep[] = [];

  for (let i = 0; i < path.length - 1; i++) {
    const fromLoc = locationMap.get(path[i]);
    const toLoc = locationMap.get(path[i + 1]);
    const edge = edgeList[i];

    const hasStairs = edge?.requiresStairs || !toLoc?.isAccessible;
    if (hasStairs) isFullyAccessible = false;

    let instruction = `Walk ${edge.distance}m towards ${toLoc?.name || path[i + 1]}.`;
    if (edge.requiresStairs) {
      instruction += ' (Stairs required - elevator/ramp unavailable on this segment)';
    } else if (fromLoc?.floor !== toLoc?.floor) {
      instruction += ` Take the accessible elevator to Floor ${toLoc?.floor}.`;
    }

    steps.push({
      stepIndex: i + 1,
      instruction,
      fromNode: path[i],
      toNode: path[i + 1],
      distanceMeters: edge.distance,
      isAccessible: !hasStairs,
      requiresStairs: !!edge.requiresStairs,
    });
  }

  return {
    path,
    totalDistanceMeters: totalDistance,
    estimatedMinutes,
    isFullyAccessible,
    steps,
  };
}
