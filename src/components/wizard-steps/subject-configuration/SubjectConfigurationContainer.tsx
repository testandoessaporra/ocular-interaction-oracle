
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExtendedSubject } from '@/types/cycleWizard';
import SubjectConfigurationCard from './SubjectConfigurationCard';
import React from 'react';

interface SubjectConfigurationContainerProps {
  selectedSubjects: ExtendedSubject[];
  onWeightChange: (index: number, weight: number) => void;
  onDifficultyChange: (index: number, difficulty: number) => void;
}

const SubjectConfigurationContainer = React.memo(({ 
  selectedSubjects, 
  onWeightChange, 
  onDifficultyChange 
}: SubjectConfigurationContainerProps) => {
  return (
    <ScrollArea className="h-full tactical-scrollbar">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 max-w-6xl mx-auto p-4">
        {selectedSubjects.map((subject, index) => (
          <SubjectConfigurationCard
            key={`${subject.name}-${index}`}
            subject={subject}
            index={index}
            onWeightChange={onWeightChange}
            onDifficultyChange={onDifficultyChange}
          />
        ))}
      </div>
    </ScrollArea>
  );
});

SubjectConfigurationContainer.displayName = 'SubjectConfigurationContainer';

export default SubjectConfigurationContainer;
