
import { Slider } from '@/components/ui/slider';

interface WeightSliderProps {
  weight: number;
  onWeightChange: (value: number) => void;
}

const WeightSlider = ({ weight, onWeightChange }: WeightSliderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="tactical-body text-white font-medium">Peso</label>
        <span className="tactical-data-display text-yellow-400 text-lg">{weight}</span>
      </div>
      
      <div className="relative">
        <Slider
          value={[weight]}
          onValueChange={([value]) => onWeightChange(value)}
          min={1}
          max={50}
          step={1}
          className="w-full [&_.relative]:bg-gray-700 [&_.relative_.absolute]:bg-yellow-400 [&_.block]:bg-yellow-400 [&_.block]:border-yellow-400"
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-400">
        <span>1</span>
        <span>25</span>
        <span>50</span>
      </div>
    </div>
  );
};

export default WeightSlider;
