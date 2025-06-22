import React, { useEffect, useState } from 'react';
import { OPTIMIZATION_CONFIG } from '@/constants/optimizationConfig';

interface OptimizedPageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

const OptimizedPageTransition: React.FC<OptimizedPageTransitionProps> = ({ 
  children, 
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!OPTIMIZATION_CONFIG.ANIMATIONS.ENABLE_CSS_ANIMATIONS) {
    return <div className={className}>{children}</div>;
  }
  
  return (
    <div 
      className={`
        ${className}
        transition-all duration-300 ease-out
        ${isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
        }
      `}
    >
      {children}
    </div>
  );
};

export default OptimizedPageTransition;