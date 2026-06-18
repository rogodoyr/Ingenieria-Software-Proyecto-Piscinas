import API_URLS from './config';

// /api/clientes -> proxy a localhost:3334
// Backend expone: GET/POST /api/clientes, GET/PUT/DELETE /api/clientes/{id}

function getAuthHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export async function getClientes(token, filters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.tipo) params.append('tipo', filters.tipo);
  if (filters.estado) params.append('estado', filters.estado);

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_URLS.clientes}${query}`, { headers: getAuthHeaders(token) });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error obteniendo clientes');
  return json.data;
}

export async function getClienteById(token, id) {
  const res = await fetch(`${API_URLS.clientes}/${id}`, { headers: getAuthHeaders(token) });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error obteniendo cliente');
  return json.data;
}

export async function createCliente(token, data) {
  const res = await fetch(API_URLS.clientes, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error creando cliente');
  return json.data;
}

export async function updateCliente(token, id, data) {
  const res = await fetch(`${API_URLS.clientes}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error actualizando cliente');
  return json.data;
}

export async function deleteCliente(token, id) {
  const res = await fetch(`${API_URLS.clientes}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error eliminando cliente');
  return json.data;
}
