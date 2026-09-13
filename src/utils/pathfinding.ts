import { LocationNode, MapEdge, NavigationRoute, RouteStep } from '../types';

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
    // If accessibleOnly requested, exclude edges requiring stairs
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
  const unvisited = new Set<string>();

  locations.forEach((loc) => {
    distances.set(loc.id, Infinity);
    previous.set(loc.id, null);
    unvisited.add(loc.id);
  });

  distances.set(startId, 0);

  while (unvisited.size > 0) {
    // Find node with minimum distance
    let current: string | null = null;
    let minDistance = Infinity;

    unvisited.forEach((nodeId) => {
      const d = distances.get(nodeId) ?? Infinity;
      if (d < minDistance) {
        minDistance = d;
        current = nodeId;
      }
    });

    if (!current || minDistance === Infinity) break;
    if (current === endId) break;

    unvisited.delete(current);

    const neighbors = adj.get(current) || [];
    for (const edge of neighbors) {
      if (!unvisited.has(edge.to)) continue;

      const alt = minDistance + edge.distance;
      if (alt < (distances.get(edge.to) ?? Infinity)) {
        distances.set(edge.to, alt);
        previous.set(edge.to, { node: current, edge });
      }
    }
  }

  if (distances.get(endId) === Infinity) {
    return null; // Route not found (e.g. no accessible path available)
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
  // Estimate walking speed ~ 1.4 m/s => ~ 84 meters per minute
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
