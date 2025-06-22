
import { useState } from 'react';
;
import { useSidebar } from '@/components/ui/sidebar';
import { Menu, X } from '@/components/icons';

const MobileSidebarTrigger = () => {
  const { toggleSidebar, openMobile } = useSidebar();
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    setIsPressed(true);
    toggleSidebar();
    setTimeout(() => setIsPressed(false), 150);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        fixed bottom-4 right-4 z-50 md:hidden
        w-12 h-12 rounded-full
        bg-gradient-to-r from-yellow-900/90 to-orange-900/80
        border border-yellow-500/50
        shadow-lg backdrop-blur-sm
        flex items-center justify-center
        transition-all duration-300 ease-out
        hover:scale-110 hover:shadow-xl
        active:scale-95
        ${isPressed ? 'scale-95' : ''}
        ${openMobile ? 'bg-gradient-to-r from-orange-900/90 to-red-900/80' : ''}
      `}
      aria-label={openMobile ? 'Fechar menu' : 'Abrir menu'}
    >
      <div className={`transition-transform duration-300 ${openMobile ? 'rotate-180' : 'rotate-0'}`}>
        {openMobile ? (
          <X className="w-5 h-5 text-yellow-400" />
        ) : (
          <Menu className="w-5 h-5 text-yellow-400" />
        )}
      </div>
      
      {/* Pulse effect when closed */}
      {!openMobile && (
        <div className="absolute inset-0 rounded-full bg-yellow-400/20 animate-ping"></div>
      )}
    </button>
  );
};

export default MobileSidebarTrigger;
