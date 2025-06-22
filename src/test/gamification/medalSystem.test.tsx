import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGamification } from '@/hooks/useGamification';
import { createMockProgress } from '../shared/testUtils';

describe('useGamification - Medal System Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Conquista de Medalhas por Nível', () => {
    it('deve conquistar primeira medalha ao atingir nível 2', () => {
      const { result } = renderHook(() => useGamification());
      
      // Progresso no nível 1 com XP suficiente para subir
      const level1Progress = createMockProgress({
        level: 1,
        totalXP: 90,
        totalMedals: 0
      });

      let newProgress;
      act(() => {
        // Sessão de 60 minutos deve dar 60 XP, total 150 XP, suficiente para nível 2
        newProgress = result.current.calculateProgressFromSession(level1Progress, 60);
      });

      // Verificar que subiu de nível e ganhou medalha
      expect(newProgress.level).toBeGreaterThanOrEqual(2);
      expect(newProgress.totalMedals).toBe(1);
    });

    it('deve conquistar segunda medalha ao atingir nível 5', () => {
      const { result } = renderHook(() => useGamification());
      
      // Progresso no nível 4 próximo do 5
      // Nível 1: 100 XP, Nível 2: 130 XP, Nível 3: 160 XP, Nível 4: 190 XP = Total 580 XP para nível 5
      const level4Progress = createMockProgress({
        level: 4,
        totalXP: 570,
        totalMedals: 1
      });

      let newProgress;
      act(() => {
        // Sessão de 30 minutos para garantir nível 5
        newProgress = result.current.calculateProgressFromSession(level4Progress, 30);
      });

      // Verificar que atingiu nível 5 e ganhou segunda medalha
      expect(newProgress.level).toBeGreaterThanOrEqual(5);
      expect(newProgress.totalMedals).toBe(2);
    });

    it('deve conquistar terceira medalha ao atingir nível 10', () => {
      const { result } = renderHook(() => useGamification());
      
      // Progresso no nível 9
      // Total acumulado até nível 9: 1640 XP, precisa 340 XP para nível 10 = Total 1980 XP
      const level9Progress = createMockProgress({
        level: 9,
        totalXP: 1640,
        totalMedals: 2
      });

      let newProgress;
      act(() => {
        // Sessão de 340 minutos para atingir nível 10
        newProgress = result.current.calculateProgressFromSession(level9Progress, 340);
      });

      // Verificar que atingiu nível 10 e ganhou terceira medalha
      expect(newProgress.level).toBeGreaterThanOrEqual(10);
      expect(newProgress.totalMedals).toBe(3);
    });
  });

  describe('Acumulação de Medalhas', () => {
    it('deve manter contagem correta de medalhas após múltiplos níveis', () => {
      const { result } = renderHook(() => useGamification());
      
      // Começar do zero
      let progress = createMockProgress({
        level: 1,
        totalXP: 0,
        totalMedals: 0
      });

      // Subir para nível 2
      act(() => {
        // 100 minutos = 100 XP, suficiente para nível 2
        progress = result.current.calculateProgressFromSession(progress, 100);
      });
      expect(progress.totalMedals).toBe(1);

      // Subir mais níveis até o 5
      act(() => {
        // Precisa mais 480 XP para chegar ao nível 5 (total 580 XP)
        progress = result.current.calculateProgressFromSession(progress, 480);
      });
      expect(progress.level).toBeGreaterThanOrEqual(5);
      expect(progress.totalMedals).toBe(2);

      // Subir até o nível 10
      act(() => {
        // Precisa mais 1400 XP para chegar ao nível 10 (total 1980 XP)
        progress = result.current.calculateProgressFromSession(progress, 1400);
      });
      expect(progress.level).toBeGreaterThanOrEqual(10);
      expect(progress.totalMedals).toBe(3);
    });

    it('não deve duplicar medalhas já conquistadas', () => {
      const { result } = renderHook(() => useGamification());
      
      // Já tem as 3 medalhas no nível 10
      const level10Progress = createMockProgress({
        level: 10,
        totalXP: 1980,
        totalMedals: 3
      });

      let newProgress;
      act(() => {
        // Mais uma sessão no nível 10+
        newProgress = result.current.calculateProgressFromSession(level10Progress, 60);
      });

      // Medalhas devem permanecer em 3
      expect(newProgress.totalMedals).toBe(3);
    });
  });

  describe('Medalhas e Notificações', () => {
    it('deve ter função de notificação de medalha disponível', () => {
      const { result } = renderHook(() => useGamification());
      
      // Verificar que a função existe
      expect(result.current.showMedalNotification).toBeDefined();
      expect(typeof result.current.showMedalNotification).toBe('function');

      // Verificar que pode ser executada
      expect(() => {
        act(() => {
          result.current.showMedalNotification('Primeiro Passo');
        });
      }).not.toThrow();
    });
  });

  describe('Medalhas após Bônus de Ciclo', () => {
    it('deve verificar medalhas após bônus de conclusão de ciclo', () => {
      const { result } = renderHook(() => useGamification());
      
      // Próximo do nível 2
      const nearLevel2Progress = createMockProgress({
        level: 1,
        totalXP: 80,
        totalMedals: 0,
        cycleStreak: 0
      });

      let newProgress;
      act(() => {
        // Bônus de ciclo com 0 blocos: 200 XP base * 1.25 (cycle streak 1) = 250 XP
        // Total: 80 + 250 = 330 XP, suficiente para nível 2
        newProgress = result.current.calculateCycleCompletionBonus(nearLevel2Progress, 0);
      });

      // Deve ter ganhado medalha
      expect(newProgress.level).toBeGreaterThanOrEqual(2);
      expect(newProgress.totalMedals).toBe(1);
    });
  });

  describe('Sistema de Medalhas Completo', () => {
    it('deve inicializar progresso com contagem correta de medalhas', () => {
      const { result } = renderHook(() => useGamification());
      
      // Inicializar com XP suficiente para nível 7
      // Total acumulado até nível 7: 1080 XP
      const storedProgress = {
        totalXP: 1080,
        totalHours: 50,
        totalSessions: 25
      };

      let progress;
      act(() => {
        progress = result.current.initializeProgress(storedProgress);
      });

      // Deve calcular nível 7 e medalhas corretamente (níveis 2 e 5)
      expect(progress.level).toBe(7);
      expect(progress.totalMedals).toBe(2);
    });

    it('deve manter integridade do sistema de medalhas', () => {
      const { result } = renderHook(() => useGamification());
      
      let progress = createMockProgress({
        level: 1,
        totalXP: 0,
        totalMedals: 0
      });

      // Teste completo: sessão + ciclo + mais sessões
      act(() => {
        // 1. Sessão inicial
        progress = result.current.calculateProgressFromSession(progress, 50);
        
        // 2. Completar ciclo (deve dar bastante XP)
        progress = result.current.calculateCycleCompletionBonus(progress, 8);
        
        // 3. Mais sessões
        progress = result.current.calculateProgressFromSession(progress, 100);
      });

      // Verificar consistência
      expect(progress.totalMedals).toBeLessThanOrEqual(3); // Máximo 3 medalhas
      expect(progress.totalMedals).toBeGreaterThanOrEqual(0); // Mínimo 0
      
      // Se nível >= 2, deve ter pelo menos 1 medalha
      if (progress.level >= 2) {
        expect(progress.totalMedals).toBeGreaterThanOrEqual(1);
      }
      
      // Se nível >= 5, deve ter pelo menos 2 medalhas
      if (progress.level >= 5) {
        expect(progress.totalMedals).toBeGreaterThanOrEqual(2);
      }
      
      // Se nível >= 10, deve ter 3 medalhas
      if (progress.level >= 10) {
        expect(progress.totalMedals).toBe(3);
      }
    });
  });

  describe('Edge Cases de Medalhas', () => {
    it('deve lidar com níveis muito altos', () => {
      const { result } = renderHook(() => useGamification());
      
      const highLevelProgress = createMockProgress({
        level: 50,
        totalXP: 10000,
        totalMedals: 3
      });

      let newProgress;
      act(() => {
        newProgress = result.current.calculateProgressFromSession(highLevelProgress, 60);
      });

      // Medalhas devem permanecer em 3 (máximo)
      expect(newProgress.totalMedals).toBe(3);
    });

    it('deve calcular medalhas corretamente com XP muito alto', () => {
      const { result } = renderHook(() => useGamification());
      
      const veryHighXP = {
        totalXP: 999999
      };

      let progress;
      act(() => {
        progress = result.current.initializeProgress(veryHighXP);
      });

      // Com XP muito alto, deve ter nível muito alto e todas as 3 medalhas
      expect(progress.level).toBeGreaterThanOrEqual(10);
      expect(progress.totalMedals).toBe(3);
    });
  });
});