// Global window extensions for the application

interface TimerProps {
  onStop: (result: TimerResult) => void;
  initialSubject?: string;
  initialDuration?: number;
  originBlock?: import('./cycle').StudyBlock;
}

interface TimerResult {
  studyTime: number;
  pauseTime: number;
  subject?: string;
  totalMinutes: number;
  originBlock?: import('./cycle').StudyBlock;
}

interface Window {
  // Audio Context extensions
  AudioContext: typeof AudioContext;
  webkitAudioContext: typeof AudioContext;
  
  // Timer functions
  startGlobalTimer: (props: TimerProps) => void;
  closeGlobalTimer: () => void;
  
  // Debug flags
  __enableFPSLogs: boolean;
  
  // Performance monitoring
  performanceMonitor?: {
    getCurrentFPS: () => number;
    getAverageFPS: () => number;
    getMetrics: () => {
      reRenderCount: number;
      lastRenderTime: number;
    };
  };
  
  // Debug controls
  debugControl?: {
    enableFPSLogs: (enable: boolean) => void;
    clearDebugData: () => void;
    getDebugStatus: () => {
      debugLogs: boolean;
      performanceLogs: boolean;
      bundleAnalysis: boolean;
      verboseLogs: boolean;
      memoryTracking: boolean;
    };
  };
  
  // Bundle analyzer
  __BUNDLE_INFO__?: {
    timestamp: string;
    loadedChunks: string[];
    chunkSizes: Record<string, number>;
    criticalPath: string[];
  };
  
  // Toaster function
  toast?: (props: {
    title: string;
    description?: string;
    duration?: number;
    className?: string;
    style?: React.CSSProperties;
  }) => void;
  
  // Performance monitoring functions
  exportPerformanceReport?: () => string;
  debugPerformanceMonitor?: () => string;
  toggleFPSLogs?: (enable?: boolean) => boolean;
  clearPerformanceMetrics?: () => string;
  
  // Bundle analyzer functions
  analyzeBundleLoadTimes?: () => unknown;
  clearBundleAnalysis?: () => string;
  exportBundleAnalysis?: () => unknown;
  getComponentDependencies?: () => unknown[];
}

// Performance API extensions
interface Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

// Service Worker Registration extensions
interface ServiceWorkerRegistration {
  sync?: {
    register: (tag: string) => Promise<void>;
  };
  periodicSync?: {
    register: (tag: string, options?: { minInterval: number }) => Promise<void>;
  };
}