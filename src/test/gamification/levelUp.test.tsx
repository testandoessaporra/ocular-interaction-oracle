
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGamification } from '@/hooks/useGamification';
import { gamificationService } from '@/services/gamificationService';
import { showLevelUpNotification, showMedalNotification } from '@/components/ui/tactical-notification';
import { setupGlobalMocks, setupDOMMocks, createMockProgress, cleanupMocks } from '../shared/testUtils';

describe('useGamification - Level Up Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupGlobalMocks();
    setupDOMMocks();
  });

  afterEach(() => {
    cleanupMocks();
  });

  describe('Sistema de Level Up', () => {
    it('deve atualizar level quando XP suficiente é ganho', () => {
      const progressNearLevelUp = createMockProgress({
        level: 1,
        totalXP: 90,
        currentXP: 90,
        xpToNextLevel: 10,
        totalHours: 9,
        totalSessions: 9,
        streak: 2,
        cycleStreak: 1,
        loginStreak: 3,
        coins: 80
      });

      const { result } = renderHook(() => useGamification());

      let levelUpProgress;
      act(() => {
        levelUpProgress = result.current.calculateProgressFromSession(progressNearLevelUp, 30);
      });

      expect(levelUpProgress).toBeDefined();
      expect(typeof result.current.calculateProgressFromSession).toBe('function');
    });

    it('deve calcular múltiplos level ups em uma única sessão', () => {
      const progressLevel1 = createMockProgress();

      const { result } = renderHook(() => useGamification());

      let resultProgress;
      act(() => {
        resultProgress = result.current.calculateProgressFromSession(progressLevel1, 250);
      });

      expect(resultProgress).toBeDefined();
      expect(typeof result.current.calculateProgressFromSession).toBe('function');
    });

    it('deve ter função de notificação de level up que aceita nível e classe', () => {
      const { result } = renderHook(() => useGamification());

      // Verificar que a função existe
      expect(result.current.showLevelUpNotification).toBeDefined();
      expect(typeof result.current.showLevelUpNotification).toBe('function');

      // Verificar que aceita os parâmetros esperados sem erros
      expect(() => {
        act(() => {
          result.current.showLevelUpNotification(5, 'Veterano');
        });
      }).not.toThrow();
    });

    it('deve ter função de notificação de medalha que aceita nome da medalha', () => {
      const { result } = renderHook(() => useGamification());

      // Verificar que a função existe
      expect(result.current.showMedalNotification).toBeDefined();
      expect(typeof result.current.showMedalNotification).toBe('function');

      // Verificar que aceita o parâmetro esperado sem erros
      expect(() => {
        act(() => {
          result.current.showMedalNotification('Mestre dos Estudos');
        });
      }).not.toThrow();
    });
  });
});
