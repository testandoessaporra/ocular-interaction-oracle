
import { logger } from '@/utils/logger';
import { StudyBlock } from '@/types/cycle';
import { ensureMultipleOf15 } from '../timeUtils';

export interface BlockCreationParams {
  subject: string;
  duration: number;
  blockNumber: number;
}

export const createStudyBlock = ({ subject, duration, blockNumber }: BlockCreationParams): StudyBlock => {
  // VALIDAÇÃO CRÍTICA: Garantir que a duração seja múltiplo de 15
  const roundedDuration = ensureMultipleOf15(duration);
  if (roundedDuration !== duration) {
    logger.error(`❌ Duração calculada não é múltiplo de 15: ${duration}min → ${roundedDuration}min`);
  }

  return {
    id: '',
    persistentId: '',
    subject,
    duration: roundedDuration,
    blockNumber
  };
};

export const validateBlockDurations = (blocks: StudyBlock[]): void => {
  const invalidBlocks = blocks.filter(block => block.duration % 15 !== 0);
  if (invalidBlocks.length > 0) {
    logger.error('❌ ERRO CRÍTICO: Blocos inválidos encontrados:', invalidBlocks);
    throw new Error(`Blocos com duração inválida: ${invalidBlocks.map(b => `${b.subject}=${b.duration}min`).join(', ')}`);
  }
};
