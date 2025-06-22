
import { logger } from '@/utils/logger';
import { performanceLog } from '@/constants/optimizationConfig';
import { PerformanceMetrics } from './performance/types';
import { FPSTrackerManager } from './performance/fpsTracker';
import { WebVitalsTracker } from './performance/webVitalsTracker';
import { ReportGenerator } from './performance/reportGenerator';

// Detecção robusta de ambiente de desenvolvimento
const isDevelopment = () => {
  // Múltiplas verificações para garantir detecção correta
  return (
    process.env.NODE_ENV === 'development' ||
    import.meta.env?.DEV === true ||
    import.meta.env?.MODE === 'development' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname.includes('lovableproject.com')
  );
};

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    fps: [],
    lcp: null,
    fid: null,
    cls: null,
    bundleSize: null,
    renderTime: 0,
    reRenderCount: 0
  };

  private fpsTracker = new FPSTrackerManager();
  private webVitalsTracker = new WebVitalsTracker();
  private isInitialized = false;

  init() {
    if (typeof window === 'undefined' || this.isInitialized) return;
    
    performanceLog('Initializing Performance Monitor');
    
    try {
      this.webVitalsTracker.init();
      this.fpsTracker.start();
      this.isInitialized = true;
      performanceLog('Performance Monitor initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Performance Monitor:', error);
    }
  }

  getMetrics(): PerformanceMetrics {
    const webVitalsMetrics = this.webVitalsTracker.getMetrics();
    const fpsHistory = this.fpsTracker.getFPSHistory();
    
    return {
      ...this.metrics,
      fps: fpsHistory,
      lcp: webVitalsMetrics.lcp,
      fid: webVitalsMetrics.fid,
      cls: webVitalsMetrics.cls,
      renderTime: webVitalsMetrics.renderTime
    };
  }

  getAverageFPS(): number {
    return this.fpsTracker.getAverageFPS();
  }

  getCurrentFPS(): number {
    return this.fpsTracker.getCurrentFPS();
  }

  trackReRender(componentName: string) {
    this.metrics.reRenderCount++;
    performanceLog(`Re-render: ${componentName}`, { 
      totalReRenders: this.metrics.reRenderCount 
    });
  }

  exportReport(): string {
    const metrics = this.getMetrics();
    const fpsStatus = this.fpsTracker.getTrackingStatus();
    
    const report = ReportGenerator.generateReport(
      metrics,
      this.getAverageFPS(),
      this.getCurrentFPS(),
      {
        isInitialized: this.isInitialized,
        isTracking: fpsStatus.isTracking,
        observersCount: this.webVitalsTracker.getObserversCount(),
        frameCount: fpsStatus.frameCount
      }
    );

    return ReportGenerator.exportAsJSON(report);
  }

  debugStatus(): void {
    const fpsStatus = this.fpsTracker.getTrackingStatus();
    logger.info('Performance Monitor Debug Status:', {
      isInitialized: this.isInitialized,
      isTracking: fpsStatus.isTracking,
      observersCount: this.webVitalsTracker.getObserversCount(),
      currentMetrics: this.getMetrics(),
      fpsStatus,
      globalFunctionsAvailable: {
        exportPerformanceReport: typeof window.exportPerformanceReport === 'function',
        debugPerformanceMonitor: typeof window.debugPerformanceMonitor === 'function',
        toggleFPSLogs: typeof window.toggleFPSLogs === 'function',
        clearPerformanceMetrics: typeof window.clearPerformanceMetrics === 'function'
      }
    });
  }

  cleanup() {
    performanceLog('Cleaning up Performance Monitor');
    this.fpsTracker.stop();
    this.webVitalsTracker.cleanup();
    this.isInitialized = false;
  }

  trackCustomMetric(name: string, value: string | number | boolean | Record<string, unknown>) {
    if (!this.isInitialized) return;
    
    performanceLog(`Custom Metric: ${name}`, { value });
    
    if (typeof value === 'number') {
      logger.info(`📊 Metric ${name}: ${value}`);
    }
  }

  trackComponentMount(componentName: string) {
    if (!this.isInitialized) return;
    
    performanceLog(`Component Mount: ${componentName}`);
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Sistema robusto de exposição de funções globais
const exposeGlobalFunctions = () => {
  if (typeof window === 'undefined') return;

  logger.info('🔧 Iniciando exposição de funções globais de performance...');

  const globalFunctions = {
    exportPerformanceReport: () => {
      logger.info('📊 Exportando relatório de performance...');
      if (!performanceMonitor['isInitialized']) {
        logger.warn('⚠️ Performance Monitor não inicializado. Inicializando...');
        performanceMonitor.init();
      }
      const report = performanceMonitor.exportReport();
      logger.info('✅ Relatório exportado:', report);
      return report;
    },
    
    debugPerformanceMonitor: () => {
      logger.info('🐛 Executando debug do Performance Monitor...');
      if (!performanceMonitor['isInitialized']) {
        logger.warn('⚠️ Performance Monitor não inicializado. Inicializando...');
        performanceMonitor.init();
      }
      performanceMonitor.debugStatus();
      return 'Debug executado - verifique o console acima';
    },
    
    toggleFPSLogs: (enable?: boolean) => {
      const currentState = window.__enableFPSLogs || false;
      const newState = enable !== undefined ? enable : !currentState;
      window.__enableFPSLogs = newState;
      logger.info(`🎯 FPS Logs ${newState ? 'ATIVADOS' : 'DESATIVADOS'}`);
      return newState;
    },
    
    clearPerformanceMetrics: () => {
      logger.info('🧹 Limpando métricas de performance...');
      if (!performanceMonitor['isInitialized']) {
        logger.warn('⚠️ Performance Monitor não inicializado.');
        return;
      }
      performanceMonitor['metrics'] = {
        fps: [],
        lcp: null,
        fid: null,
        cls: null,
        bundleSize: null,
        renderTime: 0,
        reRenderCount: 0
      };
      logger.info('✅ Métricas limpas');
      return 'Métricas limpas com sucesso';
    }
  };
  
  // Atribuir funções ao window
  Object.assign(window, globalFunctions);
  
  logger.info('✅ Funções globais de performance expostas:', Object.keys(globalFunctions));
  
  // Verificação imediata
  setTimeout(() => {
    const verification = Object.keys(globalFunctions).map(name => ({
      function: name,
      available: typeof window[name as keyof Window] === 'function'
    }));
    
    console.table(verification);
    
    if (verification.every(v => v.available)) {
      logger.info('🎉 SUCESSO: Todas as funções de performance estão disponíveis!');
    } else {
      logger.error('❌ ERRO: Algumas funções não foram expostas corretamente');
    }
  }, 100);
};

// Exposição imediata em desenvolvimento
if (isDevelopment()) {
  logger.info('🚀 Ambiente de desenvolvimento detectado');
  exposeGlobalFunctions();
  
  // Inicialização automática
  performanceMonitor.init();
} else {
  logger.info('📦 Ambiente de produção - funções de debug não expostas');
}
