import type { GameQuestion, GameSession } from '../types';
import { getRandomCountries } from '../data/countries';

export class GameService {
  private static instance: GameService;
  private session: GameSession | null = null;
  
  private constructor() {}
  
  static getInstance(): GameService {
    if (!GameService.instance) {
      GameService.instance = new GameService();
    }
    return GameService.instance;
  }
  
  startGame(
    mode: GameSession['mode'],
    difficulty: GameSession['difficulty'],
    userId: string = 'demo-user'
  ): GameSession {
    this.session = {
      id: `session-${Date.now()}`,
      userId,
      mode,
      difficulty,
      score: 0,
      correctAnswers: 0,
      totalQuestions: 0,
      startTime: new Date(),
    };
    return this.session;
  }
  
  generateQuestion(): GameQuestion {
    if (!this.session) {
      throw new Error('No active game session');
    }
    
    // Get countries based on difficulty
    const difficultyMap = {
      easy: ['easy'],
      medium: ['easy', 'medium'],
      hard: ['easy', 'medium', 'hard'],
      expert: ['easy', 'medium', 'hard'],
    } as const;
    
    const allowedDifficulties = difficultyMap[this.session.difficulty];
    const allCountries = allowedDifficulties.flatMap(diff => 
      getRandomCountries(20, diff)
    );
    
    // Select correct answer
    const correctCountry = allCountries[Math.floor(Math.random() * allCountries.length)];
    
    // Select 3 wrong answers from different countries
    const wrongCountries = allCountries
      .filter(c => c.id !== correctCountry.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    // Combine and shuffle options
    const options = [correctCountry, ...wrongCountries]
      .sort(() => 0.5 - Math.random());
    
    const question: GameQuestion = {
      id: `question-${Date.now()}`,
      country: correctCountry,
      options,
      correctAnswer: correctCountry.id,
    };
    // 更新会话中的 currentQuestion 便于结果判定
    this.currentQuestion = question;
    if (this.session) {
      this.session.currentQuestion = question;
    }
    return question;
  }
  
  /**
   * 处理一次答题并更新会话分数与统计
   */
  submitAnswer(_questionId: string, answerId: string): {
    isCorrect: boolean;
    score: number;
    session: GameSession;
  } {
    if (!this.session) {
      throw new Error('No active game session');
    }
    
    // 使用临时存储的 currentQuestion 进行判定
    const isCorrect = answerId === this.currentQuestion?.correctAnswer;
    
    // Calculate score based on difficulty and streak
    const baseScore = {
      easy: 10,
      medium: 20,
      hard: 30,
      expert: 50,
    }[this.session.difficulty];
    
    // Streak bonus
    const streakBonus = isCorrect ? (this.session.streak || 0) * 5 : 0;
    const score = isCorrect ? baseScore + streakBonus : 0;
    
    // Update session
    this.session.score += score;
    this.session.correctAnswers += isCorrect ? 1 : 0;
    this.session.totalQuestions += 1;
    this.session.streak = isCorrect ? (this.session.streak || 0) + 1 : 0;
    
    return {
      isCorrect,
      score,
      session: this.session,
    };
  }
  
  endGame(): GameSession {
    if (!this.session) {
      throw new Error('No active game session');
    }
    
    this.session.endTime = new Date();
    const completedSession = { ...this.session };
    this.session = null;
    return completedSession;
  }
  
  getSession(): GameSession | null {
    return this.session;
  }
  
  // Temporarily store current question
  currentQuestion: GameQuestion | null = null;
  setCurrentQuestion(question: GameQuestion) {
    this.currentQuestion = question;
  }
}