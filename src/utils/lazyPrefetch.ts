/**
 * Utilitário para prefetch inteligente de componentes lazy
 * Melhora a experiência carregando componentes antes do usuário precisar
 */

// Tipo genérico para módulos
type ModuleLoader<T = unknown> = () => Promise<T>;

// Cache de módulos já carregados
const moduleCache = new Map<string, Promise<unknown>>();

// Função para prefetch de módulo
export const prefetchModule = <T = unknown>(moduleLoader: ModuleLoader<T>, key: string) => {
  if (!moduleCache.has(key)) {
    const promise = moduleLoader().catch(err => {
      logger.error(`Failed to prefetch module ${key}:`, err);
      moduleCache.delete(key); // Remove do cache em caso de erro
      return null;
    });
    moduleCache.set(key, promise);
  }
  return moduleCache.get(key);
};

// Prefetch quando o navegador estiver idle
export const prefetchOnIdle = <T = unknown>(moduleLoader: ModuleLoader<T>, key: string) => {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      prefetchModule(moduleLoader, key);
    }, { timeout: 2000 });
  } else {
    // Fallback para navegadores sem suporte
    setTimeout(() => {
      prefetchModule(moduleLoader, key);
    }, 2000);
  }
};

// Prefetch quando o usuário hover sobre um link
export const prefetchOnHover = <T = unknown>(moduleLoader: ModuleLoader<T>, key: string) => {
  let timeoutId: NodeJS.Timeout;
  
  return {
    onMouseEnter: () => {
      timeoutId = setTimeout(() => {
        prefetchModule(moduleLoader, key);
      }, 200); // Aguarda 200ms para evitar prefetch acidental
    },
    onMouseLeave: () => {
      clearTimeout(timeoutId);
    }
  };
};

// Prefetch baseado em viewport (Intersection Observer)
export const prefetchOnViewport = <T = unknown>(
  element: HTMLElement | null,
  moduleLoader: ModuleLoader<T>,
  key: string,
  options?: IntersectionObserverInit
) => {
  if (!element || !('IntersectionObserver' in window)) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        prefetchModule(moduleLoader, key);
        observer.disconnect();
      }
    });
  }, {
    rootMargin: '50px', // Carrega 50px antes de entrar na viewport
    ...options
  });
  
  observer.observe(element);
  
  return () => observer.disconnect();
};

// Hook para usar com React
import { logger } from '@/utils/logger';
import { useEffect, useRef } from 'react';

export const usePrefetch = <T = unknown>(
  moduleLoader: ModuleLoader<T>,
  key: string,
  strategy: 'idle' | 'hover' | 'viewport' = 'idle'
) => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (strategy === 'idle') {
      prefetchOnIdle(moduleLoader, key);
    } else if (strategy === 'viewport' && elementRef.current) {
      return prefetchOnViewport(elementRef.current, moduleLoader, key);
    }
  }, [moduleLoader, key, strategy]);
  
  if (strategy === 'hover') {
    return prefetchOnHover(moduleLoader, key);
  }
  
  return { ref: elementRef };
};