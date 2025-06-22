
import React from 'react';

interface AnimatedProgressBarProps {
  progressPercentage: number;
}

const AnimatedProgressBar = ({ progressPercentage }: AnimatedProgressBarProps) => {
  return (
    <div className="w-full space-y-2">
      <h2 className="tactical-command text-xl text-white">Progresso do Ciclo</h2>
      
      {/* Barra de progresso slim com borda dourada e animação */}
      <div className="relative w-full h-4 bg-tactical-darkGray/50 rounded-full tactical-border-gold overflow-hidden">
        {/* Preenchimento animado */}
        <div
          className="h-full tactical-gradient-gold relative overflow-hidden" style={{ width: `${progressPercentage}%` }}>
          {/* Brilho que escaneia */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-scan"></div>
        </div>
        
        {/* Porcentagem embutida na ponta direita */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <span className="text-xs font-semibold text-tactical-gold" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnimatedProgressBar;
