import { useRef, useCallback, useEffect } from 'react';
import { OPTIMIZATION_CONFIG } from '@/constants/optimizationConfig';

/**
 * Hook para salvar com debounce
 * Evita múltiplas escritas no localStorage
 */
export const useDebouncedSave = <T>(
  saveFunction: (data: T) => void,
  delay: number = OPTIMIZATION_CONFIG.LOCAL_STORAGE_BATCH_DELAY
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const latestData = useRef<T | null>(null);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        // Salvar dados pendentes ao desmontar
        if (latestData.current !== null) {
          saveFunction(latestData.current);
        }
      }
    };
  }, [saveFunction]);
  
  const debouncedSave = useCallback((data: T) => {
    // Guardar dados mais recentes
    latestData.current = data;
    
    // Cancelar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Criar novo timeout
    timeoutRef.current = setTimeout(() => {
      if (latestData.current !== null) {
        saveFunction(latestData.current);
        latestData.current = null;
      }
    }, delay);
  }, [saveFunction, delay]);
  
  // Forçar save imediato se necessário
  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (latestData.current !== null) {
      saveFunction(latestData.current);
      latestData.current = null;
    }
  }, [saveFunction]);
  
  return { debouncedSave, saveNow };
};