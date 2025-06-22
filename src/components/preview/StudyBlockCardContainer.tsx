import React, { useMemo } from 'react';
import { StudyBlock } from '@/types/cycle';
import { getSubjectBorderColor } from '@/constants/subjectColors';

interface StudyBlockCardContainerProps {
  block: StudyBlock;
  index: number;
  isCompleted: boolean;
  isValidBlock: boolean;
  isDragging: boolean;
  isDragOver: boolean;
  draggedIndex: number | null;
  children: React.ReactNode;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

const StudyBlockCardContainer = ({
  block,
  index,
  isCompleted,
  isValidBlock,
  isDragging,
  isDragOver,
  draggedIndex,
  children,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd
}: StudyBlockCardContainerProps) => {
  const CARD_WIDTH = 200;
  const CARD_HEIGHT = 180;

  const subjectBorderColor = useMemo(() => {
    return getSubjectBorderColor(block.subject);
  }, [block.subject]);

  const cardClassName = useMemo(() => {
    const baseClasses = `
      relative transition-all duration-300 group rounded-xl border-2 p-4
      flex flex-col justify-between tactical-card-enhanced hexagonal-pattern
      focus-visible:ring-2 focus-visible:ring-tactical-gold focus-visible:outline-none
      focus-visible:ring-offset-2 focus-visible:ring-offset-tactical-black
      overflow-hidden
    `;
    
    // Visual sofisticado: blocos completados com gradiente elegante verde-dourado
    const stateClasses = isCompleted 
      ? `tactical-gradient-card ${subjectBorderColor}`
      : `tactical-gradient-dark ${subjectBorderColor} tactical-shadow-md`;
    
    // Removidas TODAS as classes scale-* para evitar conflitos com Framer Motion
    const interactionClasses = `
      hover:tactical-shadow-lg
      ${isDragging ? 'opacity-50 z-30 tactical-shadow-lg' : ''}
      ${isDragOver && !isDragging ? 'ring-2 ring-tactical-gold tactical-shadow-gold' : ''}
      ${!isValidBlock ? 'ring-2 ring-red-500 ring-opacity-50' : ''}
    `;

    return `${baseClasses} ${stateClasses} ${interactionClasses}`;
  }, [
    isDragging, 
    isDragOver, 
    isCompleted, 
    isValidBlock, 
    subjectBorderColor
  ]);

  return (
    <div key={block.id || `block-${index}`} className="relative">
      {/* Drop Indicator */}
      {isDragOver && draggedIndex !== null && draggedIndex !== index && (
        <div className="absolute -top-2 left-0 right-0 h-1 bg-tactical-gold rounded-full tactical-shadow-gold z-20 tactical-pulse"></div>
      )}
      
      {/* Drag Placeholder */}
      {isDragging && (
        <div 
          className="absolute inset-0 bg-tactical-gold/20 border-2 border-dashed border-tactical-gold rounded-xl z-10 tactical-pulse"
          style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        ></div>
      )}
      
      {/* Main Card */}
      <div
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
        className={cardClassName}
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          zIndex: isDragging ? 1000 : 'auto',
          transformOrigin: 'center center'
        }}
        tabIndex={0}
        role="button"
        aria-label={`Bloco ${block.blockNumber} - ${block.subject} - ${block.duration} minutos${isCompleted ? ' - Concluído' : ''}`}
      >
        {children}
      </div>
    </div>
  );
};

export default StudyBlockCardContainer;
