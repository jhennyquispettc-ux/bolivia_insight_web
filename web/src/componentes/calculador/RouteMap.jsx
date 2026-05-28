import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';


const LA_PAZ_CENTER = [-16.505, -68.130];

const CATEGORY_META = {
  attraction:  { emoji: '🏛️', color: '#1a73e8' },
  nature:      { emoji: '🏞️', color: '#2e9d4a' },
  viewpoint:   { emoji: '🔭', color: '#16a34a' },
  restaurant:  { emoji: '🍽️', color: '#e87722' },
  plaza:       { emoji: '⛲', color: '#0d9488' },
  station:     { emoji: '🚡', color: '#dc2626' },
  airport:     { emoji: '✈️', color: '#4f46e5' },
  reference:   { emoji: '📍', color: '#64748b' },
};

const TELEFERICO_COLORS = {
  Roja: '#E31837', Amarilla: '#FFD100', Verde: '#009640',
  Azul: '#0055A5', Celeste: '#00A1E4', Naranja: '#FF7F00',
  Blanca: '#FFFFFF', Cafe: '#7A411B', Morada: '#6C217E', Plateada: '#A0A0A0',
};

const MODE_COLORS = {
  caminata:   '#334155',
  teleferico: '#d22d2d',
  taxi:       '#2266dd',
};

function poiIcon(category, selected) {
  const meta = CATEGORY_META[category] || { emoji: '📍', color: '#64748b' };
  const size = selected ? 32 : 26;
  return L.divIcon({
    className: 'bi-poi-marker',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${meta.color};color:#fff;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.25);font-size:${Math.round(size*0.55)}px;">${meta.emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function numberIcon(n) {
  return L.divIcon({
    className: 'bi-order-marker',
    html: `<div style="width:30px;height:30px;border-radius:50%;background:var(--amber-500,#FFB703);color:#1B2A41;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,0.35);font-weight:800;font-size:13px;font-family:var(--font-mono,monospace);">${n}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [bounds, map]);
  return null;
}

function RouteMap({ pois, graph, selected, result }) {
  const teleEdges = useMemo(() => {
    if (!graph?.edges) return [];
    return graph.edges.filter((e) => e.mode === 'teleferico' && e.line);
  }, [graph]);

  const stations = useMemo(() => {
    if (!graph?.nodes) return [];
    return graph.nodes.filter((n) => n.type === 'estacion');
  }, [graph]);

  const nodeMap = useMemo(() => {
    const m = new Map();
    if (graph?.nodes) for (const n of graph.nodes) m.set(n.slug, n);
    return m;
  }, [graph]);

  const routeBounds = useMemo(() => {
    if (!result) return null;
    const pts = [];
    for (const seg of result.segments) {
      for (const h of seg.hops) {
        pts.push(h.fromCoord);
        pts.push(h.toCoord);
      }
    }
    return pts.length ? pts : null;
  }, [result]);

  return (
    <MapContainer
      center={LA_PAZ_CENTER}
      zoom={13}
      style={{ height: '100%', width: '100%', minHeight: 400 }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />

      {}
      {teleEdges.map((e, i) => {
        const a = nodeMap.get(e.fromSlug);
        const b = nodeMap.get(e.toSlug);
        if (!a || !b) return null;
        const color = TELEFERICO_COLORS[e.line] || '#d22d2d';
        return (
          <Polyline
            key={`tele-${i}`}
            positions={[[a.lat, a.lon], [b.lat, b.lon]]}
            pathOptions={{ color, weight: 3, opacity: 0.4, dashArray: '4 4' }}
          />
        );
      })}

      {}
      {stations.map((s) => (
        <CircleMarker
          key={`st-${s.slug}`}
          center={[s.lat, s.lon]}
          radius={4}
          pathOptions={{ color: '#333', fillColor: '#fff', weight: 1, opacity: 0.6, fillOpacity: 0.8 }}
        />
      ))}

      {}
      {!result && pois.map((p) => (
        <Marker
          key={p.slug}
          position={[p.lat, p.lon]}
          icon={poiIcon(p.category, selected.has(p.slug))}
        />
      ))}

      {}
      {result && result.segments.map((seg, si) => (
        seg.hops.map((h, hi) => {
          const color = (h.mode === 'teleferico' && h.line)
            ? (TELEFERICO_COLORS[h.line] || MODE_COLORS.teleferico)
            : (MODE_COLORS[h.mode] || '#888');
          return (
            <Polyline
              key={`hop-${si}-${hi}`}
              positions={[h.fromCoord, h.toCoord]}
              pathOptions={{ color, weight: 6, opacity: 0.9 }}
            />
          );
        })
      ))}

      {result && result.order.map((p, idx) => (
        <Marker
          key={`ord-${idx}-${p.slug}`}
          position={[p.lat, p.lon]}
          icon={numberIcon(idx + 1)}
        />
      ))}

      <FitBounds bounds={routeBounds}/>
    </MapContainer>
  );
}

export default RouteMap;
