
import React from 'react';
import { useSidebar } from "@/components/ui/sidebar";
import { usePerformanceTracker } from '@/hooks/usePerformanceTracker';
import { bundleAnalyzer } from '@/utils/bundleAnalyzer';
import { AppSidebar } from "@/components/AppSidebar";
import MobileSidebarTrigger from "@/components/MobileSidebarTrigger";
import SidebarToggleButton from "@/components/SidebarToggleButton";
import MainContent from "@/components/layout/MainContent";
import GlobalTimer from "@/components/GlobalTimer";
import { useGlobalTimer } from "@/hooks/useGlobalTimer";

const AppContent = () => {
  const { state, isMobile } = useSidebar();
  const { timerState, startGlobalTimer, closeGlobalTimer } = useGlobalTimer();

  // Track performance do layout principal
  const { trackOperation, logCustomMetric } = usePerformanceTracker({
    componentName: 'AppContent',
    trackRenders: true,
    trackMounts: true
  });

  // Track componente e suas dependências
  React.useEffect(() => {
    bundleAnalyzer.trackComponentLoad('AppContent', [
      'AppSidebar', 
      'MainContent', 
      'GlobalTimer',
      'useSidebar',
      'useGlobalTimer'
    ]);
  }, []);

  // Disponibilizar funções globalmente
  React.useEffect(() => {
    trackOperation('setupGlobalFunctions', () => {
      (window as any).startGlobalTimer = startGlobalTimer;
      (window as any).closeGlobalTimer = closeGlobalTimer;
      
      logCustomMetric('globalFunctionsSetup', { 
        timerActive: timerState.isActive,
        sidebarState: state 
      });
    });
    
    return () => {
      delete (window as any).startGlobalTimer;
      delete (window as any).closeGlobalTimer;
    };
  }, [startGlobalTimer, closeGlobalTimer, trackOperation, logCustomMetric, timerState.isActive, state]);
  
  return (
    <div className={`
      min-h-screen flex w-full tactical-bg
      ${!isMobile && state === 'expanded' ? 'sidebar-expanded' : ''}
    `}>
      <AppSidebar />
      <MobileSidebarTrigger />
      <SidebarToggleButton />
      <MainContent />
      
      {/* Timer Global Centralizado */}
      <GlobalTimer
        isActive={timerState.isActive}
        timerProps={timerState.props}
        onClose={closeGlobalTimer}
      />
    </div>
  );
};

export default React.memo(AppContent);
