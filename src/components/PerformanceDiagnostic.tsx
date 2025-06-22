import { logger } from '@/utils/logger';
import React, { useState, useEffect } from 'react';
import { performanceMonitor } from '@/utils/performanceMonitor';
import { OPTIMIZATION_CONFIG, debugControl } from '@/constants/optimizationConfig';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, XCircle, Activity } from '@/components/icons';
;

const PerformanceDiagnostic = () => {
  const [metrics, setMetrics] = useState({
    currentFPS: 0,
    averageFPS: 0,
    renderCount: 0,
    memoryUsed: 0,
    animationsEnabled: OPTIMIZATION_CONFIG.ANIMATIONS.ENABLE_FRAMER_MOTION
  });
  
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentFPS = performanceMonitor.getCurrentFPS();
      const averageFPS = performanceMonitor.getAverageFPS();
      const performanceMetrics = performanceMonitor.getMetrics();
      
      setMetrics(prev => ({
        ...prev,
        currentFPS,
        averageFPS,
        renderCount: performanceMetrics.reRenderCount,
        memoryUsed: (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0
      }));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getFPSStatus = (fps: number) => {
    if (fps >= 50) return { icon: CheckCircle, color: 'text-green-500', status: 'Excelente' };
    if (fps >= 30) return { icon: AlertCircle, color: 'text-yellow-500', status: 'Aceitável' };
    return { icon: XCircle, color: 'text-red-500', status: 'Crítico' };
  };

  const fpsStatus = getFPSStatus(metrics.currentFPS);

  const toggleAnimations = () => {
    OPTIMIZATION_CONFIG.ANIMATIONS.ENABLE_FRAMER_MOTION = !OPTIMIZATION_CONFIG.ANIMATIONS.ENABLE_FRAMER_MOTION;
    setMetrics(prev => ({ ...prev, animationsEnabled: OPTIMIZATION_CONFIG.ANIMATIONS.ENABLE_FRAMER_MOTION }));
    window.location.reload(); // Recarregar para aplicar mudanças
  };

  if (!OPTIMIZATION_CONFIG.ENABLE_DEV_TOOLS) return null;

  return (
    <>
      {/* Botão flutuante */}
      <Button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 rounded-full w-12 h-12 p-0"
        variant="outline"
      >
        <Activity className="w-6 h-6" />
      </Button>

      {/* Painel de diagnóstico */}
      {isVisible && (
        <Card className="fixed bottom-20 right-4 z-40 w-80 p-4 bg-background/95 backdrop-blur">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Diagnóstico de Performance
          </h3>
          
          <div className="space-y-3">
            {/* FPS */}
            <div className="flex items-center justify-between">
              <span className="text-sm">FPS Atual:</span>
              <div className="flex items-center gap-2">
                <fpsStatus.icon className={`w-4 h-4 ${fpsStatus.color}`} />
                <span className={`font-mono ${fpsStatus.color}`}>
                  {metrics.currentFPS} ({fpsStatus.status})
                </span>
              </div>
            </div>
            
            {/* FPS Médio */}
            <div className="flex items-center justify-between">
              <span className="text-sm">FPS Médio:</span>
              <span className="font-mono">{metrics.averageFPS}</span>
            </div>
            
            {/* Re-renders */}
            <div className="flex items-center justify-between">
              <span className="text-sm">Re-renders:</span>
              <span className="font-mono">{metrics.renderCount}</span>
            </div>
            
            {/* Memória */}
            <div className="flex items-center justify-between">
              <span className="text-sm">Memória:</span>
              <span className="font-mono">{metrics.memoryUsed.toFixed(1)} MB</span>
            </div>
            
            {/* Controles */}
            <div className="pt-3 border-t space-y-2">
              <Button
                onClick={toggleAnimations}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Animações: {metrics.animationsEnabled ? 'ON' : 'OFF'}
              </Button>
              
              <Button
                onClick={() => debugControl.enableFPSLogs(true)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Ativar Logs FPS
              </Button>
              
              <Button
                onClick={() => window.open('/debug-fps.html', '_blank')}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Abrir Debug FPS
              </Button>
              
              <Button
                onClick={() => logger.info(performanceMonitor.exportReport())}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Exportar Relatório
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default PerformanceDiagnostic;