import API_URLS from './config';

// /api/mantenciones -> proxy a localhost:3335
// Backend expone: GET/POST /api/mantenciones, GET/PUT /api/mantenciones/{id}, PATCH /api/mantenciones/{id}/estado

function getAuthHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export async function getMantenciones(token, filters = {}) {
  const params = new URLSearchParams();
  if (filters.estado) params.append('estado', filters.estado);
  if (filters.tecnicoId) params.append('tecnicoId', filters.tecnicoId);
  if (filters.fecha) params.append('fecha', filters.fecha);

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_URLS.mantenciones}${query}`, { headers: getAuthHeaders(token) });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error obteniendo mantenciones');
  return json.data;
}

export async function getMantencionById(token, id) {
  const res = await fetch(`${API_URLS.mantenciones}/${id}`, { headers: getAuthHeaders(token) });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error obteniendo mantención');
  return json.data;
}

export async function createMantencion(token, data) {
  const res = await fetch(API_URLS.mantenciones, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error creando mantención');
  return json.data;
}

export async function updateMantencion(token, id, data) {
  const res = await fetch(`${API_URLS.mantenciones}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error actualizando mantención');
  return json.data;
}

export async function cambiarEstadoMantencion(token, id, estado) {
  const res = await fetch(`${API_URLS.mantenciones}/${id}/estado`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ estado }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error cambiando estado');
  return json.data;
}

export async function deleteMantencion(token, id) {
  const res = await fetch(`${API_URLS.mantenciones}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error eliminando mantención');
  return json.data;
}
