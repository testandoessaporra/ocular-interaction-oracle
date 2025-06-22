#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';

const FILES_TO_FIX = [
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

async function fixFramerMotionStyles() {
  console.log('🔧 Corrigindo estilos dinâmicos...\n');
  
  for (const filePath of FILES_TO_FIX) {
    const fullPath = path.join(process.cwd(), filePath);
    
    try {
      let content = await fs.readFile(fullPath, 'utf8');
      
      // 1. Remover divs com resíduos do Framer Motion
      content = content.replace(/<div\s*\n\s*exit=\{[^}]+\}\s*\n\s*className=/g, '<div className=');
      content = content.replace(/<div\}\s*\n\s*className=/g, '<div className=');
      
      // 2. Corrigir style props com porcentagem dinâmica
      // Para ProfileSection.tsx - barra de progresso
      content = content.replace(
        /className="h-full tactical-gradient-gold"\}%`\s*/g, 
        'className="h-full tactical-gradient-gold" style={{ width: `${progressPercentage}%` }}'
      );
      
      // Para AnimatedProgressBar.tsx
      content = content.replace(
        /className="h-full tactical-gradient-gold relative overflow-hidden"\}%`\s*/g,
        'className="h-full tactical-gradient-gold relative overflow-hidden" style={{ width: `${progressPercentage}%` }}'
      );
      
      // Para StreakPanels.tsx - barras de progresso
      content = content.replace(
        /className="h-full tactical-gradient-gold"\}%`\s*/g,
        'className="h-full tactical-gradient-gold" style={{ width: `${progressToNextReward}%` }}'
      );
      
      // Para StreakPanels.tsx - momentum bar
      content = content.replace(
        /className=\{`h-full \$\{momentumData\.cssClass\}`\}>\s*0 \? '100%' : '0%'>/g,
        'className={`h-full ${momentumData.cssClass}`} style={{ width: cycleStreak > 0 ? \'100%\' : \'0%\' }}>'
      );
      
      // Para DataPage.tsx - barras de progresso
      content = content.replace(
        /<div\}%`\s*\n\s*className="h-full tactical-gradient-gold"/g,
        '<div style={{ width: `${percentage}%` }} className="h-full tactical-gradient-gold"'
      );
      
      // 3. Corrigir style props no AnimatedProgressBar.tsx (fontVariantNumeric)
      content = content.replace(
        /style=\{\{ fontVariantNumeric: 'tabular-nums'>/g,
        "style={{ fontVariantNumeric: 'tabular-nums' }}>"
      );
      
      // 4. Remover divs vazias com apenas }
      content = content.replace(/<div\}\s*>/g, '<div>');
      
      await fs.writeFile(fullPath, content, 'utf8');
      console.log(`✅ Corrigido: ${filePath}`);
      
    } catch (error) {
      console.error(`❌ Erro ao corrigir ${filePath}:`, error.message);
    }
  }
  
  console.log('\n✨ Correções concluídas!');
}

// Executar
fixFramerMotionStyles().catch(console.error);