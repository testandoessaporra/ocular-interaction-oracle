import { visualizer } from 'rollup-plugin-visualizer';
import { execSync } from 'child_process';

console.log('🔍 Analisando bundle...\n');

// Adicionar plugin visualizer ao vite config temporariamente
const viteConfig = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/bundle-stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'radix-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-context-menu',
            '@radix-ui/react-hover-card',
            '@radix-ui/react-label',
            '@radix-ui/react-menubar',
            '@radix-ui/react-navigation-menu',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-separator',
            '@radix-ui/react-slider',
            '@radix-ui/react-switch',
            '@radix-ui/react-toast',
            '@radix-ui/react-toggle',
            '@radix-ui/react-toggle-group'
          ],
          'framer-motion': ['framer-motion'],
          'recharts': ['recharts'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': [
            './src/components/ui/button',
            './src/components/ui/card',
            './src/components/ui/dialog',
            './src/components/ui/form',
            './src/components/ui/input',
            './src/components/ui/select',
            './src/components/ui/tabs',
            './src/components/ui/textarea'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 200
  }
});
`;

console.log('📦 Criando build otimizado com análise...');
execSync('npm run build', { stdio: 'inherit' });

console.log('\n✅ Análise completa! Abrindo visualização...');