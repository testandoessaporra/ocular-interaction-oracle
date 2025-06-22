
import { logger } from '@/utils/logger';
import { useEffect, useRef, useCallback } from 'react';

interface StreakEffectsOptions {
  value: number;
  type: 'login' | 'cycle';
  elementId?: string;
}

export const useStreakEffects = ({ value, type, elementId }: StreakEffectsOptions) => {
  const previousValue = useRef<number>(value);
  const elementRef = useRef<HTMLElement | null>(null);

  const triggerGlowEffect = useCallback((element: HTMLElement) => {
    // Remover classes existentes
    element.classList.remove('streak-glow-active', 'streak-pulse-active');
    
    // Forçar reflow
    element.offsetHeight;
    
    // Adicionar efeito de brilho
    element.classList.add('streak-glow-active');
    
    // Remover após animação
    setTimeout(() => {
      element.classList.remove('streak-glow-active');
    }, 1500);
  }, []);

  const triggerPulseEffect = useCallback((element: HTMLElement) => {
    // Remover classes existentes
    element.classList.remove('streak-pulse-active');
    
    // Forçar reflow
    element.offsetHeight;
    
    // Adicionar efeito de pulso
    element.classList.add('streak-pulse-active');
    
    // Remover após animação
    setTimeout(() => {
      element.classList.remove('streak-pulse-active');
    }, 1000);
  }, []);

  const createSparkleEffect = useCallback((element: HTMLElement) => {
    const sparkles = 8;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < sparkles; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'fixed z-50 pointer-events-none w-1 h-1 bg-yellow-400 rounded-full';
      sparkle.style.left = `${centerX}px`;
      sparkle.style.top = `${centerY}px`;
      
      const angle = (i / sparkles) * 2 * Math.PI;
      const distance = 30 + Math.random() * 20;
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;
      
      sparkle.style.animation = `sparkleOut 0.8s ease-out forwards`;
      sparkle.style.setProperty('--end-x', `${endX}px`);
      sparkle.style.setProperty('--end-y', `${endY}px`);
      
      document.body.appendChild(sparkle);
      
      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      }, 800);
    }
  }, []);

  useEffect(() => {
    // Encontrar elemento
    if (elementId) {
      elementRef.current = document.getElementById(elementId);
    }

    // Verificar se valor aumentou
    if (value > previousValue.current && value > 0) {
      logger.info(`✨ ${type} streak aumentou de ${previousValue.current} para ${value}`);
      
      if (elementRef.current) {
        triggerGlowEffect(elementRef.current);
        triggerPulseEffect(elementRef.current);
        createSparkleEffect(elementRef.current);
      }
    }

    previousValue.current = value;
  }, [value, type, elementId, triggerGlowEffect, triggerPulseEffect, createSparkleEffect]);

  return {
    elementRef,
    triggerEffects: () => {
      if (elementRef.current) {
        triggerGlowEffect(elementRef.current);
        triggerPulseEffect(elementRef.current);
        createSparkleEffect(elementRef.current);
      }
    }
  };
};
