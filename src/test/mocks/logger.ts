export const logger = {
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  performance: vi.fn(),
  getPerformanceMetrics: vi.fn(() => []),
  clearPerformanceMetrics: vi.fn(),
  analyzePerformance: vi.fn(),
  
  // Context specific loggers
  blockGeneration: {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    performance: vi.fn(),
  },
  distribution: {
    info: vi.fn(),
    debug: vi.fn(),
    performance: vi.fn(),
  },
  validation: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    performance: vi.fn(),
  },
  gamification: {
    info: vi.fn(),
    debug: vi.fn(),
    performance: vi.fn(),
  },
  timer: {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    performance: vi.fn(),
  },
  ui: {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    performance: vi.fn(),
  },
  storage: {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
};