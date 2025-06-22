
import React from 'react';
import { Button } from '@/components/ui/button';

import AnimatedProgressBar from './AnimatedProgressBar';
import { CheckCircle2 } from '@/components/icons';

interface ProgressSectionProps {
  progressPercentage: number;
  isComplete: boolean;
  onFinalizeCycle: () => void;
}

const ProgressSection = ({ progressPercentage, isComplete, onFinalizeCycle }: ProgressSectionProps) => {
  return (
    <div 
      className="space-y-4 max-w-[1600px] mx-auto animate-fade-in"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-3 flex-1">
          <AnimatedProgressBar progressPercentage={progressPercentage} />
        </div>

        {isComplete && (
          <Button
            onClick={onFinalizeCycle}
            className="tactical-btn-primary-enhanced h-10 px-4 text-sm font-medium rounded-xl focus-visible:ring-2 focus-visible:ring-tactical-gold/60"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Finalizar Ciclo
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProgressSection;
