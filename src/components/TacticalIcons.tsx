
import React from 'react';

// Ícone de moeda militar tática
export const TacticalCoin = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none"
  >
    <circle cx="12" cy="12" r="10" fill="currentColor" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="7" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1"/>
    <polygon points="12,6 15,9 12,12 9,9" fill="rgba(0,0,0,0.4)"/>
    <polygon points="12,12 15,15 12,18 9,15" fill="rgba(0,0,0,0.2)"/>
    <circle cx="12" cy="12" r="2" fill="rgba(0,0,0,0.5)"/>
  </svg>
);

// Ícone de medalha militar tática
export const TacticalMedal = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none"
  >
    <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" 
          fill="currentColor" 
          stroke="currentColor" 
          strokeWidth="1"/>
    <circle cx="12" cy="10" r="3" fill="rgba(0,0,0,0.3)"/>
    <path d="M8 16l4-2 4 2v6l-4-2-4 2z" 
          fill="currentColor" 
          stroke="currentColor" 
          strokeWidth="1"/>
  </svg>
);

// Ícone de mira tática para avatar
export const TacticalSight = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
    <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" strokeWidth="2"/>
    <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="2"/>
    <line x1="22" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="2"/>
    <line x1="6" y1="12" x2="2" y2="12" stroke="currentColor" strokeWidth="2"/>
    <line x1="19.07" y1="4.93" x2="16.24" y2="7.76" stroke="currentColor" strokeWidth="1"/>
    <line x1="7.76" y1="16.24" x2="4.93" y2="19.07" stroke="currentColor" strokeWidth="1"/>
    <line x1="19.07" y1="19.07" x2="16.24" y2="16.24" stroke="currentColor" strokeWidth="1"/>
    <line x1="7.76" y1="7.76" x2="4.93" y2="4.93" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

// Ícone de radar dashboard tático melhorado
export const TacticalRadar = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg 
    className={className}
    viewBox="0 0 24 24" 
    fill="none"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="rgba(218, 165, 32, 0.1)"/>
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" fill="rgba(218, 165, 32, 0.05)"/>
    <circle cx="12" cy="12" r="2" fill="currentColor"/>
    <line x1="12" y1="2" x2="12" y2="6" stroke="currentColor" strokeWidth="2"/>
    <line x1="12" y1="18" x2="12" y2="22" stroke="currentColor" strokeWidth="2"/>
    <line x1="22" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="2"/>
    <line x1="6" y1="12" x2="2" y2="12" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 12 L16 8" stroke="currentColor" strokeWidth="2" opacity="0.8"/>
    <circle cx="15" cy="9" r="1" fill="currentColor" opacity="0.6"/>
    <circle cx="9" cy="15" r="0.5" fill="currentColor" opacity="0.4"/>
  </svg>
);
