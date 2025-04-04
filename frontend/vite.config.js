import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'frontend/public/src/components'),
      '@styles': path.resolve(__dirname, 'frontend/public/src/styles'),
      '@assets': path.resolve(__dirname, 'frontend/public/src/assets'),
      '@services': path.resolve(__dirname, 'frontend/public/src/services'),
    },
  },
});
