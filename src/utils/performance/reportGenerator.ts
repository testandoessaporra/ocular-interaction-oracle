
import { PerformanceMetrics, PerformanceReport } from './types';

export class ReportGenerator {
  static generateReport(
    metrics: PerformanceMetrics,
    averageFPS: number,
    currentFPS: number,
    trackingStatus: {
      isInitialized: boolean;
      isTracking: boolean;
      observersCount: number;
      frameCount: number;
    }
  ): PerformanceReport {
    return {
      timestamp: new Date().toISOString(),
      performance: {
        averageFPS,
        currentFPS,
        fpsHistory: metrics.fps.slice(-10),
        lcp: metrics.lcp,
        fid: metrics.fid,
        cls: metrics.cls,
        totalRenderTime: metrics.renderTime,
        reRenderCount: metrics.reRenderCount,
        trackingStatus
      },
      recommendations: this.generateRecommendations(metrics, averageFPS)
    };
  }

  private static generateRecommendations(metrics: PerformanceMetrics, avgFPS: number): string[] {
    const recommendations: string[] = [];

    if (avgFPS === 0) {
      recommendations.push('ERRO: FPS não está sendo medido. Verificar se o requestAnimationFrame está funcionando.');
    } else if (avgFPS < 30) {
      recommendations.push('CRÍTICO: FPS muito baixo. Revisar animações e re-renders.');
    } else if (avgFPS < 50) {
      recommendations.push('Atenção: FPS abaixo do ideal. Otimizar componentes pesados.');
    }

    if (metrics.lcp && metrics.lcp > 2500) {
      recommendations.push('LCP alto. Otimizar carregamento de imagens e recursos críticos.');
    }

    if (metrics.cls && metrics.cls > 0.1) {
      recommendations.push('CLS alto. Verificar layout shifts em componentes dinâmicos.');
    }

    if (metrics.reRenderCount > 100) {
      recommendations.push('Muitos re-renders. Implementar memoização e callbacks estáveis.');
    }

    return recommendations;
  }

  static exportAsJSON(report: PerformanceReport): string {
    return JSON.stringify(report, null, 2);
  }
}
