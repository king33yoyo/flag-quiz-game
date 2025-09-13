// React 19 自动 JSX 运行时无需显式导入 React
import { useState, useEffect } from 'react';
import { Button } from '../UI/Button';
import { useI18n } from '../../i18n';
import { soundService } from '../../services/soundService';

interface HeaderProps {
  onShowFlagLibrary?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onShowFlagLibrary,
}) => {
  const { language, setLanguage } = useI18n();
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setSoundEnabled(soundService.isEnabled());
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    soundService.setEnabled(newState);
  };

  return (
    <header className="relative z-20 h-24" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '0.5rem' }}>
      <div className="max-w-7xl mx-auto px-4 w-full flex justify-center">
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onShowFlagLibrary}
            className="px-3 py-1 text-sm flex items-center justify-center"
          >
            🚩
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSound}
            className="px-3 py-1 text-sm flex items-center justify-center"
          >
            <span>{soundEnabled ? '🔊' : '🔇'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="px-3 py-1 text-sm flex items-center justify-center"
          >
            <span>{language === 'en' ? '🇨🇳' : '🇺🇸'}</span>
          </Button>
        </div>
      </div>
    </header>
  );
};