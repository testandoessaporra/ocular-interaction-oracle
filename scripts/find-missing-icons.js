import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ler o arquivo de ícones
const iconsFile = path.join(__dirname, '..', 'src', 'components', 'icons', 'index.ts');
const iconsContent = fs.readFileSync(iconsFile, 'utf-8');

// Extrair ícones exportados
const exportedIcons = new Set();
const exportRegex = /^\s*(\w+),?\s*$/gm;
let match;
while ((match = exportRegex.exec(iconsContent)) !== null) {
  if (match[1] && match[1] !== 'export' && match[1] !== 'from') {
    exportedIcons.add(match[1]);
  }
}

console.log(`\n📦 Ícones exportados atualmente: ${exportedIcons.size}\n`);

// Encontrar todos os ícones usados
const usedIcons = new Set();
const missingIcons = new Set();

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Procurar imports de @/components/icons
  const importRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/components\/icons['"]/g;
  
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const icons = match[1].split(',').map(icon => icon.trim());
    
    icons.forEach(icon => {
      if (icon) {
        usedIcons.add(icon);
        if (!exportedIcons.has(icon)) {
          missingIcons.add(icon);
          console.log(`❌ ${icon} - usado em ${path.relative(process.cwd(), filePath)}`);
        }
      }
    });
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.startsWith('.')) {
      walkDir(filePath);
    } else if ((file.endsWith('.tsx') || file.endsWith('.ts')) && !file.includes('icons/index.ts')) {
      checkFile(filePath);
    }
  });
}

// Analisar src
walkDir(path.join(__dirname, '..', 'src'));

console.log(`\n📊 Resumo:`);
console.log(`  - Ícones usados: ${usedIcons.size}`);
console.log(`  - Ícones faltando: ${missingIcons.size}`);

if (missingIcons.size > 0) {
  console.log(`\n🔧 Adicione estes ícones ao export em src/components/icons/index.ts:`);
  console.log(Array.from(missingIcons).sort().join(',\n  '));
}