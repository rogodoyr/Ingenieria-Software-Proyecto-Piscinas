import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api/auth': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
      '/api/clientes': {
        target: 'http://localhost:3334',
        changeOrigin: true,
      },
      '/api/mantenciones': {
        target: 'http://localhost:3335',
        changeOrigin: true,
      },
      '/api/productos': {
        target: 'http://localhost:3336',
        changeOrigin: true,
      },
      '/api/ventas': {
        target: 'http://localhost:3336',
        changeOrigin: true,
      },
      '/api/tecnicos': {
        target: 'http://localhost:3337',
        changeOrigin: true,
      },
      '/api/rutas': {
        target: 'http://localhost:3337',
        changeOrigin: true,
      },
      '/api/dashboard': {
        target: 'http://localhost:3338',
        changeOrigin: true,
      },
    },
  },
})
