
import React from 'react';
import { GiftIcon, LogOutIcon, UserIcon } from './Icons';
import { Logo } from './Logo';
import { User, AppTranslations } from '../../types';

type HeaderProps = {
    t: AppTranslations;
    discount: number;
    currentUser: User | null;
    onLogout: () => void;
}

export function Header({ t, discount, currentUser, onLogout }: HeaderProps): React.ReactNode {
  return (
    <header className="bg-brand-dark/70 backdrop-blur-lg border-b border-brand-light-accent sticky top-0 z-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          {currentUser && (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                  <span className="text-sm font-medium text-brand-light">{t.welcomeBack(currentUser.firstName)}</span>
              </div>
              <button 
                onClick={onLogout}
                className="flex items-center gap-2 p-2 rounded-full text-brand-slate hover:text-brand-light hover:bg-brand-light-accent transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-accent"
                aria-label={t.logoutButton}
              >
                  <LogOutIcon className="w-5 h-5"/>
              </button>
            </div>
          )}
        </div>
      </div>
      {discount > 0 && !currentUser && (
         <div className="bg-brand-accent/10 border-t border-b border-brand-accent/20 text-brand-light text-sm font-semibold">
             <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-2">
                <GiftIcon className="w-5 h-5 text-brand-accent" />
                <span>{t.promoBanner(discount)}</span>
             </div>
         </div>
      )}
    </header>
  );
}
