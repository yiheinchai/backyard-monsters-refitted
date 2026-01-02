import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  base: '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'esnext',
    minify: 'esbuild',
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/base': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/worldmapv2': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/worldmapv3': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/init': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/connection': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/assets': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
