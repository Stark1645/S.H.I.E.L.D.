import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  isDarkMode?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', message, isDarkMode = true }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-slate-700 dark:border-slate-800 rounded-full`}></div>
        <div className={`${sizeClasses[size]} border-4 border-cyan-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0`}></div>
      </div>
      {message && (
        <p className={`mt-4 text-sm font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
