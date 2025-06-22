import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBlockValidation } from '../useBlockValidation';
import { StudyBlock } from '@/types/cycle';

describe('useBlockValidation', () => {
  const mockStudyBlocks: StudyBlock[] = [
    {
      id: '1',
      persistentId: 'math-1',
      subject: 'Mathematics',
      duration: 30,
      blockNumber: 1
    },
    {
      id: '2',
      persistentId: 'physics-1',
      subject: 'Physics',
      duration: 45,
      blockNumber: 2
    },
    {
      id: '3',
      persistentId: 'chemistry-1',
      subject: 'Chemistry',
      duration: 60,
      blockNumber: 3
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateCompletedBlocks', () => {
    it('should filter out invalid completed blocks', () => {
      const completedBlocks = ['math-1', 'invalid-id', 'physics-1', 'undefined'];
      
      const { result } = renderHook(() => 
        useBlockValidation(mockStudyBlocks, completedBlocks)
      );
      
      const validBlocks = result.current.validateCompletedBlocks();
      
      expect(validBlocks).toEqual(['math-1', 'physics-1']);
      expect(validBlocks).not.toContain('invalid-id');
      expect(validBlocks).not.toContain('undefined');
    });

    it('should handle empty completed blocks array', () => {
      const { result } = renderHook(() => 
        useBlockValidation(mockStudyBlocks, [])
      );
      
      const validBlocks = result.current.validateCompletedBlocks();
      
      expect(validBlocks).toEqual([]);
    });

    it('should validate all blocks when all are valid', () => {
      const completedBlocks = ['math-1', 'physics-1', 'chemistry-1'];
      
      const { result } = renderHook(() => 
        useBlockValidation(mockStudyBlocks, completedBlocks)
      );
      
      const validBlocks = result.current.validateCompletedBlocks();
      
      expect(validBlocks).toEqual(completedBlocks);
    });
  });

  describe('isBlockCompleted', () => {
    it('should correctly identify completed blocks', () => {
      const completedBlocks = ['math-1', 'chemistry-1'];
      
      const { result } = renderHook(() => 
        useBlockValidation(mockStudyBlocks, completedBlocks)
      );
      
      const validBlocks = result.current.validateCompletedBlocks();
      
      expect(result.current.isBlockCompleted('math-1', validBlocks)).toBe(true);
      expect(result.current.isBlockCompleted('physics-1', validBlocks)).toBe(false);
      expect(result.current.isBlockCompleted('chemistry-1', validBlocks)).toBe(true);
    });

    it('should handle invalid block IDs', () => {
      const { result } = renderHook(() => 
        useBlockValidation(mockStudyBlocks, ['math-1'])
      );
      
      const validBlocks = result.current.validateCompletedBlocks();
      
      expect(result.current.isBlockCompleted('', validBlocks)).toBe(false);
      expect(result.current.isBlockCompleted('undefined', validBlocks)).toBe(false);
      expect(result.current.isBlockCompleted('non-existent', validBlocks)).toBe(false);
    });
  });

  describe('isBlockValid', () => {
    it('should validate blocks with proper persistentId', () => {
      const { result } = renderHook(() => 
        useBlockValidation(mockStudyBlocks, [])
      );
      
      expect(result.current.isBlockValid(mockStudyBlocks[0])).toBe(true);
      expect(result.current.isBlockValid(mockStudyBlocks[1])).toBe(true);
    });

    it('should invalidate blocks without persistentId', () => {
      const invalidBlock: StudyBlock = {
        id: '4',
        persistentId: '',
        subject: 'Invalid',
        duration: 30,
        blockNumber: 4
      };
      
      const { result } = renderHook(() => 
        useBlockValidation(mockStudyBlocks, [])
      );
      
      expect(result.current.isBlockValid(invalidBlock)).toBe(false);
    });

    it('should invalidate blocks with undefined persistentId', () => {
      const invalidBlock: StudyBlock = {
        id: '5',
        persistentId: 'undefined',
        subject: 'Invalid',
        duration: 30,
        blockNumber: 5
      };
      
      const { result } = renderHook(() => 
        useBlockValidation(mockStudyBlocks, [])
      );
      
      expect(result.current.isBlockValid(invalidBlock)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle study blocks with duplicate persistentIds', () => {
      const blocksWithDuplicates: StudyBlock[] = [
        ...mockStudyBlocks,
        {
          id: '4',
          persistentId: 'math-1', // Duplicate
          subject: 'Mathematics',
          duration: 30,
          blockNumber: 4
        }
      ];
      
      const completedBlocks = ['math-1'];
      
      const { result } = renderHook(() => 
        useBlockValidation(blocksWithDuplicates, completedBlocks)
      );
      
      const validBlocks = result.current.validateCompletedBlocks();
      
      // Should still validate the completed block even with duplicates
      expect(validBlocks).toEqual(['math-1']);
    });

    it('should handle empty study blocks array', () => {
      const { result } = renderHook(() => 
        useBlockValidation([], ['some-id'])
      );
      
      const validBlocks = result.current.validateCompletedBlocks();
      
      expect(validBlocks).toEqual([]);
    });
  });
});