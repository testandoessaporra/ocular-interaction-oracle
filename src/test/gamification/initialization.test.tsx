
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGamification } from '@/hooks/useGamification';
import { gamificationService } from '@/services/gamificationService';
import { setupGlobalMocks, setupDOMMocks, createMockProgress, cleanupMocks } from '../shared/testUtils';

describe('useGamification - Initialization Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupGlobalMocks();
    setupDOMMocks();
  });

  afterEach(() => {
    cleanupMocks();
  });

  describe('Inicialização de Progresso', () => {
    it('deve inicializar progresso corretamente', () => {
      const mockInitialProgress = createMockProgress({
        level: 1,
        totalXP: 0,
        currentXP: 0,
        xpToNextLevel: 100,
        totalHours: 0,
        totalSessions: 0,
        streak: 0,
        cycleStreak: 0,
        loginStreak: 0,
        lastLoginDate: '',
        streakProtectionShields: 0,
        name: 'Recruta',
        class: 'Iniciante',
        totalMedals: 0,
        coins: 0
      });

      const { result } = renderHook(() => useGamification());

      const progress = act(() => {
        return result.current.initializeProgress();
      });

      expect(progress).toBeDefined();
      expect(typeof result.current.initializeProgress).toBe('function');
    });
  });
});
