import { logger } from '@/utils/logger';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            
            // UI Components (Radix)
            if (id.includes('@radix-ui')) {
              return 'radix-ui';
            }
            
            // Animações
            if (id.includes('framer-motion')) {
              return 'animations';
            }
            
            // Charts
            if (id.includes('recharts')) {
              return 'charts';
            }
            
            // Utils
            if (id.includes('date-fns') || id.includes('clsx') || id.includes('uuid')) {
              return 'utils';
            }
            
            // Outros vendors
            return 'vendor';
          }
          
          // App chunks
          if (id.includes('src/components/ui')) {
            return 'ui-components';
          }
          
          if (id.includes('src/pages')) {
            return 'pages';
          }
          
          if (id.includes('src/hooks')) {
            return 'hooks';
          }
        }
      }
    },
    // Configurações de otimização
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['logger.info', 'logger.info', 'logger.debug', 'console.trace'],
      },
    },
    reportCompressedSize: true,
    chunkSizeWarningLimit: 250,
  },
  // Otimizações de desenvolvimento
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      'framer-motion',
    ],
  },
});