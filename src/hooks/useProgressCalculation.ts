
import { StudyBlock } from '@/types/cycle';

export const useProgressCalculation = (studyBlocks: StudyBlock[], validCompletedBlocks: string[]) => {
  const completedCount = validCompletedBlocks.length;
  const totalCount = studyBlocks.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isComplete = progressPercentage === 100;

  const stats = {
    totalBlocks: studyBlocks.length,
    totalHours: Math.round(studyBlocks.reduce((sum, block) => sum + block.duration, 0) / 60 * 10) / 10,
    averageDuration: studyBlocks.length > 0 
      ? Math.round(studyBlocks.reduce((sum, block) => sum + block.duration, 0) / studyBlocks.length)
      : 0,
    completedBlocks: validCompletedBlocks.length
  };

  return {
    completedCount,
    totalCount,
    progressPercentage,
    isComplete,
    stats
  };
};
