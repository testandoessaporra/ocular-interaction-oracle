import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGamification } from '@/hooks/useGamification';
import { createMockProgress } from '../shared/testUtils';

describe('useGamification - Streak Management Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Cycle Streak Management', () => {
    it('deve incrementar cycle streak ao completar ciclo', () => {
      const { result } = renderHook(() => useGamification());
      
      const initialProgress = createMockProgress({
        cycleStreak: 2,
        totalXP: 500,
        coins: 100
      });

      let newProgress;
      act(() => {
        newProgress = result.current.calculateCycleCompletionBonus(initialProgress, 8);
      });

      // Verificar que cycle streak foi incrementada
      expect(newProgress.cycleStreak).toBe(3);
      expect(newProgress.cycleStreak).toBeGreaterThan(initialProgress.cycleStreak);
    });

    it('deve resetar cycle streak quando não há escudos', () => {
      const { result } = renderHook(() => useGamification());
      
      const progressWithoutShields = createMockProgress({
        cycleStreak: 5,
        streakProtectionShields: 0
      });

      let newProgress;
      act(() => {
        newProgress = result.current.resetCycleStreak(progressWithoutShields);
      });

      // Verificar que cycle streak foi resetada
      expect(newProgress.cycleStreak).toBe(0);
      expect(newProgress.streakProtectionShields).toBe(0);
    });

    it('deve usar escudo de proteção ao invés de resetar cycle streak', () => {
      const { result } = renderHook(() => useGamification());
      
      const progressWithShields = createMockProgress({
        cycleStreak: 5,
        streakProtectionShields: 2
      });

      let newProgress;
      act(() => {
        newProgress = result.current.resetCycleStreak(progressWithShields);
      });

      // Verificar que cycle streak foi mantida e escudo foi consumido
      expect(newProgress.cycleStreak).toBe(5);
      expect(newProgress.streakProtectionShields).toBe(1);
    });

    it('deve consumir escudo de proteção corretamente', () => {
      const { result } = renderHook(() => useGamification());
      
      const progressWithShields = createMockProgress({
        streakProtectionShields: 3
      });

      let newProgress;
      act(() => {
        newProgress = result.current.consumeProtectionShield(progressWithShields);
      });

      // Verificar que escudo foi consumido
      expect(newProgress.streakProtectionShields).toBe(2);
    });

    it('não deve consumir escudo quando não há escudos disponíveis', () => {
      const { result } = renderHook(() => useGamification());
      
      const progressWithoutShields = createMockProgress({
        streakProtectionShields: 0
      });

      let newProgress;
      act(() => {
        newProgress = result.current.consumeProtectionShield(progressWithoutShields);
      });

      // Verificar que nada mudou
      expect(newProgress.streakProtectionShields).toBe(0);
      expect(newProgress).toEqual(progressWithoutShields);
    });
  });

  describe('Streak Multipliers na Sessão', () => {
    it('deve aplicar multiplicador de cycle streak no cálculo de XP', () => {
      const { result } = renderHook(() => useGamification());
      
      // Teste com cycle streak 0
      const progressNoStreak = createMockProgress({
        cycleStreak: 0,
        totalXP: 100
      });

      let resultNoStreak;
      act(() => {
        resultNoStreak = result.current.calculateProgressFromSession(progressNoStreak, 60);
      });

      // Teste com cycle streak 3
      const progressWithStreak = createMockProgress({
        cycleStreak: 3,
        totalXP: 100
      });

      let resultWithStreak;
      act(() => {
        resultWithStreak = result.current.calculateProgressFromSession(progressWithStreak, 60);
      });

      // XP ganho deve ser maior com streak
      const xpGainedNoStreak = resultNoStreak.totalXP - progressNoStreak.totalXP;
      const xpGainedWithStreak = resultWithStreak.totalXP - progressWithStreak.totalXP;
      
      // Sem streak: 60 XP
      // Com cycle streak 3: 60 * 1.3 = 78 XP
      expect(xpGainedNoStreak).toBe(60);
      expect(xpGainedWithStreak).toBe(78);
    });

    it('deve aplicar multiplicador de login streak no cálculo de XP', () => {
      const { result } = renderHook(() => useGamification());
      
      // Teste com login streak baixo
      const progressLowLoginStreak = createMockProgress({
        loginStreak: 1,
        cycleStreak: 0, // Garantir que não há bônus de cycle streak
        totalXP: 100
      });

      let resultLowStreak;
      act(() => {
        resultLowStreak = result.current.calculateProgressFromSession(progressLowLoginStreak, 60);
      });

      // Teste com login streak alto (9 dias = 3 ciclos de 3 dias)
      const progressHighLoginStreak = createMockProgress({
        loginStreak: 9,
        cycleStreak: 0, // Garantir que não há bônus de cycle streak
        totalXP: 100
      });

      let resultHighStreak;
      act(() => {
        resultHighStreak = result.current.calculateProgressFromSession(progressHighLoginStreak, 60);
      });

      // XP ganho deve ser maior com login streak alto
      const xpGainedLow = resultLowStreak.totalXP - progressLowLoginStreak.totalXP;
      const xpGainedHigh = resultHighStreak.totalXP - progressHighLoginStreak.totalXP;
      
      // Login streak 1: floor(1/3) = 0, sem bônus = 60 XP
      // Login streak 9: floor(9/3) * 5% = 15% bônus = 60 * 1.15 = 69 XP
      expect(xpGainedLow).toBe(60);
      expect(xpGainedHigh).toBe(69);
    });

    it('deve respeitar limite máximo de multiplicador de cycle streak (40%)', () => {
      const { result } = renderHook(() => useGamification());
      
      // Teste com cycle streak muito alta
      const progressHighStreak = createMockProgress({
        cycleStreak: 10, // Deveria dar 100%, mas está limitado a 40%
        totalXP: 100
      });

      let result1;
      act(() => {
        result1 = result.current.calculateProgressFromSession(progressHighStreak, 60);
      });

      // Base XP para 60 minutos = 60 XP
      // Com 40% de bônus máximo = 60 * 1.4 = 84 XP
      const xpGained = result1.totalXP - progressHighStreak.totalXP;
      expect(xpGained).toBe(84);
    });
  });

  describe('Bônus de Cycle Streak', () => {
    it('deve aplicar multiplicador de cycle streak no bônus de conclusão', () => {
      const { result } = renderHook(() => useGamification());
      
      // Teste com cycle streak baixa
      const progressLowStreak = createMockProgress({
        cycleStreak: 0,
        totalXP: 500,
        coins: 100
      });

      let resultLowStreak;
      act(() => {
        resultLowStreak = result.current.calculateCycleCompletionBonus(progressLowStreak, 8);
      });

      // Teste com cycle streak alta
      const progressHighStreak = createMockProgress({
        cycleStreak: 3,
        totalXP: 500,
        coins: 100
      });

      let resultHighStreak;
      act(() => {
        resultHighStreak = result.current.calculateCycleCompletionBonus(progressHighStreak, 8);
      });

      // Bônus deve ser maior com streak alta
      const bonusXPLow = resultLowStreak.totalXP - progressLowStreak.totalXP;
      const bonusXPHigh = resultHighStreak.totalXP - progressHighStreak.totalXP;
      
      // Low streak (0->1): 200 + (8*50) = 600 XP * 1.25 = 750 XP
      // High streak (3->4): 600 XP * 2.0 (limite) = 1200 XP
      expect(bonusXPLow).toBe(750);
      expect(bonusXPHigh).toBe(1200);
    });

    it('deve adicionar bônus de coins baseado em login streak', () => {
      const { result } = renderHook(() => useGamification());
      
      // Teste com login streak < 5 (sem bônus)
      const progressLowLogin = createMockProgress({
        loginStreak: 3,
        cycleStreak: 0, // Começando com cycle streak 0
        coins: 100
      });

      let resultLowLogin;
      act(() => {
        resultLowLogin = result.current.calculateCycleCompletionBonus(progressLowLogin, 8);
      });

      // Teste com login streak >= 5 (com bônus)
      const progressHighLogin = createMockProgress({
        loginStreak: 10, // 2 ciclos de 5 = 20 coins de bônus
        cycleStreak: 0, // Começando com cycle streak 0
        coins: 100
      });

      let resultHighLogin;
      act(() => {
        resultHighLogin = result.current.calculateCycleCompletionBonus(progressHighLogin, 8);
      });

      // Coins ganhos devem ser maiores com login streak alto
      const coinsGainedLow = resultLowLogin.coins - progressLowLogin.coins;
      const coinsGainedHigh = resultHighLogin.coins - progressHighLogin.coins;
      
      // Low login (3): 300 coins * 1.25 = 375 coins (sem bônus de login)
      // High login (10): 375 coins + floor(10/5)*10 = 375 + 20 = 395 coins
      expect(coinsGainedLow).toBe(375);
      expect(coinsGainedHigh).toBe(395);
    });
  });

  describe('Estados de Streak', () => {
    it('deve manter todos os tipos de streak independentes', () => {
      const { result } = renderHook(() => useGamification());
      
      const initialProgress = createMockProgress({
        streak: 3,
        cycleStreak: 5,
        loginStreak: 7
      });

      // Resetar cycle streak não deve afetar outros streaks
      let newProgress;
      act(() => {
        newProgress = result.current.resetCycleStreak(initialProgress);
      });

      expect(newProgress.cycleStreak).toBe(0);
      expect(newProgress.streak).toBe(3); // Mantido
      expect(newProgress.loginStreak).toBe(7); // Mantido
    });

    it('deve preservar streaks ao calcular progresso de sessão', () => {
      const { result } = renderHook(() => useGamification());
      
      const initialProgress = createMockProgress({
        streak: 2,
        cycleStreak: 4,
        loginStreak: 6
      });

      let newProgress;
      act(() => {
        newProgress = result.current.calculateProgressFromSession(initialProgress, 30);
      });

      // Streaks devem ser mantidas após sessão
      expect(newProgress.streak).toBe(2);
      expect(newProgress.cycleStreak).toBe(4);
      expect(newProgress.loginStreak).toBe(6);
    });
  });
});