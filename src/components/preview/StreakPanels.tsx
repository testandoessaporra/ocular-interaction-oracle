
import React from 'react';

import { TacticalCoin, TacticalRadar } from '@/components/TacticalIcons';
import { useMomentumLevel } from '@/hooks/useMomentumLevel';
import { Zap, TrendingUp } from '@/components/icons';

interface StreakPanelsProps {
  cycleStreak: number;
  dayStreak: number;
}

const StreakPanels = ({ cycleStreak, dayStreak }: StreakPanelsProps) => {
  const cycleXpBonus = Math.min(cycleStreak * 10, 40);
  const cycleBonusPercentage = Math.min(cycleStreak * 25, 100);
  
  const loginXpBonus = Math.min(Math.floor(dayStreak / 3) * 5, 25);
  const loginCoinsEarned = Math.floor(dayStreak / 5) * 10;

  // Marcos corretos baseados no sistema real
  const nextCycleMilestone = cycleStreak + 1; // Bônus a cada ciclo
  const nextLoginReward = Math.ceil((dayStreak + 1) / 3) * 3; // Bônus a cada 3 dias
  
  // Calcular progressPercentage para o painel de dias consecutivos
  const progressPercentage = dayStreak === 0 ? 0 : Math.min(((dayStreak % 3) / 3) * 100, 100);
  
  // Textos dinâmicos para os marcos
  const loginMarcoText = dayStreak === 0 ? "Comece estudando hoje" : `Próximo bônus em ${nextLoginReward - dayStreak} dia${nextLoginReward - dayStreak > 1 ? 's' : ''}`;

  // Sistema de momentum para cycles
  const momentumData = useMomentumLevel(cycleStreak);

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-w-[1600px] mx-auto"
    >
      {/* Painel Ciclos Consecutivos - COM SISTEMA MOMENTUM */}
      <div className="tactical-card-enhanced p-4 rounded-xl tactical-border-gold animate-slide-up-bounce" style={{ animationDelay: '50ms' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TacticalRadar className="w-4 h-4 text-tactical-gold" />
            <h3 className="tactical-command text-sm text-tactical-gold">Ciclos Consecutivos</h3>
          </div>
          <span className={`text-2xl font-bold tactical-mono ${momentumData.level > 0 ? `momentum-text-${momentumData.level}` : 'momentum-text-inactive'}`}>
            {cycleStreak}
          </span>
        </div>
        
        {cycleStreak > 0 && (
          <div className="flex gap-2 mb-3">
            <div 
              className="bg-tactical-success/20 rounded px-2 py-1 tactical-border-subtle animate-scale-in"
            >
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-tactical-success" />
                <span className="tactical-label text-xs text-tactical-success">+{cycleXpBonus}% XP</span>
              </div>
            </div>
            
            <div 
              className="bg-tactical-gold/20 rounded px-2 py-1 tactical-border-gold animate-scale-in"
            >
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-tactical-gold" />
                <span className="tactical-label text-xs text-tactical-gold">+{cycleBonusPercentage}% Bônus</span>
              </div>
            </div>
          </div>
        )}
        
        {/* BARRA DE MOMENTUM GAMIFICADA */}
        <div className="relative w-full h-2 bg-tactical-darkGray rounded-full overflow-hidden">
          <div
            className={`h-full ${momentumData.cssClass} animate-progress-fill`} 
            style={{ width: cycleStreak > 0 ? '100%' : '0%', animationDelay: '200ms' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-scan"></div>
          </div>
        </div>
        <p className={`text-xs mt-1 ${momentumData.level > 0 ? `momentum-text-${momentumData.level}` : 'momentum-text-inactive'}`}>
          {momentumData.title}
        </p>
      </div>

      {/* Painel Dias Consecutivos - Mantém o sistema original */}
      <div className="tactical-card-enhanced p-4 rounded-xl tactical-border-gold animate-slide-up-bounce" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TacticalRadar className="w-4 h-4 text-tactical-gold" />
            <h3 className="tactical-command text-sm text-tactical-gold">Dias Consecutivos</h3>
          </div>
          <span className="text-2xl font-bold text-tactical-gold tactical-mono">{dayStreak}</span>
        </div>
        
        {dayStreak > 0 && (
          <div className="flex gap-2 mb-3">
            {loginXpBonus > 0 && (
              <div 
                className="bg-tactical-success/20 rounded px-2 py-1 tactical-border-subtle animate-scale-in"
              >
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-tactical-success" />
                  <span className="tactical-label text-xs text-tactical-success">+{loginXpBonus}% XP</span>
                </div>
              </div>
            )}
            
            {loginCoinsEarned > 0 && (
              <div 
                className="bg-tactical-gold/20 rounded px-2 py-1 tactical-border-gold animate-scale-in"
              >
                <div className="flex items-center gap-1">
                  <TacticalCoin className="w-3 h-3 text-tactical-gold" />
                  <span className="tactical-label text-xs text-tactical-gold">+{loginCoinsEarned} Gold</span>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="relative w-full h-2 bg-tactical-darkGray rounded-full overflow-hidden">
          <div
            className="h-full tactical-gradient-gold animate-progress-fill" 
            style={{ width: `${progressPercentage}%`, animationDelay: '250ms' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-scan"></div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1">{loginMarcoText}</p>
      </div>
    </div>
  );
};

export default StreakPanels;
