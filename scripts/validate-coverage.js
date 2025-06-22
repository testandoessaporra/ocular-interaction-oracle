#!/usr/bin/env node

import { readFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const COVERAGE_PATH = join(__dirname, '..', 'coverage', 'coverage-summary.json');

const THRESHOLDS = {
  branches: 60,
  functions: 60,
  lines: 70,
  statements: 70,
};

async function validateCoverage() {
  console.log('🔍 Validating test coverage...\n');
  
  try {
    const coverageData = JSON.parse(await readFile(COVERAGE_PATH, 'utf-8'));
    const total = coverageData.total;
    
    console.log('📊 Coverage Report:\n');
    
    let allPassed = true;
    const results = [];
    
    for (const [metric, threshold] of Object.entries(THRESHOLDS)) {
      const value = total[metric].pct;
      const passed = value >= threshold;
      allPassed = allPassed && passed;
      
      const icon = passed ? '✅' : '❌';
      const status = passed ? 'PASSED' : 'FAILED';
      
      results.push({
        metric: metric.charAt(0).toUpperCase() + metric.slice(1),
        value: value.toFixed(2),
        threshold,
        icon,
        status,
      });
    }
    
    // Display results
    const maxMetricLength = Math.max(...results.map(r => r.metric.length));
    
    results.forEach(({ metric, value, threshold, icon, status }) => {
      const padding = ' '.repeat(maxMetricLength - metric.length);
      console.log(`${icon} ${metric}:${padding} ${value}% (threshold: ${threshold}%) - ${status}`);
    });
    
    console.log('\n📈 Coverage Summary:');
    console.log(`   Total Files: ${Object.keys(coverageData).length - 1}`);
    console.log(`   Covered Lines: ${total.lines.covered}/${total.lines.total}`);
    console.log(`   Covered Functions: ${total.functions.covered}/${total.functions.total}`);
    console.log(`   Covered Branches: ${total.branches.covered}/${total.branches.total}`);
    console.log(`   Covered Statements: ${total.statements.covered}/${total.statements.total}`);
    
    if (allPassed) {
      console.log('\n✅ Coverage validation PASSED');
      console.log('   All metrics meet the required thresholds.\n');
    } else {
      console.log('\n❌ Coverage validation FAILED');
      console.log('   Some metrics are below the required thresholds.');
      console.log('   Please add more tests to improve coverage.\n');
      process.exit(1);
    }
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('❌ Coverage data not found.');
      console.error('   Run "npm run test:coverage" first to generate coverage data.\n');
    } else {
      console.error('❌ Error reading coverage data:', error.message);
    }
    process.exit(1);
  }
}

validateCoverage().catch(console.error);