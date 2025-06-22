
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
;
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import DurationRangeSelector, { DURATION_RANGES } from './DurationRangeSelector';
import { Settings, Info } from '@/components/icons';

interface AverageDurationSectionProps {
  selectedRange: 'short' | 'medium' | 'long';
  onRangeChange: (range: 'short' | 'medium' | 'long') => void;
}

const AverageDurationSection = ({ selectedRange, onRangeChange }: AverageDurationSectionProps) => {
  const currentRange = DURATION_RANGES.find(r => r.id === selectedRange);

  return (
    <Card className="tactical-card border-blue-600/20">
      <CardHeader>
        <CardTitle className="tactical-title text-lg flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          Configuração de Duração dos Blocos
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>
                Ranges maiores oferecem mais flexibilidade para o algoritmo criar blocos variados 
                e melhorar a intercalação entre disciplinas.
              </p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DurationRangeSelector 
          selectedRange={selectedRange}
          onRangeChange={onRangeChange}
        />
        
        {currentRange && (
          <div className="mt-4 bg-gray-800/50 rounded-lg p-3">
            <div className="text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Range Selecionado:</span>
                <span className="text-blue-400 font-medium">
                  {currentRange.name} ({currentRange.minDuration}-{currentRange.maxDuration} min)
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AverageDurationSection;
