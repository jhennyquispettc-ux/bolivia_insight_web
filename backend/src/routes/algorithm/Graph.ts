import { PriorityQueue } from './PriorityQueue';

export type TransportMode = 'caminata' | 'teleferico' | 'taxi';

export type NodeInfo = {
  type: string;
  lat: number;
  lon: number;
  visitMinutes: number;
};

export type Edge = {
  from: string;
  to: string;
  minutes: number;
  mode: TransportMode | string;
  line?: string | null;
};

export type DijkstraResult = {
  distances: Map<string, number>;
  realTime: Map<string, number>;
  predecessors: Map<string, { prevId: string; mode: string; minutes: number; line?: string | null }>;
};

export type Hop = {
  fromSlug: string;
  toSlug: string;
  mode: string;
  minutes: number;
  line?: string | null;
};

export class Graph {
  private adjacency = new Map<string, Edge[]>();
  private nodeInfo = new Map<string, NodeInfo>();

  addNode(id: string, info: NodeInfo): void {
    if (!this.adjacency.has(id)) this.adjacency.set(id, []);
    this.nodeInfo.set(id, info);
  }

  addEdge(edge: Edge): void {
    if (!this.adjacency.has(edge.from)) this.adjacency.set(edge.from, []);
    this.adjacency.get(edge.from)!.push(edge);
  }

  hasNode(id: string): boolean {
    return this.adjacency.has(id);
  }

  getNode(id: string): NodeInfo | undefined {
    return this.nodeInfo.get(id);
  }

  neighbors(id: string): Edge[] {
    return this.adjacency.get(id) ?? [];
  }

  ids(): string[] {
    return Array.from(this.adjacency.keys());
  }

  /**
   * Dijkstra with a flexible cost function (defaults to edge.minutes).
   * Tracks both weighted cost (distances) and real-time minutes (realTime).
   */
  dijkstra(originId: string, costFn?: (e: Edge) => number): DijkstraResult {
    const cost = costFn ?? ((e: Edge) => e.minutes);
    const distances = new Map<string, number>();
    const realTime = new Map<string, number>();
    const predecessors = new Map<string, { prevId: string; mode: string; minutes: number; line?: string | null }>();
    const visited = new Set<string>();

    for (const id of this.ids()) {
      distances.set(id, Infinity);
      realTime.set(id, Infinity);
    }
    distances.set(originId, 0);
    realTime.set(originId, 0);

    const queue = new PriorityQueue<string>();
    queue.push(originId, 0);

    while (!queue.isEmpty()) {
      const top = queue.pop()!;
      const current = top.element;
      if (visited.has(current)) continue;
      visited.add(current);
      const currentDist = distances.get(current)!;

      for (const edge of this.neighbors(current)) {
        const neighbor = edge.to;
        const newDist = currentDist + cost(edge);
        if (newDist < (distances.get(neighbor) ?? Infinity)) {
          distances.set(neighbor, newDist);
          realTime.set(neighbor, (realTime.get(current) ?? 0) + edge.minutes);
          predecessors.set(neighbor, {
            prevId: current,
            mode: edge.mode,
            minutes: edge.minutes,
            line: edge.line ?? null,
          });
          queue.push(neighbor, newDist);
        }
      }
    }

    return { distances, realTime, predecessors };
  }

  /**
   * Reconstructs the chain of hops from origin to destination using predecessors.
   */
  reconstructPath(
    predecessors: DijkstraResult['predecessors'],
    destinationId: string,
  ): Hop[] {
    const hops: Hop[] = [];
    let currentId = destinationId;
    while (predecessors.has(currentId)) {
      const info = predecessors.get(currentId)!;
      hops.push({
        fromSlug: info.prevId,
        toSlug:   currentId,
        mode:     info.mode,
        minutes:  info.minutes,
        line:     info.line ?? null,
      });
      currentId = info.prevId;
    }
    hops.reverse();
    return hops;
  }
}
