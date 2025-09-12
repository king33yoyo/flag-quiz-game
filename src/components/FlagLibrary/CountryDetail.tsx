import { Button } from '../UI/Button';
import type { Country } from '../../types';
import { useI18n } from '../../i18n';

interface CountryDetailProps {
  country: Country;
  onClose: () => void;
  language: 'en' | 'zh';
}

export const CountryDetail: React.FC<CountryDetailProps> = ({
  country,
  onClose,
  language,
}) => {
  const { t } = useI18n();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat(language === 'zh' ? 'zh-CN' : 'en-US').format(num);
  };

  const getCountryName = () => {
    if (language === 'zh' && country.nameZh) {
      return country.nameZh;
    }
    return country.name;
  };

  const getContinentName = () => {
    return t(`continent.${country.continent.toLowerCase()}`);
  };

  const getCapitalName = () => {
    if (language === 'zh') {
      // 主要首都中文映射
      const capitalMap: Record<string, string> = {
        'Beijing': '北京',
        'Tokyo': '东京',
        'Washington, D.C.': '华盛顿特区',
        'London': '伦敦',
        'Paris': '巴黎',
        'Moscow': '莫斯科',
        'Berlin': '柏林',
        'Canberra': '堪培拉',
        'Ottawa': '渥太华',
        'Brasília': '巴西利亚',
        'New Delhi': '新德里',
        'Rome': '罗马',
        'Madrid': '马德里',
        'Amsterdam': '阿姆斯特丹',
        'Stockholm': '斯德哥尔摩',
        'Vienna': '维也纳',
        'Brussels': '布鲁塞尔',
        'Warsaw': '华沙',
        'Prague': '布拉格',
        'Budapest': '布达佩斯',
        'Athens': '雅典',
        'Lisbon': '里斯本',
        'Dublin': '都柏林',
        'Copenhagen': '哥本哈根',
        'Helsinki': '赫尔辛基',
        'Oslo': '奥斯陆',
        'Seoul': '首尔',
        'Bangkok': '曼谷',
        'Singapore': '新加坡',
        'Kuala Lumpur': '吉隆坡',
        'Jakarta': '雅加达',
        'Manila': '马尼拉',
        'Hanoi': '河内',
        'Mumbai': '孟买',
        'Karachi': '卡拉奇',
        'Dhaka': '达卡',
        'Lahore': '拉合尔',
        'Bangalore': '班加罗尔',
        'Chennai': '金奈',
        'Kolkata': '加尔各答',
        'Istanbul': '伊斯坦布尔',
        'Cairo': '开罗',
        'Lagos': '拉各斯',
        'Kinshasa': '金沙萨',
        'Johannesburg': '约翰内斯堡',
        'Buenos Aires': '布宜诺斯艾利斯',
        'Santiago': '圣地亚哥',
        'Lima': '利马',
        'Bogotá': '波哥大',
        'Caracas': '加拉加斯',
        'Mexico City': '墨西哥城',
        'Madrid': '马德里'
      };
      return capitalMap[country.capital] || country.capital;
    }
    return country.capital;
  };

  const getCurrencyName = () => {
    if (language === 'zh') {
      // 主要货币中文映射
      const currencyMap: Record<string, string> = {
        'Chinese yuan': '人民币',
        'US dollar': '美元',
        'Euro': '欧元',
        'Japanese yen': '日元',
        'British pound': '英镑',
        'Australian dollar': '澳元',
        'Canadian dollar': '加元',
        'Swiss franc': '瑞士法郎',
        'Swedish krona': '瑞典克朗',
        'Norwegian krone': '挪威克朗',
        'Danish krone': '丹麦克朗',
        'Polish zloty': '波兰兹罗提',
        'Czech koruna': '捷克克朗',
        'Hungarian forint': '匈牙利福林',
        'Russian ruble': '俄罗斯卢布',
        'Indian rupee': '印度卢比',
        'Brazilian real': '巴西雷亚尔',
        'Mexican peso': '墨西哥比索',
        'South African rand': '南非兰特',
        'South Korean won': '韩元',
        'Indonesian rupiah': '印尼盾',
        'Thai baht': '泰铢',
        'Malaysian ringgit': '马来西亚林吉特',
        'Philippine peso': '菲律宾比索',
        'Vietnamese dong': '越南盾',
        'Turkish lira': '土耳其里拉',
        'Israeli new shekel': '以色列新谢克尔',
        'Saudi riyal': '沙特里亚尔',
        'UAE dirham': '阿联酋迪拉姆',
        'Egyptian pound': '埃及镑',
        'Nigerian naira': '奈拉',
        'Kenyan shilling': '肯尼亚先令',
        'Moroccan dirham': '摩洛哥迪拉姆',
        'Algerian dinar': '阿尔及利亚第纳尔',
        'Libyan dinar': '利比亚第纳尔',
        'Tunisian dinar': '突尼斯第纳尔',
        'Chilean peso': '智利比索',
        'Colombian peso': '哥伦比亚比索',
        'Peruvian sol': '秘鲁索尔',
        'Argentine peso': '阿根廷比索',
        'Venezuelan bolívar': '委内瑞拉玻利瓦尔',
        'Ukrainian hryvnia': '乌克兰格里夫纳',
        'Romanian leu': '罗马尼亚列伊',
        'Bulgarian lev': '保加利亚列弗',
        'Croatian kuna': '克罗地亚库纳',
        'Serbian dinar': '塞尔维亚第纳尔',
        'Bosnia and Herzegovina convertible mark': '波斯尼亚可兑换马克',
        'Macedonian denar': '马其顿第纳尔',
        'Albanian lek': '阿尔巴尼亚列克',
        'Georgian lari': '格鲁吉亚拉里',
        'Armenian dram': '亚美尼亚德拉姆',
        'Azerbaijani manat': '阿塞拜疆马纳特',
        'Kazakhstani tenge': '哈萨克斯坦坚戈',
        'Uzbekistani som': '乌兹别克斯坦苏姆',
        'Kyrgyzstani som': '吉尔吉斯斯坦索姆',
        'Tajikistani somoni': '塔吉克斯坦索莫尼',
        'Turkmenistan manat': '土库曼斯坦马纳特',
        'Mongolian tögrög': '蒙古图格里克',
        'North Korean won': '朝鲜元',
        'Taiwan dollar': '新台币',
        'Hong Kong dollar': '港币',
        'Macanese pataca': '澳门币'
      };
      return currencyMap[country.currency] || country.currency;
    }
    return country.currency;
  };

  const getSubregionName = () => {
    if (language === 'zh' && country.subregion) {
      // 主要子区域中文映射
      const subregionMap: Record<string, string> = {
        'North America': '北美洲',
        'Central America': '中美洲',
        'South America': '南美洲',
        'Caribbean': '加勒比地区',
        'Northern Europe': '北欧',
        'Western Europe': '西欧',
        'Eastern Europe': '东欧',
        'Southern Europe': '南欧',
        'Central Asia': '中亚',
        'Eastern Asia': '东亚',
        'South-Eastern Asia': '东南亚',
        'Southern Asia': '南亚',
        'Western Asia': '西亚',
        'Northern Africa': '北非',
        'Western Africa': '西非',
        'Middle Africa': '中非',
        'Eastern Africa': '东非',
        'Southern Africa': '南非',
        'Australia and New Zealand': '澳大利亚和新西兰',
        'Melanesia': '美拉尼西亚',
        'Micronesia': '密克罗尼西亚',
        'Polynesia': '波利尼西亚'
      };
      return subregionMap[country.subregion] || country.subregion;
    }
    return country.subregion;
  };

  const getLanguageName = (lang: string) => {
    if (language === 'zh') {
      // 主要语言中文映射
      const languageMap: Record<string, string> = {
        'English': '英语',
        'Chinese': '中文',
        'Spanish': '西班牙语',
        'Hindi': '印地语',
        'French': '法语',
        'Arabic': '阿拉伯语',
        'Bengali': '孟加拉语',
        'Portuguese': '葡萄牙语',
        'Russian': '俄语',
        'Japanese': '日语',
        'German': '德语',
        'Korean': '韩语',
        'Italian': '意大利语',
        'Turkish': '土耳其语',
        'Persian': '波斯语',
        'Polish': '波兰语',
        'Dutch': '荷兰语',
        'Thai': '泰语',
        'Vietnamese': '越南语',
        'Indonesian': '印尼语',
        'Greek': '希腊语',
        'Swedish': '瑞典语',
        'Norwegian': '挪威语',
        'Danish': '丹麦语',
        'Finnish': '芬兰语',
        'Czech': '捷克语',
        'Hungarian': '匈牙利语',
        'Romanian': '罗马尼亚语',
        'Bulgarian': '保加利亚语',
        'Croatian': '克罗地亚语',
        'Serbian': '塞尔维亚语',
        'Slovak': '斯洛伐克语',
        'Slovenian': '斯洛文尼亚语',
        'Lithuanian': '立陶宛语',
        'Latvian': '拉脱维亚语',
        'Estonian': '爱沙尼亚语',
        'Maltese': '马耳他语',
        'Icelandic': '冰岛语',
        'Irish': '爱尔兰语',
        'Scottish Gaelic': '苏格兰盖尔语',
        'Welsh': '威尔士语',
        'Basque': '巴斯克语',
        'Catalan': '加泰罗尼亚语',
        'Galician': '加利西亚语',
        'Ukrainian': '乌克兰语',
        'Belarusian': '白俄罗斯语',
        'Macedonian': '马其顿语',
        'Albanian': '阿尔巴尼亚语',
        'Georgian': '格鲁吉亚语',
        'Armenian': '亚美尼亚语',
        'Azerbaijani': '阿塞拜疆语',
        'Kazakh': '哈萨克语',
        'Uzbek': '乌兹别克语',
        'Mongolian': '蒙古语',
        'Hebrew': '希伯来语',
        'Urdu': '乌尔都语',
        'Punjabi': '旁遮普语',
        'Gujarati': '古吉拉特语',
        'Marathi': '马拉地语',
        'Tamil': '泰米尔语',
        'Telugu': '泰卢固语',
        'Kannada': '卡纳达语',
        'Malayalam': '马拉雅拉姆语',
        'Sinhala': '僧伽罗语',
        'Burmese': '缅甸语',
        'Khmer': '高棉语',
        'Lao': '老挝语',
        'Tagalog': '他加禄语',
        'Malay': '马来语',
        'Swahili': '斯瓦希里语',
        'Zulu': '祖鲁语',
        'Afrikaans': '南非荷兰语',
        'Amharic': '阿姆哈拉语',
        'Somali': '索马里语',
        'Hausa': '豪萨语',
        'Yoruba': '约鲁巴语',
        'Igbo': '伊博语',
        'Shona': '绍纳语',
        'Malagasy': '马达加斯加语',
        'Fijian': '斐济语',
        'Samoan': '萨摩亚语',
        'Tongan': '汤加语',
        'Maori': '毛利语',
        'Hawaiian': '夏威夷语',
        'Nepali': '尼泊尔语',
        'Dzongkha': '宗卡语',
        'Bhutanese': '不丹语',
        'Pashto': '普什图语',
        'Tajik': '塔吉克语',
        'Turkmen': '土库曼语',
        'Kyrgyz': '吉尔吉斯语',
        'Kazakh': '哈萨克语'
      };
      return languageMap[lang] || lang;
    }
    return lang;
  };

  
  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-2xl">
        {/* 标题栏 */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="text-6xl">
              {country.flag.startsWith('/flags/') ? (
                <img 
                  src={country.flag} 
                  alt={`${country.name} flag`}
                  className="w-20 h-16 object-contain"
                />
              ) : (
                <span>{country.flag}</span>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {getCountryName()}
              </h2>
              <p className="text-gray-600">
                {country.capital} • {getContinentName()}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="px-3 py-1"
          >
            ✕
          </Button>
        </div>

        {/* 详细信息 */}
        <div className="p-6 space-y-6">
          {/* 基本信息 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t('countryDetail.basicInfo')}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('countryDetail.capital')}:</span>
                  <span className="font-medium">{getCapitalName()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('countryDetail.continent')}:</span>
                  <span className="font-medium">{getContinentName()}</span>
                </div>
                {country.subregion && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('countryDetail.subregion')}:</span>
                    <span className="font-medium">{getSubregionName()}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t('countryDetail.statistics')}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('countryDetail.population')}:</span>
                  <span className="font-medium">{formatNumber(country.population)}</span>
                </div>
                {country.area && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('countryDetail.area')}:</span>
                    <span className="font-medium">{formatNumber(country.area)} km²</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('countryDetail.landlocked')}:</span>
                  <span className="font-medium">{country.landlocked ? '🚫' : '🌊'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('countryDetail.independent')}:</span>
                  <span className="font-medium">{country.independent ? '✅' : '🏛️'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 额外信息 */}
          {(country.languages || country.currency) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t('countryDetail.additionalInfo')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {country.languages && country.languages.length > 0 && (
                  <div>
                    <span className="text-gray-600">{t('countryDetail.languages')}:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {country.languages.map((lang, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                        >
                          {getLanguageName(lang)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {country.currency && (
                  <div>
                    <span className="text-gray-600">{t('countryDetail.currency')}:</span>
                    <div className="mt-1">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                        {getCurrencyName()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 坐标信息 */}
          {country.coordinates && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t('countryDetail.location')}
              </h3>
              <div className="text-sm text-gray-600">
                {t('countryDetail.coordinates')}: {country.coordinates[0]}°, {country.coordinates[1]}°
              </div>
            </div>
          )}

          {/* 邻国信息 */}
          {country.neighbours && country.neighbours.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {t('countryDetail.neighbours')}
              </h3>
              <div className="text-sm text-gray-600">
                {country.neighbours.length} {t('countryDetail.neighbouringCountries')}
              </div>
            </div>
          )}
        </div>

        {/* 底部按钮 */}
        <div className="p-6 border-t bg-gray-50 text-center">
          <Button
            variant="primary"
            onClick={onClose}
            className="px-6"
          >
            {t('common.close')}
          </Button>
        </div>
      </div>
    </div>
  );
};