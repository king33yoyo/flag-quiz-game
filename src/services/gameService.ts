import type { GameQuestion, GameSession, RegionFilter, Country } from '../types';
import { getRandomCountries, getCountriesByContinent } from '../data/countries';

export class GameService {
  private static instance: GameService;
  private session: GameSession | null = null;
  private selectedContinent: RegionFilter = 'World';
  private usedCountryIds: Set<string> = new Set();
  private challengeModeCountries: Country[] = []; // 挑战模式专用国家池
  
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
    
    // 如果是挑战模式，初始化专用国家池
    if (mode === 'challenge') {
      this.initializeChallengeModeCountries(continent);
    } else if (mode === 'flag-identify' || mode === 'country-select') {
      // 对于有限题目模式，预计算可用的国家数量
      this.validateCountryPoolForLimitedMode(difficulty, continent);
    }
    
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
    
    // 挑战模式使用专用逻辑
    if (this.session.mode === 'challenge') {
      return this.generateChallengeQuestion();
    }
    
    // 其他模式使用原有逻辑
    return this.generateRegularQuestion();
  }
  
  /**
   * 验证有限题目模式的国家池
   */
  private validateCountryPoolForLimitedMode(difficulty: GameSession['difficulty'], continent: RegionFilter): void {
    let allCountries: Country[] = [];
    
    if (continent === 'World') {
      allCountries = getRandomCountries(1000, difficulty);
    } else {
      allCountries = getCountriesByContinent(continent)
        .filter(c => this.isDifficultyMatch(c.difficulty, difficulty));
    }
    
    // 确保有足够的独特国家（至少需要40个，因为每个问题需要4个不同国家）
    if (allCountries.length < 40) {
      console.warn(`Warning: Only ${allCountries.length} countries available for ${continent} ${difficulty} mode. Some repetition may occur.`);
    }
  }
  
  /**
   * 初始化挑战模式国家池
   */
  private initializeChallengeModeCountries(continent: RegionFilter): void {
    if (continent === 'World') {
      // 世界模式：从所有国家中随机选择50个作为挑战池
      this.challengeModeCountries = getRandomCountries(50, 'expert');
    } else {
      // 大洲模式：使用该大洲的所有国家
      this.challengeModeCountries = getCountriesByContinent(continent);
    }
  }
  
  /**
   * 生成挑战模式的问题
   */
  private generateChallengeQuestion(): GameQuestion {
    if (!this.session) {
      throw new Error('No active game session');
    }
    
    // 获取尚未使用的国家
    const availableCountries = this.challengeModeCountries.filter(c => !this.usedCountryIds.has(c.id));
    
    // 检查是否已完成所有国家的挑战
    if (availableCountries.length === 0) {
      throw new Error('CHALLENGE_COMPLETED'); // 特殊错误码表示挑战成功完成
    }
    
    // 如果剩余国家不足4个，只使用剩余的国家作为选项
    const correctCountry = availableCountries[Math.floor(Math.random() * availableCountries.length)];
    
    // 选择错误答案：优先从同一大洲选择，如果没有足够的国家，则从挑战池中选择
    let wrongCountries: Country[] = [];
    
    if (this.selectedContinent === 'World') {
      // 世界模式：从挑战池中未使用的国家选择
      const availableForWrong = availableCountries.filter(c => c.id !== correctCountry.id);
      wrongCountries = availableForWrong
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(3, availableForWrong.length));
    } else {
      // 大洲模式：优先从同一大洲选择
      const continentCountries = getCountriesByContinent(this.selectedContinent);
      const sameContinentAvailable = continentCountries.filter(country => 
        country.id !== correctCountry.id &&
        this.challengeModeCountries.some(cc => cc.id === country.id) // 确保在挑战池中
      );
      
      // 首先从同一大洲的可用国家中选择
      const sameContinentUnused = sameContinentAvailable.filter(c => !this.usedCountryIds.has(c.id));
      wrongCountries = sameContinentUnused
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(3, sameContinentUnused.length));
      
      // 如果同一大洲的国家不够，从挑战池的其他国家补充
      if (wrongCountries.length < 3) {
        const remainingNeeded = 3 - wrongCountries.length;
        const otherAvailable = availableCountries
          .filter(c => c.id !== correctCountry.id && !wrongCountries.find(wc => wc.id === c.id))
          .sort(() => 0.5 - Math.random())
          .slice(0, remainingNeeded);
        
        wrongCountries = [...wrongCountries, ...otherAvailable];
      }
    }
    
    // 确保至少有2个选项（如果只有1个国家，则重复使用已使用的国家作为错误答案）
    if (wrongCountries.length < 3) {
      const remainingNeeded = 3 - wrongCountries.length;
      const usedCountries = Array.from(this.usedCountryIds)
        .map(id => this.challengeModeCountries.find(c => c.id === id))
        .filter(c => c && c.id !== correctCountry.id) as Country[];
      
      const additionalWrong = usedCountries
        .sort(() => 0.5 - Math.random())
        .slice(0, remainingNeeded);
      
      wrongCountries = [...wrongCountries, ...additionalWrong];
    }
    
    // 组合并打乱选项
    const options = [correctCountry, ...wrongCountries]
      .sort(() => 0.5 - Math.random());
    
    const question: GameQuestion = {
      id: `question-${Date.now()}`,
      country: correctCountry,
      options,
      correctAnswer: correctCountry.id,
    };
    
    // 标记使用的国家（只标记正确答案，错误答案可以重复使用）
    this.usedCountryIds.add(correctCountry.id);
    
    // 更新会话中的当前问题
    this.currentQuestion = question;
    if (this.session) {
      this.session.currentQuestion = question;
    }
    
    return question;
  }
  
  /**
   * 生成常规模式的问题（改进的防重复逻辑）
   */
  private generateRegularQuestion(): GameQuestion {
    if (!this.session) {
      throw new Error('No active game session');
    }
    
    // 根据游戏模式决定防重复策略
    const isLimitedQuestionMode = this.session.mode === 'flag-identify' || this.session.mode === 'country-select';
    const isTimedMode = this.session.mode === 'timed';
    
    // Get countries based on continent and difficulty
    let allCountries: Country[] = [];
    
    if (this.selectedContinent === 'World') {
      allCountries = getRandomCountries(1000, this.session!.difficulty);
    } else {
      allCountries = getCountriesByContinent(this.selectedContinent)
        .filter(c => this.isDifficultyMatch(c.difficulty, this.session!.difficulty));
    }
    
    // 管理可用国家池
    let availableCountries = this.manageAvailableCountries(allCountries, isLimitedQuestionMode, isTimedMode);
    
    if (availableCountries.length === 0) {
      throw new Error('No available countries for question generation');
    }
    
    // 选择正确答案
    const correctCountry = availableCountries[Math.floor(Math.random() * availableCountries.length)];
    
    // 选择错误答案（确保不重复）
    const wrongCountries = this.selectWrongAnswers(availableCountries, correctCountry);
    
    // 组合并打乱选项
    const options = [correctCountry, ...wrongCountries]
      .sort(() => 0.5 - Math.random());
    
    const question: GameQuestion = {
      id: `question-${Date.now()}`,
      country: correctCountry,
      options,
      correctAnswer: correctCountry.id,
    };
    
    // 标记使用的国家
    this.markUsedCountries([correctCountry, ...wrongCountries], isLimitedQuestionMode);
    
    // 更新会话中的当前问题
    this.currentQuestion = question;
    if (this.session) {
      this.session.currentQuestion = question;
    }
    return question;
  }
  
  /**
   * 检查难度匹配
   */
  private isDifficultyMatch(countryDifficulty: string, gameDifficulty: string): boolean {
    if (gameDifficulty === 'expert') return true;
    if (gameDifficulty === 'hard') return countryDifficulty === 'hard' || countryDifficulty === 'expert';
    if (gameDifficulty === 'medium') return countryDifficulty === 'medium' || countryDifficulty === 'hard' || countryDifficulty === 'expert';
    return countryDifficulty === 'easy';
  }
  
  /**
   * 管理可用国家池
   */
  private manageAvailableCountries(allCountries: Country[], isLimitedQuestionMode: boolean, isTimedMode: boolean): Country[] {
    // 过滤已使用的国家
    let availableCountries = allCountries.filter(c => !this.usedCountryIds.has(c.id));
    
    if (availableCountries.length < 4) {
      if (isLimitedQuestionMode) {
        // 对于有限题目模式，如果不够4个，抛出错误（应该不会发生，因为题目数量有限）
        throw new Error('Not enough unique countries for limited question mode');
      } else if (isTimedMode) {
        // 对于限时模式，清除最旧的使用记录
        this.clearOldestUsedCountries(allCountries, 10);
        availableCountries = allCountries.filter(c => !this.usedCountryIds.has(c.id));
      } else {
        // 其他模式，保留最近20个
        const usedArray = Array.from(this.usedCountryIds);
        if (usedArray.length > 20) {
          const toRemove = usedArray.slice(0, usedArray.length - 20);
          toRemove.forEach(id => this.usedCountryIds.delete(id));
          availableCountries = allCountries.filter(c => !this.usedCountryIds.has(c.id));
        }
      }
    }
    
    return availableCountries;
  }
  
  /**
   * 清除最旧的使用记录
   */
  private clearOldestUsedCountries(_allCountries: Country[], keepCount: number): void {
    const usedArray = Array.from(this.usedCountryIds);
    if (usedArray.length <= keepCount) return;
    
    // 保留最近使用的keepCount个国家
    const toRemove = usedArray.slice(0, usedArray.length - keepCount);
    toRemove.forEach(id => this.usedCountryIds.delete(id));
  }
  
  /**
   * 选择错误答案（确保不重复）
   */
  private selectWrongAnswers(availableCountries: Country[], correctCountry: Country): Country[] {
    let wrongCountries: Country[] = [];
    
    if (this.selectedContinent === 'World') {
      // 世界模式：从可用国家中选择
      const availableForWrong = availableCountries.filter(c => c.id !== correctCountry.id);
      wrongCountries = this.selectUniqueWrongAnswers(availableForWrong, 3);
    } else {
      // 大洲模式：优先从同一大洲选择
      const continentCountries = getCountriesByContinent(this.selectedContinent)
        .filter(c => this.isDifficultyMatch(c.difficulty, this.session!.difficulty));
      
      const sameContinentAvailable = continentCountries.filter(country => 
        country.id !== correctCountry.id &&
        !this.usedCountryIds.has(country.id)
      );
      
      if (sameContinentAvailable.length >= 3) {
        wrongCountries = this.selectUniqueWrongAnswers(sameContinentAvailable, 3);
      } else {
        // 如果同一大洲不够，从可用国家中补充
        const remainingNeeded = 3 - sameContinentAvailable.length;
        const otherAvailable = availableCountries
          .filter(c => c.id !== correctCountry.id && !sameContinentAvailable.find(sc => sc.id === c.id));
        
        const additionalWrong = this.selectUniqueWrongAnswers(otherAvailable, remainingNeeded);
        wrongCountries = [...sameContinentAvailable, ...additionalWrong];
      }
    }
    
    // 如果还是不够3个，使用已使用的国家作为最后选择
    if (wrongCountries.length < 3) {
      const remainingNeeded = 3 - wrongCountries.length;
      const usedCountries = this.getUsedCountriesForWrongAnswers(correctCountry);
      const additionalWrong = this.selectUniqueWrongAnswers(usedCountries, remainingNeeded);
      wrongCountries = [...wrongCountries, ...additionalWrong];
    }
    
    return wrongCountries;
  }
  
  /**
   * 选择唯一的错误答案
   */
  private selectUniqueWrongAnswers(candidateCountries: Country[], count: number): Country[] {
    return candidateCountries
      .sort(() => 0.5 - Math.random())
      .slice(0, count);
  }
  
  /**
   * 获取可用于错误答案的已使用国家
   */
  private getUsedCountriesForWrongAnswers(excludeCountry: Country): Country[] {
    const allCountries = this.selectedContinent === 'World' 
      ? getRandomCountries(1000, this.session!.difficulty)
      : getCountriesByContinent(this.selectedContinent)
          .filter(c => this.isDifficultyMatch(c.difficulty, this.session!.difficulty));
    
    return allCountries.filter(c => 
      c.id !== excludeCountry.id &&
      this.usedCountryIds.has(c.id)
    );
  }
  
  /**
   * 标记使用的国家
   */
  private markUsedCountries(countries: Country[], isLimitedQuestionMode: boolean): void {
    if (isLimitedQuestionMode) {
      // 有限题目模式：标记所有选项国家
      countries.forEach(country => this.usedCountryIds.add(country.id));
    } else {
      // 其他模式：只标记正确答案
      this.usedCountryIds.add(countries[0].id);
    }
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
  
  /**
   * 获取挑战模式的进度信息
   */
  getChallengeProgress(): {
    totalCountries: number;
    usedCountries: number;
    remainingCountries: number;
    completionPercentage: number;
  } {
    if (!this.challengeModeCountries.length) {
      return {
        totalCountries: 0,
        usedCountries: 0,
        remainingCountries: 0,
        completionPercentage: 0,
      };
    }
    
    const usedCountries = this.challengeModeCountries.filter(c => this.usedCountryIds.has(c.id)).length;
    const remainingCountries = this.challengeModeCountries.length - usedCountries;
    const completionPercentage = Math.round((usedCountries / this.challengeModeCountries.length) * 100);
    
    return {
      totalCountries: this.challengeModeCountries.length,
      usedCountries,
      remainingCountries,
      completionPercentage,
    };
  }
  
  /**
   * 检查挑战模式是否已完成
   */
  isChallengeCompleted(): boolean {
    if (!this.challengeModeCountries.length) {
      return false;
    }
    
    const usedCountries = this.challengeModeCountries.filter(c => this.usedCountryIds.has(c.id)).length;
    return usedCountries === this.challengeModeCountries.length;
  }
}