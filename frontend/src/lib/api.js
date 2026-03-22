/**
 * API URL for fetch().
 *
 * - Set `VITE_API_URL` in `frontend/.env` (e.g. http://127.0.0.1:5000) if you need a fixed backend URL.
 * - In Vite dev (`npm run dev`), paths stay relative (`/api/...`) so the dev server proxies to the backend.
 * - `npm run preview`: use `VITE_API_URL` or we fall back to http://127.0.0.1:5000 on localhost.
 */
export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  const envBase = (import.meta.env.VITE_API_URL || '').trim().replace(/\/$/, '');

  if (envBase) {
    if (envBase.endsWith('/api') && p.startsWith('/api/')) {
      return `${envBase}${p.slice(4)}`;
    }
    return `${envBase}${p}`;
  }

  if (import.meta.env.DEV) {
    return p;
  }

  if (typeof window !== 'undefined') {
    const { hostname, port } = window.location;
    const local =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '[::1]';
    if (local && port && port !== '5000') {
      return `http://127.0.0.1:5000${p}`;
    }
  }

  return p;
}
