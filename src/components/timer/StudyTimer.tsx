import React, { useEffect } from 'react';
import { useStudyTimer } from '@/hooks/useStudyTimer';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import TimerAlarmSettings from './TimerAlarmSettings';
import { Portal } from '@/components/ui/portal';
;
import { logger } from '@/utils/logger';
import { X } from '@/components/icons';

interface StudyTimerProps {
  onStop: (result: { studyTime: number; pauseTime: number; subject?: string; totalMinutes: number; originBlock?: any }) => void;
  onClose: () => void;
  initialSubject?: string;
  initialDuration?: number;
  originBlock?: any;
}

const StudyTimer = ({ onStop, onClose, initialSubject, initialDuration, originBlock }: StudyTimerProps) => {
  const {
    timer,
    startTimer,
    pauseTimer,
    stopTimer,
    setMode,
    toggleAlarm,
    setAlarmInterval,
    closeTimer,
    formatTime
  } = useStudyTimer(initialSubject, initialDuration, 'focus', originBlock);

  logger.info('StudyTimer renderizado', { 
    component: 'StudyTimer',
    data: { mode: timer.mode, originBlock: !!originBlock }
  });

  useEffect(() => {
    if (timer.mode === 'focus') {
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.width = '';
      };
    }
  }, [timer.mode]);

  const handleStop = () => {
    const result = stopTimer();
    onStop(result);
  };

  const handleClose = () => {
    const actualStudyTime = timer.isCountdown ? timer.initialDuration - timer.studyTime : timer.studyTime;
    const hasTime = actualStudyTime > 0 || timer.pauseTime > 0;
    
    if (hasTime) {
      const confirmClose = window.confirm(
        'Tem certeza de que deseja sair sem registrar o estudo? O tempo cronometrado será perdido.'
      );
      if (!confirmClose) return;
    }
    
    closeTimer();
    onClose();
  };

  const handleMinimize = () => {
    setMode('floating');
  };

  if (timer.mode === 'hidden') {
    logger.debug('Timer está hidden, não renderizando', { component: 'StudyTimer' });
    return null;
  }

  if (timer.mode === 'floating') {
    const floatingTimer = (
      <div className="fixed bottom-4 right-4 z-[9999] tactical-card bg-gray-900 border-yellow-600/30 rounded-xl p-4 shadow-2xl min-w-[280px]">
        <div className="flex items-center justify-between mb-3">
          <span className="tactical-command text-sm text-yellow-400">TIMER ATIVO</span>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('focus')}
              className="text-gray-400 hover:text-yellow-400 transition-colors"
              title="Expandir para modo foco"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          <TimerDisplay 
            studyTime={timer.studyTime} 
            pauseTime={timer.pauseTime}
            formatTime={formatTime}
            isCountdown={timer.isCountdown}
            initialDuration={timer.initialDuration}
            compact
          />
          
          <TimerControls
            isRunning={timer.isRunning}
            isPaused={timer.isPaused}
            onStart={startTimer}
            onPause={pauseTimer}
            onStop={handleStop}
            compact
          />
        </div>
      </div>
    );

    return <Portal>{floatingTimer}</Portal>;
  }

  const focusOverlay = (
    <div className="fixed inset-0 z-[9999] tactical-bg flex items-center justify-center" style={{ height: '100vh', width: '100vw' }}>
      <div className="absolute inset-0 bg-black/90 w-full h-full" style={{ minHeight: '100vh' }} />
      
      <div className="absolute top-0 left-0 right-0 bg-yellow-600/10 border-b border-yellow-600/20 p-2 sm:p-3 z-10 w-full">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="tactical-command text-xs sm:text-sm text-yellow-400">🔒 MODO FOCO ATIVO</span>
          </div>
          <button
            onClick={handleMinimize}
            className="tactical-btn-secondary px-2 py-1 text-xs hover:text-yellow-400 transition-colors"
          >
            Minimizar
          </button>
        </div>
      </div>

      <div className="relative z-10 tactical-card bg-gray-900/95 border-yellow-600/30 rounded-2xl p-4 sm:p-6 lg:p-8 max-w-sm sm:max-w-md lg:max-w-2xl w-full mx-2 sm:mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="tactical-title text-lg sm:text-xl lg:text-2xl text-yellow-400 mb-2">CRONÔMETRO</h2>
            {timer.subject && (
              <p className="text-gray-300 tactical-element text-sm sm:text-base">{timer.subject}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="mb-6 sm:mb-8">
          <TimerDisplay 
            studyTime={timer.studyTime} 
            pauseTime={timer.pauseTime}
            formatTime={formatTime}
            isCountdown={timer.isCountdown}
            initialDuration={timer.initialDuration}
          />
        </div>

        <div className="mb-6 sm:mb-8">
          <TimerControls
            isRunning={timer.isRunning}
            isPaused={timer.isPaused}
            onStart={startTimer}
            onPause={pauseTimer}
            onStop={handleStop}
            onMinimize={handleMinimize}
          />
        </div>

        <TimerAlarmSettings
          isEnabled={timer.isAlarmEnabled}
          interval={timer.alarmInterval}
          onToggle={toggleAlarm}
          onIntervalChange={setAlarmInterval}
        />
      </div>
    </div>
  );

  return <Portal>{focusOverlay}</Portal>;
};

export default StudyTimer;
