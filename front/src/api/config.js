// Base URL para cada microservicio (sin trailing slash)
// El proxy de Vite reenvía /api/xxx -> localhost:33xx
const API_URLS = {
  auth:        '/api/auth',
  clientes:    '/api/clientes',
  mantenciones:'/api/mantenciones',
  ventas:      '/api/ventas',
  productos:   '/api/productos',
  rutas:       '/api/rutas',
  tecnicos:    '/api/tecnicos',
  dashboard:   '/api/dashboard',
};

export default API_URLS;
