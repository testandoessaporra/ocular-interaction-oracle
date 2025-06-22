#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';

// Mapeamento de componentes removidos para suas dependências Radix
const UNUSED_RADIX_PACKAGES = {
  'alert': '@radix-ui/react-alert',
  'avatar': '@radix-ui/react-avatar',
  'checkbox': '@radix-ui/react-checkbox',
  'context-menu': '@radix-ui/react-context-menu',
  'dropdown-menu': '@radix-ui/react-dropdown-menu',
  'hover-card': '@radix-ui/react-hover-card',
  'menubar': '@radix-ui/react-menubar',
  'navigation-menu': '@radix-ui/react-navigation-menu',
  'popover': '@radix-ui/react-popover',
  'radio-group': '@radix-ui/react-radio-group',
  'switch': '@radix-ui/react-switch',
  'tabs': '@radix-ui/react-tabs',
  'toggle': '@radix-ui/react-toggle',
  'toggle-group': '@radix-ui/react-toggle-group',
  // Calendar usa react-day-picker, não Radix
  // Form usa react-hook-form, não é Radix
  // Alguns componentes compartilham dependências, então vamos verificar
};

async function cleanupRadixDependencies() {
  console.log('🔍 Analisando dependências Radix UI...\n');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
  
  const unusedPackages = [];
  const packagesToKeep = [];
  
  // Verificar cada pacote Radix
  for (const dep in packageJson.dependencies) {
    if (dep.startsWith('@radix-ui/')) {
      // Verificar se é usado pelos componentes removidos
      const isUnused = Object.values(UNUSED_RADIX_PACKAGES).includes(dep);
      
      if (isUnused) {
        // Double check - verificar se não é usado em componentes mantidos
        const isStillUsed = await checkIfRadixPackageIsUsed(dep);
        
        if (!isStillUsed) {
          unusedPackages.push(dep);
        } else {
          packagesToKeep.push(dep);
        }
      }
    }
  }
  
  console.log('📦 Pacotes Radix UI não utilizados:');
  unusedPackages.forEach(pkg => console.log(`  - ${pkg}`));
  
  console.log('\n✅ Pacotes Radix UI ainda em uso:');
  packagesToKeep.forEach(pkg => console.log(`  - ${pkg}`));
  
  // Gerar comando para remover pacotes
  if (unusedPackages.length > 0) {
    console.log('\n🎯 Execute o seguinte comando para remover as dependências não utilizadas:');
    console.log(`\nnpm uninstall ${unusedPackages.join(' ')}\n`);
  } else {
    console.log('\n✨ Nenhum pacote Radix UI não utilizado encontrado!');
  }
}

async function checkIfRadixPackageIsUsed(packageName) {
  const uiDir = path.join(process.cwd(), 'src', 'components', 'ui');
  
  try {
    const files = await fs.readdir(uiDir);
    
    for (const file of files) {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const content = await fs.readFile(path.join(uiDir, file), 'utf8');
        if (content.includes(packageName)) {
          return true;
        }
      }
    }
  } catch (error) {
    console.error('Erro ao verificar uso do pacote:', error);
  }
  
  return false;
}

// Executar
cleanupRadixDependencies().catch(console.error);