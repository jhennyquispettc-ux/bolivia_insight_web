// Densifies the graph so every reasonable POI↔POI pair has a direct edge.
// Adds:
//   - Walking edges for pairs within 1.5 km of straight-line distance.
//   - Taxi edges for pairs within 12 km that don't already have a walking
//     edge generated above AND aren't already taxi-connected.
// Never touches teleférico edges; never deletes existing edges; just appends.
// Re-writing the JSON is safe and the seed script is idempotent.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'seed-data/laPaz');
const pois  = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'pois.json'), 'utf-8'));
const graph = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'grafo.json'), 'utf-8'));

function haversine(a, b) {
  const R = 6371000;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLon = (b.lon - a.lon) * Math.PI / 180;
  const la1 = a.lat * Math.PI / 180;
  const la2 = b.lat * Math.PI / 180;
  const x = Math.sin(dLat/2)**2 + Math.cos(la1)*Math.cos(la2)*Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

// ~4.3 km/h in La Paz (altitude + slopes + sidewalks). Centro is hilly, Zona
// Sur is flatter — flat average works for a first pass.
function walkMinutes(distMeters) {
  return Math.max(2, Math.round(distMeters / 72));
}

// La Paz urban taxi: ~12 km/h average with traffic + boarding overhead.
// Min 3 min to model hailing + getting in.
function taxiMinutes(distMeters) {
  return Math.max(3, Math.round(3 + distMeters / 200));
}

const WALK_MAX = 1500;
const TAXI_MAX = 12000;

// Map existing edges by mode for quick lookup of dup pairs (consider bidir)
const existingByMode = { caminata: new Set(), taxi: new Set(), teleferico: new Set() };
function addExisting(mode, a, b) {
  if (!existingByMode[mode]) existingByMode[mode] = new Set();
  existingByMode[mode].add(a + '||' + b);
}
for (const e of graph.aristas) {
  addExisting(e.modo, e.origen, e.destino);
  if (e.bidireccional) addExisting(e.modo, e.destino, e.origen);
}

const newEdges = [];
const walkAdded = new Set();   // remember which pairs got a walking edge

for (let i = 0; i < pois.length; i++) {
  for (let j = i + 1; j < pois.length; j++) {
    const a = pois[i];
    const b = pois[j];
    if (a.idNodo === b.idNodo) continue;
    const d = haversine(a, b);
    const key = a.idNodo + '||' + b.idNodo;
    const keyRev = b.idNodo + '||' + a.idNodo;

    // Walking edge
    if (d <= WALK_MAX && !existingByMode.caminata.has(key) && !existingByMode.caminata.has(keyRev)) {
      newEdges.push({
        origen: a.idNodo,
        destino: b.idNodo,
        tiempo: walkMinutes(d),
        modo: 'caminata',
        bidireccional: true,
      });
      walkAdded.add(key); walkAdded.add(keyRev);
    }

    // Taxi edge (covers longer reaches)
    if (d <= TAXI_MAX && !existingByMode.taxi.has(key) && !existingByMode.taxi.has(keyRev)) {
      newEdges.push({
        origen: a.idNodo,
        destino: b.idNodo,
        tiempo: taxiMinutes(d),
        modo: 'taxi',
        bidireccional: true,
      });
    }
  }
}

console.log(`Adding ${newEdges.length} new edges:`);
const byMode = {};
for (const e of newEdges) byMode[e.modo] = (byMode[e.modo] || 0) + 1;
console.log('  by mode:', byMode);
console.log(`Existing edges before: ${graph.aristas.length}`);

graph.aristas.push(...newEdges);
console.log(`Existing edges after:  ${graph.aristas.length}`);

fs.writeFileSync(path.join(DATA_DIR, 'grafo.json'), JSON.stringify(graph, null, 2));
console.log('Wrote updated grafo.json');
