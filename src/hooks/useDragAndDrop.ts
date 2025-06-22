
import { useState } from 'react';
import { StudyBlock, Cycle } from '@/types/cycle';

interface UseDragAndDropProps {
  studyBlocks: StudyBlock[];
  currentCycle: Cycle | null;
  setCurrentCycle: (cycle: Cycle, preserveProgress?: boolean) => void;
}

export const useDragAndDrop = ({ 
  studyBlocks, 
  currentCycle, 
  setCurrentCycle
}: UseDragAndDropProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newBlocks = [...studyBlocks];
    const draggedBlock = newBlocks[draggedIndex];
    
    // Remove o bloco da posição original
    newBlocks.splice(draggedIndex, 1);
    
    // Insere o bloco na nova posição
    const insertIndex = draggedIndex < dropIndex ? dropIndex : dropIndex;
    newBlocks.splice(insertIndex, 0, draggedBlock);

    // Recalcula os blockNumbers para manter sequência
    const updatedBlocks = newBlocks.map((block, index) => ({
      ...block,
      blockNumber: index + 1
    }));

    if (currentCycle) {
      const updatedCycle = {
        ...currentCycle,
        studyBlocks: updatedBlocks
      };
      // CRITICAL: Sempre preservar progresso no drag & drop
      setCurrentCycle(updatedCycle, true);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return {
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd
  };
};
