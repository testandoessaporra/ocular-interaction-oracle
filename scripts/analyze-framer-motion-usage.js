#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';

const FRAMER_IMPORTS = [
  'motion',
  'AnimatePresence',
  'useAnimation',
  'useInView',
  'useMotionValue',
  'useTransform',
  'useSpring',
  'useScroll',
  'variants'
];

async function analyzeFramerMotionUsage() {
  console.log('🎬 Analisando uso do Framer Motion...\n');
  
  const srcDir = path.join(process.cwd(), 'src');
  const usageMap = new Map();
  
  async function analyzeFile(filePath) {
    const content = await fs.readFile(filePath, 'utf8');
    
    if (content.includes('from "framer-motion"') || content.includes("from 'framer-motion'")) {
      const fileName = path.relative(process.cwd(), filePath);
      const usage = {
        file: fileName,
        imports: [],
        complexity: 'simple',
        canReplaceByCss: true,
        animations: []
      };
      
      // Analisar imports
      FRAMER_IMPORTS.forEach(imp => {
        const regex = new RegExp(`\\b${imp}\\b`);
        if (regex.test(content)) {
          usage.imports.push(imp);
        }
      });
      
      // Analisar complexidade
      if (content.includes('useAnimation') || content.includes('useMotionValue') || 
          content.includes('useTransform') || content.includes('useSpring')) {
        usage.complexity = 'complex';
        usage.canReplaceByCss = false;
      } else if (content.includes('AnimatePresence') || content.includes('variants')) {
        usage.complexity = 'medium';
      }
      
      // Analisar tipos de animações
      if (content.includes('whileHover')) usage.animations.push('hover');
      if (content.includes('whileTap')) usage.animations.push('tap');
      if (content.includes('initial') && content.includes('animate')) usage.animations.push('enter/exit');
      if (content.includes('transition')) usage.animations.push('transition');
      if (content.includes('drag')) usage.animations.push('drag');
      if (content.includes('layout')) usage.animations.push('layout');
      
      usageMap.set(fileName, usage);
    }
  }
  
  async function scanDirectory(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.includes('node_modules')) {
        await scanDirectory(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        await analyzeFile(fullPath);
      }
    }
  }
  
  await scanDirectory(srcDir);
  
  // Gerar relatório
  console.log('📊 Relatório de Uso do Framer Motion:\n');
  
  const simple = [];
  const medium = [];
  const complex = [];
  
  usageMap.forEach((usage, file) => {
    if (usage.complexity === 'simple') simple.push(usage);
    else if (usage.complexity === 'medium') medium.push(usage);
    else complex.push(usage);
  });
  
  console.log('✅ Simples (podem ser substituídos por CSS):');
  simple.forEach(u => {
    console.log(`  - ${u.file}`);
    console.log(`    Animações: ${u.animations.join(', ')}`);
  });
  
  console.log('\n⚠️  Médio (requerem mais esforço):');
  medium.forEach(u => {
    console.log(`  - ${u.file}`);
    console.log(`    Imports: ${u.imports.join(', ')}`);
    console.log(`    Animações: ${u.animations.join(', ')}`);
  });
  
  console.log('\n❌ Complexo (manter Framer Motion):');
  complex.forEach(u => {
    console.log(`  - ${u.file}`);
    console.log(`    Imports: ${u.imports.join(', ')}`);
  });
  
  const totalFiles = usageMap.size;
  const replaceableFiles = simple.length + medium.length;
  const percentage = Math.round((replaceableFiles / totalFiles) * 100);
  
  console.log('\n📈 Resumo:');
  console.log(`  - Total de arquivos usando Framer Motion: ${totalFiles}`);
  console.log(`  - Arquivos que podem ser convertidos: ${replaceableFiles} (${percentage}%)`);
  console.log(`  - Arquivos simples: ${simple.length}`);
  console.log(`  - Arquivos médios: ${medium.length}`);
  console.log(`  - Arquivos complexos: ${complex.length}`);
  
  return { simple, medium, complex };
}

// Executar
analyzeFramerMotionUsage().catch(console.error);