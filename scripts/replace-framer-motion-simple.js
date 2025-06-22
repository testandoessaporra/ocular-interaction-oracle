#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';

const SIMPLE_FILES = [
  'src/components/ResetButton.tsx',
  'src/components/StudySessionModal.tsx', 
  'src/components/dashboard/ProfileSection.tsx',
  'src/components/page/EmptyState.tsx',
  'src/components/preview/AnimatedProgressBar.tsx',
  'src/components/preview/BlockIcon.tsx',
  'src/components/preview/ProgressSection.tsx',
  'src/components/preview/StreakPanels.tsx',
  'src/pages/DataPage.tsx'
];

// CSS classes para substituir animações comuns do Framer Motion
const CSS_ANIMATIONS = `
/* Fade In Animation */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Slide Up Animation */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale Animation */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Hover Scale */
.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.05);
}

/* Animation Classes */
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.4s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.3s ease-out;
}
`;

async function replaceFramerMotion() {
  console.log('🔄 Substituindo Framer Motion por CSS em arquivos simples...\n');
  
  let totalReplaced = 0;
  
  for (const filePath of SIMPLE_FILES) {
    const fullPath = path.join(process.cwd(), filePath);
    
    try {
      let content = await fs.readFile(fullPath, 'utf8');
      const originalContent = content;
      
      // Remover import do framer-motion
      content = content.replace(/import\s+{[^}]+}\s+from\s+['"]framer-motion['"];?\n?/g, '');
      
      // Substituir motion.div por div com className
      content = content.replace(/<motion\.(\w+)([^>]*?)>/g, (match, tag, attrs) => {
        // Extrair propriedades de animação
        let className = '';
        
        if (attrs.includes('initial') && attrs.includes('animate')) {
          if (attrs.includes('opacity')) {
            className = 'animate-fade-in';
          } else if (attrs.includes('translateY')) {
            className = 'animate-slide-up';
          } else if (attrs.includes('scale')) {
            className = 'animate-scale-in';
          }
        }
        
        if (attrs.includes('whileHover')) {
          className = className ? `${className} hover-scale` : 'hover-scale';
        }
        
        // Limpar atributos do framer-motion
        let cleanedAttrs = attrs
          .replace(/\s*(initial|animate|whileHover|whileTap|transition|variants)={[^}]+}/g, '')
          .replace(/\s*(initial|animate|whileHover|whileTap|transition|variants)="[^"]+"/g, '');
        
        // Adicionar className se houver
        if (className) {
          if (cleanedAttrs.includes('className=')) {
            cleanedAttrs = cleanedAttrs.replace(/className="([^"]*)"/, `className="$1 ${className}"`);
          } else {
            cleanedAttrs += ` className="${className}"`;
          }
        }
        
        return `<${tag}${cleanedAttrs}>`;
      });
      
      // Substituir </motion.tag> por </tag>
      content = content.replace(/<\/motion\.(\w+)>/g, '</$1>');
      
      // Se houve mudanças, salvar o arquivo
      if (content !== originalContent) {
        await fs.writeFile(fullPath, content, 'utf8');
        console.log(`✅ Convertido: ${filePath}`);
        totalReplaced++;
      }
      
    } catch (error) {
      console.error(`❌ Erro ao processar ${filePath}:`, error.message);
    }
  }
  
  // Adicionar animações CSS ao arquivo de estilos
  const animationsPath = path.join(process.cwd(), 'src/styles/framer-replacement.css');
  await fs.writeFile(animationsPath, CSS_ANIMATIONS, 'utf8');
  console.log(`\n✅ Arquivo de animações CSS criado: src/styles/framer-replacement.css`);
  
  console.log(`\n📊 Resumo:`);
  console.log(`  - Arquivos convertidos: ${totalReplaced}/${SIMPLE_FILES.length}`);
  console.log(`\n💡 Próximos passos:`);
  console.log(`  1. Importe 'src/styles/framer-replacement.css' no index.css`);
  console.log(`  2. Teste as animações convertidas`);
  console.log(`  3. Execute npm run build para verificar redução no tamanho do bundle`);
}

// Executar
replaceFramerMotion().catch(console.error);