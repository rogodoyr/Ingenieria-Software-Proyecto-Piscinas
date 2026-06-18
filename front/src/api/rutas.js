import API_URLS from './config';

// /api/tecnicos -> proxy a localhost:3337 (ruta-service)
// /api/rutas    -> proxy a localhost:3337 (ruta-service)
// Backend expone: GET/POST /api/tecnicos, PATCH /api/tecnicos/{id}/ubicacion, etc.

function getAuthHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export async function getTecnicos(token) {
  const res = await fetch(API_URLS.tecnicos, { headers: getAuthHeaders(token) });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error obteniendo técnicos');
  return json.data;
}

export async function getTecnicoById(token, id) {
  const res = await fetch(`${API_URLS.tecnicos}/${id}`, { headers: getAuthHeaders(token) });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error obteniendo técnico');
  return json.data;
}

export async function createTecnico(token, data) {
  const res = await fetch(API_URLS.tecnicos, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error creando técnico');
  return json.data;
}

export async function actualizarUbicacion(token, id, lat, lng) {
  const res = await fetch(`${API_URLS.tecnicos}/${id}/ubicacion`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ lat, lng }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error actualizando ubicación');
  return json.data;
}

export async function cambiarEstadoTecnico(token, id, estado) {
  const res = await fetch(`${API_URLS.tecnicos}/${id}/estado`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ estado }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error cambiando estado');
  return json.data;
}

export async function getRutas(token) {
  const res = await fetch(API_URLS.rutas, { headers: getAuthHeaders(token) });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error obteniendo rutas');
  return json.data;
}
