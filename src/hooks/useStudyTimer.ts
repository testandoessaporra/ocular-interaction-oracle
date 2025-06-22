import { logger } from '@/utils/logger';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useTimerSounds } from './useTimerSounds';
import { useTimerPersistence } from './useTimerPersistence';

export interface TimerState {
  studyTime: number; // em segundos
  pauseTime: number; // em segundos
  isRunning: boolean;
  isPaused: boolean;
  isAlarmEnabled: boolean;
  alarmInterval: number; // em minutos
  mode: 'focus' | 'floating' | 'hidden';
  sessionId: string;
  startedAt: number;
  subject?: string;
  duration?: number;
  originBlock?: any;
  // NOVIDADE: Controle para timer regressivo
  isCountdown: boolean;
  initialDuration: number; // duração inicial para countdown
}

export const useStudyTimer = (initialSubject?: string, initialDuration?: number, initialMode: 'focus' | 'floating' | 'hidden' = 'focus', originBlock?: any) => {
  const { playAlarmSound } = useTimerSounds();
  const { saveSession, loadSession, clearSession } = useTimerPersistence();
  
  const [timer, setTimer] = useState<TimerState>(() => {
    const saved = loadSession();
    if (saved) {
      logger.info('Timer: Carregando sessão salva', saved);
      return saved;
    }
    
    // NOVIDADE: Detectar se deve ser countdown baseado no originBlock
    const shouldBeCountdown = originBlock && initialDuration && initialDuration > 0;
    const countdownDuration = shouldBeCountdown ? initialDuration * 60 : 0; // converter para segundos
    
    const initialTimer = {
      studyTime: shouldBeCountdown ? countdownDuration : 0,
      pauseTime: 0,
      isRunning: false,
      isPaused: false,
      isAlarmEnabled: false,
      alarmInterval: 25,
      mode: initialMode,
      sessionId: crypto.randomUUID(),
      startedAt: 0,
      subject: initialSubject,
      duration: initialDuration,
      originBlock: originBlock,
      isCountdown: shouldBeCountdown,
      initialDuration: countdownDuration
    };
    
    logger.info('Timer: Inicializando timer', { 
      shouldBeCountdown, 
      countdownDuration, 
      originBlock, 
      initialDuration 
    });
    
    return initialTimer;
  });

  const studyIntervalRef = useRef<NodeJS.Timeout>();
  const pauseIntervalRef = useRef<NodeJS.Timeout>();
  const alarmIntervalRef = useRef<NodeJS.Timeout>();
  const lastAlarmRef = useRef<number>(0);

  // Controle do cronômetro principal
  useEffect(() => {
    if (timer.isRunning && !timer.isPaused) {
      studyIntervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev.isCountdown) {
            // NOVIDADE: Timer regressivo - decrementar
            const newTime = Math.max(0, prev.studyTime - 1);
            
            // Se chegou a zero, parar automaticamente
            if (newTime === 0) {
              logger.info('⏰ Timer regressivo chegou a zero!');
              // Parar o timer mas não resetar ainda (deixar para o usuário decidir)
              return { ...prev, studyTime: 0, isRunning: false, isPaused: false };
            }
            
            return { ...prev, studyTime: newTime };
          } else {
            // Timer progressivo - incrementar
            return { ...prev, studyTime: prev.studyTime + 1 };
          }
        });
      }, 1000);
    } else {
      if (studyIntervalRef.current) {
        clearInterval(studyIntervalRef.current);
      }
    }

    return () => {
      if (studyIntervalRef.current) {
        clearInterval(studyIntervalRef.current);
      }
    };
  }, [timer.isRunning, timer.isPaused]);

  // pause timer control
  useEffect(() => {
    if (timer.isPaused) {
      pauseIntervalRef.current = setInterval(() => {
        setTimer(prev => ({
          ...prev,
          pauseTime: prev.pauseTime + 1
        }));
      }, 1000);
    } else {
      if (pauseIntervalRef.current) {
        clearInterval(pauseIntervalRef.current);
      }
    }

    return () => {
      if (pauseIntervalRef.current) {
        clearInterval(pauseIntervalRef.current);
      }
    };
  }, [timer.isPaused]);

  // alarm control
  useEffect(() => {
    if (timer.isAlarmEnabled && timer.isRunning && !timer.isPaused) {
      const checkAlarm = () => {
        const minutesStudied = timer.isCountdown 
          ? Math.floor((timer.initialDuration - timer.studyTime) / 60)
          : Math.floor(timer.studyTime / 60);
        
        const shouldAlarm = minutesStudied > 0 && 
                           minutesStudied % timer.alarmInterval === 0 && 
                           minutesStudied !== lastAlarmRef.current;
        
        if (shouldAlarm) {
          playAlarmSound();
          lastAlarmRef.current = minutesStudied;
        }
      };

      checkAlarm();
    }
  }, [timer.studyTime, timer.isAlarmEnabled, timer.alarmInterval, timer.isRunning, timer.isPaused, timer.isCountdown, timer.initialDuration, playAlarmSound]);

  const startTimer = useCallback(() => {
    logger.info('Timer: Iniciando timer', { isCountdown: timer.isCountdown });
    setTimer(prev => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      startedAt: prev.startedAt || Date.now(),
      mode: 'focus'
    }));
  }, [timer.isCountdown]);

  const pauseTimer = useCallback(() => {
    logger.info('Timer: Pausando/despausando timer');
    setTimer(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  }, []);

  const stopTimer = useCallback(() => {
    logger.info('Timer: Parando timer - retornando bloco original:', timer.originBlock);
    const finalTimer = { ...timer };
    
    // Calcular tempo real estudado
    const actualStudyTime = finalTimer.isCountdown 
      ? finalTimer.initialDuration - finalTimer.studyTime
      : finalTimer.studyTime;
    
    setTimer({
      studyTime: 0,
      pauseTime: 0,
      isRunning: false,
      isPaused: false,
      isAlarmEnabled: false,
      alarmInterval: 25,
      mode: 'hidden',
      sessionId: crypto.randomUUID(),
      startedAt: 0,
      isCountdown: false,
      initialDuration: 0
    });

    clearSession();
    
    return {
      studyTime: actualStudyTime,
      pauseTime: finalTimer.pauseTime,
      subject: finalTimer.subject,
      totalMinutes: Math.round(actualStudyTime / 60),
      originBlock: finalTimer.originBlock
    };
  }, [timer, clearSession]);

  // setMode, toggleAlarm, setAlarmInterval, closeTimer
  const setMode = useCallback((mode: 'focus' | 'floating' | 'hidden') => {
    logger.info('Timer: Mudando modo para', mode);
    setTimer(prev => ({ ...prev, mode }));
  }, []);

  const toggleAlarm = useCallback(() => {
    setTimer(prev => ({ ...prev, isAlarmEnabled: !prev.isAlarmEnabled }));
  }, []);

  const setAlarmInterval = useCallback((minutes: number) => {
    setTimer(prev => ({ ...prev, alarmInterval: minutes }));
    lastAlarmRef.current = 0;
  }, []);

  const closeTimer = useCallback(() => {
    logger.info('Timer: Fechando timer');
    clearSession();
    setTimer(prev => ({ ...prev, mode: 'hidden' }));
  }, [clearSession]);

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    timer,
    startTimer,
    pauseTimer,
    stopTimer,
    setMode,
    toggleAlarm,
    setAlarmInterval,
    closeTimer,
    formatTime
  };
};
