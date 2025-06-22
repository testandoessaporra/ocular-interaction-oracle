
import { useMemo } from 'react';
import { OPTIMIZATION_CONFIG } from '@/constants/optimizationConfig';

export const useLoginStreakCalculations = () => {
  // Memoizar cálculo de bônus para melhor performance
  const calculateLoginBonuses = useMemo(() => {
    return (loginStreak: number) => {
      // XP Bonus: +5% a cada 3 dias (cap 25% aos 15 dias)
      const xpBonus = Math.min(Math.floor(loginStreak / OPTIMIZATION_CONFIG.LOGIN_BONUS_INTERVAL) * 5, 25);
      
      // Coins que o usuário ganharia se completasse um ciclo agora
      const totalCoinsEarned = Math.floor(loginStreak / OPTIMIZATION_CONFIG.CYCLE_BONUS_INTERVAL) * 10;

      return { xpBonus, totalCoinsEarned };
    };
  }, []);

  return {
    calculateLoginBonuses
  };
};
