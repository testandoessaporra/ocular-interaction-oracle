
import { ensureMultipleOf15 } from '../timeUtils';

/**
 * Calcula a duração mais longa possível para um bloco, respeitando os limites.
 * @param remainingMinutes - Minutos restantes para a disciplina.
 * @param minDuration - Duração mínima permitida para um bloco.
 * @param maxDuration - Duração máxima permitida para um bloco.
 * @returns A duração calculada em minutos.
 */
export const calculateMaxPossibleDuration = (
  remainingMinutes: number,
  minDuration: number,
  maxDuration: number
): number => {
  // Garante que o tempo restante seja múltiplo de 15 para o cálculo
  const roundedRemaining = ensureMultipleOf15(remainingMinutes);

  // A duração será o tempo restante, mas limitada pela duração máxima.
  let duration = Math.min(roundedRemaining, maxDuration);

  // Garante que a duração final não seja menor que a mínima permitida.
  if (duration < minDuration) {
    duration = minDuration;
  }
  
  // Arredonda para o múltiplo de 15 mais próximo para garantir a conformidade.
  return ensureMultipleOf15(duration);
};
