
import React from 'react';
import { formatDuration } from '@/utils/blockGenerator';

interface BlockDurationBadgeProps {
  duration: number;
  isCompleted: boolean;
}

const BlockDurationBadge = ({
  duration,
  isCompleted
}: BlockDurationBadgeProps) => {
  const formattedDuration = formatDuration(duration);
  
  // Pílula com altura fixa e alinhamento melhorado
  const pillClassName = isCompleted
    ? 'bg-green-800/90 border border-green-600/60 text-yellow-400'
    : 'bg-gray-700/90 border border-gray-600/60 text-yellow-400';
  
  return (
    <div className="w-full flex justify-center">
      <div className={`
        inline-flex items-center justify-center
        px-3 py-1.5 rounded-full
        text-xs font-semibold
        transition-all duration-200
        h-6 min-w-[60px] flex-shrink-0
        ${pillClassName}
      `}
      style={{ 
        fontVariantNumeric: 'tabular-nums',
        lineHeight: '1'
      }}
      >
        {formattedDuration}
      </div>
    </div>
  );
};

export default BlockDurationBadge;
