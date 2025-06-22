
import { logger } from '@/utils/logger';
import { ensureMultipleOf15, formatDuration } from './timeUtils';

export { formatDuration };

export const calculateOptimalBlockDuration = (
  remainingMinutes: number, 
  minDuration: number, 
  maxDuration: number
): number => {
  logger.info(`🎯 Calculando duração ótima: remaining=${remainingMinutes}, min=${minDuration}, max=${maxDuration}`);
  
  // CORREÇÃO CRÍTICA: Garantir múltiplos de 15 para todas as durações
  const roundedRemaining = ensureMultipleOf15(remainingMinutes);
  const roundedMin = ensureMultipleOf15(minDuration);
  const roundedMax = ensureMultipleOf15(maxDuration);
  
  // CORREÇÃO CRÍTICA: SEMPRE respeitar duração mínima
  if (roundedRemaining < roundedMin) {
    logger.info(`⚠️ Tempo restante (${roundedRemaining}) menor que mínimo (${roundedMin}). Retornando mínimo.`);
    return roundedMin;
  }
  
  // Se o tempo restante cabe perfeitamente dentro do intervalo min-max
  if (roundedRemaining <= roundedMax) {
    const result = Math.max(roundedRemaining, roundedMin);
    logger.info(`✅ Tempo restante cabe no intervalo. Resultado: ${result}min`);
    return result;
  }
  
  // Escolher duração múltipla de 15 que minimize sobras, mas sempre >= minDuration
  const possibleDurations = [];
  for (let d = roundedMin; d <= roundedMax; d += 15) {
    if (d >= roundedMin && d <= roundedRemaining) {
      const remainder = roundedRemaining % d;
      possibleDurations.push({ duration: d, remainder });
    }
  }
  
  if (possibleDurations.length === 0) {
    const result = Math.max(roundedMax, roundedMin);
    logger.info(`⚠️ Nenhuma duração válida encontrada. Usando máximo: ${result}min`);
    return result;
  }
  
  // Priorizar durações que deixem menos sobra ou sobra divisível por minDuration
  const optimal = possibleDurations.sort((a, b) => {
    // Priorizar resto zero
    if (a.remainder === 0 && b.remainder !== 0) return -1;
    if (b.remainder === 0 && a.remainder !== 0) return 1;
    
    // Priorizar resto >= minDuration (pode gerar outro bloco válido)
    if (a.remainder >= roundedMin && b.remainder < roundedMin) return -1;
    if (b.remainder >= roundedMin && a.remainder < roundedMin) return 1;
    
    // Por último, menor resto
    return a.remainder - b.remainder;
  })[0];
  
  const result = Math.max(optimal.duration, roundedMin);
  
  // VALIDAÇÃO FINAL: Garantir que o resultado seja múltiplo de 15
  const finalResult = ensureMultipleOf15(result);
  
  logger.info(`✅ Duração ótima calculada: ${finalResult}min (sobra: ${optimal.remainder}min)`);
  return finalResult;
};
