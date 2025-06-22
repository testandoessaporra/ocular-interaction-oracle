
import React from 'react';
import { Button } from '@/components/ui/button';
;
import { Cycle } from '@/types/cycle';
import NewOperationButton from '@/components/NewOperationButton';
import EditOperationButton from '@/components/EditOperationButton';
import { CycleWizardData } from '@/types/cycleWizard';
import { Play } from '@/components/icons';

interface IndexHeaderProps {
  currentCycle: Cycle | null;
  onNewOperation: () => void;
  onStudy: () => void;
  onEditStart: (wizardData: CycleWizardData) => void;
}

const IndexHeader = ({ currentCycle, onNewOperation, onStudy, onEditStart }: IndexHeaderProps) => {
  return (
    <div className="tactical-bg border-b border-tactical-mediumGray/50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="tactical-command text-2xl sm:text-3xl text-white mb-2">
              Central de Operações
            </h1>
            {currentCycle && (
              <p className="tactical-body text-gray-300 leading-relaxed">
                Operação ativa: <span className="tactical-element text-tactical-gold">{currentCycle.examName}</span>
              </p>
            )}
          </div>

          {/* Botões com confirmação integrada */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Botão Nova Operação com confirmação */}
            <NewOperationButton onNewOperation={onNewOperation} />

            {currentCycle && (
              <>
                {/* Botão primário - Estudar */}
                <Button
                  onClick={onStudy}
                  className="h-10 px-4 text-sm font-medium rounded-xl bg-gradient-to-r from-tactical-success to-tactical-success/80 hover:from-tactical-success hover:to-tactical-success text-white font-semibold focus-visible:ring-2 focus-visible:ring-tactical-success/60 focus-visible:outline-none tactical-shadow-md"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Estudar
                </Button>

                {/* Botão Editar Ciclo com confirmação */}
                <EditOperationButton onEditStart={onEditStart} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexHeader;
