
import { describe, it, expect, beforeEach } from 'vitest';
import { generateStudyBlocks } from '../blockGenerator';
import { Subject } from '@/types/cycle';

describe('blockGenerator', () => {
  let mockSubjects: Subject[];

  beforeEach(() => {
    // Reset mock subjects before each test
    mockSubjects = [
      {
        name: 'Matemática',
        difficulty: 'Alta',
        hoursPerWeek: 2.5,
        weight: 3
      },
      {
        name: 'Português',
        difficulty: 'Média',
        hoursPerWeek: 2.0,
        weight: 2
      },
      {
        name: 'História',
        difficulty: 'Baixa',
        hoursPerWeek: 1.5,
        weight: 1
      }
    ];
  });

  describe('Basic Generation', () => {
    it('should generate study blocks with valid structure', () => {
      const blocks = generateStudyBlocks(mockSubjects, 45, 90);

      expect(blocks).toBeDefined();
      expect(Array.isArray(blocks)).toBe(true);
      expect(blocks.length).toBeGreaterThan(0);

      blocks.forEach((block, index) => {
        expect(block).toHaveProperty('id');
        expect(block).toHaveProperty('persistentId');
        expect(block).toHaveProperty('subject');
        expect(block).toHaveProperty('duration');
        expect(block).toHaveProperty('blockNumber');

        expect(typeof block.id).toBe('string');
        expect(typeof block.persistentId).toBe('string');
        expect(typeof block.subject).toBe('string');
        expect(typeof block.duration).toBe('number');
        expect(typeof block.blockNumber).toBe('number');

        expect(block.blockNumber).toBe(index + 1);
      });
    });

    it('should generate blocks with durations as multiples of 15', () => {
      const blocks = generateStudyBlocks(mockSubjects, 45, 90);

      blocks.forEach(block => {
        expect(block.duration % 15).toBe(0);
        expect(block.duration).toBeGreaterThanOrEqual(15);
      });
    });

    it('should respect minimum and maximum duration constraints', () => {
      const minDuration = 30;
      const maxDuration = 75;
      const blocks = generateStudyBlocks(mockSubjects, minDuration, maxDuration);

      blocks.forEach(block => {
        expect(block.duration).toBeGreaterThanOrEqual(minDuration);
        expect(block.duration).toBeLessThanOrEqual(maxDuration);
      });
    });
  });

  describe('Subject Distribution', () => {
    it('should include all subjects with sufficient hours', () => {
      const blocks = generateStudyBlocks(mockSubjects, 45, 90);
      const subjectsInBlocks = [...new Set(blocks.map(block => block.subject))];

      mockSubjects.forEach(subject => {
        // Subjects with enough hours should appear
        if (subject.hoursPerWeek * 60 >= 45) {
          expect(subjectsInBlocks).toContain(subject.name);
        }
      });
    });

    it('should distribute time proportionally to subject weights and hours', () => {
      const blocks = generateStudyBlocks(mockSubjects, 45, 90);
      
      // Calculate actual time distribution
      const timeBySubject: { [key: string]: number } = {};
      blocks.forEach(block => {
        timeBySubject[block.subject] = (timeBySubject[block.subject] || 0) + block.duration;
      });

      // Subjects with higher hours/weight should get more total time
      const mathTime = timeBySubject['Matemática'] || 0;
      const portugueseTime = timeBySubject['Português'] || 0;
      const historyTime = timeBySubject['História'] || 0;

      // Matemática (2.5h) should have more time than Português (2.0h)
      expect(mathTime).toBeGreaterThanOrEqual(portugueseTime);
      
      // Português (2.0h) should have more time than História (1.5h)
      expect(portugueseTime).toBeGreaterThanOrEqual(historyTime);
    });
  });

  describe('Unique Identifiers', () => {
    it('should generate unique IDs for all blocks', () => {
      const blocks = generateStudyBlocks(mockSubjects, 45, 90);
      const ids = blocks.map(block => block.id);
      const uniqueIds = [...new Set(ids)];

      expect(uniqueIds.length).toBe(blocks.length);
    });

    it('should generate valid persistentIds following pattern', () => {
      const blocks = generateStudyBlocks(mockSubjects, 45, 90);

      blocks.forEach(block => {
        expect(block.persistentId).toMatch(/^.+-bloco-\d+$/);
        expect(block.persistentId).toContain(block.subject);
        expect(block.persistentId).not.toBe('undefined');
        expect(block.persistentId).not.toContain('undefined');
      });
    });

    it('should increment persistentId numbers correctly for same subject', () => {
      const blocks = generateStudyBlocks(mockSubjects, 30, 60);
      
      // Group blocks by subject
      const blocksBySubject: { [key: string]: typeof blocks } = {};
      blocks.forEach(block => {
        if (!blocksBySubject[block.subject]) {
          blocksBySubject[block.subject] = [];
        }
        blocksBySubject[block.subject].push(block);
      });

      // Check each subject's blocks have incrementing numbers
      Object.values(blocksBySubject).forEach(subjectBlocks => {
        subjectBlocks.forEach((block, index) => {
          const expectedNumber = index + 1;
          expect(block.persistentId).toContain(`-bloco-${expectedNumber}`);
        });
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle single subject', () => {
      const singleSubject = [mockSubjects[0]];
      const blocks = generateStudyBlocks(singleSubject, 45, 90);

      expect(blocks.length).toBeGreaterThan(0);
      blocks.forEach(block => {
        expect(block.subject).toBe(singleSubject[0].name);
      });
    });

    it('should handle subjects with very low hours', () => {
      const lowHourSubjects: Subject[] = [
        {
          name: 'Test Subject',
          difficulty: 'Baixa',
          hoursPerWeek: 0.5, // 30 minutes
          weight: 1
        }
      ];

      const blocks = generateStudyBlocks(lowHourSubjects, 30, 60);
      
      if (blocks.length > 0) {
        blocks.forEach(block => {
          expect(block.duration).toBeGreaterThanOrEqual(30);
          expect(block.duration % 15).toBe(0);
        });
      }
    });

    it('should handle extreme duration ranges', () => {
      const blocks = generateStudyBlocks(mockSubjects, 15, 180);

      blocks.forEach(block => {
        expect(block.duration).toBeGreaterThanOrEqual(15);
        expect(block.duration).toBeLessThanOrEqual(180);
        expect(block.duration % 15).toBe(0);
      });
    });

    it('should handle many subjects', () => {
      const manySubjects: Subject[] = Array.from({ length: 10 }, (_, i) => ({
        name: `Subject ${i + 1}`,
        difficulty: 'Média',
        hoursPerWeek: 2,
        weight: 1
      }));

      const blocks = generateStudyBlocks(manySubjects, 45, 90);
      
      expect(blocks.length).toBeGreaterThan(0);
      expect(blocks.length).toBeLessThan(100); // Reasonable upper limit
      
      const subjectsInBlocks = [...new Set(blocks.map(block => block.subject))];
      expect(subjectsInBlocks.length).toBeLessThanOrEqual(manySubjects.length);
    });
  });

  describe('Duration Consistency', () => {
    it('should round non-multiple durations to nearest 15', () => {
      // Test with subjects that might generate non-15 multiples
      const irregularSubjects: Subject[] = [
        {
          name: 'Irregular Subject',
          difficulty: 'Média',
          hoursPerWeek: 1.7, // 102 minutes - not multiple of 15
          weight: 1
        }
      ];

      const blocks = generateStudyBlocks(irregularSubjects, 45, 90);
      
      blocks.forEach(block => {
        expect(block.duration % 15).toBe(0);
      });
    });

    it('should maintain total time approximation', () => {
      const blocks = generateStudyBlocks(mockSubjects, 45, 90);
      
      const totalGeneratedMinutes = blocks.reduce((sum, block) => sum + block.duration, 0);
      const totalExpectedMinutes = mockSubjects.reduce((sum, subject) => sum + (subject.hoursPerWeek * 60), 0);
      
      // Allow for some variance due to rounding and optimization
      const variance = Math.abs(totalGeneratedMinutes - totalExpectedMinutes);
      const variancePercentage = (variance / totalExpectedMinutes) * 100;
      
      expect(variancePercentage).toBeLessThan(20); // Within 20% is acceptable
    });
  });

  describe('Performance and Limits', () => {
    it('should complete generation in reasonable time', () => {
      const startTime = Date.now();
      
      generateStudyBlocks(mockSubjects, 45, 90);
      
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should not generate excessive number of blocks', () => {
      const blocks = generateStudyBlocks(mockSubjects, 15, 30);
      
      expect(blocks.length).toBeLessThan(80); // Reasonable upper limit
    });
  });
});
