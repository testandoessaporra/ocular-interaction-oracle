;
import MedalCard from '@/components/MedalCard';
import { MEDALS_CONFIG } from '@/constants/medals';
import { UserProgress } from '@/hooks/useGamification';
import { Trophy } from '@/components/icons';

interface MedalsGridProps {
  userProgress: UserProgress;
}

const MedalsGrid = ({ userProgress }: MedalsGridProps) => {
  const medals = MEDALS_CONFIG.map(medal => ({
    ...medal,
    currentValue: userProgress.level,
    isUnlocked: userProgress.level >= medal.requirement
  }));

  return (
    <div className="space-y-3">
      <h3 className="tactical-command text-base flex items-center gap-2 text-white">
        <Trophy className="w-4 h-4 text-yellow-400" />
        MEDALHAS DISPONÍVEIS
      </h3>
      
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger-container">
        {medals.map((medal, index) => (
          <div key={medal.id} className="animate-slide-up-bounce" style={{ animationDelay: `${50 + (index * 50)}ms` }}>
            <MedalCard medal={medal} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedalsGrid;
