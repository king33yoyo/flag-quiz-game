import { useState, useEffect } from 'react';
import type { GameSession, RegionFilter } from '../../types';
import { Button } from '../UI/Button';
import { useI18n } from '../../i18n';
import { getContinents } from '../../data/countries';

interface NavigationProps {
  onStartGame: (mode: GameSession['mode'], difficulty: GameSession['difficulty'], continent: RegionFilter) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onStartGame,
}) => {
  const { t } = useI18n();
  const [selectedContinent, setSelectedContinent] = useState<RegionFilter>('World');

  // Load last selected continent from localStorage
  useEffect(() => {
    try {
      const savedContinent = localStorage.getItem('lastSelectedContinent');
      if (savedContinent && ['World', ...getContinents()].includes(savedContinent)) {
        setSelectedContinent(savedContinent as RegionFilter);
      }
    } catch (error) {
      console.error('Error loading saved continent:', error);
    }
  }, []);

  // Save selected continent to localStorage when it changes
  const handleContinentChange = (continent: RegionFilter) => {
    setSelectedContinent(continent);
    try {
      localStorage.setItem('lastSelectedContinent', continent);
    } catch (error) {
      console.error('Error saving continent:', error);
    }
  };
  
  const gameModes: { id: GameSession['mode']; labelKey: string; icon: string }[] = [
    { id: 'flag-identify', labelKey: 'gameModes.flagIdentify.title', icon: '🚩' },
    { id: 'country-select', labelKey: 'gameModes.countrySelect.title', icon: '🌎' },
    { id: 'timed', labelKey: 'gameModes.timed.title', icon: '⏱️' },
    { id: 'challenge', labelKey: 'gameModes.challenge.title', icon: '🏆' },
  ];
  
  // Removed difficulty selection - now uses all countries
  
  return (
    <nav className="card p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('game.start')}</h2>
      
      {/* Continent Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">{t('continent.select')}</h3>
        <div className="hidden md:flex flex-wrap gap-1 justify-center">
          {['World', ...getContinents()].map((continent) => (
            <Button
              key={continent}
              variant={selectedContinent === continent ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleContinentChange(continent as RegionFilter)}
            >
              {t(`continent.${continent.toLowerCase()}`)}
            </Button>
          ))}
        </div>
        
        {/* Mobile vertical layout */}
        <div className="flex md:hidden gap-2 justify-center overflow-x-auto py-2">
          {['World', ...getContinents()].map((continent) => (
            <Button
              key={continent}
              variant={selectedContinent === continent ? 'primary' : 'secondary'}
              size="sm"
              mobileVertical={true}
              onClick={() => handleContinentChange(continent as RegionFilter)}
            >
              {t(`continent.${continent.toLowerCase()}`)}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {gameModes.map((mode) => (
          <Button
            key={mode.id}
            variant="game-mode"
            size="game-mode"
            icon={mode.icon}
            onClick={() => onStartGame(mode.id, 'expert', selectedContinent)}
            className="flex flex-col items-center justify-center"
          >
            {t(mode.labelKey as keyof typeof import('../../i18n/translations').translations)}
          </Button>
        ))}
      </div>
    </nav>
  );
};