
import { logger } from '@/utils/logger';
import { ensureMultipleOf15 } from './timeUtils';

export const calculateMostEfficientDuration = (
  remainingMinutes: number,
  minDuration: number,
  maxDuration: number,
  isLastBlock: boolean = false
): number => {
  logger.info(`🎯 Calculando duração ultra-eficiente: remaining=${remainingMinutes}, min=${minDuration}, max=${maxDuration}, isLast=${isLastBlock}`);
  
  // CORREÇÃO CRÍTICA: Garantir que todas as durações sejam múltiplos de 15
  const roundedMin = ensureMultipleOf15(minDuration);
  const roundedMax = ensureMultipleOf15(maxDuration);
  const roundedRemaining = ensureMultipleOf15(remainingMinutes);
  
  // Se é o último bloco da disciplina, usar todo o tempo restante (se estiver no intervalo)
  if (isLastBlock && roundedRemaining >= roundedMin && roundedRemaining <= roundedMax) {
    logger.info(`✅ Último bloco - usando todo o tempo: ${roundedRemaining}min`);
    return roundedRemaining;
  }
  
  // PRINCÍPIO DA MÁXIMA EFICIÊNCIA: Sempre usar a maior duração possível
  const maxPossible = Math.min(roundedMax, roundedRemaining);
  const result = Math.max(maxPossible, roundedMin);
  
  // VALIDAÇÃO: Garantir que o resultado seja múltiplo de 15
  const finalResult = ensureMultipleOf15(result);
  
  logger.info(`✅ Duração ultra-eficiente: ${finalResult}min (maximizando eficiência)`);
  return finalResult;
};

export const calculateOptimalBlockCount = (
  totalMinutes: number,
  minDuration: number,
  maxDuration: number
): { minBlocks: number; maxBlocks: number; recommended: number } => {
  // CORREÇÃO: Garantir múltiplos de 15
  const roundedMin = ensureMultipleOf15(minDuration);
  const roundedMax = ensureMultipleOf15(maxDuration);
  const roundedTotal = ensureMultipleOf15(totalMinutes);
  
  const minBlocks = Math.ceil(roundedTotal / roundedMax);
  const maxBlocks = Math.ceil(roundedTotal / roundedMin);
  
  // Recomendar número de blocos que minimize sobras
  let bestBlockCount = minBlocks;
  let smallestRemainder = Infinity;
  
  for (let blocks = minBlocks; blocks <= Math.min(maxBlocks, minBlocks + 2); blocks++) {
    const avgDuration = roundedTotal / blocks;
    if (avgDuration >= roundedMin && avgDuration <= roundedMax) {
      const remainder = roundedTotal % ensureMultipleOf15(avgDuration);
      if (remainder < smallestRemainder) {
        smallestRemainder = remainder;
        bestBlockCount = blocks;
      }
    }
  }
  
  return {
    minBlocks,
    maxBlocks,
    recommended: bestBlockCount
  };
};

// IMPLEMENTAÇÃO ULTRA-RIGOROSA: Intercalação obrigatória
export const shouldIntercalate = (
  subjects: Array<{ name: string; totalMinutes: number; remainingMinutes: number }>,
  currentSubjectIndex: number
): boolean => {
  const currentSubject = subjects[currentSubjectIndex];
  
  // Contar disciplinas disponíveis (com tempo suficiente)
  const availableSubjects = subjects.filter((_, i) => i !== currentSubjectIndex && _.remainingMinutes > 0);
  
  logger.info(`🔄 Verificação ULTRA-RIGOROSA de intercalação para ${currentSubject.name}:`, {
    availableAlternatives: availableSubjects.length,
    alternativeSubjects: availableSubjects.map(s => s.name)
  });
  
  // REGRA ULTRA-RIGOROSA: Se há alternativas disponíveis, SEMPRE intercalar
  if (availableSubjects.length > 0) {
    logger.info(`✅ FORÇANDO intercalação - existem ${availableSubjects.length} alternativas`);
    return true;
  }
  
  logger.info(`❌ Sem alternativas para intercalar`);
  return false;
};

// NOVA FUNÇÃO: Verificar se deve forçar mudança de disciplina (sempre que possível)
export const shouldForceIntercalation = (
  subjects: Array<{ name: string; totalMinutes: number; remainingMinutes: number }>,
  currentSubjectIndex: number,
  consecutiveBlocks: number,
  minDuration: number
): boolean => {
  // REGRA ULTRA-RIGOROSA: Forçar intercalação após qualquer bloco se há alternativas
  const hasAlternatives = subjects.some((s, i) => 
    i !== currentSubjectIndex && s.remainingMinutes >= minDuration
  );
  
  if (hasAlternatives && consecutiveBlocks >= 1) {
    logger.info(`🔄 FORÇANDO intercalação ultra-rigorosa após ${consecutiveBlocks} bloco(s)`);
    return true;
  }
  
  return false;
};
