
import React from 'react';
import { Play, Pause, Square, Minimize2 } from '@/components/icons';
;

interface TimerControlsProps {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onMinimize?: () => void;
  compact?: boolean;
}

const TimerControls = ({ 
  isRunning, 
  isPaused, 
  onStart, 
  onPause, 
  onStop, 
  onMinimize,
  compact = false 
}: TimerControlsProps) => {
  const buttonSize = compact ? "w-10 h-10" : "w-14 h-14";
  const iconSize = compact ? "w-5 h-5" : "w-6 h-6";

  return (
    <div className={`flex items-center justify-center gap-4 ${compact ? 'gap-2' : 'gap-6'}`}>
      {/* Botão Play/Pause */}
      {!isRunning ? (
        <button
          onClick={onStart}
          className={`${buttonSize} tactical-btn-primary-enhanced rounded-full flex items-center justify-center hover:scale-105 transition-all duration-200 tactical-shadow-gold`}
          title="Iniciar cronômetro"
        >
          <Play className={`${iconSize} fill-current`} />
        </button>
      ) : (
        <button
          onClick={onPause}
          className={`${buttonSize} ${isPaused ? 'tactical-btn-primary-enhanced' : 'bg-tactical-warning hover:bg-yellow-400'} rounded-full flex items-center justify-center hover:scale-105 transition-all duration-200 tactical-shadow-md`}
          title={isPaused ? "Continuar" : "Pausar"}
        >
          {isPaused ? (
            <Play className={`${iconSize} fill-current`} />
          ) : (
            <Pause className={`${iconSize} fill-current text-tactical-black`} />
          )}
        </button>
      )}

      {/* Botão Stop */}
      <button
        onClick={onStop}
        className={`${buttonSize} bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-105 transition-all duration-200 tactical-shadow-md`}
        title="Parar e registrar"
        disabled={!isRunning && !isPaused}
      >
        <Square className={`${iconSize} fill-current`} />
      </button>

      {/* Botão Minimizar */}
      {onMinimize && !compact && (
        <button
          onClick={onMinimize}
          className={`${buttonSize} tactical-btn-enhanced rounded-full flex items-center justify-center hover:scale-105 transition-all duration-200 tactical-shadow-md`}
          title="Janela flutuante"
        >
          <Minimize2 className={iconSize} />
        </button>
      )}
    </div>
  );
};

export default TimerControls;
