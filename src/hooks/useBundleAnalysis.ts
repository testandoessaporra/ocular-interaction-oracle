
import { useEffect, useState } from 'react';
import { OPTIMIZATION_CONFIG } from '@/constants/optimizationConfig';
import { performanceLog } from '@/constants/optimizationConfig';

interface BundleAnalysis {
  estimatedSize: number;
  componentCount: number;
  loadedChunks: string[];
  criticalResources: string[];
  recommendations: string[];
}

export const useBundleAnalysis = () => {
  const [analysis, setAnalysis] = useState<BundleAnalysis>({
    estimatedSize: 0,
    componentCount: 0,
    loadedChunks: [],
    criticalResources: [],
    recommendations: []
  });

  useEffect(() => {
    if (!OPTIMIZATION_CONFIG.ENABLE_BUNDLE_ANALYSIS) return;

    const analyzeBundle = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      // Estimar tamanho do bundle
      const estimatedSize = resources
        .filter((resource) => 
          resource.name.includes('.js') || resource.name.includes('.css')
        )
        .reduce((total: number, resource) => 
          total + (resource.transferSize || 0), 0
        );

      // Contar componentes carregados
      const componentCount = resources
        .filter((resource) => resource.name.includes('components')).length;

      // Identificar chunks carregados
      const loadedChunks = resources
        .filter((resource) => resource.name.includes('chunk'))
        .map((resource) => resource.name.split('/').pop() || '');

      // Recursos críticos (acima de 50kb)
      const criticalResources = resources
        .filter((resource) => (resource.transferSize || 0) > 50000)
        .map((resource) => ({
          name: resource.name.split('/').pop() || '',
          size: resource.transferSize || 0
        }));

      // Gerar recomendações
      const recommendations: string[] = [];
      
      if (estimatedSize > 500000) { // 500kb
        recommendations.push('Bundle muito grande. Considere code-splitting.');
      }
      
      if (criticalResources.length > 3) {
        recommendations.push('Muitos recursos grandes. Revisar dependências.');
      }

      if (loadedChunks.length > 10) {
        recommendations.push('Muitos chunks. Consolidar imports relacionados.');
      }

      setAnalysis({
        estimatedSize,
        componentCount,
        loadedChunks,
        criticalResources: criticalResources.map(r => r.name),
        recommendations
      });

      performanceLog('Bundle Analysis', {
        estimatedSize: `${(estimatedSize / 1024).toFixed(2)}KB`,
        componentCount,
        chunksCount: loadedChunks.length,
        criticalResourcesCount: criticalResources.length,
        recommendations: recommendations.length
      });
    };

    // Analisar após o carregamento inicial
    const timer = setTimeout(analyzeBundle, 2000);

    return () => clearTimeout(timer);
  }, []);

  return analysis;
};
