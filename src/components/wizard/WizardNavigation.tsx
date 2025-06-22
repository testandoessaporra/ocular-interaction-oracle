
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Target, Loader2 } from '@/components/icons';
;

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  canProceed: boolean;
  isEdit: boolean;
  isGenerating?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onGenerate?: () => void;
}

const WizardNavigation = ({ 
  currentStep, 
  totalSteps, 
  canProceed, 
  isEdit, 
  isGenerating = false,
  onPrev, 
  onNext,
  onGenerate
}: WizardNavigationProps) => {
  const isLastStep = currentStep === totalSteps - 1;

  const handleNextClick = () => {
    if (isLastStep && onGenerate) {
      onGenerate();
    } else {
      onNext();
    }
  };

  return (
    <div className="flex justify-between items-center pt-4 sm:pt-6 border-t border-tactical-gold/20">
      <Button
        variant="outline"
        onClick={onPrev}
        disabled={currentStep === 0 || isGenerating}
        className="px-4 sm:px-6 py-2 sm:py-3 bg-tactical-mediumGray/80 border-tactical-gold/50 text-tactical-disabledGray hover:bg-tactical-darkGray/80 hover:border-tactical-gold/30 hover:text-tactical-gold disabled:opacity-30 disabled:cursor-not-allowed text-sm rounded-xl button-press hover-lift"
      >
        <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2 icon-bounce" />
        Voltar
      </Button>

      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i <= currentStep ? 'bg-tactical-gold' : 'bg-tactical-mediumGray'
            }`}
          />
        ))}
      </div>

      <Button
        onClick={handleNextClick}
        disabled={!canProceed || isGenerating}
        className={`
          px-4 sm:px-8 py-2 sm:py-3 font-bold text-sm min-h-[44px] touch-manipulation rounded-xl button-press hover-lift
          ${isGenerating 
            ? 'bg-tactical-gold/50 text-tactical-black/70 cursor-not-allowed' 
            : 'tactical-btn-primary-enhanced hover:tactical-btn-primary-hover disabled:opacity-30 disabled:cursor-not-allowed'
          }
        `}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-1 sm:mr-2 animate-spin" />
            <span className="hidden sm:inline">PROCESSANDO...</span>
            <span className="sm:hidden">...</span>
          </>
        ) : isLastStep ? (
          <>
            <Target className="w-4 h-4 mr-1 sm:mr-2 icon-bounce" />
            <span className="hidden sm:inline">{isEdit ? 'ATUALIZAR OPERAÇÃO' : 'CRIAR OPERAÇÃO'}</span>
            <span className="sm:hidden">{isEdit ? 'ATUALIZAR' : 'CRIAR'}</span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline">Avançar</span>
            <span className="sm:hidden">Próximo</span>
            <ArrowRight className="w-4 h-4 ml-1 sm:ml-2 icon-bounce" />
          </>
        )}
      </Button>
    </div>
  );
};

export default WizardNavigation;
