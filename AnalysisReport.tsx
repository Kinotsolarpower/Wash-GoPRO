


import React, { useState } from 'react';
import { DamageReport, ServiceDetails, ServicePackage, Locale, Issue } from '../types';
import { CheckCircleIcon, PhoneIcon, ArrowLeftIcon, ClipboardListIcon, CarIcon, InteriorIcon } from './common/Icons';
import { CONTACT_PHONE_NUMBER } from '../config';
import { RiskGauge } from './common/RiskGauge';

type TranslationProp = {
    analysisFailed: string;
    startOver: string;
    analysisReportTitle: string;
    analysisCompleteFor: (make: string, model: string) => string;
    vehicleDetails: string;
    make: string;
    model: string;
    color: string;
    detectedDamages: string;
    noExteriorDamages: string;
    noInteriorDamages: string;
    noSuggestions: string;
    confirmService: string;
    errorSafety: string;
    aiRecommendsTitle: string;
    recommendedBadge: string;
    liveAdviceTitle: string;
    liveAdviceDescription: string;
    liveAdviceButton: string;
    back: string;
    sosCleanTitle: string;
    sosCleanDescription: (percent: number) => string;
    finalPrice: string;
    aiRiskScore: string;
    riskScoreDescription: (score: number) => string;
    exteriorPhoto: string; 
    interiorPhoto: string;
    expertSummaryTitle: string;
    areaLabel: string;
    observationLabel: string;
    recommendationLabel: string;
};

type AnalysisReportProps = {
  report: DamageReport | null;
  onConfirmSelection: (serviceKey: string, isSos: boolean, finalPrice: number) => void;
  onBack: () => void;
  imageUrl: string;
  t: TranslationProp;
  servicePackages: ServicePackage[];
  locale: Locale;
  surgeMultiplier: number;
};

const IssueCard = ({ issue, t }: { issue: Issue, t: TranslationProp }): React.ReactNode => (
    <div className="bg-brand-dark p-4 rounded-lg shadow-neumorphic-inner space-y-2 text-left">
        <h4 className="font-bold text-brand-light">{issue.area}</h4>
        <div>
            <p className="text-xs font-semibold uppercase text-brand-slate tracking-wider">{t.observationLabel}</p>
            <p className="text-brand-light/90 text-sm mt-0.5">{issue.observation}</p>
        </div>
        <div>
            <p className="text-xs font-semibold uppercase text-brand-slate tracking-wider">{t.recommendationLabel}</p>
            <p className="text-amber-400 text-sm font-medium mt-0.5">{issue.recommendation}</p>
        </div>
    </div>
);

type ServiceCardProps = {
    serviceKey: string;
    serviceDetails: ServiceDetails;
    isSelected: boolean;
    isRecommended: boolean;
    onClick: (key: string) => void;
    t: { recommendedBadge: string };
    surgeMultiplier: number;
};

const ServiceCard = ({ serviceKey, serviceDetails, isSelected, isRecommended, onClick, t, surgeMultiplier }: ServiceCardProps): React.ReactNode => {
    const borderClass = isSelected 
        ? 'border-brand-accent ring-2 ring-brand-accent' 
        : 'border-brand-light-accent/20 hover:border-brand-accent/50';

    const finalPrice = parseFloat((serviceDetails.price * surgeMultiplier).toFixed(2));

    return (
        <div 
          onClick={() => onClick(serviceKey)} 
          className={`relative block p-4 sm:p-5 rounded-xl border-2 bg-brand-dark cursor-pointer transition-all duration-300 transform hover:-translate-y-1 shadow-neumorphic-outer active:shadow-neumorphic-inner ${borderClass}`}
        >
            {isRecommended && <div className="absolute -top-3 right-4 bg-brand-accent text-brand-dark text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">{t.recommendedBadge}</div>}
            <div className="flex justify-between items-start gap-4">
                <h4 className="text-base sm:text-lg font-bold text-brand-light pr-4">{serviceDetails.name}</h4>
                <div className="flex flex-col items-end flex-shrink-0">
                    <span className="text-xl sm:text-2xl font-extrabold text-brand-accent">€{finalPrice}</span>
                    {surgeMultiplier > 1 && <span className="text-xs text-brand-slate line-through">€{serviceDetails.price}</span>}
                </div>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-brand-slate border-t border-brand-light-accent/10 pt-4">
                {serviceDetails.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                        <CheckCircleIcon className="w-5 h-5 text-brand-accent/70 flex-shrink-0 mt-0.5" strokeWidth="2.5" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export function AnalysisReport({ report, onConfirmSelection, onBack, imageUrl, t, servicePackages, locale, surgeMultiplier }: AnalysisReportProps): React.ReactNode {
  if (!report) return null;
  
  const [selectedServiceKey, setSelectedServiceKey] = useState<string>(report.bestSuggestionKey);
  const [isSos, setIsSos] = useState(false);

  const SOS_MULTIPLIER = 1.3; // 30% surcharge

  const selectedPackage = servicePackages.find(p => p.key === selectedServiceKey);
  const basePrice = selectedPackage?.details[locale]?.price || 0;
  const finalPrice = parseFloat((basePrice * surgeMultiplier * (isSos ? SOS_MULTIPLIER : 1)).toFixed(2));

  const handleConfirm = () => {
    onConfirmSelection(selectedServiceKey, isSos, finalPrice);
  };

  return (
    <div className="animate-fade-in w-full">
        <div className="bg-brand-dark/50 backdrop-blur-sm border border-brand-light-accent p-6 sm:p-8 rounded-2xl shadow-neumorphic-outer">
            <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-brand-light">{t.analysisReportTitle}</h2>
                <p className="text-brand-slate mt-2 text-base sm:text-lg">{t.analysisCompleteFor(report.make, report.model)}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="relative rounded-lg shadow-neumorphic-outer overflow-hidden group">
                        <img src={imageUrl} alt="Vehicle analyzed" className="w-full object-cover border-2 border-brand-light-accent rounded-lg" />
                    </div>

                    <div className="bg-brand-dark p-5 rounded-lg shadow-neumorphic-inner border border-brand-accent/20">
                        <h3 className="text-lg font-heading font-bold text-brand-light mb-3">{t.expertSummaryTitle}</h3>
                        <p className="text-brand-slate text-base font-serif italic leading-relaxed">{report.persuasiveSummary}</p>
                    </div>

                     <div className="bg-brand-dark p-4 sm:p-5 rounded-lg shadow-neumorphic-inner space-y-4">
                        <h3 className="text-lg font-heading font-bold text-brand-light mb-2">{t.detectedDamages}</h3>
                        
                        <div>
                            <h4 className="flex items-center gap-2 font-semibold text-brand-light mb-3"><CarIcon className="w-6 h-6 text-brand-accent"/>Exterieur</h4>
                            {report.exteriorIssues.length > 0 ? (
                                <div className="space-y-3">{report.exteriorIssues.map((issue, index) => <IssueCard key={index} issue={issue} t={t} />)}</div>
                            ) : (
                                 <p className="text-brand-slate text-sm pl-8">{t.noExteriorDamages}</p>
                            )}
                        </div>
                        
                        <div className="border-t border-brand-light-accent/10 pt-4">
                            <h4 className="flex items-center gap-2 font-semibold text-brand-light mb-3"><InteriorIcon className="w-6 h-6 text-brand-accent"/>Interieur</h4>
                             {report.interiorIssues.length > 0 ? (
                                <div className="space-y-3">{report.interiorIssues.map((issue, index) => <IssueCard key={index} issue={issue} t={t} />)}</div>
                            ) : (
                                 <p className="text-brand-slate text-sm pl-8">{t.noInteriorDamages}</p>
                            )}
                        </div>
                    </div>
                    <div className="bg-brand-dark p-5 rounded-lg shadow-neumorphic-inner border border-brand-light-accent/20">
                        <h3 className="text-lg font-heading font-bold text-brand-light mb-3 flex items-center gap-2"><ClipboardListIcon className="w-6 h-6 text-brand-accent"/>{t.aiRiskScore}</h3>
                        <p className="text-brand-slate text-sm">{t.riskScoreDescription(report.riskScore)}</p>
                        <div className="mt-3 flex justify-center">
                            <RiskGauge score={report.riskScore} />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-heading font-bold text-brand-light mb-4">{t.aiRecommendsTitle}</h3>
                        {servicePackages.length > 0 ? (
                           <div className="space-y-4">
                                {servicePackages.map((pkg) => {
                                    const serviceDetails = pkg.details[locale];
                                    if (!serviceDetails) return null;
                                    return (
                                        <ServiceCard key={pkg.key} serviceKey={pkg.key} serviceDetails={serviceDetails} isSelected={selectedServiceKey === pkg.key} isRecommended={report.bestSuggestionKey === pkg.key} onClick={setSelectedServiceKey} t={t} surgeMultiplier={surgeMultiplier} />
                                    );
                                })}
                           </div>
                        ) : (
                            <p className="text-brand-slate">{t.noSuggestions}</p>
                        )}
                    </div>
                    
                    <div className="bg-brand-dark p-5 rounded-lg shadow-neumorphic-inner border border-brand-light-accent/20">
                        <h3 className="text-lg font-heading font-bold text-brand-light mb-3 flex items-center gap-2">
                            <PhoneIcon className="w-6 h-6 text-brand-accent"/>
                            {t.liveAdviceTitle}
                        </h3>
                        <p className="text-brand-slate text-sm mb-4">{t.liveAdviceDescription}</p>
                        <a 
                            href={`tel:${CONTACT_PHONE_NUMBER}`}
                            className="group relative w-full block text-center bg-brand-dark-accent text-brand-light font-bold py-3 px-4 rounded-md hover:border-brand-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-accent transition-all shadow-neumorphic-outer active:shadow-neumorphic-press border-2 border-brand-light-accent"
                        >
                            {t.liveAdviceButton}
                        </a>
                    </div>


                     <div className="bg-brand-dark p-5 rounded-lg shadow-neumorphic-inner border border-brand-light-accent/20">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-heading font-bold text-brand-light">{t.sosCleanTitle}</h4>
                                <p className="text-brand-slate text-sm mt-1">{t.sosCleanDescription(30)}</p>
                            </div>
                            <label htmlFor="sos-toggle" className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" id="sos-toggle" className="sr-only peer" checked={isSos} onChange={() => setIsSos(!isSos)} />
                                <div className="w-11 h-6 bg-brand-light-accent/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent"></div>
                            </label>
                        </div>
                    </div>
                    
                    <div className="bg-brand-dark p-5 rounded-lg shadow-neumorphic-inner border-2 border-brand-accent/50 text-center">
                        <h4 className="text-sm font-semibold text-brand-slate uppercase tracking-wider">{t.finalPrice}</h4>
                        <p className="text-4xl font-extrabold text-brand-accent mt-1">€{finalPrice}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
            <button onClick={onBack} className="flex w-full sm:w-auto items-center justify-center gap-2 text-brand-slate font-semibold py-3 px-4 rounded-md hover:bg-brand-light-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-slate/50 transition-all">
                <ArrowLeftIcon className="w-5 h-5" />
                {t.back}
            </button>
            <button onClick={handleConfirm} disabled={!selectedServiceKey} className="w-full sm:w-auto bg-brand-accent text-brand-dark font-bold py-3 px-8 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-neumorphic-outer active:shadow-neumorphic-press">
            <span className="bg-gradient-to-r from-yellow-900 to-amber-900 bg-clip-text text-transparent font-extrabold">{t.confirmService}</span>
            </button>
        </div>
    </div>
  );
}
