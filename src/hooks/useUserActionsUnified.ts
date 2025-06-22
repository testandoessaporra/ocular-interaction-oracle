
import { logger } from '@/utils/logger';
import { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Cycle } from '@/types/cycle';
import { useGamification, UserProgress } from '@/hooks/useGamification';
import { StudySession } from '@/types/userTypes';
import { UnifiedAppState } from '@/hooks/useUnifiedState';
import { MEDALS_CONFIG } from '@/constants/medals';

export const useUserActionsUnified = (
  state: UnifiedAppState,
  updateState: (updater: (prev: UnifiedAppState) => UnifiedAppState) => void
) => {
  const { 
    calculateProgressFromSession,
    calculateCycleCompletionBonus,
    showLevelUpNotification,
    showCycleCompletedNotification,
    showMedalNotification,
    playXPSound,
    showFloatingXP,
    initializeProgress
  } = useGamification();

  // Função para verificar e notificar novas medalhas
  const checkForNewMedals = useCallback((oldProgress: UserProgress, newProgress: UserProgress) => {
    // Calcular medalhas antigas e novas baseadas no nível
    const oldMedals = MEDALS_CONFIG.filter(medal => oldProgress.level >= medal.requirement);
    const newMedals = MEDALS_CONFIG.filter(medal => newProgress.level >= medal.requirement);
    
    // Verificar se ganhou novas medalhas
    if (newMedals.length > oldMedals.length) {
      const earnedMedals = newMedals.slice(oldMedals.length);
      earnedMedals.forEach(medal => {
        logger.info(`🏆 Nova medalha conquistada: ${medal.title}`);
        showMedalNotification(medal.title);
      });
    }
  }, [showMedalNotification]);

  const setCurrentCycle = useCallback((cycle: Cycle | null, preserveProgress = false) => {
    updateState(prev => {
      if (preserveProgress) {
        logger.info('🔄 Atualizando ciclo (preservando progresso)...');
        return { ...prev, currentCycle: cycle };
      } else {
        logger.info('🔄 Resetando progresso de blocos...');
        return {
          ...prev,
          currentCycle: cycle,
          completedBlocks: [],
          // Não resetar cycleStreak aqui - apenas quando não completar o ciclo
        };
      }
    });
  }, [updateState]);

  const addStudySession = useCallback((session: Omit<StudySession, 'id' | 'xp'>) => {
    updateState(prev => {
      const oldProgress = prev.userProgress;
      const sessionProgress = calculateProgressFromSession(prev.userProgress, session.duration);
      const earnedXP = sessionProgress.totalXP - prev.userProgress.totalXP;

      const newSession: StudySession = {
        id: uuidv4(),
        ...session,
        xp: earnedXP
      };

      // Verificar level up
      if (sessionProgress.level > prev.userProgress.level) {
        showLevelUpNotification(sessionProgress.level, sessionProgress.class);
      }

      // Verificar novas medalhas
      checkForNewMedals(oldProgress, sessionProgress);

      // Efeitos visuais e sonoros
      playXPSound();
      setTimeout(() => {
        showFloatingXP({
          x: window.innerWidth / 2 - 50,
          y: window.innerHeight / 2 - 100,
          xp: earnedXP,
          color: '#F59E0B'
        });
      }, 100);

      return {
        ...prev,
        studySessions: [...prev.studySessions, newSession],
        userProgress: sessionProgress
      };
    });
  }, [updateState, calculateProgressFromSession, showLevelUpNotification, playXPSound, showFloatingXP, checkForNewMedals]);

  const addCompletedBlock = useCallback((blockId: string) => {
    if (!blockId || blockId === 'undefined') {
      logger.error('❌ BlockId inválido', { data: { blockId } });
      return;
    }

    updateState(prev => {
      if (prev.completedBlocks.includes(blockId)) {
        logger.info('⚠️ Bloco já completado', { data: { blockId } });
        return prev;
      }

      logger.info('✅ Adicionando bloco completado', { data: { blockId } });
      return {
        ...prev,
        completedBlocks: [...prev.completedBlocks, blockId],
        userProgress: {
          ...prev.userProgress,
          streak: prev.userProgress.streak + 1
        }
      };
    });
  }, [updateState]);

  const resetCompletedBlocks = useCallback(() => {
    updateState(prev => {
      const oldProgress = prev.userProgress;
      const newProgress = calculateCycleCompletionBonus(prev.userProgress, prev.completedBlocks.length);
      
      logger.info('🎯 Ciclo completado! Cycle streak incrementado', {
        data: {
          anterior: oldProgress.cycleStreak,
          novo: newProgress.cycleStreak
        }
      });
      
      // Verificar level up
      if (newProgress.level > prev.userProgress.level) {
        showLevelUpNotification(newProgress.level, newProgress.class);
      }

      // Verificar novas medalhas
      checkForNewMedals(oldProgress, newProgress);

      showCycleCompletedNotification();
      
      return {
        ...prev,
        completedBlocks: [],
        userProgress: newProgress
      };
    });
  }, [updateState, calculateCycleCompletionBonus, showLevelUpNotification, showCycleCompletedNotification, checkForNewMedals]);

  const resetAllProgress = useCallback(() => {
    updateState(() => ({
      userProgress: initializeProgress(),
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
    }));
  }, [updateState, initializeProgress]);

  return {
    setCurrentCycle,
    addStudySession,
    addCompletedBlock,
    resetCompletedBlocks,
    resetAllProgress
  };
};
