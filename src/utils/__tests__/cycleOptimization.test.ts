
import { describe, it, expect } from 'vitest';
import { 
  calculateWeightWithDifficulty, 
  estimateBlocks, 
  calculateOptimalDurations 
} from '../cycleOptimization';
import { CycleWizardData } from '@/types/cycleWizard';

describe('cycleOptimization', () => {
  describe('calculateWeightWithDifficulty', () => {
    it('should apply correct multipliers for each difficulty level', () => {
      const baseWeight = 100;
      
      expect(calculateWeightWithDifficulty(baseWeight, 1)).toBe(200); // Extrema: +100%
      expect(calculateWeightWithDifficulty(baseWeight, 2)).toBe(150); // Difícil: +50%
      expect(calculateWeightWithDifficulty(baseWeight, 3)).toBe(100); // Normal: mantém
      expect(calculateWeightWithDifficulty(baseWeight, 4)).toBe(75);  // Base: -25%
      expect(calculateWeightWithDifficulty(baseWeight, 5)).toBe(40);  // Domino: -60%
    });

    it('should handle edge case weights', () => {
      expect(calculateWeightWithDifficulty(0, 1)).toBe(0);
      expect(calculateWeightWithDifficulty(1, 1)).toBe(2);
      expect(calculateWeightWithDifficulty(1000, 5)).toBe(400);
    });

    it('should handle decimal weights correctly', () => {
      expect(calculateWeightWithDifficulty(10.5, 1)).toBe(21);
      expect(calculateWeightWithDifficulty(33.33, 2)).toBe(49.995);
      expect(calculateWeightWithDifficulty(50.5, 4)).toBe(37.875);
    });

    it('should handle invalid difficulty levels by returning base weight', () => {
      const baseWeight = 100;
      
      expect(calculateWeightWithDifficulty(baseWeight, 0)).toBe(baseWeight);
      expect(calculateWeightWithDifficulty(baseWeight, 6)).toBe(baseWeight);
      expect(calculateWeightWithDifficulty(baseWeight, -1)).toBe(baseWeight);
      expect(calculateWeightWithDifficulty(baseWeight, 10)).toBe(baseWeight);
    });

    it('should handle negative weights', () => {
      expect(calculateWeightWithDifficulty(-50, 1)).toBe(-100);
      expect(calculateWeightWithDifficulty(-100, 5)).toBe(-40);
    });

    it('should maintain precision for very small weights', () => {
      expect(calculateWeightWithDifficulty(0.01, 1)).toBe(0.02);
      expect(calculateWeightWithDifficulty(0.001, 5)).toBe(0.0004);
    });
  });

  describe('estimateBlocks', () => {
    const mockSubjects = [
      { name: 'Math', weight: 100 },
      { name: 'Physics', weight: 80 },
      { name: 'Chemistry', weight: 60 }
    ];

    it('should calculate correct number of blocks for standard scenarios', () => {
      expect(estimateBlocks(mockSubjects, 20, 45, 90)).toBe(18); // 1200min / 67.5avg = ~18
      expect(estimateBlocks(mockSubjects, 10, 30, 60)).toBe(14); // 600min / 45avg = ~14
      expect(estimateBlocks(mockSubjects, 40, 60, 120)).toBe(27); // 2400min / 90avg = ~27
    });

    it('should handle edge cases', () => {
      expect(estimateBlocks([], 20, 45, 90)).toBe(18); // Empty subjects array
      expect(estimateBlocks(mockSubjects, 0, 45, 90)).toBe(0); // Zero hours
      expect(estimateBlocks(mockSubjects, 1, 45, 90)).toBe(1); // Very few hours
    });

    it('should handle very small and very large durations', () => {
      expect(estimateBlocks(mockSubjects, 20, 15, 30)).toBe(54); // Small blocks
      expect(estimateBlocks(mockSubjects, 20, 120, 180)).toBe(8); // Large blocks
    });

    it('should always round up (ceiling)', () => {
      // Test cases where division doesn't result in whole numbers
      expect(estimateBlocks(mockSubjects, 7, 45, 90)).toBe(7); // 420min / 67.5 = 6.22... → 7
      expect(estimateBlocks(mockSubjects, 13, 60, 120)).toBe(9); // 780min / 90 = 8.66... → 9
    });
  });

  describe('calculateOptimalDurations', () => {
    it('should return default values for no selected subjects', () => {
      const wizardData: CycleWizardData = {
        selectedExam: 'Test',
        subjects: [],
        weeklyHours: 20,
        minBlockDuration: 30,
        maxBlockDuration: 60
      };

      const result = calculateOptimalDurations(wizardData);
      expect(result.minDuration).toBe(45);
      expect(result.maxDuration).toBe(90);
      expect(result.reasoning).toBe("Valores padrão");
    });

    it('should calculate optimal durations for selected subjects', () => {
      const wizardData: CycleWizardData = {
        selectedExam: 'Test',
        subjects: [
          { name: 'Math', weight: 100, difficulty: 3, isSelected: true },
          { name: 'Physics', weight: 80, difficulty: 2, isSelected: true },
          { name: 'Chemistry', weight: 60, difficulty: 4, isSelected: false } // Not selected
        ],
        weeklyHours: 20,
        minBlockDuration: 30,
        maxBlockDuration: 60
      };

      const result = calculateOptimalDurations(wizardData);
      
      expect(result.minDuration).toBeGreaterThan(0);
      expect(result.maxDuration).toBeGreaterThan(result.minDuration);
      expect(result.minDuration % 15).toBe(0); // Multiple of 15
      expect(result.maxDuration % 15).toBe(0); // Multiple of 15
      expect(result.reasoning).toContain('2 disciplinas'); // Only 2 selected
    });

    it('should handle single subject scenario', () => {
      const wizardData: CycleWizardData = {
        selectedExam: 'Test',
        subjects: [
          { name: 'Math', weight: 100, difficulty: 3, isSelected: true }
        ],
        weeklyHours: 10,
        minBlockDuration: 30,
        maxBlockDuration: 60
      };

      const result = calculateOptimalDurations(wizardData);
      
      expect(result.minDuration).toBeGreaterThanOrEqual(30);
      expect(result.maxDuration).toBeLessThanOrEqual(150);
      expect(result.reasoning).toContain('1 disciplinas');
    });

    it('should handle extreme difficulty distributions', () => {
      const wizardData: CycleWizardData = {
        selectedExam: 'Test',
        subjects: [
          { name: 'VeryHard', weight: 50, difficulty: 1, isSelected: true }, // 100 effective weight
          { name: 'VeryEasy', weight: 50, difficulty: 5, isSelected: true }  // 20 effective weight
        ],
        weeklyHours: 20,
        minBlockDuration: 30,
        maxBlockDuration: 60
      };

      const result = calculateOptimalDurations(wizardData);
      
      expect(result.minDuration).toBeGreaterThan(0);
      expect(result.maxDuration).toBeGreaterThan(result.minDuration);
      // Should handle the large weight difference
      expect(result.maxDuration - result.minDuration).toBeGreaterThan(30);
    });

    it('should handle high weekly hours', () => {
      const wizardData: CycleWizardData = {
        selectedExam: 'Test',
        subjects: [
          { name: 'Math', weight: 100, difficulty: 3, isSelected: true },
          { name: 'Physics', weight: 100, difficulty: 3, isSelected: true }
        ],
        weeklyHours: 60, // Very high
        minBlockDuration: 30,
        maxBlockDuration: 60
      };

      const result = calculateOptimalDurations(wizardData);
      
      expect(result.minDuration).toBeGreaterThan(30);
      expect(result.maxDuration).toBeLessThanOrEqual(150);
    });

    it('should handle low weekly hours', () => {
      const wizardData: CycleWizardData = {
        selectedExam: 'Test',
        subjects: [
          { name: 'Math', weight: 100, difficulty: 3, isSelected: true },
          { name: 'Physics', weight: 100, difficulty: 3, isSelected: true }
        ],
        weeklyHours: 2, // Very low
        minBlockDuration: 30,
        maxBlockDuration: 60
      };

      const result = calculateOptimalDurations(wizardData);
      
      expect(result.minDuration).toBeGreaterThanOrEqual(30);
      expect(result.maxDuration).toBeGreaterThan(result.minDuration);
    });

    it('should always return multiples of 15', () => {
      const testCases = [
        { weeklyHours: 5, subjects: 1 },
        { weeklyHours: 15, subjects: 3 },
        { weeklyHours: 35, subjects: 5 },
        { weeklyHours: 50, subjects: 2 }
      ];

      testCases.forEach(({ weeklyHours, subjects: numSubjects }) => {
        const wizardData: CycleWizardData = {
          selectedExam: 'Test',
          subjects: Array.from({ length: numSubjects }, (_, i) => ({
            name: `Subject${i + 1}`,
            weight: 50 + i * 10,
            difficulty: [1, 2, 3, 4, 5][i % 5] as 1 | 2 | 3 | 4 | 5, // Fixed: explicit cast
            isSelected: true
          })),
          weeklyHours,
          minBlockDuration: 30,
          maxBlockDuration: 60
        };

        const result = calculateOptimalDurations(wizardData);
        expect(result.minDuration % 15).toBe(0);
        expect(result.maxDuration % 15).toBe(0);
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle subjects with zero weight', () => {
      const wizardData: CycleWizardData = {
        selectedExam: 'Test',
        subjects: [
          { name: 'ZeroWeight', weight: 0, difficulty: 3, isSelected: true },
          { name: 'NormalWeight', weight: 100, difficulty: 3, isSelected: true }
        ],
        weeklyHours: 20,
        minBlockDuration: 30,
        maxBlockDuration: 60
      };

      expect(() => calculateOptimalDurations(wizardData)).not.toThrow();
    });

    it('should handle invalid difficulty values gracefully', () => {
      expect(calculateWeightWithDifficulty(100, NaN)).toBe(100);
      expect(calculateWeightWithDifficulty(100, Infinity)).toBe(100);
      expect(calculateWeightWithDifficulty(100, -Infinity)).toBe(100);
    });

    it('should handle very large numbers', () => {
      expect(calculateWeightWithDifficulty(Number.MAX_SAFE_INTEGER, 1)).toBe(Number.MAX_SAFE_INTEGER * 2);
      expect(estimateBlocks([], Number.MAX_SAFE_INTEGER, 45, 90)).toBeGreaterThan(0);
    });
  });
});
