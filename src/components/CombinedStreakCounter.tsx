
import React from 'react';
;
import { TacticalMedal, TacticalCoin } from '@/components/TacticalIcons';
import { UserProgress } from '@/hooks/useGamification';
import { useStreakEffects } from '@/hooks/useStreakEffects';
import { useMomentumLevel } from '@/hooks/useMomentumLevel';
import { Shield, TrendingUp, Zap, Calendar } from '@/components/icons';

interface CombinedStreakCounterProps {
  userProgress: UserProgress;
}

const CombinedStreakCounter = ({ userProgress }: CombinedStreakCounterProps) => {
  const { cycleStreak, loginStreak, streakProtectionShields } = userProgress;
  
  // Efeitos visuais para as streaks
  useStreakEffects({ 
    value: cycleStreak, 
    type: 'cycle', 
    elementId: 'cycle-streak-counter' 
  });
  
  useStreakEffects({ 
    value: loginStreak, 
    type: 'login', 
    elementId: 'login-streak-counter' 
  });
  
  // Sistema de momentum para cycles
  const momentumData = useMomentumLevel(cycleStreak);
  
  // Calcular bônus do cycle streak
  const cycleXpBonus = Math.min(cycleStreak * 10, 40);
  const cycleBonusPercentage = Math.min(cycleStreak * 25, 100);
  
  // Calcular bônus do login streak
  const loginXpBonus = Math.min(Math.floor(loginStreak / 3) * 5, 25);
  const loginCoinsEarned = Math.floor(loginStreak / 5) * 10;
  
  // Marcos corretos baseados no sistema real
  const nextCycleMilestone = cycleStreak + 1; // Bônus a cada ciclo
  const nextLoginReward = Math.ceil((loginStreak + 1) / 3) * 3; // Bônus a cada 3 dias
  
  return (
    <div className="tactical-card rounded-lg p-4 border border-yellow-500/30 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm">
      <div className="flex flex-col gap-4">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-400/20 rounded border border-yellow-400/30">
              <TacticalMedal className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="tactical-command text-sm text-yellow-400">STREAKS DE DISCIPLINA</h3>
              <p className="tactical-label text-xs text-gray-400">Sistema de Recompensas</p>
            </div>
          </div>
          
          {/* Escudos de Proteção */}
          {streakProtectionShields > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded border border-blue-400/30">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="tactical-label text-xs text-blue-400">{streakProtectionShields}</span>
            </div>
          )}
        </div>

        {/* Contadores Principais */}
        <div className="grid grid-cols-2 gap-3">
          {/* Cycle Streak - COM MOMENTUM */}
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
            <div className="text-center mb-2">
              <div 
                id="cycle-streak-counter"
                className={`tactical-data-display text-2xl transition-all duration-300 ${momentumData.level > 0 ? `momentum-text-${momentumData.level}` : 'momentum-text-inactive'}`}
              >
                {cycleStreak}
              </div>
              <p className="tactical-label text-xs text-gray-400">Ciclos</p>
            </div>
            
            {cycleStreak > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3 text-green-400" />
                  <span className="tactical-label text-xs text-green-400">+{cycleXpBonus}%</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3 text-blue-400" />
                  <span className="tactical-label text-xs text-blue-400">+{cycleBonusPercentage}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Login Streak */}
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
            <div className="text-center mb-2">
              <div 
                id="login-streak-counter"
                className="tactical-data-display text-2xl text-green-400 transition-all duration-300"
              >
                {loginStreak}
              </div>
              <p className="tactical-label text-xs text-gray-400">Dias</p>
            </div>
            
            {loginStreak > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3 text-green-400" />
                  <span className="tactical-label text-xs text-green-400">+{loginXpBonus}%</span>
                </div>
                {loginCoinsEarned > 0 && (
                  <div className="flex items-center justify-center gap-1">
                    <TacticalCoin className="w-3 h-3 text-yellow-400" />
                    <span className="tactical-label text-xs text-yellow-400">+{loginCoinsEarned}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Próximos Marcos */}
        <div className="space-y-2">
          {/* MOMENTUM BAR PARA CYCLES */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="tactical-label text-xs text-gray-400">Momentum de ciclos:</span>
              <span className={`tactical-label text-xs ${momentumData.level > 0 ? `momentum-text-${momentumData.level}` : 'momentum-text-inactive'}`}>
                {momentumData.title}
              </span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full transition-all duration-500 ${momentumData.cssClass}`}
                style={{ width: cycleStreak > 0 ? "100%" : "0%" }}
              />
            </div>
          </div>

          {/* Login Streak Progress */}
          {loginStreak < 30 && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="tactical-label text-xs text-gray-400">Próximo bônus login:</span>
                <span className="tactical-label text-xs text-green-400">{nextLoginReward}</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-400 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${((loginStreak % 3) / 3) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Dicas */}
        {(cycleStreak === 0 || loginStreak === 0) && (
          <div className="pt-2 border-t border-gray-700/30">
            <div className="space-y-1">
              {cycleStreak === 0 && (
                <p className="tactical-body text-xs text-gray-400 text-center">
                  Complete um ciclo sem editar para começar sua streak de ciclos!
                </p>
              )}
              {loginStreak === 0 && (
                <p className="tactical-body text-xs text-gray-400 text-center">
                  Faça login diariamente para ganhar bônus e escudos de proteção!
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CombinedStreakCounter;
