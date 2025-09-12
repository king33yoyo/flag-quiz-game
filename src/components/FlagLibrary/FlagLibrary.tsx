import { useState, useMemo } from 'react';
import { Button } from '../UI/Button';
import { SearchBar } from './SearchBar';
import { ContinentTabs } from './ContinentTabs';
import { FlagGrid } from './FlagGrid';
import { CountryDetail } from './CountryDetail';
import type { Country, RegionFilter } from '../../types';
import { countries, getContinents, getCountriesByContinent } from '../../data/countries';
import { useI18n } from '../../i18n';

interface FlagLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlagLibrary: React.FC<FlagLibraryProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, tWithParams, language } = useI18n();
  const [selectedContinent, setSelectedContinent] = useState<RegionFilter>('World');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // 获取当前选择的国家列表
  const filteredCountries = useMemo(() => {
    let baseCountries: Country[] = [];
    
    if (selectedContinent === 'World') {
      baseCountries = countries; // 使用所有国家，而不是随机选择
    } else {
      baseCountries = getCountriesByContinent(selectedContinent);
    }
    
    // 搜索过滤
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return baseCountries.filter(country => 
        country.name.toLowerCase().includes(term) ||
        (country.nameZh && country.nameZh.toLowerCase().includes(term)) ||
        country.capital.toLowerCase().includes(term)
      );
    }
    
    return baseCountries;
  }, [selectedContinent, searchTerm]);

  // 计算学习统计
  const learningStats = useMemo(() => {
    return {
      total: filteredCountries.length,
      displayed: filteredCountries.length,
      continents: getContinents().length,
    };
  }, [filteredCountries]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-6xl max-h-[90vh] overflow-hidden">
        {/* 标题栏 */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            🚩 {t('flagLibrary.title')}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="px-3 py-1"
          >
            ✕
          </Button>
        </div>

        {/* 控制区域 */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 搜索栏 */}
            <div className="flex-1">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder={t('flagLibrary.searchPlaceholder')}
              />
            </div>
          </div>
        </div>

        {/* 大洲标签页 */}
        <div className="p-4 border-b">
          <ContinentTabs
            selectedContinent={selectedContinent}
            onSelectContinent={setSelectedContinent}
          />
        </div>

        {/* 统计信息 */}
        <div className="px-6 py-3 bg-blue-50 border-b">
          <div className="text-sm text-blue-700">
            {tWithParams('flagLibrary.stats', {
              displayed: learningStats.displayed.toString(),
              total: learningStats.total.toString(),
              continent: t(`continent.${selectedContinent.toLowerCase()}`)
            })}
          </div>
        </div>

        {/* 国旗网格 */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 300px)' }}>
          <FlagGrid
            countries={filteredCountries}
            onCountryClick={setSelectedCountry}
            showCountryNames={false}
            language={language}
          />
          
          {filteredCountries.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">🔍</div>
              <div className="text-lg">
                {searchTerm ? t('flagLibrary.noSearchResults') : t('flagLibrary.noCountries')}
              </div>
            </div>
          )}
        </div>

        {/* 底部信息 */}
        <div className="p-4 border-t bg-gray-50 text-center text-sm text-gray-600">
          {t('flagLibrary.tip')}
        </div>
      </div>

      {/* 国家详情弹窗 */}
      {selectedCountry && (
        <CountryDetail
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
          language={language}
        />
      )}
    </div>
  );
};