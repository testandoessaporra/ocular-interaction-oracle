
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Zap, Target } from '@/components/icons';
;

interface DurationRange {
  id: 'short' | 'medium' | 'long';
  name: string;
  description: string;
  minDuration: number;
  maxDuration: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const DURATION_RANGES: DurationRange[] = [
  {
    id: 'short',
    name: 'CURTA',
    description: 'Blocos rápidos e dinâmicos',
    minDuration: 30,
    maxDuration: 75,
    icon: Zap,
    color: 'border-green-500/50 bg-green-900/20 hover:bg-green-900/30'
  },
  {
    id: 'medium',
    name: 'MÉDIA',
    description: 'Equilíbrio ideal',
    minDuration: 45,
    maxDuration: 105,
    icon: Target,
    color: 'border-yellow-500/50 bg-yellow-900/20 hover:bg-yellow-900/30'
  },
  {
    id: 'long',
    name: 'LONGA',
    description: 'Imersão profunda',
    minDuration: 60,
    maxDuration: 135,
    icon: Clock,
    color: 'border-blue-500/50 bg-blue-900/20 hover:bg-blue-900/30'
  }
];

interface DurationRangeSelectorProps {
  selectedRange: 'short' | 'medium' | 'long';
  onRangeChange: (range: 'short' | 'medium' | 'long') => void;
}

const formatDurationRange = (min: number, max: number): string => {
  const formatSingle = (minutes: number): string => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (mins === 0) return `${hours}:00`;
      return `${hours}:${mins.toString().padStart(2, '0')}`;
    }
    return `${minutes}min`;
  };

  return `${formatSingle(min)} - ${formatSingle(max)}`;
};

const DurationRangeSelector = ({ selectedRange, onRangeChange }: DurationRangeSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="tactical-title text-lg text-blue-400 mb-2">
          Escolha o Range de Duração dos Blocos
        </h3>
        <p className="text-sm text-gray-400">
          Ranges maiores oferecem mais flexibilidade para o algoritmo de intercalação
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DURATION_RANGES.map((range) => {
          const Icon = range.icon;
          const isSelected = selectedRange === range.id;
          
          return (
            <Card
              key={range.id}
              className={`
                cursor-pointer transition-all duration-200 border-2
                ${isSelected 
                  ? `${range.color} ring-2 ring-offset-2 ring-offset-gray-900 ring-opacity-50` 
                  : 'border-gray-700 bg-gray-800/50 hover:bg-gray-800/70'
                }
              `}
              onClick={() => onRangeChange(range.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="flex flex-col items-center space-y-3">
                  <Icon className={`w-8 h-8 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                  
                  <div>
                    <h4 className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                      {range.name}
                    </h4>
                    <p className={`text-xs ${isSelected ? 'text-gray-200' : 'text-gray-500'}`}>
                      {range.description}
                    </p>
                  </div>
                  
                  <div className={`text-lg font-mono font-bold ${isSelected ? 'text-yellow-400' : 'text-gray-400'}`}>
                    {formatDurationRange(range.minDuration, range.maxDuration)}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedRange && (
        <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400">
            <strong>Estratégia:</strong> Tender ao máximo do range para reduzir blocos e facilitar intercalação.
          </p>
        </div>
      )}
    </div>
  );
};

export default DurationRangeSelector;
export { DURATION_RANGES };
