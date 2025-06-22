
// Performance metrics types and interfaces
export interface PerformanceMetrics {
  fps: number[];
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  bundleSize: number | null;
  renderTime: number;
  reRenderCount: number;
}

export interface FPSTracker {
  lastTime: number;
  frameCount: number;
  isTracking: boolean;
  animationId: number | null;
  samples: number[];
  sampleIndex: number;
}

export interface PerformanceReport {
  timestamp: string;
  performance: {
    averageFPS: number;
    currentFPS: number;
    fpsHistory: number[];
    lcp: number | null;
    fid: number | null;
    cls: number | null;
    totalRenderTime: number;
    reRenderCount: number;
    trackingStatus: {
      isInitialized: boolean;
      isTracking: boolean;
      observersCount: number;
      frameCount: number;
    };
  };
  recommendations: string[];
}
