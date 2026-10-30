import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    build: { sourcemap: false, minify: true },
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Database writes are runtime activity, not frontend edits. Keep source HMR.
      watch: process.env.DISABLE_HMR === 'true' ? null : {
        ignored: ['**/.data/**'],
      },
    },
  };
});
