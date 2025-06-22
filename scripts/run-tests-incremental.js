#!/usr/bin/env node

import { execSync } from 'child_process';
import { readdir } from 'fs/promises';
import { join, extname } from 'path';

const TEST_DIRS = ['src/hooks', 'src/utils', 'src/components'];
const EXCLUDED = ['node_modules', 'dist', 'coverage'];

async function findTestFiles(dir) {
  const files = [];
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory() && !EXCLUDED.includes(entry.name)) {
      files.push(...await findTestFiles(fullPath));
    } else if (entry.isFile() && entry.name.includes('.test.')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

async function runTestsInBatches() {
  console.log('🧪 Running tests in batches to avoid memory issues...\n');
  
  const allTestFiles = [];
  for (const dir of TEST_DIRS) {
    const files = await findTestFiles(dir);
    allTestFiles.push(...files);
  }
  
  console.log(`Found ${allTestFiles.length} test files\n`);
  
  const batchSize = 5;
  let passed = 0;
  let failed = 0;
  
  for (let i = 0; i < allTestFiles.length; i += batchSize) {
    const batch = allTestFiles.slice(i, i + batchSize);
    console.log(`\n📦 Running batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allTestFiles.length/batchSize)}`);
    
    try {
      const result = execSync(
        `NODE_OPTIONS="--max-old-space-size=2048" npx vitest run ${batch.join(' ')}`,
        { encoding: 'utf-8', stdio: 'pipe' }
      );
      
      // Count results
      const passMatch = result.match(/(\d+) passed/);
      const failMatch = result.match(/(\d+) failed/);
      
      if (passMatch) passed += parseInt(passMatch[1]);
      if (failMatch) failed += parseInt(failMatch[1]);
      
      console.log('✅ Batch completed');
    } catch (error) {
      console.log('❌ Batch had failures');
      failed += batchSize; // Approximate
    }
  }
  
  console.log('\n📊 Final Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Pass rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
}

runTestsInBatches().catch(console.error);