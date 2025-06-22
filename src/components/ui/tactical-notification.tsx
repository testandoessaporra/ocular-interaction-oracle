import React from 'react';
import { toast } from 'sonner';

interface TacticalNotificationOptions {
  title: string;
  description: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
}

const getNotificationStyles = (type: string) => {
  const baseStyles = "tactical-card-enhanced backdrop-blur-md border-2 shadow-2xl rounded-2xl";
  
  switch (type) {
    case 'success':
      return `${baseStyles} tactical-border-gold bg-tactical-darkGray/95 text-tactical-gold`;
    case 'warning':
      return `${baseStyles} border-tactical-warning/50 bg-tactical-darkGray/95 text-tactical-warning`;
    case 'error':
      return `${baseStyles} border-red-500/50 bg-tactical-darkGray/95 text-red-400`;
    case 'info':
    default:
      return `${baseStyles} tactical-border-gold bg-tactical-darkGray/95 text-tactical-gold`;
  }
};

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return '✅';
    case 'warning':
      return '⚠️';
    case 'error':
      return '❌';
    case 'info':
    default:
      return 'ℹ️';
  }
};

export const showTacticalNotification = ({ 
  title, 
  description, 
  type = 'info', 
  duration = 3000 
}: TacticalNotificationOptions) => {
  const icon = getIcon(type);
  const className = getNotificationStyles(type);

  return toast(
    <div className="flex flex-col gap-1">
      <div className="font-rajdhani font-bold text-sm tracking-wide uppercase">
        {icon} {title}
      </div>
      <div className="font-inter text-xs opacity-90">
        {description}
      </div>
    </div>,
    {
      duration,
      className,
      style: {
        background: 'rgba(26, 26, 26, 0.95)',
        border: type === 'success' ? '2px solid rgba(255, 215, 0, 0.5)' :
                type === 'warning' ? '2px solid rgba(255, 193, 7, 0.5)' :
                type === 'error' ? '2px solid rgba(239, 68, 68, 0.5)' :
                '2px solid rgba(255, 215, 0, 0.5)',
        backdropFilter: 'blur(12px)',
        borderRadius: '16px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
      }
    }
  );
};

// Funções específicas para cada tipo
export const showSuccessNotification = (title: string, description: string) => 
  showTacticalNotification({ title, description, type: 'success' });

export const showWarningNotification = (title: string, description: string) => 
  showTacticalNotification({ title, description, type: 'warning' });

export const showErrorNotification = (title: string, description: string) => 
  showTacticalNotification({ title, description, type: 'error' });

export const showInfoNotification = (title: string, description: string) => 
  showTacticalNotification({ title, description, type: 'info' });

// Funções específicas do sistema de gamificação
export const showLevelUpNotification = (newLevel: number, newClass: string) => 
  showTacticalNotification({
    title: 'LEVEL UP!',
    description: `Parabéns! Você alcançou o nível ${newLevel} - ${newClass}`,
    type: 'success'
  });

export const showMedalNotification = (medalName: string) => 
  showTacticalNotification({
    title: 'NOVA MEDALHA!',
    description: `Você conquistou: ${medalName}`,
    type: 'success'
  });

export const showCycleCompletedNotification = () => 
  showTacticalNotification({
    title: 'CICLO FINALIZADO!',
    description: 'Missão cumprida com sucesso! Bônus de XP e moedas recebidos!',
    type: 'success'
  });

export const showStreakIncreasedNotification = (newStreak: number, type: 'login' | 'cycle' = 'cycle') => {
  const messages = {
    login: {
      title: 'LOGIN STREAK!',
      description: `${newStreak} dias consecutivos! Seus bônus de XP aumentaram!`
    },
    cycle: {
      title: 'CYCLE STREAK!',
      description: `${newStreak} ciclos consecutivos! Seus bônus aumentaram!`
    }
  };

  const config = messages[type];
  showTacticalNotification({
    title: config.title,
    description: config.description,
    type: 'success'
  });
};

export const showStreakLostNotification = (type: 'login' | 'cycle' = 'cycle') => {
  const messages = {
    login: {
      title: 'LOGIN STREAK PERDIDA!',
      description: 'Sua sequência de logins foi resetada. Faça login diário para recuperá-la!'
    },
    cycle: {
      title: 'CYCLE STREAK PERDIDA!',
      description: 'Sua streak foi resetada. Complete ciclos sem editar para recuperá-la!'
    }
  };

  const config = messages[type];
  showTacticalNotification({
    title: config.title,
    description: config.description,
    type: 'warning'
  });
};

export const showStreakProtectedNotification = (type: 'login' | 'cycle' = 'cycle') => {
  const messages = {
    login: {
      title: 'LOGIN STREAK PROTEGIDA!',
      description: 'Escudo de proteção usado! Sua sequência de logins foi preservada!'
    },
    cycle: {
      title: 'CYCLE STREAK PROTEGIDA!',
      description: 'Escudo de proteção usado! Sua streak de ciclos foi preservada!'
    }
  };

  const config = messages[type];
  showTacticalNotification({
    title: config.title,
    description: config.description,
    type: 'info'
  });
};

// Interceptar e substituir qualquer toast genérico que possa estar sendo usado
export const interceptGenericToasts = () => {
  // Substituir qualquer função toast genérica que possa estar sendo importada
  if (typeof window !== 'undefined') {
    const originalToast = (window as any).toast;
    if (originalToast) {
      (window as any).toast = showTacticalNotification;
    }
  }
};

// Chamar a interceptação quando o módulo for carregado
if (typeof window !== 'undefined') {
  interceptGenericToasts();
}
