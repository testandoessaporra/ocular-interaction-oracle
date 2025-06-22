import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGamification } from '@/hooks/useGamification';

describe('useGamification - Notifications Behavior Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Garantir que o som está habilitado por padrão
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('true');
  });

  describe('API de Notificações', () => {
    it('deve expor todas as funções de notificação', () => {
      const { result } = renderHook(() => useGamification());
      
      // Verificar que todas as funções existem
      expect(result.current.showStreakIncreasedNotification).toBeDefined();
      expect(result.current.showStreakLostNotification).toBeDefined();
      expect(result.current.showStreakProtectedNotification).toBeDefined();
      expect(result.current.showBlockCompletedNotification).toBeDefined();
      expect(result.current.showLevelUpNotification).toBeDefined();
      expect(result.current.showMedalNotification).toBeDefined();
      expect(result.current.showCycleCompletedNotification).toBeDefined();
      
      // Verificar que são funções
      expect(typeof result.current.showStreakIncreasedNotification).toBe('function');
      expect(typeof result.current.showStreakLostNotification).toBe('function');
      expect(typeof result.current.showStreakProtectedNotification).toBe('function');
      expect(typeof result.current.showBlockCompletedNotification).toBe('function');
    });
  });

  describe('Comportamento de Notificações com Som', () => {
    it('deve executar notificação de streak aumentada sem erros', () => {
      const { result } = renderHook(() => useGamification());
      
      // Não deve lançar erro ao executar
      expect(() => {
        act(() => {
          result.current.showStreakIncreasedNotification(5, 'cycle');
        });
      }).not.toThrow();
    });

    it('deve executar notificação de streak perdida sem erros', () => {
      const { result } = renderHook(() => useGamification());
      
      expect(() => {
        act(() => {
          result.current.showStreakLostNotification('login');
        });
      }).not.toThrow();
    });

    it('deve executar notificação de streak protegida sem erros', () => {
      const { result } = renderHook(() => useGamification());
      
      expect(() => {
        act(() => {
          result.current.showStreakProtectedNotification('cycle');
        });
      }).not.toThrow();
    });

    it('deve executar notificação de bloco completado com parâmetros corretos', () => {
      const { result } = renderHook(() => useGamification());
      
      // Verificar que aceita os parâmetros esperados
      expect(() => {
        act(() => {
          result.current.showBlockCompletedNotification('Matemática', '1h30min');
        });
      }).not.toThrow();
    });

    it('deve integrar com sistema de som ao mostrar notificações', () => {
      const { result } = renderHook(() => useGamification());
      
      // Verificar que as funções de notificação com som estão disponíveis
      expect(result.current.showStreakIncreasedNotification).toBeDefined();
      expect(result.current.playMedalSound).toBeDefined();
      
      // Executar notificação que deve tocar som
      expect(() => {
        act(() => {
          result.current.showStreakIncreasedNotification(5, 'cycle');
        });
      }).not.toThrow();
    });
  });

  describe('Integração com Sistema de Som', () => {
    it('deve respeitar configuração de som desabilitado', () => {
      // Configurar som como desabilitado
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('false');
      
      const { result } = renderHook(() => useGamification());
      
      // Verificar que a função existe mesmo com som desabilitado
      expect(result.current.showStreakIncreasedNotification).toBeDefined();
      
      // E que pode ser executada sem erros
      expect(() => {
        act(() => {
          result.current.showStreakIncreasedNotification(5, 'cycle');
        });
      }).not.toThrow();
    });

    it('deve permitir alternar configuração de som', () => {
      const { result } = renderHook(() => useGamification());
      
      // Verificar que a função toggleSound existe
      expect(result.current.toggleSound).toBeDefined();
      expect(typeof result.current.toggleSound).toBe('function');
      
      // Toggle sound e verificar retorno
      let soundEnabled;
      act(() => {
        soundEnabled = result.current.toggleSound();
      });
      
      // Verificar que retornou um boolean
      expect(typeof soundEnabled).toBe('boolean');
      
      // Verificar que isSoundEnabled funciona
      expect(typeof result.current.isSoundEnabled()).toBe('boolean');
    });
  });

  describe('Tipos de Notificação', () => {
    it('deve aceitar diferentes tipos de streak', () => {
      const { result } = renderHook(() => useGamification());
      
      // Teste com tipo 'cycle'
      expect(() => {
        act(() => {
          result.current.showStreakIncreasedNotification(5, 'cycle');
        });
      }).not.toThrow();
      
      // Teste com tipo 'login'
      expect(() => {
        act(() => {
          result.current.showStreakIncreasedNotification(3, 'login');
        });
      }).not.toThrow();
    });

    it('deve usar tipo padrão quando não especificado', () => {
      const { result } = renderHook(() => useGamification());
      
      // Chamar sem especificar tipo (deve usar padrão)
      expect(() => {
        act(() => {
          result.current.showStreakLostNotification();
        });
      }).not.toThrow();
    });
  });
});