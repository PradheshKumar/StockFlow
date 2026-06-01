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

export const productsApi = {
  getAll:   (search = '') => request(`/products${search ? `?search=${search}` : ''}`),
  getById:  (id)          => request(`/products/${id}`),
  create:   (body)        => request('/products',       { method: 'POST',   body }),
  update:   (id, body)    => request(`/products/${id}`, { method: 'PUT',    body }),
  remove:   (id)          => request(`/products/${id}`, { method: 'DELETE' }),
};

export const usersApi = {
  getAll:  ()         => request('/users'),
  getById: (id)       => request(`/users/${id}`),
  create:  (body)     => request('/users',       { method: 'POST', body }),
  update:  (id, body) => request(`/users/${id}`, { method: 'PUT',  body }),
  remove:  (id)       => request(`/users/${id}`, { method: 'DELETE' }),
};

export const organizationsApi = {
  getAll:  ()         => request('/organizations'),
  getById: (id)       => request(`/organizations/${id}`),
  create:  (body)     => request('/organizations',       { method: 'POST', body }),
  update:  (id, body) => request(`/organizations/${id}`, { method: 'PUT',  body }),
  remove:  (id)       => request(`/organizations/${id}`, { method: 'DELETE' }),
};
