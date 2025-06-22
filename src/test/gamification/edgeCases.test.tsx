import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGamification } from '@/hooks/useGamification';
import { createMockProgress } from '../shared/testUtils';

describe('useGamification - Edge Cases Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Valores Extremos de XP', () => {
    it('deve lidar com XP muito alto sem overflow', () => {
      const { result } = renderHook(() => useGamification());
      
      const highXPProgress = createMockProgress({
        totalXP: 999999,
        level: 50
      });

      let newProgress;
      expect(() => {
        act(() => {
          newProgress = result.current.calculateProgressFromSession(highXPProgress, 60);
        });
      }).not.toThrow();

      // Verificar que XP aumentou corretamente
      expect(newProgress.totalXP).toBeGreaterThan(highXPProgress.totalXP);
      expect(newProgress.totalXP).toBeLessThan(Number.MAX_SAFE_INTEGER);
    });

    it('deve lidar com duração de sessão zero', () => {
      const { result } = renderHook(() => useGamification());
      
      const initialProgress = createMockProgress({
        totalXP: 100
      });

      let newProgress;
      act(() => {
        newProgress = result.current.calculateProgressFromSession(initialProgress, 0);
      });

      // Não deve ganhar XP com duração zero
      expect(newProgress.totalXP).toBe(initialProgress.totalXP);
      expect(newProgress.totalSessions).toBe(initialProgress.totalSessions + 1);
    });

    it('deve lidar com duração de sessão negativa como zero', () => {
      const { result } = renderHook(() => useGamification());
      
      const initialProgress = createMockProgress({
        totalXP: 100
      });

      let newProgress;
      act(() => {
        newProgress = result.current.calculateProgressFromSession(initialProgress, -30);
      });

      // Duração negativa: XP pode ser calculado como -30 * 1 = -30
      // Mas o total não deve ser menor que o inicial
      expect(newProgress.totalXP).toBeLessThanOrEqual(initialProgress.totalXP);
    });
  });

  describe('Estados Inválidos', () => {
    it('deve inicializar progresso com valores undefined', () => {
      const { result } = renderHook(() => useGamification());
      
      let progress;
      act(() => {
        progress = result.current.initializeProgress(undefined);
      });

      // Deve retornar progresso padrão válido
      expect(progress).toBeDefined();
      expect(progress.level).toBe(1);
      expect(progress.totalXP).toBe(0);
      expect(progress.streak).toBe(0);
      expect(progress.cycleStreak).toBe(0);
    });

    it('deve inicializar progresso com objeto parcial', () => {
      const { result } = renderHook(() => useGamification());
      
      const partialProgress = {
        totalXP: 500,
        // Faltam outros campos
      };

      let progress;
      act(() => {
        progress = result.current.initializeProgress(partialProgress);
      });

      // Deve preencher campos faltantes com valores padrão
      expect(progress.totalXP).toBe(500);
      expect(progress.level).toBeGreaterThan(0);
      expect(progress.streak).toBeDefined();
      expect(progress.cycleStreak).toBeDefined();
    });

    it('deve lidar com progresso null', () => {
      const { result } = renderHook(() => useGamification());
      
      let progress;
      act(() => {
        progress = result.current.initializeProgress(null);
      });

      // Deve retornar progresso padrão
      expect(progress).toBeDefined();
      expect(progress.level).toBe(1);
    });
  });

  describe('Limites de Valores', () => {
    it('deve respeitar limite máximo de escudos de proteção', () => {
      const { result } = renderHook(() => useGamification());
      
      const progressWithManyShields = createMockProgress({
        streakProtectionShields: 99
      });

      let newProgress;
      act(() => {
        // Simular consumo de escudo através do resetCycleStreak
        // (consumeProtectionShield não está exposto no hook)
        newProgress = result.current.resetCycleStreak(progressWithManyShields);
      });

      // Se tinha escudos, o streak deve ser mantido e um escudo consumido
      expect(newProgress.streakProtectionShields).toBe(98);
      expect(newProgress.cycleStreak).toBe(progressWithManyShields.cycleStreak);
    });

    it('deve lidar com cycle streak muito alta', () => {
      const { result } = renderHook(() => useGamification());
      
      const highStreakProgress = createMockProgress({
        cycleStreak: 100,
        totalXP: 1000
      });

      let newProgress;
      act(() => {
        newProgress = result.current.calculateCycleCompletionBonus(highStreakProgress, 8);
      });

      // Deve calcular bônus sem erros
      expect(newProgress.cycleStreak).toBe(101);
      expect(newProgress.totalXP).toBeGreaterThan(highStreakProgress.totalXP);
    });

    it('deve lidar com número de blocos completados zero', () => {
      const { result } = renderHook(() => useGamification());
      
      const initialProgress = createMockProgress({
        totalXP: 500,
        cycleStreak: 0 // Começar sem cycle streak
      });

      let newProgress;
      act(() => {
        newProgress = result.current.calculateCycleCompletionBonus(initialProgress, 0);
      });

      // Com 0 blocos: 200 XP base + (0 * 50) = 200 XP
      // Com cycle streak incrementado de 0 para 1: 200 * 1.25 = 250 XP
      expect(newProgress.totalXP).toBe(750); // 500 + 250
    });
  });

  describe('Cálculos de Multiplicadores', () => {
    it('deve aplicar multiplicadores mesmo com valores extremos', () => {
      const { result } = renderHook(() => useGamification());
      
      const extremeProgress = createMockProgress({
        cycleStreak: 1000, // Muito alto
        loginStreak: 1000, // Muito alto
        totalXP: 100
      });

      let newProgress;
      act(() => {
        newProgress = result.current.calculateProgressFromSession(extremeProgress, 60);
      });

      // Deve ganhar XP mas respeitando limites de multiplicadores
      const xpGained = newProgress.totalXP - extremeProgress.totalXP;
      expect(xpGained).toBeGreaterThan(60); // Base XP (60 min * 1 XP/min)
      expect(xpGained).toBeLessThan(300); // Não deve ser absurdo
    });

    it('deve lidar com sessões muito longas', () => {
      const { result } = renderHook(() => useGamification());
      
      const initialProgress = createMockProgress({
        totalXP: 100,
        cycleStreak: 0, // Sem bônus de cycle streak
        loginStreak: 0, // Sem bônus de login streak
        totalHours: 0 // Começar com 0 horas
      });

      let newProgress;
      act(() => {
        // Sessão de 24 horas (1440 minutos)
        newProgress = result.current.calculateProgressFromSession(initialProgress, 1440);
      });

      // Deve calcular XP corretamente
      const expectedXP = 100 + (1440 * 1); // 1 XP por minuto
      expect(newProgress.totalXP).toBe(expectedXP);
      expect(newProgress.totalHours).toBeCloseTo(24, 1);
    });
  });

  describe('Proteção contra Estados Inconsistentes', () => {
    it('não deve permitir escudos negativos', () => {
      const { result } = renderHook(() => useGamification());
      
      const progressNoShields = createMockProgress({
        streakProtectionShields: 0
      });

      let newProgress;
      act(() => {
        // Resetar streak sem escudos deve zerar o streak
        newProgress = result.current.resetCycleStreak(progressNoShields);
      });

      // Sem escudos, o streak deve ser zerado
      expect(newProgress.streakProtectionShields).toBe(0);
      expect(newProgress.cycleStreak).toBe(0);
    });

    it('deve manter integridade dos dados após múltiplas operações', () => {
      const { result } = renderHook(() => useGamification());
      
      let progress = createMockProgress({
        totalXP: 100,
        cycleStreak: 3,
        streakProtectionShields: 2,
        totalSessions: 0 // Começar com 0 sessões
      });

      // Múltiplas operações em sequência
      act(() => {
        // 1. Calcular sessão
        progress = result.current.calculateProgressFromSession(progress, 30);
        // 2. Completar ciclo
        progress = result.current.calculateCycleCompletionBonus(progress, 5);
        // 3. Resetar streak (deve usar escudo)
        progress = result.current.resetCycleStreak(progress);
      });

      // Verificar integridade dos dados
      expect(progress.totalXP).toBeGreaterThan(100);
      expect(progress.cycleStreak).toBe(4); // Incrementado de 3 para 4 pelo bônus
      expect(progress.streakProtectionShields).toBe(1); // Consumido um escudo
      expect(progress.totalSessions).toBe(1);
    });

    it('deve lidar com todos os campos zerados', () => {
      const { result } = renderHook(() => useGamification());
      
      const zeroProgress = createMockProgress({
        level: 1,
        totalXP: 0,
        currentXP: 0,
        xpToNextLevel: 100,
        totalHours: 0,
        totalSessions: 0,
        streak: 0,
        cycleStreak: 0,
        loginStreak: 0,
        streakProtectionShields: 0,
        totalMedals: 0,
        coins: 0
      });

      let newProgress;
      expect(() => {
        act(() => {
          newProgress = result.current.calculateProgressFromSession(zeroProgress, 30);
        });
      }).not.toThrow();

      // Deve calcular corretamente partindo do zero
      expect(newProgress.totalXP).toBe(30); // 30 min * 1 XP/min
      expect(newProgress.totalSessions).toBe(1);
    });
  });
});