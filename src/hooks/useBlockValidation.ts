
import { logger } from '@/utils/logger';
import { StudyBlock } from '@/types/cycle';

export const useBlockValidation = (studyBlocks: StudyBlock[], completedBlocks: string[]) => {
  // Validar blocos e filtrar completedBlocks inválidos
  const validateCompletedBlocks = () => {
    const validCompletedBlocks = completedBlocks.filter(blockId => {
      const isValid = blockId && blockId !== 'undefined' && 
                     studyBlocks.some(block => block.persistentId === blockId);
      
      if (!isValid && blockId) {
        logger.info('🧹 Ignorando bloco completado inválido no preview', { data: { blockId } });
      }
      
      return isValid;
    });

    logger.info('🔍 Preview - Verificação de blocos', {
      data: {
        originalCompletedBlocks: completedBlocks,
        validCompletedBlocks,
        studyBlocksCount: studyBlocks.length,
        studyBlocksIds: studyBlocks.map(b => ({ 
          persistentId: b.persistentId, 
          id: b.id, 
          subject: b.subject,
          isValidId: b.persistentId && b.persistentId !== 'undefined'
        }))
      }
    });

    return validCompletedBlocks;
  };

  const isBlockCompleted = (blockId: string, validCompletedBlocks: string[]) => {
    return blockId && validCompletedBlocks.includes(blockId);
  };

  const isBlockValid = (block: StudyBlock) => {
    const blockId = block.persistentId;
    if (!blockId || blockId === 'undefined') {
      logger.error(`❌ Bloco ${block.blockNumber} tem persistentId inválido`, { data: { blockId, block } });
      return false;
    }
    return true;
  };

  return {
    validateCompletedBlocks,
    isBlockCompleted,
    isBlockValid
  };
};
