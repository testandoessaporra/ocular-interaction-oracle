import { logger } from '@/utils/logger';
import { useRef, useEffect } from 'react';

/**
 * Hook para debug de re-renders
 * Mostra quantas vezes um componente renderizou e quais props mudaram
 */
export const useDebugRenders = (componentName: string, props?: Record<string, any>) => {
  const renderCount = useRef(0);
  const previousProps = useRef<Record<string, any> | undefined>();

  useEffect(() => {
    renderCount.current += 1;
    
    // Log básico de render
    logger.info(`🔄 ${componentName} renderizou ${renderCount.current} vezes`);
    
    // Se temos props, verificar o que mudou
    if (props && previousProps.current) {
      const changedProps: string[] = [];
      
      Object.keys(props).forEach(key => {
        if (previousProps.current![key] !== props[key]) {
          changedProps.push(key);
        }
      });
      
      if (changedProps.length > 0) {
        logger.info(`   Props mudadas: ${changedProps.join(', ')}`);
      }
    }
    
    // Guardar props para próxima comparação
    previousProps.current = props;
  });
  
  return renderCount.current;
};