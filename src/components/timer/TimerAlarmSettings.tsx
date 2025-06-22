
import React from 'react';
import { Bell, BellOff } from '@/components/icons';
;

interface TimerAlarmSettingsProps {
  isEnabled: boolean;
  interval: number;
  onToggle: () => void;
  onIntervalChange: (minutes: number) => void;
}

const TimerAlarmSettings = ({ isEnabled, interval, onToggle, onIntervalChange }: TimerAlarmSettingsProps) => {
  return (
    <div className="tactical-card-enhanced rounded-xl p-4 tactical-border-subtle">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isEnabled ? (
            <Bell className="w-4 h-4 text-tactical-gold tactical-pulse" />
          ) : (
            <BellOff className="w-4 h-4 text-tactical-disabledGray" />
          )}
          <span className="tactical-label text-sm text-gray-300">ALARME TÁTICO</span>
        </div>
        
        <button
          onClick={onToggle}
          className={`w-12 h-6 rounded-full transition-all duration-200 ${
            isEnabled 
              ? 'bg-tactical-gold tactical-shadow-gold' 
              : 'bg-tactical-disabledGray'
          }`}
        >
          <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
            isEnabled ? 'translate-x-7' : 'translate-x-1'
          }`} />
        </button>
      </div>

      {isEnabled && (
        <div className="flex items-center gap-3">
          <span className="tactical-body text-sm text-gray-400">Alerta a cada</span>
          <input
            type="number"
            min="1"
            max="120"
            value={interval}
            onChange={(e) => onIntervalChange(Number(e.target.value))}
            className="w-16 tactical-input-enhanced rounded-lg px-2 py-1 text-sm text-center"
          />
          <span className="tactical-body text-sm text-gray-400">minutos</span>
        </div>
      )}
    </div>
  );
};

export default TimerAlarmSettings;
