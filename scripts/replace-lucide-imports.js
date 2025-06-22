import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔄 Substituindo imports do lucide-react...\n');

let filesModified = 0;
let importsReplaced = 0;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  
  // Regex para capturar imports do lucide-react
  const importRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"]/g;
  
  let hasLucideImport = false;
  let allIcons = new Set();
  
  // Coletar todos os ícones importados
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    hasLucideImport = true;
    const icons = match[1].split(',').map(icon => icon.trim());
    icons.forEach(icon => allIcons.add(icon));
  }
  
  if (hasLucideImport && !filePath.includes('/icons/index.ts')) {
    // Substituir todos os imports do lucide-react por um único import do barrel
    content = content.replace(importRegex, '');
    
    // Adicionar import do barrel no início do arquivo (após outros imports)
    const iconsList = Array.from(allIcons).join(', ');
    const newImport = `import { ${iconsList} } from '@/components/icons';`;
    
    // Encontrar onde inserir o import (após último import)
    const lastImportMatch = content.match(/import[^;]+;(?![\s\S]*import[^;]+;)/);
    if (lastImportMatch) {
      const insertPos = content.indexOf(lastImportMatch[0]) + lastImportMatch[0].length;
      content = content.slice(0, insertPos) + '\n' + newImport + content.slice(insertPos);
    } else {
      // Se não houver imports, adicionar no início
      content = newImport + '\n\n' + content;
    }
    
    // Salvar arquivo modificado
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      filesModified++;
      importsReplaced += allIcons.size;
      console.log(`✅ ${path.relative(process.cwd(), filePath)} - ${allIcons.size} ícones`);
    }
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.startsWith('.')) {
      walkDir(filePath);
    } else if ((file.endsWith('.tsx') || file.endsWith('.ts')) && !file.includes('.test.')) {
      processFile(filePath);
    }
  });
}

// Processar src
walkDir(path.join(__dirname, '..', 'src'));

console.log(`\n📊 Resumo:`);
console.log(`  - Arquivos modificados: ${filesModified}`);
console.log(`  - Imports substituídos: ${importsReplaced}`);
console.log(`\n✨ Concluído! Os imports do lucide-react foram centralizados.`);