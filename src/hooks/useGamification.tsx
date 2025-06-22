
import { useCallback, useRef } from 'react';
import { useGamificationLogic } from '@/hooks/useGamificationLogic';
import { 
  showLevelUpNotification,
  showMedalNotification,
  showCycleCompletedNotification,
  showStreakIncreasedNotification,
  showStreakLostNotification,
  showStreakProtectedNotification,
  showSuccessNotification
} from '@/components/ui/tactical-notification';

// Re-export UserProgress from gamificationLogic
export type { UserProgress } from '@/hooks/useGamificationLogic';

interface FloatingXPOptions {
  x: number;
  y: number;
  xp: number;
  color?: string;
}

interface SoundOptions {
  volume?: number;
  enabled?: boolean;
}

export const useGamification = () => {
  const soundEnabled = useRef(localStorage.getItem('soundEnabled') !== 'false');
  const audioContext = useRef<AudioContext | null>(null);
  
  // Import gamification logic functions
  const {
    calculateProgressFromSession,
    calculateCycleCompletionBonus,
    resetCycleStreak,
    consumeProtectionShield,
    initializeProgress
  } = useGamificationLogic();

  const initAudio = useCallback(() => {
    if (!audioContext.current && soundEnabled.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const playXPSound = useCallback((options: SoundOptions = {}) => {
    if (!soundEnabled.current || options.enabled === false) return;
    
    initAudio();
    if (!audioContext.current) return;

    const oscillator = audioContext.current.createOscillator();
    const gainNode = audioContext.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.current.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.current.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0, audioContext.current.currentTime);
    gainNode.gain.linearRampToValueAtTime(options.volume || 0.1, audioContext.current.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 0.3);
    
    oscillator.start(audioContext.current.currentTime);
    oscillator.stop(audioContext.current.currentTime + 0.3);
  }, [initAudio]);

  const playLevelUpSound = useCallback((options: SoundOptions = {}) => {
    if (!soundEnabled.current || options.enabled === false) return;
    
    initAudio();
    if (!audioContext.current) return;

    const frequencies = [523, 659, 784, 1047];
    let startTime = audioContext.current.currentTime;

    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.current!.createOscillator();
      const gainNode = audioContext.current!.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current!.destination);
      
      oscillator.frequency.setValueAtTime(freq, startTime);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(options.volume || 0.15, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.2);
      
      startTime += 0.15;
    });
  }, [initAudio]);

  const playMedalSound = useCallback((options: SoundOptions = {}) => {
    if (!soundEnabled.current || options.enabled === false) return;
    
    initAudio();
    if (!audioContext.current) return;

    const frequencies = [440, 554, 659, 880, 1108];
    let startTime = audioContext.current.currentTime;

    frequencies.forEach((freq, index) => {
      const oscillator = audioContext.current!.createOscillator();
      const gainNode = audioContext.current!.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current!.destination);
      
      oscillator.frequency.setValueAtTime(freq, startTime);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(options.volume || 0.2, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + 0.4);
      
      startTime += 0.2;
    });
  }, [initAudio]);

  const showFloatingXP = useCallback((options: FloatingXPOptions) => {
    // Criar elemento de XP flutuante
    const element = document.createElement('div');
    element.className = 'fixed z-50 pointer-events-none font-bold text-2xl tactical-text-glow font-mono';
    element.style.left = `${options.x}px`;
    element.style.top = `${options.y}px`;
    element.style.color = options.color || '#F59E0B';
    element.textContent = `+${options.xp} XP`;
    element.style.transform = 'translateY(0px)';
    element.style.opacity = '1';
    element.style.transition = 'all 2s ease-out';
    
    document.body.appendChild(element);
    
    // Animar movimento para cima e fade out
    requestAnimationFrame(() => {
      element.style.transform = 'translateY(-80px)';
      element.style.opacity = '0';
    });
    
    // Criar efeito de confete
    createConfettiEffect(options.x, options.y);
    
    // Remover elemento após animação
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }, 2000);
  }, []);

  const createConfettiEffect = useCallback((centerX: number, centerY: number) => {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
    const confettiCount = 15;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'fixed z-40 pointer-events-none';
      confetti.style.width = '6px';
      confetti.style.height = '6px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = '50%';
      confetti.style.left = `${centerX + (Math.random() - 0.5) * 100}px`;
      confetti.style.top = `${centerY}px`;
      confetti.style.transform = 'scale(1)';
      confetti.style.transition = `all ${1.5 + Math.random()}s ease-out`;
      
      document.body.appendChild(confetti);
      
      // Animar confete
      requestAnimationFrame(() => {
        confetti.style.transform = `translateY(${100 + Math.random() * 200}px) scale(0)`;
        confetti.style.opacity = '0';
      });
      
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 3000);
    }
  }, []);

  const showLevelUpNotificationWithSound = useCallback((newLevel: number, newClass: string) => {
    playLevelUpSound();
    showLevelUpNotification(newLevel, newClass);
  }, [playLevelUpSound]);

  const showMedalNotificationWithSound = useCallback((medalName: string) => {
    playMedalSound();
    showMedalNotification(medalName);
  }, [playMedalSound]);

  const showCycleCompletedNotificationWithSound = useCallback(() => {
    showCycleCompletedNotification();
  }, []);

  const showStreakIncreasedNotificationWithSound = useCallback((newStreak: number, type: 'login' | 'cycle' = 'cycle') => {
    playMedalSound();
    showStreakIncreasedNotification(newStreak, type);
  }, [playMedalSound]);

  const showStreakLostNotificationWithSound = useCallback((type: 'login' | 'cycle' = 'cycle') => {
    showStreakLostNotification(type);
  }, []);

  const showStreakProtectedNotificationWithSound = useCallback((type: 'login' | 'cycle' = 'cycle') => {
    playMedalSound();
    showStreakProtectedNotification(type);
  }, [playMedalSound]);

  // Nova função para notificação de bloco completado usando o padrão tático
  const showBlockCompletedNotification = useCallback((subject: string, duration: string) => {
    showSuccessNotification(
      'BLOCO COMPLETADO!',
      `${subject} - ${duration} registrados`
    );
  }, []);

  const toggleSound = useCallback(() => {
    soundEnabled.current = !soundEnabled.current;
    localStorage.setItem('soundEnabled', soundEnabled.current.toString());
    return soundEnabled.current;
  }, []);

  return {
    showFloatingXP,
    showLevelUpNotification: showLevelUpNotificationWithSound,
    showMedalNotification: showMedalNotificationWithSound,
    showCycleCompletedNotification: showCycleCompletedNotificationWithSound,
    showStreakIncreasedNotification: showStreakIncreasedNotificationWithSound,
    showStreakLostNotification: showStreakLostNotificationWithSound,
    showStreakProtectedNotification: showStreakProtectedNotificationWithSound,
    showBlockCompletedNotification, // Nova função exportada
    playXPSound,
    playLevelUpSound,
    playMedalSound,
    toggleSound,
    isSoundEnabled: () => soundEnabled.current,
    // Export gamification logic functions
    calculateProgressFromSession,
    calculateCycleCompletionBonus,
    resetCycleStreak,
    consumeProtectionShield,
    initializeProgress
  };
};
