
import { useState, useEffect, useCallback, useRef } from 'react';
import { OPTIMIZATION_CONFIG, debugLog, verboseLog } from '@/constants/optimizationConfig';

export const useSimulationSync = (checkDailyLogin: () => void) => {
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [lastKnownSimulatedStreak, setLastKnownSimulatedStreak] = useState<number | null>(null);
  
  // Refs para debounce - corrigindo o tipo
  const lastSimulatedStreakRef = useRef<string | null>(null);
  const lastSimulatedDateRef = useRef<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Função com debounce para forçar update
  const debouncedForceUpdate = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      debugLog('🔄 Executando refresh com debounce...');
      setRefreshCounter(prev => prev + 1);
      
      setTimeout(() => {
        verboseLog('🔄 Re-executando checkDailyLogin após refresh...');
        checkDailyLogin();
      }, OPTIMIZATION_CONFIG.REFRESH_DEBOUNCE_DELAY);
    }, OPTIMIZATION_CONFIG.REFRESH_DEBOUNCE_DELAY);
  }, [checkDailyLogin]);

  // Sistema de refresh otimizado
  useEffect(() => {
    debugLog('🔄 Configurando sistema de refresh otimizado');
    
    // Inicializar valores de referência
    lastSimulatedStreakRef.current = localStorage.getItem('simulatedStreak');
    lastSimulatedDateRef.current = localStorage.getItem('simulatedDate');
    
    const forceUIUpdate = () => {
      const currentSimulatedStreak = localStorage.getItem('simulatedStreak');
      const currentSimulatedDate = localStorage.getItem('simulatedDate');
      
      // Verificar se houve mudança nos dados de simulação
      if (currentSimulatedStreak !== lastSimulatedStreakRef.current || 
          currentSimulatedDate !== lastSimulatedDateRef.current) {
        
        debugLog('🔄 Mudança detectada - acionando update com debounce', {
          streak: `${lastSimulatedStreakRef.current} → ${currentSimulatedStreak}`,
          date: `${lastSimulatedDateRef.current} → ${currentSimulatedDate}`
        });
        
        // Atualizar valores de referência
        lastSimulatedStreakRef.current = currentSimulatedStreak;
        lastSimulatedDateRef.current = currentSimulatedDate;
        
        // Atualizar estado conhecido
        setLastKnownSimulatedStreak(currentSimulatedStreak ? parseInt(currentSimulatedStreak) : null);
        
        // Forçar update com debounce
        debouncedForceUpdate();
      }
    };

    // Polling otimizado - reduzido para 1000ms
    const interval = setInterval(forceUIUpdate, OPTIMIZATION_CONFIG.SIMULATION_POLLING_INTERVAL);
    
    debugLog(`✅ Sistema de refresh configurado (polling ${OPTIMIZATION_CONFIG.SIMULATION_POLLING_INTERVAL}ms)`);
    
    return () => {
      debugLog('🧹 Limpando sistema de refresh');
      clearInterval(interval);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [debouncedForceUpdate]);

  return {
    refreshCounter,
    lastKnownSimulatedStreak
  };
};
