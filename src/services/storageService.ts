import type { LeaderboardEntry, LeaderboardFilters, GameSession } from '../types';

export class StorageService {
  private static readonly LEADERBOARD_KEY = 'flag-quiz-leaderboard';
  private static readonly MAX_ENTRIES = 10;

  // Save leaderboard entry
  static saveLeaderboardEntry(entry: LeaderboardEntry): void {
    try {
      const leaderboard = this.getLeaderboard();
      
      // Add new entry
      leaderboard.push(entry);
      
      // Sort by score (descending) and keep only top entries
      leaderboard.sort((a, b) => b.score - a.score);
      const trimmed = leaderboard.slice(0, this.MAX_ENTRIES);
      
      // Save back to localStorage
      localStorage.setItem(this.LEADERBOARD_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Error saving leaderboard entry:', error);
    }
  }

  // Get all leaderboard entries
  static getLeaderboard(): LeaderboardEntry[] {
    try {
      const stored = localStorage.getItem(this.LEADERBOARD_KEY);
      if (!stored) return [];
      
      const entries = JSON.parse(stored);
      // Convert date strings back to Date objects
      return entries.map((entry: LeaderboardEntry & { date: string }) => ({
        ...entry,
        date: new Date(entry.date)
      }));
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      return [];
    }
  }

  // Get filtered leaderboard
  static getFilteredLeaderboard(filters: LeaderboardFilters): LeaderboardEntry[] {
    const leaderboard = this.getLeaderboard();
    
    return leaderboard.filter(entry => {
      // Filter by mode if specified
      if (filters.mode && entry.mode !== filters.mode) {
        return false;
      }
      
      // Filter by continent if specified
      if (filters.continent && entry.continent !== filters.continent) {
        return false;
      }
      
      // Filter by time frame
      if (filters.timeFrame && filters.timeFrame !== 'all') {
        const now = new Date();
        const entryDate = new Date(entry.date);
        
        switch (filters.timeFrame) {
          case 'today': {
            if (entryDate.toDateString() !== now.toDateString()) {
              return false;
            }
            break;
          }
          case 'week': {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (entryDate < weekAgo) {
              return false;
            }
            break;
          }
          case 'month': {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (entryDate < monthAgo) {
              return false;
            }
            break;
          }
        }
      }
      
      return true;
    });
  }

  // Check if score qualifies for leaderboard
  static isHighScore(score: number, mode: GameSession['mode'] = 'challenge'): boolean {
    const leaderboard = this.getLeaderboard()
      .filter(entry => entry.mode === mode)
      .sort((a, b) => b.score - a.score);
    
    // If we have less than MAX_ENTRIES, any score qualifies
    if (leaderboard.length < this.MAX_ENTRIES) {
      return true;
    }
    
    // Check if score is higher than the lowest score in leaderboard
    const lowestScore = leaderboard[leaderboard.length - 1]?.score || 0;
    return score > lowestScore;
  }

  // Clear all leaderboard data
  static clearLeaderboard(): void {
    try {
      localStorage.removeItem(this.LEADERBOARD_KEY);
    } catch (error) {
      console.error('Error clearing leaderboard:', error);
    }
  }
}