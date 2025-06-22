
import { SubjectData } from '../blockTypes';
import { SelectionState } from './subjectSelector';

/**
 * Seleciona a próxima disciplina priorizando a alternância.
 * @returns O índice da disciplina selecionada. Retorna -1 se nenhuma for encontrada.
 */
export const selectNextAndAlternateSubject = (
  subjects: SubjectData[],
  selectionState: SelectionState,
  minDuration: number
): number => {
  const availableSubjects = subjects
    .map((subject, index) => ({ subject, index }))
    .filter(({ subject }) => subject.remainingMinutes >= minDuration);

  if (availableSubjects.length === 0) {
    return -1; // Nenhuma disciplina disponível
  }

  // Tenta encontrar uma disciplina DIFERENTE da última usada
  const alternativeSubjects = availableSubjects.filter(
    ({ index }) => index !== selectionState.lastSubjectIndex
  );

  if (alternativeSubjects.length > 0) {
    // Se há alternativas, escolhe a com mais tempo restante para maximizar a intercalação
    alternativeSubjects.sort((a, b) => b.subject.remainingMinutes - a.subject.remainingMinutes);
    return alternativeSubjects[0].index;
  }

  // Se não há alternativas, a única opção é repetir a última disciplina (ou a única que sobrou)
  if (availableSubjects.length > 0) {
    return availableSubjects[0].index;
  }

  return -1; // Nenhuma opção
};
