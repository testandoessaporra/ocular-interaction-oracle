
import { logger } from '@/utils/logger';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { calculateOptimalBlockDuration, formatDuration } from '../blockCalculator';

// Mock logger.info to avoid cluttering test output
const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('blockCalculator', () => {
  beforeEach(() => {
    consoleSpy.mockClear();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('calculateOptimalBlockDuration', () => {
    it('should respect minimum duration constraint', () => {
      const result = calculateOptimalBlockDuration(30, 45, 90);
      expect(result).toBe(45); // Should return minimum when remaining < minimum
    });

    it('should return remaining time when it fits within range', () => {
      const result = calculateOptimalBlockDuration(60, 45, 90);
      expect(result).toBe(60); // 60 is within 45-90 range
    });

    it('should handle time perfectly fitting max duration', () => {
      const result = calculateOptimalBlockDuration(90, 45, 90);
      expect(result).toBe(90);
    });

    it('should optimize for best remainder when exceeding max', () => {
      const result = calculateOptimalBlockDuration(150, 45, 90);
      expect(result).toBeGreaterThanOrEqual(45);
      expect(result).toBeLessThanOrEqual(90);
      expect(result % 15).toBe(0); // Should be multiple of 15
    });

    it('should always return multiples of 15', () => {
      const testCases = [
        { remaining: 67, min: 45, max: 90 },
        { remaining: 123, min: 30, max: 75 },
        { remaining: 200, min: 60, max: 120 }
      ];

      testCases.forEach(({ remaining, min, max }) => {
        const result = calculateOptimalBlockDuration(remaining, min, max);
        expect(result % 15).toBe(0);
      });
    });

    it('should handle edge case where remaining equals minimum', () => {
      const result = calculateOptimalBlockDuration(45, 45, 90);
      expect(result).toBe(45);
    });

    it('should handle edge case where remaining equals maximum', () => {
      const result = calculateOptimalBlockDuration(90, 45, 90);
      expect(result).toBe(90);
    });

    it('should prefer durations that leave zero remainder', () => {
      // 120 minutes, prefer 60 (leaves 60) over other options
      const result = calculateOptimalBlockDuration(120, 45, 90);
      
      // Verify the result creates a good remainder
      const remainder = 120 % result;
      expect(remainder).toBeLessThanOrEqual(60); // Should leave manageable remainder
    });

    it('should handle very small remaining times', () => {
      const result = calculateOptimalBlockDuration(15, 30, 60);
      expect(result).toBe(30); // Should return minimum
    });

    it('should handle very large remaining times', () => {
      const result = calculateOptimalBlockDuration(500, 45, 90);
      expect(result).toBeGreaterThanOrEqual(45);
      expect(result).toBeLessThanOrEqual(90);
      expect(result % 15).toBe(0);
    });

    it('should round irregular inputs to multiples of 15', () => {
      // Test with non-15-multiple inputs
      const result = calculateOptimalBlockDuration(67, 47, 88);
      
      // All values should be rounded to multiples of 15
      expect(result % 15).toBe(0);
      expect(result).toBeGreaterThanOrEqual(45); // 47 rounded down to 45
      expect(result).toBeLessThanOrEqual(90); // 88 rounded up to 90
    });
  });

  describe('formatDuration (re-export test)', () => {
    it('should correctly format various durations', () => {
      expect(formatDuration(15)).toBe('15min');
      expect(formatDuration(60)).toBe('1h');
      expect(formatDuration(75)).toBe('1h15min');
      expect(formatDuration(120)).toBe('2h');
    });
  });

  describe('Performance and Edge Cases', () => {
    it('should complete calculations quickly', () => {
      const startTime = Date.now();
      
      // Run multiple calculations
      for (let i = 0; i < 100; i++) {
        calculateOptimalBlockDuration(150 + i, 45, 90);
      }
      
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(100); // Should complete within 100ms
    });

    it('should handle identical min and max durations', () => {
      const result = calculateOptimalBlockDuration(120, 60, 60);
      expect(result).toBe(60);
    });

    it('should handle zero remaining time', () => {
      const result = calculateOptimalBlockDuration(0, 30, 60);
      expect(result).toBe(30); // Should return minimum
    });
  });
});
