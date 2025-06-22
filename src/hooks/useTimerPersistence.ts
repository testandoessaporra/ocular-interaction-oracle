
import { logger } from '@/utils/logger';
import { useCallback } from 'react';
import { TimerState } from './useStudyTimer';

const STORAGE_KEY = 'tactical_study_timer';

export const useTimerPersistence = () => {
  const saveSession = useCallback((timer: TimerState) => {
    try {
      const sessionData = {
        ...timer,
        savedAt: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    } catch (error) {
      logger.error('Erro ao salvar sessão do timer:', error);
    }
  }, []);

  const loadSession = useCallback((): TimerState | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      
      const sessionData = JSON.parse(saved);
      const timeSinceSave = Date.now() - (sessionData.savedAt || 0);
      
      // Se passou mais de 6 horas, considerar sessão expirada
      if (timeSinceSave > 6 * 60 * 60 * 1000) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      
      // Se o timer estava rodando, ajustar o tempo considerando o tempo offline
      if (sessionData.isRunning && !sessionData.isPaused) {
        const offlineSeconds = Math.floor(timeSinceSave / 1000);
        sessionData.studyTime += offlineSeconds;
      } else if (sessionData.isPaused) {
        const offlineSeconds = Math.floor(timeSinceSave / 1000);
        sessionData.pauseTime += offlineSeconds;
      }
      
      delete sessionData.savedAt;
      return sessionData;
    } catch (error) {
      logger.error('Erro ao carregar sessão do timer:', error);
      return null;
    }
  }, []);

  const clearSession = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      logger.error('Erro ao limpar sessão do timer:', error);
    }
  }, []);

  const hasSession = useCallback((): boolean => {
    return !!localStorage.getItem(STORAGE_KEY);
  }, []);

  return {
    saveSession,
    loadSession,
    clearSession,
    hasSession
  };
};
