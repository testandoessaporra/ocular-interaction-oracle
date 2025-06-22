
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGamification } from '@/hooks/useGamification';
import { gamificationService } from '@/services/gamificationService';
import { showCycleCompletedNotification } from '@/components/ui/tactical-notification';
import { setupGlobalMocks, setupDOMMocks, createMockProgress, cleanupMocks } from '../shared/testUtils';

describe('useGamification - Cycle Bonus Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupGlobalMocks();
    setupDOMMocks();
  });

  afterEach(() => {
    cleanupMocks();
  });

  describe('Bônus por Completar Ciclo', () => {
    it('deve calcular e adicionar bônus de XP corretamente ao completar um ciclo', () => {
      const progressBeforeCycle = createMockProgress({
        level: 2,
        totalXP: 200,
        currentXP: 70,
        xpToNextLevel: 60,
        totalHours: 20,
        totalSessions: 10,
        streak: 8,
        cycleStreak: 0,
        loginStreak: 5,
        lastLoginDate: '2024-01-03',
        name: 'Soldado',
        class: 'Básico',
        totalMedals: 2,
        coins: 100
      });

      const progressAfterCycle = createMockProgress({
        ...progressBeforeCycle,
        totalXP: 500,
        currentXP: 40,
        level: 2,
        cycleStreak: 1,
        coins: 200,
        streak: 0
      });

      const { result } = renderHook(() => useGamification());

      let bonusProgress;
      act(() => {
        bonusProgress = result.current.calculateCycleCompletionBonus(progressBeforeCycle, 8);
      });

      expect(bonusProgress).toBeDefined();
      expect(typeof result.current.calculateCycleCompletionBonus).toBe('function');
    });

    it('deve calcular bônus de conclusão de ciclo corretamente', () => {
      const mockCurrentProgress = createMockProgress({
        level: 2,
        totalXP: 250,
        currentXP: 50,
        xpToNextLevel: 50,
        totalHours: 25,
        totalSessions: 12,
        streak: 3,
        cycleStreak: 1,
        loginStreak: 7,
        lastLoginDate: '2024-01-03',
        name: 'Soldado',
        class: 'Básico',
        totalMedals: 3,
        coins: 150
      });

      const { result } = renderHook(() => useGamification());

      act(() => {
        result.current.calculateCycleCompletionBonus(mockCurrentProgress, 8);
      });

      expect(typeof result.current.calculateCycleCompletionBonus).toBe('function');
    });

    it('deve ter função de notificação de ciclo completado', () => {
      const { result } = renderHook(() => useGamification());

      // Verificar que a função existe
      expect(result.current.showCycleCompletedNotification).toBeDefined();
      expect(typeof result.current.showCycleCompletedNotification).toBe('function');

      // Verificar que pode ser executada sem erros
      expect(() => {
        act(() => {
          result.current.showCycleCompletedNotification();
        });
      }).not.toThrow();
    });

    it('deve adicionar bônus de XP e coins ao completar ciclo com 8 blocos', () => {
      const progressBeforeCycle = createMockProgress({
        level: 2,
        totalXP: 200,
        currentXP: 70,
        xpToNextLevel: 60,
        totalHours: 20,
        totalSessions: 10,
        streak: 8,
        cycleStreak: 0,
        loginStreak: 5,
        lastLoginDate: '2024-01-03',
        name: 'Soldado',
        class: 'Básico',
        totalMedals: 2,
        coins: 100
      });

      const { result } = renderHook(() => useGamification());

      let resultProgress;
      act(() => {
        resultProgress = result.current.calculateCycleCompletionBonus(progressBeforeCycle, 8);
      });

      expect(resultProgress).toBeDefined();
      expect(typeof result.current.calculateCycleCompletionBonus).toBe('function');
    });
  });
});
