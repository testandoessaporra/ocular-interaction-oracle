import { TrendingUp } from '@/components/icons';


;

interface WeightIndicatorProps {
  weight: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
}

const WeightIndicator = ({ weight, difficulty }: WeightIndicatorProps) => {
  const calculateFinalWeight = () => {
    switch (difficulty) {
      case 1: return Math.round(weight * 2);
      case 2: return Math.round(weight * 1.5);
      case 3: return weight;
      case 4: return Math.round(weight * 0.75);
      case 5: return Math.round(weight * 0.4);
      default: return weight;
    }
  };

  const finalWeight = calculateFinalWeight();
  const progressPercentage = Math.min(100, (finalWeight / 50) * 100);

  return (
    <div className="p-2 bg-gray-900/50 rounded-lg border border-gray-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-3 h-3 text-yellow-400" />
          <span className="text-xs tactical-body text-gray-300">Peso Final:</span>
        </div>
        <span className="tactical-data-display text-yellow-400 text-sm">
          {finalWeight}
        </span>
      </div>
      <div className="mt-1">
        <div className="bg-gray-800 rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default WeightIndicator;
