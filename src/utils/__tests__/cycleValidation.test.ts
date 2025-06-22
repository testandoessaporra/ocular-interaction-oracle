import { describe, it, expect } from 'vitest';
import { validateCycleData, ValidationResult } from '../cycleValidation';
import { Cycle, StudyBlock } from '@/types/cycle';

describe('cycleValidation', () => {
  const createMockCycle = (overrides?: Partial<Cycle>): Cycle => ({
    id: 'cycle-1',
    name: 'Test Cycle',
    createdAt: new Date(),
    studyBlocks: [],
    weeklyHours: 20,
    subjects: [],
    exam: 'vestibular',
    averageDuration: 60,
    totalMinutes: 0,
    ...overrides
  });

  const createMockBlock = (overrides?: Partial<StudyBlock>): StudyBlock => ({
    id: 'block-1',
    persistentId: 'math-1',
    subject: 'Mathematics',
    duration: 30,
    blockNumber: 1,
    ...overrides
  });

  describe('validateCycleData', () => {
    it('should validate a complete and valid cycle', () => {
      const cycle = createMockCycle({
        studyBlocks: [
          createMockBlock({ duration: 30 }),
          createMockBlock({ 
            id: 'block-2', 
            persistentId: 'physics-1', 
            subject: 'Physics', 
            duration: 45,
            blockNumber: 2 
          })
        ],
        totalMinutes: 75,
        subjects: [
          { name: 'Mathematics', hoursPerWeek: 5, difficulty: 3, weight: 100 },
          { name: 'Physics', hoursPerWeek: 4, difficulty: 4, weight: 80 }
        ]
      });

      const result = validateCycleData(cycle);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    describe('Block validation', () => {
      it('should error on empty study blocks', () => {
        const cycle = createMockCycle({ studyBlocks: [] });
        const result = validateCycleData(cycle);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('O ciclo deve ter pelo menos um bloco de estudo');
      });

      it('should error on blocks with invalid duration', () => {
        const cycle = createMockCycle({
          studyBlocks: [
            createMockBlock({ duration: 25 }) // Not multiple of 15
          ]
        });
        
        const result = validateCycleData(cycle);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Bloco 1 tem duração inválida: 25 minutos (deve ser múltiplo de 15)');
      });

      it('should error on blocks without persistentId', () => {
        const cycle = createMockCycle({
          studyBlocks: [
            createMockBlock({ persistentId: '' })
          ]
        });
        
        const result = validateCycleData(cycle);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Bloco 1 não tem ID persistente');
      });

      it('should error on duplicate persistentIds', () => {
        const cycle = createMockCycle({
          studyBlocks: [
            createMockBlock(),
            createMockBlock({ id: 'block-2', blockNumber: 2 }) // Same persistentId
          ]
        });
        
        const result = validateCycleData(cycle);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('ID persistente duplicado: math-1');
      });

      it('should warn on very short blocks', () => {
        const cycle = createMockCycle({
          studyBlocks: [
            createMockBlock({ duration: 15 })
          ],
          subjects: [{ name: 'Mathematics', hoursPerWeek: 5, difficulty: 3, weight: 100 }]
        });
        
        const result = validateCycleData(cycle);
        
        expect(result.warnings).toContain('Bloco 1 tem duração muito curta (15 minutos)');
      });

      it('should warn on very long blocks', () => {
        const cycle = createMockCycle({
          studyBlocks: [
            createMockBlock({ duration: 150 })
          ],
          subjects: [{ name: 'Mathematics', hoursPerWeek: 5, difficulty: 3, weight: 100 }]
        });
        
        const result = validateCycleData(cycle);
        
        expect(result.warnings).toContain('Bloco 1 tem duração muito longa (150 minutos)');
      });
    });

    describe('Total minutes validation', () => {
      it('should error when totalMinutes is zero', () => {
        const cycle = createMockCycle({
          studyBlocks: [createMockBlock()],
          totalMinutes: 0
        });
        
        const result = validateCycleData(cycle);
        
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Tempo total do ciclo deve ser maior que zero');
      });

      it('should warn on totalMinutes mismatch', () => {
        const cycle = createMockCycle({
          studyBlocks: [
            createMockBlock({ duration: 30 }),
            createMockBlock({ 
              id: 'block-2', 
              persistentId: 'physics-1', 
              duration: 45,
              blockNumber: 2 
            })
          ],
          totalMinutes: 100, // Should be 75
          subjects: [
            { name: 'Mathematics', hoursPerWeek: 5, difficulty: 3, weight: 100 },
            { name: 'Physics', hoursPerWeek: 4, difficulty: 4, weight: 80 }
          ]
        });
        
        const result = validateCycleData(cycle);
        
        expect(result.warnings).toContain('Tempo total calculado (75) difere do informado (100)');
      });
    });

    describe('Subject validation', () => {
      it('should warn on subject without blocks', () => {
        const cycle = createMockCycle({
          studyBlocks: [createMockBlock()],
          subjects: [
            { name: 'Mathematics', hoursPerWeek: 5, difficulty: 3, weight: 100 },
            { name: 'Physics', hoursPerWeek: 4, difficulty: 4, weight: 80 } // No physics blocks
          ],
          totalMinutes: 30
        });
        
        const result = validateCycleData(cycle);
        
        expect(result.warnings).toContain('Disciplina Physics não tem blocos no ciclo');
      });

      it('should warn on blocks without corresponding subject', () => {
        const cycle = createMockCycle({
          studyBlocks: [
            createMockBlock(),
            createMockBlock({ 
              id: 'block-2', 
              persistentId: 'chemistry-1', 
              subject: 'Chemistry',
              blockNumber: 2 
            })
          ],
          subjects: [
            { name: 'Mathematics', hoursPerWeek: 5, difficulty: 3, weight: 100 }
            // No Chemistry in subjects
          ],
          totalMinutes: 75
        });
        
        const result = validateCycleData(cycle);
        
        expect(result.warnings).toContain('Bloco com disciplina Chemistry não está nas disciplinas do ciclo');
      });
    });

    describe('Edge cases', () => {
      it('should handle cycle with null values gracefully', () => {
        const cycle = createMockCycle({
          studyBlocks: null as any,
          subjects: null as any
        });
        
        const result = validateCycleData(cycle);
        
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });

      it('should validate cycle with many blocks', () => {
        const blocks = Array.from({ length: 50 }, (_, i) => 
          createMockBlock({
            id: `block-${i}`,
            persistentId: `math-${i}`,
            blockNumber: i + 1,
            duration: 30
          })
        );
        
        const cycle = createMockCycle({
          studyBlocks: blocks,
          totalMinutes: 1500,
          subjects: [{ name: 'Mathematics', hoursPerWeek: 25, difficulty: 3, weight: 100 }]
        });
        
        const result = validateCycleData(cycle);
        
        expect(result.isValid).toBe(true);
      });
    });
  });
});