
import { formatDuration } from '@/utils/blockGenerator';

interface StatsSectionProps {
  stats: {
    totalBlocks: number;
    totalHours: number;
    averageDuration: number;
    completedBlocks: number;
  };
}

const StatsSection = ({ stats }: StatsSectionProps) => {
  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="flex flex-wrap items-center gap-4 sm:gap-8 tactical-body text-xs sm:text-sm tactical-card-enhanced rounded-xl p-3 sm:p-4 tactical-border-subtle w-full overflow-x-auto carbon-fiber">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-2 h-2 bg-tactical-gold rounded-full tactical-glow-gold"></div>
          <span className="tactical-data-display text-tactical-gold">{stats.totalBlocks}</span> 
          <span className="text-white">blocos</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-2 h-2 bg-tactical-gold rounded-full tactical-glow-gold"></div>
          <span className="tactical-data-display text-tactical-gold">{stats.totalHours}h</span> 
          <span className="text-white">total</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-2 h-2 bg-tactical-warning rounded-full"></div>
          <span className="tactical-data-display text-tactical-warning">{formatDuration(stats.averageDuration)}</span> 
          <span className="text-white">média</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-2 h-2 bg-tactical-success rounded-full"></div>
          <span className="tactical-data-display text-tactical-success">{stats.completedBlocks}</span> 
          <span className="text-white">completos</span>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
