const BASE = '/api';

function getToken() {
  return localStorage.getItem('sf_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw Object.assign(new Error(data.message || `HTTP ${res.status}`), { status: res.status, data });
  return data;
}

// ── Auth ──────────────────────────────────────────────────
export const authApi = {
  signup: (name, email, password, organizationName) =>
    request('/auth/signup', { method: 'POST', body: { name, email, password, organizationName } }),
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),
  logout: () =>
    request('/auth/logout', { method: 'POST' }),
  me: () =>
    request('/auth/me'),
};

// ── Dashboard ─────────────────────────────────────────────
export const dashboardApi = {
  getSummary: () => request('/dashboard'),
};

// ── Products ──────────────────────────────────────────────
export const productsApi = {
  getAll:      (search = '') => request(`/products${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getById:     (id)          => request(`/products/${id}`),
  create:      (body)        => request('/products',                        { method: 'POST',   body }),
  update:      (id, body)    => request(`/products/${id}`,                  { method: 'PUT',    body }),
  remove:      (id)          => request(`/products/${id}`,                  { method: 'DELETE' }),
  adjustStock: (id, adjustment, note) =>
    request(`/products/${id}/adjust-stock`, { method: 'POST', body: { adjustment, note } }),
};

// ── Settings ──────────────────────────────────────────────
export const settingsApi = {
  get:    ()     => request('/settings'),
  update: (body) => request('/settings', { method: 'PUT', body }),
};
