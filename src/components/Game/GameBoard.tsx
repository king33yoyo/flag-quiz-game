import { useState, useEffect, useCallback, useRef } from 'react';
import { GameService } from '../../services/gameService';
import { soundService } from '../../services/soundService';
import type { GameQuestion, GameSession, RegionFilter } from '../../types';
import { QuestionCard } from './QuestionCard';
import { CountrySelectCard } from './CountrySelectCard';
import { ScoreDisplay } from './ScoreDisplay';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { GameOverContent } from './GameOverContent';
import { useI18n } from '../../i18n';

interface GameBoardProps {
  mode: GameSession['mode'];
  difficulty: GameSession['difficulty'];
  continent: RegionFilter;
  onGameEnd: (session: GameSession) => void;
  onBackToMenu?: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  mode,
  difficulty,
  continent,
  onGameEnd,
  onBackToMenu,
}) => {
  const [gameService] = useState(() => GameService.getInstance());
  const [session, setSession] = useState<GameSession | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<GameQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds for timed mode
  const { t } = useI18n();
  const isGameEndingRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  
  const endGame = useCallback((isChallengeSuccess = false) => {
    // Prevent multiple calls to endGame
    if (isGameEndingRef.current || gameOver) {
      return;
    }
    
    isGameEndingRef.current = true;
    
    // Clean up timer
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    try {
      // Check if game session still exists
      if (gameService['session']) {
        const finalSession = gameService.endGame();
        // 为挑战成功添加特殊标记
        const enhancedSession = {
          ...finalSession,
          challengeSuccess: isChallengeSuccess,
          challengeProgress: isChallengeSuccess ? gameService.getChallengeProgress() : undefined,
        };
        setSession(enhancedSession);
        setGameOver(true);
        onGameEnd(enhancedSession);
      } else {
        // Fallback: create a session from current state
        const fallbackSession: GameSession = {
          id: `session-${Date.now()}`,
          userId: 'demo-user',
          mode,
          difficulty,
          score: session?.score || 0,
          correctAnswers: session?.correctAnswers || 0,
          totalQuestions: session?.totalQuestions || 0,
          startTime: session?.startTime || new Date(),
          endTime: new Date(),
          streak: session?.streak || 0,
          challengeSuccess: isChallengeSuccess,
          challengeProgress: isChallengeSuccess ? gameService.getChallengeProgress() : undefined,
        };
        setSession(fallbackSession);
        setGameOver(true);
        onGameEnd(fallbackSession);
      }
      
      // Play game over sound with error handling
      try {
        soundService.playGameOver();
      } catch (soundError) {
        console.warn('Failed to play game over sound:', soundError);
      }
    } catch (error) {
      console.error('Error ending game:', error);
      // Ensure game over state is set even if there's an error
      setGameOver(true);
    }
  }, [gameService, gameOver, session, mode, difficulty, onGameEnd]);

  const loadNewQuestion = useCallback(() => {
    try {
      const question = gameService.generateQuestion();
      gameService.setCurrentQuestion(question);
      setCurrentQuestion(question);
      setSelectedAnswer(null);
      setShowResult(false);
    } catch (error) {
      if (error instanceof Error && error.message === 'CHALLENGE_COMPLETED') {
        // 挑战成功完成
        setChallengeCompleted(true);
        endGame(true);
      } else {
        console.error('Error loading question:', error);
        endGame();
      }
    }
  }, [gameService, endGame]);
  
  useEffect(() => {
    // Start new game
    const newSession = gameService.startGame(mode, difficulty, continent);
    setSession(newSession);
    
    // Load first question
    try {
      const question = gameService.generateQuestion();
      gameService.setCurrentQuestion(question);
      setCurrentQuestion(question);
      setSelectedAnswer(null);
      setShowResult(false);
    } catch (error) {
      if (error instanceof Error && error.message === 'CHALLENGE_COMPLETED') {
        setChallengeCompleted(true);
        endGame(true);
      } else {
        console.error('Error loading question:', error);
        endGame();
      }
    }
    
    // Set timer for timed mode
    if (mode === 'timed') {
      setTimeLeft(60);
    }
  }, [mode, difficulty, continent, gameService]);
  
  // Countdown timer effect for timed mode
  useEffect(() => {
    if (mode === 'timed' && !gameOver) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            window.clearInterval(timerRef.current!);
            return 0;
          }
          
          // Play countdown sound for last 5 seconds
          if (prev <= 5) {
            soundService.playCountdown();
          }
          
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [mode, gameOver]);
  
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
  
  // Effect to handle timer expiration
  useEffect(() => {
    if (mode === 'timed' && timeLeft === 0 && !gameOver) {
      endGame();
    }
  }, [mode, timeLeft, gameOver, endGame]);
  
  const handleRestartGame = () => {
    setGameOver(false);
    setChallengeCompleted(false);
    isGameEndingRef.current = false;
    
    // Clean up timer
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Reset time for timed mode
    if (mode === 'timed') {
      setTimeLeft(60);
    }
    
    // Start new game
    const newSession = gameService.startGame(mode, difficulty, continent);
    setSession(newSession);
    
    // Load first question
    try {
      const question = gameService.generateQuestion();
      gameService.setCurrentQuestion(question);
      setCurrentQuestion(question);
      setSelectedAnswer(null);
      setShowResult(false);
    } catch (error) {
      if (error instanceof Error && error.message === 'CHALLENGE_COMPLETED') {
        setChallengeCompleted(true);
        endGame(true);
      } else {
        console.error('Error loading question:', error);
        endGame();
      }
    }
  };

  if (!session || !currentQuestion) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-white">Loading game...</div>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 game-board mobile-game-container">
      {/* Game header - 文字内容已删除 */}
      
      {/* Game stats */}
      <ScoreDisplay
        score={session.score}
        correctAnswers={session.correctAnswers}
        totalQuestions={session.totalQuestions}
        streak={session.streak}
        onBack={onBackToMenu}
        mode={mode}
        timeLeft={timeLeft}
      />
      
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
        size="md"
      >
        <GameOverContent 
          session={session}
          continent={continent}
          onBackToMenu={onBackToMenu || (() => {})}
          onRestartGame={() => handleRestartGame()}
          challengeSuccess={challengeCompleted}
        />
      </Modal>
    </div>
  );
};