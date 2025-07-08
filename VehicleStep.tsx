
import React, { useState } from 'react';
import { AppTranslations, User, ServicePackage, Locale, ServiceDetails } from '../types';
import { ArrowRightIcon, CarIcon, ClipboardListIcon, SparklesIcon, CheckCircleIcon } from './common/Icons';

type HomeScreenProps = {
  onSubmit: (licensePlate: string) => void;
  t: AppTranslations;
  currentUser: User | null;
  servicePackages: ServicePackage[];
  locale: Locale;
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-brand-dark/50 p-6 rounded-2xl shadow-neumorphic-inner text-center transform hover:-translate-y-2 transition-transform duration-300 border border-brand-light-accent/10 h-full">
        <div className="mx-auto w-16 h-16 flex items-center justify-center bg-brand-dark rounded-full mb-4 shadow-neumorphic-outer">
            {icon}
        </div>
        <h3 className="font-heading text-xl font-bold text-brand-light">{title}</h3>
        <p className="text-brand-slate mt-2 text-sm">{description}</p>
    </div>
);

const ServiceCard = ({ service }: { service: ServiceDetails }) => (
    <div className="bg-brand-dark/50 p-6 rounded-2xl shadow-neumorphic-inner border border-brand-light-accent/20 flex flex-col h-full">
        <h4 className="font-heading text-lg font-bold text-brand-light">{service.name}</h4>
        <p className="text-2xl font-extrabold text-brand-accent mt-1 mb-4">€{service.price}</p>
        <ul className="space-y-2 text-sm text-brand-slate flex-grow">
            {service.features.slice(0, 2).map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" strokeWidth="3" />
                    <span>{feature}</span>
                </li>
            ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-brand-light-accent/10 text-xs text-brand-slate text-center">
            ... and more
        </div>
    </div>
);

export function VehicleStep({ onSubmit, t, currentUser, servicePackages, locale }: HomeScreenProps): React.ReactNode {
    const [plate, setPlate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (plate.trim()) {
            onSubmit(plate.trim().toUpperCase());
        }
    };
    
    const featuredPackages = servicePackages.slice(2, 5);

    return (
        <div className="animate-fade-in py-8 sm:py-12 w-full">
             <div className="text-center max-w-3xl mx-auto px-4">
                {currentUser && currentUser.role !== 'GUEST' && (
                     <h2 className="font-heading text-2xl font-bold text-brand-accent mb-2">
                        {t.welcomeBack(currentUser.firstName)}
                    </h2>
                )}
                <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-brand-light">
                    {t.homeTitle}
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-brand-slate">
                    {t.homeDescription}
                </p>
            </div>
            
            <div className="max-w-xl mx-auto mt-12 px-4">
                <form onSubmit={handleSubmit} className="relative p-2 bg-brand-dark rounded-xl shadow-neumorphic-outer border border-brand-light-accent/20">
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                         <input
                            id="license-plate-home"
                            type="text"
                            value={plate}
                            onChange={(e) => setPlate(e.target.value)}
                            placeholder={t.licensePlatePlaceholder}
                            className="w-full px-4 py-4 text-center sm:text-left text-xl font-mono font-bold tracking-widest text-brand-light bg-brand-dark-accent border-2 border-brand-light-accent rounded-lg shadow-neumorphic-inner placeholder:text-brand-slate focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all uppercase flex-grow"
                            required
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={!plate.trim()}
                            className="relative group overflow-hidden w-full sm:w-auto flex items-center justify-center gap-3 bg-brand-accent text-brand-dark font-bold py-4 px-6 text-lg rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-accent transition-all disabled:bg-brand-slate disabled:cursor-not-allowed transform hover:scale-105 shadow-neumorphic-outer active:shadow-neumorphic-press"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                              <span className="bg-gradient-to-r from-yellow-900 to-amber-900 bg-clip-text text-transparent font-extrabold">{t.startAnalysis}</span>
                              <ArrowRightIcon className="w-6 h-6 text-yellow-900" />
                            </span>
                            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:animate-shimmer"></span>
                        </button>
                    </div>
                </form>
            </div>

            <div className="max-w-6xl mx-auto px-4 mt-20 sm:mt-24">
                <h2 className="text-center font-heading text-3xl font-bold text-brand-light mb-12">{t.howItWorksTitle}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <FeatureCard 
                        icon={<CarIcon className="w-10 h-10 text-brand-accent"/>}
                        title={t.homeStep1Title}
                        description={t.homeStep1Desc}
                    />
                    <FeatureCard 
                        icon={<ClipboardListIcon className="w-10 h-10 text-brand-accent"/>}
                        title={t.homeStep2Title}
                        description={t.homeStep2Desc}
                    />
                    <FeatureCard 
                        icon={<SparklesIcon className="w-10 h-10 text-brand-accent"/>}
                        title={t.homeStep3Title}
                        description={t.homeStep3Desc}
                    />
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 mt-20 sm:mt-24">
                <h2 className="text-center font-heading text-3xl font-bold text-brand-light mb-12">{t.featuredServicesTitle}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                   {featuredPackages.map(pkg => {
                       const service = pkg.details[locale];
                       if (!service) return null;
                       return <ServiceCard key={pkg.key} service={service} />;
                   })}
                </div>
            </div>
        </div>
    );
}