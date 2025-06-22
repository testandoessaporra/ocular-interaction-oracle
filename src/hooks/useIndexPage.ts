
import { logger } from '@/utils/logger';
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { CycleWizardData } from '@/types/cycleWizard';
import { StudyBlock, Cycle } from '@/types/cycle';
import { toast } from '@/hooks/use-toast';

export const useIndexPage = () => {
  const [showCycleCreator, setShowCycleCreator] = useState(false);
  const [showStudyModal, setShowStudyModal] = useState(false);
  const [preselectedSubject, setPreselectedSubject] = useState<string>('');
  const [preselectedDuration, setPreselectedDuration] = useState<number>(60);
  const [selectedBlock, setSelectedBlock] = useState<StudyBlock | null>(null);
  const [editWizardData, setEditWizardData] = useState<CycleWizardData | null>(null);

  const { currentCycle, addStudySession, completedBlocks, addCompletedBlock, setCurrentCycle } = useUser();

  const handleNewStudySession = (session: { subject: string; date: string; duration: number; type: string; notes?: string }) => {
    addStudySession(session);

    // CORREÇÃO CRÍTICA: Marcar bloco como completo ANTES de limpar selectedBlock
    if (selectedBlock) {
      const blockId = selectedBlock.persistentId;
      
      if (!blockId || blockId === 'undefined') {
        logger.error('❌ Tentativa de completar bloco com persistentId inválido:', selectedBlock);
        return;
      }
      
      const blockExists = currentCycle?.studyBlocks?.some(block => block.persistentId === blockId);
      
      if (!blockExists) {
        logger.error('❌ Bloco não encontrado no ciclo atual:', blockId);
        return;
      }
      
      logger.info('✅ Completando bloco válido:', { blockId, selectedBlock });
      addCompletedBlock(blockId);
      
      // Toast de sucesso
      toast({
        title: "✅ Bloco Completado!",
        description: `${selectedBlock.subject} - ${session.duration} minutos registrados`,
        duration: 3000,
      });
    }

    closeStudyModal();
  };

  const handleStartTimerFromModal = (formData: { subject: string; date: string; duration: number; type: string; notes: string }) => {
    logger.info('IndexPage: Iniciando timer global com dados do modal:', formData);
    
    const timerProps = {
      onStop: handleTimerComplete,
      initialSubject: formData.subject,
      initialDuration: formData.duration,
      originBlock: selectedBlock
    };

    // Usar timer global
    if (window.startGlobalTimer) {
      window.startGlobalTimer(timerProps);
    }
    
    closeStudyModal();
  };

  const handleBlockClick = (block: StudyBlock) => {
    if (!block.persistentId || block.persistentId === 'undefined') {
      logger.error('❌ Tentativa de interagir com bloco inválido:', block);
      return;
    }
    
    setPreselectedSubject(block.subject);
    setPreselectedDuration(block.duration);
    setSelectedBlock(block);
    setShowStudyModal(true);
  };

  const handleTimerComplete = (result: { studyTime: number; pauseTime: number; subject?: string; totalMinutes: number; originBlock?: StudyBlock }) => {
    logger.info('IndexPage: Timer completo recebido com resultado:', result);
    
    // Não fazer nada se o tempo for zero
    if (result.totalMinutes <= 0) {
      // CORREÇÃO CRÍTICA: Sempre fechar timer global (Bug 1)
      if (window.closeGlobalTimer) {
        window.closeGlobalTimer();
      }
      return;
    }
    
    // CORREÇÃO CRÍTICA: Sempre abrir modal, mesmo com originBlock (Bug 2)
    // Pré-preencher dados corretos baseados na origem
    if (result.originBlock) {
      logger.info('✅ Abrindo modal para bloco:', result.originBlock);
      setPreselectedSubject(result.originBlock.subject);
      setSelectedBlock(result.originBlock);
    } else {
      logger.info('✅ Abrindo modal para sessão livre');
      setPreselectedSubject(result.subject || '');
      setSelectedBlock(null);
    }
    
    // Sempre usar duração real do cronômetro
    setPreselectedDuration(result.totalMinutes);
    setShowStudyModal(true);
    
    // CORREÇÃO CRÍTICA: Sempre fechar timer global ao final (Bug 1)
    if (window.closeGlobalTimer) {
      window.closeGlobalTimer();
    }
  };

  const handleCycleCreated = (cycle: Cycle) => {
    setCurrentCycle(cycle);
  };

  const handleEditOperation = (wizardData: CycleWizardData) => {
    setEditWizardData(wizardData);
    setShowCycleCreator(true);
  };

  const closeWizard = () => {
    setShowCycleCreator(false);
    setEditWizardData(null);
  };

  const closeStudyModal = () => {
    setShowStudyModal(false);
    setPreselectedSubject('');
    setPreselectedDuration(60);
    setSelectedBlock(null);
  };

  const openNewOperation = () => setShowCycleCreator(true);
  const openStudySession = () => setShowStudyModal(true);

  // Return all the values and functions that the Index page needs
  return {
    // State
    showCycleCreator,
    showStudyModal,
    preselectedSubject,
    preselectedDuration,
    editWizardData,
    currentCycle,
    completedBlocks,
    selectedBlock,
    
    // Computed values
    hasCurrentCycle: !!currentCycle,
    studyBlocks: currentCycle?.studyBlocks || [],
    completedBlocksCount: completedBlocks.length,
    availableSubjects: currentCycle?.studyBlocks?.map(block => block.subject).filter((subject, index, arr) => arr.indexOf(subject) === index) || [],
    
    // Handlers
    handleNewStudySession,
    handleStartTimerFromModal,
    handleBlockClick,
    handleTimerComplete,
    handleCycleCreated,
    handleEditOperation,
    closeWizard,
    closeStudyModal,
    openNewOperation,
    openStudySession
  };
};
