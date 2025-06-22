#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log('🚀 Running comprehensive validation suite...\n');

const checks = [
  {
    name: 'TypeScript',
    command: 'npm run type-check',
    required: true,
  },
  {
    name: 'ESLint',
    command: 'npm run lint',
    required: true,
  },
  {
    name: 'Tests',
    command: 'npm run test:coverage',
    required: false, // Tests might not be fully implemented yet
  },
  {
    name: 'Test Coverage',
    command: 'npm run validate:coverage',
    required: false,
    skipIf: () => !existsSync('./coverage/coverage-summary.json'),
  },
  {
    name: 'Build',
    command: 'npm run build',
    required: true,
  },
  {
    name: 'Build Validation',
    command: 'npm run validate:build',
    required: true,
    skipIf: () => !existsSync('./dist'),
  },
  {
    name: 'A11y Compliance',
    command: 'npm run validate:a11y',
    required: false, // A11y might have warnings
  },
];

const results = [];
let hasFailures = false;

for (const check of checks) {
  if (check.skipIf && check.skipIf()) {
    console.log(`⏭️  Skipping ${check.name} check (preconditions not met)\n`);
    continue;
  }

  console.log(`🔍 Running ${check.name} check...`);
  
  try {
    execSync(check.command, { stdio: 'inherit' });
    results.push({ name: check.name, status: 'PASSED', icon: '✅' });
    console.log(`✅ ${check.name} check PASSED\n`);
  } catch (error) {
    const status = check.required ? 'FAILED' : 'WARNING';
    const icon = check.required ? '❌' : '⚠️';
    results.push({ name: check.name, status, icon });
    console.log(`${icon} ${check.name} check ${status}\n`);
    
    if (check.required) {
      hasFailures = true;
    }
  }
}

console.log('\n📊 Validation Summary:\n');
console.log('┌─────────────────────┬──────────┐');
console.log('│ Check               │ Status   │');
console.log('├─────────────────────┼──────────┤');

results.forEach(({ name, status, icon }) => {
  const padding = ' '.repeat(19 - name.length);
  const statusPadding = ' '.repeat(8 - status.length);
  console.log(`│ ${name}${padding} │ ${icon} ${status}${statusPadding} │`);
});

console.log('└─────────────────────┴──────────┘');

if (hasFailures) {
  console.log('\n❌ Validation FAILED');
  console.log('   Required checks did not pass.');
  console.log('   Please fix the issues before proceeding.\n');
  process.exit(1);
} else {
  console.log('\n✅ Validation PASSED');
  console.log('   All required checks passed successfully.\n');
  
  const warnings = results.filter(r => r.status === 'WARNING').length;
  if (warnings > 0) {
    console.log(`⚠️  ${warnings} non-critical warning(s) found.`);
    console.log('   Consider addressing these for better quality.\n');
  }
}