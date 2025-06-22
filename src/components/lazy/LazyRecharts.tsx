import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Componentes lazy para Recharts
export const LazyBarChart = lazy(() => 
  import('recharts').then(module => ({ default: module.BarChart }))
);

export const LazyBar = lazy(() => 
  import('recharts').then(module => ({ default: module.Bar }))
);

export const LazyXAxis = lazy(() => 
  import('recharts').then(module => ({ default: module.XAxis }))
);

export const LazyYAxis = lazy(() => 
  import('recharts').then(module => ({ default: module.YAxis }))
);

export const LazyCartesianGrid = lazy(() => 
  import('recharts').then(module => ({ default: module.CartesianGrid }))
);

export const LazyTooltip = lazy(() => 
  import('recharts').then(module => ({ default: module.Tooltip }))
);

export const LazyResponsiveContainer = lazy(() => 
  import('recharts').then(module => ({ default: module.ResponsiveContainer }))
);

export const LazyCell = lazy(() => 
  import('recharts').then(module => ({ default: module.Cell }))
);

// Skeleton para loading
export const ChartSkeleton = () => (
  <div className="w-full h-[400px] p-4">
    <Skeleton className="w-full h-full rounded-xl" />
  </div>
);

// Wrapper com Suspense
export const LazyChartWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<ChartSkeleton />}>
    {children}
  </Suspense>
);