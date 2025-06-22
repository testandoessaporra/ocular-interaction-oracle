
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
;
import { ExtendedSubject } from '@/types/cycleWizard';
import { BookOpen, AlertTriangle } from '@/components/icons';

interface ValidationResult {
  isValid: boolean;
  hasWarning: boolean;
  error?: string;
  warning?: string;
  estimatedBlocks?: number;
}

interface ConfigurationSummaryProps {
  weeklyHours: number;
  minBlockDuration: number;
  maxBlockDuration: number;
  subjects: ExtendedSubject[];
  validation: ValidationResult;
}

const ConfigurationSummary = ({
  weeklyHours,
  minBlockDuration,
  maxBlockDuration,
  subjects,
  validation
}: ConfigurationSummaryProps) => {
  const hasError = !validation.isValid;
  const hasWarning = validation.hasWarning;

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h${mins}min`;
  };

  return (
    <Card className={`tactical-card ${hasError ? 'border-red-500/30' : hasWarning ? 'border-yellow-500/30' : 'border-green-500/30'}`}>
      <CardHeader className="pb-3">
        <CardTitle className={`tactical-subtitle text-sm flex items-center gap-2 ${hasError ? 'text-red-400' : hasWarning ? 'text-yellow-400' : 'text-green-400'}`}>
          <BookOpen className="w-4 h-4 flex-shrink-0" />
          {hasError ? 'Configuração Inválida' : hasWarning ? 'Configuração com Avisos' : 'Configuração Otimizada'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-center">
          <div className="space-y-1">
            <div className="text-lg font-bold text-white tactical-data-display">
              {weeklyHours}h
            </div>
            <div className="text-gray-400 tactical-label text-xs">Por Semana</div>
          </div>
          <div className="space-y-1">
            <div className={`text-lg font-bold tactical-data-display ${hasError ? 'text-red-400' : hasWarning ? 'text-yellow-400' : 'text-green-400'}`}>
              {hasError ? '❌' : validation.estimatedBlocks}
            </div>
            <div className="text-gray-400 tactical-label text-xs">Blocos Estimados</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-green-400 tactical-data-display">
              {formatDuration(minBlockDuration)}
            </div>
            <div className="text-gray-400 tactical-label text-xs">Mínimo</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-blue-400 tactical-data-display">
              {formatDuration(maxBlockDuration)}
            </div>
            <div className="text-gray-400 tactical-label text-xs">Máximo</div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Badge variant="outline" className={`text-xs ${hasError ? 'bg-red-900/30 text-red-400 border-red-600/30' : hasWarning ? 'bg-yellow-900/30 text-yellow-400 border-yellow-600/30' : 'bg-green-900/30 text-green-400 border-green-600/30'}`}>
            {subjects.filter(s => s.isSelected).length} disciplinas selecionadas
          </Badge>
        </div>

        {validation.estimatedBlocks && validation.estimatedBlocks > 60 && !hasError && !hasWarning && (
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-3 h-3 text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-300 text-xs">
                ⚠️ Muitos blocos estimados ({validation.estimatedBlocks}). Considere ajustar a configuração.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConfigurationSummary;
