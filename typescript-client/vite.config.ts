import { defineConfig } from 'vite';
import commonjs from 'vite-plugin-commonjs';
import path from 'path';

export default defineConfig({
  plugins: [
    commonjs(),
  ],
  resolve: {
    alias: {
      'openfl': path.resolve(__dirname, 'node_modules/openfl/lib/openfl'),
      'gs': path.resolve(__dirname, 'scripts/gs'),
    },
  },
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress "default" export warnings from openfl CJS modules
        if (warning.code === 'MISSING_EXPORT' && warning.message?.includes('"default"')) return;
        warn(warning);
      },
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});
