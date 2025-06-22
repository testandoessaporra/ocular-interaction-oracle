
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGamification } from '@/hooks/useGamification';
import { setupGlobalMocks, setupDOMMocks, mockLocalStorage, mockAudioContext, cleanupMocks } from '../shared/testUtils';

describe('useGamification - Sound Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupGlobalMocks();
    setupDOMMocks();
    
    mockLocalStorage.getItem.mockReturnValue('true');
  });

  afterEach(() => {
    cleanupMocks();
  });

  describe('Sistema de Som', () => {
    it('deve tocar som de XP quando habilitado', () => {
      const { result } = renderHook(() => useGamification());

      result.current.playXPSound();

      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
      expect(mockAudioContext.createGain).toHaveBeenCalled();
    });

    it('deve tocar som de level up quando habilitado', () => {
      const { result } = renderHook(() => useGamification());

      result.current.playLevelUpSound();

      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
      expect(mockAudioContext.createGain).toHaveBeenCalled();
    });

    it('deve tocar som de medalha quando habilitado', () => {
      const { result } = renderHook(() => useGamification());

      result.current.playMedalSound();

      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
      expect(mockAudioContext.createGain).toHaveBeenCalled();
    });

    it('deve alternar configuração de som', () => {
      mockLocalStorage.getItem.mockReturnValue('true');

      const { result } = renderHook(() => useGamification());

      // Primeiro toggle - deve retornar false
      const soundEnabled1 = result.current.toggleSound();
      expect(soundEnabled1).toBe(false);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('soundEnabled', 'false');

      // Segundo toggle - deve retornar true
      const soundEnabled2 = result.current.toggleSound();
      expect(soundEnabled2).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('soundEnabled', 'true');
    });

    it('deve verificar se som está habilitado', () => {
      const { result } = renderHook(() => useGamification());

      const isEnabled = result.current.isSoundEnabled();
      expect(isEnabled).toBe(true);
    });
  });
});
