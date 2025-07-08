
import React from 'react';

type ProgressStepperProps = {
  steps: { title: string }[];
  currentStepIndex: number;
};

export function ProgressStepper({ steps, currentStepIndex }: ProgressStepperProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step, stepIdx) => {
          const isCompleted = currentStepIndex > stepIdx;
          const isCurrent = currentStepIndex === stepIdx;
          
          let borderColor = 'border-brand-slate';
          if (isCurrent || isCompleted) {
            borderColor = 'border-brand-accent';
          }

          let textColor = 'text-brand-slate';
           if (isCurrent) {
            textColor = 'text-brand-accent';
          } else if (isCompleted) {
            textColor = 'text-brand-light';
          }

          return (
            <li key={step.title} className="md:flex-1">
              <div
                className={`group flex flex-col border-l-4 py-2 pl-4 transition-colors duration-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${borderColor}`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span className={`text-xs font-bold tracking-wider uppercase transition-colors duration-300 ${textColor}`}>
                  Step {stepIdx + 1}
                </span>
                <span className="text-sm font-medium">{step.title}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
