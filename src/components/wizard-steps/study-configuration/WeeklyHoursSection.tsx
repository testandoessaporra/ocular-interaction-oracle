
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Clock } from '@/components/icons';
;

interface WeeklyHoursSectionProps {
  weeklyHours: number;
  onHoursChange: (hours: number) => void;
}

const WeeklyHoursSection = ({ weeklyHours, onHoursChange }: WeeklyHoursSectionProps) => {
  const weeklyHourOptions = [5, 10, 15, 20, 25, 30, 35, 40];

  const handleWeeklyHoursChange = (hours: number) => {
    if (hours >= 1 && hours <= 50) {
      onHoursChange(hours);
    }
  };

  const handleCustomHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 50) {
      handleWeeklyHoursChange(value);
    } else if (e.target.value === '') {
      onHoursChange(1);
    }
  };

  return (
    <Card className="tactical-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-white tactical-subtitle text-base flex items-center gap-2">
          <Clock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
          Horas Semanais de Estudo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {/* Quick Options */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {weeklyHourOptions.map((hours) => (
            <button
              key={hours}
              onClick={() => handleWeeklyHoursChange(hours)}
              className={`
                p-2 rounded-lg border transition-all duration-300 tactical-element text-xs
                ${weeklyHours === hours
                  ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                  : 'bg-gray-800/50 border-gray-600 text-white hover:border-yellow-500/50'
                }
              `}
            >
              {hours}h
            </button>
          ))}
        </div>
        
        {/* Custom Input */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 pt-1">
          <span className="text-white tactical-body text-xs">Ou digite:</span>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              max="50"
              value={weeklyHours}
              onChange={handleCustomHoursChange}
              className="w-20 bg-gray-800/50 border-gray-600 text-white text-center text-sm"
              placeholder="h"
            />
            <span className="text-gray-400 tactical-body text-xs">(máx. 50h)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyHoursSection;
