import React from 'react';
import { NavLink } from 'react-router-dom';
import { usePrefetch } from '@/utils/lazyPrefetch';

interface OptimizedNavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  prefetchComponent?: () => Promise<any>;
  prefetchKey?: string;
}

/**
 * NavLink otimizado com prefetch automático
 * Carrega componentes lazy quando o usuário hover sobre o link
 */
const OptimizedNavLink: React.FC<OptimizedNavLinkProps> = ({
  to,
  children,
  className,
  activeClassName,
  prefetchComponent,
  prefetchKey
}) => {
  const hoverProps = prefetchComponent && prefetchKey
    ? usePrefetch(prefetchComponent, prefetchKey, 'hover')
    : {};
  
  return (
    <NavLink
      to={to}
      className={className}
      {...(activeClassName && {
        className: ({ isActive }) =>
          `${className} ${isActive ? activeClassName : ''}`
      })}
      {...hoverProps}
    >
      {children}
    </NavLink>
  );
};

export default OptimizedNavLink;