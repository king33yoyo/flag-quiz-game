// React 19 自动 JSX 运行时无需显式导入 React
import { useState, useEffect } from 'react';
import { Button } from '../UI/Button';
import { useI18n } from '../../i18n';
import { soundService } from '../../services/soundService';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
}) => {
  const { language, setLanguage, t } = useI18n();
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
    <header>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold text-gray-900">
            {title || t('app.title')}
          </h1>
          <div className="flex items-center space-x-4">
            <Button variant="secondary" size="sm">
              {t('header.leaderboard')}
            </Button>
            <Button variant="secondary" size="sm">
              {t('header.profile')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSound}
              className="flex items-center space-x-1"
            >
              <span>{soundEnabled ? '🔊' : '🔇'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center space-x-1"
            >
              <span>{language === 'en' ? '🇨🇳 中文' : '🇺🇸 EN'}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};