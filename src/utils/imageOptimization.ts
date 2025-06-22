
import React, { useEffect, useState } from 'react';
import { performanceLog } from '@/constants/optimizationConfig';

// Configurações de otimização de imagem
export const IMAGE_CONFIG = {
  // Formatos suportados em ordem de preferência
  PREFERRED_FORMATS: ['webp', 'png', 'jpg', 'jpeg'] as const,
  
  // Qualidade por tipo de imagem
  QUALITY: {
    webp: 85,
    jpeg: 80,
    png: 95
  },
  
  // Tamanhos responsivos
  RESPONSIVE_SIZES: {
    thumbnail: 150,
    small: 300,
    medium: 600,
    large: 1200,
    xlarge: 1920
  },
  
  // Lazy loading thresholds
  LAZY_LOADING: {
    rootMargin: '50px',
    threshold: 0.1
  }
} as const;

// Verificar suporte a WebP
export const supportsWebP = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const webP = new Image();
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2);
    };
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// Gerar srcset para imagem responsiva
export const generateSrcSet = (baseUrl: string, sizes: number[]): string => {
  return sizes
    .map(size => `${baseUrl}?w=${size} ${size}w`)
    .join(', ');
};

// Detectar melhor formato de imagem
export const getBestImageFormat = async (originalUrl: string): Promise<string> => {
  const webpSupported = await supportsWebP();
  
  if (webpSupported && !originalUrl.includes('.svg')) {
    return originalUrl.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  }
  
  return originalUrl;
};

// Preload de imagens críticas
export const preloadCriticalImages = (imageUrls: string[]): void => {
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
  
  performanceLog('Preloaded critical images', { count: imageUrls.length });
};

// Lazy loading observer
export const createLazyLoadObserver = (): IntersectionObserver => {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.remove('lazy');
            img.classList.add('loaded');
          }
        }
      });
    },
    {
      rootMargin: IMAGE_CONFIG.LAZY_LOADING.rootMargin,
      threshold: IMAGE_CONFIG.LAZY_LOADING.threshold
    }
  );
};

// Otimizar imagem para diferentes densidades de pixel
export const generateResponsiveImageProps = (
  src: string,
  alt: string,
  sizes?: string
) => {
  const baseName = src.replace(/\.[^/.]+$/, '');
  const extension = src.split('.').pop();
  
  // Gerar diferentes tamanhos
  const srcSet = Object.values(IMAGE_CONFIG.RESPONSIVE_SIZES)
    .map(size => `${baseName}-${size}w.${extension} ${size}w`)
    .join(', ');
  
  return {
    src,
    srcSet,
    sizes: sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    alt,
    loading: 'lazy' as const,
    decoding: 'async' as const
  };
};

// Comprimir imagem no lado cliente (para uploads)
export const compressImage = (
  file: File,
  maxWidth: number = 1200,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calcular novas dimensões mantendo proporção
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      // Desenhar imagem redimensionada
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Converter para blob
      canvas.toBlob(
        (blob) => resolve(blob!),
        'image/webp',
        quality
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Cache de imagens otimizadas
class ImageCache {
  private cache = new Map<string, string>();
  private maxSize = 50;
  
  set(key: string, value: string): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
  
  get(key: string): string | undefined {
    return this.cache.get(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
}

export const imageCache = new ImageCache();

// Hook para imagens otimizadas
export const useOptimizedImage = (src: string) => {
  const [optimizedSrc, setOptimizedSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let mounted = true;
    
    const loadOptimizedImage = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Verificar cache primeiro
        const cached = imageCache.get(src);
        if (cached) {
          if (mounted) {
            setOptimizedSrc(cached);
            setIsLoading(false);
          }
          return;
        }
        
        // Obter melhor formato
        const optimized = await getBestImageFormat(src);
        
        if (mounted) {
          setOptimizedSrc(optimized);
          imageCache.set(src, optimized);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setOptimizedSrc(src); // Fallback para src original
          setIsLoading(false);
        }
      }
    };
    
    loadOptimizedImage();
    
    return () => {
      mounted = false;
    };
  }, [src]);
  
  return { src: optimizedSrc, isLoading, error };
};

// Preload estratégico de imagens
export const strategicImagePreload = {
  // Preload imagens above-the-fold
  preloadAboveFold: (imageUrls: string[]) => {
    preloadCriticalImages(imageUrls);
  },
  
  // Preload no hover para imagens de navegação
  preloadOnHover: (element: HTMLElement, imageUrl: string) => {
    const preload = () => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imageUrl;
      document.head.appendChild(link);
    };
    
    element.addEventListener('mouseenter', preload, { once: true });
    element.addEventListener('touchstart', preload, { once: true });
  },
  
  // Preload baseado em viewport
  preloadNearViewport: (imageUrls: string[], margin: string = '200px') => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const url = entry.target.getAttribute('data-preload-src');
            if (url) {
              const link = document.createElement('link');
              link.rel = 'preload';
              link.as = 'image';
              link.href = url;
              document.head.appendChild(link);
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { rootMargin: margin }
    );
    
    // Criar elementos invisíveis para observar
    imageUrls.forEach(url => {
      const div = document.createElement('div');
      div.setAttribute('data-preload-src', url);
      div.style.position = 'absolute';
      div.style.top = '0';
      div.style.left = '0';
      div.style.width = '1px';
      div.style.height = '1px';
      div.style.opacity = '0';
      document.body.appendChild(div);
      observer.observe(div);
    });
  }
};

