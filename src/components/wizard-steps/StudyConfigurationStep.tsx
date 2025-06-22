
import React from 'react';
import { WizardStepProps } from '@/types/cycleWizard';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { validateCycleConfiguration } from '@/utils/cycleValidation';
import ConfigurationHeader from './study-configuration/ConfigurationHeader';
import ValidationAlert from './study-configuration/ValidationAlert';
import WeeklyHoursSection from './study-configuration/WeeklyHoursSection';
import AverageDurationSection from './study-configuration/AverageDurationSection';
import ConfigurationSummary from './study-configuration/ConfigurationSummary';
import { DURATION_RANGES } from './study-configuration/DurationRangeSelector';

const StudyConfigurationStep: React.FC<WizardStepProps> = ({
  data,
  onDataChange
}) => {
  const handleWeeklyHoursChange = (hours: number) => {
    onDataChange({ weeklyHours: hours });
  };

  // Determinar o range atual baseado nos valores min/max
  const getCurrentRange = (): 'short' | 'medium' | 'long' => {
    const currentMin = data.minBlockDuration;
    const currentMax = data.maxBlockDuration;
    
    // Buscar o range que corresponde aos valores atuais
    const matchingRange = DURATION_RANGES.find(range => 
      range.minDuration === currentMin && range.maxDuration === currentMax
    );
    
    return matchingRange?.id || 'medium'; // default para médio
  };

  const handleRangeChange = (rangeId: 'short' | 'medium' | 'long') => {
    const selectedRange = DURATION_RANGES.find(r => r.id === rangeId);
    if (selectedRange) {
      onDataChange({ 
        minBlockDuration: selectedRange.minDuration,
        maxBlockDuration: selectedRange.maxDuration 
      });
    }
  };

  const currentRange = getCurrentRange();

  // Validar configuração atual
  const validation = validateCycleConfiguration(data);

  return (
    <div className="h-full flex flex-col">
      {/* Header fixo */}
      <div className="flex-shrink-0 mb-6">
        <ConfigurationHeader />
      </div>

      {/* Área scrollável */}
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full tactical-scrollbar">
          <TooltipProvider>
            <div className="space-y-6 pb-6 max-w-6xl mx-auto p-4">
              <ValidationAlert validation={validation} />

              <WeeklyHoursSection 
                weeklyHours={data.weeklyHours}
                onHoursChange={handleWeeklyHoursChange}
              />

              <AverageDurationSection
                selectedRange={currentRange}
                onRangeChange={handleRangeChange}
              />

              <ConfigurationSummary
                weeklyHours={data.weeklyHours}
                minBlockDuration={data.minBlockDuration}
                maxBlockDuration={data.maxBlockDuration}
                subjects={data.subjects}
                validation={validation}
              />
            </div>
          </TooltipProvider>
        </ScrollArea>
      </div>
    </div>
  );
};

export default StudyConfigurationStep;
