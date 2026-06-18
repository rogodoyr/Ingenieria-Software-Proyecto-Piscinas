import API_URLS from './config';

// /api/dashboard -> proxy a localhost:3338 (dashboard-service)
// Backend expone: GET /api/dashboard/metricas, GET /api/dashboard/mantenciones-proximas, etc.

function getAuthHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export async function getMetricas(token) {
  const res = await fetch(`${API_URLS.dashboard}/metricas`, { headers: getAuthHeaders(token) });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error obteniendo métricas');
  return json.data;
}

export async function getMantencionesProximas(token) {
  const res = await fetch(`${API_URLS.dashboard}/mantenciones-proximas`, { headers: getAuthHeaders(token) });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error obteniendo mantenciones próximas');
  return json.data;
}

export async function getAlertasInventario(token) {
  const res = await fetch(`${API_URLS.dashboard}/alertas-inventario`, { headers: getAuthHeaders(token) });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error obteniendo alertas');
  return json.data;
}

export async function createInventario(token, data) {
  const res = await fetch(`${API_URLS.dashboard}/inventario`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error creando item de inventario');
  return json.data;
}

export async function updateInventario(token, id, data) {
  const res = await fetch(`${API_URLS.dashboard}/inventario/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error actualizando inventario');
  return json.data;
}
