import React, { ComponentType } from 'react';
import { OPTIMIZATION_CONFIG } from '@/constants/optimizationConfig';
import { MotionProps } from '@/types/framer-motion';

/**
 * Wrapper para componentes Framer Motion com fallback para CSS
 * Reduz bundle size quando animações estão desabilitadas
 */

// Componente fallback sem animações
const StaticDiv: React.FC<MotionProps> = ({ 
  initial, 
  animate, 
  exit, 
  transition, 
  whileHover, 
  whileTap, 
  variants,
  className,
  style,
  children,
  ...props 
}) => {
  return (
    <div className={className} style={style} {...props}>
      {children}
    </div>
  );
};

// Lazy load do motion.div apenas se animações estiverem habilitadas
export const LazyMotionDiv = OPTIMIZATION_CONFIG.ANIMATIONS.ENABLE_FRAMER_MOTION
  ? React.lazy(() => 
      import('framer-motion').then(module => ({
        default: module.motion.div as ComponentType<MotionProps>
      }))
    )
  : StaticDiv;

// Lazy load do AnimatePresence
export const LazyAnimatePresence = OPTIMIZATION_CONFIG.ANIMATIONS.ENABLE_FRAMER_MOTION
  ? React.lazy(() => 
      import('framer-motion').then(module => ({
        default: module.AnimatePresence
      }))
    )
  : ({ children }: { children: React.ReactNode }) => <>{children}</>;

// Hook para usar animações condicionalmente
export const useMotion = () => {
  const isEnabled = OPTIMIZATION_CONFIG.ANIMATIONS.ENABLE_FRAMER_MOTION;
  
  return {
    isEnabled,
    motion: isEnabled ? import('framer-motion') : null,
    variants: isEnabled ? {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    } : {}
  };
};