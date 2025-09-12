export interface Country {
  id: string;
  name: string;
  nameZh?: string; // 中文名称
  flag: string; // SVG or PNG URL
  continent: string;
  subregion?: string; // 子区域（如：Western Europe, Southeast Asia）
  capital: string;
  population: number;
  area?: number; // 面积（平方公里）
  languages?: string[]; // 官方语言
  currency?: string; // 货币
  coordinates?: [number, number]; // [纬度, 经度]
  neighbours?: string[]; // 邻国ID列表
  landlocked?: boolean; // 是否内陆国
  independent?: boolean; // 是否主权国家
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
  /** 挑战模式是否成功完成 */
  challengeSuccess?: boolean;
  /** 挑战模式进度信息 */
  challengeProgress?: {
    totalCountries: number;
    usedCountries: number;
    remainingCountries: number;
    completionPercentage: number;
  };
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

export type Continent = 
  | 'Africa'
  | 'Asia'
  | 'Europe'
  | 'North America'
  | 'South America'
  | 'Oceania'
  | 'Antarctica';

export type RegionFilter = Continent | 'World';

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  streak: number;
  mode: GameSession['mode'];
  difficulty: GameSession['difficulty'];
  continent: RegionFilter;
  date: Date;
  duration: number; // in seconds
}

export interface LeaderboardFilters {
  mode?: GameSession['mode'];
  continent?: RegionFilter;
  timeFrame?: 'all' | 'today' | 'week' | 'month';
}