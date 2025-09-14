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
  const [finalGameData, setFinalGameData] = useState<GameSession | null>(null); // 持久化最终游戏数据
  const { t } = useI18n();
  const isGameEndingRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const sessionRef = useRef<GameSession | null>(null);
  
  // Keep sessionRef in sync with session state - optimized to reduce logs
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);
  
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
      // 简化调试信息
      if (process.env.NODE_ENV === 'development') {
        console.log('GameBoard endGame called');
      }

      // 在调用 gameService.endGame() 之前，先保存最终数据
      const currentSessionData = sessionRef.current;

      // 首先尝试从 gameService 获取最终数据
      let finalSession: GameSession;
      if (gameService['session']) {
        finalSession = gameService.endGame();
      } else {
        // 如果 gameService 没有数据，使用保存的数据
        if (!currentSessionData) {
          throw new Error('No session data available');
        }

        // 创建一个模拟的 endGame 结果
        finalSession = {
          ...currentSessionData,
          endTime: new Date()
        };
      }

      // 确保数据不为零
      if (finalSession.totalQuestions === 0 && currentSessionData) {
        finalSession.totalQuestions = currentSessionData.totalQuestions;
        finalSession.correctAnswers = currentSessionData.correctAnswers;
        finalSession.score = currentSessionData.score;
      }

      // 为挑战成功添加特殊标记
      const enhancedSession = {
        ...finalSession,
        challengeSuccess: isChallengeSuccess,
        challengeProgress: isChallengeSuccess ? gameService.getChallengeProgress() : undefined,
      };

      // 简化最终调试信息
      if (process.env.NODE_ENV === 'development') {
        console.log('Final game data:', {
          totalQuestions: enhancedSession.totalQuestions,
          correctAnswers: enhancedSession.correctAnswers,
          accuracy: enhancedSession.totalQuestions > 0 ? Math.round((enhancedSession.correctAnswers / enhancedSession.totalQuestions) * 100) : 0
        });
      }

      // 保存最终游戏数据，确保弹窗始终显示正确的数据
      sessionRef.current = enhancedSession;
      setSession(enhancedSession);
      setFinalGameData(enhancedSession); // 持久化最终数据
      setGameOver(true);

      // 调用回调函数传递最终数据
      onGameEnd(enhancedSession);
      
      // 确保游戏结束后不再接受新的答案
      setSelectedAnswer(null);
      setShowResult(false);
    } catch (error) {
      console.error('Error ending game:', error);
      // Ensure game over state is set even if there's an error
      setGameOver(true);
    }

    // Play game over sound with error handling
    try {
      soundService.playGameOver();
    } catch (soundError) {
      console.warn('Failed to play game over sound:', soundError);
    }
  }, [gameService, gameOver, onGameEnd]);

  const loadNewQuestion = useCallback(() => {
    try {
      const question = gameService.generateQuestion();
      gameService.setCurrentQuestion(question);

      // Only update state if question actually changed
      if (!currentQuestion || currentQuestion.id !== question.id) {
        setCurrentQuestion(question);
        setSelectedAnswer(null);
        setShowResult(false);
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'CHALLENGE_COMPLETED') {
        // 挑战成功完成
        setChallengeCompleted(true);
        endGame(true);
      } else {
        console.error('Error loading question:', error);
        // 不要立即结束游戏，而是显示错误信息并尝试恢复
        if (sessionRef.current && sessionRef.current.totalQuestions === 0) {
          // 如果还没有答题，可能是初始化问题，尝试重新开始
          setTimeout(() => {
            try {
              const question = gameService.generateQuestion();
              gameService.setCurrentQuestion(question);
              setCurrentQuestion(question);
              setSelectedAnswer(null);
              setShowResult(false);
            } catch (retryError) {
              console.error('Retry failed:', retryError);
              endGame();
            }
          }, 1000);
        } else {
          // 如果已经有答题记录，正常结束游戏
          endGame();
        }
      }
    }
  }, [gameService, endGame, currentQuestion]);
  
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
      console.error('Error loading first question:', error);

      if (error instanceof Error && error.message === 'CHALLENGE_COMPLETED') {
        setChallengeCompleted(true);
        endGame(true);
      } else {
        console.error('Error loading first question:', error);

        // 不要将数据重置为零，保持原始数据
        // 延迟结束游戏，让用户看到错误信息
        setTimeout(() => {
          endGame();
        }, 2000);
      }
    }

    // Set timer for timed mode
    if (mode === 'timed') {
      setTimeLeft(60);
    }
  }, [mode, difficulty, continent, gameService, endGame]);
  
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
    if (!currentQuestion || selectedAnswer || gameOver) return;
    
    setSelectedAnswer(answerId);
    setShowResult(true);
    
    const result = gameService.submitAnswer(currentQuestion.id, answerId);

    // Only update session if the data actually changed and game is not over
    if (!gameOver && (sessionRef.current?.totalQuestions !== result.session.totalQuestions ||
        sessionRef.current?.correctAnswers !== result.session.correctAnswers)) {
      setSession(result.session);
      sessionRef.current = result.session;
    }

    // 简化调试信息，只在关键时输出
    if (process.env.NODE_ENV === 'development' && result.isCorrect) {
      console.log('Correct answer recorded');
    }
    
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
      // 检查游戏是否已经结束
      if (gameOver || isGameEndingRef.current) {
        return;
      }
      
      const currentSession = sessionRef.current;
      // Only end after 10 questions for non-timed and non-challenge modes
      if (mode !== 'timed' && mode !== 'challenge' && currentSession?.totalQuestions && currentSession.totalQuestions >= 10) {
        // 调试信息
        if (process.env.NODE_ENV === 'development') {
          console.log('GameBoard 游戏结束条件满足:', {
            mode,
            totalQuestions: currentSession.totalQuestions,
            correctAnswers: currentSession.correctAnswers,
            accuracy: currentSession.totalQuestions > 0 ? Math.round((currentSession.correctAnswers / currentSession.totalQuestions) * 100) : 0
          });
        }
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
    // 先关闭游戏结束弹窗并清理所有游戏结束状态
    setGameOver(false);
    setChallengeCompleted(false);
    isGameEndingRef.current = false;
    setFinalGameData(null); // 清理最终游戏数据
    setSelectedAnswer(null);
    setShowResult(false);

    // Clean up timer
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Reset time for timed mode
    if (mode === 'timed') {
      setTimeLeft(60);
    }

    // 延迟重新开始游戏，确保弹窗完全关闭且状态清理完成
    setTimeout(() => {
      // 确保所有状态都已清理
      if (gameOver) {
        console.warn('Game over state not properly cleared');
        return;
      }

      // Start new game
      const newSession = gameService.startGame(mode, difficulty, continent);
      setSession(newSession);
      sessionRef.current = newSession;

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
    }, 500); // 增加延迟时间，确保弹窗完全关闭
  };

  if (!session || !currentQuestion) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-white">Loading game...</div>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4 game-board mobile-game-container">
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
          key={`country-select-${currentQuestion.id}`}
          question={currentQuestion}
          onAnswer={handleAnswer}
          showResult={showResult}
          selectedAnswer={selectedAnswer || undefined}
          disabled={showResult}
        />
      ) : (
        <QuestionCard
          key={`question-${currentQuestion.id}`}
          question={currentQuestion}
          onAnswer={handleAnswer}
          showResult={showResult}
          selectedAnswer={selectedAnswer || undefined}
          disabled={showResult}
        />
      ))}
      
      {/* Game controls */}
      <div className="mt-4 text-center">
        <Button
          variant="secondary"
          onClick={endGame}
        >
          {t('game.endGame')}
        </Button>
      </div>
      
      {/* Game Over Modal */}
      <Modal
        key={`game-over-${finalGameData?.id || session?.id || 'new'}`}
        isOpen={gameOver}
        onClose={() => setGameOver(false)}
        size="md"
      >
        <GameOverContent
          session={finalGameData || session} // 优先使用持久化的最终数据
          continent={continent}
          onBackToMenu={onBackToMenu || (() => {})}
          onRestartGame={() => handleRestartGame()}
          challengeSuccess={challengeCompleted}
        />
      </Modal>
    </div>
  );
};