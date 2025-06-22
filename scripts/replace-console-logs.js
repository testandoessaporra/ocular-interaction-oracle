#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';

const EXCLUDED_DIRS = ['node_modules', 'dist', 'coverage', '.git'];
const EXCLUDED_FILES = ['logger.ts', 'logger.js', 'setup.ts', 'setup.js'];

async function getAllFiles(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.includes(entry.name)) {
        await getAllFiles(fullPath, files);
      }
    } else if (entry.isFile()) {
      const ext = extname(entry.name);
      if (['.ts', '.tsx', '.js', '.jsx'].includes(ext) && !EXCLUDED_FILES.includes(entry.name)) {
        files.push(fullPath);
      }
    }
  }
  
  return files;
}

async function replaceConsoleInFile(filePath) {
  let content = await readFile(filePath, 'utf-8');
  let modified = false;
  
  // Skip if file already imports logger
  const hasLoggerImport = content.includes("from '@/utils/logger'") || 
                         content.includes('from "@/utils/logger"') ||
                         content.includes("from '../utils/logger'") ||
                         content.includes("from '../../utils/logger'");
  
  // Replace console.error with logger.error
  if (content.includes('console.error')) {
    content = content.replace(/console\.error/g, 'logger.error');
    modified = true;
  }
  
  // Replace console.warn with logger.warn
  if (content.includes('console.warn')) {
    content = content.replace(/console\.warn/g, 'logger.warn');
    modified = true;
  }
  
  // Replace console.log with logger.info
  if (content.includes('console.log')) {
    content = content.replace(/console\.log/g, 'logger.info');
    modified = true;
  }
  
  // Replace console.info with logger.info
  if (content.includes('console.info')) {
    content = content.replace(/console\.info/g, 'logger.info');
    modified = true;
  }
  
  // Replace console.debug with logger.debug
  if (content.includes('console.debug')) {
    content = content.replace(/console\.debug/g, 'logger.debug');
    modified = true;
  }
  
  // Add logger import if needed
  if (modified && !hasLoggerImport) {
    // Find the right place to add import
    const firstImportMatch = content.match(/^import .* from ['"].*/m);
    if (firstImportMatch) {
      const firstImportIndex = content.indexOf(firstImportMatch[0]);
      content = content.slice(0, firstImportIndex) + 
                "import { logger } from '@/utils/logger';\n" +
                content.slice(firstImportIndex);
    } else {
      // No imports, add at the beginning
      content = "import { logger } from '@/utils/logger';\n\n" + content;
    }
  }
  
  if (modified) {
    await writeFile(filePath, content, 'utf-8');
    return true;
  }
  
  return false;
}

async function main() {
  console.log('🔍 Searching for console statements to replace...\n');
  
  const srcPath = join(process.cwd(), 'src');
  const files = await getAllFiles(srcPath);
  
  let modifiedCount = 0;
  
  for (const file of files) {
    const wasModified = await replaceConsoleInFile(file);
    if (wasModified) {
      console.log(`✅ Modified: ${file.replace(process.cwd(), '.')}`);
      modifiedCount++;
    }
  }
  
  console.log(`\n📊 Summary: Modified ${modifiedCount} files`);
  console.log('✨ All console statements have been replaced with logger calls');
}

main().catch(console.error);