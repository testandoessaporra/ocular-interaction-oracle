
import React from 'react';
import { GripVertical } from '@/components/icons';
;

const BlockDragHandle = () => {
  return (
    <div 
      className="absolute top-2 right-2 cursor-grab active:cursor-grabbing z-10"
      style={{
        // ISOLAMENTO TOTAL: Sem transform, o handle permanece fixo
        position: 'absolute',
        transformOrigin: 'center center',
        backfaceVisibility: 'hidden',
        willChange: 'auto' // Removido 'transform' para evitar layer de compositing
      }}
    >
      <GripVertical 
        className="w-4 h-4 text-gray-400 hover:text-yellow-400 transition-colors duration-200" 
        style={{
          transformOrigin: 'center center'
        }}
      />
    </div>
  );
};

export default BlockDragHandle;
