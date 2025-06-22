#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('🔍 Validating accessibility compliance...\n');

try {
  // Run ESLint focusing on a11y rules
  const output = execSync('npm run lint 2>&1', { encoding: 'utf-8' });
  
  // Count a11y violations
  const a11yErrors = output.match(/jsx-a11y\//g) || [];
  const totalErrors = output.match(/✖ (\d+) problems/);
  
  console.log('📊 A11y Validation Report:\n');
  console.log(`Total linting issues: ${totalErrors ? totalErrors[1] : 0}`);
  console.log(`A11y violations: ${a11yErrors.length}`);
  
  if (a11yErrors.length === 0) {
    console.log('\n✅ A11y validation PASSED');
    console.log('   No accessibility violations found.\n');
    process.exit(0);
  } else {
    // Extract unique a11y rules violated
    const uniqueRules = [...new Set(
      output.match(/jsx-a11y\/[\w-]+/g) || []
    )];
    
    console.log('\n⚠️  A11y violations found:');
    uniqueRules.forEach(rule => {
      const count = (output.match(new RegExp(rule.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      console.log(`   - ${rule}: ${count} violation(s)`);
    });
    
    console.log('\n❌ A11y validation FAILED');
    console.log('   Please fix accessibility issues before committing.');
    console.log('   Run "npm run lint:a11y" for guidance.\n');
    process.exit(1);
  }
} catch (error) {
  // ESLint exits with error code when violations exist
  const output = error.stdout || error.output?.join('') || '';
  
  // Count a11y violations
  const a11yErrors = output.match(/jsx-a11y\//g) || [];
  const totalErrors = output.match(/✖ (\d+) problems/);
  
  console.log('📊 A11y Validation Report:\n');
  console.log(`Total linting issues: ${totalErrors ? totalErrors[1] : 0}`);
  console.log(`A11y violations: ${a11yErrors.length}`);
  
  if (a11yErrors.length > 0) {
    // Extract unique a11y rules violated
    const uniqueRules = [...new Set(
      output.match(/jsx-a11y\/[\w-]+/g) || []
    )];
    
    console.log('\n⚠️  A11y violations found:');
    uniqueRules.forEach(rule => {
      const count = (output.match(new RegExp(rule.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      console.log(`   - ${rule}: ${count} violation(s)`);
    });
    
    console.log('\n❌ A11y validation FAILED');
    console.log('   Please fix accessibility issues before committing.');
    console.log('   Run "npm run lint:a11y" for guidance.\n');
  }
  
  process.exit(1);
}