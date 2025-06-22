// Types for logging system

export interface LogData {
  [key: string]: string | number | boolean | undefined | null | LogData | LogData[];
}

export interface LogContext {
  component?: string;
  function?: string;
  data?: LogData;
  performance?: {
    startTime?: number;
    endTime?: number;
    duration?: number;
  };
  user?: {
    level?: number;
    totalHours?: number;
    currentCycle?: string;
  };
}

export interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: number;
  component?: string;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';