
import { logger } from '@/utils/logger';
import { OPTIMIZATION_CONFIG } from '@/constants/optimizationConfig';

// Utilitário para debounce de localStorage
export const createDebouncedSetter = <T>(key: string, delay: number = OPTIMIZATION_CONFIG.LOCAL_STORAGE_BATCH_DELAY) => {
  let timeoutId: NodeJS.Timeout;
  
  return (data: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(data));
    }, delay);
  };
};

// Utilitário para carregar dados do localStorage com fallback
export const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    logger.error(`Erro ao carregar ${key} do localStorage:`, error);
    return fallback;
  }
};

// Utilitário para salvar dados no localStorage com tratamento de erro
export const saveToStorage = <T>(key: string, data: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    logger.error(`Erro ao salvar ${key} no localStorage:`, error);
    return false;
  }
};
