
import React from 'react';

import { CheckCircle, Play } from '@/components/icons';

interface BlockIconProps {
  isCompleted: boolean;
}

const BlockIcon = ({ isCompleted }: BlockIconProps) => {
  return (
    <div className="flex justify-center">
      {isCompleted ? (
        <div 
          className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-scale-in"
        >
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
      ) : (
        <Play className="w-6 h-6 text-gray-400 group-hover:text-yellow-400 transition-colors duration-200" />
      )}
    </div>
  );
};

export default BlockIcon;
