
import { Card, CardContent } from '@/components/ui/card';
;
import { ExtendedSubject } from '@/types/cycleWizard';
import CollapsibleWeightSlider from './CollapsibleWeightSlider';
import DifficultySlider from './DifficultySlider';
import WeightIndicator from './WeightIndicator';
import { Settings } from '@/components/icons';

interface SubjectConfigurationCardProps {
  subject: ExtendedSubject;
  index: number;
  onWeightChange: (index: number, weight: number) => void;
  onDifficultyChange: (index: number, difficulty: number) => void;
}

const SubjectConfigurationCard = ({ 
  subject, 
  index, 
  onWeightChange, 
  onDifficultyChange 
}: SubjectConfigurationCardProps) => {
  return (
    <Card className="bg-gray-800/50 border-gray-600/50">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Subject Header */}
          <div className="flex items-center gap-2">
            <div className="p-1 bg-yellow-400/20 rounded-lg border border-yellow-400/30">
              <Settings className="w-3 h-3 text-yellow-400" />
            </div>
            <h4 className="tactical-element text-sm text-white">{subject.name}</h4>
          </div>

          {/* Sliders in vertical layout for better spacing */}
          <div className="space-y-4">
            {/* Collapsible Weight Slider */}
            <CollapsibleWeightSlider
              weight={subject.weight}
              onWeightChange={(weight) => onWeightChange(index, weight)}
            />

            {/* Difficulty Slider */}
            <DifficultySlider
              difficulty={subject.difficulty}
              onDifficultyChange={(difficulty) => onDifficultyChange(index, difficulty)}
            />
          </div>

          {/* Weight Indicator with more spacing */}
          <div className="pt-1">
            <WeightIndicator
              weight={subject.weight}
              difficulty={subject.difficulty}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectConfigurationCard;
