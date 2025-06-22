
import { vi } from 'vitest';

// Tipo UserProgress para os mocks
interface UserProgress {
  level: number;
  totalXP: number;
  currentXP: number;
  xpToNextLevel: number;
  totalHours: number;
  totalSessions: number;
  streak: number;
  cycleStreak: number;
  loginStreak: number;
  lastLoginDate: string;
  streakProtectionShields: number;
  name: string;
  class: string;
  totalMedals: number;
  coins: number;
}

// Factory function para criar UserProgress válido
export const createMockProgress = (overrides: Partial<UserProgress> = {}): UserProgress => ({
  level: 1,
  totalXP: 50,
  currentXP: 50,
  xpToNextLevel: 50,
  totalHours: 5,
  totalSessions: 3,
  streak: 1,
  cycleStreak: 1,
  loginStreak: 2,
  lastLoginDate: '2024-01-01',
  streakProtectionShields: 0,
  name: 'Recruta',
  class: 'Iniciante',
  totalMedals: 1,
  coins: 50,
  ...overrides
});

// Mock inteligente do gamificationService que retorna objetos válidos
export const createMockGamificationService = () => ({
  calculateSessionProgress: vi.fn((currentProgress: UserProgress, sessionDuration: number) => {
    // Simular ganho de XP baseado na duração
    const xpGained = sessionDuration * 2; // 2 XP por minuto
    return createMockProgress({
      ...currentProgress,
      totalXP: currentProgress.totalXP + xpGained,
      currentXP: currentProgress.currentXP + xpGained,
      totalHours: currentProgress.totalHours + (sessionDuration / 60),
      totalSessions: currentProgress.totalSessions + 1
    });
  }),
  
  calculateCycleCompletionBonus: vi.fn((currentProgress: UserProgress, completedBlocksCount: number) => {
    // Simular bônus de ciclo
    const bonusXP = completedBlocksCount * 25;
    const bonusCoins = completedBlocksCount * 10;
    return createMockProgress({
      ...currentProgress,
      totalXP: currentProgress.totalXP + bonusXP,
      currentXP: currentProgress.currentXP + bonusXP,
      coins: currentProgress.coins + bonusCoins,
      cycleStreak: currentProgress.cycleStreak + 1,
      streak: 0 // Reset streak após completar ciclo
    });
  }),
  
  initializeProgress: vi.fn((storedProgress?: any) => {
    if (storedProgress) {
      return createMockProgress(storedProgress);
    }
    return createMockProgress();
  }),
  
  consumeProtectionShield: vi.fn((currentProgress: UserProgress) => {
    if (currentProgress.streakProtectionShields > 0) {
      return createMockProgress({
        ...currentProgress,
        streakProtectionShields: currentProgress.streakProtectionShields - 1
      });
    }
    return currentProgress;
  }),
  
  resetCycleStreak: vi.fn((currentProgress: UserProgress) => {
    // Se tem escudos, usar escudo
    if (currentProgress.streakProtectionShields > 0) {
      return createMockProgress({
        ...currentProgress,
        streakProtectionShields: currentProgress.streakProtectionShields - 1
      });
    }
    // Senão, resetar streak
    return createMockProgress({
      ...currentProgress,
      cycleStreak: 0
    });
  })
});

// Mocks de localStorage simplificados
export const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
};

// Mocks de AudioContext simplificados
export const mockAudioContext = {
  createOscillator: vi.fn(() => ({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: {
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn()
    }
  })),
  createGain: vi.fn(() => ({
    connect: vi.fn(),
    gain: {
      setValueAtTime: vi.fn(),
      linearRampToValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn()
    }
  })),
  destination: {},
  currentTime: 0
};

// Mocks de notification functions
export const createMockNotifications = () => ({
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
});

// Setup básico de mocks globais
export const setupGlobalMocks = () => {
  // Mock localStorage
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
    configurable: true
  });

  // Mock AudioContext
  Object.defineProperty(window, 'AudioContext', {
    value: vi.fn(() => mockAudioContext),
    writable: true,
    configurable: true
  });

  Object.defineProperty(window, 'webkitAudioContext', {
    value: vi.fn(() => mockAudioContext),
    writable: true,
    configurable: true
  });
};

// Setup de DOM para testes visuais - CORRIGIDO
export const setupDOMMocks = () => {
  // Mock do Audio constructor globalmente
  vi.stubGlobal('Audio', vi.fn(() => ({
    play: vi.fn(),
    pause: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })));

  // Spy no createElement (não mock - apenas observar)
  vi.spyOn(document, 'createElement');
  
  // Spy no appendChild (mas não mock - apenas observar)
  vi.spyOn(document.body, 'appendChild');
  
  // Mocks de timing
  vi.spyOn(global, 'requestAnimationFrame').mockImplementation((cb) => {
    cb(0);
    return 0;
  });
  
  vi.spyOn(global, 'setTimeout').mockImplementation((cb) => {
    if (typeof cb === 'function') cb();
    return 0 as any;
  });
};

// Cleanup completo
export const cleanupMocks = () => {
  // Cleanup localStorage
  mockLocalStorage.getItem.mockReset();
  mockLocalStorage.setItem.mockReset();
  mockLocalStorage.removeItem.mockReset();

  // Cleanup AudioContext
  mockAudioContext.createOscillator.mockClear();
  mockAudioContext.createGain.mockClear();
  mockAudioContext.currentTime = 0;

  // Cleanup timers
  vi.clearAllTimers();
  vi.restoreAllMocks();
};

// Helper para setup completo de teste
export const setupTestEnvironment = () => {
  setupGlobalMocks();
  setupDOMMocks();
  return {
    gamificationService: createMockGamificationService(),
    notifications: createMockNotifications()
  };
};
