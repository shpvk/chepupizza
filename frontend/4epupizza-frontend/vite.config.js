import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const useLocalApi = true
const localApiBaseUrl = 'https://localhost:7067'
const deployedApiBaseUrl = 'https://fourepupizza.onrender.com'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: useLocalApi ? localApiBaseUrl : deployedApiBaseUrl,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
