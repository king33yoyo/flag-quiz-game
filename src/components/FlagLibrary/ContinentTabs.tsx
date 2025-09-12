import { Button } from '../UI/Button';
import type { RegionFilter } from '../../types';
import { getContinents } from '../../data/countries';
import { useI18n } from '../../i18n';

interface ContinentTabsProps {
  selectedContinent: RegionFilter;
  onSelectContinent: (continent: RegionFilter) => void;
}

export const ContinentTabs: React.FC<ContinentTabsProps> = ({
  selectedContinent,
  onSelectContinent,
}) => {
  const { t } = useI18n();
  const continents = ['World', ...getContinents()] as RegionFilter[];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {continents.map((continent) => (
        <Button
          key={continent}
          variant={selectedContinent === continent ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => onSelectContinent(continent)}
          className="px-4 py-2 text-sm"
        >
          {t(`continent.${continent.toLowerCase()}`)}
        </Button>
      ))}
    </div>
  );
};