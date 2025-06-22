
import { useCallback } from 'react';
import { usePerformanceTracker } from '@/hooks/usePerformanceTracker';
import { gamificationService } from '@/services/gamificationService';
import { UserProgress } from '@/types/gamification';

export type { UserProgress };

export const useGamificationLogic = () => {
  // Track performance deste hook
  const { trackOperation, logCustomMetric } = usePerformanceTracker({
    componentName: 'useGamificationLogic',
    trackRenders: false,
    trackMounts: true
  });

  const calculateProgressFromSession = useCallback((
    currentProgress: UserProgress,
    sessionDuration: number
  ): UserProgress => {
    return trackOperation('calculateProgressFromSession', () => {
      const result = gamificationService.calculateSessionProgress(currentProgress, sessionDuration);
      logCustomMetric('sessionProgressCalculated', { 
        sessionDuration, 
        xpGained: result.totalXP - currentProgress.totalXP 
      });
      return result;
    });
  }, [trackOperation, logCustomMetric]);

  const calculateCycleCompletionBonus = useCallback((
    currentProgress: UserProgress,
    completedBlocksCount: number
  ): UserProgress => {
    return trackOperation('calculateCycleCompletionBonus', () => {
      const result = gamificationService.calculateCycleCompletionBonus(currentProgress, completedBlocksCount);
      logCustomMetric('cycleCompletionBonus', { 
        completedBlocksCount, 
        bonusXp: result.totalXP - currentProgress.totalXP 
      });
      return result;
    });
  }, [trackOperation, logCustomMetric]);

  const consumeProtectionShield = useCallback((currentProgress: UserProgress): UserProgress => {
    return trackOperation('consumeProtectionShield', () => {
      return gamificationService.consumeProtectionShield(currentProgress);
    });
  }, [trackOperation]);

  const resetCycleStreak = useCallback((currentProgress: UserProgress): UserProgress => {
    return trackOperation('resetCycleStreak', () => {
      return gamificationService.resetCycleStreak(currentProgress);
    });
  }, [trackOperation]);

  const initializeProgress = useCallback((storedProgress?: any): UserProgress => {
    return trackOperation('initializeProgress', () => {
      return gamificationService.initializeProgress(storedProgress);
    });
  }, [trackOperation]);

  return {
    calculateProgressFromSession,
    calculateCycleCompletionBonus,
    resetCycleStreak,
    consumeProtectionShield,
    initializeProgress
  };
};
