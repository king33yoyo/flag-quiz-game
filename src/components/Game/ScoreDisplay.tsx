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
    <div className="card mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-blue-600">{score}</div>
          <div className="text-sm text-gray-600">{t('stats.score')}</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">{correctAnswers}/{totalQuestions}</div>
          <div className="text-sm text-gray-600">{t('stats.correct')}</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-600">{accuracy}%</div>
          <div className="text-sm text-gray-600">{t('stats.accuracy')}</div>
        </div>
        {streak > 0 && (
          <div>
            <div className="text-2xl font-bold text-orange-600">{streak}🔥</div>
            <div className="text-sm text-gray-600">{t('stats.streak')}</div>
          </div>
        )}
      </div>
    </div>
  );
};