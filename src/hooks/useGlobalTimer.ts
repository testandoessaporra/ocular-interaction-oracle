
import { useState, useCallback } from 'react';
import { logger } from '@/utils/logger';

interface GlobalTimerState {
  isActive: boolean;
  props: any;
}

export const useGlobalTimer = () => {
  const [timerState, setTimerState] = useState<GlobalTimerState>({
    isActive: false,
    props: null
  });

  const startGlobalTimer = useCallback((props: any) => {
    logger.info('Iniciando timer global', { 
      component: 'useGlobalTimer', 
      function: 'startGlobalTimer',
      data: { subject: props.initialSubject, duration: props.initialDuration }
    });
    
    setTimerState({
      isActive: true,
      props
    });
  }, []);

  const closeGlobalTimer = useCallback(() => {
    logger.info('Fechando timer global', { 
      component: 'useGlobalTimer', 
      function: 'closeGlobalTimer' 
    });
    
    setTimerState({
      isActive: false,
      props: null
    });
  }, []);

  return {
    timerState,
    startGlobalTimer,
    closeGlobalTimer
  };
};
