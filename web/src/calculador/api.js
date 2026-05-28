const API_BASE = 'http://localhost:3000';

async function handle(res) {
  if (!res.ok) {
    let detail = 'Request failed';
    try { const j = await res.json(); detail = j.message || detail; } catch {}
    throw new Error(detail);
  }
  return res.json();
}

export async function fetchPois(city = 'la-paz') {
  const res = await fetch(`${API_BASE}/routes/pois?city=${encodeURIComponent(city)}`);
  return handle(res);
}

export async function fetchGraph(city = 'la-paz') {
  const res = await fetch(`${API_BASE}/routes/graph?city=${encodeURIComponent(city)}`);
  return handle(res);
}

export async function calculateRoute(body) {
  const res = await fetch(`${API_BASE}/routes/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handle(res);
}

export const CATEGORY_META = {
  attraction:  { emoji: '🏛️', color: '#1a73e8' },
  nature:      { emoji: '🏞️', color: '#2e9d4a' },
  viewpoint:   { emoji: '🔭', color: '#16a34a' },
  restaurant:  { emoji: '🍽️', color: '#e87722' },
  plaza:       { emoji: '⛲', color: '#0d9488' },
  station:     { emoji: '🚡', color: '#dc2626' },
  airport:     { emoji: '✈️', color: '#4f46e5' },
  reference:   { emoji: '📍', color: '#64748b' },
};

export const TELEFERICO_COLORS = {
  Roja: '#E31837', Amarilla: '#FFD100', Verde: '#009640',
  Azul: '#0055A5', Celeste: '#00A1E4', Naranja: '#FF7F00',
  Blanca: '#FFFFFF', Cafe: '#7A411B', Morada: '#6C217E', Plateada: '#A0A0A0',
};

export const MODE_COLORS = {
  caminata:   '#334155',
  teleferico: '#d22d2d',
  taxi:       '#2266dd',
};

export function formatDuration(minutes) {
  if (minutes < 1) return '0 min';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}
