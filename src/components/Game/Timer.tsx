import { useState, useEffect, useRef } from 'react';
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
  const onTimeUpRef = useRef(onTimeUp);
  const hasTriggeredRef = useRef(false);
  
  // Update ref when onTimeUp changes
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);
  
  useEffect(() => {
    if (!isActive) {
      hasTriggeredRef.current = false;
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
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
  }, [isActive]);
  
  // Effect to trigger onTimeUp when time reaches 0
  useEffect(() => {
    if (timeLeft === 0 && !hasTriggeredRef.current && isActive) {
      hasTriggeredRef.current = true;
      // Use setTimeout to ensure this happens after render
      setTimeout(() => {
        onTimeUpRef.current?.();
      }, 0);
    }
  }, [timeLeft, isActive]);
  
  // Reset timer when initialTime changes
  useEffect(() => {
    setTimeLeft(initialTime);
    hasTriggeredRef.current = false;
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