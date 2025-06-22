import { GAME_CONFIG, calculateLevelFromXP, getClassForLevel, calculateMedals } from '@/constants/gameConfig';
import { logger } from '@/utils/logger';
import { UserProgress } from '@/types/gamification';

export type { UserProgress };

interface StoredProgress {
  totalXP?: number;
  totalHours?: number;
  totalSessions?: number;
  streak?: number;
  cycleStreak?: number;
  loginStreak?: number;
  lastLoginDate?: string;
  streakProtectionShields?: number;
  name?: string;
  coins?: number;
}

export class GamificationService {
  calculateSessionProgress(currentProgress: UserProgress, sessionDuration: number): UserProgress {
    logger.gamification.info('Calculando progresso da sessão', { data: { sessionDuration } });
    
    // Calcular multiplicadores baseados em streaks (valores percentuais)
    const cycleStreakMultiplier = Math.min(currentProgress.cycleStreak * 0.1, 0.4); // 10% por streak, máximo 40%
    const loginStreakMultiplier = Math.min(Math.floor(currentProgress.loginStreak / 3) * 0.05, 0.25); // 5% a cada 3 dias, máximo 25%
    
    const baseXP = sessionDuration * GAME_CONFIG.XP_PER_MINUTE;
    
    // CORREÇÃO: Aplicar multiplicadores corretamente
    const totalMultiplier = 1 + cycleStreakMultiplier + loginStreakMultiplier;
    const totalXPGained = Math.floor(baseXP * totalMultiplier);
    const bonusXP = totalXPGained - baseXP;
    
    const newTotalXP = currentProgress.totalXP + totalXPGained;
    const newTotalHours = currentProgress.totalHours + (sessionDuration / 60);
    const newTotalSessions = currentProgress.totalSessions + 1;
    
    const { level: newLevel, currentLevelXP, xpForCurrentLevel } = calculateLevelFromXP(newTotalXP);
    const newClass = getClassForLevel(newLevel);

    const newProgressData = {
      ...currentProgress,
      totalXP: newTotalXP,
      xp: newTotalXP, // Sync with gamification interface
      currentXP: currentLevelXP,
      xpToNextLevel: xpForCurrentLevel,
      nextLevelXp: xpForCurrentLevel, // Sync with gamification interface
      totalHours: newTotalHours,
      totalSessions: newTotalSessions,
      level: newLevel,
      class: newClass
    };
    
    const newMedals = calculateMedals(newProgressData);

    logger.gamification.info('Progresso calculado com multiplicadores corrigidos', {
      data: {
        baseXP,
        cycleStreakMultiplier: `${(cycleStreakMultiplier * 100).toFixed(1)}%`,
        loginStreakMultiplier: `${(loginStreakMultiplier * 100).toFixed(1)}%`,
        totalMultiplier: `${(totalMultiplier * 100).toFixed(1)}%`,
        bonusXP,
        totalXPGained,
        newLevel,
        newMedals
      }
    });

    return {
      ...newProgressData,
      totalMedals: newMedals
    };
  }

  calculateCycleCompletionBonus(currentProgress: UserProgress, completedBlocksCount: number): UserProgress {
    logger.gamification.info('Calculando bônus de conclusão de ciclo', { 
      data: { 
        completedBlocksCount, 
        currentCycleStreak: currentProgress.cycleStreak 
      }
    });
    
    // Incrementar cycle streak PRIMEIRO
    const newCycleStreak = currentProgress.cycleStreak + 1;
    
    // Calcular multiplicadores baseados no NOVO cycle streak
    const cycleStreakMultiplier = Math.min(1 + (newCycleStreak * 0.25), 2);
    const loginStreakCoinsBonus = Math.floor(currentProgress.loginStreak / 5) * 10;
    
    const baseBonusXP = GAME_CONFIG.CYCLE_COMPLETION_BONUS.BASE_XP + 
                       (completedBlocksCount * GAME_CONFIG.CYCLE_COMPLETION_BONUS.XP_PER_BLOCK);
    const baseBonusCoins = GAME_CONFIG.CYCLE_COMPLETION_BONUS.COINS;
    
    const finalBonusXP = Math.floor(baseBonusXP * cycleStreakMultiplier);
    const finalBonusCoins = Math.floor(baseBonusCoins * cycleStreakMultiplier) + loginStreakCoinsBonus;

    const newTotalXP = currentProgress.totalXP + finalBonusXP;
    const { level: newLevel, currentLevelXP, xpForCurrentLevel } = calculateLevelFromXP(newTotalXP);
    const newClass = getClassForLevel(newLevel);

    const newProgressData = {
      ...currentProgress,
      totalXP: newTotalXP,
      xp: newTotalXP, // Sync with gamification interface
      currentXP: currentLevelXP,
      xpToNextLevel: xpForCurrentLevel,
      nextLevelXp: xpForCurrentLevel, // Sync with gamification interface
      level: newLevel,
      class: newClass,
      coins: currentProgress.coins + finalBonusCoins,
      streak: 0,
      cycleStreak: newCycleStreak // Usar o novo cycle streak incrementado
    };
    
    const newMedals = calculateMedals(newProgressData);

    logger.gamification.info('Bônus de ciclo calculado', {
      data: {
        finalBonusXP,
        finalBonusCoins,
        oldCycleStreak: currentProgress.cycleStreak,
        newCycleStreak: newCycleStreak,
        cycleStreakMultiplier
      }
    });

    return {
      ...newProgressData,
      totalMedals: newMedals
    };
  }

  initializeProgress(storedProgress?: StoredProgress): UserProgress {
    if (storedProgress) {
      const { level, currentLevelXP, xpForCurrentLevel } = calculateLevelFromXP(storedProgress.totalXP || 0);
      
      const progressData = {
        level: level,
        totalXP: storedProgress.totalXP || 0,
        xp: storedProgress.totalXP || 0, // Sync with gamification interface
        currentXP: currentLevelXP,
        xpToNextLevel: xpForCurrentLevel,
        nextLevelXp: xpForCurrentLevel, // Sync with gamification interface
        totalHours: storedProgress.totalHours || 0,
        totalSessions: storedProgress.totalSessions || 0,
        streak: storedProgress.streak || 0,
        cycleStreak: storedProgress.cycleStreak || 0,
        loginStreak: storedProgress.loginStreak || 0,
        lastLoginDate: storedProgress.lastLoginDate || '',
        streakProtectionShields: storedProgress.streakProtectionShields || 0,
        name: storedProgress.name || 'Recruta',
        class: getClassForLevel(level),
        totalMedals: 0,
        coins: storedProgress.coins || 0,
        // Additional gamification interface properties
        protectionActive: false,
        medals: [],
        streakProtectionExpiresAt: null,
        averageSessionDuration: 0,
        longestStreak: 0,
        completedCycles: 0,
        totalStudyTime: storedProgress.totalHours ? storedProgress.totalHours * 60 : 0
      };
      
      progressData.totalMedals = calculateMedals(progressData);
      
      logger.gamification.info('Progresso inicializado', { data: { level, totalXP: progressData.totalXP } });
      
      return progressData;
    }

    const defaultProgress: UserProgress = {
      level: 1,
      totalXP: 0,
      xp: 0,
      currentXP: 0,
      xpToNextLevel: GAME_CONFIG.BASE_XP_FOR_LEVEL,
      nextLevelXp: GAME_CONFIG.BASE_XP_FOR_LEVEL,
      totalHours: 0,
      totalSessions: 0,
      streak: 0,
      cycleStreak: 0,
      loginStreak: 0,
      lastLoginDate: '',
      streakProtectionShields: 0,
      name: 'Recruta',
      class: 'Iniciante',
      totalMedals: 0,
      coins: 0,
      protectionActive: false,
      medals: [],
      streakProtectionExpiresAt: null,
      averageSessionDuration: 0,
      longestStreak: 0,
      completedCycles: 0,
      totalStudyTime: 0
    };

    logger.gamification.info('Progresso padrão criado');
    return defaultProgress;
  }

  consumeProtectionShield(currentProgress: UserProgress): UserProgress {
    if (currentProgress.streakProtectionShields > 0) {
      logger.gamification.info('Escudo de proteção usado! Cycle streak preservada!');
      return {
        ...currentProgress,
        streakProtectionShields: currentProgress.streakProtectionShields - 1
      };
    }
    return currentProgress;
  }

  resetCycleStreak(currentProgress: UserProgress): UserProgress {
    // Verificar se tem escudos de proteção
    if (currentProgress.streakProtectionShields > 0) {
      return this.consumeProtectionShield(currentProgress);
    }
    
    logger.gamification.info('Cycle streak resetada');
    return {
      ...currentProgress,
      cycleStreak: 0
    };
  }
}

export const gamificationService = new GamificationService();
