
import { logger } from '@/utils/logger';
import { StudyBlock } from '@/types/cycle';
import { SubjectData, BlockGenerationResult, GenerationParams } from './blockTypes';
import { ensureMultipleOf15 } from './timeUtils';
import { createStudyBlock } from './distribution/blockCreator';
import { selectNextSubject, SelectionState } from './distribution/subjectSelector';
import { calculateIntercalationSuccess } from './distribution/intercalationCalculator';

export const generateUltraEfficientBlocks = (
  subjectData: SubjectData[],
  { minDuration, maxDuration, startBlockNumber }: GenerationParams
): BlockGenerationResult => {
  const studyBlocks: StudyBlock[] = [];
  let blockNumber = startBlockNumber;
  let totalGeneratedMinutes = 0;
  
  // Garantir múltiplos de 15
  const roundedMinDuration = ensureMultipleOf15(minDuration);
  const roundedMaxDuration = ensureMultipleOf15(maxDuration);
  
  // Preparar dados com múltiplos de 15
  subjectData.forEach(subject => {
    subject.remainingMinutes = ensureMultipleOf15(subject.remainingMinutes);
    subject.totalMinutes = ensureMultipleOf15(subject.totalMinutes);
  });
  
  logger.info('🎯 Algoritmo ULTRA EFICIENTE iniciado', {
    subjects: subjectData.map(s => ({ name: s.name, minutes: s.totalMinutes })),
    minDuration: roundedMinDuration,
    maxDuration: roundedMaxDuration
  });

  // Estado de seleção atualizado
  const selectionState: SelectionState = {
    lastSubjectIndex: -1,
    consecutiveCount: 0
  };
  
  while (subjectData.some(s => s.remainingMinutes >= roundedMinDuration)) {
    // Usar seletor com novo formato
    const selectionResult = selectNextSubject(
      subjectData,
      selectionState,
      roundedMinDuration
    );

    if (!selectionResult.selectedSubject) {
      logger.info('❌ Nenhuma disciplina disponível, finalizando');
      break;
    }

    const { selectedSubject, subjectIndex } = selectionResult;
    
    // Atualizar estado de seleção
    if (subjectIndex === selectionState.lastSubjectIndex) {
      selectionState.consecutiveCount++;
    } else {
      selectionState.consecutiveCount = 1;
      selectionState.lastSubjectIndex = subjectIndex;
    }

    // Calcular duração - usar máximo possível dentro do limite
    const blockDuration = Math.min(roundedMaxDuration, selectedSubject.remainingMinutes);
    const finalDuration = ensureMultipleOf15(blockDuration);
    
    // Criar bloco
    const newBlock = createStudyBlock({
      subject: selectedSubject.name,
      duration: finalDuration,
      blockNumber: blockNumber++
    });

    studyBlocks.push(newBlock);
    selectedSubject.remainingMinutes = ensureMultipleOf15(selectedSubject.remainingMinutes - finalDuration);
    totalGeneratedMinutes = ensureMultipleOf15(totalGeneratedMinutes + finalDuration);
    
    logger.info(`✅ Bloco criado: ${selectedSubject.name} - ${finalDuration}min (restam ${selectedSubject.remainingMinutes}min)`);
  }

  // Calcular sobras descartadas
  const totalRemainder = subjectData.reduce((sum, s) => sum + s.remainingMinutes, 0);
  if (totalRemainder > 0) {
    logger.info(`✅ Sobras descartadas: ${totalRemainder}min (algoritmo ultra eficiente concluído)`);
  }

  // Calcular estatísticas de intercalação
  const intercalationStats = calculateIntercalationSuccess(studyBlocks);

  logger.info('✅ Distribuição ULTRA EFICIENTE concluída', {
    totalBlocks: studyBlocks.length,
    totalMinutes: totalGeneratedMinutes,
    remainder: totalRemainder,
    intercalationStats
  });

  return {
    blocks: studyBlocks,
    totalMinutes: totalGeneratedMinutes,
    errorMargin: totalRemainder
  };
};
