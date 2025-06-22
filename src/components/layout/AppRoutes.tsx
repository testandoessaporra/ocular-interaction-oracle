
import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { usePerformanceTracker } from '@/hooks/usePerformanceTracker';
import { bundleAnalyzer } from '@/utils/bundleAnalyzer';
import ErrorBoundary from "@/components/ErrorBoundary";
import PageLoader from "@/components/layout/PageLoader";
import { AnimatedPage } from "@/components/layout/PageTransitions";

// Lazy loading das páginas
const Index = lazy(() => {
  bundleAnalyzer.trackChunkLoad('Index', ['Index']);
  return import("@/pages/Index");
});
const Dashboard = lazy(() => {
  bundleAnalyzer.trackChunkLoad('Dashboard', ['Dashboard']);
  return import("@/pages/Dashboard");
});
const DataPage = lazy(() => {
  bundleAnalyzer.trackChunkLoad('DataPage', ['DataPage']);
  return import("@/pages/DataPage");
});
const Objetivo = lazy(() => {
  bundleAnalyzer.trackChunkLoad('Objetivo', ['Objetivo']);
  return import("@/pages/Objetivo");
});
const NotFound = lazy(() => {
  bundleAnalyzer.trackChunkLoad('NotFound', ['NotFound']);
  return import("@/pages/NotFound");
});

const AppRoutes = () => {
  const location = useLocation();

  // Track performance do roteamento
  const { logCustomMetric } = usePerformanceTracker({
    componentName: 'AppRoutes',
    trackRenders: true
  });

  // Track mudanças de rota
  React.useEffect(() => {
    logCustomMetric('routeChange', { 
      pathname: location.pathname,
      timestamp: Date.now()
    });
  }, [location.pathname, logCustomMetric]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <AnimatedPage><Index /></AnimatedPage>
              </Suspense>
            </ErrorBoundary>
          } 
        />
        <Route 
          path="/dados" 
          element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <AnimatedPage><DataPage /></AnimatedPage>
              </Suspense>
            </ErrorBoundary>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <AnimatedPage><Dashboard /></AnimatedPage>
              </Suspense>
            </ErrorBoundary>
          } 
        />
        <Route 
          path="/objetivo" 
          element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <AnimatedPage><Objetivo /></AnimatedPage>
              </Suspense>
            </ErrorBoundary>
          } 
        />
        <Route 
          path="*" 
          element={
            <ErrorBoundary>
              <Suspense fallback={<PageLoader />}>
                <AnimatedPage><NotFound /></AnimatedPage>
              </Suspense>
            </ErrorBoundary>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
};

export default React.memo(AppRoutes);
