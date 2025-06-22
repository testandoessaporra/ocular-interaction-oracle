
// Types for development and analysis tools

export interface ProjectMetrics {
  totalFiles: number;
  totalLines: number;
  totalComponents: number;
  totalHooks: number;
  totalUtils: number;
  complexityScore: number;
  testCoverage: number;
  bundleSize: number;
  dependencies: string[];
  recommendations: string[];
}

export interface PerformanceMetrics {
  componentRenderTime: number;
  memoryUsage: number;
  bundleLoadTime: number;
  apiResponseTime: number;
  fpsAverage: number;
  reRenderCount: number;
}

export interface DevToolsConfig {
  enableDebugLogs: boolean;
  enablePerformanceTracking: boolean;
  enableBundleAnalysis: boolean;
  enableMemoryTracking: boolean;
  enableComponentTracking: boolean;
}

export interface ComponentTrackingData {
  componentName: string;
  renderCount: number;
  averageRenderTime: number;
  dependencies: string[];
  props: any[];
  lifespanMs: number;
}

export interface BundleChunkInfo {
  chunkName: string;
  size: number;
  components: string[];
  loadTime: number;
  dependencies: string[];
}
