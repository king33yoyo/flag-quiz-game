import type { GameQuestion, GameSession, RegionFilter } from '../types';
import { getRandomCountries, getCountriesByContinent } from '../data/countries';

export class GameService {
  private static instance: GameService;
  private session: GameSession | null = null;
  private selectedContinent: RegionFilter = 'World';
  private usedCountryIds: Set<string> = new Set();
  
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
    continent: RegionFilter = 'World',
    userId: string = 'demo-user'
  ): GameSession {
    this.selectedContinent = continent;
    this.usedCountryIds.clear(); // Reset used countries for new game
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
    
    // Get countries based on difficulty and continent
    const difficultyMap = {
      easy: ['easy'] as const,
      medium: ['easy', 'medium'] as const,
      hard: ['easy', 'medium', 'hard'] as const,
      expert: ['easy', 'medium', 'hard', 'expert'] as const,
    };
    
    const allowedDifficulties = difficultyMap[this.session.difficulty];
    let allCountries: any[] = [];
    
    if (this.selectedContinent === 'World') {
      // Get countries from all continents
      allCountries = allowedDifficulties.flatMap(diff => 
        getRandomCountries(50, diff)
      );
    } else {
      // Get countries from specific continent
      const continentCountries = getCountriesByContinent(this.selectedContinent);
      allCountries = continentCountries.filter(country => 
        allowedDifficulties.includes(country.difficulty as any)
      );
    }
    
    // Ensure we have enough countries
    if (allCountries.length < 4) {
      // Fallback to world if not enough countries in selected continent
      allCountries = allowedDifficulties.flatMap(diff => 
        getRandomCountries(50, diff)
      );
    }
    
    // For challenge and timed modes, we might want to allow some repeats after exhausting countries
    const allowRepeats = this.session.mode === 'challenge' || this.session.mode === 'timed';
    
    // Filter out already used countries (unless repeats are allowed)
    let availableCountries: any[];
    let finalAvailableCountries: any[];
    
    if (allowRepeats) {
      // For modes allowing repeats, prefer unused countries but allow repeats if needed
      const unusedCountries = allCountries.filter(c => !this.usedCountryIds.has(c.id));
      if (unusedCountries.length >= 4) {
        availableCountries = unusedCountries;
        finalAvailableCountries = unusedCountries;
      } else {
        // Not enough unused countries, allow some repeats
        availableCountries = allCountries;
        finalAvailableCountries = allCountries;
      }
    } else {
      // For other modes, avoid repeats
      availableCountries = allCountries.filter(c => !this.usedCountryIds.has(c.id));
      
      // If we've used all available countries, reset for this difficulty level
      if (availableCountries.length < 4) {
        // Clear used countries for the current difficulty level only
        const currentDifficultyCountries = allCountries.filter(c => 
          c.difficulty === this.session!.difficulty
        );
        currentDifficultyCountries.forEach(c => this.usedCountryIds.delete(c.id));
        
        // Get updated available countries
        availableCountries = allCountries.filter(c => !this.usedCountryIds.has(c.id));
        
        // If still not enough countries, clear all used countries
        if (availableCountries.length < 4) {
          this.usedCountryIds.clear();
          availableCountries = allCountries;
        }
      }
      
      finalAvailableCountries = availableCountries;
    }
    
    if (finalAvailableCountries.length === 0) {
      throw new Error('No available countries for question generation');
    }
    
    // Select correct answer from available countries
    const correctCountry = finalAvailableCountries[Math.floor(Math.random() * finalAvailableCountries.length)];
    
    // Select 3 wrong answers from available countries (excluding used ones and correct answer)
    let wrongCountries: any[] = [];
    
    if (this.selectedContinent === 'World') {
      // For world mode, wrong answers from available countries
      const availableForWrong = finalAvailableCountries.filter(c => c.id !== correctCountry.id);
      wrongCountries = availableForWrong
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    } else {
      // For continent mode, ensure wrong answers are from the same continent
      const continentCountries = getCountriesByContinent(this.selectedContinent);
      const sameContinentAvailable = continentCountries.filter(country => 
        allowedDifficulties.includes(country.difficulty as any) && 
        country.id !== correctCountry.id &&
        !this.usedCountryIds.has(country.id)
      );
      
      if (sameContinentAvailable.length >= 3) {
        wrongCountries = sameContinentAvailable
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
      } else {
        // Fallback: if not enough countries in continent, use other available countries
        const remainingNeeded = 3 - sameContinentAvailable.length;
        const otherAvailable = finalAvailableCountries
          .filter(c => c.id !== correctCountry.id && !sameContinentAvailable.find(sc => sc.id === c.id))
          .sort(() => 0.5 - Math.random())
          .slice(0, remainingNeeded);
        
        wrongCountries = [...sameContinentAvailable, ...otherAvailable];
      }
    }
    
    // Combine and shuffle options
    const options = [correctCountry, ...wrongCountries]
      .sort(() => 0.5 - Math.random());
    
    const question: GameQuestion = {
      id: `question-${Date.now()}`,
      country: correctCountry,
      options,
      correctAnswer: correctCountry.id,
    };
    
    // Mark all used countries (only for modes that avoid repeats)
    if (!allowRepeats) {
      this.usedCountryIds.add(correctCountry.id);
      wrongCountries.forEach(country => this.usedCountryIds.add(country.id));
    }
    
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
  
  getSelectedContinent(): RegionFilter {
    return this.selectedContinent;
  }
  
  getAvailableContinents(): string[] {
    // This would be better to get from the countries data
    return ['World', 'Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];
  }
  
  // Debug method to get used countries count
  getUsedCountriesCount(): number {
    return this.usedCountryIds.size;
  }
  
  // Debug method to clear used countries (for testing)
  clearUsedCountries(): void {
    this.usedCountryIds.clear();
  }
}