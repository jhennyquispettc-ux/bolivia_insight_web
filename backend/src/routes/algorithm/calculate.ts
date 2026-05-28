import { Graph, Edge } from './Graph';

export type ProfileKey =
  | 'balanced'
  | 'backpacker'
  | 'comfort'
  | 'cable-only'
  | 'no-cable';

export const PROFILE_MULTIPLIERS: Record<ProfileKey, Record<string, number>> = {
  'balanced':   { caminata: 1,   teleferico: 0.8, taxi: 2  },
  'backpacker': { caminata: 1,   teleferico: 1,   taxi: 5  },
  'comfort':    { caminata: 5,   teleferico: 1,   taxi: 1  },
  'cable-only': { caminata: 10,  teleferico: 0.1, taxi: 10 },
  'no-cable':   { caminata: 1.5, teleferico: 100, taxi: 1  },
};

export type PoiLite = {
  slug: string;
  name: string;
  category: string;
  lat: number;
  lon: number;
  visitMinutes: number;
  nodeSlug: string;
};

export type CalculatedSegment = {
  fromSlug: string;
  toSlug: string;
  hops: {
    fromSlug: string;
    toSlug: string;
    mode: string;
    line: string | null;
    minutes: number;
    fromCoord: [number, number];
    toCoord: [number, number];
  }[];
};

export type CalculatedRoute = {
  order: PoiLite[];
  segments: CalculatedSegment[];
  travelMinutes: number;
  stayMinutes: number;
  totalMinutes: number;
};

/**
 * Computes the optimal tourist route given the loaded graph and POI catalog.
 * The graph node slugs must match poi.nodeSlug values for the algorithm to work.
 */
export function calculateRoute(args: {
  graph: Graph;
  poisBySlug: Map<string, PoiLite>;
  selectedSlugs: string[];
  startSlug: string;
  profile: ProfileKey;
  asCircuit: boolean;
}): CalculatedRoute {
  const { graph, poisBySlug, selectedSlugs, startSlug, profile, asCircuit } = args;

  const multipliers = PROFILE_MULTIPLIERS[profile];
  const costFn = (e: Edge) => e.minutes * (multipliers[e.mode] ?? 1);

  const selectedPois = selectedSlugs.map((slug) => {
    const p = poisBySlug.get(slug);
    if (!p) throw new Error(`Unknown POI slug: ${slug}`);
    return p;
  });

  const startPoi = poisBySlug.get(startSlug);
  if (!startPoi) throw new Error(`Unknown start POI: ${startSlug}`);

  // Dijkstra from each selected POI's node → matrix of pair costs and predecessor maps
  const pairCost = new Map<string, number>();
  const predecessorsByOriginSlug = new Map<string, ReturnType<Graph['dijkstra']>['predecessors']>();

  for (const origin of selectedPois) {
    const result = graph.dijkstra(origin.nodeSlug, costFn);
    predecessorsByOriginSlug.set(origin.slug, result.predecessors);

    for (const dest of selectedPois) {
      if (origin.slug === dest.slug) continue;
      const realMinutes = result.realTime.get(dest.nodeSlug);
      if (realMinutes === undefined || realMinutes === Infinity) continue;
      pairCost.set(origin.slug + '||' + dest.slug, realMinutes);
    }
  }

  const { order: orderSlugs, totalMinutes } = tspBacktrack({
    selectedSlugs,
    startSlug,
    asCircuit,
    pairCost,
    visitMinutes: (slug) => poisBySlug.get(slug)?.visitMinutes ?? 0,
  });

  // Build segments by walking predecessor maps
  const segments: CalculatedSegment[] = [];
  for (let i = 0; i < orderSlugs.length - 1; i++) {
    const a = poisBySlug.get(orderSlugs[i])!;
    const b = poisBySlug.get(orderSlugs[i + 1])!;
    const preds = predecessorsByOriginSlug.get(a.slug);
    if (!preds) continue;
    const hops = graph.reconstructPath(preds, b.nodeSlug);

    segments.push({
      fromSlug: a.slug,
      toSlug:   b.slug,
      hops: hops.map((h) => {
        const fromInfo = graph.getNode(h.fromSlug);
        const toInfo   = graph.getNode(h.toSlug);
        return {
          fromSlug:  h.fromSlug,
          toSlug:    h.toSlug,
          mode:      h.mode,
          line:      h.line ?? null,
          minutes:   h.minutes,
          fromCoord: [fromInfo?.lat ?? 0, fromInfo?.lon ?? 0] as [number, number],
          toCoord:   [toInfo?.lat   ?? 0, toInfo?.lon   ?? 0] as [number, number],
        };
      }),
    });
  }

  const travelMinutes = segments.reduce(
    (acc, seg) => acc + seg.hops.reduce((s, h) => s + h.minutes, 0),
    0,
  );
  const stayMinutes = Math.max(0, totalMinutes - travelMinutes);

  const order: PoiLite[] = orderSlugs.map((slug) => poisBySlug.get(slug)!);

  return { order, segments, travelMinutes, stayMinutes, totalMinutes };
}

// Standalone TSP backtracking using POI slugs (not graph node slugs). Visit
// minutes resolved via callback so we don't need to mutate Graph state.
function tspBacktrack(args: {
  selectedSlugs: string[];
  startSlug: string;
  asCircuit: boolean;
  pairCost: Map<string, number>;
  visitMinutes: (slug: string) => number;
}): { order: string[]; totalMinutes: number } {
  const { selectedSlugs, startSlug, asCircuit, pairCost, visitMinutes } = args;
  const N = selectedSlugs.length;
  if (N === 1) return { order: [startSlug], totalMinutes: 0 };

  let bestCost = Infinity;
  let bestOrder: string[] = [];

  const explore = (current: string, path: string[], costSoFar: number) => {
    if (costSoFar >= bestCost) return;
    if (path.length === N) {
      let finalCost = costSoFar;
      if (asCircuit) {
        const back = pairCost.get(current + '||' + startSlug);
        if (back === undefined) return;
        finalCost += back;
      }
      if (finalCost < bestCost) {
        bestCost = finalCost;
        bestOrder = [...path];
        if (asCircuit) bestOrder.push(startSlug);
      }
      return;
    }
    for (const candidate of selectedSlugs) {
      if (path.includes(candidate)) continue;
      const c = pairCost.get(current + '||' + candidate);
      if (c === undefined) continue;
      path.push(candidate);
      explore(candidate, path, costSoFar + c + visitMinutes(candidate));
      path.pop();
    }
  };

  explore(startSlug, [startSlug], visitMinutes(startSlug));

  if (bestCost === Infinity) {
    throw new Error('No valid route found through the selected POIs');
  }
  return { order: bestOrder, totalMinutes: bestCost };
}
