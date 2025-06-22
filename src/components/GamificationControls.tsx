
;
import { Button } from '@/components/ui/button';
import { useGamification } from '@/hooks/useGamification';
import { useUser } from '@/contexts/UserContext';
import { useState } from 'react';
import { Volume2, VolumeX, RotateCcw } from '@/components/icons';

const GamificationControls = () => {
  const { toggleSound, isSoundEnabled } = useGamification();
  const { resetAllProgress } = useUser();
  const [soundEnabled, setSoundEnabled] = useState(isSoundEnabled());

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundEnabled(newState);
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
      resetAllProgress();
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleSound}
        className={`w-8 h-8 rounded-lg transition-all duration-200 ${
          soundEnabled 
            ? 'text-white hover:text-gray-300 hover:bg-gray-800/50' 
            : 'text-gray-500 hover:text-gray-400 hover:bg-gray-800/50'
        }`}
        title={soundEnabled ? 'Desativar som' : 'Ativar som'}
      >
        {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleReset}
        className="w-8 h-8 rounded-lg text-gray-500 hover:text-gray-400 hover:bg-gray-800/50 transition-all duration-200"
        title="Resetar dados"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default GamificationControls;
