import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Standalone KPilot Admin Portal running on http://localhost:3001
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
