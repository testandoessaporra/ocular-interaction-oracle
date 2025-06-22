
import { StudyBlock, Subject } from '@/types/cycle';

export interface SubjectData {
  name: string;
  totalMinutes: number;
  remainingMinutes: number;
  isHeavy: boolean;
}

export interface BlockGenerationResult {
  blocks: StudyBlock[];
  totalMinutes: number;
  errorMargin: number;
}

export interface GenerationParams {
  minDuration: number;
  maxDuration: number;
  startBlockNumber: number;
}
