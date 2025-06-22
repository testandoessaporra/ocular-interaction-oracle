
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
;
import React from 'react';
import { LucideIcon } from '@/components/icons';

interface Medal {
  id: number;
  title: string;
  description: string;
  requirement: number;
  currentValue: number;
  type: string;
  icon: LucideIcon;
  isUnlocked: boolean;
}

interface MedalCardProps {
  medal: Medal;
}

const MedalCard = React.memo(({ medal }: MedalCardProps) => {
  const { title, description, requirement, currentValue, icon: Icon, isUnlocked } = medal;
  
  const progress = Math.min((currentValue / requirement) * 100, 100);

  return (
    <Card className={`transition-all duration-300 rounded-2xl tactical-card-enhanced ${
      isUnlocked 
        ? 'tactical-glow-gold tactical-border-gold-active' 
        : 'tactical-border-subtle'
    }`}>
      <CardContent className="p-3">
        <div className="flex items-start gap-2.5">
          <div className={`p-1.5 rounded-xl ${
            isUnlocked 
              ? 'bg-tactical-gold/20 text-tactical-gold tactical-glow-gold' 
              : 'bg-tactical-mediumGray text-tactical-disabledGray'
          }`}>
            <Icon className="w-4 h-4" />
          </div>
          
          <div className="flex-1 space-y-2">
            <div>
              <h3 className={`tactical-subtitle text-sm ${
                isUnlocked ? 'text-tactical-gold' : 'text-white'
              }`}>
                {title}
              </h3>
              <p className={`tactical-body text-xs ${
                isUnlocked ? 'text-yellow-200' : 'text-gray-300'
              }`}>{description}</p>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className={`tactical-label ${
                  isUnlocked ? 'text-tactical-gold' : 'text-tactical-disabledGray'
                }`}>
                  Progresso: {currentValue}/{requirement}
                </span>
                <span className={`tactical-mono text-xs ${
                  isUnlocked ? 'text-tactical-gold' : 'text-tactical-disabledGray'
                }`}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div className={`h-1.5 rounded-full overflow-hidden ${
                isUnlocked ? 'bg-tactical-darkGray' : 'bg-tactical-darkGray'
              }`}>
                <div
                  className={`h-full rounded-full animate-progress-fill ${
                    isUnlocked 
                      ? 'bg-gradient-to-r from-tactical-gold to-tactical-darkGold' 
                      : 'bg-tactical-disabledGray'
                  }`}
                  style={{ width: `${progress}%`, animationDelay: '400ms' }}
                />
              </div>
            </div>
            
            {isUnlocked && (
              <div className="flex items-center gap-1 tactical-element text-tactical-gold text-xs tactical-text-glow-animated">
                <Icon className="w-3 h-3" />
                MEDALHA CONQUISTADA!
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

MedalCard.displayName = 'MedalCard';

export default MedalCard;
