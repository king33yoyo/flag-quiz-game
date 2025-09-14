import { Button } from '../UI/Button';
import type { GameSession, RegionFilter } from '../../types';
import { useI18n } from '../../i18n';

interface GameOverContentProps {
  session: GameSession;
  continent: RegionFilter;
  onBackToMenu: () => void;
  onRestartGame: () => void;
  challengeSuccess?: boolean;
}

export const GameOverContent: React.FC<GameOverContentProps> = ({
  session,
  continent,
  onBackToMenu,
  onRestartGame,
  challengeSuccess = false,
}) => {
  const { t, tWithParams } = useI18n();

  // 数据验证 - 确保数据有效性
  const validatedSession = {
    ...session,
    correctAnswers: Math.max(session.correctAnswers || 0, 0),
    totalQuestions: Math.max(session.totalQuestions || 0, 0),
    score: Math.max(session.score || 0, 0)
  };

  // 如果数据被重置为零（重新开始游戏导致），显示0而不是错误的保护值
  const accuracy = validatedSession.totalQuestions > 0
    ? Math.round((validatedSession.correctAnswers / validatedSession.totalQuestions) * 100)
    : 0;

  // 调试信息 - 详细的组件生命周期跟踪
  if (process.env.NODE_ENV === 'development') {
    console.log('GameOverContent 组件渲染 - 详细数据:', {
      mode: session.mode,
      sessionId: session.id,
      originalData: {
        correctAnswers: session.correctAnswers,
        totalQuestions: session.totalQuestions,
        score: session.score,
        startTime: session.startTime,
        endTime: session.endTime
      },
      validatedData: {
        correctAnswers: validatedSession.correctAnswers,
        totalQuestions: validatedSession.totalQuestions
      },
      accuracy: accuracy,
      calculation: `${validatedSession.correctAnswers} / ${validatedSession.totalQuestions} * 100 = ${accuracy}%`,
      honoraryTitle: accuracy === 100 ? 'master' : accuracy >= 90 ? 'expert' : 'other'
    });
  }

  // 荣誉称号系统基于准确率
  const getHonoraryTitle = (accuracy: number) => {
    if (accuracy === 100) return { title: t('honoraryTitles.master'), emoji: '🏆', color: 'gold' };
    if (accuracy >= 90) return { title: t('honoraryTitles.expert'), emoji: '🥇', color: 'silver' };
    if (accuracy >= 80) return { title: t('honoraryTitles.advanced'), emoji: '🥈', color: 'bronze' };
    if (accuracy >= 70) return { title: t('honoraryTitles.skilled'), emoji: '🥉', color: 'blue' };
    if (accuracy >= 60) return { title: t('honoraryTitles.progressing'), emoji: '📚', color: 'blue' };
    if (accuracy >= 50) return { title: t('honoraryTitles.improving'), emoji: '💪', color: 'blue' };
    return { title: t('honoraryTitles.beginner'), emoji: '🌱', color: 'blue' };
  };

  // 获取鼓励语基于准确率
  const getEncouragement = (accuracy: number) => {
    if (accuracy === 100) return t('encouragement.perfect');
    if (accuracy >= 90) return t('encouragement.excellent');
    if (accuracy >= 80) return t('encouragement.great');
    if (accuracy >= 70) return t('encouragement.good');
    if (accuracy >= 60) return t('encouragement.keepGoing');
    if (accuracy >= 50) return t('encouragement.practice');
    return t('encouragement.startLearning');
  };

  const honoraryTitle = getHonoraryTitle(accuracy);
  const encouragement = getEncouragement(accuracy);

  // 调试信息
  if (process.env.NODE_ENV === 'development') {
    console.log('GameOverContent 荣誉称号:', {
      accuracy,
      honoraryTitle,
      encouragement
    });
  }

  // 获取主题色
  const getThemeColor = (color: string) => {
    switch (color) {
      case 'gold': return '#FFD700';
      case 'silver': return '#C0C0C0';
      case 'bronze': return '#CD7F32';
      default: return '#3B82F6';
    }
  };

  return (
    <div className="text-center min-h-[400px] flex flex-col justify-center animate-modalScaleIn">
      {/* Challenge Success Display */}
      {challengeSuccess && (
        <div className="mb-6 animate-challengeSuccess">
          <div className="text-4xl font-bold text-green-600 mb-2 animate-scaleIn">
            {t('gameOver.challengeSuccess')}
          </div>
          <div className="text-lg text-gray-700 mb-4">
            {tWithParams('gameOver.challengeSuccessDesc', { 
              region: t(`continent.${continent.toLowerCase()}`) 
            })}
          </div>
          {session.challengeProgress && (
            <div className="text-lg font-semibold text-blue-600 mb-2">
              {tWithParams('gameOver.countriesCompleted', { 
                completed: session.challengeProgress.usedCountries.toString(),
                total: session.challengeProgress.totalCountries.toString() 
              })}
            </div>
          )}
          <div className="text-2xl font-bold text-yellow-600 mb-2">
            {t('gameOver.perfectScore')}
          </div>
        </div>
      )}

      {/* Regular Game Over Display */}
      {!challengeSuccess && (
        <div className="mb-8">
          <div className="text-6xl mb-4 animate-emojiBounce">
            {honoraryTitle.emoji}
          </div>
          <div className="text-4xl font-bold mb-6 animate-titlePulse" style={{ color: getThemeColor(honoraryTitle.color) }}>
            {honoraryTitle.title}
          </div>
          <div className="text-lg text-gray-700 font-medium animate-scaleIn">
            {encouragement}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={onBackToMenu}
          variant="outline"
          className="w-full game-over-button"
        >
          {t('game.backToMenu')}
        </Button>
        <Button
          onClick={onRestartGame}
          variant="primary"
          className="w-full game-over-button"
        >
          {t('game.restart')}
        </Button>
      </div>
    </div>
  );
};