import type { GameQuestion, GameSession, RegionFilter, Country } from '../types';
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
    
    // Get countries based on continent (no difficulty filtering)
    let allCountries: Country[] = [];
    
    if (this.selectedContinent === 'World') {
      // Get all countries from all continents
      allCountries = getRandomCountries(1000, 'expert'); // Get a large sample
    } else {
      // Get countries from specific continent
      allCountries = getCountriesByContinent(this.selectedContinent);
    }
    
    // Filter out already used countries to avoid repetition
    let availableCountries = allCountries.filter(c => !this.usedCountryIds.has(c.id));
    
    // If we don't have enough unused countries, clear some old ones
    if (availableCountries.length < 4) {
      // Keep only the last 20 used countries to avoid overwhelming repetition
      const usedArray = Array.from(this.usedCountryIds);
      if (usedArray.length > 20) {
        const toRemove = usedArray.slice(0, usedArray.length - 20);
        toRemove.forEach(id => this.usedCountryIds.delete(id));
        availableCountries = allCountries.filter(c => !this.usedCountryIds.has(c.id));
      }
      
      // If still not enough, clear all but the last 10
      if (availableCountries.length < 4) {
        this.usedCountryIds.clear();
        // Add back the most recent 10 countries if they exist
        const recentCountries = usedArray.slice(-10);
        recentCountries.forEach(id => {
          const country = allCountries.find(c => c.id === id);
          if (country) this.usedCountryIds.add(id);
        });
        availableCountries = allCountries.filter(c => !this.usedCountryIds.has(c.id));
      }
    }
    
    const finalAvailableCountries = availableCountries;
    
    if (finalAvailableCountries.length === 0) {
      throw new Error('No available countries for question generation');
    }
    
    // Select correct answer from available countries
    const correctCountry = finalAvailableCountries[Math.floor(Math.random() * finalAvailableCountries.length)];
    
    // Select 3 wrong answers from available countries (excluding used ones and correct answer)
    let wrongCountries: Country[] = [];
    
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
    
    // Mark all used countries to avoid repetition
    this.usedCountryIds.add(correctCountry.id);
    wrongCountries.forEach(country => this.usedCountryIds.add(country.id));
    
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
    
    // Fixed base score with streak bonus
    const baseScore = 20;
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