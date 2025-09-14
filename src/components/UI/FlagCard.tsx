import type { Country } from '../../types';

interface FlagCardProps {
  country: Country;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  showName?: boolean;
  size?: 'sm' | 'md' | 'lg';
  language?: 'en' | 'zh';
}

export const FlagCard: React.FC<FlagCardProps> = ({
  country,
  onClick,
  selected = false,
  disabled = false,
  showName = false,
  size = 'md',
  language = 'en',
}) => {
  // 检测是否为尼泊尔国旗
  const isNepal = country.id === 'np';
  
  const sizeStyles = {
    sm: 'w-16 h-12 text-2xl',
    md: 'w-24 h-16 text-4xl',
    lg: 'w-32 h-24 text-6xl',
  };
  
  const containerStyles = `
    ${sizeStyles[size]}
    flex flex-col items-center justify-center
    bg-white border-2 rounded-lg shadow-md
    transition-all cursor-pointer
    hover:shadow-md hover:scale-105
    ${selected ? 'border-blue-500' : 'border-gray-200'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
  `;
  
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={containerStyles}
    >
      <div className="text-center leading-none w-full h-full flex items-center justify-center">
        {country.flag.startsWith('/flags/') ? (
          <img 
            src={country.flag} 
            alt={`${country.name} flag`}
            className={`w-full h-full object-contain ${isNepal ? 'scale-75 p-1' : ''}`}
            style={isNepal ? { 
              transformOrigin: 'center',
              maxWidth: '50%',
              maxHeight: '100%'
            } : {}}
          />
        ) : (
          <span className={`leading-none ${isNepal ? 'text-xs scale-90' : 'text-sm'}`}>{country.flag}</span>
        )}
      </div>
      {showName && (
        <div className="mt-1 text-xs font-medium text-gray-700 text-center px-1 truncate w-full">
          {language === 'zh' && country.nameZh ? country.nameZh : country.name}
        </div>
      )}
    </div>
  );
};