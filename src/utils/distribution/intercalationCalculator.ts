
import { StudyBlock } from '@/types/cycle';

export const calculateIntercalationSuccess = (blocks: StudyBlock[]): string => {
  let consecutiveCount = 0;
  let maxConsecutive = 0;
  let currentSubject = '';
  
  for (const block of blocks) {
    if (block.subject === currentSubject) {
      consecutiveCount++;
    } else {
      maxConsecutive = Math.max(maxConsecutive, consecutiveCount);
      consecutiveCount = 1;
      currentSubject = block.subject;
    }
  }
  maxConsecutive = Math.max(maxConsecutive, consecutiveCount);
  
  return `Máx. consecutivos: ${maxConsecutive}`;
};

export const calculateEfficiencyMetrics = (
  studyBlocks: StudyBlock[],
  subjectData: Array<{ name: string; totalMinutes: number }>,
  totalGeneratedMinutes: number,
  theoreticalMinBlocks: number
) => {
  const expectedMinutes = subjectData.reduce((sum, s) => sum + s.totalMinutes, 0);
  const errorMargin = Math.abs(totalGeneratedMinutes - expectedMinutes);
  const efficiencyRatio = theoreticalMinBlocks / studyBlocks.length;

  return {
    totalBlocks: studyBlocks.length,
    theoreticalMinBlocks,
    efficiencyRatio: `${(efficiencyRatio * 100).toFixed(1)}%`,
    totalGeneratedMinutes,
    expectedMinutes,
    errorMargin,
    intercalationSuccess: calculateIntercalationSuccess(studyBlocks)
  };
};
