
import React from 'react';
import { useSidebar } from "@/components/ui/sidebar";
import { usePerformanceTracker } from '@/hooks/usePerformanceTracker';
import { bundleAnalyzer } from '@/utils/bundleAnalyzer';
import AppRoutes from "@/components/layout/AppRoutes";

const MainContent = () => {
  const { state, isMobile } = useSidebar();
  
  // Track performance deste componente
  const { trackOperation } = usePerformanceTracker({
    componentName: 'MainContent',
    trackRenders: true
  });

  // Track carregamento do componente
  React.useEffect(() => {
    bundleAnalyzer.trackComponentLoad('MainContent', ['useSidebar', 'AppRoutes']);
  }, []);
  
  return (
    <main 
      className={`
        flex-1 transition-all duration-300 ease-in-out
        ${!isMobile && state === 'expanded' 
          ? 'ml-4' 
          : ''
        }
      `}
      style={{
        transform: !isMobile && state === 'expanded' 
          ? 'translateX(0)' 
          : 'translateX(0)',
        willChange: 'transform'
      }}
    >
      <AppRoutes />
    </main>
  );
};

export default React.memo(MainContent);
