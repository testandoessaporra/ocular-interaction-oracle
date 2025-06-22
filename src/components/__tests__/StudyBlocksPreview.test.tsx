
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StudyBlocksPreview from '../StudyBlocksPreview';
import { StudyBlock } from '@/types/cycle';

// Mock the optimization config
vi.mock('@/constants/optimizationConfig', () => ({
  OPTIMIZATION_CONFIG: {
    ANIMATIONS: {
      ENABLE_FRAMER_MOTION: false
    }
  }
}));

// Mock the hooks
vi.mock('@/hooks/useBlockValidation', () => ({
  useBlockValidation: vi.fn(() => ({
    validateCompletedBlocks: vi.fn(() => []),
    isBlockCompleted: vi.fn(() => false),
    isBlockValid: vi.fn(() => true)
  }))
}));

vi.mock('@/hooks/useProgressCalculation', () => ({
  useProgressCalculation: vi.fn(() => ({
    progressPercentage: 0,
    isComplete: false,
    stats: {
      totalBlocks: 10,
      completedBlocks: 0,
      remainingBlocks: 10,
      estimatedTimeRemaining: 300
    }
  }))
}));

vi.mock('@/hooks/useDragAndDrop', () => ({
  useDragAndDrop: vi.fn(() => ({
    draggedIndex: null,
    dragOverIndex: null,
    handleDragStart: vi.fn(),
    handleDragEnd: vi.fn(),
    handleDragOver: vi.fn(),
    handleDragLeave: vi.fn(),
    handleDrop: vi.fn()
  }))
}));

describe('StudyBlocksPreview', () => {
  const mockBlocks: StudyBlock[] = [
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
    }
  ];

  const defaultProps = {
    studyBlocks: mockBlocks,
    completedBlocks: [],
    onBlockClick: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render study blocks', () => {
      render(<StudyBlocksPreview {...defaultProps} />);
      
      expect(screen.getByText('Mathematics')).toBeDefined();
      expect(screen.getByText('Physics')).toBeDefined();
    });

    it('should not render when no blocks', () => {
      const { container } = render(<StudyBlocksPreview {...defaultProps} studyBlocks={[]} />);
      
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Interactions', () => {
    it('should call onBlockClick when block is clicked', () => {
      render(<StudyBlocksPreview {...defaultProps} />);
      
      const firstBlock = screen.getByText('Mathematics').closest('[role="button"]');
      if (firstBlock) {
        fireEvent.click(firstBlock);
        expect(defaultProps.onBlockClick).toHaveBeenCalledWith(mockBlocks[0]);
      }
    });
  });
});
