
import React from 'react';
import { StudyBlock } from '@/types/cycle';
import { useUser } from '@/contexts/UserContext';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useBlockValidation } from '@/hooks/useBlockValidation';
import { useProgressCalculation } from '@/hooks/useProgressCalculation';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProgressSection from './preview/ProgressSection';
import StatsSection from './preview/StatsSection';
import StudyBlocksGrid from './preview/StudyBlocksGrid';
import StreakPanels from './preview/StreakPanels';

interface StudyBlocksPreviewProps {
  studyBlocks: StudyBlock[];
  completedBlocks?: string[];
  onBlockClick: (block: StudyBlock) => void;
}

const StudyBlocksPreview = ({ studyBlocks, completedBlocks = [], onBlockClick }: StudyBlocksPreviewProps) => {
  const { currentCycle, setCurrentCycle, resetCompletedBlocks, userProgress } = useUser();
  
  if (studyBlocks.length === 0) return null;

  // Hooks customizados para separar responsabilidades
  const { validateCompletedBlocks } = useBlockValidation(studyBlocks, completedBlocks);
  const validCompletedBlocks = validateCompletedBlocks();
  
  const { progressPercentage, isComplete, stats } = useProgressCalculation(studyBlocks, validCompletedBlocks);
  
  const {
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  } = useDragAndDrop({ 
    studyBlocks, 
    currentCycle, 
    setCurrentCycle
  });

  const handleFinalizeCycle = () => {
    if (isComplete) {
      resetCompletedBlocks();
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-full overflow-x-hidden">
      {/* Painéis de Streak no topo - usando valores reais */}
      <StreakPanels 
        cycleStreak={userProgress.cycleStreak} 
        dayStreak={userProgress.loginStreak} 
      />

      {/* Progress Section */}
      <ProgressSection 
        progressPercentage={progressPercentage}
        isComplete={isComplete}
        onFinalizeCycle={handleFinalizeCycle}
      />

      {/* Study Blocks Grid - Com altura fixa para forçar scroll e auto-scroll no drag */}
      <ScrollArea className="w-full h-[400px] rounded-xl">
        <div className="px-2 py-1">
          <StudyBlocksGrid
            studyBlocks={studyBlocks}
            completedBlocks={completedBlocks}
            onBlockClick={onBlockClick}
            draggedIndex={draggedIndex}
            dragOverIndex={dragOverIndex}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        </div>
      </ScrollArea>

      {/* Stats Summary - Movido para baixo dos blocos */}
      <StatsSection stats={stats} />
    </div>
  );
};

export default StudyBlocksPreview;
