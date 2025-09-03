import type { Country } from '../../types';

interface FlagDisplayProps {
  country: Country;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  aspectRatio?: 'square' | '3-2' | '4-3' | '5-3' | 'auto';
}

export const FlagDisplay: React.FC<FlagDisplayProps> = ({
  country,
  size = 'md',
  className = '',
  aspectRatio = 'auto',
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'w-16 h-12',
      emoji: 'text-2xl',
      image: 'max-w-[80%] max-h-[80%]',
    },
    md: {
      container: 'w-24 h-16',
      emoji: 'text-4xl',
      image: 'max-w-[90%] max-h-[90%]',
    },
    lg: {
      container: 'w-48 h-32',
      emoji: 'text-6xl',
      image: 'max-w-[95%] max-h-[95%]',
    },
  };

  const config = sizeConfig[size];
  
  // Countries with special aspect ratios
  const specialFlags = {
    // Nepal has a unique triangular shape
    np: { aspectRatio: '3/4', scale: 1.2, padding: true },
    // Some flags are non-standard
    ch: { aspectRatio: '1/1', scale: 1.0 }, // Switzerland
    va: { aspectRatio: '1/1', scale: 1.0 }, // Vatican City
    sn: { aspectRatio: '2/3', scale: 1.1 }, // Senegal
    // Nordic flags often use specific ratios
    se: { aspectRatio: '5/8', scale: 1.0 }, // Sweden
    no: { aspectRatio: '8/11', scale: 1.0 }, // Norway
    dk: { aspectRatio: '28/37', scale: 1.0 }, // Denmark
    fi: { aspectRatio: '11/18', scale: 1.0 }, // Finland
    is: { aspectRatio: '18/25', scale: 1.0 }, // Iceland
  };
  
  const specialConfig = specialFlags[country.id as keyof typeof specialFlags];
  
  // Determine aspect ratio class
  const getAspectRatioClass = () => {
    if (specialConfig) return '';
    if (aspectRatio === 'auto') return '';
    return `flag-container-${aspectRatio}`;
  };
  
  // Special handling classes
  const specialClasses = specialConfig 
    ? `${(specialConfig as any).padding ? 'p-1' : ''} flag-${country.id}`
    : '';
  
  // Base classes
  const baseClasses = `
    flag-container
    ${getAspectRatioClass()}
    ${config.container}
    ${specialClasses}
    ${className}
  `;

  return (
    <div className={baseClasses.trim()}>
      {country.flag.startsWith('/flags/') ? (
        <img 
          src={country.flag} 
          alt={`${country.name} flag`}
          className={`
            ${config.image}
            object-contain
            ${specialConfig ? `scale-[${specialConfig.scale}]` : ''}
          `}
          style={{
            aspectRatio: specialConfig?.aspectRatio || aspectRatio === 'auto' ? 'auto' : undefined,
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