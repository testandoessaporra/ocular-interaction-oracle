
import { logger } from '@/utils/logger';
import { CycleWizardData } from '@/types/cycleWizard';

export const calculateWeightWithDifficulty = (baseWeight: number, difficulty: number): number => {
  switch (difficulty) {
    case 1: return baseWeight * 2; // Extrema: +100%
    case 2: return baseWeight * 1.5; // Difícil: +50%
    case 3: return baseWeight; // Normal: mantém
    case 4: return baseWeight * 0.75; // Base: -25%
    case 5: return baseWeight * 0.4; // Domino: -60%
    default: return baseWeight;
  }
};

export const estimateBlocks = (subjects: any[], weeklyHours: number, minDuration: number, maxDuration: number): number => {
  const totalMinutes = weeklyHours * 60;
  const avgBlockDuration = (minDuration + maxDuration) / 2;
  return Math.ceil(totalMinutes / avgBlockDuration);
};

export const calculateOptimalDurations = (wizardData: CycleWizardData): { minDuration: number; maxDuration: number; reasoning: string } => {
  const selectedSubjects = wizardData.subjects.filter(s => s.isSelected);
  
  if (selectedSubjects.length === 0) {
    return { minDuration: 45, maxDuration: 90, reasoning: "Valores padrão" };
  }

  // Calcular pesos finais com modificadores de dificuldade
  const totalAdjustedWeight = selectedSubjects.reduce((sum, subject) => 
    sum + calculateWeightWithDifficulty(subject.weight, subject.difficulty), 0
  );

  // Calcular distribuição de minutos por disciplina
  const subjectsWithMinutes = selectedSubjects.map(subject => {
    const adjustedWeight = calculateWeightWithDifficulty(subject.weight, subject.difficulty);
    const minutesPerWeek = (wizardData.weeklyHours * 60 * adjustedWeight / totalAdjustedWeight);
    return { ...subject, minutesPerWeek };
  });

  const minSubjectMinutes = Math.min(...subjectsWithMinutes.map(s => s.minutesPerWeek));
  const maxSubjectMinutes = Math.max(...subjectsWithMinutes.map(s => s.minutesPerWeek));
  
  // Calcular tempo mínimo otimizado
  // Deve ser pequeno o suficiente para a menor disciplina ter pelo menos 1 bloco decente
  const optimalMinDuration = Math.max(30, Math.min(60, Math.floor(minSubjectMinutes * 0.6)));
  
  // Calcular tempo máximo otimizado
  // Deve permitir flexibilidade mas não criar blocos excessivamente longos
  const optimalMaxDuration = Math.max(90, Math.min(150, Math.ceil(maxSubjectMinutes * 0.4)));
  
  logger.info('🎯 Calculando durações otimizadas:', {
    minSubjectMinutes,
    maxSubjectMinutes,
    optimalMinDuration,
    optimalMaxDuration,
    subjects: subjectsWithMinutes.map(s => ({ name: s.name, minutes: s.minutesPerWeek }))
  });

  return {
    minDuration: Math.round(optimalMinDuration / 15) * 15, // Arredondar para múltiplos de 15
    maxDuration: Math.round(optimalMaxDuration / 15) * 15,
    reasoning: `Otimizado para ${selectedSubjects.length} disciplinas (${Math.round(minSubjectMinutes)}min - ${Math.round(maxSubjectMinutes)}min)`
  };
};
