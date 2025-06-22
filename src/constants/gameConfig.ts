
export const GAME_CONFIG = {
  XP_PER_MINUTE: 1,
  BASE_XP_FOR_LEVEL: 100,
  XP_INCREMENT_PER_LEVEL: 30,
  CYCLE_COMPLETION_BONUS: {
    BASE_XP: 200,
    XP_PER_BLOCK: 50,
    COINS: 300
  },
  CLASS_THRESHOLDS: {
    RECRUTA: { min: 1, max: 3 },
    SOLDADO: { min: 4, max: 6 },
    SARGENTO: { min: 7, max: 9 },
    OFICIAL: { min: 10, max: Infinity }
  },
  MEDAL_THRESHOLDS: {
    HOURS: [10, 50, 100],
    SESSIONS: [10, 50, 100],
    LEVELS: [5, 10, 20]
  }
} as const;

export const calculateXPForNextLevel = (level: number): number => {
  return GAME_CONFIG.BASE_XP_FOR_LEVEL + (level - 1) * GAME_CONFIG.XP_INCREMENT_PER_LEVEL;
};

export const calculateLevelFromXP = (totalXP: number): { level: number; currentLevelXP: number; xpForCurrentLevel: number } => {
  let level = 1;
  let accumulatedXP = 0;
  
  while (true) {
    const xpNeeded = calculateXPForNextLevel(level);
    if (accumulatedXP + xpNeeded > totalXP) {
      const currentLevelXP = totalXP - accumulatedXP;
      return { level, currentLevelXP, xpForCurrentLevel: xpNeeded };
    }
    accumulatedXP += xpNeeded;
    level++;
    
    if (level > 10000) break;
  }
  
  return { level, currentLevelXP: 0, xpForCurrentLevel: calculateXPForNextLevel(level) };
};

export const getClassForLevel = (level: number): string => {
  if (level >= GAME_CONFIG.CLASS_THRESHOLDS.RECRUTA.min && level <= GAME_CONFIG.CLASS_THRESHOLDS.RECRUTA.max) {
    return 'Recruta';
  } else if (level >= GAME_CONFIG.CLASS_THRESHOLDS.SOLDADO.min && level <= GAME_CONFIG.CLASS_THRESHOLDS.SOLDADO.max) {
    return 'Soldado';
  } else if (level >= GAME_CONFIG.CLASS_THRESHOLDS.SARGENTO.min && level <= GAME_CONFIG.CLASS_THRESHOLDS.SARGENTO.max) {
    return 'Sargento';
  } else if (level >= GAME_CONFIG.CLASS_THRESHOLDS.OFICIAL.min) {
    return 'Oficial';
  }
  return 'Iniciante';
};

export const calculateMedals = (userProgress: { totalHours: number; totalSessions: number; level: number }): number => {
  let medalCount = 0;
  
  // Medalha por nível 2
  if (userProgress.level >= 2) {
    medalCount++;
  }
  
  // Medalha por nível 5
  if (userProgress.level >= 5) {
    medalCount++;
  }
  
  // Medalha por nível 10
  if (userProgress.level >= 10) {
    medalCount++;
  }
  
  return medalCount;
};
