
import { useCallback } from 'react';

export const useTimerSounds = () => {
  const playAlarmSound = useCallback(() => {
    // Som tático único - diferente dos sons de XP/medalhas
    // Usando Web Audio API para criar um beep eletrônico tático
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Sequência de beeps táticos - 3 beeps rápidos
      const playBeep = (frequency: number, duration: number, delay: number = 0) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
          oscillator.type = 'square'; // Som mais tático
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
          gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        }, delay);
      };
      
      // Padrão tático: 3 beeps em sequência
      playBeep(800, 0.1, 0);    // Primeiro beep
      playBeep(1000, 0.1, 150); // Segundo beep (mais agudo)
      playBeep(800, 0.15, 300); // Terceiro beep (mais longo)
      
    } catch (error) {
      // Fallback para navegadores que não suportam Web Audio API
      const audio = new Audio();
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBDyN2e7MbCEfHnLN7NeWOQoUV7Dv3aVUEQxOqeHtrGcfBTqT2u7ObCgdHnDM7tyNNwgZab/u4a5YFA1Jn+PyvmwhBD+Y4uy2Zx4CIHrS8NeIKAcNecP++7AqBh1z0vL6s2shBSyG0+/Mgy4KI3bD9eaxpWM='
      audio.play().catch(() => {
        // Silenciar erros de áudio se o navegador bloquear
      });
    }
  }, []);

  return { playAlarmSound };
};
