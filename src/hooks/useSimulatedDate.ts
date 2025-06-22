
import { useCallback } from 'react';
import { useSimulationController } from '@/hooks/useSimulationController';

export const useSimulatedDate = () => {
  const { advanceDay, goBackDay, advanceTwoDaysSkip, resetToRealDate } = useSimulationController();
  
  // Obter dados de simulação do localStorage diretamente
  const simulatedDate = localStorage.getItem('simulatedDate');
  const simulatedStreak = parseInt(localStorage.getItem('simulatedStreak') || '0');
  const isSimulating = simulatedDate !== null;

  const getCurrentDate = useCallback((): Date => {
    return simulatedDate ? new Date(simulatedDate) : new Date();
  }, [simulatedDate]);

  const getCurrentDateString = useCallback((): string => {
    return getCurrentDate().toDateString();
  }, [getCurrentDate]);

  return {
    getCurrentDate,
    getCurrentDateString,
    advanceDay,
    goBackDay,
    advanceTwoDaysSkip,
    resetToRealDate,
    isSimulating,
    simulatedDate: simulatedDate ? new Date(simulatedDate) : null,
    simulatedStreak
  };
};
