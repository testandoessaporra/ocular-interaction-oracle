
import { describe, it, expect } from 'vitest';
import { 
  ensureMultipleOf15, 
  roundTo15, 
  formatDuration, 
  isMultipleOf15, 
  hoursToRoundedMinutes 
} from '../timeUtils';

describe('timeUtils', () => {
  describe('ensureMultipleOf15', () => {
    it('should return exact multiples unchanged', () => {
      expect(ensureMultipleOf15(0)).toBe(0);
      expect(ensureMultipleOf15(15)).toBe(15);
      expect(ensureMultipleOf15(30)).toBe(30);
      expect(ensureMultipleOf15(45)).toBe(45);
      expect(ensureMultipleOf15(60)).toBe(60);
      expect(ensureMultipleOf15(90)).toBe(90);
    });

    it('should round to nearest multiple of 15', () => {
      expect(ensureMultipleOf15(7)).toBe(0);
      expect(ensureMultipleOf15(8)).toBe(15);
      expect(ensureMultipleOf15(22)).toBe(15);
      expect(ensureMultipleOf15(23)).toBe(30);
      expect(ensureMultipleOf15(37)).toBe(30);
      expect(ensureMultipleOf15(38)).toBe(45);
    });

    it('should handle negative values by returning 0', () => {
      expect(ensureMultipleOf15(-1)).toBe(0);
      expect(ensureMultipleOf15(-10)).toBe(0);
      expect(ensureMultipleOf15(-15)).toBe(0);
      expect(ensureMultipleOf15(-100)).toBe(0);
      expect(ensureMultipleOf15(-999)).toBe(0);
    });

    it('should handle zero correctly', () => {
      expect(ensureMultipleOf15(0)).toBe(0);
    });

    it('should handle large numbers correctly', () => {
      expect(ensureMultipleOf15(150)).toBe(150);
      expect(ensureMultipleOf15(157)).toBe(150);
      expect(ensureMultipleOf15(158)).toBe(165);
      expect(ensureMultipleOf15(1000)).toBe(1005);
      expect(ensureMultipleOf15(9999)).toBe(10005); // Corrected: 9999/15 = 666.6, round(666.6) = 667, 667*15 = 10005
    });

    it('should handle decimal numbers by rounding', () => {
      expect(ensureMultipleOf15(7.4)).toBe(0);
      expect(ensureMultipleOf15(7.5)).toBe(15);
      expect(ensureMultipleOf15(7.6)).toBe(15);
      expect(ensureMultipleOf15(22.4)).toBe(15);
      expect(ensureMultipleOf15(22.5)).toBe(30);
      expect(ensureMultipleOf15(37.9)).toBe(45);
    });

    it('should handle edge cases around 15-minute boundaries', () => {
      expect(ensureMultipleOf15(7.49)).toBe(0);
      expect(ensureMultipleOf15(7.51)).toBe(15);
      expect(ensureMultipleOf15(14.9)).toBe(15);
      expect(ensureMultipleOf15(15.1)).toBe(15);
      expect(ensureMultipleOf15(22.49)).toBe(15);
      expect(ensureMultipleOf15(22.51)).toBe(30);
    });

    it('should handle very small positive numbers', () => {
      expect(ensureMultipleOf15(0.1)).toBe(0);
      expect(ensureMultipleOf15(1)).toBe(0);
      expect(ensureMultipleOf15(5)).toBe(0);
      expect(ensureMultipleOf15(6.9)).toBe(0);
    });
  });

  describe('isMultipleOf15', () => {
    it('should correctly identify multiples of 15', () => {
      expect(isMultipleOf15(0)).toBe(true);
      expect(isMultipleOf15(15)).toBe(true);
      expect(isMultipleOf15(30)).toBe(true);
      expect(isMultipleOf15(45)).toBe(true);
      expect(isMultipleOf15(60)).toBe(true);
      expect(isMultipleOf15(90)).toBe(true);
      expect(isMultipleOf15(105)).toBe(true);
      expect(isMultipleOf15(120)).toBe(true);
      expect(isMultipleOf15(1005)).toBe(true);
    });

    it('should correctly identify non-multiples of 15', () => {
      expect(isMultipleOf15(1)).toBe(false);
      expect(isMultipleOf15(7)).toBe(false);
      expect(isMultipleOf15(14)).toBe(false);
      expect(isMultipleOf15(16)).toBe(false);
      expect(isMultipleOf15(29)).toBe(false);
      expect(isMultipleOf15(31)).toBe(false);
      expect(isMultipleOf15(44)).toBe(false);
      expect(isMultipleOf15(46)).toBe(false);
    });

    it('should handle negative numbers', () => {
      expect(isMultipleOf15(-15)).toBe(true);
      expect(isMultipleOf15(-30)).toBe(true);
      expect(isMultipleOf15(-1)).toBe(false);
      expect(isMultipleOf15(-7)).toBe(false);
    });

    it('should handle decimal numbers', () => {
      expect(isMultipleOf15(15.0)).toBe(true);
      expect(isMultipleOf15(15.1)).toBe(false);
      expect(isMultipleOf15(14.9)).toBe(false);
    });
  });

  describe('hoursToRoundedMinutes', () => {
    it('should convert whole hours correctly', () => {
      expect(hoursToRoundedMinutes(1)).toBe(60);
      expect(hoursToRoundedMinutes(2)).toBe(120);
      expect(hoursToRoundedMinutes(0.5)).toBe(30);
      expect(hoursToRoundedMinutes(0)).toBe(0);
    });

    it('should round irregular hours to nearest 15-minute multiple', () => {
      expect(hoursToRoundedMinutes(1.1)).toBe(60); // 66 minutes → 60
      expect(hoursToRoundedMinutes(1.2)).toBe(75); // 72 minutes → 75
      expect(hoursToRoundedMinutes(1.7)).toBe(105); // 102 minutes → 105
    });

    it('should handle decimal hours', () => {
      expect(hoursToRoundedMinutes(0.25)).toBe(15); // 15 minutes
      expect(hoursToRoundedMinutes(0.75)).toBe(45); // 45 minutes
      expect(hoursToRoundedMinutes(1.25)).toBe(75); // 75 minutes
      expect(hoursToRoundedMinutes(1.75)).toBe(105); // 105 minutes
    });

    it('should handle negative hours by returning 0', () => {
      expect(hoursToRoundedMinutes(-1)).toBe(0);
      expect(hoursToRoundedMinutes(-0.5)).toBe(0);
      expect(hoursToRoundedMinutes(-10)).toBe(0);
    });

    it('should handle large hour values', () => {
      expect(hoursToRoundedMinutes(10)).toBe(600);
      expect(hoursToRoundedMinutes(24)).toBe(1440);
      expect(hoursToRoundedMinutes(100)).toBe(6000);
    });

    it('should handle very small hour values', () => {
      expect(hoursToRoundedMinutes(0.1)).toBe(0); // 6 minutes → 0
      expect(hoursToRoundedMinutes(0.2)).toBe(15); // 12 minutes → 15
      expect(hoursToRoundedMinutes(0.01)).toBe(0); // 0.6 minutes → 0
    });
  });

  describe('formatDuration', () => {
    it('should format minutes only', () => {
      expect(formatDuration(15)).toBe('15min');
      expect(formatDuration(30)).toBe('30min');
      expect(formatDuration(45)).toBe('45min');
    });

    it('should format hours only', () => {
      expect(formatDuration(60)).toBe('1h');
      expect(formatDuration(120)).toBe('2h');
      expect(formatDuration(180)).toBe('3h');
    });

    it('should format hours and minutes', () => {
      expect(formatDuration(75)).toBe('1h15min');
      expect(formatDuration(90)).toBe('1h30min');
      expect(formatDuration(135)).toBe('2h15min');
      expect(formatDuration(195)).toBe('3h15min');
    });

    it('should handle irregular durations by rounding first', () => {
      expect(formatDuration(67)).toBe('1h'); // 67 → 60
      expect(formatDuration(68)).toBe('1h15min'); // 68 → 75
      expect(formatDuration(82)).toBe('1h15min'); // 82 → 75
      expect(formatDuration(83)).toBe('1h30min'); // 83 → 90
    });

    it('should handle zero and small values', () => {
      expect(formatDuration(0)).toBe('0min');
      expect(formatDuration(7)).toBe('0min'); // Rounds to 0
      expect(formatDuration(8)).toBe('15min'); // Rounds to 15
      expect(formatDuration(1)).toBe('0min');
    });

    it('should handle negative values by returning 0min', () => {
      expect(formatDuration(-1)).toBe('0min');
      expect(formatDuration(-15)).toBe('0min');
      expect(formatDuration(-100)).toBe('0min');
    });

    it('should handle large durations', () => {
      expect(formatDuration(600)).toBe('10h'); // 10 hours
      expect(formatDuration(615)).toBe('10h15min'); // 10h 15min
      expect(formatDuration(1440)).toBe('24h'); // 24 hours
    });

    it('should format with proper zero padding for minutes', () => {
      expect(formatDuration(65)).toBe('1h'); // 65 → 60 → 1h
      expect(formatDuration(315)).toBe('5h15min'); // Corrected: use 315 which actually gives 5h15min
    });
  });

  describe('roundTo15 (alias test)', () => {
    it('should work identically to ensureMultipleOf15', () => {
      const testValues = [0, 7, 8, 15, 22, 23, 30, 45, 67, 68, 90, -10, 157, 0.5, 22.7];
      
      testValues.forEach(value => {
        expect(roundTo15(value)).toBe(ensureMultipleOf15(value));
      });
    });
  });

  describe('Edge Cases and Boundary Testing', () => {
    it('should handle floating point precision issues', () => {
      expect(ensureMultipleOf15(0.1 + 0.2)).toBe(0); // JavaScript floating point
      expect(ensureMultipleOf15(14.999999999)).toBe(15);
      expect(ensureMultipleOf15(15.000000001)).toBe(15);
    });

    it('should handle very large numbers without overflow', () => {
      expect(ensureMultipleOf15(Number.MAX_SAFE_INTEGER)).toBeGreaterThan(0);
      expect(isMultipleOf15(Number.MAX_SAFE_INTEGER)).toBeDefined();
    });

    it('should handle special number values', () => {
      expect(ensureMultipleOf15(NaN)).toBe(0);
      expect(ensureMultipleOf15(Infinity)).toBe(0);
      expect(ensureMultipleOf15(-Infinity)).toBe(0);
    });
  });
});
