
import { CycleWizardData } from '@/types/cycleWizard';
import { calculateWeightWithDifficulty, estimateBlocks } from './cycleOptimization';

export interface ValidationResult {
  isValid: boolean; 
  hasWarning: boolean;
  error?: string; 
  warning?: string;
  estimatedBlocks: number;
  canOptimize: boolean;
  optimalDurations?: { minDuration: number; maxDuration: number; reasoning: string };
}

export const validateCycleConfiguration = (wizardData: CycleWizardData): ValidationResult => {
  const selectedSubjects = wizardData.subjects.filter(s => s.isSelected);
  
  if (selectedSubjects.length === 0) {
    return { isValid: false, hasWarning: false, error: "Nenhuma disciplina selecionada", estimatedBlocks: 0, canOptimize: false };
  }

  // Calcular pesos finais com modificadores de dificuldade
  const totalAdjustedWeight = selectedSubjects.reduce((sum, subject) => 
    sum + calculateWeightWithDifficulty(subject.weight, subject.difficulty), 0
  );

  // Calcular distribuição inicial
  const subjectsWithHours = selectedSubjects.map(subject => {
    const adjustedWeight = calculateWeightWithDifficulty(subject.weight, subject.difficulty);
    const hoursPerWeek = (wizardData.weeklyHours * adjustedWeight / totalAdjustedWeight);
    return {
      ...subject,
      hoursPerWeek,
      minutesPerWeek: hoursPerWeek * 60
    };
  });

  // Estimar número de blocos
  const estimatedBlocks = estimateBlocks(subjectsWithHours, wizardData.weeklyHours, wizardData.minBlockDuration, wizardData.maxBlockDuration);
  
  // LIMITE ABSOLUTO: Máximo 80 blocos (isso bloqueia a criação)
  if (estimatedBlocks > 80) {
    return { 
      isValid: false, 
      hasWarning: false,
      error: "ATENÇÃO: Lógica de ciclo desconfigurada de forma extremamente desproporcional, o que inviabiliza sua geração. Ajuste os pesos de acordo.",
      estimatedBlocks,
      canOptimize: false
    };
  }

  // NOVA VALIDAÇÃO: Verificar se há mais de 6 disciplinas selecionadas
  if (selectedSubjects.length > 6) {
    return { 
      isValid: true, 
      hasWarning: true,
      warning: "Atenção: você tem mais de 6 disciplinas no ciclo. Caso sua carga horária semanal seja baixa, há possibilidade de a lógica do ciclo ser desproporcional. Para evitar desproporcionalidade, recomenda-se no máximo 6 disciplinas por vez por ciclo",
      estimatedBlocks,
      canOptimize: true
    };
  }

  // Verificar desproporção extrema (razão máxima 15:1) - AVISO
  const maxMinutes = Math.max(...subjectsWithHours.map(s => s.minutesPerWeek));
  const minValidMinutes = Math.max(...subjectsWithHours.map(s => s.minutesPerWeek > 0 ? s.minutesPerWeek : Infinity));
  const ratio = maxMinutes / minValidMinutes;
  
  // Verificar se alguma disciplina fica abaixo do tempo mínimo - AVISO
  const minMinutes = wizardData.minBlockDuration;
  const subjectsBelowMin = subjectsWithHours.filter(s => s.minutesPerWeek < minMinutes);
  
  // Verificar se tempo mínimo não é muito alto - AVISO
  const smallestSubjectMinutes = Math.min(...subjectsWithHours.map(s => s.minutesPerWeek));
  const minTooHigh = minMinutes > smallestSubjectMinutes * 0.4;

  const hasDisproportion = ratio > 15 || subjectsBelowMin.length > 0 || minTooHigh || estimatedBlocks > 60;

  if (hasDisproportion) {
    return { 
      isValid: true, 
      hasWarning: true,
      warning: "Atenção: a carga horária semanal com as proporções dos pesos das disciplinas selecionadas podem ficar desproporcionais. Isso acontece pois a carga horária semanal não suporta proporção correta das disciplinas e pesos escolhidos. Para talvez resolver isso, deixe a duração mínima por bloco em 30 minutos e a duração máxima em 2 horas e 30 minutos.",
      estimatedBlocks,
      canOptimize: true
    };
  }

  return { isValid: true, hasWarning: false, estimatedBlocks, canOptimize: false };
};

// New interface for cycle data validation
export interface CycleValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

import { Cycle } from '@/types/cycle';
import { isMultipleOf15 } from './timeUtils';

export const validateCycleData = (cycle: Cycle): CycleValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if studyBlocks exists and is an array
  if (!cycle.studyBlocks || !Array.isArray(cycle.studyBlocks)) {
    errors.push('O ciclo deve ter blocos de estudo válidos');
    return { isValid: false, errors, warnings };
  }

  // Check if cycle has at least one block
  if (cycle.studyBlocks.length === 0) {
    errors.push('O ciclo deve ter pelo menos um bloco de estudo');
  }

  // Check total minutes
  if (cycle.totalMinutes === 0) {
    errors.push('Tempo total do ciclo deve ser maior que zero');
  }

  // Calculate actual total from blocks
  const calculatedTotal = cycle.studyBlocks.reduce((sum, block) => sum + block.duration, 0);
  if (calculatedTotal !== cycle.totalMinutes) {
    warnings.push(`Tempo total calculado (${calculatedTotal}) difere do informado (${cycle.totalMinutes})`);
  }

  // Validate each block
  const persistentIds = new Set<string>();
  
  cycle.studyBlocks.forEach((block, index) => {
    // Check duration is multiple of 15
    if (!isMultipleOf15(block.duration)) {
      errors.push(`Bloco ${index + 1} tem duração inválida: ${block.duration} minutos (deve ser múltiplo de 15)`);
    }

    // Check persistentId
    if (!block.persistentId) {
      errors.push(`Bloco ${index + 1} não tem ID persistente`);
    } else if (persistentIds.has(block.persistentId)) {
      errors.push(`ID persistente duplicado: ${block.persistentId}`);
    } else {
      persistentIds.add(block.persistentId);
    }

    // Warn on very short blocks
    if (block.duration === 15) {
      warnings.push(`Bloco ${index + 1} tem duração muito curta (15 minutos)`);
    }

    // Warn on very long blocks
    if (block.duration >= 150) {
      warnings.push(`Bloco ${index + 1} tem duração muito longa (${block.duration} minutos)`);
    }
  });

  // Check subjects consistency
  if (cycle.subjects && Array.isArray(cycle.subjects)) {
    const subjectNames = new Set(cycle.subjects.map(s => s.name));
    const blockSubjects = new Set(cycle.studyBlocks.map(b => b.subject));

    // Check for subjects without blocks
    cycle.subjects.forEach(subject => {
      if (!blockSubjects.has(subject.name)) {
        warnings.push(`Disciplina ${subject.name} não tem blocos no ciclo`);
      }
    });

    // Check for blocks without corresponding subject
    cycle.studyBlocks.forEach(block => {
      if (!subjectNames.has(block.subject)) {
        warnings.push(`Bloco com disciplina ${block.subject} não está nas disciplinas do ciclo`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};
