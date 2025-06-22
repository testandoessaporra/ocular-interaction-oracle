
import { WizardStepProps } from '@/types/cycleWizard';
import SubjectConfigurationHeader from './subject-configuration/SubjectConfigurationHeader';
import SubjectConfigurationContainer from './subject-configuration/SubjectConfigurationContainer';
import { useSubjectConfigurationLogic } from './subject-configuration/SubjectConfigurationLogic';

const SubjectConfigurationStep = ({ data, onDataChange }: WizardStepProps) => {
  const { selectedSubjects, handleWeightChange, handleDifficultyChange } = useSubjectConfigurationLogic(data, onDataChange);

  return (
    <div className="h-full flex flex-col">
      {/* Header fixo */}
      <div className="flex-shrink-0 mb-6">
        <SubjectConfigurationHeader />
      </div>

      {/* Área scrollável */}
      <div className="flex-1 min-h-0">
        <SubjectConfigurationContainer
          selectedSubjects={selectedSubjects}
          onWeightChange={handleWeightChange}
          onDifficultyChange={handleDifficultyChange}
        />
      </div>
    </div>
  );
};

export default SubjectConfigurationStep;
