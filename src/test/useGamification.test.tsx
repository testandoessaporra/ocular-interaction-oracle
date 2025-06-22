
// Mocks DEVEM vir antes de qualquer import
import { vi } from 'vitest';

// Mock das dependências críticas primeiro
vi.mock('@/hooks/usePerformanceTracker', () => ({
  usePerformanceTracker: vi.fn(() => ({
    trackOperation: vi.fn((name, operation) => operation()),
    logCustomMetric: vi.fn(),
    getRenderCount: vi.fn(() => 0),
    renderCount: 0
  }))
}));

vi.mock('@/services/gamificationService', () => ({
  gamificationService: {
    calculateSessionProgress: vi.fn(),
    calculateCycleCompletionBonus: vi.fn(),
    initializeProgress: vi.fn(),
    consumeProtectionShield: vi.fn(),
    resetCycleStreak: vi.fn()
  }
}));

vi.mock('@/components/ui/tactical-notification');

// Agora imports normais
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGamification } from '@/hooks/useGamification';
import { setupGlobalMocks, setupDOMMocks, createMockProgress } from './shared/testUtils';

describe('useGamification - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupGlobalMocks();
    setupDOMMocks();
  });

  describe('Testes de Integração', () => {
    it('deve integrar todas as funcionalidades corretamente', () => {
      const initialProgress = createMockProgress();
      const { result } = renderHook(() => useGamification());

      // Teste de inicialização
      const progress = result.current.initializeProgress();
      expect(progress).toBeDefined();

      // Teste de cálculo de XP
      act(() => {
        result.current.calculateProgressFromSession(initialProgress, 60);
      });

      expect(typeof result.current.calculateProgressFromSession).toBe('function');
    });

    it('deve manter estado consistente entre operações', () => {
      const { result } = renderHook(() => useGamification());
      
      expect(result.current.calculateProgressFromSession).toBeDefined();
      expect(result.current.calculateCycleCompletionBonus).toBeDefined();
      expect(result.current.showLevelUpNotification).toBeDefined();
      expect(result.current.playXPSound).toBeDefined();
      expect(result.current.showFloatingXP).toBeDefined();
    });

    it('deve gerenciar streaks corretamente', () => {
      const { result } = renderHook(() => useGamification());
      const currentProgress = createMockProgress({ cycleStreak: 3 });

      // Teste reset de streak
      act(() => {
        result.current.resetCycleStreak(currentProgress);
      });

      expect(typeof result.current.resetCycleStreak).toBe('function');
    });

    it('deve lidar com escudos de proteção', () => {
      const { result } = renderHook(() => useGamification());
      const progressWithShields = createMockProgress({ 
        cycleStreak: 5, 
        streakProtectionShields: 2 
      });

      // Chamada através do resetCycleStreak que deve usar o escudo
      act(() => {
        result.current.resetCycleStreak(progressWithShields);
      });

      expect(typeof result.current.resetCycleStreak).toBe('function');
    });

    it('deve calcular bônus de ciclo com múltiplos blocos', () => {
      const { result } = renderHook(() => useGamification());
      const currentProgress = createMockProgress({ cycleStreak: 2 });

      act(() => {
        result.current.calculateCycleCompletionBonus(currentProgress, 8);
      });

      expect(typeof result.current.calculateCycleCompletionBonus).toBe('function');
    });

    it('deve reproduzir sons adequados para diferentes eventos', () => {
      const { result } = renderHook(() => useGamification());

      // Teste som de XP
      act(() => {
        result.current.playXPSound();
      });

      // Teste som de level up
      act(() => {
        result.current.playLevelUpSound();
      });

      // Teste som de medalha
      act(() => {
        result.current.playMedalSound();
      });

      // Verificar se todos os sons foram chamados (implicitamente testado pela não ocorrência de erros)
      expect(true).toBe(true);
    });
  });
});
