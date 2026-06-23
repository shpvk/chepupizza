import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const deployedApiBaseUrl = 'https://chepupizzeria.onrender.com'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: deployedApiBaseUrl,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})