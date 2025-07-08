import React from 'react';

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
};

export function Spinner({ size = 'md', text, className='' }: SpinnerProps): React.ReactNode {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-brand-slate/30 border-t-brand-accent`}
        role="status"
      >
        <span className="sr-only">{text || 'Loading...'}</span>
      </div>
      {text && <p className="text-brand-light animate-pulse font-medium">{text}</p>}
    </div>
  );
}