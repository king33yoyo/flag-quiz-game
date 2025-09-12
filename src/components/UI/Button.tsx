import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'game-mode';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'game-mode';
  disabled?: boolean;
  className?: string;
  mobileVertical?: boolean;
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  mobileVertical = false,
  icon,
}) => {
  const baseStyles = 'btn font-medium transition-all';
  
  const variantStyles = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'bg-green-600 text-white hover:bg-green-700',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border-2 border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50',
    'game-mode': 'btn-game-mode',
  };
  
  const sizeStyles = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-3 py-1',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
    'game-mode': 'btn-game-mode-size',
  };
  
  const disabledStyles = 'opacity-50 cursor-not-allowed';
  
  const mobileVerticalStyles = mobileVertical ? 'btn-mobile-vertical' : '';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? disabledStyles : ''}
        ${mobileVerticalStyles}
        ${className}
      `}
    >
      {icon && <span className="game-mode-icon">{icon}</span>}
      {children}
    </button>
  );
};