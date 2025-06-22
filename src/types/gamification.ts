
export interface UserProgress {
  // Propriedades básicas obrigatórias
  level: number;
  xp: number;
  totalXP: number;
  currentXP: number;
  xpToNextLevel: number;
  nextLevelXp: number;
  totalHours: number;
  totalSessions: number;
  cycleStreak: number;
  loginStreak: number;
  lastLoginDate: string;
  protectionActive: boolean;
  coins: number;
  medals: string[];
  streakProtectionExpiresAt: string | null;
  
  // Propriedades adicionais necessárias
  streak: number;
  name: string;
  class: string;
  totalMedals: number;
  averageSessionDuration: number;
  longestStreak: number;
  streakProtectionShields: number;
  completedCycles: number;
  totalStudyTime: number;
}

export interface Medal {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
  requirements: {
    type: 'hours' | 'streak' | 'level' | 'cycles';
    value: number;
  };
}
