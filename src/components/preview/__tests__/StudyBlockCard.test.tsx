
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StudyBlockCard from '../StudyBlockCard';
import { StudyBlock } from '@/types/cycle';

const mockBlock: StudyBlock = {
  id: 'test-id',
  persistentId: 'test-persistent-id',
  subject: 'Matemática',
  duration: 60,
  blockNumber: 1
};

const defaultProps = {
  block: mockBlock,
  index: 0,
  isCompleted: false,
  isValidBlock: true,
  isDragging: false,
  isDragOver: false,
  draggedIndex: null,
  onDragStart: vi.fn(),
  onDragOver: vi.fn(),
  onDragLeave: vi.fn(),
  onDrop: vi.fn(),
  onDragEnd: vi.fn(),
  onBlockClick: vi.fn(),
  onStartTimer: vi.fn()
};

describe('StudyBlockCard', () => {
  it('should render block information correctly', () => {
    render(<StudyBlockCard {...defaultProps} />);
    
    expect(screen.getByText('Matemática')).toBeInTheDocument();
    expect(screen.getByText('1h')).toBeInTheDocument();
  });

  it('should apply correct styling for completed blocks', () => {
    render(<StudyBlockCard {...defaultProps} isCompleted={true} />);
    
    const card = screen.getByTestId('study-block-card') || screen.getByRole('article');
    expect(card).toHaveClass('tactical-glow-success');
  });

  it('should display block number correctly', () => {
    render(<StudyBlockCard {...defaultProps} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
