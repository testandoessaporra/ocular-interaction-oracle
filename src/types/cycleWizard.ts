
export interface ExtendedSubject {
  name: string;
  weight: number;
  difficulty: 1 | 2 | 3 | 4 | 5; // 1: Extrema, 2: Difícil, 3: Normal, 4: Base, 5: Domino
  isSelected: boolean;
  isCustom?: boolean;
}

export interface CycleWizardData {
  selectedExam: string;
  subjects: ExtendedSubject[];
  weeklyHours: number;
  minBlockDuration: number; // em minutos
  maxBlockDuration: number; // em minutos
}

export interface WizardStepProps {
  data: CycleWizardData;
  onDataChange: (data: Partial<CycleWizardData>) => void;
  onNext: () => void;
  onPrev: () => void;
  currentStep: number;
  totalSteps: number;
}
