
import { logger } from '@/utils/logger';
import { StudyBlock, Subject } from '@/types/cycle';
import { v4 as uuidv4 } from 'uuid';
import { SubjectData, BlockGenerationResult } from './blockTypes';
import { formatDuration } from './timeUtils';
import { generateSimpleBlocks } from './simpleBlockDistributor';
import { ensureMultipleOf15, hoursToRoundedMinutes } from './timeUtils';

export { formatDuration };

export const generateStudyBlocks = (
  subjects: Subject[], 
  minDuration: number = 45, 
  maxDuration: number = 90
): StudyBlock[] => {
  const result = generateOptimizedBlocks(subjects, minDuration, maxDuration);
  return result.blocks;
};

const generateOptimizedBlocks = (
  subjects: Subject[], 
  minDuration: number, 
  maxDuration: number
): BlockGenerationResult => {
  // Garantir múltiplos de 15
  const roundedMinDuration = ensureMultipleOf15(minDuration);
  const roundedMaxDuration = ensureMultipleOf15(maxDuration);
  
  logger.info('🎯 Geração SIMPLIFICADA de blocos:', {
    originalMin: minDuration,
    roundedMin: roundedMinDuration,
    originalMax: maxDuration,
    roundedMax: roundedMaxDuration
  });
  
  // Preparar dados das disciplinas
  const subjectData: SubjectData[] = subjects.map((subject, index) => {
    const roundedMinutes = hoursToRoundedMinutes(subject.hoursPerWeek);
    logger.info(`📝 ${subject.name}: ${subject.hoursPerWeek}h = ${roundedMinutes}min`);
    
    return {
      name: subject.name,
      totalMinutes: roundedMinutes,
      remainingMinutes: roundedMinutes,
      isHeavy: false // Não usado no algoritmo simples
    };
  });

  // Usar algoritmo simplificado
  const result = generateSimpleBlocks(subjectData, {
    minDuration: roundedMinDuration,
    maxDuration: roundedMaxDuration,
    startBlockNumber: 1
  });

  // Gerar IDs únicos
  const subjectCounters: { [key: string]: number } = {};
  
  const blocksWithIds = result.blocks.map((block, index) => {
    // Validar duração
    const roundedDuration = ensureMultipleOf15(block.duration);
    if (roundedDuration !== block.duration) {
      logger.error(`❌ Duração não-múltipla corrigida: ${block.duration}min → ${roundedDuration}min`);
    }
    
    // Gerar persistentId
    if (!subjectCounters[block.subject]) {
      subjectCounters[block.subject] = 0;
    }
    subjectCounters[block.subject]++;
    
    const persistentId = `${block.subject}-bloco-${subjectCounters[block.subject]}`;
    
    return {
      ...block,
      id: uuidv4(),
      persistentId,
      blockNumber: index + 1,
      duration: roundedDuration
    };
  });

  logger.info('✅ Geração SIMPLIFICADA concluída:', {
    totalBlocks: blocksWithIds.length,
    subjectCounters
  });

  return {
    ...result,
    blocks: blocksWithIds
  };
};
