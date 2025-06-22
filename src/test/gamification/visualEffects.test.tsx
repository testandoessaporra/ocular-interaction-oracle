
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGamification } from '@/hooks/useGamification';
import { setupDOMMocks } from '../shared/testUtils';

describe('useGamification - Visual Effects Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupDOMMocks();
  });

  describe('Efeitos Visuais', () => {
    it('deve criar efeito de XP flutuante com parâmetros corretos', () => {
      const { result } = renderHook(() => useGamification());

      act(() => {
        result.current.showFloatingXP({
          x: 100,
          y: 200,
          xp: 50,
          color: '#FFD700'
        });
      });

      // Verificar que createElement foi chamado (para o elemento principal)
      expect(document.createElement).toHaveBeenCalledWith('div');
      
      // Verificar que appendChild foi chamado
      expect(document.body.appendChild).toHaveBeenCalled();
    });

    it('deve criar efeito de XP flutuante sem cor específica', () => {
      const { result } = renderHook(() => useGamification());

      act(() => {
        result.current.showFloatingXP({
          x: 150,
          y: 250,
          xp: 75
        });
      });

      expect(document.createElement).toHaveBeenCalledWith('div');
      expect(document.body.appendChild).toHaveBeenCalled();
    });

    it('deve criar múltiplos efeitos visuais simultaneamente', () => {
      const { result } = renderHook(() => useGamification());

      // Reset dos mocks para contar apenas as chamadas deste teste
      vi.clearAllMocks();

      act(() => {
        result.current.showFloatingXP({ x: 100, y: 200, xp: 25 });
        result.current.showFloatingXP({ x: 200, y: 300, xp: 50 });
        result.current.showFloatingXP({ x: 300, y: 400, xp: 75 });
      });

      // Cada showFloatingXP cria 1 elemento principal + ~15 elementos de confete = ~16 por chamada
      // 3 chamadas = ~48 elementos (pode variar devido ao confete aleatório)
      expect(document.createElement).toHaveBeenCalled();
      expect(document.body.appendChild).toHaveBeenCalled();
      
      // Verificar que foi chamado múltiplas vezes
      const createElementCalls = (document.createElement as any).mock.calls.length;
      expect(createElementCalls).toBeGreaterThan(3);
    });
  });
});
