#!/usr/bin/env node

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DIST_PATH = join(__dirname, '..', 'dist');
const ASSETS_PATH = join(DIST_PATH, 'assets');

// Patterns to ignore (these are ok in production)
const ALLOWED_PATTERNS = [
  'console.warn',
  'console.error',
  'console.table', // Used for debug status
  'console.clear', // Used for clearing debug
];

async function validateBuild() {
  console.log('🔍 Validating production build...\n');
  
  try {
    // Check if dist exists
    await readdir(DIST_PATH);
  } catch {
    console.error('❌ Build directory not found. Run npm run build first.');
    process.exit(1);
  }

  const files = await readdir(ASSETS_PATH);
  const jsFiles = files.filter(f => f.endsWith('.js'));
  
  let totalConsoleLogCount = 0;
  const issuesFound = [];

  for (const file of jsFiles) {
    const content = await readFile(join(ASSETS_PATH, file), 'utf-8');
    
    // Count console.log occurrences
    const consoleLogMatches = content.match(/console\.log/g) || [];
    const consoleLogCount = consoleLogMatches.length;
    
    if (consoleLogCount > 0) {
      totalConsoleLogCount += consoleLogCount;
      issuesFound.push({
        file,
        count: consoleLogCount,
        preview: consoleLogMatches.slice(0, 3).join(', ') + (consoleLogCount > 3 ? '...' : '')
      });
    }
  }

  // Generate report
  console.log('📊 Build Validation Report\n');
  console.log(`Total JS files analyzed: ${jsFiles.length}`);
  console.log(`Total console.log occurrences: ${totalConsoleLogCount}\n`);

  if (issuesFound.length > 0) {
    console.log('⚠️  Files with console.log:');
    issuesFound.forEach(issue => {
      console.log(`  - ${issue.file}: ${issue.count} occurrences`);
    });
    
    console.log('\n❌ Build validation FAILED');
    console.log('   Console.log statements found in production build.');
    console.log('   These should be replaced with proper logging system.\n');
    
    process.exit(1);
  } else {
    console.log('✅ Build validation PASSED');
    console.log('   No console.log statements found in production build.\n');
  }

  // Check bundle sizes
  console.log('📦 Bundle Size Analysis:');
  let totalSize = 0;
  
  for (const file of jsFiles) {
    const stats = await readFile(join(ASSETS_PATH, file));
    const sizeKB = (stats.length / 1024).toFixed(2);
    totalSize += stats.length;
    
    if (stats.length > 200 * 1024) { // Files larger than 200KB
      console.log(`  ⚠️  ${file}: ${sizeKB} KB (consider splitting)`);
    }
  }
  
  console.log(`\nTotal bundle size: ${(totalSize / 1024).toFixed(2)} KB`);
  
  if (totalSize > 1000 * 1024) { // 1MB total
    console.log('⚠️  Total bundle size exceeds 1MB. Consider optimization.');
  }
}

validateBuild().catch(console.error);