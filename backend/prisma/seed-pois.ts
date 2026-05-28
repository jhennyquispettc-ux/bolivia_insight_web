import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

type RawPoi = {
  id: string;
  nombre: string;
  categoria: string;
  descripcion?: string;
  lat: number;
  lon: number;
  idNodo: string;
  tiempoVisita?: number;
};

type RawNode = { id: string; tipo: string; lat: number; lon: number };

type RawEdge = {
  origen: string;
  destino: string;
  tiempo: number;
  modo: string;
  linea?: string;
  bidireccional?: boolean;
};

type RawGraph = { nodos: RawNode[]; aristas: RawEdge[] };

const CATEGORY_MAP: Record<string, string> = {
  atractivo:   'attraction',
  naturaleza:  'nature',
  mirador:     'viewpoint',
  restaurante: 'restaurant',
  plaza:       'plaza',
  estacion:    'station',
  aeropuerto:  'airport',
  referencia:  'reference',
};

const CITY = 'la-paz';

function readJson<T>(file: string): T {
  const full = path.resolve(__dirname, file);
  return JSON.parse(fs.readFileSync(full, 'utf-8')) as T;
}

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const pois = readJson<RawPoi[]>('./seed-data/laPaz/pois.json');
  const graph = readJson<RawGraph>('./seed-data/laPaz/grafo.json');

  console.log(`Seeding city="${CITY}"`);
  console.log(`  POIs: ${pois.length}`);
  console.log(`  Nodes: ${graph.nodos.length}`);
  console.log(`  Edges: ${graph.aristas.length}`);

  // 1. Upsert graph nodes
  let nodeCount = 0;
  for (const n of graph.nodos) {
    await prisma.graphNode.upsert({
      where: { slug: n.id },
      update: { type: n.tipo, lat: n.lat, lon: n.lon, city: CITY },
      create: { slug: n.id, type: n.tipo, lat: n.lat, lon: n.lon, city: CITY },
    });
    nodeCount++;
  }
  console.log(`  ✓ ${nodeCount} nodes upserted`);

  // 2. Wipe + reinsert edges (no unique key on (from,to,mode) so easier to reset per city)
  await prisma.graphEdge.deleteMany({ where: { city: CITY } });
  let edgeCount = 0;
  for (const e of graph.aristas) {
    await prisma.graphEdge.create({
      data: {
        fromSlug:      e.origen,
        toSlug:        e.destino,
        minutes:       e.tiempo,
        mode:          e.modo,
        line:          e.linea ?? null,
        bidirectional: !!e.bidireccional,
        city:          CITY,
      },
    });
    if (e.bidireccional) {
      await prisma.graphEdge.create({
        data: {
          fromSlug:      e.destino,
          toSlug:        e.origen,
          minutes:       e.tiempo,
          mode:          e.modo,
          line:          e.linea ?? null,
          bidirectional: true,
          city:          CITY,
        },
      });
      edgeCount++;
    }
    edgeCount++;
  }
  console.log(`  ✓ ${edgeCount} edges inserted (incl. reverse for bidirectional)`);

  // 3. Upsert POIs
  let poiCount = 0;
  for (const p of pois) {
    const category = CATEGORY_MAP[p.categoria] ?? p.categoria;
    await prisma.poi.upsert({
      where: { slug: p.id },
      update: {
        name:         p.nombre,
        category,
        description:  p.descripcion ?? null,
        lat:          p.lat,
        lon:          p.lon,
        visitMinutes: p.tiempoVisita ?? 0,
        nodeId:       p.idNodo,
        city:         CITY,
      },
      create: {
        slug:         p.id,
        name:         p.nombre,
        category,
        description:  p.descripcion ?? null,
        lat:          p.lat,
        lon:          p.lon,
        visitMinutes: p.tiempoVisita ?? 0,
        nodeId:       p.idNodo,
        city:         CITY,
      },
    });
    poiCount++;
  }
  console.log(`  ✓ ${poiCount} POIs upserted`);

  await prisma.$disconnect();
  await pool.end();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
