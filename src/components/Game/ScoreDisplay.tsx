// React 19 自动 JSX 运行时无需显式导入 React
import { useI18n } from '../../i18n';

interface ScoreDisplayProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  streak?: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  correctAnswers,
  totalQuestions,
  streak = 0,
}) => {
  const { t } = useI18n();
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  return (
    <div className="card mb-6 animate-fadeIn">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="animate-scaleIn" style={{ animationDelay: '0.1s' }}>
          <div className="text-3xl font-bold text-blue-600 animate-pulse">{score}</div>
          <div className="text-sm text-gray-600 mt-1">{t('stats.score')}</div>
        </div>
        <div className="animate-scaleIn" style={{ animationDelay: '0.2s' }}>
          <div className="text-3xl font-bold text-green-600">{correctAnswers}/{totalQuestions}</div>
          <div className="text-sm text-gray-600 mt-1">{t('stats.correct')}</div>
        </div>
        <div className="animate-scaleIn" style={{ animationDelay: '0.3s' }}>
          <div className="text-3xl font-bold text-purple-600">{accuracy}%</div>
          <div className="text-sm text-gray-600 mt-1">{t('stats.accuracy')}</div>
        </div>
        {streak > 0 && (
          <div className="animate-scaleIn" style={{ animationDelay: '0.4s' }}>
            <div className={`text-3xl font-bold text-orange-600 ${streak >= 5 ? 'animate-pulse' : ''}`}>
              {streak}🔥
            </div>
            <div className="text-sm text-gray-600 mt-1">{t('stats.streak')}</div>
          </div>
        )}
      </div>
    </div>
  );
};