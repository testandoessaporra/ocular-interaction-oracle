
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';
import { RotateCcw } from '@/components/icons';

const ResetButton = () => {
  const { resetAllProgress } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = () => {
    resetAllProgress();
    setIsOpen(false);
    
    toast({
      title: "🔄 Sistema Resetado",
      description: "Todos os dados foram limpos. Bem-vindo, Recruta!",
      duration: 5000,
      className: "tactical-card border-blue-500/50",
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors focus-visible:ring-2 focus-visible:ring-red-400/60"
          title="Reset completo do sistema"
        >
          <RotateCcw className="w-3 h-3" />
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent className="tactical-card max-w-md">
        {/* REFINAMENTO: Backdrop blur premium */}
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm -z-10" />
        
        <div className="animate-fade-in">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-yellow-400 tactical-title font-orbitron">
              ⚠️ RESET COMPLETO
            </AlertDialogTitle>
            <AlertDialogDescription className="description-text text-white">
              Esta ação irá <span className="text-red-400 font-bold">apagar permanentemente</span> todos os seus dados:
              <br />
              <br />
              • Níveis e experiência
              <br />
              • Conquistas e medalhas
              <br />
              • Histórico de estudos
              <br />
              • Configurações personalizadas
              <br />
              <br />
              <span className="text-yellow-400">Esta ação não pode ser desfeita!</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="tactical-btn-secondary focus-visible:ring-2 focus-visible:ring-white/60">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReset}
              className="bg-red-600 hover:bg-red-700 text-white focus-visible:ring-2 focus-visible:ring-red-400/60"
            >
              Sim, Resetar Tudo
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ResetButton;
