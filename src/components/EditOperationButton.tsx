
import { logger } from '@/utils/logger';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
;
import { useUser } from '@/contexts/UserContext';
import { CycleWizardData } from '@/types/cycleWizard';
import { EXAM_SUBJECTS } from '@/constants/examData';
import { Edit, AlertTriangle, Zap } from '@/components/icons';

interface EditOperationButtonProps {
  onEditStart: (wizardData: CycleWizardData) => void;
}

const EditOperationButton = ({ onEditStart }: EditOperationButtonProps) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { currentCycle } = useUser();

  // Estado preparatório para sistema de elixires (futuro)
  const elixirCount = 0; // Será conectado ao inventário futuramente

  const handleEditConfirm = () => {
    if (!currentCycle) return;

    const examSubjects = EXAM_SUBJECTS[currentCycle.examName] || [];
    
    const wizardSubjects = examSubjects.map(examSubject => {
      const cycleSubject = currentCycle.subjects.find(s => s.name === examSubject.name);
      
      return {
        name: examSubject.name,
        weight: cycleSubject?.weight || examSubject.questions,
        isSelected: !!cycleSubject,
        difficulty: cycleSubject ? (
          cycleSubject.difficulty === 'Alta' ? (Math.random() > 0.5 ? 1 : 2) as 1 | 2 :
          cycleSubject.difficulty === 'Média' ? 3 as 3 :
          (Math.random() > 0.5 ? 4 : 5) as 4 | 5
        ) : 3 as 3
      };
    });

    const wizardData: CycleWizardData = {
      selectedExam: currentCycle.examName,
      subjects: wizardSubjects,
      weeklyHours: currentCycle.weeklyHours,
      minBlockDuration: 45,
      maxBlockDuration: 90
    };

    setShowConfirmation(false);
    onEditStart(wizardData);
  };

  const handleUseElixir = () => {
    // Função preparatória para uso de elixir (futuro)
    logger.info('Usar elixir - funcionalidade em desenvolvimento');
  };

  if (!currentCycle) return null;

  return (
    <>
      <Button
        onClick={() => setShowConfirmation(true)}
        variant="outline"
        className="py-3 px-4 rounded-xl tactical-element text-sm bg-gray-800/80 border-gray-600/50 text-gray-300 hover:bg-gray-700/80 hover:border-yellow-400/30 hover:text-yellow-400 min-h-[44px]"
      >
        <Edit className="w-4 h-4 mr-2" />
        EDITAR CICLO
      </Button>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="max-w-lg tactical-card border-2 border-yellow-500/30 shadow-2xl bg-gray-900/95">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-3 text-xl tactical-title">
              <div className="p-2 bg-yellow-400/20 rounded-xl border border-yellow-400/30">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-yellow-400">OPERAÇÃO CRÍTICA - CONFIRMAÇÃO NECESSÁRIA</span>
            </DialogTitle>
            <DialogDescription className="tactical-body text-gray-300 mt-3 space-y-3">
              <p>
                Ao editar ciclo ou criar nova operação, seu contador de ciclos consecutivos (e seus respectivos bônus) serão zerados. Você tem a opção de impedir isso com o item "Elixir do Evandro Guedes" que pode ser comprado com moedas na loja. Tem certeza que deseja prosseguir?
              </p>
              <p className="text-sm text-blue-300 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                <strong>Obs:</strong> fique tranquilo(a), isso não impactará seus estudos, apenas impactará evolução do personagem e sistema de game do aplicativo.
              </p>
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 pt-4">
            {/* Botão do Elixir - Preparado para futuro */}
            <Button
              onClick={handleUseElixir}
              disabled={elixirCount === 0}
              className="w-full bg-gradient-to-r from-purple-600/50 to-purple-700/50 border border-purple-500/30 text-purple-200 hover:from-purple-600/70 hover:to-purple-700/70 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl relative"
              title="Item não disponível no inventário"
            >
              <Zap className="w-4 h-4 mr-2" />
              <span>Usar Elixir do Evandro Guedes</span>
              <span className="ml-2 bg-purple-800/50 px-2 py-0.5 rounded text-xs">x{elixirCount}</span>
            </Button>

            {/* Botões principais */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                className="flex-1 bg-gray-800/80 border-gray-600/50 text-gray-300 hover:bg-gray-700/80 rounded-xl"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleEditConfirm}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold hover:from-red-400 hover:to-red-500 rounded-xl"
              >
                <Edit className="w-4 h-4 mr-2" />
                Confirmar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditOperationButton;
