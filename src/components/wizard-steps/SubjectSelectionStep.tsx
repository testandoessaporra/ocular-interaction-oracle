
import { WizardStepProps, ExtendedSubject } from '@/types/cycleWizard';
import { EXAM_SUBJECTS } from '@/constants/examData';
import { ScrollArea } from '@/components/ui/scroll-area';
import SubjectCard from './subject-selection/SubjectCard';
import AddCustomSubjectCard from './subject-selection/AddCustomSubjectCard';
import SubjectSelectionHeader from './subject-selection/SubjectSelectionHeader';
import SubjectSelectionFooter from './subject-selection/SubjectSelectionFooter';

const SubjectSelectionStep = ({ data, onDataChange }: WizardStepProps) => {
  // Inicializar disciplinas se ainda não foram carregadas
  if (data.subjects.length === 0 && data.selectedExam) {
    const examSubjects = EXAM_SUBJECTS[data.selectedExam as keyof typeof EXAM_SUBJECTS] || [];
    const initialSubjects: ExtendedSubject[] = examSubjects.map(subject => ({
      name: subject.name,
      weight: subject.questions, // Usando questions como weight (peso = questões)
      difficulty: 3 as 1 | 2 | 3 | 4 | 5,
      isSelected: true // Todas selecionadas por padrão
    }));
    
    onDataChange({ subjects: initialSubjects });
  }

  const handleSubjectToggle = (index: number) => {
    const updatedSubjects = data.subjects.map((subject, i) => 
      i === index ? { ...subject, isSelected: !subject.isSelected } : subject
    );
    onDataChange({ subjects: updatedSubjects });
  };

  const handleAddCustomSubject = (newSubject: ExtendedSubject) => {
    onDataChange({ 
      subjects: [...data.subjects, newSubject] 
    });
  };

  const handleRemoveCustomSubject = (index: number) => {
    const updatedSubjects = data.subjects.filter((_, i) => i !== index);
    onDataChange({ subjects: updatedSubjects });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header fixo */}
      <div className="flex-shrink-0 mb-6">
        <SubjectSelectionHeader />
      </div>

      {/* Área scrollável */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full tactical-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-6xl mx-auto p-4">
            {data.subjects.map((subject, index) => (
              <SubjectCard
                key={index}
                subject={subject}
                index={index}
                onToggle={handleSubjectToggle}
                onRemove={handleRemoveCustomSubject}
              />
            ))}

            <AddCustomSubjectCard onAdd={handleAddCustomSubject} />
          </div>
        </ScrollArea>
      </div>

      {/* Footer fixo */}
      <div className="flex-shrink-0 mt-6">
        <SubjectSelectionFooter subjects={data.subjects} />
      </div>
    </div>
  );
};

export default SubjectSelectionStep;
