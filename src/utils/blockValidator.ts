
import { StudyBlock } from '@/types/cycle';
import { blockValidationService } from '@/services/blockValidationService';

export const validateAndFixBlocks = (blocks: StudyBlock[]): StudyBlock[] => {
  return blockValidationService.fixInvalidBlocks(blocks);
};

export const validateCompletedBlocks = (completedBlocks: string[], validBlocks: StudyBlock[]): string[] => {
  return blockValidationService.validateCompletedBlocks(completedBlocks, validBlocks);
};
