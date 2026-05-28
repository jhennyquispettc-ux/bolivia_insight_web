import { Injectable, BadRequestException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Graph } from './algorithm/Graph';
import {
  calculateRoute,
  CalculatedRoute,
  PoiLite,
  ProfileKey,
} from './algorithm/calculate';
import { VALID_PROFILES, CalculateRouteDto } from './dto/calculate-route.dto';

type CityCache = {
  graph: Graph;
  poisBySlug: Map<string, PoiLite>;
  pois: PoiLite[];
  nodes: { slug: string; type: string; lat: number; lon: number }[];
  edges: { fromSlug: string; toSlug: string; minutes: number; mode: string; line: string | null }[];
};

const MAX_POIS = 10;
const MIN_POIS = 2;

@Injectable()
export class RoutesService implements OnModuleInit {
  private cache = new Map<string, CityCache>();

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    // No eager loading — populate cache lazily on first request per city.
  }

  private async loadCity(city: string): Promise<CityCache> {
    const cached = this.cache.get(city);
    if (cached) return cached;

    const [poiRows, nodeRows, edgeRows] = await Promise.all([
      this.prisma.poi.findMany({ where: { city }, orderBy: { name: 'asc' } }),
      this.prisma.graphNode.findMany({ where: { city } }),
      this.prisma.graphEdge.findMany({ where: { city } }),
    ]);

    const graph = new Graph();
    const visitByNode = new Map<string, number>();
    for (const p of poiRows) visitByNode.set(p.nodeId, p.visitMinutes);

    for (const n of nodeRows) {
      graph.addNode(n.slug, {
        type: n.type,
        lat: n.lat,
        lon: n.lon,
        visitMinutes: visitByNode.get(n.slug) ?? 0,
      });
    }
    for (const e of edgeRows) {
      graph.addEdge({
        from:    e.fromSlug,
        to:      e.toSlug,
        minutes: e.minutes,
        mode:    e.mode,
        line:    e.line,
      });
    }

    const pois: PoiLite[] = poiRows.map((p) => ({
      slug:         p.slug,
      name:         p.name,
      category:     p.category,
      lat:          p.lat,
      lon:          p.lon,
      visitMinutes: p.visitMinutes,
      nodeSlug:     p.nodeId,
    }));
    const poisBySlug = new Map<string, PoiLite>();
    for (const p of pois) poisBySlug.set(p.slug, p);

    const entry: CityCache = {
      graph,
      poisBySlug,
      pois,
      nodes: nodeRows.map((n) => ({ slug: n.slug, type: n.type, lat: n.lat, lon: n.lon })),
      edges: edgeRows.map((e) => ({
        fromSlug: e.fromSlug,
        toSlug:   e.toSlug,
        minutes:  e.minutes,
        mode:     e.mode,
        line:     e.line,
      })),
    };
    this.cache.set(city, entry);
    return entry;
  }

  invalidate(city?: string) {
    if (city) this.cache.delete(city);
    else this.cache.clear();
  }

  async listPois(city: string) {
    const c = await this.loadCity(city);
    return c.pois.map((p) => ({
      slug:         p.slug,
      name:         p.name,
      category:     p.category,
      lat:          p.lat,
      lon:          p.lon,
      visitMinutes: p.visitMinutes,
    }));
  }

  async listGraph(city: string) {
    const c = await this.loadCity(city);
    return {
      nodes: c.nodes,
      edges: c.edges,
    };
  }

  async calculate(dto: CalculateRouteDto): Promise<CalculatedRoute> {
    const city = dto.city ?? 'la-paz';
    const slugs = Array.isArray(dto.poiSlugs) ? dto.poiSlugs : [];
    const start = dto.startSlug;
    const profile = dto.profile;
    const circuit = !!dto.circuit;

    if (slugs.length < MIN_POIS) {
      throw new BadRequestException(`Select at least ${MIN_POIS} POIs`);
    }
    if (slugs.length > MAX_POIS) {
      throw new BadRequestException(`Maximum ${MAX_POIS} POIs allowed`);
    }
    if (!start || !slugs.includes(start)) {
      throw new BadRequestException('startSlug must be present and included in poiSlugs');
    }
    if (!profile || !VALID_PROFILES.includes(profile as ProfileKey)) {
      throw new BadRequestException(`Invalid profile. Must be one of: ${VALID_PROFILES.join(', ')}`);
    }
    if (new Set(slugs).size !== slugs.length) {
      throw new BadRequestException('Duplicate POIs in selection');
    }

    const c = await this.loadCity(city);
    for (const s of slugs) {
      if (!c.poisBySlug.has(s)) {
        throw new BadRequestException(`Unknown POI: ${s}`);
      }
    }

    try {
      return calculateRoute({
        graph:         c.graph,
        poisBySlug:    c.poisBySlug,
        selectedSlugs: slugs,
        startSlug:     start,
        profile:       profile as ProfileKey,
        asCircuit:     circuit,
      });
    } catch (err: any) {
      throw new BadRequestException(err.message ?? 'Route calculation failed');
    }
  }
}
