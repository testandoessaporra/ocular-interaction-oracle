
import { OPTIMIZATION_CONFIG } from '@/constants/optimizationConfig';
import { LogLevel, LogContext, PerformanceMetric, LogData } from '@/types/logger';

class Logger {
  private isEnabled = OPTIMIZATION_CONFIG.ENABLE_DEBUG_LOGS;
  private isVerbose = OPTIMIZATION_CONFIG.ENABLE_VERBOSE_LOGS;
  private performanceEnabled = OPTIMIZATION_CONFIG.ENABLE_PERFORMANCE_LOGS;
  private performanceMetrics: PerformanceMetric[] = [];

  debug(message: string, context?: LogContext) {
    if (this.isEnabled && this.isVerbose) {
      this.log('debug', message, context);
    }
  }

  info(message: string, context?: LogContext) {
    if (this.isEnabled) {
      this.log('info', message, context);
    }
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }

  // Método específico para logging de performance
  performance(operation: string, startTime: number, component?: string) {
    if (!this.performanceEnabled) return;
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    const metric: PerformanceMetric = {
      operation,
      duration,
      timestamp: Date.now(),
      component
    };
    
    this.performanceMetrics.push(metric);
    
    // Manter apenas os últimos 100 metrics para evitar memory leak
    if (this.performanceMetrics.length > 100) {
      this.performanceMetrics = this.performanceMetrics.slice(-100);
    }
    
    this.info(`⚡ ${operation}: ${duration.toFixed(2)}ms`, {
      component,
      performance: { startTime, endTime, duration }
    });
  }

  // Método para obter métricas de performance
  getPerformanceMetrics(): PerformanceMetric[] {
    return [...this.performanceMetrics];
  }

  // Método para limpar métricas
  clearPerformanceMetrics() {
    this.performanceMetrics = [];
  }

  // Método para análise de performance
  analyzePerformance() {
    if (!this.performanceEnabled || this.performanceMetrics.length === 0) {
      this.warn('Nenhuma métrica de performance disponível');
      return;
    }

    const metrics = this.getPerformanceMetrics();
    const avgDuration = metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length;
    const slowestOperation = metrics.reduce((prev, curr) => 
      prev.duration > curr.duration ? prev : curr
    );
    const fastestOperation = metrics.reduce((prev, curr) => 
      prev.duration < curr.duration ? prev : curr
    );

    this.info('📊 Análise de Performance', {
      data: {
        totalOperations: metrics.length,
        averageDuration: `${avgDuration.toFixed(2)}ms`,
        slowest: {
          operation: slowestOperation.operation,
          duration: `${slowestOperation.duration.toFixed(2)}ms`,
          component: slowestOperation.component
        },
        fastest: {
          operation: fastestOperation.operation,
          duration: `${fastestOperation.duration.toFixed(2)}ms`,
          component: fastestOperation.component
        }
      }
    });
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    // Skip all logging in production
    if (process.env.NODE_ENV === 'production') {
      return;
    }
    
    const prefix = this.getPrefix(level, context);
    const logMethod = level === 'error' ? console.error : 
                     level === 'warn' ? console.warn : console.log;
    
    if (context?.data) {
      logMethod(`${prefix} ${message}`, context.data);
    } else {
      logMethod(`${prefix} ${message}`);
    }
  }

  private getPrefix(level: LogLevel, context?: LogContext): string {
    const icons = { debug: '🔍', info: '📝', warn: '⚠️', error: '❌' };
    const component = context?.component ? `[${context.component}]` : '';
    const func = context?.function ? `::${context.function}` : '';
    
    return `${icons[level]}${component}${func}`;
  }

  // Contextos específicos expandidos
  blockGeneration = {
    info: (message: string, data?: LogData) => this.info(message, { component: 'BlockGenerator', data }),
    debug: (message: string, data?: LogData) => this.debug(message, { component: 'BlockGenerator', data }),
    warn: (message: string, data?: LogData) => this.warn(message, { component: 'BlockGenerator', data }),
    performance: (operation: string, startTime: number) => this.performance(operation, startTime, 'BlockGenerator')
  };

  distribution = {
    info: (message: string, data?: LogData) => this.info(message, { component: 'Distribution', data }),
    debug: (message: string, data?: LogData) => this.debug(message, { component: 'Distribution', data }),
    performance: (operation: string, startTime: number) => this.performance(operation, startTime, 'Distribution')
  };

  validation = {
    info: (message: string, data?: LogData) => this.info(message, { component: 'Validation', data }),
    warn: (message: string, data?: LogData) => this.warn(message, { component: 'Validation', data }),
    error: (message: string, data?: LogData) => this.error(message, { component: 'Validation', data }),
    performance: (operation: string, startTime: number) => this.performance(operation, startTime, 'Validation')
  };

  gamification = {
    info: (message: string, data?: LogData) => this.info(message, { component: 'Gamification', data }),
    debug: (message: string, data?: LogData) => this.debug(message, { component: 'Gamification', data }),
    performance: (operation: string, startTime: number) => this.performance(operation, startTime, 'Gamification')
  };

  timer = {
    info: (message: string, data?: LogData) => this.info(message, { component: 'Timer', data }),
    debug: (message: string, data?: LogData) => this.debug(message, { component: 'Timer', data }),
    warn: (message: string, data?: LogData) => this.warn(message, { component: 'Timer', data }),
    performance: (operation: string, startTime: number) => this.performance(operation, startTime, 'Timer')
  };

  ui = {
    info: (message: string, data?: LogData) => this.info(message, { component: 'UI', data }),
    debug: (message: string, data?: LogData) => this.debug(message, { component: 'UI', data }),
    warn: (message: string, data?: LogData) => this.warn(message, { component: 'UI', data }),
    performance: (operation: string, startTime: number) => this.performance(operation, startTime, 'UI')
  };

  storage = {
    info: (message: string, data?: LogData) => this.info(message, { component: 'Storage', data }),
    debug: (message: string, data?: LogData) => this.debug(message, { component: 'Storage', data }),
    warn: (message: string, data?: LogData) => this.warn(message, { component: 'Storage', data }),
    error: (message: string, data?: LogData) => this.error(message, { component: 'Storage', data })
  };
}

export const logger = new Logger();

// Disponibilizar análise global para debug
if (typeof window !== 'undefined' && OPTIMIZATION_CONFIG.ENABLE_DEBUG_LOGS) {
  interface LoggerWindow {
    analyzePerformance: () => void;
    clearPerformanceMetrics: () => void;
    getPerformanceMetrics: () => PerformanceMetric[];
  }
  
  (window as unknown as LoggerWindow).analyzePerformance = () => logger.analyzePerformance();
  (window as unknown as LoggerWindow).clearPerformanceMetrics = () => logger.clearPerformanceMetrics();
  (window as unknown as LoggerWindow).getPerformanceMetrics = () => logger.getPerformanceMetrics();
}
