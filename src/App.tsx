import { logger } from '@/utils/logger';
import React, { useEffect } from 'react';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserProvider } from "@/contexts/UserContext";
import PWAInstallButton from "@/components/PWAInstallButton";
import ErrorBoundary from "@/components/ErrorBoundary";
import AppContent from "@/components/layout/AppContent";
import PerformanceDiagnostic from "@/components/PerformanceDiagnostic";
import { performanceMonitor } from '@/utils/performanceMonitor';
import { bundleAnalyzer } from '@/utils/bundleAnalyzer';
import { useBundleAnalysis } from '@/hooks/useBundleAnalysis';
import { OPTIMIZATION_CONFIG } from '@/constants/optimizationConfig';

const queryClient = new QueryClient();

const AppInner = () => {
  // Analisar bundle automaticamente
  const bundleAnalysis = useBundleAnalysis();

  // Inicializar sistemas de métricas
  useEffect(() => {
    if (OPTIMIZATION_CONFIG.ENABLE_PERFORMANCE_LOGS) {
      performanceMonitor.init();
      bundleAnalyzer.trackComponentLoad('App');
      
      // Cleanup on unmount
      return () => {
        performanceMonitor.cleanup();
      };
    }
  }, []);

  // Log da análise do bundle
  useEffect(() => {
    if (bundleAnalysis.estimatedSize > 0) {
      logger.info('📦 Bundle Analysis Results:', { 
        data: {
          estimatedSize: bundleAnalysis.estimatedSize,
          componentCount: bundleAnalysis.componentCount,
          loadedChunks: bundleAnalysis.loadedChunks.length,
          recommendations: bundleAnalysis.recommendations.length
        }
      });
    }
  }, [bundleAnalysis]);

  return (
    <UserProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
            <PWAInstallButton />
            <PerformanceDiagnostic />
          </SidebarProvider>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInner />
    </QueryClientProvider>
  );
};

export default App;
