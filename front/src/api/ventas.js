import API_URLS from './config';

// /api/productos -> proxy a localhost:3336 (venta-service)
// /api/ventas    -> proxy a localhost:3336 (venta-service)
// Backend expone: GET/POST /api/productos, GET/POST /api/ventas, etc.

function getAuthHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export async function getProductos(token, filters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.categoria) params.append('categoria', filters.categoria);

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_URLS.productos}${query}`, { headers: getAuthHeaders(token) });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error obteniendo productos');
  return json.data;
}

export async function createProducto(token, data) {
  const res = await fetch(API_URLS.productos, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error creando producto');
  return json.data;
}

export async function updateProducto(token, id, data) {
  const res = await fetch(`${API_URLS.productos}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error actualizando producto');
  return json.data;
}

export async function getVentas(token) {
  const res = await fetch(API_URLS.ventas, { headers: getAuthHeaders(token) });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error obteniendo ventas');
  return json.data;
}

export async function getVentaById(token, id) {
  const res = await fetch(`${API_URLS.ventas}/${id}`, { headers: getAuthHeaders(token) });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error obteniendo venta');
  return json.data;
}

export async function createVenta(token, data) {
  const res = await fetch(API_URLS.ventas, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error creando venta');
  return json.data;
}

export async function cambiarEstadoVenta(token, id, estado) {
  const res = await fetch(`${API_URLS.ventas}/${id}/estado`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ estado }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || 'Error cambiando estado de venta');
  return json.data;
}
