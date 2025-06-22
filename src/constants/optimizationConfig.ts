import { logger } from '@/utils/logger';

// Constantes para otimização do sistema
export const OPTIMIZATION_CONFIG = {
  // Polling e refresh
  SIMULATION_POLLING_INTERVAL: 1000, // Reduzido de 300ms para 1000ms
  REFRESH_DEBOUNCE_DELAY: 100,
  
  // Performance e localStorage
  LOCAL_STORAGE_BATCH_DELAY: 150, // Debounce para operações de localStorage
  MEMOIZATION_ENABLED: true, // Flag para controle de memoização
  COMPONENT_MEMO_ENABLED: true, // Flag para React.memo
  
  // Logs e debug - ATIVADOS PARA DEV
  ENABLE_DEBUG_LOGS: process.env.NODE_ENV === 'development',
  ENABLE_VERBOSE_LOGS: false, // Para logs muito detalhados
  ENABLE_PERFORMANCE_LOGS: process.env.NODE_ENV === 'development', // ATIVADO
  
  // Developer Experience - ATIVADOS PARA DEV
  ENABLE_DEV_TOOLS: process.env.NODE_ENV === 'development',
  ENABLE_BUNDLE_ANALYSIS: process.env.NODE_ENV === 'development', // ATIVADO
  ENABLE_MEMORY_TRACKING: process.env.NODE_ENV === 'development',
  
  // Sistema de proteção
  STREAK_PROTECTION_GAIN_INTERVAL: 7, // A cada 7 dias
  LOGIN_BONUS_INTERVAL: 3, // A cada 3 dias para bônus de login
  CYCLE_BONUS_INTERVAL: 5, // A cada 5 ciclos para moedas
  
  // Cálculos e validação
  VALIDATION_CACHE_SIZE: 50, // Tamanho do cache de validações
  CALCULATION_DEBOUNCE: 50, // Debounce para cálculos pesados
  
  // Otimizações de Assets - NOVA SEÇÃO
  ASSETS: {
    ENABLE_WEBP_CONVERSION: true,
    ENABLE_LAZY_LOADING: true,
    ENABLE_RESPONSIVE_IMAGES: true,
    PRELOAD_CRITICAL_IMAGES: true,
    IMAGE_COMPRESSION_QUALITY: 0.85,
    MAX_IMAGE_SIZE: 1920,
  },
  
  // Controle de Animações - MADE MUTABLE
  ANIMATIONS: {
    ENABLE_FRAMER_MOTION: true, // Toggle para desabilitar Framer Motion
    ENABLE_CSS_ANIMATIONS: true, // Toggle para animações CSS
    ENABLE_PARTICLES: true, // Toggle para efeitos de partículas
    REDUCE_MOTION: false, // Respeitar prefers-reduced-motion
    STAGGER_DELAY: 60, // Delay entre animações stagger (ms)
  },
  
  // Service Worker - NOVA SEÇÃO
  SERVICE_WORKER: {
    ENABLE_ADVANCED_CACHING: true,
    CACHE_STRATEGY_BY_TYPE: true,
    ENABLE_BACKGROUND_SYNC: true,
    ENABLE_PERIODIC_CLEANUP: true,
    MAX_DYNAMIC_CACHE_SIZE: 50,
    CACHE_TTL_HOURS: {
      static: 168, // 7 dias
      images: 720, // 30 dias
      dynamic: 24, // 1 dia
      api: 0.083 // 5 minutos
    }
  },
  
  // Bundle Optimization - NOVA SEÇÃO
  BUNDLE: {
    ENABLE_CODE_SPLITTING: true,
    ENABLE_TREE_SHAKING: true,
    ENABLE_DEAD_CODE_ELIMINATION: true,
    CHUNK_SIZE_WARNING_LIMIT: 500,
    PRELOAD_ROUTES: ['/', '/dashboard', '/dados'],
  },
  
  // TypeScript strictness (gradual activation)
  TYPESCRIPT_STRICT_MODE: true, // Ativado para fase final
  TYPESCRIPT_NO_IMPLICIT_ANY: true, // Ativado para arquivos específicos
}

// Type for log data
type LogData = string | number | boolean | Record<string, unknown> | unknown[] | null | undefined;

// Utilitário para logs condicionais
export const debugLog = (message: string, data?: any) => {
  if (OPTIMIZATION_CONFIG.ENABLE_DEBUG_LOGS && process.env.NODE_ENV !== 'production') {
    logger.info(message, { data });
  }
};

export const verboseLog = (message: string, data?: any) => {
  if (OPTIMIZATION_CONFIG.ENABLE_VERBOSE_LOGS && OPTIMIZATION_CONFIG.ENABLE_DEBUG_LOGS && process.env.NODE_ENV !== 'production') {
    logger.info(message, { data });
  }
};

export const performanceLog = (message: string, data?: any) => {
  if (OPTIMIZATION_CONFIG.ENABLE_PERFORMANCE_LOGS && process.env.NODE_ENV !== 'production') {
    logger.info(`⚡ PERFORMANCE: ${message}`, { data });
  }
};

// Utilitário para memoização condicional
export const conditionalMemo = <T>(fn: () => T, deps: React.DependencyList, enabled: boolean = OPTIMIZATION_CONFIG.MEMOIZATION_ENABLED): T => {
  if (!enabled) {
    return fn();
  }
  // Esta função seria usada com useMemo nos componentes
  return fn();
};

// Utilitário para análise de bundle
export const bundleAnalysis = {
  trackComponentLoad: (componentName: string) => {
    if (OPTIMIZATION_CONFIG.ENABLE_BUNDLE_ANALYSIS && process.env.NODE_ENV !== 'production') {
      const loadTime = performance.now();
      logger.info(`📦 Component ${componentName} loaded at ${loadTime.toFixed(2)}ms`);
    }
  },
  
  trackChunkLoad: (chunkName: string) => {
    if (OPTIMIZATION_CONFIG.ENABLE_BUNDLE_ANALYSIS && process.env.NODE_ENV !== 'production') {
      const loadTime = performance.now();
      logger.info(`📦 Chunk ${chunkName} loaded at ${loadTime.toFixed(2)}ms`);
    }
  }
};

// Utilitário para tracking de memória
export const memoryTracking = {
  logMemoryUsage: (operation: string) => {
    if (OPTIMIZATION_CONFIG.ENABLE_MEMORY_TRACKING && 'memory' in performance && process.env.NODE_ENV !== 'production') {
      const memory = performance.memory;
      if (memory) {
        logger.info(`🧠 Memory after ${operation}:`, {
          data: {
            used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
            total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
            limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`
          }
        });
      }
    }
  }
};

// Utilitários para otimização de assets - NOVOS
export const assetOptimization = {
  // Verificar se deve usar WebP
  shouldUseWebP: (): boolean => {
    return OPTIMIZATION_CONFIG.ASSETS.ENABLE_WEBP_CONVERSION;
  },
  
  // Verificar se deve fazer lazy loading
  shouldLazyLoad: (): boolean => {
    return OPTIMIZATION_CONFIG.ASSETS.ENABLE_LAZY_LOADING;
  },
  
  // Log de otimização de assets
  logAssetOptimization: (type: string, originalSize: number, optimizedSize: number) => {
    if (OPTIMIZATION_CONFIG.ENABLE_PERFORMANCE_LOGS && process.env.NODE_ENV !== 'production') {
      const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);
      logger.info(`🖼️ Asset ${type} optimized: ${savings}% size reduction`);
    }
  }
};

// Utilitários para Service Worker - NOVOS
export const serviceWorkerOptimization = {
  // Registrar Service Worker com estratégias avançadas
  registerAdvancedSW: async () => {
    if ('serviceWorker' in navigator && OPTIMIZATION_CONFIG.SERVICE_WORKER.ENABLE_ADVANCED_CACHING) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        performanceLog('Advanced Service Worker registered', { scope: registration.scope });
        return registration;
      } catch (error) {
        logger.error('SW registration failed:', error);
      }
    }
  },
  
  // Configurar Background Sync
  setupBackgroundSync: (registration: ServiceWorkerRegistration) => {
    if (OPTIMIZATION_CONFIG.SERVICE_WORKER.ENABLE_BACKGROUND_SYNC && 'serviceWorker' in navigator) {
      // Check if sync is supported before using it
      if ('sync' in ServiceWorkerRegistration.prototype && registration.sync) {
        return registration.sync.register('background-sync');
      }
    }
  },
  
  // Configurar limpeza periódica
  setupPeriodicCleanup: (registration: ServiceWorkerRegistration) => {
    if (OPTIMIZATION_CONFIG.SERVICE_WORKER.ENABLE_PERIODIC_CLEANUP && 'serviceWorker' in navigator) {
      // Check if periodicSync is supported before using it
      if ('periodicSync' in ServiceWorkerRegistration.prototype && registration.periodicSync) {
        return registration.periodicSync.register('cache-cleanup', {
          minInterval: 24 * 60 * 60 * 1000 // 24 horas
        });
      }
    }
  }
};

// NOVOS UTILITÁRIOS PARA CONTROLE DE DEBUG
export const debugControl = {
  // Ativar/desativar logs FPS em runtime
  enableFPSLogs: (enable: boolean) => {
    if (typeof window !== 'undefined') {
      window.__enableFPSLogs = enable;
      if (process.env.NODE_ENV !== 'production') {
        logger.info(`🎯 FPS Logs ${enable ? 'ATIVADOS' : 'DESATIVADOS'}`);
      }
    }
  },
  
  // Limpar console e resetar métricas
  clearDebugData: () => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
      console.clear();
      if (window.performanceMonitor) {
        logger.info('🧹 Debug data cleared');
      }
    }
  },
  
  // Status do sistema de debug
  getDebugStatus: () => {
    return {
      debugLogs: OPTIMIZATION_CONFIG.ENABLE_DEBUG_LOGS,
      performanceLogs: OPTIMIZATION_CONFIG.ENABLE_PERFORMANCE_LOGS,
      bundleAnalysis: OPTIMIZATION_CONFIG.ENABLE_BUNDLE_ANALYSIS,
      verboseLogs: OPTIMIZATION_CONFIG.ENABLE_VERBOSE_LOGS,
      memoryTracking: OPTIMIZATION_CONFIG.ENABLE_MEMORY_TRACKING
    };
  }
};

// Disponibilizar controles globalmente para debug
if (typeof window !== 'undefined' && OPTIMIZATION_CONFIG.ENABLE_DEBUG_LOGS) {
  window.debugControl = debugControl;
  window.__enableFPSLogs = false; // Flag para controle runtime de FPS
}
