import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Cpp/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: { clientPort: 443 },
    cors: true,
    // @ts-ignore
    allowedHosts: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  // @ts-ignore
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
} as any)
