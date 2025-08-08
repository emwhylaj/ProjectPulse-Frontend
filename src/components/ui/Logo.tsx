import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'default' | 'white';
}

export const Logo: React.FC<LogoProps> = ({ 
  className, 
  size = 'md', 
  showText = true,
  variant = 'default'
}) => {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const colors = {
    default: 'text-blue-600',
    white: 'text-white',
  };

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {/* Logo Icon */}
      <div className={cn(
        'rounded-lg flex items-center justify-center',
        sizes[size],
        variant === 'default' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-white bg-opacity-20'
      )}>
        <svg 
          className={cn('w-2/3 h-2/3', variant === 'default' ? 'text-white' : 'text-white')} 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M12 2L2 7L12 12L22 7L12 2Z" opacity="0.8"/>
          <path d="M2 17L12 22L22 17"/>
          <path d="M2 12L12 17L22 12"/>
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <div className={cn('font-bold tracking-tight', textSizes[size], colors[variant])}>
          Project<span className="text-blue-500">Pulse</span>
        </div>
      )}
    </div>
  );
};