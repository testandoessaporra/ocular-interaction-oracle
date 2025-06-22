
import React from 'react';
;
import { TacticalMedal, TacticalCoin } from '@/components/TacticalIcons';
import { UserProgress } from '@/hooks/useGamification';
import { useIsMobile } from '@/hooks/use-mobile';
import { useStreakEffects } from '@/hooks/useStreakEffects';
import { useMomentumLevel } from '@/hooks/useMomentumLevel';
import CombinedStreakCounter from '@/components/CombinedStreakCounter';
import { Shield, TrendingUp, Zap, Calendar } from '@/components/icons';

interface CycleStreakCounterProps {
  userProgress: UserProgress;
}

const CycleStreakCounter = ({ userProgress }: CycleStreakCounterProps) => {
  const isMobile = useIsMobile();
  const { cycleStreak, loginStreak, streakProtectionShields } = userProgress;
  
  // SEMPRE executar todos os hooks, independente da condição
  useStreakEffects({ 
    value: cycleStreak, 
    type: 'cycle', 
    elementId: isMobile ? 'cycle-streak-counter' : 'desktop-cycle-streak-counter' 
  });
  
  useStreakEffects({ 
    value: loginStreak, 
    type: 'login', 
    elementId: isMobile ? 'login-streak-counter' : 'desktop-login-streak-counter' 
  });
  
  // Sistema de momentum para cycles
  const momentumData = useMomentumLevel(cycleStreak);
  
  // Se for mobile, usar o contador combinado
  if (isMobile) {
    return <CombinedStreakCounter userProgress={userProgress} />;
  }

  // Layout desktop - mostrar cycle streak e login streak lado a lado
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
    <div className="flex gap-4">
      {/* Cycle Streak Counter - COM MOMENTUM */}
      <div className="tactical-card rounded-lg p-3 border border-yellow-500/30 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm flex-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-yellow-400/20 rounded border border-yellow-400/30">
              <TacticalMedal className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-center">
              <h3 className="tactical-command text-xs text-yellow-400">CICLOS CONSECUTIVOS</h3>
            </div>
          </div>

          <div className="text-center">
            <div 
              id="desktop-cycle-streak-counter"
              className={`tactical-data-display text-2xl transition-all duration-300 ${momentumData.level > 0 ? `momentum-text-${momentumData.level}` : 'momentum-text-inactive'}`}
            >
              {cycleStreak}
            </div>
          </div>

          {cycleStreak > 0 && (
            <div className="flex gap-2">
              <div className="bg-gray-800/50 rounded px-2 py-1 border border-gray-700/50">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-green-400" />
                  <span className="tactical-label text-xs text-green-400">+{cycleXpBonus}%</span>
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded px-2 py-1 border border-gray-700/50">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-blue-400" />
                  <span className="tactical-label text-xs text-blue-400">+{cycleBonusPercentage}%</span>
                </div>
              </div>
            </div>
          )}

          {/* MOMENTUM BAR */}
          <div className="min-w-[80px]">
            <div className="flex justify-between items-center mb-1">
              <span className="tactical-label text-xs text-gray-400">Momentum:</span>
              <span className={`tactical-label text-xs ${momentumData.level > 0 ? `momentum-text-${momentumData.level}` : 'momentum-text-inactive'}`}>
                {momentumData.level}
              </span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-1">
              <div 
                className={`h-1 rounded-full transition-all duration-500 ${momentumData.cssClass}`}
                style={{ width: cycleStreak > 0 ? "100%" : "0%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Login Streak Counter */}
      <div className="tactical-card rounded-lg p-3 border border-green-500/30 bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-sm flex-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-400/20 rounded border border-green-400/30">
              <Calendar className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-center">
              <h3 className="tactical-command text-xs text-green-400">DIAS CONSECUTIVOS</h3>
            </div>
          </div>

          {streakProtectionShields > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded border border-blue-400/30">
              <Shield className="w-3 h-3 text-blue-400" />
              <span className="tactical-label text-xs text-blue-400">{streakProtectionShields}</span>
            </div>
          )}

          <div className="text-center">
            <div 
              id="desktop-login-streak-counter"
              className="tactical-data-display text-2xl text-green-400 transition-all duration-300"
            >
              {loginStreak}
            </div>
          </div>

          {loginStreak > 0 && (
            <div className="flex gap-2">
              <div className="bg-gray-800/50 rounded px-2 py-1 border border-gray-700/50">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-green-400" />
                  <span className="tactical-label text-xs text-green-400">+{loginXpBonus}%</span>
                </div>
              </div>
              
              {loginCoinsEarned > 0 && (
                <div className="bg-gray-800/50 rounded px-2 py-1 border border-gray-700/50">
                  <div className="flex items-center gap-1">
                    <TacticalCoin className="w-3 h-3 text-yellow-400" />
                    <span className="tactical-label text-xs text-yellow-400">+{loginCoinsEarned}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {loginStreak < 30 && (
            <div className="min-w-[80px]">
              <div className="flex justify-between items-center mb-1">
                <span className="tactical-label text-xs text-gray-400">Próximo:</span>
                <span className="tactical-label text-xs text-green-400">{nextLoginReward}</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-1">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-400 h-1 rounded-full transition-all duration-500"
                  style={{ width: `${((loginStreak % 3) / 3) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CycleStreakCounter;
