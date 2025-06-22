
import React, { useRef } from 'react';
import StudyBlockCard from './StudyBlockCard';
import { StudyBlock } from '@/types/cycle';
import { usePerformanceTracker } from '@/hooks/usePerformanceTracker';
import { bundleAnalyzer } from '@/utils/bundleAnalyzer';

interface StudyBlocksGridProps {
  studyBlocks: StudyBlock[];
  completedBlocks: string[];
  onBlockClick: (block: StudyBlock) => void;
  draggedIndex?: number | null;
  dragOverIndex?: number | null;
  onDragStart?: (e: React.DragEvent, index: number) => void;
  onDragOver?: (e: React.DragEvent, index: number) => void;
  onDragLeave?: () => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
  onDragEnd?: () => void;
}

const StudyBlocksGridOptimized = ({ 
  studyBlocks, 
  completedBlocks, 
  onBlockClick,
  draggedIndex = null,
  dragOverIndex = null,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd
}: StudyBlocksGridProps) => {
  
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Track performance deste componente
  const { trackOperation, logCustomMetric } = usePerformanceTracker({
    componentName: 'StudyBlocksGrid',
    trackRenders: true
  });

  // Track carregamento do componente
  React.useEffect(() => {
    bundleAnalyzer.trackComponentLoad('StudyBlocksGrid', ['StudyBlockCard']);
  }, []);

  // Track métricas dos blocos
  React.useEffect(() => {
    trackOperation('calculateBlockMetrics', () => {
      logCustomMetric('totalBlocks', studyBlocks.length);
      logCustomMetric('completedBlocks', completedBlocks.length);
      logCustomMetric('completionRate', studyBlocks.length > 0 ? (completedBlocks.length / studyBlocks.length) * 100 : 0);
    });
  }, [studyBlocks.length, completedBlocks.length, trackOperation, logCustomMetric]);

  // Auto-scroll functions
  const startScrolling = (direction: 'up' | 'down') => {
    if (scrollIntervalRef.current) return;

    scrollIntervalRef.current = setInterval(() => {
      const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement;
      if (!scrollArea) return;

      const scrollAmount = direction === 'up' ? -10 : 10;
      scrollArea.scrollTop += scrollAmount;
    }, 50);
  };

  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stopScrolling();
    };
  }, []);

  // Stop scrolling when drag ends
  React.useEffect(() => {
    if (draggedIndex === null) {
      stopScrolling();
    }
  }, [draggedIndex]);

  const handleScrollTrigger = (direction: 'up' | 'down', e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex !== null) {
      startScrolling(direction);
    }
  };

  const handleScrollTriggerLeave = () => {
    stopScrolling();
  };

  if (!studyBlocks || studyBlocks.length === 0) {
    return (
      <div className="text-center py-8 description-text">
        Nenhum bloco de estudos encontrado.
      </div>
    );
  }

  const handleStartTimer = (block: StudyBlock) => {
    onBlockClick(block);
  };

  return (
    <div className="relative">
      {/* Zona de trigger superior - invisível */}
      {draggedIndex !== null && (
        <div
          className="absolute top-0 left-0 right-0 h-12 z-10"
          onDragOver={(e) => handleScrollTrigger('up', e)}
          onDragLeave={handleScrollTriggerLeave}
        />
      )}

      {/* Grid sem Framer Motion - usando CSS transitions */}
      <div 
        className="grid gap-6 justify-items-center w-full
          grid-cols-1 
          min-[500px]:grid-cols-2 
          min-[800px]:grid-cols-3 
          min-[1100px]:grid-cols-4 
          min-[1400px]:grid-cols-5 
          min-[1700px]:grid-cols-6
          min-[2000px]:grid-cols-7
          transition-opacity duration-300 ease-out"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, 200px)',
          justifyContent: 'center'
        }}
      >
        {studyBlocks.map((block, index) => {
          const isCompleted = completedBlocks.includes(block.persistentId);
          const isValidBlock = block.persistentId && block.persistentId !== 'undefined';
          
          return (
            <div
              key={block.persistentId}
              className="transition-all duration-200 ease-out"
              style={{
                animationDelay: `${index * 30}ms`,
                animation: 'fadeInUp 0.4s ease-out forwards',
                opacity: 0
              }}
            >
              <StudyBlockCard
                block={block}
                index={index}
                isCompleted={isCompleted}
                isValidBlock={isValidBlock}
                isDragging={draggedIndex === index}
                isDragOver={dragOverIndex === index}
                draggedIndex={draggedIndex}
                onDragStart={onDragStart || (() => {})}
                onDragOver={onDragOver || (() => {})}
                onDragLeave={onDragLeave || (() => {})}
                onDrop={onDrop || (() => {})}
                onDragEnd={onDragEnd || (() => {})}
                onBlockClick={onBlockClick}
                onStartTimer={handleStartTimer}
              />
            </div>
          );
        })}
      </div>

      {/* Zona de trigger inferior - invisível */}
      {draggedIndex !== null && (
        <div
          className="absolute bottom-0 left-0 right-0 h-12 z-10"
          onDragOver={(e) => handleScrollTrigger('down', e)}
          onDragLeave={handleScrollTriggerLeave}
        />
      )}

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default React.memo(StudyBlocksGridOptimized);
