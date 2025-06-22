
import { logger } from '@/utils/logger';
import { performanceLog, debugLog } from '@/constants/optimizationConfig';

// Tipos para análise de assets
interface AssetInfo {
  url: string;
  type: 'image' | 'css' | 'js' | 'font' | 'other';
  size: number;
  loadTime: number;
  cached: boolean;
  optimized: boolean;
}

interface AssetAnalysisReport {
  totalAssets: number;
  totalSize: number;
  totalLoadTime: number;
  cachedAssets: number;
  optimizedAssets: number;
  recommendations: string[];
  breakdown: {
    images: AssetInfo[];
    scripts: AssetInfo[];
    styles: AssetInfo[];
    fonts: AssetInfo[];
    other: AssetInfo[];
  };
}

class AssetAnalyzer {
  private assets: AssetInfo[] = [];
  private observer: PerformanceObserver | null = null;
  
  constructor() {
    this.setupPerformanceObserver();
  }
  
  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            this.trackAsset(entry as PerformanceResourceTiming);
          }
        }
      });
      
      this.observer.observe({ entryTypes: ['resource'] });
    }
  }
  
  private trackAsset(entry: PerformanceResourceTiming): void {
    const asset: AssetInfo = {
      url: entry.name,
      type: this.getAssetType(entry.name),
      size: entry.transferSize || 0,
      loadTime: entry.responseEnd - entry.startTime,
      cached: entry.transferSize === 0,
      optimized: this.isOptimized(entry.name)
    };
    
    this.assets.push(asset);
    debugLog('Asset tracked', asset);
  }
  
  private getAssetType(url: string): AssetInfo['type'] {
    const pathname = new URL(url, window.location.origin).pathname.toLowerCase();
    
    if (pathname.match(/\.(png|jpg|jpeg|webp|svg|gif|ico)$/)) return 'image';
    if (pathname.match(/\.(css)$/)) return 'css';
    if (pathname.match(/\.(js|mjs)$/)) return 'js';
    if (pathname.match(/\.(woff|woff2|ttf|otf|eot)$/)) return 'font';
    
    return 'other';
  }
  
  private isOptimized(url: string): boolean {
    const pathname = new URL(url, window.location.origin).pathname.toLowerCase();
    
    // Verificar se imagem está em formato otimizado
    if (pathname.match(/\.(webp)$/)) return true;
    if (pathname.match(/\.(css|js)$/) && pathname.includes('.min.')) return true;
    if (pathname.match(/\.(woff2)$/)) return true;
    
    return false;
  }
  
  public generateReport(): AssetAnalysisReport {
    const breakdown = {
      images: this.assets.filter(a => a.type === 'image'),
      scripts: this.assets.filter(a => a.type === 'js'),
      styles: this.assets.filter(a => a.type === 'css'),
      fonts: this.assets.filter(a => a.type === 'font'),
      other: this.assets.filter(a => a.type === 'other')
    };
    
    const totalSize = this.assets.reduce((sum, asset) => sum + asset.size, 0);
    const totalLoadTime = this.assets.reduce((sum, asset) => sum + asset.loadTime, 0);
    const cachedAssets = this.assets.filter(a => a.cached).length;
    const optimizedAssets = this.assets.filter(a => a.optimized).length;
    
    const recommendations = this.generateRecommendations(breakdown);
    
    return {
      totalAssets: this.assets.length,
      totalSize,
      totalLoadTime,
      cachedAssets,
      optimizedAssets,
      recommendations,
      breakdown
    };
  }
  
  private generateRecommendations(breakdown: AssetAnalysisReport['breakdown']): string[] {
    const recommendations: string[] = [];
    
    // Analisar imagens
    const unoptimizedImages = breakdown.images.filter(img => !img.optimized);
    if (unoptimizedImages.length > 0) {
      recommendations.push(
        `📸 Converter ${unoptimizedImages.length} imagens para WebP para reduzir tamanho`
      );
    }
    
    const largeImages = breakdown.images.filter(img => img.size > 500000); // 500KB
    if (largeImages.length > 0) {
      recommendations.push(
        `🖼️ Comprimir ${largeImages.length} imagens grandes (>500KB)`
      );
    }
    
    // Analisar scripts
    const unminifiedScripts = breakdown.scripts.filter(script => !script.optimized);
    if (unminifiedScripts.length > 0) {
      recommendations.push(
        `📦 Minificar ${unminifiedScripts.length} arquivos JavaScript`
      );
    }
    
    // Analisar CSS
    const unminifiedStyles = breakdown.styles.filter(style => !style.optimized);
    if (unminifiedStyles.length > 0) {
      recommendations.push(
        `🎨 Minificar ${unminifiedStyles.length} arquivos CSS`
      );
    }
    
    // Analisar fontes
    const unoptimizedFonts = breakdown.fonts.filter(font => !font.url.includes('woff2'));
    if (unoptimizedFonts.length > 0) {
      recommendations.push(
        `🔤 Converter ${unoptimizedFonts.length} fontes para WOFF2`
      );
    }
    
    // Analisar cache
    const uncachedAssets = this.assets.filter(a => !a.cached);
    if (uncachedAssets.length > this.assets.length * 0.3) {
      recommendations.push(
        `💾 Melhorar estratégia de cache - ${uncachedAssets.length} assets não cacheados`
      );
    }
    
    // Analisar bundle size
    const totalBundleSize = breakdown.scripts.reduce((sum, script) => sum + script.size, 0);
    if (totalBundleSize > 1000000) { // 1MB
      recommendations.push(
        `📦 Bundle JS muito grande (${(totalBundleSize / 1024 / 1024).toFixed(2)}MB) - considerar code splitting`
      );
    }
    
    return recommendations;
  }
  
  public getTopLargestAssets(count: number = 10): AssetInfo[] {
    return [...this.assets]
      .sort((a, b) => b.size - a.size)
      .slice(0, count);
  }
  
  public getSlowestAssets(count: number = 10): AssetInfo[] {
    return [...this.assets]
      .sort((a, b) => b.loadTime - a.loadTime)
      .slice(0, count);
  }
  
  public printReport(): void {
    const report = this.generateReport();
    
    console.group('📊 Asset Analysis Report');
    logger.info(`Total Assets: ${report.totalAssets}`);
    logger.info(`Total Size: ${(report.totalSize / 1024 / 1024).toFixed(2)}MB`);
    logger.info(`Total Load Time: ${report.totalLoadTime.toFixed(2)}ms`);
    logger.info(`Cached Assets: ${report.cachedAssets}/${report.totalAssets} (${(report.cachedAssets/report.totalAssets*100).toFixed(1)}%)`);
    logger.info(`Optimized Assets: ${report.optimizedAssets}/${report.totalAssets} (${(report.optimizedAssets/report.totalAssets*100).toFixed(1)}%)`);
    
    console.group('📋 Breakdown by Type');
    Object.entries(report.breakdown).forEach(([type, assets]) => {
      const totalSize = assets.reduce((sum, asset) => sum + asset.size, 0);
      logger.info(`${type}: ${assets.length} assets, ${(totalSize / 1024).toFixed(2)}KB`);
    });
    console.groupEnd();
    
    if (report.recommendations.length > 0) {
      console.group('💡 Recommendations');
      report.recommendations.forEach(rec => logger.info(rec));
      console.groupEnd();
    }
    
    console.group('🐌 Slowest Assets (Top 5)');
    this.getSlowestAssets(5).forEach(asset => {
      logger.info(`${asset.url}: ${asset.loadTime.toFixed(2)}ms`);
    });
    console.groupEnd();
    
    console.group('📦 Largest Assets (Top 5)');
    this.getTopLargestAssets(5).forEach(asset => {
      logger.info(`${asset.url}: ${(asset.size / 1024).toFixed(2)}KB`);
    });
    console.groupEnd();
    
    console.groupEnd();
    
    performanceLog('Asset analysis completed', {
      totalAssets: report.totalAssets,
      totalSizeMB: +(report.totalSize / 1024 / 1024).toFixed(2),
      recommendations: report.recommendations.length
    });
  }
  
  public reset(): void {
    this.assets = [];
  }
  
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.reset();
  }
}

// Instância global do analisador
export const assetAnalyzer = new AssetAnalyzer();

// Utilitários para desenvolvimento
export const assetDevTools = {
  // Analisar assets da página atual
  analyze: () => assetAnalyzer.printReport(),
  
  // Resetar análise
  reset: () => assetAnalyzer.reset(),
  
  // Analisar performance de imagens específicas
  analyzeImages: () => {
    const report = assetAnalyzer.generateReport();
    console.group('🖼️ Image Analysis');
    
    report.breakdown.images.forEach(img => {
      const sizeKB = +(img.size / 1024).toFixed(2);
      const status = img.optimized ? '✅' : '❌';
      logger.info(`${status} ${img.url.split('/').pop()}: ${sizeKB}KB, ${img.loadTime.toFixed(2)}ms`);
    });
    
    console.groupEnd();
  },
  
  // Verificar status do Service Worker
  checkServiceWorker: async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      const caches = await window.caches.keys();
      
      console.group('🔧 Service Worker Status');
      logger.info('Registration:', registration);
      logger.info('Available Caches:', caches);
      logger.info('Active Worker:', registration.active?.state);
      console.groupEnd();
    } else {
      logger.info('❌ Service Worker not supported');
    }
  },
  
  // Simular conexão lenta
  simulateSlowConnection: () => {
    logger.info('🐌 Simulating slow connection - check Network tab for throttling options');
    logger.info('Use DevTools > Network > Throttling to test performance');
  }
};

// Disponibilizar globalmente em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  (window as any).assetDevTools = assetDevTools;
  (window as any).assetAnalyzer = assetAnalyzer;
}

export default AssetAnalyzer;

