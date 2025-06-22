
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGamification } from '@/hooks/useGamification';
import { createMockProgress } from '../shared/testUtils';

describe('useGamification - XP Calculation Tests', () => {
  beforeEach(() => {
    // Setup já foi feito globalmente no test/setup.ts
  });

  afterEach(() => {
    // Cleanup já foi feito globalmente no test/setup.ts
  });

  describe('Cálculo de XP por Sessão', () => {
    it('deve aumentar XP corretamente após uma sessão de 60 minutos', () => {
      const initialProgress = createMockProgress();
      const { result } = renderHook(() => useGamification());

      let calculatedProgress;
      act(() => {
        calculatedProgress = result.current.calculateProgressFromSession(initialProgress, 60);
      });

      expect(calculatedProgress).toBeDefined();
      expect(calculatedProgress.totalXP).toBeGreaterThan(initialProgress.totalXP);
      expect(calculatedProgress.totalSessions).toBe(initialProgress.totalSessions + 1);
    });

    it('deve calcular progresso da sessão corretamente', () => {
      const mockCurrentProgress = createMockProgress({
        level: 1,
        totalXP: 100,
        currentXP: 50,
        totalHours: 10,
        totalSessions: 5,
        streak: 2,
        totalMedals: 2,
        coins: 100
      });

      const { result } = renderHook(() => useGamification());

      let progressResult;
      act(() => {
        progressResult = result.current.calculateProgressFromSession(mockCurrentProgress, 60);
      });

      expect(progressResult).toBeDefined();
      expect(progressResult.totalXP).toBeGreaterThan(mockCurrentProgress.totalXP);
      expect(progressResult.totalSessions).toBe(mockCurrentProgress.totalSessions + 1);
    });

    it('deve chamar função de progresso com parâmetros corretos', () => {
      const mockProgress = createMockProgress({
        level: 2,
        totalXP: 200,
        currentXP: 0,
        xpToNextLevel: 100,
        totalHours: 20,
        totalSessions: 10,
        streak: 0,
        cycleStreak: 2,
        loginStreak: 5,
        lastLoginDate: '2024-01-02',
        streakProtectionShields: 1,
        name: 'Soldado',
        class: 'Básico',
        totalMedals: 3,
        coins: 200
      });

      const { result } = renderHook(() => useGamification());

      let progressResult;
      act(() => {
        progressResult = result.current.calculateProgressFromSession(mockProgress, 90);
      });

      expect(progressResult).toBeDefined();
      expect(progressResult.totalXP).toBeGreaterThan(mockProgress.totalXP);
      expect(progressResult.totalSessions).toBe(mockProgress.totalSessions + 1);
    });

    it('deve aumentar XP corretamente após sessão de 60 minutos', () => {
      const initialProgress = createMockProgress();
      const { result } = renderHook(() => useGamification());

      let resultProgress;
      act(() => {
        resultProgress = result.current.calculateProgressFromSession(initialProgress, 60);
      });

      expect(resultProgress).toBeDefined();
      expect(resultProgress.totalXP).toBeGreaterThan(initialProgress.totalXP);
      expect(resultProgress.totalSessions).toBe(initialProgress.totalSessions + 1);
    });
  });
});
