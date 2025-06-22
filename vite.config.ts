
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    // Remove console logs em produção (exceto error e warn)
    drop: mode === 'production' ? ['debugger'] : [],
    pure: mode === 'production' ? ['console.log', 'console.debug', 'console.info'] : [],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separar vendors grandes
          if (id.includes('node_modules')) {
            if (id.includes('recharts')) return 'charts';
            if (id.includes('framer-motion')) return 'animations';
            if (id.includes('@radix-ui')) return 'radix-ui';
            if (id.includes('react-hook-form')) return 'forms';
            if (id.includes('date-fns')) return 'date-utils';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendor';
            return 'vendor';
          }
          // Separar páginas
          if (id.includes('src/pages/')) return 'pages';
          // Separar componentes UI
          if (id.includes('src/components/ui/')) return 'ui-components';
        }
      }
    },
    chunkSizeWarningLimit: 300,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    // Otimizações para reduzir uso de memória
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
        minForks: 1,
        maxForks: 1
      }
    },
    // Configurações de timeout mais conservadoras
    testTimeout: 10000,
    hookTimeout: 10000,
    // Limitar recursos
    maxConcurrency: 1,
    // Configurações de memória
    logHeapUsage: false,
    isolate: false
  },
}));
