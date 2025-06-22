import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStudyTimer } from '../useStudyTimer';

// Mock the timer persistence hook
vi.mock('../useTimerPersistence', () => ({
  useTimerPersistence: () => ({
    saveSession: vi.fn(),
    loadSession: vi.fn(() => null),
    clearSession: vi.fn()
  })
}));

// Mock the timer sounds hook
vi.mock('../useTimerSounds', () => ({
  useTimerSounds: () => ({
    playAlarmSound: vi.fn()
  })
}));

describe('useStudyTimer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Timer initialization', () => {
    it('should initialize timer with default values', () => {
      const { result } = renderHook(() => useStudyTimer());
      
      expect(result.current.timer.studyTime).toBe(0);
      expect(result.current.timer.pauseTime).toBe(0);
      expect(result.current.timer.isRunning).toBe(false);
      expect(result.current.timer.isPaused).toBe(false);
      expect(result.current.timer.isAlarmEnabled).toBe(false);
      expect(result.current.timer.alarmInterval).toBe(25);
      expect(result.current.timer.mode).toBe('focus');
      expect(result.current.timer.initialDuration).toBe(0);
      // isCountdown should be false when no originBlock
      expect(result.current.timer.isCountdown).toBeFalsy();
    });

    it('should initialize countdown timer when originBlock and duration provided', () => {
      const mockBlock = { id: 'block-1', subject: 'Math', duration: 30 };
      const { result } = renderHook(() => 
        useStudyTimer('Math', 30, 'focus', mockBlock)
      );
      
      expect(result.current.timer.isCountdown).toBe(true);
      expect(result.current.timer.studyTime).toBe(1800); // 30 minutes in seconds
      expect(result.current.timer.initialDuration).toBe(1800);
      expect(result.current.timer.subject).toBe('Math');
      expect(result.current.timer.originBlock).toEqual(mockBlock);
    });
  });

  describe('Timer controls', () => {
    it('should start timer correctly', () => {
      const { result } = renderHook(() => useStudyTimer());
      
      act(() => {
        result.current.startTimer();
      });
      
      expect(result.current.timer.isRunning).toBe(true);
      expect(result.current.timer.isPaused).toBe(false);
      expect(result.current.timer.mode).toBe('focus');
    });

    it('should pause and resume timer', () => {
      const { result } = renderHook(() => useStudyTimer());
      
      // Start timer
      act(() => {
        result.current.startTimer();
      });
      
      // Pause timer
      act(() => {
        result.current.pauseTimer();
      });
      
      expect(result.current.timer.isRunning).toBe(true);
      expect(result.current.timer.isPaused).toBe(true);
      
      // Resume timer
      act(() => {
        result.current.pauseTimer();
      });
      
      expect(result.current.timer.isRunning).toBe(true);
      expect(result.current.timer.isPaused).toBe(false);
    });

    it('should stop timer and return session data', () => {
      const { result } = renderHook(() => useStudyTimer('Physics', 45));
      
      // Start timer
      act(() => {
        result.current.startTimer();
      });
      
      // Manually set some study time
      act(() => {
        result.current.timer.studyTime = 120;
        result.current.timer.pauseTime = 30;
      });
      
      // Stop timer
      let sessionData;
      act(() => {
        sessionData = result.current.stopTimer();
      });
      
      expect(sessionData).toEqual({
        studyTime: 120,
        pauseTime: 30,
        subject: 'Physics',
        totalMinutes: 2,
        originBlock: undefined
      });
      
      // Timer should be reset
      expect(result.current.timer.isRunning).toBe(false);
      expect(result.current.timer.studyTime).toBe(0);
      expect(result.current.timer.pauseTime).toBe(0);
    });
  });

  describe('Timer modes', () => {
    it('should change timer mode', () => {
      const { result } = renderHook(() => useStudyTimer());
      
      act(() => {
        result.current.setMode('floating');
      });
      
      expect(result.current.timer.mode).toBe('floating');
      
      act(() => {
        result.current.setMode('hidden');
      });
      
      expect(result.current.timer.mode).toBe('hidden');
    });

    it('should close timer', () => {
      const { result } = renderHook(() => useStudyTimer());
      
      act(() => {
        result.current.startTimer();
      });
      
      act(() => {
        result.current.closeTimer();
      });
      
      expect(result.current.timer.mode).toBe('hidden');
    });
  });

  describe('Alarm functionality', () => {
    it('should toggle alarm', () => {
      const { result } = renderHook(() => useStudyTimer());
      
      expect(result.current.timer.isAlarmEnabled).toBe(false);
      
      act(() => {
        result.current.toggleAlarm();
      });
      
      expect(result.current.timer.isAlarmEnabled).toBe(true);
      
      act(() => {
        result.current.toggleAlarm();
      });
      
      expect(result.current.timer.isAlarmEnabled).toBe(false);
    });

    it('should set alarm interval', () => {
      const { result } = renderHook(() => useStudyTimer());
      
      act(() => {
        result.current.setAlarmInterval(15);
      });
      
      expect(result.current.timer.alarmInterval).toBe(15);
    });
  });

  describe('Time formatting', () => {
    it('should format time correctly without hours', () => {
      const { result } = renderHook(() => useStudyTimer());
      
      expect(result.current.formatTime(0)).toBe('00:00');
      expect(result.current.formatTime(59)).toBe('00:59');
      expect(result.current.formatTime(60)).toBe('01:00');
      expect(result.current.formatTime(599)).toBe('09:59');
    });

    it('should format time correctly with hours', () => {
      const { result } = renderHook(() => useStudyTimer());
      
      expect(result.current.formatTime(3600)).toBe('01:00:00');
      expect(result.current.formatTime(3661)).toBe('01:01:01');
      expect(result.current.formatTime(7200)).toBe('02:00:00');
    });
  });

  describe('Countdown timer', () => {
    it('should handle countdown timer correctly', () => {
      const mockBlock = { id: 'block-1', subject: 'Chemistry', duration: 25 };
      const { result } = renderHook(() => 
        useStudyTimer('Chemistry', 25, 'focus', mockBlock)
      );
      
      expect(result.current.timer.isCountdown).toBe(true);
      expect(result.current.timer.studyTime).toBe(1500); // 25 minutes
      
      // Stop timer should calculate actual study time
      act(() => {
        result.current.timer.studyTime = 1200; // 20 minutes remaining
      });
      
      let sessionData;
      act(() => {
        sessionData = result.current.stopTimer();
      });
      
      // Should have studied for 5 minutes (1500 - 1200 = 300 seconds)
      expect(sessionData.studyTime).toBe(300);
      expect(sessionData.totalMinutes).toBe(5);
    });
  });
});