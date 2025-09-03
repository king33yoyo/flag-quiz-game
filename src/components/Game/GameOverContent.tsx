import { useState, useEffect } from 'react';
import { Button } from '../UI/Button';
import { StorageService } from '../../services/storageService';
import type { GameSession, RegionFilter } from '../../types';
import { useI18n } from '../../i18n';

interface GameOverContentProps {
  session: GameSession;
  mode: GameSession['mode'];
  difficulty: GameSession['difficulty'];
  continent: RegionFilter;
  onPlayAgain: () => void;
}

export const GameOverContent: React.FC<GameOverContentProps> = ({
  session,
  mode,
  difficulty,
  continent,
  onPlayAgain,
}) => {
  const { t } = useI18n();
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [isHighScore, setIsHighScore] = useState(false);
  const [saved, setSaved] = useState(false);

  // Check if this is a high score when component mounts
  useEffect(() => {
    const highScore = StorageService.isHighScore(session.score, mode);
    setIsHighScore(highScore);
    setShowNameInput(highScore);
  }, [session.score, mode]);

  const handleSaveScore = () => {
    if (!playerName.trim()) return;

    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      playerName: playerName.trim(),
      score: session.score,
      correctAnswers: session.correctAnswers,
      totalQuestions: session.totalQuestions,
      accuracy: session.totalQuestions > 0 
        ? (session.correctAnswers / session.totalQuestions) * 100 
        : 0,
      streak: session.streak || 0,
      mode,
      difficulty,
      continent,
      date: new Date(),
      duration: session.endTime 
        ? Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000)
        : 0,
    };

    StorageService.saveLeaderboardEntry(entry);
    setSaved(true);
    setShowNameInput(false);
  };

  const accuracy = session.totalQuestions > 0 
    ? Math.round((session.correctAnswers / session.totalQuestions) * 100)
    : 0;

  return (
    <div className="text-center">
      {/* Score Display */}
      <div className="mb-6">
        <div className="text-5xl font-bold text-gradient mb-2 animate-scaleIn">
          {session.score}
        </div>
        <div className="text-gray-600">{t('stats.finalScore')}</div>
        
        {isHighScore && !saved && (
          <div className="mt-2 text-yellow-600 font-semibold animate-pulse">
            🏆 New High Score! 🏆
          </div>
        )}
        
        {saved && (
          <div className="mt-2 text-green-600 font-semibold animate-fadeIn">
            ✓ Saved to Leaderboard!
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-semibold text-green-600">
            {session.correctAnswers}/{session.totalQuestions}
          </div>
          <div className="text-sm text-gray-600">{t('stats.correct')}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-semibold text-purple-600">
            {accuracy}%
          </div>
          <div className="text-sm text-gray-600">{t('stats.accuracy')}</div>
        </div>
        {session.streak && session.streak > 0 && (
          <div className="bg-orange-50 p-4 rounded-lg col-span-2">
            <div className="text-2xl font-semibold text-orange-600">
              🔥 {session.streak}
            </div>
            <div className="text-sm text-gray-600">{t('stats.streak')}</div>
          </div>
        )}
      </div>

      {/* Name Input for High Scores */}
      {showNameInput && (
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200 animate-slideInUp">
          <div className="mb-3 text-sm font-medium text-gray-700">
            Enter your name for the leaderboard:
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name"
              maxLength={20}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSaveScore()}
            />
            <Button
              onClick={handleSaveScore}
              disabled={!playerName.trim()}
              variant="primary"
            >
              Save
            </Button>
            <Button
              onClick={() => setShowNameInput(false)}
              variant="outline"
            >
              Skip
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          onClick={onPlayAgain}
          variant="primary"
          className="w-full"
        >
          {t('game.playAgain')}
        </Button>
      </div>
    </div>
  );
};