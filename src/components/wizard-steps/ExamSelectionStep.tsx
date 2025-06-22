
import { Card, CardContent } from '@/components/ui/card';
import { WizardStepProps } from '@/types/cycleWizard';
;
import { CONTESTS } from '@/constants/contestData';
import { Target, Shield } from '@/components/icons';

const ExamSelectionStep = ({ data, onDataChange }: WizardStepProps) => {
  // Mapeamento de ícones para os concursos
  const iconMap: Record<string, any> = {
    'PRF': Target,
    'PF': Shield
  };

  const handleExamSelect = (examId: string) => {
    onDataChange({ selectedExam: examId });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header fixo */}
      <div className="flex-shrink-0 mb-6">
        <div className="text-center">
          <h3 className="tactical-command text-xl sm:text-2xl text-white mb-3">
            Para qual concurso você quer criar a operação da semana?
          </h3>
          <p className="tactical-body text-gray-300 text-sm sm:text-base">
            Selecione o concurso alvo para configurar sua estratégia de estudos
          </p>
        </div>
      </div>

      {/* Área de conteúdo */}
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto w-full">
          {CONTESTS.map((contest) => {
            const Icon = iconMap[contest.id] || Target;
            const isSelected = data.selectedExam === contest.id;
            
            return (
              <Card
                key={contest.id}
                onClick={() => handleExamSelect(contest.id)}
                className={`
                  cursor-pointer transition-all duration-300 hover:scale-105 
                  ${isSelected 
                    ? 'bg-gradient-to-br from-yellow-900/50 to-yellow-800/50 border-yellow-400/60 shadow-xl shadow-yellow-500/20' 
                    : 'bg-gray-800/50 border-gray-600/50 hover:border-yellow-400/30'
                  }
                `}
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`
                      p-3 sm:p-4 rounded-full border-2 transition-all duration-300
                      ${isSelected 
                        ? 'bg-yellow-400/20 border-yellow-400/60' 
                        : 'bg-gray-700/50 border-gray-600/50'
                      }
                    `}>
                      <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${isSelected ? 'text-yellow-400' : 'text-gray-400'}`} />
                    </div>
                    
                    <div>
                      <h4 className={`tactical-command text-lg sm:text-xl mb-2 ${isSelected ? 'text-white' : 'text-white'}`}>
                        {contest.name}
                      </h4>
                      <p className={`tactical-body text-xs sm:text-sm ${isSelected ? 'text-gray-200' : 'text-gray-300'}`}>
                        {contest.fullName}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="w-full pt-2 border-t border-yellow-400/30">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400/20 rounded-full">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                          <span className="text-xs tactical-command text-yellow-400">SELECIONADO</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExamSelectionStep;
