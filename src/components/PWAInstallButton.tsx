
import { logger } from '@/utils/logger';
import { useState, useEffect } from 'react';
import { Download, X } from '@/components/icons';
;

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    // Auto-hide banner after 10 seconds
    const timer = setTimeout(() => {
      setShowInstallBanner(false);
    }, 10000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      logger.info('PWA installed');
    }
    
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
  };

  // Don't show if already installed or no prompt available
  if (isStandalone || (!deferredPrompt && !isIOS) || !showInstallBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 tactical-card border border-yellow-500/50 bg-gradient-to-r from-yellow-900/30 to-orange-900/20 p-4 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="tactical-title text-sm text-yellow-400 mb-1">
            📱 Instalar App
          </h4>
          <p className="tactical-body text-xs text-white">
            {isIOS 
              ? 'Toque em "Compartilhar" → "Adicionar à Tela Inicial"'
              : 'Instale para acesso rápido e uso offline'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-2 ml-3">
          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstallClick}
              className="tactical-btn-primary px-3 py-2 rounded-lg text-xs flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Instalar
            </button>
          )}
          
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallButton;
