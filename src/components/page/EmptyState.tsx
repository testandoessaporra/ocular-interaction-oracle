
import React from 'react';
import { Button } from '@/components/ui/button';

import { Plus, Target } from '@/components/icons';

interface EmptyStateProps {
  onCreateOperation: () => void;
}

const EmptyState = ({ onCreateOperation }: EmptyStateProps) => {
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center animate-fade-in"
    >
      <div className="tactical-card-enhanced rounded-2xl p-8 max-w-md w-full tactical-border-gold space-y-6">
        <div 
          className="flex justify-center animate-slide-up-bounce"
          style={{ animationDelay: '50ms' }}
        >
          <div className="p-4 rounded-full bg-tactical-gold/20 tactical-border-gold">
            <Target className="w-12 h-12 text-tactical-gold" />
          </div>
        </div>

        <div 
          className="space-y-3 animate-slide-up-bounce"
          style={{ animationDelay: '100ms' }}
        >
          <h3 className="tactical-command text-xl text-white">
            Nenhuma Operação Ativa
          </h3>
          <p className="tactical-body text-tactical-disabledGray leading-relaxed">
            Configure sua primeira operação de estudos para começar a monitorar seu progresso tático.
          </p>
        </div>

        <div className="animate-slide-up-bounce" style={{ animationDelay: '150ms' }}>
          <Button
            onClick={onCreateOperation}
            className="w-full tactical-btn-primary-enhanced h-12 text-base font-semibold rounded-xl tactical-shadow-gold focus-visible:ring-2 focus-visible:ring-tactical-gold/60"
          >
            <Plus className="w-5 h-5 mr-2" />
            Criar Nova Operação
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
