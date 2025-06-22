
import { useGamification } from '@/hooks/useGamification';
import { OPTIMIZATION_CONFIG, debugLog } from '@/constants/optimizationConfig';

export const useLoginStreakNotifications = () => {
  const { 
    showStreakIncreasedNotification, 
    showStreakLostNotification,
    showStreakProtectedNotification,
    showMedalNotification 
  } = useGamification();

  const handleStreakIncrease = (newStreak: number) => {
    debugLog(`🔥 Login streak aumentada: ${newStreak}`);
    
    // Verificar se ganhou escudo
    if (newStreak > 0 && newStreak % OPTIMIZATION_CONFIG.STREAK_PROTECTION_GAIN_INTERVAL === 0) {
      debugLog(`🛡️ Novo escudo ganho! Total shields will be updated by caller`);
      showMedalNotification(`🛡️ Escudo de Proteção Ganho! (${newStreak} dias)`);
    }

    showStreakIncreasedNotification(newStreak, 'login');
  };

  const handleStreakProtection = (currentStreak: number) => {
    debugLog(`🛡️ Escudo usado, streak preservada: ${currentStreak}`);
    showStreakProtectedNotification('login');
  };

  const handleStreakLoss = (penalty: number) => {
    debugLog(`❌ Streak perdida com penalidade: ${penalty}`);
    if (penalty > 0) {
      showStreakLostNotification('login');
    }
  };

  const handleSimulatedStreakChange = (previousStreak: number, simulatedStreak: number, shieldsGained: number) => {
    // Verificar mudanças no streak para notificações
    if (simulatedStreak > previousStreak) {
      debugLog(`🔥 Streak aumentou: ${previousStreak} → ${simulatedStreak}`);
      showStreakIncreasedNotification(simulatedStreak, 'login');
    } else if (simulatedStreak < previousStreak) {
      debugLog(`❌ Streak diminuiu: ${previousStreak} → ${simulatedStreak}`);
      showStreakLostNotification('login');
    }

    if (shieldsGained > 0) {
      debugLog(`🛡️ Escudos ganhos: +${shieldsGained}`);
      showMedalNotification(`🛡️ Escudo de Proteção Ganho! (${simulatedStreak} dias)`);
    }
  };

  return {
    handleStreakIncrease,
    handleStreakProtection,
    handleStreakLoss,
    handleSimulatedStreakChange
  };
};
