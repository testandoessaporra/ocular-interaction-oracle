#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';

const sizes = [96, 128, 144, 152, 192, 384, 512];
const sourceIcon = path.join(process.cwd(), 'public/icons/icon-72x72.png');
const iconsDir = path.join(process.cwd(), 'public/icons');

async function copyIcons() {
  console.log('📋 Copiando ícones temporariamente...');
  
  try {
    const sourceData = await fs.readFile(sourceIcon);
    
    for (const size of sizes) {
      const targetPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      await fs.writeFile(targetPath, sourceData);
      console.log(`✅ Criado: icon-${size}x${size}.png`);
    }
    
    console.log('\n✨ Ícones copiados temporariamente! (você deve criar ícones apropriados mais tarde)');
  } catch (error) {
    console.error('❌ Erro ao copiar ícones:', error);
  }
}

copyIcons();