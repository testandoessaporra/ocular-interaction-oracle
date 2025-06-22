
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
;
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Target, HelpCircle } from '@/components/icons';

interface BlockDurationSectionProps {
  minBlockDuration: number;
  maxBlockDuration: number;
  onMinDurationChange: (duration: number) => void;
  onMaxDurationChange: (duration: number) => void;
}

const BlockDurationSection = ({
  minBlockDuration,
  maxBlockDuration,
  onMinDurationChange,
  onMaxDurationChange
}: BlockDurationSectionProps) => {
  const minDurationOptions = [30, 45, 60, 75, 90];
  const maxDurationOptions = [90, 105, 120, 135, 150];

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h${mins}min`;
  };

  return (
    <div className="grid gap-4">
      {/* Min Duration */}
      <Card className="tactical-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-white tactical-subtitle text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-green-400 flex-shrink-0" />
            Duração Mínima (Padrão: 30min)
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="w-3 h-3 text-gray-400 hover:text-white cursor-help flex-shrink-0" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Tamanho mínimo de um bloco de estudos. Sempre múltiplo de 15 minutos. Recomendado manter o padrão.</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
            {minDurationOptions.map((duration) => (
              <button
                key={duration}
                onClick={() => onMinDurationChange(duration)}
                className={`
                  p-1.5 rounded-lg border transition-all duration-300 tactical-element text-xs
                  ${minBlockDuration === duration
                    ? 'bg-green-500/20 border-green-500 text-green-400'
                    : 'bg-gray-800/50 border-gray-600 text-white hover:border-green-500/50'
                  }
                `}
              >
                {formatDuration(duration)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Max Duration */}
      <Card className="tactical-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-white tactical-subtitle text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-400 flex-shrink-0" />
            Duração Máxima (Padrão: 2h30min)
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="w-3 h-3 text-gray-400 hover:text-white cursor-help flex-shrink-0" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Tamanho máximo de um bloco de estudos. Sempre múltiplo de 15 minutos. Recomendado manter o padrão.</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
            {maxDurationOptions
              .filter(duration => duration >= minBlockDuration)
              .map((duration) => (
                <button
                  key={duration}
                  onClick={() => onMaxDurationChange(duration)}
                  className={`
                    p-1.5 rounded-lg border transition-all duration-300 tactical-element text-xs
                    ${maxBlockDuration === duration
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                      : 'bg-gray-800/50 border-gray-600 text-white hover:border-blue-500/50'
                    }
                  `}
                >
                  {formatDuration(duration)}
                </button>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockDurationSection;
