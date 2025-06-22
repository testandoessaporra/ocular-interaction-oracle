import { vi } from 'vitest';
import { createMockProgress } from '../shared/testUtils';

// Mock global do gamificationService com implementações completas
export const mockGamificationService = {
  calculateSessionProgress: vi.fn((currentProgress, sessionDuration) => {
    const xpGained = sessionDuration * 2; // 2 XP por minuto
    return createMockProgress({
      ...currentProgress,
      totalXP: currentProgress.totalXP + xpGained,
      currentXP: currentProgress.currentXP + xpGained,
      totalHours: currentProgress.totalHours + (sessionDuration / 60),
      totalSessions: currentProgress.totalSessions + 1
    });
  }),
  
  calculateCycleCompletionBonus: vi.fn((currentProgress, completedBlocksCount) => {
    const bonusXP = completedBlocksCount * 25;
    const bonusCoins = completedBlocksCount * 10;
    return createMockProgress({
      ...currentProgress,
      totalXP: currentProgress.totalXP + bonusXP,
      currentXP: currentProgress.currentXP + bonusXP,
      coins: currentProgress.coins + bonusCoins,
      cycleStreak: currentProgress.cycleStreak + 1,
      streak: 0
    });
  }),
  
  initializeProgress: vi.fn((storedProgress) => {
    if (storedProgress) {
      return createMockProgress(storedProgress);
    }
    return createMockProgress();
  }),
  
  consumeProtectionShield: vi.fn((currentProgress) => {
    if (currentProgress.streakProtectionShields > 0) {
      return createMockProgress({
        ...currentProgress,
        streakProtectionShields: currentProgress.streakProtectionShields - 1
      });
    }
    return currentProgress;
  }),
  
  resetCycleStreak: vi.fn((currentProgress) => {
    if (currentProgress.streakProtectionShields > 0) {
      return createMockProgress({
        ...currentProgress,
        streakProtectionShields: currentProgress.streakProtectionShields - 1
      });
    }
    return createMockProgress({
      ...currentProgress,
      cycleStreak: 0
    });
  })
};

// Mock global das notificações
export const mockNotifications = {
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
};

// Mock global do performance tracker
export const mockPerformanceTracker = {
  usePerformanceTracker: vi.fn(() => ({
    trackOperation: vi.fn((name, operation) => operation()),
    logCustomMetric: vi.fn(),
    getRenderCount: vi.fn(() => 0),
    renderCount: 0
  }))
};