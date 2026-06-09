import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/.test(id)) {
              return 'react-vendor';
            }

            if (/[\\/]node_modules[\\/]framer-motion[\\/]/.test(id)) {
              return 'motion';
            }

            if (/[\\/]node_modules[\\/]lucide-react[\\/]/.test(id)) {
              return 'icons';
            }
          }
        },
      },
    },
  },
});
