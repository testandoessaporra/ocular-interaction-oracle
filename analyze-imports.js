import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Analisando imports do projeto...\n');

const imports = new Map();
const radixImports = new Set();
const heavyLibs = new Map();

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const importRegex = /import\s+(?:{[^}]*}|[^;]+)\s+from\s+['"]([^'"]+)['"]/g;
  
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    
    // Contar imports
    imports.set(importPath, (imports.get(importPath) || 0) + 1);
    
    // Identificar imports do Radix
    if (importPath.startsWith('@radix-ui/')) {
      radixImports.add(importPath);
    }
    
    // Identificar bibliotecas pesadas
    const heavyLibPatterns = [
      'framer-motion',
      'recharts', 
      'date-fns',
      'lucide-react',
      '@tanstack/react-query',
      'sonner',
      'uuid'
    ];
    
    heavyLibPatterns.forEach(lib => {
      if (importPath.includes(lib)) {
        heavyLibs.set(lib, (heavyLibs.get(lib) || 0) + 1);
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
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      analyzeFile(filePath);
    }
  });
}

// Analisar src
walkDir(path.join(__dirname, 'src'));

console.log('📊 Estatísticas de Imports:\n');

console.log('🎨 Componentes Radix UI utilizados:');
const radixArray = Array.from(radixImports).sort();
radixArray.forEach(imp => {
  console.log(`  - ${imp} (${imports.get(imp)} vezes)`);
});
console.log(`\nTotal: ${radixArray.length} pacotes Radix\n`);

console.log('📦 Bibliotecas pesadas:');
heavyLibs.forEach((count, lib) => {
  console.log(`  - ${lib}: ${count} imports`);
});

console.log('\n🔝 Top 20 imports mais usados:');
const sortedImports = Array.from(imports.entries())
  .filter(([path]) => !path.startsWith('.') && !path.startsWith('@/'))
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20);

sortedImports.forEach(([importPath, count]) => {
  console.log(`  ${count}x - ${importPath}`);
});

// Sugestões
console.log('\n💡 Sugestões de otimização:');
console.log('1. Considere fazer barrel exports para componentes Radix mais usados');
console.log('2. Use dynamic imports para componentes pesados como Charts');
console.log('3. Verifique se todos os ícones do lucide-react são necessários');
console.log('4. Considere alternativas mais leves para animações (CSS vs Framer Motion)');