import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    // ... other server options
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // the target host
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
