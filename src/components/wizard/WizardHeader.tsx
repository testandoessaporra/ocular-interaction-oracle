
import React from 'react';
;
import WizardProgressBar from './WizardProgressBar';
import { X, Target } from '@/components/icons';

interface WizardHeaderProps {
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
  examName?: string;
  onClose: () => void;
}

const WizardHeader = ({ currentStep, totalSteps, stepTitle, examName, onClose }: WizardHeaderProps) => {
  return (
    <div className="space-y-4">
      {/* Cabeçalho principal */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-tactical-gold/20 tactical-border-gold">
            <Target className="w-6 h-6 text-tactical-gold" />
          </div>
          <div>
            <h1 className="tactical-command text-2xl text-tactical-gold font-bold tracking-tactical">
              CRIAR OPERAÇÃO
            </h1>
            {examName && (
              <p className="tactical-body text-tactical-disabledGray text-sm mt-1">
                {examName}
              </p>
            )}
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-tactical-disabledGray hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-red-400/60"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Barra de progresso e título do passo */}
      <div className="space-y-3">
        <WizardProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
        
        <div className="flex items-center justify-between">
          <h2 className="tactical-element text-lg text-white font-semibold">
            {stepTitle}
          </h2>
          <span className="tactical-data-display text-tactical-gold text-sm">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WizardHeader;
