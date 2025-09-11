// React 19 自动 JSX 运行时无需显式导入 React
import { useI18n } from '../../i18n';
import { Button } from '../UI/Button';

interface ScoreDisplayProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  streak?: number;
  onBack?: () => void;
  mode?: string;
  timeLeft?: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  correctAnswers,
  totalQuestions,
  streak = 0,
  onBack,
  mode,
  timeLeft,
}) => {
  const { t } = useI18n();
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="card mb-6 animate-fadeIn">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Back button - Desktop */}
        {onBack && (
          <div className="hidden md:block">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
            >
              {t('app.backToMenu')}
            </Button>
          </div>
        )}
        
        {/* Back button - Mobile (just arrow) */}
        {onBack && (
          <div className="md:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="px-2 py-1 text-lg"
            >
              ←
            </Button>
          </div>
        )}
        
        {/* Score and stats */}
        <div className="flex flex-wrap items-center gap-4 flex-1 justify-center">
          {/* Score - Hidden in timed mode, visible in other modes */}
          {mode !== 'timed' && (
            <div className="flex items-center space-x-1 md:space-x-2 animate-scaleIn" style={{ animationDelay: '0.1s' }}>
              <span className="text-sm md:text-lg text-gray-600 font-medium">{t('stats.score')}:</span>
              <span className="text-lg md:text-2xl font-bold text-blue-600">{score}</span>
            </div>
          )}
          
          {/* Correct */}
          <div className="flex items-center space-x-1 md:space-x-2 animate-scaleIn" style={{ animationDelay: '0.2s' }}>
            <span className="text-sm md:text-lg text-gray-600 font-medium">{t('stats.correct')}:</span>
            <span className="text-lg md:text-2xl font-bold text-green-600">{correctAnswers}/{totalQuestions}</span>
          </div>
          
          {/* Accuracy - Hidden on mobile and in timed mode */}
          {mode !== 'timed' && (
            <div className="hidden md:flex items-center space-x-2 animate-scaleIn" style={{ animationDelay: '0.3s' }}>
              <span className="text-lg text-gray-600 font-medium">{t('stats.accuracy')}:</span>
              <span className="text-2xl font-bold text-purple-600">{accuracy}%</span>
            </div>
          )}
          
          {/* Streak (only show if > 0) - Hidden on mobile and in timed mode */}
          {streak > 0 && mode !== 'timed' && (
            <div className="hidden md:flex items-center space-x-2 animate-scaleIn" style={{ animationDelay: '0.4s' }}>
              <span className="text-lg text-gray-600 font-medium">{t('stats.streak')}:</span>
              <span className={`text-2xl font-bold text-orange-600 ${streak >= 5 ? 'animate-pulse' : ''}`}>
                {streak}🔥
              </span>
            </div>
          )}
        </div>
        
        {/* Timer for timed mode */}
        {mode === 'timed' && timeLeft !== undefined && (
          <div className="flex items-center space-x-1 md:space-x-2 animate-scaleIn" style={{ animationDelay: '0.5s' }}>
            <span className="text-sm md:text-lg text-gray-600 font-medium">⏱️</span>
            <span className="text-lg md:text-2xl font-bold text-red-600">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>
    </div>
  );
};