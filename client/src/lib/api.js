/**
 * api.js — Thin fetch wrapper for all backend calls.
 * Base URL is empty so Vite's proxy transparently forwards /api/* to Express.
 */

const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data;
}

// ── Stocks ────────────────────────────────────────────────
export const stocksApi = {
  getAll:   (search = '')  => request(`/stocks${search ? `?search=${search}` : ''}`),
  getById:  (id)           => request(`/stocks/${id}`),
  create:   (body)         => request('/stocks',    { method: 'POST',   body }),
  update:   (id, body)     => request(`/stocks/${id}`, { method: 'PUT', body }),
  remove:   (id)           => request(`/stocks/${id}`, { method: 'DELETE' }),
};

// ── Users ─────────────────────────────────────────────────
export const usersApi = {
  getAll:  ()          => request('/users'),
  getById: (id)        => request(`/users/${id}`),
  create:  (body)      => request('/users',    { method: 'POST',   body }),
  update:  (id, body)  => request(`/users/${id}`, { method: 'PUT', body }),
  remove:  (id)        => request(`/users/${id}`, { method: 'DELETE' }),
};
