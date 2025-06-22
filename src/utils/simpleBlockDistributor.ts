
import { logger } from '@/utils/logger';
import { StudyBlock } from '@/types/cycle';
import { SubjectData, BlockGenerationResult, GenerationParams } from './blockTypes';
import { ensureMultipleOf15 } from './timeUtils';
import { createStudyBlock } from './distribution/blockCreator';
import { SelectionState } from './distribution/subjectSelector';
import { selectNextAndAlternateSubject } from './distribution/selectNextAndAlternateSubject';
import { calculateMaxPossibleDuration } from './distribution/calculateMaxPossibleDuration';

export const generateSimpleBlocks = (
  subjectData: SubjectData[],
  { minDuration, maxDuration, startBlockNumber }: GenerationParams
): BlockGenerationResult => {
  logger.info('🚀 INICIANDO ALGORITMO DE DISTRIBUIÇÃO TÁTICA (INTERCALADO)');
  
  const studyBlocks: StudyBlock[] = [];
  let blockNumber = startBlockNumber;
  
  const roundedMinDuration = ensureMultipleOf15(minDuration);
  const roundedMaxDuration = ensureMultipleOf15(maxDuration);
  
  subjectData.forEach(subject => {
    subject.remainingMinutes = ensureMultipleOf15(subject.remainingMinutes);
    logger.info(`- Disciplina: ${subject.name}, Duração Total: ${subject.remainingMinutes} min`);
  });
  
  const selectionState: SelectionState = {
    lastSubjectIndex: -1,
    consecutiveCount: 0
  };
  
  while (subjectData.some(s => s.remainingMinutes >= roundedMinDuration)) {
    const subjectIndex = selectNextAndAlternateSubject(subjectData, selectionState, roundedMinDuration);
    
    if (subjectIndex === -1) {
      logger.info('🛑 Nenhuma disciplina com tempo suficiente para um bloco mínimo. Finalizando.');
      break;
    }

    const selectedSubject = subjectData[subjectIndex];
    
    // Atualiza o estado da seleção
    selectionState.lastSubjectIndex = subjectIndex;

    const blockDuration = calculateMaxPossibleDuration(
      selectedSubject.remainingMinutes,
      roundedMinDuration,
      roundedMaxDuration
    );

    if (blockDuration === 0) continue;

    const newBlock = createStudyBlock({
      subject: selectedSubject.name,
      duration: blockDuration,
      blockNumber: blockNumber++
    });
    
    studyBlocks.push(newBlock);
    selectedSubject.remainingMinutes -= blockDuration;
    
    logger.info(`✅ Bloco ${newBlock.blockNumber}: ${newBlock.subject} - ${newBlock.duration}min (Restam: ${selectedSubject.remainingMinutes}min)`);
  }
  
  const totalMinutesGenerated = studyBlocks.reduce((sum, block) => sum + block.duration, 0);
  const totalRemainder = subjectData.reduce((sum, s) => sum + s.remainingMinutes, 0);
  
  logger.info('✅ GERAÇÃO TÁTICA CONCLUÍDA!', {
    totalBlocks: studyBlocks.length,
    totalMinutes: totalMinutesGenerated,
    totalRemainder,
  });
  
  return {
    blocks: studyBlocks,
    totalMinutes: totalMinutesGenerated,
    errorMargin: totalRemainder
  };
};
