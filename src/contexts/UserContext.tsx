
import React, { createContext, useContext } from 'react';
import { UserContextType } from './UserContextTypes';
import { UserProgress } from '@/types/gamification';
import { useGamification } from '@/hooks/useGamification';
import { useUnifiedState } from '@/hooks/useUnifiedState';
import { useUserActionsUnified } from '@/hooks/useUserActionsUnified';
import { useLoginStreak } from '@/hooks/useLoginStreak';
import { usePerformanceTracker } from '@/hooks/usePerformanceTracker';
import { bundleAnalyzer } from '@/utils/bundleAnalyzer';

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  // Track performance do contexto principal
  const { trackOperation, logCustomMetric } = usePerformanceTracker({
    componentName: 'UserProvider',
    trackRenders: true,
    trackMounts: true
  });

  const { initializeProgress } = useGamification();
  const initialProgress = trackOperation('initializeProgress', () => initializeProgress());
  
  const { state, updateState } = useUnifiedState(initialProgress);
  const userActions = useUserActionsUnified(state, updateState);

  // Inicializar sistema de login streak
  const setUserProgress = React.useCallback((updater: React.SetStateAction<UserProgress>) => {
    updateState(prev => ({
      ...prev,
      userProgress: typeof updater === 'function' ? updater(prev.userProgress) : updater
    }));
  }, [updateState]);

  // Passar userProgress diretamente para evitar dependência circular
  useLoginStreak(state.userProgress, setUserProgress);

  // Track contexto e dependências
  React.useEffect(() => {
    bundleAnalyzer.trackComponentLoad('UserProvider', [
      'useGamification',
      'useUnifiedState', 
      'useUserActionsUnified',
      'useLoginStreak'
    ]);
    
    logCustomMetric('userContextInitialized', {
      hasProgress: !!state.userProgress,
      cycleExists: !!state.currentCycle,
      completedBlocksCount: state.completedBlocks.length,
      cycleStreak: state.userProgress.cycleStreak,
      loginStreak: state.userProgress.loginStreak
    });
  }, [logCustomMetric, state.userProgress, state.currentCycle, state.completedBlocks.length]);

  const value: UserContextType = React.useMemo(() => trackOperation('createContextValue', () => ({
    userProgress: state.userProgress,
    setUserProgress,
    studySessions: state.studySessions,
    setStudySessions: (updater) => updateState(prev => ({
      ...prev,
      studySessions: typeof updater === 'function' ? updater(prev.studySessions) : updater
    })),
    currentCycle: state.currentCycle,
    setCurrentCycle: userActions.setCurrentCycle,
    completedBlocks: state.completedBlocks,
    setCompletedBlocks: (updater) => updateState(prev => ({
      ...prev,
      completedBlocks: typeof updater === 'function' ? updater(prev.completedBlocks) : updater
    })),
    resetCompletedBlocks: userActions.resetCompletedBlocks,
    targetExam: state.targetExam,
    setTargetExam: (updater) => updateState(prev => ({
      ...prev,
      targetExam: typeof updater === 'function' ? updater(prev.targetExam) : updater
    })),
    addStudySession: userActions.addStudySession,
    addCompletedBlock: userActions.addCompletedBlock,
    resetAllProgress: userActions.resetAllProgress
  })), [state, updateState, userActions, trackOperation, setUserProgress]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
