
import React from 'react';
import StudyTimer from '@/components/timer/StudyTimer';

interface GlobalTimerProps {
  isActive: boolean;
  timerProps: any;
  onClose: () => void;
}

const GlobalTimer = React.memo(({ isActive, timerProps, onClose }: GlobalTimerProps) => {
  if (!isActive || !timerProps) {
    return null;
  }

  return (
    <StudyTimer
      {...timerProps}
      onClose={onClose}
    />
  );
});

GlobalTimer.displayName = 'GlobalTimer';

export default GlobalTimer;
