
import { TacticalCoin, TacticalMedal, TacticalSight } from "@/components/TacticalIcons";
import UserAvatar from "@/components/UserAvatar";
import { useUser } from "@/contexts/UserContext";

interface SidebarHeaderProps {
  levelUpGlow: boolean;
  medalPulse: boolean;
  showConfetti: boolean;
}

export const SidebarHeader = ({ levelUpGlow, medalPulse, showConfetti }: SidebarHeaderProps) => {
  const { userProgress } = useUser();
  
  // Calculate correct progress percentage for current level
  const progressPercentage = (userProgress.currentXP / userProgress.xpToNextLevel) * 100;

  return (
    <div className="p-3 border-b border-gray-800/30 tactical-sidebar-bg">
      <div className="flex items-center gap-2.5">
        <div className={`relative ${levelUpGlow ? 'level-up-glow' : ''}`}>
          <UserAvatar level={userProgress.level} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <TacticalSight className="w-3.5 h-3.5 text-yellow-400" />
            <p className="tactical-element text-white text-xs truncate">{userProgress.name}</p>
          </div>
        </div>
      </div>
      
      {/* XP Bar */}
      <div className="mt-2.5 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="tactical-element text-xs text-yellow-400">
            NÍVEL {userProgress.level} • {userProgress.class}
          </span>
          <span className="tactical-data-display text-xs text-white">
            {userProgress.currentXP}/{userProgress.xpToNextLevel}
          </span>
        </div>
        
        <div className={`xp-bar-container relative tactical-progress rounded-full h-2.5 overflow-hidden shimmer-effect border border-yellow-600/30 ${showConfetti ? 'xp-confetti active' : 'xp-confetti'}`}>
          <div 
            className="tactical-progress-fill h-full transition-all duration-1000 ease-out relative xp-bar-fill"
            style={{ width: `${progressPercentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
          </div>
          
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-2000"
            style={{ 
              width: '40%',
              transform: `translateX(${(progressPercentage / 100) * 250}%)`,
              opacity: progressPercentage > 0 ? 1 : 0
            }}
          ></div>
        </div>
        
        {/* Stats */}
        <div className="flex justify-between items-center tactical-label text-xs">
          <div className="coins-display flex items-center gap-1.5">
            <TacticalCoin className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-yellow-400 font-bold tactical-data-display">{userProgress.coins}</span>
          </div>
          <div className={`flex items-center gap-1.5 ${medalPulse ? 'medal-pulse-active' : ''}`}>
            <TacticalMedal className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-white font-semibold tactical-data-display">{userProgress.totalMedals}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
