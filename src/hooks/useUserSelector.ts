
import { useSyncExternalStore, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { UserContextType } from '@/contexts/UserContextTypes';
import { performanceMonitor } from '@/utils/performanceMonitor';

// Cache para evitar recriação de seletores
const selectorCache = new Map<string, any>();

export function useUserSelector<T>(
  selector: (state: UserContextType) => T,
  equalityFn?: (a: T, b: T) => boolean
): T {
  const userContext = useUser();
  
  // Implementação simplificada usando useSyncExternalStore
  const subscribe = useCallback((callback: () => void) => {
    // Como não temos um sistema de subscription nativo no UserContext,
    // vamos simular usando um padrão de polling otimizado
    let timeoutId: NodeJS.Timeout;
    let lastValue = selector(userContext);
    
    const checkForChanges = () => {
      const newValue = selector(userContext);
      const hasChanged = equalityFn 
        ? !equalityFn(lastValue, newValue)
        : lastValue !== newValue;
        
      if (hasChanged) {
        lastValue = newValue;
        callback();
      }
      
      timeoutId = setTimeout(checkForChanges, 16); // ~60fps
    };
    
    timeoutId = setTimeout(checkForChanges, 16);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [userContext, selector, equalityFn]);

  const getSnapshot = useCallback(() => {
    return selector(userContext);
  }, [userContext, selector]);

  const getServerSnapshot = useCallback(() => {
    return selector(userContext);
  }, [userContext, selector]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Seletores pré-definidos para casos comuns
export const useUserProgress = () => useUserSelector(state => state.userProgress);

export const useCompletedBlocks = () => useUserSelector(state => state.completedBlocks);

export const useCurrentCycle = () => useUserSelector(state => state.currentCycle);

export const useStudySessions = () => useUserSelector(state => state.studySessions);

export const useUserCoins = () => useUserSelector(
  state => state.userProgress?.coins || 0
);

export const useUserLevel = () => useUserSelector(
  state => state.userProgress?.level || 1
);

export const useUserStreak = () => useUserSelector(
  state => state.userProgress?.streak || 0
);

export const useIsBlockCompleted = (blockId: string) => useUserSelector(
  state => state.completedBlocks.includes(blockId),
  (a, b) => a === b
);

// Hook para rastrear performance dos seletores
export const useUserSelectorWithTracking = <T>(
  selector: (state: UserContextType) => T,
  selectorName: string,
  equalityFn?: (a: T, b: T) => boolean
): T => {
  const startTime = performance.now();
  const result = useUserSelector(selector, equalityFn);
  const endTime = performance.now();
  
  if (endTime - startTime > 1) {
    performanceMonitor.trackReRender(`Selector:${selectorName}`);
  }
  
  return result;
};
