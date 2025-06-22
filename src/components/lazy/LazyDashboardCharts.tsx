import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

// Lazy load dos componentes pesados do Dashboard
const ProfileSection = lazy(() => 
  import('@/components/dashboard/ProfileSection')
);

const MedalsGrid = lazy(() => 
  import('@/components/dashboard/MedalsGrid')
);

// Skeleton para ProfileSection
const ProfileSkeleton = () => (
  <Card className="p-6">
    <div className="flex items-center gap-4 mb-4">
      <Skeleton className="w-20 h-20 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="h-20" />
      <Skeleton className="h-20" />
    </div>
  </Card>
);

// Skeleton para MedalsGrid
const MedalsSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {[...Array(8)].map((_, i) => (
      <Skeleton key={i} className="h-32 rounded-xl" />
    ))}
  </div>
);

// Componentes exportados com Suspense
export const LazyProfileSection: React.FC<any> = (props) => (
  <Suspense fallback={<ProfileSkeleton />}>
    <ProfileSection {...props} />
  </Suspense>
);

export const LazyMedalsGrid: React.FC<any> = (props) => (
  <Suspense fallback={<MedalsSkeleton />}>
    <MedalsGrid {...props} />
  </Suspense>
);