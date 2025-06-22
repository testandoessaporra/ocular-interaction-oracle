
import { Cycle } from '@/types/cycle';
import { UserProgress } from '@/types/gamification';
import { StudySession } from '@/types/userTypes';

export interface UserContextType {
  userProgress: UserProgress;
  setUserProgress: React.Dispatch<React.SetStateAction<UserProgress>>;
  studySessions: StudySession[];
  setStudySessions: React.Dispatch<React.SetStateAction<StudySession[]>>;
  currentCycle: Cycle | null;
  setCurrentCycle: (cycle: Cycle | null, preserveProgress?: boolean) => void;
  completedBlocks: string[];
  setCompletedBlocks: React.Dispatch<React.SetStateAction<string[]>>;
  resetCompletedBlocks: () => void;
  targetExam: string | null;
  setTargetExam: React.Dispatch<React.SetStateAction<string | null>>;
  addStudySession: (session: { subject: string; date: string; duration: number; type: string; notes?: string }) => void;
  addCompletedBlock: (blockId: string) => void;
  resetAllProgress: () => void;
}
