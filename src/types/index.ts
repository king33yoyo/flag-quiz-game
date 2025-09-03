export interface Country {
  id: string;
  name: string;
  flag: string; // SVG or PNG URL
  continent: string;
  capital: string;
  population: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

export interface GameSession {
  id: string;
  userId: string;
  mode: 'flag-identify' | 'country-select' | 'timed' | 'challenge';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  startTime: Date;
  endTime?: Date;
  streak?: number;
  /** 当前问题，仅在进行中时存在 */
  currentQuestion?: GameQuestion;
}

export interface User {
  id: string;
  username: string;
  email: string;
  totalScore: number;
  gamesPlayed: number;
  achievements: Achievement[];
  createdAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface GameQuestion {
  id: string;
  country: Country;
  options: Country[];
  correctAnswer: string;
}

export interface GameStats {
  totalScore: number;
  gamesPlayed: number;
  correctAnswers: number;
  totalQuestions: number;
  averageScore: number;
  bestScore: number;
}