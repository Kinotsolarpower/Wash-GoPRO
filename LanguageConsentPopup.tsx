import React, { useState } from 'react';
import { Locale } from '../types';
import { translations } from '../translations';
import { Logo } from './common/Logo';

type LanguageConsentPopupProps = {
  onConfirm: (locale: Locale) => void;
  initialLocale: Locale;
};

export function LanguageConsentPopup({ onConfirm, initialLocale }: LanguageConsentPopupProps): React.ReactNode {
  const [selectedLocale, setSelectedLocale] = useState<Locale>(initialLocale);
  const [consentChecked, setConsentChecked] = useState<boolean>(false);

  const t = translations[selectedLocale];

  const handleConfirm = () => {
    if (consentChecked) {
      onConfirm(selectedLocale);
    }
  };
  
  const getButtonClasses = (locale: Locale) => {
      const baseClasses = 'w-full py-3 px-4 rounded-lg font-bold transition-all border-2 flex items-center justify-center shadow-neumorphic-outer active:shadow-neumorphic-press';
      if (locale === selectedLocale) {
          return `${baseClasses} bg-brand-light text-brand-dark border-transparent ring-2 ring-brand-light`;
      }
      return `${baseClasses} bg-brand-dark text-brand-slate border-brand-light-accent hover:border-brand-accent hover:text-brand-light`;
  }

  const handleLabelClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    if ((e.target as HTMLElement).tagName === 'A') {
      e.preventDefault();
      // In a real app, this would open a modal or navigate to the terms/privacy page.
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-lg flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-brand-dark/50 backdrop-blur-xl border border-brand-light-accent p-8 rounded-2xl shadow-neumorphic-outer max-w-lg w-full ring-1 ring-white/10">
        <div className="text-center">
            <Logo className="h-12 mx-auto mb-4" />
            <h2 className="text-2xl font-heading font-bold text-brand-light">{t.languagePopupTitle}</h2>
            <p className="text-brand-slate mt-2 mb-6">{t.languagePopupDescription}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <button onClick={() => setSelectedLocale('nl')} className={getButtonClasses('nl')}>
                <span>Nederlands</span>
            </button>
            <button onClick={() => setSelectedLocale('en')} className={getButtonClasses('en')}>
                <span>English</span>
            </button>
            <button onClick={() => setSelectedLocale('fr')} className={getButtonClasses('fr')}>
                <span>Français</span>
            </button>
        </div>
        
        <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-brand-light-accent/20 transition-colors">
                <input
                    id="consent-checkbox"
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="h-5 w-5 rounded border-brand-slate bg-brand-dark text-brand-accent focus:ring-brand-accent focus:ring-offset-brand-dark mt-0.5"
                />
                <label 
                  htmlFor="consent-checkbox" 
                  className="text-sm text-brand-slate"
                  onClick={handleLabelClick}
                  dangerouslySetInnerHTML={{ __html: t.consentCheckboxLabel }}
                />
            </div>
            
            <button
              onClick={handleConfirm}
              disabled={!consentChecked}
              className="relative group overflow-hidden w-full bg-brand-accent text-brand-dark font-bold py-3 px-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-neumorphic-outer active:shadow-neumorphic-press"
            >
              <span className="relative z-10 bg-gradient-to-r from-yellow-900 to-amber-900 bg-clip-text text-transparent font-extrabold">{t.confirmButton}</span>
              <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:animate-shimmer"></span>
            </button>
        </div>
      </div>
    </div>
  );
}