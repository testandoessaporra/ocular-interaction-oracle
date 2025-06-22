
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';

import { Trophy, Star, Shield, Zap } from '@/components/icons';

const ProfileSection = () => {
  const { userProgress } = useUser();

  const currentProgress = userProgress || {
    level: 1,
    currentXP: 0,
    xpToNextLevel: 100,
    totalXP: 0,
    coins: 0,
    class: 'Recruta',
    cycleStreak: 0,
    streak: 0,
    streakProtectionShields: 0
  };

  const progressPercentage = (currentProgress.currentXP / currentProgress.xpToNextLevel) * 100;

  return (
    <div className="animate-slide-up-bounce" style={{ animationDelay: '50ms' }}>
      <Card className="tactical-card-enhanced tactical-border-gold-active carbon-fiber">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar e Info Principal */}
            <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
              <div
                className="relative hover-scale">
                <div className="w-20 h-20 rounded-full tactical-gradient-gold flex items-center justify-center tactical-border-gold-active border-2">
                  <Trophy className="w-10 h-10 text-tactical-black" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-tactical-gold tactical-border-gold border-2 flex items-center justify-center">
                  <span className="text-tactical-black text-xs font-bold">{currentProgress.level}</span>
                </div>
              </div>

              <div className="text-center sm:text-left flex-1">
                <h3 className="tactical-command text-xl text-tactical-gold font-bold mb-1">
                  {currentProgress.class}
                </h3>
                <p className="tactical-body text-white text-sm mb-3">
                  Nível {currentProgress.level} • {currentProgress.totalXP.toLocaleString()} XP Total
                </p>
                
                {/* Barra de Progresso */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="tactical-body text-tactical-disabledGray">Progresso</span>
                    <span className="tactical-data-display text-tactical-gold">
                      {currentProgress.currentXP}/{currentProgress.xpToNextLevel} XP
                    </span>
                  </div>
                  <div className="h-2 bg-tactical-darkGray rounded-full tactical-border-gold overflow-hidden">
                    <div
                      className="h-full tactical-gradient-gold animate-progress-fill" 
                      style={{ width: `${progressPercentage}%`, animationDelay: '300ms' }}/>
                  </div>
                </div>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="flex gap-4">
              <div
                className="text-center hover-scale animate-fade-in-scale" style={{ animationDelay: '150ms' }}>
                <div className="w-12 h-12 rounded-lg bg-tactical-gold/20 tactical-border-gold flex items-center justify-center mb-2">
                  <Zap className="w-6 h-6 text-tactical-gold" />
                </div>
                <p className="tactical-data-display text-tactical-gold text-lg font-bold">
                  {currentProgress.cycleStreak || 0}
                </p>
                <p className="tactical-body text-tactical-disabledGray text-xs">Streak</p>
              </div>

              <div
                className="text-center hover-scale animate-fade-in-scale" style={{ animationDelay: '200ms' }}>
                <div className="w-12 h-12 rounded-lg bg-tactical-gold/20 tactical-border-gold flex items-center justify-center mb-2">
                  <Shield className="w-6 h-6 text-tactical-gold" />
                </div>
                <p className="tactical-data-display text-tactical-gold text-lg font-bold">
                  {currentProgress.streakProtectionShields || 0}
                </p>
                <p className="tactical-body text-tactical-disabledGray text-xs">Escudos</p>
              </div>

              <div
                className="text-center hover-scale animate-fade-in-scale" style={{ animationDelay: '250ms' }}>
                <div className="w-12 h-12 rounded-lg bg-tactical-gold/20 tactical-border-gold flex items-center justify-center mb-2">
                  <Star className="w-6 h-6 text-tactical-gold" />
                </div>
                <p className="tactical-data-display text-tactical-gold text-lg font-bold">
                  {currentProgress.coins || 0}
                </p>
                <p className="tactical-body text-tactical-disabledGray text-xs">Moedas</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSection;
