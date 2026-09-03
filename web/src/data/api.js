// Base URL for the Bolivia Insight API.
// Set VITE_API_URL at build time for deployed environments;
// falls back to the local dev server so nothing breaks without a .env file.
export const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

export const apiUrl = (path) => `${API_BASE}${path.startsWith('/') ? path : '/' + path}`;

export const authHeaders = () => {
  const token = localStorage.getItem('bolivia_insight_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
