#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';

const UNUSED_COMPONENTS = [
  'alert',
  'aspect-ratio',
  'avatar',
  'breadcrumb',
  'calendar',
  'carousel',
  'chart',
  'checkbox',
  'command',
  'context-menu',
  'drawer',
  'dropdown-menu',
  'form',
  'hover-card',
  'input-otp',
  'menubar',
  'navigation-menu',
  'pagination',
  'popover',
  'radio-group',
  'resizable',
  'sheet',
  'switch',
  'table',
  'tabs',
  'toaster',
  'toggle-group',
  'toggle'
];

const UI_DIR = path.join(process.cwd(), 'src', 'components', 'ui');

async function removeUnusedComponents() {
  console.log('🧹 Removendo componentes UI não utilizados...\n');
  
  let totalSaved = 0;
  const removedFiles = [];
  
  for (const component of UNUSED_COMPONENTS) {
    const filePath = path.join(UI_DIR, `${component}.tsx`);
    
    try {
      const stats = await fs.stat(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      
      await fs.unlink(filePath);
      
      console.log(`✅ Removido: ${component}.tsx (${sizeKB} KB)`);
      removedFiles.push(component);
      totalSaved += stats.size;
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error(`❌ Erro ao remover ${component}.tsx:`, error.message);
      }
    }
  }
  
  // Remover imports dos componentes removidos do package.json (se houver referências)
  await cleanupPackageImports(removedFiles);
  
  console.log('\n📊 Resumo:');
  console.log(`- Componentes removidos: ${removedFiles.length}`);
  console.log(`- Espaço economizado: ${(totalSaved / 1024).toFixed(2)} KB`);
  console.log('\n💡 Próximos passos:');
  console.log('1. Execute npm run build para verificar se não há erros');
  console.log('2. Remova as dependências Radix UI não utilizadas do package.json');
  console.log('3. Execute npm install para atualizar o lock file');
}

async function cleanupPackageImports(removedComponents) {
  // Verificar se há referências aos componentes removidos em outros arquivos
  const srcDir = path.join(process.cwd(), 'src');
  const warnings = [];
  
  async function checkDirectory(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.includes('node_modules')) {
        await checkDirectory(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx'))) {
        const content = await fs.readFile(fullPath, 'utf8');
        
        for (const component of removedComponents) {
          if (content.includes(`from '@/components/ui/${component}'`)) {
            warnings.push(`⚠️  Referência encontrada em ${fullPath}: ${component}`);
          }
        }
      }
    }
  }
  
  await checkDirectory(srcDir);
  
  if (warnings.length > 0) {
    console.log('\n⚠️  Avisos:');
    warnings.forEach(w => console.log(w));
  }
}

// Executar
removeUnusedComponents().catch(console.error);