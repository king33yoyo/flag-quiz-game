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
  
  const gameModes: { id: GameSession['mode']; labelKey: string; descriptionKey: string }[] = [
    { id: 'flag-identify', labelKey: 'gameModes.flagIdentify.title', descriptionKey: 'gameModes.flagIdentify.description' },
    { id: 'country-select', labelKey: 'gameModes.countrySelect.title', descriptionKey: 'gameModes.countrySelect.description' },
    { id: 'timed', labelKey: 'gameModes.timed.title', descriptionKey: 'gameModes.timed.description' },
    { id: 'challenge', labelKey: 'gameModes.challenge.title', descriptionKey: 'gameModes.challenge.description' },
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {gameModes.map((mode) => (
          <div
            key={mode.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-gray-900 mb-1">{t(mode.labelKey as keyof typeof import('../../i18n/translations').translations)}</h3>
            <p className="text-sm text-gray-600 mb-3">{t(mode.descriptionKey as keyof typeof import('../../i18n/translations').translations)}</p>
            <Button
              variant="primary"
              onClick={() => onStartGame(mode.id, 'expert', selectedContinent)}
              className="w-full"
            >
              {t('game.start')}
            </Button>
          </div>
        ))}
      </div>
    </nav>
  );
};