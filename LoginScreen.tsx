import React, { useState } from 'react';
import { AppTranslations, User } from '../types';
import { MailIcon, LockIcon, UserIcon, HomeIcon, PhoneIcon } from './common/Icons';
import { authService } from '../services/authService';
import { Spinner } from './common/Spinner';
import { Logo } from './common/Logo';

type LoginScreenProps = {
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
  onGuest: () => void;
  t: AppTranslations;
};

type ActiveTab = 'login' | 'register';

const InputField = ({ id, type, placeholder, value, onChange, icon, required = true }: { id: string, type: string, placeholder: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, icon: React.ReactNode, required?: boolean }) => (
    <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {icon}
        </div>
        <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 text-base text-brand-light bg-brand-dark-accent border-2 border-brand-light-accent rounded-lg shadow-neumorphic-inner placeholder:text-brand-slate focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all"
            required={required}
        />
    </div>
);

export function LoginScreen({ onLogin, onRegister, onGuest, t }: LoginScreenProps): React.ReactNode {
  const [activeTab, setActiveTab] = useState<ActiveTab>('login');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  // Owner Access State
  const [logoClicks, setLogoClicks] = useState(0);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [ownerCode, setOwnerCode] = useState('');
  const [ownerError, setOwnerError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    await new Promise(res => setTimeout(res, 500));

    const user = authService.login(email, password);
    if (user) {
        onLogin(user);
    } else {
        setError(t.loginError);
    }
    setIsSubmitting(false);
  };
  
  const handleRegisterSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      await new Promise(res => setTimeout(res, 500));

      const newUser = authService.register({
          email, password_sent: password, firstName, lastName, address, phone
      });

      if (newUser) {
          onRegister(newUser);
      } else {
          setError(t.registrationError);
      }
      setIsSubmitting(false);
  };

  const handleLogoClick = () => {
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (newCount >= 5) {
        setShowOwnerModal(true);
        setLogoClicks(0); // reset
    }
  };

  const handleOwnerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setOwnerError(null);
    if (ownerCode === '12354-AKak') {
        setIsSubmitting(true);
        const user = authService.login('superadmin@washgo.pro', 'superadmin');
        setIsSubmitting(false);
        if (user) {
            onLogin(user);
        } else {
            setOwnerError('Super admin account not found.');
        }
        setShowOwnerModal(false);
    } else {
        setOwnerError(t.ownerAccessError);
    }
  };

  const getTabClasses = (tabName: ActiveTab) => {
    const baseClasses = 'w-full py-3 text-center font-bold transition-colors duration-300 rounded-t-lg';
    if (activeTab === tabName) {
      return `${baseClasses} bg-brand-dark/50 text-brand-accent border-b-2 border-brand-accent`;
    }
    return `${baseClasses} text-brand-slate hover:text-brand-light`;
  };

  return (
    <div className="relative w-full max-w-md mx-auto animate-fade-in">
        <div aria-hidden="true" className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 bg-brand-accent/5 rounded-full blur-3xl animate-pulse opacity-70 pointer-events-none"></div>
        <div className="relative z-10">
            <div onClick={handleLogoClick} className="cursor-pointer mb-6">
                <Logo />
            </div>
            <div className="bg-brand-dark/50 backdrop-blur-xl border border-brand-light-accent p-2 rounded-2xl shadow-neumorphic-outer">
                <div className="flex">
                    <button onClick={() => setActiveTab('login')} className={getTabClasses('login')}>{t.loginTab}</button>
                    <button onClick={() => setActiveTab('register')} className={getTabClasses('register')}>{t.registerTab}</button>
                </div>
                
                <div className="p-6">
                    {activeTab === 'login' && (
                        <form onSubmit={handleLoginSubmit} className="space-y-6">
                            <InputField id="email" type="email" placeholder={t.emailLabel} value={email} onChange={e => setEmail(e.target.value)} icon={<MailIcon className="h-5 w-5 text-brand-slate"/>} />
                            <InputField id="password" type="password" placeholder={t.passwordLabel} value={password} onChange={e => setPassword(e.target.value)} icon={<LockIcon className="h-5 w-5 text-brand-slate"/>} />
                            
                            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                            
                            <button type="submit" disabled={isSubmitting} className="relative group overflow-hidden w-full bg-brand-accent text-brand-dark font-bold py-3 px-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-accent transition-all disabled:opacity-50 disabled:cursor-wait shadow-neumorphic-outer active:shadow-neumorphic-press">
                                <span className="relative z-10">{isSubmitting ? <Spinner size="sm" /> : <span className="bg-gradient-to-r from-yellow-900 to-amber-900 bg-clip-text text-transparent font-extrabold">{t.loginButton}</span>}</span>
                                {!isSubmitting && <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:animate-shimmer"></span>}
                            </button>
                        </form>
                    )}

                    {activeTab === 'register' && (
                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField id="firstName" type="text" placeholder={t.firstNameLabel} value={firstName} onChange={e => setFirstName(e.target.value)} icon={<UserIcon className="h-5 w-5 text-brand-slate"/>} />
                                <InputField id="lastName" type="text" placeholder={t.lastNameLabel} value={lastName} onChange={e => setLastName(e.target.value)} icon={<UserIcon className="h-5 w-5 text-brand-slate"/>} />
                            </div>
                            <InputField id="email" type="email" placeholder={t.emailLabel} value={email} onChange={e => setEmail(e.target.value)} icon={<MailIcon className="h-5 w-5 text-brand-slate"/>} />
                            <InputField id="phone" type="tel" placeholder={t.phoneLabel} value={phone} onChange={e => setPhone(e.target.value)} icon={<PhoneIcon className="h-5 w-5 text-brand-slate"/>} />
                            <InputField id="address" type="text" placeholder={t.addressLabel} value={address} onChange={e => setAddress(e.target.value)} icon={<HomeIcon className="h-5 w-5 text-brand-slate"/>} />
                            <InputField id="password" type="password" placeholder={t.passwordLabel} value={password} onChange={e => setPassword(e.target.value)} icon={<LockIcon className="h-5 w-5 text-brand-slate"/>} />
                            
                            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                            <button type="submit" disabled={isSubmitting} className="relative group overflow-hidden w-full bg-brand-accent text-brand-dark font-bold py-3 px-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-accent transition-all disabled:opacity-50 disabled:cursor-wait shadow-neumorphic-outer active:shadow-neumorphic-press">
                                <span className="relative z-10">{isSubmitting ? <Spinner size="sm" /> : <span className="bg-gradient-to-r from-yellow-900 to-amber-900 bg-clip-text text-transparent font-extrabold">{t.registerButton}</span>}</span>
                                {!isSubmitting && <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:animate-shimmer"></span>}
                            </button>
                        </form>
                    )}

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-brand-slate/30"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-brand-dark/50 backdrop-blur-sm px-2 text-brand-slate">{t.orContinueAs}</span>
                        </div>
                    </div>

                    <button onClick={onGuest} className="w-full border-2 border-brand-light-accent text-brand-light font-bold py-3 px-4 rounded-md hover:bg-brand-light-accent/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-accent transition-all shadow-neumorphic-outer active:shadow-neumorphic-press">
                        {t.guestButton}
                    </button>
                </div>
            </div>
        </div>
        {showOwnerModal && (
            <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
                <div className="bg-brand-dark/80 border border-brand-light-accent p-6 rounded-2xl shadow-neumorphic-outer w-full max-w-sm">
                    <h3 className="text-xl font-heading font-bold text-brand-light text-center">{t.ownerAccessTitle}</h3>
                    <p className="text-brand-slate my-2 text-center text-sm">{t.ownerAccessDescription}</p>
                    <form onSubmit={handleOwnerLogin} className="mt-4 space-y-4">
                        <InputField 
                            id="owner-code" 
                            type="password" 
                            placeholder={t.ownerAccessCodeLabel} 
                            value={ownerCode} 
                            onChange={e => setOwnerCode(e.target.value)} 
                            icon={<LockIcon className="h-5 w-5 text-brand-slate"/>}
                        />
                        {ownerError && <p className="text-red-400 text-sm text-center">{ownerError}</p>}
                        <button type="submit" className="w-full bg-brand-accent text-brand-dark font-bold py-3 px-4 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-accent transition-all shadow-neumorphic-outer active:shadow-neumorphic-press">
                            {isSubmitting ? <Spinner size="sm" /> : t.ownerAccessSubmit}
                        </button>
                    </form>
                </div>
            </div>
        )}
    </div>
  );
}