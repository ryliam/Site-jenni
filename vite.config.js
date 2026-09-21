import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    allowedHosts: [
      'site-jenni-production.up.railway.app',
      '.up.railway.app',
      '.railway.app'
    ]
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'site-jenni-production.up.railway.app',
      '.up.railway.app',
      '.railway.app'
    ]
  }
})
