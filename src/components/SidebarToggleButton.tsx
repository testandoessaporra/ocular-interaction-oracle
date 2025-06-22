
;
import { useSidebar } from '@/components/ui/sidebar';
import { Menu } from '@/components/icons';

const SidebarToggleButton = () => {
  const { toggleSidebar, state, isMobile } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className={`
        fixed z-30
        transition-all duration-300 ease-out
        hover:scale-105
        active:scale-95
        flex items-center justify-center
        group
        tactical-card-enhanced
        ${isMobile 
          ? 'bottom-4 right-4 w-12 h-12 tactical-shadow-gold' 
          : state === 'expanded' 
            ? 'top-1/2 -translate-y-1/2 left-[240px] w-8 h-16 rounded-r-xl rounded-l-none border-l-0 tactical-shadow-gold' 
            : 'top-1/2 -translate-y-1/2 left-0 w-12 h-12 tactical-shadow-gold'
        }
      `}
      aria-label="Toggle sidebar"
    >
      <div className="relative z-10">
        <Menu className="w-5 h-5 text-tactical-gold group-hover:text-tactical-darkGold transition-all duration-300 group-hover:scale-110 tactical-text-glow-animated" />
      </div>
      
      {/* Efeito de brilho sutil no hover */}
      <div className="absolute inset-0 rounded-inherit bg-gradient-to-br from-tactical-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};

export default SidebarToggleButton;
