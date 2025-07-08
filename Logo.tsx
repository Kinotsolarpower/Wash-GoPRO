import React from 'react';

export const Logo = ({ className = 'h-10' }: { className?: string }): React.ReactNode => (
  <div className={`flex items-center gap-3 ${className}`}>
    <svg 
      viewBox="0 0 40 40" 
      className="h-full w-auto text-brand-accent"
      aria-hidden="true"
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20C0 8.95431 8.95431 0 20 0ZM19.648 10.211C19.8623 9.71295 20.5221 9.62145 20.8495 9.9882L28.1829 18.2549C28.7112 18.8494 28.3116 19.7891 27.5673 19.882L15.6881 21.2407C15.0598 21.3196 14.6537 20.7302 14.9912 20.177L19.648 10.211ZM12.2327 20.118C11.6884 20.0249 11.2888 20.9646 11.8171 21.5591L19.1505 29.8257C19.4779 30.1925 20.1377 30.101 20.352 29.6029L25.0088 19.6369C25.3463 19.0839 24.9402 18.4945 24.3119 18.5734L12.2327 20.118Z"
        fill="currentColor" 
      />
    </svg>
    <span className="text-2xl font-heading font-bold tracking-tight text-brand-light">
      Wash&Go Pro
    </span>
  </div>
);