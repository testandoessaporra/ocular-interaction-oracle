
import React, { Suspense } from 'react';

const CycleChart = React.lazy(() => import('@/components/CycleChart'));

interface Subject {
  name: string;
  weight: number;
  color?: string;
}

interface LazyCycleChartProps {
  subjects: Subject[];
  weeklyHours: number;
}

const ChartSkeleton = () => (
  <div className="tactical-card rounded-xl p-6 md:p-8 shadow-xl border border-yellow-400/30 bg-gray-900/80">
    <div className="flex items-center gap-4 mb-6 md:mb-8">
      <div className="p-2 md:p-3 bg-gray-800/80 rounded-xl shadow-lg border border-yellow-400/30 animate-pulse">
        <div className="w-5 h-5 md:w-6 md:h-6 bg-yellow-400/20 rounded"></div>
      </div>
      <div>
        <div className="h-6 bg-gray-700 rounded w-48 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-800 rounded w-32 animate-pulse"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-gray-800/80 border border-yellow-400/20 rounded-xl p-4 animate-pulse">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-3 h-8 md:w-4 md:h-10 bg-gray-600 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded w-32 mb-2"></div>
              <div className="flex items-center gap-3">
                <div className="h-3 bg-gray-700 rounded w-12"></div>
                <div className="h-5 bg-gray-700 rounded w-10"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const LazyCycleChart = React.memo(({ subjects, weeklyHours }: LazyCycleChartProps) => {
  return (
    <Suspense fallback={<ChartSkeleton />}>
      <CycleChart subjects={subjects} weeklyHours={weeklyHours} />
    </Suspense>
  );
});

LazyCycleChart.displayName = 'LazyCycleChart';

export default LazyCycleChart;
