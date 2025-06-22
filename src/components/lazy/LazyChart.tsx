
import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load do CycleChart apenas quando necessário
const CycleChart = lazy(() => import('@/components/CycleChart'));

interface LazyChartProps {
  subjects: Array<{
    name: string;
    weight: number;
    color?: string;
  }>;
  weeklyHours: number;
}

const ChartSkeleton = () => (
  <div className="w-full h-[400px] p-4">
    <Skeleton className="w-full h-full rounded-xl" />
  </div>
);

const LazyChart: React.FC<LazyChartProps> = (props) => {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <CycleChart {...props} />
    </Suspense>
  );
};

export default LazyChart;
