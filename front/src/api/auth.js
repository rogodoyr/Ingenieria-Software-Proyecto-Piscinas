import API_URLS from './config';

// /api/auth -> proxy a localhost:3333
// Backend expone: POST /api/auth/login, POST /api/auth/register, etc.

export async function login(username, password) {
  const res = await fetch(`${API_URLS.auth}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error de login');
  return json.data;
}

export async function register(username, password, nombre, email) {
  const res = await fetch(`${API_URLS.auth}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, nombre, email }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error de registro');
  return json.data;
}

export async function validateToken(token) {
  const res = await fetch(`${API_URLS.auth}/validate`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const json = await res.json();
  return json.success && json.data === true;
}

export async function getCurrentUser(token) {
  const res = await fetch(`${API_URLS.auth}/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error obteniendo usuario');
  return json.data;
}
