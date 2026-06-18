import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5174,
    proxy: {
      // Landing llama a /api/clientes -> cliente-service :3334
      '/api/clientes': {
        target: 'http://localhost:3334',
        changeOrigin: true,
      },
      // Landing llama a /api/mantenciones -> mantencion-service :3335
      '/api/mantenciones': {
        target: 'http://localhost:3335',
        changeOrigin: true,
      },
    },
  },
})
