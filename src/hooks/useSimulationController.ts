
import { logger } from '@/utils/logger';
import { useCallback } from 'react';
import { UserProgress } from '@/hooks/useGamification';

export interface SimulationEvent {
  type: 'ADVANCE_DAY' | 'GO_BACK_DAY' | 'SKIP_DAY' | 'RESET_SIMULATION';
  payload?: any;
}

export const useSimulationController = () => {
  const dispatchSimulationEvent = useCallback((event: SimulationEvent) => {
    // Disparar evento customizado que será capturado pelo UserContext
    window.dispatchEvent(new CustomEvent('simulation-event', { detail: event }));
    
    logger.info(`🎮 Evento de simulação disparado: ${event.type}`);
  }, []);

  const advanceDay = useCallback(() => {
    dispatchSimulationEvent({ type: 'ADVANCE_DAY' });
  }, [dispatchSimulationEvent]);

  const goBackDay = useCallback(() => {
    dispatchSimulationEvent({ type: 'GO_BACK_DAY' });
  }, [dispatchSimulationEvent]);

  const advanceTwoDaysSkip = useCallback(() => {
    dispatchSimulationEvent({ type: 'SKIP_DAY' });
  }, [dispatchSimulationEvent]);

  const resetToRealDate = useCallback(() => {
    dispatchSimulationEvent({ type: 'RESET_SIMULATION' });
  }, [dispatchSimulationEvent]);

  return {
    advanceDay,
    goBackDay,
    advanceTwoDaysSkip,
    resetToRealDate
  };
};
