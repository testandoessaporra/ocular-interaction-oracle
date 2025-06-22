
import React, { useMemo } from 'react';
import { useIndexPage } from '@/hooks/useIndexPage';
import { useCurrentCycle, useCompletedBlocks } from '@/hooks/useUserSelector';
import { usePerformanceTracker } from '@/hooks/usePerformanceTracker';
import CycleWizard from '@/components/CycleWizard';
import StudySessionModal from '@/components/StudySessionModal';
import EmptyState from '@/components/page/EmptyState';
import IndexHeader from '@/components/page/IndexHeader';
import StudyBlocksPreview from '@/components/StudyBlocksPreview';

const Index = () => {
  // Sistema de tracking de performance
  const { trackOperation, logCustomMetric, getRenderCount } = usePerformanceTracker({
    componentName: 'Index',
    trackRenders: true,
    trackMounts: true
  });

  // Usar seletores otimizados ao invés do useUser completo
  const currentCycle = useCurrentCycle();
  const completedBlocks = useCompletedBlocks();

  const {
    showCycleCreator,
    showStudyModal,
    preselectedSubject,
    preselectedDuration,
    editWizardData,
    handleNewStudySession,
    handleStartTimerFromModal,
    handleBlockClick,
    handleCycleCreated,
    handleEditOperation,
    closeWizard,
    closeStudyModal,
    openNewOperation,
    openStudySession
  } = useIndexPage();

  // Memoizar callbacks estáveis para evitar re-renders desnecessários
  const memoizedCallbacks = useMemo(() => {
    return trackOperation('memoizeCallbacks', () => ({
      handleBlockClick,
      handleEditOperation: () => handleEditOperation(editWizardData),
      openNewOperation,
      openStudySession,
      closeWizard,
      handleCycleCreated,
      closeStudyModal,
      handleNewStudySession,
      handleStartTimerFromModal
    }));
  }, [
    handleBlockClick,
    handleEditOperation,
    editWizardData,
    openNewOperation,
    openStudySession,
    closeWizard,
    handleCycleCreated,
    closeStudyModal,
    handleNewStudySession,
    handleStartTimerFromModal,
    trackOperation
  ]);

  // Memoizar dados computados
  const memoizedData = useMemo(() => {
    return trackOperation('memoizeData', () => ({
      availableSubjects: currentCycle?.subjects || [],
      hasCurrentCycle: !!currentCycle,
      studyBlocks: currentCycle?.studyBlocks || [],
      completedBlocksCount: completedBlocks.length
    }));
  }, [currentCycle, completedBlocks, trackOperation]);

  // Log métricas customizadas
  React.useEffect(() => {
    logCustomMetric('cycleData', {
      hasCurrentCycle: memoizedData.hasCurrentCycle,
      studyBlocksCount: memoizedData.studyBlocks.length,
      completedBlocksCount: memoizedData.completedBlocksCount,
      renderCount: getRenderCount()
    });
  }, [memoizedData, logCustomMetric, getRenderCount]);

  return (
    <div className="min-h-screen tactical-bg">
      <IndexHeader
        currentCycle={currentCycle}
        onNewOperation={memoizedCallbacks.openNewOperation}
        onStudy={memoizedCallbacks.openStudySession}
        onEditStart={memoizedCallbacks.handleEditOperation}
      />

      <main className="container mx-auto px-4 py-8">
        {memoizedData.hasCurrentCycle ? (
          <StudyBlocksPreview
            studyBlocks={memoizedData.studyBlocks}
            completedBlocks={completedBlocks}
            onBlockClick={memoizedCallbacks.handleBlockClick}
          />
        ) : (
          <EmptyState onCreateOperation={memoizedCallbacks.openNewOperation} />
        )}
      </main>

      {/* Modais memoizados */}
      {showCycleCreator && (
        <CycleWizard
          onClose={memoizedCallbacks.closeWizard}
          onCycleCreated={memoizedCallbacks.handleCycleCreated}
          initialData={editWizardData}
        />
      )}

      {showStudyModal && (
        <StudySessionModal
          onClose={memoizedCallbacks.closeStudyModal}
          onSessionSaved={memoizedCallbacks.handleNewStudySession}
          onStartTimer={memoizedCallbacks.handleStartTimerFromModal}
          availableSubjects={memoizedData.availableSubjects}
          preselectedSubject={preselectedSubject}
          preselectedDuration={preselectedDuration}
        />
      )}
    </div>
  );
};

export default React.memo(Index);
