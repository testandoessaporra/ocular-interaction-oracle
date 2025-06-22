
import React from 'react';

interface TimerDisplayProps {
  studyTime: number;
  pauseTime: number;
  formatTime: (seconds: number) => string;
  compact?: boolean;
  isCountdown?: boolean;
  initialDuration?: number;
}

const TimerDisplay = ({ 
  studyTime, 
  pauseTime, 
  formatTime, 
  compact = false, 
  isCountdown = false, 
  initialDuration = 0 
}: TimerDisplayProps) => {
  // Calcular progresso estudado real para countdown
  const actualStudyTime = isCountdown ? initialDuration - studyTime : studyTime;
  
  if (compact) {
    return (
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          {isCountdown && (
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
          )}
          <div className={`tactical-data-display text-xl ${isCountdown ? 'text-orange-400' : 'text-yellow-400'}`}>
            {formatTime(studyTime)}
          </div>
        </div>
        {pauseTime > 0 && (
          <div className="tactical-label text-xs text-gray-400">
            Pausa: {formatTime(pauseTime)}
          </div>
        )}
        {isCountdown && actualStudyTime > 0 && (
          <div className="tactical-label text-xs text-green-400">
            Estudado: {formatTime(actualStudyTime)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      {/* Cronômetro principal */}
      <div>
        <div className="flex items-center justify-center gap-3 mb-2">
          {isCountdown && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse" />
              <span className="tactical-label text-sm text-orange-400">REGRESSIVO</span>
            </div>
          )}
          {!isCountdown && (
            <div className="tactical-label text-sm text-gray-400">TEMPO DE ESTUDO</div>
          )}
        </div>
        <div className={`tactical-data-display text-6xl font-mono tracking-wider ${isCountdown ? 'text-orange-400' : 'text-yellow-400'}`}>
          {formatTime(studyTime)}
        </div>
        {isCountdown && studyTime === 0 && (
          <div className="tactical-label text-sm text-red-400 mt-2 animate-pulse">
            ⏰ TEMPO ESGOTADO!
          </div>
        )}
      </div>

      {/* Tempo estudado real (para countdown) */}
      {isCountdown && actualStudyTime > 0 && (
        <div>
          <div className="tactical-label text-xs text-gray-500 mb-1">TEMPO ESTUDADO</div>
          <div className="tactical-data-display text-xl text-green-400 font-mono">
            {formatTime(actualStudyTime)}
          </div>
        </div>
      )}

      {/* Cronômetro de pausa */}
      {pauseTime > 0 && (
        <div>
          <div className="tactical-label text-xs text-gray-500 mb-1">TEMPO EM PAUSA</div>
          <div className="tactical-data-display text-xl text-gray-400 font-mono">
            {formatTime(pauseTime)}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerDisplay;
