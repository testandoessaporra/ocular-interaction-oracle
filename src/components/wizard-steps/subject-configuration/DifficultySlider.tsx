
import { Slider } from '@/components/ui/slider';

interface DifficultySliderProps {
  difficulty: 1 | 2 | 3 | 4 | 5;
  onDifficultyChange: (value: number) => void;
}

const DifficultySlider = ({ difficulty, onDifficultyChange }: DifficultySliderProps) => {
  const difficultyLabels = {
    1: { label: 'Dificuldade Extrema', color: 'text-red-400', modifier: '+100%' },
    2: { label: 'Difícil', color: 'text-orange-400', modifier: '+50%' },
    3: { label: 'Normal', color: 'text-yellow-400', modifier: '0%' },
    4: { label: 'Já tenho base', color: 'text-green-400', modifier: '-25%' },
    5: { label: 'Já domino', color: 'text-blue-400', modifier: '-60%' }
  };

  const difficultyInfo = difficultyLabels[difficulty];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="tactical-body text-white font-medium text-sm">Nível de Domínio</label>
        <div className="text-right">
          <div className={`tactical-data-display text-xs ${difficultyInfo.color}`}>
            {difficultyInfo.label}
          </div>
          <div className="text-xs text-gray-400">
            {difficultyInfo.modifier}
          </div>
        </div>
      </div>
      
      <div className="relative">
        <Slider
          value={[difficulty]}
          onValueChange={([value]) => onDifficultyChange(value)}
          min={1}
          max={5}
          step={1}
          className="w-full [&_.relative]:bg-gray-700 [&_.relative_.absolute]:bg-gradient-to-r [&_.relative_.absolute]:from-red-400 [&_.relative_.absolute]:via-yellow-400 [&_.relative_.absolute]:to-blue-400 [&_.block]:bg-white [&_.block]:border-white"
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-400">
        <span>Extrema</span>
        <span>Normal</span>
        <span>Domino</span>
      </div>
    </div>
  );
};

export default DifficultySlider;
