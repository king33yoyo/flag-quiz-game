import type { Country } from '../../types';
import { FlagCard } from '../UI/FlagCard';

interface FlagGridProps {
  countries: Country[];
  onCountryClick: (country: Country) => void;
  showCountryNames: boolean;
  language: 'en' | 'zh';
}

export const FlagGrid: React.FC<FlagGridProps> = ({
  countries,
  onCountryClick,
  showCountryNames,
  language,
}) => {
  // 响应式网格列数
  const getGridCols = () => {
    if (countries.length <= 12) return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6';
    if (countries.length <= 50) return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8';
    return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10';
  };

  const getCountryName = (country: Country) => {
    if (language === 'zh' && country.nameZh) {
      return country.nameZh;
    }
    return country.name;
  };

  return (
    <div className={`grid ${getGridCols()} gap-4`}>
      {countries.map((country) => (
        <div
          key={country.id}
          className="flex flex-col items-center group"
        >
          <FlagCard
            country={country}
            onClick={() => onCountryClick(country)}
            showName={showCountryNames}
            size="md"
            language={language}
          />
          {showCountryNames && (
            <div className="mt-2 text-sm text-gray-600 text-center max-w-full">
              <div className="font-medium truncate w-full" title={getCountryName(country)}>
                {getCountryName(country)}
              </div>
              <div className="text-xs text-gray-400 truncate w-full" title={country.capital}>
                {country.capital}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};