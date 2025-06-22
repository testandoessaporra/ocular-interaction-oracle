
import { useState, useCallback } from 'react';
import { CycleWizardData } from '@/types/cycleWizard';
import { generateStudyBlocks } from '@/utils/blockGenerator';
import { validateCycleConfiguration } from '@/utils/cycleValidation';
import { calculateOptimalDurations, estimateBlocks } from '@/utils/cycleOptimization';
import { rebalanceSubjects } from '@/utils/cycleRebalancing';

export const useCycleCreation = (initialData?: Partial<CycleWizardData>) => {
  const [wizardData, setWizardData] = useState<CycleWizardData>({
    selectedExam: '',
    subjects: [],
    weeklyHours: 20,
    minBlockDuration: 25,
    maxBlockDuration: 50,
    ...initialData
  });

  const updateWizardData = useCallback((updates: Partial<CycleWizardData>) => {
    setWizardData(prev => ({ ...prev, ...updates }));
  }, []);

  const canProceedToNextStep = useCallback((currentStep: number) => {
    switch (currentStep) {
      case 0: // Exam selection
        return !!wizardData.selectedExam;
      case 1: // Subject selection
        return wizardData.subjects.some(s => s.isSelected);
      case 2: // Subject configuration
        return wizardData.subjects.filter(s => s.isSelected).every(s => s.weight > 0);
      case 3: // Study configuration
        return wizardData.weeklyHours > 0 && wizardData.minBlockDuration > 0 && wizardData.maxBlockDuration > 0;
      default:
        return false;
    }
  }, [wizardData]);

  const canProceedToPreviousStep = useCallback((currentStep: number) => {
    return currentStep > 0;
  }, []);

  const createCycle = useCallback(() => {
    // Validar configuração antes de criar
    const validation = validateCycleConfiguration(wizardData);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const selectedSubjects = wizardData.subjects.filter(s => s.isSelected);
    
    // Aplicar rebalanceamento inteligente
    const finalSubjects = rebalanceSubjects(selectedSubjects, wizardData.weeklyHours, wizardData.minBlockDuration);

    const studyBlocks = generateStudyBlocks(
      finalSubjects,
      wizardData.minBlockDuration,
      wizardData.maxBlockDuration
    );

    // Validação final do número de blocos
    if (studyBlocks.length > 80) {
      throw new Error("ATENÇÃO: Lógica de ciclo desconfigurada de forma extremamente desproporcional, o que inviabiliza sua geração. Ajuste os pesos de acordo.");
    }

    return {
      examName: wizardData.selectedExam,
      weeklyHours: wizardData.weeklyHours,
      subjects: finalSubjects,
      studyBlocks: studyBlocks,
      createdAt: new Date().toISOString()
    };
  }, [wizardData]);

  return { 
    wizardData,
    updateWizardData,
    canProceedToNextStep,
    canProceedToPreviousStep,
    createCycle, 
    validateCycleConfiguration, 
    estimateBlocks, 
    calculateOptimalDurations 
  };
};
