import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import UnoCSS from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    UnoCSS(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    copyPublicDir: true,
    target: 'esnext',
    minify: 'esbuild',
    esbuild: {
      drop: ['console', 'debugger'],
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) {
              return 'three';
            }
            if (id.includes('recharts')) {
              return 'recharts';
            }
            if (id.includes('html2canvas') || id.includes('jspdf')) {
              return 'export-libs';
            }
            if (id.includes('radix-ui')) {
              return 'radix-ui';
            }
            if (id.includes('react-router')) {
              return 'react-router';
            }
            if (id.includes('dexie')) {
              return 'dexie';
            }
            if (id.includes('lucide-react')) {
              return 'lucide';
            }
            if (id.includes('date-fns')) {
              return 'date-utils';
            }
            if (id.includes('react')) {
              return 'react';
            }
            return 'vendor';
          }
          if (id.includes('/src/components/')) {
            if (id.includes('/Characters/') || id.includes('/Lore/') || id.includes('/Maps/') || id.includes('/Chronology/')) {
              return 'features';
            }
            if (id.includes('/Relationships/') || id.includes('/Scenarios/') || id.includes('/Notes/')) {
              return 'features-secondary';
            }
            if (id.includes('/Modal/')) {
              return 'modals';
            }
            return 'components';
          }
          if (id.includes('/src/hooks/')) {
            return 'hooks';
          }
          if (id.includes('/src/lib/')) {
            return 'utils';
          }
        },
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/chunk-[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
    chunkSizeWarningLimit: 600,
  },
}));
