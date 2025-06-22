
import { useCallback } from 'react';
import { UserProgress } from '@/hooks/useGamification';
import { useLoginStreakNotifications } from '@/hooks/useLoginStreakNotifications';
import { OPTIMIZATION_CONFIG, debugLog, verboseLog } from '@/constants/optimizationConfig';

export const useLoginStreakProcessors = (
  setUserProgress: (updater: (prev: UserProgress) => UserProgress) => void
) => {
  const { 
    handleStreakIncrease, 
    handleStreakProtection, 
    handleStreakLoss,
    handleSimulatedStreakChange 
  } = useLoginStreakNotifications();

  const processNormalLogin = useCallback((today: string, lastLogin: string | null) => {
    debugLog(`📱 Processando login normal`, { today, lastLogin });
    
    if (!lastLogin) {
      verboseLog('🔥 Primeiro login detectado');
      setUserProgress(prev => ({
        ...prev,
        loginStreak: 1,
        lastLoginDate: today
      }));
      handleStreakIncrease(1);
      return;
    }

    if (lastLogin === today) {
      verboseLog('✅ Login já realizado hoje');
      return;
    }

    const lastLoginDate = new Date(lastLogin);
    const todayDate = new Date(today);
    const daysDifference = Math.floor((todayDate.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24));

    debugLog(`📅 Diferença de dias: ${daysDifference}`);

    setUserProgress(prev => {
      let newStreak = prev.loginStreak;
      let newShields = prev.streakProtectionShields;

      if (daysDifference === 1) {
        newStreak += 1;
        
        // Verificar se ganhou escudo
        if (newStreak > 0 && newStreak % OPTIMIZATION_CONFIG.STREAK_PROTECTION_GAIN_INTERVAL === 0) {
          newShields += 1;
          debugLog(`🛡️ Novo escudo ganho! Total: ${newShields}`);
        }

        handleStreakIncrease(newStreak);
      } else {
        if (prev.streakProtectionShields > 0) {
          newShields = prev.streakProtectionShields - 1;
          newStreak = prev.loginStreak;
          handleStreakProtection(prev.loginStreak);
        } else {
          const penalty = Math.min(daysDifference * 2, prev.loginStreak);
          newStreak = Math.max(0, prev.loginStreak - penalty);
          handleStreakLoss(penalty);
        }
      }

      verboseLog(`💾 Resultado final login:`, {
        loginStreak: newStreak,
        streakProtectionShields: newShields,
        lastLoginDate: today
      });

      return {
        ...prev,
        loginStreak: newStreak,
        lastLoginDate: today,
        streakProtectionShields: newShields
      };
    });
  }, [setUserProgress, handleStreakIncrease, handleStreakProtection, handleStreakLoss]);

  const processSimulatedLogin = useCallback((today: string, simulatedStreak: number, userProgress: UserProgress) => {
    debugLog(`🎮 Processando login simulado`, { today, simulatedStreak });
    
    setUserProgress(prev => {
      let newShields = prev.streakProtectionShields;
      const previousStreak = prev.loginStreak;
      
      verboseLog(`🔍 Estado antes da simulação:`, {
        previousStreak,
        simulatedStreak,
        shields: newShields
      });
      
      // Calcular escudos ganhos
      const previousShieldCount = Math.floor(previousStreak / OPTIMIZATION_CONFIG.STREAK_PROTECTION_GAIN_INTERVAL);
      const newShieldCount = Math.floor(simulatedStreak / OPTIMIZATION_CONFIG.STREAK_PROTECTION_GAIN_INTERVAL);
      
      const shieldsGained = Math.max(0, newShieldCount - previousShieldCount);
      if (shieldsGained > 0 && simulatedStreak > 0) {
        newShields += shieldsGained;
        debugLog(`🛡️ Escudos ganhos: +${shieldsGained}, total: ${newShields}`);
      }
      
      handleSimulatedStreakChange(previousStreak, simulatedStreak, shieldsGained);
      
      const newProgress = {
        ...prev,
        loginStreak: simulatedStreak,
        lastLoginDate: today,
        streakProtectionShields: newShields
      };
      
      verboseLog(`💾 Progresso final simulação:`, {
        loginStreak: newProgress.loginStreak,
        streakProtectionShields: newProgress.streakProtectionShields
      });
      
      return newProgress;
    });
  }, [setUserProgress, handleSimulatedStreakChange]);

  return {
    processNormalLogin,
    processSimulatedLogin
  };
};
