import { useState, useEffect } from 'react';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';
import { StorageService } from '../../services/storageService';
import type { LeaderboardEntry, LeaderboardFilters } from '../../types';
import { useI18n } from '../../i18n';

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useI18n();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [filters, setFilters] = useState<LeaderboardFilters>({
    mode: 'challenge',
    continent: 'World',
    timeFrame: 'all'
  });

  // Load leaderboard entries when filters change
  useEffect(() => {
    const filteredEntries = StorageService.getFilteredLeaderboard(filters);
    setEntries(filteredEntries);
  }, [filters]);

  const handleFilterChange = (key: keyof LeaderboardFilters, value: string | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearLeaderboard = () => {
    if (window.confirm('Are you sure you want to clear all leaderboard data?')) {
      StorageService.clearLeaderboard();
      setEntries([]);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header - 文字内容已删除 */}
        <div className="flex justify-end items-center mb-6">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearLeaderboard}
              className="text-red-600 hover:text-red-700"
            >
              Clear
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mode
            </label>
            <select
              value={filters.mode || 'all'}
              onChange={(e) => handleFilterChange('mode', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Modes</option>
              <option value="challenge">Survival</option>
              <option value="timed">Timed</option>
              <option value="flag-identify">Flag Identify</option>
              <option value="country-select">Country Select</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Region
            </label>
            <select
              value={filters.continent || 'World'}
              onChange={(e) => handleFilterChange('continent', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="World">World</option>
              <option value="Africa">Africa</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="North America">North America</option>
              <option value="South America">South America</option>
              <option value="Oceania">Oceania</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Frame
            </label>
            <select
              value={filters.timeFrame}
              onChange={(e) => handleFilterChange('timeFrame', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Leaderboard Entries */}
        <div className="flex-1 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <p className="text-gray-600">No entries yet. Be the first to set a record!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all hover:shadow-md ${
                    index === 0
                      ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-300'
                      : index === 1
                      ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300'
                      : index === 2
                      ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-300'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl font-bold">
                      {getRankIcon(index + 1)}
                    </div>
                    <div>
                      <div className="font-semibold text-lg">
                        {entry.playerName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {entry.mode === 'challenge' ? 'Survival' : entry.mode} • {entry.continent}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(entry.date)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-gradient">
                      {entry.score}
                    </div>
                    <div className="text-sm text-gray-600">
                      {entry.correctAnswers}/{entry.totalQuestions} ({Math.round(entry.accuracy)}%)
                    </div>
                    <div className="text-xs text-gray-500">
                      {entry.streak > 0 && `🔥 ${entry.streak} streak`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Summary */}
        {entries.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {entries.length}
                </div>
                <div className="text-sm text-gray-600">Total Entries</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {entries[0]?.score || 0}
                </div>
                <div className="text-sm text-gray-600">Highest Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(entries.reduce((acc, entry) => acc + entry.accuracy, 0) / entries.length)}%
                </div>
                <div className="text-sm text-gray-600">Avg Accuracy</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {Math.max(...entries.map(e => e.streak))}
                </div>
                <div className="text-sm text-gray-600">Best Streak</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};