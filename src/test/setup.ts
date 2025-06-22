
import './setupMocks'; // Importar mocks antes de tudo
import '@testing-library/jest-dom';
import { beforeEach, afterEach } from 'vitest';
import { cleanupMocks, setupTestEnvironment } from './shared/testUtils';

// Configurar mocks globais automaticamente
setupTestEnvironment();

// Cleanup automático entre testes
beforeEach(() => {
  cleanupMocks();
});

afterEach(() => {
  cleanupMocks();
  
  // Forçar garbage collection se disponível
  if (global.gc) {
    global.gc();
  }
});

// Configurações globais para reduzir uso de memória
global.console = {
  ...console,
  // Reduzir logs desnecessários durante testes
  log: process.env.VITEST_VERBOSE ? console.log : () => {},
  debug: process.env.VITEST_VERBOSE ? console.debug : () => {},
  info: process.env.VITEST_VERBOSE ? console.info : () => {},
};
