
import { StudyBlock } from '@/types/cycle';
import React from 'react';
import { performanceMonitor } from '@/utils/performanceMonitor';
import StudyBlockCardContainer from './StudyBlockCardContainer';
import StudyBlockCardAnimations from './StudyBlockCardAnimations';
import StudyBlockCardContent from './StudyBlockCardContent';

interface StudyBlockCardProps {
  block: StudyBlock;
  index: number;
  isCompleted: boolean;
  isValidBlock: boolean;
  isDragging: boolean;
  isDragOver: boolean;
  draggedIndex: number | null;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onBlockClick: (block: StudyBlock) => void;
  onStartTimer: (block: StudyBlock) => void;
}

const StudyBlockCard = React.memo(({
  block,
  index,
  isCompleted,
  isValidBlock,
  isDragging,
  isDragOver,
  draggedIndex,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onBlockClick,
  onStartTimer
}: StudyBlockCardProps) => {
  // Track re-renders
  React.useEffect(() => {
    performanceMonitor.trackReRender('StudyBlockCard');
  });

  // Memoized callbacks
  const handleDragStart = React.useCallback((e: React.DragEvent) => {
    onDragStart(e, index);
  }, [onDragStart, index]);

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    onDragOver(e, index);
  }, [onDragOver, index]);

  const handleDrop = React.useCallback((e: React.DragEvent) => {
    onDrop(e, index);
  }, [onDrop, index]);

  const handleBlockClick = React.useCallback(() => {
    onBlockClick(block);
  }, [onBlockClick, block]);

  return (
    <StudyBlockCardContainer
      block={block}
      index={index}
      isCompleted={isCompleted}
      isValidBlock={isValidBlock}
      isDragging={isDragging}
      isDragOver={isDragOver}
      draggedIndex={draggedIndex}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      onDragEnd={onDragEnd}
    >
      <StudyBlockCardAnimations 
        index={index}
        isDragging={isDragging}
        isDragOver={isDragOver}
      >
        <StudyBlockCardContent
          block={block}
          isCompleted={isCompleted}
          isValidBlock={isValidBlock}
          onBlockClick={handleBlockClick}
        />
      </StudyBlockCardAnimations>
    </StudyBlockCardContainer>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to avoid unnecessary re-renders
  return (
    prevProps.block.id === nextProps.block.id &&
    prevProps.isCompleted === nextProps.isCompleted &&
    prevProps.isValidBlock === nextProps.isValidBlock &&
    prevProps.isDragging === nextProps.isDragging &&
    prevProps.isDragOver === nextProps.isDragOver &&
    prevProps.draggedIndex === nextProps.draggedIndex &&
    prevProps.index === nextProps.index
  );
});

StudyBlockCard.displayName = 'StudyBlockCard';

export default StudyBlockCard;
