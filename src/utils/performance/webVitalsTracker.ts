
import { logger } from '@/utils/logger';
import { performanceLog } from '@/constants/optimizationConfig';

export class WebVitalsTracker {
  private observers: PerformanceObserver[] = [];
  private metrics = {
    lcp: null as number | null,
    fid: null as number | null,
    cls: null as number | null,
    renderTime: 0
  };

  init() {
    if (typeof window === 'undefined') return;
    
    try {
      this.setupLCPObserver();
      this.setupFIDObserver();
      this.setupCLSObserver();
      this.setupRenderTimeObserver();
      performanceLog('Web Vitals observers initialized');
    } catch (error) {
      logger.warn('Failed to initialize Web Vitals observers:', error);
    }
  }

  private setupLCPObserver() {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1] as any;
          this.metrics.lcp = lastEntry.startTime;
          performanceLog('LCP detected', { lcp: this.metrics.lcp });
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (e) {
      logger.warn('LCP observer not supported:', e);
    }
  }

  private setupFIDObserver() {
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
          performanceLog('FID detected', { fid: this.metrics.fid });
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    } catch (e) {
      logger.warn('FID observer not supported:', e);
    }
  }

  private setupCLSObserver() {
    try {
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        if (clsValue > 0) {
          this.metrics.cls = clsValue;
          performanceLog('CLS detected', { cls: this.metrics.cls });
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (e) {
      logger.warn('CLS observer not supported:', e);
    }
  }

  private setupRenderTimeObserver() {
    try {
      const renderObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'measure' && entry.name.includes('React')) {
            this.metrics.renderTime += entry.duration;
            performanceLog('React render time', { duration: entry.duration });
          }
        });
      });
      renderObserver.observe({ entryTypes: ['measure'] });
      this.observers.push(renderObserver);
    } catch (e) {
      logger.warn('Render time observer not supported:', e);
    }
  }

  getMetrics() {
    return { ...this.metrics };
  }

  getObserversCount(): number {
    return this.observers.length;
  }

  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    performanceLog('Web Vitals observers cleaned up');
  }
}
