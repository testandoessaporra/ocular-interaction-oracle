#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';

const FILES_TO_CLEAN = [
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

async function cleanupFiles() {
  console.log('🧹 Limpando resíduos do Framer Motion...\n');
  
  for (const filePath of FILES_TO_CLEAN) {
    const fullPath = path.join(process.cwd(), filePath);
    
    try {
      let content = await fs.readFile(fullPath, 'utf8');
      
      // Remover linhas vazias com ponto e vírgula isolado
      content = content.replace(/^\s*;\s*$/gm, '');
      
      // Remover divs com }} residuais
      content = content.replace(/<div\}\}/g, '<div');
      content = content.replace(/<\/div>\}/g, '</div>');
      content = content.replace(/\}\}\}/g, '');
      
      // Remover atributos residuais de animação
      content = content.replace(/\s*\}\}[^>]*>/g, '>');
      content = content.replace(/\}\}%`\s*\}\}\}/g, '');
      content = content.replace(/\}\}%`/g, '');
      
      // Limpar style props quebrados
      content = content.replace(/style=\{\{ width: `\$\{[^}]+\}%` \}\}/g, (match) => {
        const percentVar = match.match(/\$\{([^}]+)\}/)?.[1];
        return percentVar ? `style={{ width: \`\${${percentVar}}%\` }}` : '';
      });
      
      await fs.writeFile(fullPath, content, 'utf8');
      console.log(`✅ Limpo: ${filePath}`);
      
    } catch (error) {
      console.error(`❌ Erro ao limpar ${filePath}:`, error.message);
    }
  }
  
  console.log('\n✨ Limpeza concluída!');
}

// Executar
cleanupFiles().catch(console.error);