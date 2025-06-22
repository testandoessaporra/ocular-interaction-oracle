
import React from 'react';
import { StudyBlock } from '@/types/cycle';
import BlockIcon from './BlockIcon';
import BlockSubjectName from './BlockSubjectName';
import BlockDurationBadge from './BlockDurationBadge';
import BlockDragHandle from './BlockDragHandle';

interface StudyBlockCardContentProps {
  block: StudyBlock;
  isCompleted: boolean;
  isValidBlock: boolean;
  onBlockClick: () => void;
}

const StudyBlockCardContent = ({
  block,
  isCompleted,
  isValidBlock,
  onBlockClick
}: StudyBlockCardContentProps) => {
  return (
    <div className="h-full w-full flex flex-col justify-between">
      {/* Invalid block indicator */}
      {!isValidBlock && (
        <div className="absolute top-1 left-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      )}

      {/* Drag Handle */}
      <BlockDragHandle />

      {/* Block Content - LAYOUT FIXO com justify-between */}
      <div 
        role="button"
        tabIndex={0}
        onClick={onBlockClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onBlockClick();
          }
        }}
        className="flex flex-col h-full justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400/50 rounded-lg"
      >
        {/* TOP SECTION: Icon + Block Number */}
        <div className="flex flex-col items-center space-y-2 flex-shrink-0">
          <BlockIcon isCompleted={isCompleted} />
          <span className={`font-bold text-lg tabular-nums transition-all duration-200 ${
            isCompleted 
              ? 'text-white/95'
              : 'text-yellow-400'
          }`}>
            {block.blockNumber}
          </span>
        </div>

        {/* MIDDLE SECTION: Subject Name - ALTURA FIXA com overflow controlado */}
        <div className="flex-1 flex items-center justify-center px-1 min-h-[56px] max-h-[56px]">
          <BlockSubjectName subject={block.subject} />
        </div>

        {/* BOTTOM SECTION: Duration Badge - POSIÇÃO FIXA com alinhamento corrigido */}
        <div className="flex-shrink-0 h-10 flex items-center justify-center">
          <BlockDurationBadge duration={block.duration} isCompleted={isCompleted} />
        </div>
      </div>
    </div>
  );
};

export default StudyBlockCardContent;
