// Standalone analyzer: detects POI pairs whose shortest in-graph path is much
// longer than the straight-line walking distance, and lists missing direct
// edges that should be added.

const fs = require('fs');
const path = require('path');

const pois = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-data/laPaz/pois.json'), 'utf-8'));
const graph = JSON.parse(fs.readFileSync(path.join(__dirname, 'seed-data/laPaz/grafo.json'), 'utf-8'));

// Build adjacency for Dijkstra (real minutes, expanding bidirectional)
const adj = new Map();
for (const n of graph.nodos) adj.set(n.id, []);
for (const e of graph.aristas) {
  if (!adj.has(e.origen)) adj.set(e.origen, []);
  adj.get(e.origen).push({ to: e.destino, min: e.tiempo, mode: e.modo, line: e.linea });
  if (e.bidireccional) {
    if (!adj.has(e.destino)) adj.set(e.destino, []);
    adj.get(e.destino).push({ to: e.origen, min: e.tiempo, mode: e.modo, line: e.linea });
  }
}

function haversine(a, b) {
  const R = 6371000;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLon = (b.lon - a.lon) * Math.PI / 180;
  const la1 = a.lat * Math.PI / 180;
  const la2 = b.lat * Math.PI / 180;
  const x = Math.sin(dLat/2)**2 + Math.cos(la1)*Math.cos(la2)*Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

// Walking time at 4.5 km/h (slower than ideal due to La Paz altitude + slopes)
function walkMinutes(distMeters) {
  return Math.max(1, Math.round((distMeters / 4500) * 60));
}

function dijkstra(originId) {
  const dist = new Map();
  const prev = new Map();
  for (const id of adj.keys()) dist.set(id, Infinity);
  dist.set(originId, 0);
  const visited = new Set();
  // simple O(V^2) Dijkstra (graph is small)
  while (true) {
    let u = null, best = Infinity;
    for (const [id, d] of dist) {
      if (!visited.has(id) && d < best) { best = d; u = id; }
    }
    if (u === null) break;
    visited.add(u);
    for (const e of adj.get(u) || []) {
      const nd = dist.get(u) + e.min;
      if (nd < dist.get(e.to)) { dist.set(e.to, nd); prev.set(e.to, { from: u, mode: e.mode, min: e.min, line: e.line }); }
    }
  }
  return { dist, prev };
}

function reconstruct(prev, target) {
  const hops = [];
  let cur = target;
  while (prev.has(cur)) {
    const p = prev.get(cur);
    hops.push({ from: p.from, to: cur, mode: p.mode, min: p.min, line: p.line });
    cur = p.from;
  }
  return hops.reverse();
}

// Existing direct edges between POI nodes (so we know what's missing)
const directEdge = new Set();
for (const e of graph.aristas) {
  directEdge.add(e.origen + '||' + e.destino);
  if (e.bidireccional) directEdge.add(e.destino + '||' + e.origen);
}

// Map nodeId -> POI (only POIs, not stations)
const poiByNode = new Map();
for (const p of pois) poiByNode.set(p.idNodo, p);

// For each pair of POIs: shortest path, count of intermediate POIs traversed
const issues = [];
for (let i = 0; i < pois.length; i++) {
  const a = pois[i];
  const { dist, prev } = dijkstra(a.idNodo);
  for (let j = 0; j < pois.length; j++) {
    if (i === j) continue;
    const b = pois[j];
    const real = haversine(a, b);
    const walkBest = walkMinutes(real);
    const graphMin = dist.get(b.idNodo);
    if (graphMin === Infinity) {
      issues.push({ type: 'unreachable', from: a, to: b, real });
      continue;
    }
    const hops = reconstruct(prev, b.idNodo);
    // count intermediate POI nodes traversed
    const intermediatePois = hops.slice(0, -1).filter(h => poiByNode.has(h.to) && h.to !== b.idNodo).length;
    const hasDirect = directEdge.has(a.idNodo + '||' + b.idNodo);
    const detourRatio = graphMin / walkBest;
    if (!hasDirect && real < 1500 && (intermediatePois >= 1 || detourRatio > 1.5)) {
      issues.push({
        type: 'detour',
        from: a, to: b,
        real, walkBest, graphMin,
        intermediatePois,
        hopChain: hops.map(h => (poiByNode.get(h.to)?.nombre || h.to) + `[${h.mode}/${h.min}m]`).join(' → '),
      });
    }
  }
}

console.log(`\nUnreachable POI pairs: ${issues.filter(i => i.type === 'unreachable').length}`);
issues.filter(i => i.type === 'unreachable').forEach(i => {
  console.log(`  ${i.from.nombre} → ${i.to.nombre} (${Math.round(i.real)}m apart)`);
});

const detours = issues.filter(i => i.type === 'detour');
console.log(`\nProblematic detour pairs: ${detours.length}`);
detours.sort((a, b) => (b.graphMin / b.walkBest) - (a.graphMin / a.walkBest));
detours.slice(0, 50).forEach(d => {
  console.log(`  ${d.from.nombre} → ${d.to.nombre}: walk=${d.walkBest}m, graph=${d.graphMin}m (${(d.graphMin/d.walkBest).toFixed(1)}x), via ${d.intermediatePois} POI(s)`);
  console.log(`    chain: ${d.hopChain}`);
});

// Pairs within 800m without direct edge
console.log(`\n=== Close pairs (<800m apart) without direct walking edge ===`);
const closeMissing = [];
for (let i = 0; i < pois.length; i++) {
  for (let j = i + 1; j < pois.length; j++) {
    const a = pois[i], b = pois[j];
    const d = haversine(a, b);
    if (d < 800 && !directEdge.has(a.idNodo + '||' + b.idNodo)) {
      closeMissing.push({ a, b, d, w: walkMinutes(d) });
    }
  }
}
closeMissing.sort((x, y) => x.d - y.d);
closeMissing.forEach(m => console.log(`  ${Math.round(m.d)}m / ${m.w}min: ${m.a.nombre} ↔ ${m.b.nombre}`));
console.log(`\nTotal close pairs without direct walking edge: ${closeMissing.length}`);
