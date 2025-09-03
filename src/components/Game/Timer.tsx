import { useState, useEffect } from 'react';
import { useI18n } from '../../i18n';
import { soundService } from '../../services/soundService';

interface TimerProps {
  initialTime: number; // in seconds
  onTimeUp?: () => void;
  isActive?: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  initialTime,
  onTimeUp,
  isActive = true,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const { t } = useI18n();
  
  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp?.();
          return 0;
        }
        
        // Play countdown sound for last 5 seconds
        if (prev <= 5) {
          soundService.playCountdown();
        }
        
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive, onTimeUp]);
  
  // Reset timer when initialTime changes
  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const getTimerColor = () => {
    const percentage = (timeLeft / initialTime) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <div className="card text-center">
      <div className={`text-3xl font-bold ${getTimerColor()}`}>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>
      <div className="text-sm text-gray-600 mt-1">{t('game.timeRemaining')}</div>
    </div>
  );
};