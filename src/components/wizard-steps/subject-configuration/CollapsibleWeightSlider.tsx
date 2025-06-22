
import { useState } from 'react';
;
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Settings } from '@/components/icons';

interface CollapsibleWeightSliderProps {
  weight: number;
  onWeightChange: (value: number) => void;
}

const CollapsibleWeightSlider = ({ weight, onWeightChange }: CollapsibleWeightSliderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-2">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <label className="tactical-body text-white font-medium text-sm">Peso</label>
          <div className="flex items-center gap-2">
            <span className="tactical-data-display text-yellow-400 text-base">{weight}</span>
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="p-1 bg-gray-700/50 rounded-lg border border-gray-600/50 hover:border-yellow-400/50 hover:bg-yellow-400/10 transition-all duration-200"
              >
                <Settings className="w-3 h-3 text-gray-400 hover:text-yellow-400" />
              </button>
            </CollapsibleTrigger>
          </div>
        </div>
        
        <CollapsibleContent className="space-y-2">
          <div className="relative pt-1">
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
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default CollapsibleWeightSlider;
