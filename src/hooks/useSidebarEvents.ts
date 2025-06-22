
import { logger } from '@/utils/logger';
import { useEffect } from 'react';
import { useGamification } from '@/hooks/useGamification';
import { toast } from '@/hooks/use-toast';

interface SidebarEventHandlersProps {
  setLevelUpGlow: (value: boolean) => void;
  setMedalPulse: (value: boolean) => void;
  setShowConfetti: (value: boolean) => void;
  setParticlePosition: (position: { x: number; y: number }) => void;
  setShowParticles: (value: boolean) => void;
}

export const useSidebarEvents = ({
  setLevelUpGlow,
  setMedalPulse,
  setShowConfetti,
  setParticlePosition,
  setShowParticles
}: SidebarEventHandlersProps) => {
  const { showLevelUpNotification, showMedalNotification, showFloatingXP } = useGamification();

  useEffect(() => {
    const handleLevelUp = (event: CustomEvent) => {
      const { newLevel, newClass } = event.detail;
      showLevelUpNotification(newLevel, newClass);
      setLevelUpGlow(true);
      setShowConfetti(true);
      
      setTimeout(() => setLevelUpGlow(false), 2000);
      setTimeout(() => setShowConfetti(false), 3000);
    };

    const handleNewMedal = (event: CustomEvent) => {
      const { medalCount } = event.detail;
      const medalNames = ['Iniciante', 'Dedicado', 'Veterano'];
      showMedalNotification(medalNames[medalCount - 1] || 'Mestre');
      
      setMedalPulse(true);
      setTimeout(() => setMedalPulse(false), 3000);
    };

    const handleXPGained = (event: CustomEvent) => {
      const { xpGained } = event.detail;
      logger.info('🎯 XP Flutuante disparado:', xpGained);
      
      // Mostrar XP flutuante sobre a barra de XP (CORRETO)
      const xpBar = document.querySelector('.xp-bar-container');
      if (xpBar) {
        const rect = xpBar.getBoundingClientRect();
        const xpPosition = { 
          x: rect.left + rect.width / 2, 
          y: rect.top + rect.height / 2 
        };
        
        showFloatingXP({
          x: xpPosition.x,
          y: xpPosition.y,
          xp: xpGained,
          color: '#F59E0B'
        });
        
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
    };

    const handleCycleComplete = (event: CustomEvent) => {
      const { xpGained, coinsGained } = event.detail;
      
      toast({
        title: "🎉 CICLO FINALIZADO!",
        description: `Parabéns! Você ganhou +${xpGained} XP e +${coinsGained} moedas!`,
        duration: 8000,
        className: "tactical-card border-yellow-500/50 bg-gradient-to-r from-yellow-900/30 to-orange-900/20",
      });

      const coinsDisplay = document.querySelector('.coins-display');
      if (coinsDisplay) {
        const rect = coinsDisplay.getBoundingClientRect();
        setParticlePosition({ 
          x: rect.left + rect.width / 2, 
          y: rect.top + rect.height / 2 
        });
        setShowParticles(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    };

    window.addEventListener('levelUp', handleLevelUp as EventListener);
    window.addEventListener('newMedal', handleNewMedal as EventListener);
    window.addEventListener('xpGained', handleXPGained as EventListener);
    window.addEventListener('cycleComplete', handleCycleComplete as EventListener);

    return () => {
      window.removeEventListener('levelUp', handleLevelUp as EventListener);
      window.removeEventListener('newMedal', handleNewMedal as EventListener);
      window.removeEventListener('xpGained', handleXPGained as EventListener);
      window.removeEventListener('cycleComplete', handleCycleComplete as EventListener);
    };
  }, [showLevelUpNotification, showMedalNotification, showFloatingXP, setLevelUpGlow, setMedalPulse, setShowConfetti, setParticlePosition, setShowParticles]);
};
