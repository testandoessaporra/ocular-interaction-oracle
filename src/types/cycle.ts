
export interface Cycle {
  examName: string;
  weeklyHours: number;
  subjects: Subject[];
  studyBlocks: StudyBlock[];
  createdAt: string;
}

export interface Subject {
  name: string;
  difficulty: 'Alta' | 'Média' | 'Baixa';
  hoursPerWeek: number;
  weight: number;
}

export interface StudyBlock {
  id: string; // ID único persistente
  persistentId: string; // ID baseado na matéria e posição original
  subject: string;
  duration: number;
  blockNumber: number;
}

export interface CycleCreatorProps {
  onClose: () => void;
  onCycleCreated: (cycle: Cycle) => void;
  initialData?: Partial<Cycle>;
}
