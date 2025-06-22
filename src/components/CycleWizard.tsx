
import React, { useState, useCallback, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useUser } from '@/contexts/UserContext';
import { useCycleCreation } from '@/hooks/useCycleCreation';
import { usePerformanceTracker } from '@/hooks/usePerformanceTracker';
import { CycleWizardData } from '@/types/cycleWizard';
import { Cycle } from '@/types/cycle';
import ExamSelectionStep from '@/components/wizard-steps/ExamSelectionStep';
import SubjectSelectionStep from '@/components/wizard-steps/SubjectSelectionStep';
import SubjectConfigurationStep from '@/components/wizard-steps/SubjectConfigurationStep';
import StudyConfigurationStep from '@/components/wizard-steps/StudyConfigurationStep';
import WizardHeader from '@/components/wizard/WizardHeader';
import WizardNavigation from '@/components/wizard/WizardNavigation';
import { motion, AnimatePresence } from 'framer-motion';

interface CycleWizardProps {
  onClose: () => void;
  onCycleCreated: (cycle: Cycle) => void;
  initialData?: Partial<CycleWizardData>;
}

const STEPS = [
  { id: 'exam', title: 'Seleção de Prova', component: ExamSelectionStep },
  { id: 'subjects', title: 'Seleção de Matérias', component: SubjectSelectionStep },
  { id: 'configuration', title: 'Configuração de Matérias', component: SubjectConfigurationStep },
  { id: 'study', title: 'Configuração de Estudos', component: StudyConfigurationStep }
];

const CycleWizard = ({ onClose, onCycleCreated, initialData }: CycleWizardProps) => {
  const { trackOperation } = usePerformanceTracker({
    componentName: 'CycleWizard',
    trackRenders: true
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const {
    wizardData,
    updateWizardData,
    canProceedToNextStep,
    canProceedToPreviousStep,
    createCycle
  } = useCycleCreation(initialData);

  const handleNext = useCallback(() => {
    trackOperation('nextStep', () => {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    });
  }, [currentStep, trackOperation]);

  const handlePrevious = useCallback(() => {
    trackOperation('previousStep', () => {
      if (currentStep > 0) {
        setCurrentStep(prev => prev - 1);
      }
    });
  }, [currentStep, trackOperation]);

  const handleGenerate = useCallback(async () => {
    if (!canProceedToNextStep(currentStep)) return;
    
    setIsGenerating(true);
    try {
      const result = await trackOperation('generateCycle', () => createCycle());
      if (result) {
        onCycleCreated(result);
        onClose();
      }
    } finally {
      setIsGenerating(false);
    }
  }, [canProceedToNextStep, currentStep, createCycle, onCycleCreated, onClose, trackOperation]);

  const CurrentStepComponent = STEPS[currentStep].component;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[85vh] p-0 wizard-modal-backdrop rounded-2xl overflow-hidden [&>button]:hidden">
        <div className="wizard-card-enhanced h-full flex flex-col border border-tactical-gold/40">
          {/* Header com altura fixa */}
          <div className="tactical-gradient-dark border-b border-tactical-gold/20 p-6 flex-shrink-0">
            <WizardHeader 
              currentStep={currentStep}
              totalSteps={STEPS.length}
              stepTitle={STEPS[currentStep].title}
              examName={wizardData.selectedExam}
              onClose={onClose}
            />
          </div>

          {/* Conteúdo principal com altura flexível */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  ref={(el) => { stepRefs.current[currentStep] = el; }}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full p-6"
                >
                  <CurrentStepComponent
                    data={wizardData}
                    onDataChange={updateWizardData}
                    onNext={handleNext}
                    onPrev={handlePrevious}
                    currentStep={currentStep}
                    totalSteps={STEPS.length}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation com altura fixa */}
            <div className="tactical-gradient-dark border-t border-tactical-gold/20 p-6 flex-shrink-0">
              <WizardNavigation
                currentStep={currentStep}
                totalSteps={STEPS.length}
                canProceed={canProceedToNextStep(currentStep)}
                isEdit={false}
                isGenerating={isGenerating}
                onNext={handleNext}
                onPrev={handlePrevious}
                onGenerate={handleGenerate}
              />
            </div>
          </div>

          {/* Overlay de geração */}
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 tactical-modal-backdrop backdrop-blur-md flex items-center justify-center z-50"
            >
              <div className="tactical-card-enhanced rounded-xl p-8 max-w-sm mx-4 text-center border border-tactical-gold/40">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-tactical-gold/30 border-t-tactical-gold mx-auto mb-4"></div>
                <h3 className="tactical-command text-lg text-tactical-gold mb-2">Gerando Operação</h3>
                <p className="tactical-body text-tactical-disabledGray text-sm">
                  Processando configurações e distribuindo blocos de estudo...
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(CycleWizard);
