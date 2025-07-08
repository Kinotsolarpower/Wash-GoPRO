import React from 'react';
import { CheckIcon } from './Icons';

type RiskGaugeProps = {
  score: number;
};

export const RiskGauge = ({ score }: RiskGaugeProps): React.ReactNode => {
  const percentage = Math.min(Math.max(score, 0), 100);
  
  let color = '#D4AF37'; // gold - brand-accent
  if (percentage > 50) color = '#f97316'; // orange-500
  if (percentage > 80) color = '#ef4444'; // red-500

  return (
    <div
      className="relative w-10 h-10 rounded-full grid place-content-center text-white transition-all duration-500 shadow-neumorphic-inner"
      style={
        {
          '--p': percentage,
          '--c': color,
          'background': `
            radial-gradient(farthest-side, hsl(210, 71%, 12%) 80%, transparent 81% 100%),
            conic-gradient(var(--c) calc(var(--p) * 1%), #6E7F8055 0)
          `,
        } as React.CSSProperties
      }
    >
      <CheckIcon className="w-5 h-5 text-brand-light" strokeWidth={3} />
    </div>
  );
};