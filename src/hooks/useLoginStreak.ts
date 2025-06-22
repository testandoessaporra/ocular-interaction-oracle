
import { useEffect, useCallback } from 'react';
import { UserProgress } from '@/hooks/useGamification';
import { useSimulatedDate } from '@/hooks/useSimulatedDate';
import { useSimulationSync } from '@/hooks/useSimulationSync';
import { useLoginStreakCalculations } from '@/hooks/useLoginStreakCalculations';
import { useLoginStreakProcessors } from '@/hooks/useLoginStreakProcessors';
import { debugLog, verboseLog } from '@/constants/optimizationConfig';

export const useLoginStreak = (
  userProgress: UserProgress,
  setUserProgress: (updater: (prev: UserProgress) => UserProgress) => void
) => {
  const { getCurrentDateString, isSimulating, simulatedStreak } = useSimulatedDate();
  const { calculateLoginBonuses } = useLoginStreakCalculations();
  const { processNormalLogin, processSimulatedLogin } = useLoginStreakProcessors(setUserProgress);

  // Otimizar checkDailyLogin removendo dependências desnecessárias
  const checkDailyLogin = useCallback(() => {
    const today = getCurrentDateString();
    const lastLogin = userProgress.lastLoginDate;
    
    debugLog(`🔍 Daily login check iniciado`, {
      today,
      lastLogin: lastLogin || 'nunca',
      isSimulating,
      currentStreak: userProgress.loginStreak,
      shields: userProgress.streakProtectionShields
    });
    
    if (isSimulating) {
      processSimulatedLogin(today, simulatedStreak, userProgress);
      return;
    }
    
    processNormalLogin(today, lastLogin);
  }, [getCurrentDateString, userProgress.lastLoginDate, userProgress.loginStreak, userProgress.streakProtectionShields, isSimulating, simulatedStreak, processSimulatedLogin, processNormalLogin, userProgress]);

  const { refreshCounter, lastKnownSimulatedStreak } = useSimulationSync(checkDailyLogin);

  // Executar apenas uma vez na inicialização
  useEffect(() => {
    debugLog('🚀 Inicializando sistema de login streak');
    checkDailyLogin();
  }, []); // Manter sem dependências para executar apenas uma vez

  // Debug do refresh counter - apenas em desenvolvimento
  useEffect(() => {
    if (refreshCounter > 0) {
      verboseLog(`🔄 Refresh counter atualizado`, {
        refreshCounter,
        lastKnownSimulatedStreak,
        currentUIStreak: userProgress.loginStreak,
        synchronized: lastKnownSimulatedStreak === userProgress.loginStreak
      });
    }
  }, [refreshCounter, lastKnownSimulatedStreak, userProgress.loginStreak]);

  return {
    calculateLoginBonuses,
    checkDailyLogin,
    refreshCounter,
    lastKnownSimulatedStreak
  };
};
