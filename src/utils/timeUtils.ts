
/**
 * Utilitário centralizado para garantir que todas as durações sejam múltiplos de 15 minutos
 */

export const ensureMultipleOf15 = (minutes: number): number => {
  // Handle special number values
  if (isNaN(minutes) || !isFinite(minutes) || minutes <= 0) return 0;
  
  return Math.round(minutes / 15) * 15;
};

export const roundTo15 = (minutes: number): number => {
  return ensureMultipleOf15(minutes);
};

export const formatDuration = (minutes: number): string => {
  const roundedMinutes = ensureMultipleOf15(minutes);
  const hours = Math.floor(roundedMinutes / 60);
  const mins = roundedMinutes % 60;
  
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h${mins.toString().padStart(2, '0')}min`;
};

// Validar se um número é múltiplo de 15
export const isMultipleOf15 = (minutes: number): boolean => {
  return minutes % 15 === 0;
};

// Converter horas para minutos e garantir múltiplo de 15
export const hoursToRoundedMinutes = (hours: number): number => {
  return ensureMultipleOf15(hours * 60);
};
