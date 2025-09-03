import { useState, useEffect } from 'react';
import { GameService } from '../../services/gameService';
import { soundService } from '../../services/soundService';
import type { GameQuestion, GameSession, RegionFilter } from '../../types';
import { QuestionCard } from './QuestionCard';
import { CountrySelectCard } from './CountrySelectCard';
import { ScoreDisplay } from './ScoreDisplay';
import { Timer } from './Timer';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { useI18n } from '../../i18n';

interface GameBoardProps {
  mode: GameSession['mode'];
  difficulty: GameSession['difficulty'];
  continent: RegionFilter;
  onGameEnd: (session: GameSession) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  mode,
  difficulty,
  continent,
  onGameEnd,
}) => {
  const [gameService] = useState(() => GameService.getInstance());
  const [session, setSession] = useState<GameSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds for timed mode
  const { t } = useI18n();
  
  useEffect(() => {
    // Start new game
    const newSession = gameService.startGame(mode, difficulty, continent);
    setSession(newSession);
    loadNewQuestion();
    
    // Set timer for timed mode
    if (mode === 'timed') {
      setTimeLeft(60);
    }
  }, [mode, difficulty, continent, gameService]);
  
  const loadNewQuestion = () => {
    const question = gameService.generateQuestion();
    gameService.setCurrentQuestion(question);
    setCurrentQuestion(question);
    setSelectedAnswer(null);
    setShowResult(false);
  };
  
  const handleAnswer = (answerId: string) => {
    if (!currentQuestion || selectedAnswer) return;
    
    setSelectedAnswer(answerId);
    setShowResult(true);
    
    const result = gameService.submitAnswer(currentQuestion.id, answerId);
    setSession({ ...result.session });
    
    // Play sound effect
    if (result.isCorrect) {
      soundService.playCorrect();
    } else {
      soundService.playWrong();
    }
    
    // Check if game should end (challenge mode)
    if (mode === 'challenge' && !result.isCorrect) {
      setTimeout(() => {
        endGame();
      }, 2000);
      return;
    }
    
    // Load next question after delay
    setTimeout(() => {
      // Only end after 10 questions for non-timed and non-challenge modes
      if (mode !== 'timed' && mode !== 'challenge' && session?.totalQuestions && session.totalQuestions >= 9) {
        endGame();
      } else {
        loadNewQuestion();
      }
    }, 2000);
  };
  
  const handleTimeUp = () => {
    if (mode === 'timed') {
      endGame();
    }
  };
  
  const endGame = () => {
    const finalSession = gameService.endGame();
    setSession(finalSession);
    setGameOver(true);
    soundService.playGameOver();
    onGameEnd(finalSession);
  };
  
  if (!session || !currentQuestion) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl">Loading game...</div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Game header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {t('app.title')}
        </h1>
        <div className="text-center text-gray-600">
          {t(`gameModes.${mode.replace('-', '')}.title`)} | {t(`difficulty.${difficulty}`)}
        </div>
      </div>
      
      {/* Game stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <ScoreDisplay
          score={session.score}
          correctAnswers={session.correctAnswers}
          totalQuestions={session.totalQuestions}
          streak={session.streak}
        />
        {mode === 'timed' && (
          <Timer
            initialTime={timeLeft}
            onTimeUp={handleTimeUp}
            isActive={!gameOver}
          />
        )}
      </div>
      
      {/* Question */}
      {!gameOver && (mode === 'country-select' ? (
        <CountrySelectCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          showResult={showResult}
          selectedAnswer={selectedAnswer || undefined}
          disabled={showResult}
        />
      ) : (
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          showResult={showResult}
          selectedAnswer={selectedAnswer || undefined}
          disabled={showResult}
        />
      ))}
      
      {/* Game controls */}
      <div className="mt-6 text-center">
        <Button
          variant="secondary"
          onClick={endGame}
        >
          {t('game.endGame')}
        </Button>
      </div>
      
      {/* Game Over Modal */}
      <Modal
        isOpen={gameOver}
        onClose={() => setGameOver(false)}
        title={t('gameOver.title')}
        size="md"
      >
        <div className="text-center">
          <div className="mb-4">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {session.score}
            </div>
            <div className="text-gray-600">{t('stats.finalScore')}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-2xl font-semibold text-green-600">
                {session.correctAnswers}/{session.totalQuestions}
              </div>
              <div className="text-sm text-gray-600">{t('stats.correct')}</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-purple-600">
                {session.totalQuestions > 0 
                  ? Math.round((session.correctAnswers / session.totalQuestions) * 100)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600">{t('stats.accuracy')}</div>
            </div>
          </div>
          
          <Button
            onClick={() => window.location.reload()}
            variant="primary"
          >
            {t('game.playAgain')}
          </Button>
        </div>
      </Modal>
    </div>
  );
};