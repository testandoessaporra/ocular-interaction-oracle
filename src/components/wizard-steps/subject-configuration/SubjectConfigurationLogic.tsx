
import { WizardStepProps } from '@/types/cycleWizard';

export const useSubjectConfigurationLogic = (data: WizardStepProps['data'], onDataChange: WizardStepProps['onDataChange']) => {
  const selectedSubjects = data.subjects.filter(subject => subject.isSelected);

  const handleWeightChange = (index: number, weight: number) => {
    const selectedIndex = data.subjects.findIndex((subject, i) => 
      subject.isSelected && data.subjects.filter((s, j) => j <= i && s.isSelected).length === index + 1
    );
    
    if (selectedIndex !== -1) {
      const updatedSubjects = [...data.subjects];
      updatedSubjects[selectedIndex] = { ...updatedSubjects[selectedIndex], weight };
      onDataChange({ subjects: updatedSubjects });
    }
  };

  const handleDifficultyChange = (index: number, difficulty: number) => {
    const selectedIndex = data.subjects.findIndex((subject, i) => 
      subject.isSelected && data.subjects.filter((s, j) => j <= i && s.isSelected).length === index + 1
    );
    
    if (selectedIndex !== -1) {
      const updatedSubjects = [...data.subjects];
      updatedSubjects[selectedIndex] = { 
        ...updatedSubjects[selectedIndex], 
        difficulty: difficulty as 1 | 2 | 3 | 4 | 5 
      };
      onDataChange({ subjects: updatedSubjects });
    }
  };

  return {
    selectedSubjects,
    handleWeightChange,
    handleDifficultyChange
  };
};
