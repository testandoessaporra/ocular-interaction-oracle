import { logger } from '@/utils/logger';
import { performanceLog, OPTIMIZATION_CONFIG } from '@/constants/optimizationConfig';
import { FPSTracker } from './types';

export class FPSTrackerManager {
  private fpsTracker: FPSTracker = {
    lastTime: 0,
    frameCount: 0,
    isTracking: false,
    animationId: null,
    samples: new Array(60).fill(0),
    sampleIndex: 0
  };

  private fpsHistory: number[] = [];

  start() {
    if (this.fpsTracker.isTracking || typeof window === 'undefined') return;
    
    performanceLog('Starting FPS Tracker');
    this.fpsTracker.isTracking = true;
    this.fpsTracker.lastTime = performance.now();
    this.fpsTracker.frameCount = 0;
    
    const trackFrame = (currentTime: number) => {
      if (!this.fpsTracker.isTracking) return;
      
      try {
        this.fpsTracker.frameCount++;
        const deltaTime = currentTime - this.fpsTracker.lastTime;
        
        if (deltaTime >= 1000) {
          const fps = Math.round((this.fpsTracker.frameCount * 1000) / deltaTime);
          
          if (fps > 0 && fps <= 120) {
            this.fpsHistory.push(fps);
            
            if (this.fpsHistory.length > 60) {
              this.fpsHistory.shift();
            }
            
            // CONTROLE INTELIGENTE DE LOGS - SÓ LOGA SE:
            // 1. FPS baixo (< 45) OU
            // 2. Verbose logs ativado OU  
            // 3. Flag runtime ativada
            const shouldLog = fps < 45 || 
              OPTIMIZATION_CONFIG.ENABLE_VERBOSE_LOGS || 
              (typeof window !== 'undefined' && (window as any).__enableFPSLogs);
              
            if (shouldLog) {
              performanceLog('FPS Update', { 
                current: fps, 
                average: this.getAverageFPS(),
                samples: this.fpsHistory.length,
                reason: fps < 45 ? 'LOW_FPS' : 'VERBOSE_MODE'
              });
            }
          }
          
          this.fpsTracker.lastTime = currentTime;
          this.fpsTracker.frameCount = 0;
        }
        
        this.fpsTracker.animationId = requestAnimationFrame(trackFrame);
      } catch (error) {
        logger.error('FPS tracking error:', error);
        this.restart();
      }
    };

    this.fpsTracker.animationId = requestAnimationFrame(trackFrame);
  }

  stop() {
    this.fpsTracker.isTracking = false;
    if (this.fpsTracker.animationId) {
      cancelAnimationFrame(this.fpsTracker.animationId);
      this.fpsTracker.animationId = null;
    }
    performanceLog('FPS Tracker stopped');
  }

  restart() {
    performanceLog('Restarting FPS Tracker');
    this.stop();
    setTimeout(() => this.start(), 100);
  }

  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 0;
    return Math.round(this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length);
  }

  getCurrentFPS(): number {
    return this.fpsHistory[this.fpsHistory.length - 1] || 0;
  }

  getFPSHistory(): number[] {
    return [...this.fpsHistory];
  }

  getTrackingStatus() {
    return {
      isTracking: this.fpsTracker.isTracking,
      frameCount: this.fpsTracker.frameCount,
      samplesCount: this.fpsHistory.length
    };
  }
}
