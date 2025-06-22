import { vi } from 'vitest';
import { createMockProgress } from './shared/testUtils';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
};
global.localStorage = localStorageMock;

// Mock sessionStorage
global.sessionStorage = localStorageMock;

// Configurar mocks antes de qualquer importação
// NOTA: Comentado para usar a implementação real nos testes de gamificação
// vi.mock('@/services/gamificationService', () => {
//   const mockService = {
//     calculateSessionProgress: vi.fn((currentProgress, sessionDuration) => {
//       const xpGained = sessionDuration * 2;
//       return {
//         ...currentProgress,
//         totalXP: currentProgress.totalXP + xpGained,
//         currentXP: currentProgress.currentXP + xpGained,
//         totalHours: currentProgress.totalHours + (sessionDuration / 60),
//         totalSessions: currentProgress.totalSessions + 1
//       };
//     }),
//     
//     calculateCycleCompletionBonus: vi.fn((currentProgress, completedBlocksCount) => {
//       const bonusXP = completedBlocksCount * 25;
//       const bonusCoins = completedBlocksCount * 10;
//       return {
//         ...currentProgress,
//         totalXP: currentProgress.totalXP + bonusXP,
//         currentXP: currentProgress.currentXP + bonusXP,
//         coins: currentProgress.coins + bonusCoins,
//         cycleStreak: currentProgress.cycleStreak + 1,
//         streak: 0
//       };
//     }),
//     
//     initializeProgress: vi.fn((storedProgress) => {
//       if (storedProgress) {
//         return { ...createMockProgress(), ...storedProgress };
//       }
//       return createMockProgress();
//     }),
//     
//     consumeProtectionShield: vi.fn((currentProgress) => {
//       if (currentProgress.streakProtectionShields > 0) {
//         return {
//           ...currentProgress,
//           streakProtectionShields: currentProgress.streakProtectionShields - 1
//         };
//       }
//       return currentProgress;
//     }),
//     
//     resetCycleStreak: vi.fn((currentProgress) => {
//       if (currentProgress.streakProtectionShields > 0) {
//         return {
//           ...currentProgress,
//           streakProtectionShields: currentProgress.streakProtectionShields - 1
//         };
//       }
//       return {
//         ...currentProgress,
//         cycleStreak: 0
//       };
//     })
//   };
// 
//   return { gamificationService: mockService };
// });

// Mock das notificações
vi.mock('@/components/ui/tactical-notification', () => ({
  showLevelUpNotification: vi.fn(),
  showMedalNotification: vi.fn(),
  showCycleCompletedNotification: vi.fn(),
  showStreakIncreasedNotification: vi.fn(),
  showStreakLostNotification: vi.fn(),
  showStreakProtectedNotification: vi.fn(),
  showSuccessNotification: vi.fn(),
  showErrorNotification: vi.fn(),
  showWarningNotification: vi.fn(),
  showInfoNotification: vi.fn()
}));

// Mock do performance tracker
vi.mock('@/hooks/usePerformanceTracker', () => ({
  usePerformanceTracker: vi.fn(() => ({
    trackOperation: vi.fn((name, operation) => operation()),
    logCustomMetric: vi.fn(),
    getRenderCount: vi.fn(() => 0),
    renderCount: 0
  }))
}));

// Mock do logger
vi.mock('@/utils/logger', () => ({
  logger: {
    // Main methods
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    performance: vi.fn(),
    getPerformanceMetrics: vi.fn(() => []),
    clearPerformanceMetrics: vi.fn(),
    analyzePerformance: vi.fn(),
    
    // Context specific loggers
    gamification: {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
      performance: vi.fn()
    },
    performance: {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn()
    },
    storage: {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn()
    },
    general: {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn()
    },
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
  }
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => 
      React.createElement('div', props, children),
    span: ({ children, ...props }: { children: React.ReactNode }) => 
      React.createElement('span', props, children),
    button: ({ children, ...props }: { children: React.ReactNode }) => 
      React.createElement('button', props, children),
    li: ({ children, ...props }: { children: React.ReactNode }) => 
      React.createElement('li', props, children),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useAnimation: () => ({
    start: vi.fn(),
    set: vi.fn(),
    stop: vi.fn(),
    mount: vi.fn(),
  }),
  useSpring: () => [0, vi.fn()],
  useTransform: () => 0,
  useMotionValue: () => ({
    get: () => 0,
    set: vi.fn(),
  }),
}));