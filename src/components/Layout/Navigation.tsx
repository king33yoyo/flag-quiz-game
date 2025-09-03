import type { GameSession } from '../../types';
import { Button } from '../UI/Button';
import { useI18n } from '../../i18n';

interface NavigationProps {
  onStartGame: (mode: GameSession['mode'], difficulty: GameSession['difficulty']) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  onStartGame,
}) => {
  const { t } = useI18n();
  
  const gameModes: { id: GameSession['mode']; labelKey: string; descriptionKey: string }[] = [
    { id: 'flag-identify', labelKey: 'gameModes.flagIdentify.title', descriptionKey: 'gameModes.flagIdentify.description' },
    { id: 'country-select', labelKey: 'gameModes.countrySelect.title', descriptionKey: 'gameModes.countrySelect.description' },
    { id: 'timed', labelKey: 'gameModes.timed.title', descriptionKey: 'gameModes.timed.description' },
    { id: 'challenge', labelKey: 'gameModes.challenge.title', descriptionKey: 'gameModes.challenge.description' },
  ];
  
  const difficulties: { id: GameSession['difficulty']; labelKey: string; color: string }[] = [
    { id: 'easy', labelKey: 'difficulty.easy', color: 'bg-green-500' },
    { id: 'medium', labelKey: 'difficulty.medium', color: 'bg-yellow-500' },
    { id: 'hard', labelKey: 'difficulty.hard', color: 'bg-orange-500' },
    { id: 'expert', labelKey: 'difficulty.expert', color: 'bg-red-500' },
  ];
  
  return (
    <nav className="card p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('game.start')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {gameModes.map((mode) => (
          <div
            key={mode.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium text-gray-900 mb-1">{t(mode.labelKey as any)}</h3>
            <p className="text-sm text-gray-600 mb-3">{t(mode.descriptionKey as any)}</p>
            <div className="space-y-2">
              {difficulties.map((diff) => (
                <Button
                  key={`${mode.id}-${diff.id}`}
                  variant="secondary"
                  size="sm"
                  onClick={() => onStartGame(mode.id, diff.id)}
                  className="w-full justify-start"
                >
                  <span className={`w-3 h-3 rounded-full ${diff.color} mr-2`}></span>
                  {t(diff.labelKey as any)}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
};