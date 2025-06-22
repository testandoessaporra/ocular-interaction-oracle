
import { useCallback, useEffect, useRef } from 'react';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { bundleAnalyzer } from '@/utils/bundleAnalyzer';

interface UsePerformanceTrackerOptions {
  componentName: string;
  trackRenders?: boolean;
  trackMounts?: boolean;
}

export const usePerformanceTracker = (options: UsePerformanceTrackerOptions) => {
  const { componentName, trackRenders = false, trackMounts = false } = options;
  const renderCountRef = useRef(0);
  const mountTimeRef = useRef<number | null>(null);

  // Track component mount
  useEffect(() => {
    if (trackMounts) {
      mountTimeRef.current = performance.now();
      performanceMonitor.trackComponentMount(componentName);
      bundleAnalyzer.trackComponentLoad(componentName);
    }

    return () => {
      if (trackMounts && mountTimeRef.current) {
        const mountDuration = performance.now() - mountTimeRef.current;
        performanceMonitor.trackCustomMetric(`${componentName}_mountDuration`, mountDuration);
      }
    };
  }, [componentName, trackMounts]);

  // Track component renders
  useEffect(() => {
    if (trackRenders) {
      renderCountRef.current += 1;
      performanceMonitor.trackReRender(componentName);
    }
  });

  const trackOperation = useCallback(<T>(operationName: string, operation: () => T): T => {
    const startTime = performance.now();
    const result = operation();
    const endTime = performance.now();
    
    performanceMonitor.trackCustomMetric(
      `${componentName}_${operationName}`, 
      endTime - startTime
    );
    
    return result;
  }, [componentName]);

  const logCustomMetric = useCallback((metricName: string, value: any) => {
    performanceMonitor.trackCustomMetric(`${componentName}_${metricName}`, value);
  }, [componentName]);

  const getRenderCount = useCallback(() => {
    return renderCountRef.current;
  }, []);

  return {
    trackOperation,
    logCustomMetric,
    getRenderCount,
    renderCount: renderCountRef.current
  };
};
