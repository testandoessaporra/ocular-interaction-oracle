
import { OPTIMIZATION_CONFIG } from '@/constants/optimizationConfig';
import { logger } from '@/utils/logger';

// Detecção robusta de ambiente de desenvolvimento
const isDevelopment = () => {
  return (
    process.env.NODE_ENV === 'development' ||
    import.meta.env?.DEV === true ||
    import.meta.env?.MODE === 'development' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname.includes('lovableproject.com')
  );
};

interface BundleInfo {
  componentName: string;
  loadTime: number;
  size?: number;
  dependencies?: string[];
}

interface ChunkInfo {
  chunkName: string;
  loadTime: number;
  components: string[];
}

class BundleAnalyzer {
  private componentLoads: BundleInfo[] = [];
  private chunkLoads: ChunkInfo[] = [];
  private isEnabled = OPTIMIZATION_CONFIG.ENABLE_BUNDLE_ANALYSIS;

  trackComponentLoad(componentName: string, dependencies?: string[]) {
    if (!this.isEnabled) return;

    const loadTime = performance.now();
    const info: BundleInfo = {
      componentName,
      loadTime,
      dependencies
    };

    this.componentLoads.push(info);
    
    logger.info(`📦 Component carregado: ${componentName}`, {
      data: {
        loadTime: `${loadTime.toFixed(2)}ms`,
        dependencies: dependencies?.length || 0
      }
    });
  }

  trackChunkLoad(chunkName: string, components: string[] = []) {
    if (!this.isEnabled) return;

    const loadTime = performance.now();
    const info: ChunkInfo = {
      chunkName,
      loadTime,
      components
    };

    this.chunkLoads.push(info);
    
    logger.info(`📦 Chunk carregado: ${chunkName}`, {
      data: {
        loadTime: `${loadTime.toFixed(2)}ms`,
        components: components.length
      }
    });
  }

  analyzeLoadTimes() {
    if (!this.isEnabled || this.componentLoads.length === 0) {
      logger.warn('Análise de bundle não disponível ou sem dados');
      return null;
    }

    const totalComponents = this.componentLoads.length;
    const avgLoadTime = this.componentLoads.reduce((sum, comp) => sum + comp.loadTime, 0) / totalComponents;
    const slowestComponent = this.componentLoads.reduce((prev, curr) => 
      prev.loadTime > curr.loadTime ? prev : curr
    );
    const fastestComponent = this.componentLoads.reduce((prev, curr) => 
      prev.loadTime < curr.loadTime ? prev : curr
    );

    const analysis = {
      totalComponents,
      averageLoadTime: `${avgLoadTime.toFixed(2)}ms`,
      slowest: {
        name: slowestComponent.componentName,
        time: `${slowestComponent.loadTime.toFixed(2)}ms`
      },
      fastest: {
        name: fastestComponent.componentName,
        time: `${fastestComponent.loadTime.toFixed(2)}ms`
      }
    };

    logger.info('📊 Análise de Bundle - Componentes', { data: analysis });

    if (this.chunkLoads.length > 0) {
      const totalChunks = this.chunkLoads.length;
      const avgChunkLoadTime = this.chunkLoads.reduce((sum, chunk) => sum + chunk.loadTime, 0) / totalChunks;

      const chunkAnalysis = {
        totalChunks,
        averageLoadTime: `${avgChunkLoadTime.toFixed(2)}ms`,
        chunks: this.chunkLoads.map(chunk => ({
          name: chunk.chunkName,
          time: `${chunk.loadTime.toFixed(2)}ms`,
          components: chunk.components.length
        }))
      };

      logger.info('📊 Análise de Bundle - Chunks', { data: chunkAnalysis });
    }

    return analysis;
  }

  getComponentDependencies() {
    if (!this.isEnabled) return [];

    return this.componentLoads
      .filter(comp => comp.dependencies && comp.dependencies.length > 0)
      .map(comp => ({
        component: comp.componentName,
        dependencies: comp.dependencies,
        loadTime: comp.loadTime
      }));
  }

  clearAnalysis() {
    this.componentLoads = [];
    this.chunkLoads = [];
    logger.info('🗑️ Análise de bundle limpa');
  }

  exportAnalysis() {
    if (!this.isEnabled) {
      logger.warn('⚠️ Bundle analysis desabilitado. Ative ENABLE_BUNDLE_ANALYSIS para usar esta função.');
      return null;
    }

    return {
      components: this.componentLoads,
      chunks: this.chunkLoads,
      analysis: {
        totalComponents: this.componentLoads.length,
        totalChunks: this.chunkLoads.length,
        timestamp: new Date().toISOString()
      }
    };
  }
}

export const bundleAnalyzer = new BundleAnalyzer();

// Sistema robusto de exposição de funções globais
const exposeBundleGlobalFunctions = () => {
  if (typeof window === 'undefined') return;

  logger.info('📦 Iniciando exposição de funções globais de bundle...');

  const globalBundleFunctions = {
    analyzeBundleLoadTimes: () => {
      logger.info('📊 Analisando tempos de carregamento do bundle...');
      const result = bundleAnalyzer.analyzeLoadTimes();
      if (result) {
        logger.info('✅ Análise concluída:', result);
      } else {
        logger.warn('⚠️ Nenhum dado disponível para análise');
      }
      return result;
    },
    
    clearBundleAnalysis: () => {
      logger.info('🧹 Limpando análise de bundle...');
      bundleAnalyzer.clearAnalysis();
      logger.info('✅ Análise de bundle limpa');
      return 'Análise limpa com sucesso';
    },
    
    exportBundleAnalysis: () => {
      logger.info('📋 Exportando análise de bundle...');
      const result = bundleAnalyzer.exportAnalysis();
      if (result) {
        logger.info('✅ Análise exportada:', result);
      } else {
        logger.warn('⚠️ Bundle analysis desabilitado ou sem dados');
      }
      return result;
    },
    
    getComponentDependencies: () => {
      logger.info('🔗 Obtendo dependências de componentes...');
      const result = bundleAnalyzer.getComponentDependencies();
      logger.info('✅ Dependências obtidas:', result);
      return result;
    }
  };
  
  // Atribuir funções ao window
  Object.assign(window, globalBundleFunctions);
  
  logger.info('✅ Funções globais de bundle expostas:', Object.keys(globalBundleFunctions));
  
  // Verificação imediata
  setTimeout(() => {
    const verification = Object.keys(globalBundleFunctions).map(name => ({
      function: name,
      available: typeof window[name as keyof Window] === 'function'
    }));
    
    console.table(verification);
    
    if (verification.every(v => v.available)) {
      logger.info('🎉 SUCESSO: Todas as funções de bundle estão disponíveis!');
    } else {
      logger.error('❌ ERRO: Algumas funções não foram expostas corretamente');
    }
  }, 100);
};

// Exposição imediata em desenvolvimento
if (isDevelopment()) {
  logger.info('🚀 Ambiente de desenvolvimento detectado para bundle analyzer');
  exposeBundleGlobalFunctions();
} else {
  logger.info('📦 Ambiente de produção - funções de bundle não expostas');
}
