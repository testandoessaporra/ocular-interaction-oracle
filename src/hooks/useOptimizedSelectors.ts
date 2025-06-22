import { useUser } from '@/contexts/UserContext';
import { useMemo } from 'react';

/**
 * Hooks otimizados para selecionar partes específicas do contexto
 * Evita re-renders desnecessários ao usar apenas o que precisa
 */

// Selector para userProgress com memoização profunda
export const useUserProgressOptimized = () => {
  const { userProgress } = useUser();
  
  return useMemo(() => ({
    level: userProgress.level,
    totalXP: userProgress.totalXP,
    currentXP: userProgress.currentXP,
    xpToNextLevel: userProgress.xpToNextLevel,
    streak: userProgress.streak,
    cycleStreak: userProgress.cycleStreak,
    loginStreak: userProgress.loginStreak,
    name: userProgress.name,
    class: userProgress.class,
    totalMedals: userProgress.totalMedals,
    coins: userProgress.coins
  }), [
    userProgress.level,
    userProgress.totalXP,
    userProgress.currentXP,
    userProgress.xpToNextLevel,
    userProgress.streak,
    userProgress.cycleStreak,
    userProgress.loginStreak,
    userProgress.name,
    userProgress.class,
    userProgress.totalMedals,
    userProgress.coins
  ]);
};

// Selector apenas para streaks
export const useStreaksOnly = () => {
  const { userProgress } = useUser();
  
  return useMemo(() => ({
    streak: userProgress.streak,
    cycleStreak: userProgress.cycleStreak,
    loginStreak: userProgress.loginStreak
  }), [userProgress.streak, userProgress.cycleStreak, userProgress.loginStreak]);
};

// Selector apenas para XP e level
export const useXPOnly = () => {
  const { userProgress } = useUser();
  
  return useMemo(() => ({
    level: userProgress.level,
    totalXP: userProgress.totalXP,
    currentXP: userProgress.currentXP,
    xpToNextLevel: userProgress.xpToNextLevel
  }), [userProgress.level, userProgress.totalXP, userProgress.currentXP, userProgress.xpToNextLevel]);
};

// Selector para ciclo atual com memoização
export const useCurrentCycleOptimized = () => {
  const { currentCycle } = useUser();
  
  return useMemo(() => currentCycle, [currentCycle]);
};

// Selector apenas para blocos completados
export const useCompletedBlocksOptimized = () => {
  const { completedBlocks } = useUser();
  
  return useMemo(() => completedBlocks, [completedBlocks]);
};

// Selector para ações sem causar re-render
export const useUserActionsOptimized = () => {
  const { 
    setUserProgress,
    setCurrentCycle,
    addCompletedBlock,
    resetCompletedBlocks,
    addStudySession,
    resetAllProgress
  } = useUser();
  
  return useMemo(() => ({
    setUserProgress,
    setCurrentCycle,
    addCompletedBlock,
    resetCompletedBlocks,
    addStudySession,
    resetAllProgress
  }), [
    setUserProgress,
    setCurrentCycle,
    addCompletedBlock,
    resetCompletedBlocks,
    addStudySession,
    resetAllProgress
  ]);
};