
import { logger } from '@/utils/logger';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Cycle } from '@/types/cycle';
import { UserProgress } from '@/hooks/useGamification';
import { StudySession } from '@/types/userTypes';
import { loadFromStorage, saveToStorage } from '@/utils/storageUtils';

// Estado unificado e atômico
export interface UnifiedAppState {
  userProgress: UserProgress;
  studySessions: StudySession[];
  currentCycle: Cycle | null;
  completedBlocks: string[];
  targetExam: string | null;
  simulationData: {
    isSimulating: boolean;
    simulatedDate: string | null;
    simulatedStreak: number;
    simulationStartDate: string | null;
  };
  lastSavedAt: string;
}

const STORAGE_KEY = 'unified-app-state';

export const useUnifiedState = (initialProgress: UserProgress) => {
  // Carregar estado unificado uma única vez
  const initialState = useMemo((): UnifiedAppState => {
    const stored = loadFromStorage(STORAGE_KEY, null);
    
    if (stored && stored.lastSavedAt) {
      logger.info('📦 Carregando estado unificado do localStorage');
      return stored;
    }
    
    logger.info('🆕 Criando estado unificado inicial');
    return {
      userProgress: initialProgress,
      studySessions: [],
      currentCycle: null,
      completedBlocks: [],
      targetExam: null,
      simulationData: {
        isSimulating: false,
        simulatedDate: null,
        simulatedStreak: 0,
        simulationStartDate: null
      },
      lastSavedAt: new Date().toISOString()
    };
  }, [initialProgress]);

  const [state, setState] = useState<UnifiedAppState>(initialState);

  // Salvar estado unificado de forma atômica
  const saveUnifiedState = useCallback((newState: UnifiedAppState) => {
    const stateWithTimestamp = {
      ...newState,
      lastSavedAt: new Date().toISOString()
    };
    
    saveToStorage(STORAGE_KEY, stateWithTimestamp);
    logger.info('💾 Estado unificado salvo atomicamente');
  }, []);

  // Atualizar estado com callback
  const updateState = useCallback((updater: (prev: UnifiedAppState) => UnifiedAppState) => {
    setState(prevState => {
      const newState = updater(prevState);
      saveUnifiedState(newState);
      return newState;
    });
  }, [saveUnifiedState]);

  // Listener para eventos de simulação
  useEffect(() => {
    const handleSimulationEvent = (event: CustomEvent) => {
      const { type, payload } = event.detail;
      
      updateState(prevState => {
        const newSimulationData = { ...prevState.simulationData };
        let newUserProgress = { ...prevState.userProgress };
        
        switch (type) {
          case 'ADVANCE_DAY':
            if (!newSimulationData.isSimulating) {
              newSimulationData.isSimulating = true;
              newSimulationData.simulationStartDate = new Date().toISOString();
              newSimulationData.simulatedStreak = 1;
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              newSimulationData.simulatedDate = tomorrow.toISOString();
            } else {
              const currentDate = new Date(newSimulationData.simulatedDate!);
              currentDate.setDate(currentDate.getDate() + 1);
              newSimulationData.simulatedDate = currentDate.toISOString();
              newSimulationData.simulatedStreak++;
              
              // Verificar se ganhou escudo no 7º, 14º, 21º dia etc.
              if (newSimulationData.simulatedStreak > 0 && newSimulationData.simulatedStreak % 7 === 0) {
                newUserProgress.streakProtectionShields = (newUserProgress.streakProtectionShields || 0) + 1;
                logger.info(`🛡️ ✅ NOVO ESCUDO GANHO NO DIA ${newSimulationData.simulatedStreak}!`);
              }
            }
            break;
            
          case 'GO_BACK_DAY':
            if (newSimulationData.isSimulating && newSimulationData.simulatedDate) {
              const currentDate = new Date(newSimulationData.simulatedDate);
              currentDate.setDate(currentDate.getDate() - 1);
              newSimulationData.simulatedDate = currentDate.toISOString();
              newSimulationData.simulatedStreak = Math.max(0, newSimulationData.simulatedStreak - 1);
            }
            break;
            
          case 'SKIP_DAY':
            if (!newSimulationData.isSimulating) {
              // Iniciar simulação se não estava ativa
              const today = new Date();
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 2);
              newSimulationData.isSimulating = true;
              newSimulationData.simulationStartDate = today.toISOString();
              newSimulationData.simulatedDate = tomorrow.toISOString();
              newSimulationData.simulatedStreak = Math.max(0, (newUserProgress.loginStreak || 0) - 3);
            } else {
              const currentDate = new Date(newSimulationData.simulatedDate!);
              currentDate.setDate(currentDate.getDate() + 2);
              newSimulationData.simulatedDate = currentDate.toISOString();
              
              // Verificar escudos
              if (newUserProgress.streakProtectionShields > 0) {
                // Usar escudo - manter streak
                newUserProgress.streakProtectionShields = newUserProgress.streakProtectionShields - 1;
                logger.info(`🛡️ ✅ ESCUDO USADO! Streak protegida!`);
              } else {
                // Penalidade -3
                newSimulationData.simulatedStreak = Math.max(0, newSimulationData.simulatedStreak - 3);
                logger.info(`❌ SEM ESCUDO! Penalidade de -3 streak`);
              }
            }
            break;
            
          case 'ADD_SHIELDS':
            const amount = payload?.amount || 1;
            newUserProgress.streakProtectionShields = (newUserProgress.streakProtectionShields || 0) + amount;
            logger.info(`🛡️ ✅ ${amount} escudo(s) adicionado(s)!`);
            break;
            
          case 'RESET_SIMULATION':
            newSimulationData.isSimulating = false;
            newSimulationData.simulatedDate = null;
            newSimulationData.simulatedStreak = 0;
            newSimulationData.simulationStartDate = null;
            logger.info('🔄 ✅ Simulação resetada para data real');
            break;
        }
        
        return {
          ...prevState,
          userProgress: newUserProgress,
          simulationData: newSimulationData
        };
      });
    };

    window.addEventListener('simulation-event', handleSimulationEvent as EventListener);
    
    return () => {
      window.removeEventListener('simulation-event', handleSimulationEvent as EventListener);
    };
  }, [updateState]);

  return {
    state,
    updateState,
    saveUnifiedState
  };
};
