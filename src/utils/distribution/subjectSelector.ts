
import { logger } from '@/utils/logger';
import { SubjectData } from '../blockTypes';

export interface SubjectSelectionResult {
  selectedSubject: SubjectData | null;
  subjectIndex: number;
}

export interface SelectionState {
  lastSubjectIndex: number;
  consecutiveCount: number;
}

// ALGORITMO ULTRA-SIMPLIFICADO: Máximo 2 blocos consecutivos + Round-Robin
export const selectNextSubject = (
  subjects: SubjectData[],
  selectionState: SelectionState,
  minDuration: number
): SubjectSelectionResult => {
  logger.info(`🎯 Seleção ULTRA-SIMPLIFICADA:`, {
    lastSubject: subjects[selectionState.lastSubjectIndex]?.name,
    consecutiveCount: selectionState.consecutiveCount,
    availableSubjects: subjects.filter(s => s.remainingMinutes >= minDuration).map(s => s.name)
  });

  // Encontrar disciplinas disponíveis
  const availableSubjects = subjects
    .map((subject, index) => ({ subject, index }))
    .filter(({ subject }) => subject.remainingMinutes >= minDuration);

  if (availableSubjects.length === 0) {
    logger.info(`❌ Nenhuma disciplina disponível`);
    return {
      selectedSubject: null,
      subjectIndex: selectionState.lastSubjectIndex
    };
  }

  // Se só há uma disciplina, usar ela
  if (availableSubjects.length === 1) {
    const onlyAvailable = availableSubjects[0];
    logger.info(`➡️ Única disciplina disponível: ${onlyAvailable.subject.name}`);
    return {
      selectedSubject: onlyAvailable.subject,
      subjectIndex: onlyAvailable.index
    };
  }

  // REGRA PRINCIPAL: Máximo 2 blocos consecutivos
  const currentSubject = subjects[selectionState.lastSubjectIndex];
  const shouldForceChange = selectionState.consecutiveCount >= 2;

  if (shouldForceChange && currentSubject) {
    logger.info(`🔄 FORÇANDO mudança após ${selectionState.consecutiveCount} blocos de ${currentSubject.name}`);
    
    // Buscar próxima disciplina diferente na sequência circular
    let nextIndex = (selectionState.lastSubjectIndex + 1) % subjects.length;
    let attempts = 0;

    while (attempts < subjects.length) {
      const candidate = subjects[nextIndex];
      
      if (nextIndex !== selectionState.lastSubjectIndex && candidate.remainingMinutes >= minDuration) {
        logger.info(`✅ Próxima disciplina encontrada: ${candidate.name} (índice ${nextIndex})`);
        return {
          selectedSubject: candidate,
          subjectIndex: nextIndex
        };
      }
      
      nextIndex = (nextIndex + 1) % subjects.length;
      attempts++;
    }
  }

  // ROUND-ROBIN SIMPLES: Próxima disciplina na sequência
  let nextIndex = (selectionState.lastSubjectIndex + 1) % subjects.length;
  let attempts = 0;

  while (attempts < subjects.length) {
    const candidate = subjects[nextIndex];
    
    if (candidate.remainingMinutes >= minDuration) {
      logger.info(`🔄 Round-robin: ${candidate.name} (índice ${nextIndex})`);
      return {
        selectedSubject: candidate,
        subjectIndex: nextIndex
      };
    }
    
    nextIndex = (nextIndex + 1) % subjects.length;
    attempts++;
  }

  // Fallback: primeira disciplina disponível
  const firstAvailable = availableSubjects[0];
  logger.info(`⚠️ Fallback: ${firstAvailable.subject.name}`);
  return {
    selectedSubject: firstAvailable.subject,
    subjectIndex: firstAvailable.index
  };
};
