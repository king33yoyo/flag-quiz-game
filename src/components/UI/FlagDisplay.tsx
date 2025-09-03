import type { Country } from '../../types';

interface FlagDisplayProps {
  country: Country;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FlagDisplay: React.FC<FlagDisplayProps> = ({
  country,
  size = 'md',
  className = '',
}) => {
  // Size configurations with proper styling
  const sizeConfig = {
    sm: {
      container: 'w-20 h-14 p-1',
      emoji: 'text-2xl',
      image: 'w-full h-full object-contain',
    },
    md: {
      container: 'w-28 h-20 p-2',
      emoji: 'text-4xl',
      image: 'w-full h-full object-contain',
    },
    lg: {
      container: 'w-48 h-32 p-3',
      emoji: 'text-6xl',
      image: 'w-full h-full object-contain',
    },
  };

  const config = sizeConfig[size];
  
  // Special handling for Nepal's unique flag - just add extra padding
  const isNepal = country.id === 'np';
  const nepalPadding = isNepal ? 'p-3' : '';
  
  // Base classes with consistent styling
  const baseClasses = `
    ${config.container}
    ${nepalPadding}
    flex items-center justify-center
    bg-white border-2 border-gray-300 rounded-lg
    overflow-hidden
    ${className}
  `.trim();

  return (
    <div className={baseClasses}>
      {country.flag.startsWith('/flags/') ? (
        <img 
          src={country.flag} 
          alt={`${country.name} flag`}
          className={config.image}
          onError={(e) => {
            // Fallback to emoji if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const fallback = document.createElement('span');
              fallback.className = config.emoji + ' leading-none';
              fallback.textContent = '🏳️';
              parent.appendChild(fallback);
            }
          }}
        />
      ) : (
        <span className={`${config.emoji} leading-none`}>
          {country.flag}
        </span>
      )}
    </div>
  );
};