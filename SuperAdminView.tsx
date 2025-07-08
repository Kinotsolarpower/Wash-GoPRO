
import React, { useState, useEffect } from 'react';
import { AppTranslations, ServicePackage, ServiceDetails, Locale } from '../types';
import { Spinner } from './common/Spinner';
import { packageService } from '../services/packageService';
import { generateServicePackageFromPrompt, translateServiceDetails } from '../services/geminiService';

type SuperAdminViewProps = {
  t: AppTranslations;
  servicePackages: ServicePackage[];
  onPackagesUpdate: () => void;
};

const EditModal = ({ pkg, onSave, onCancel, t }: { pkg: ServiceDetails; onSave: (details: ServiceDetails) => void; onCancel: () => void; t: AppTranslations; }) => {
    const [details, setDetails] = useState<ServiceDetails>(pkg);
    const [isSaving, setIsSaving] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await onSave(details);
        setIsSaving(false);
    };
    
    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...details.features];
        newFeatures[index] = value;
        setDetails({ ...details, features: newFeatures });
    };

    const addFeature = () => setDetails({ ...details, features: [...details.features, ''] });
    const removeFeature = (index: number) => setDetails({ ...details, features: details.features.filter((_, i) => i !== index) });

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-brand-dark/80 border border-brand-light-accent p-6 rounded-2xl shadow-neumorphic-outer w-full max-w-lg">
                <h3 className="text-xl font-heading font-bold text-brand-light mb-4">{t.reviewAndSave}</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-brand-slate mb-1">{t.packageNameLabel}</label>
                        <input value={details.name} onChange={(e) => setDetails({ ...details, name: e.target.value })} className="w-full px-3 py-2 text-brand-light bg-brand-dark-accent border-2 border-brand-light-accent rounded-md shadow-neumorphic-inner"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-slate mb-1">{t.priceLabel}</label>
                        <input type="number" value={details.price} onChange={(e) => setDetails({ ...details, price: Number(e.target.value) })} className="w-full px-3 py-2 text-brand-light bg-brand-dark-accent border-2 border-brand-light-accent rounded-md shadow-neumorphic-inner"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-brand-slate mb-1">{t.featuresLabel}</label>
                        <div className="space-y-2">{details.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input value={feature} onChange={(e) => handleFeatureChange(index, e.target.value)} className="w-full px-3 py-2 text-brand-light bg-brand-dark-accent border-2 border-brand-light-accent rounded-md shadow-neumorphic-inner"/>
                                <button onClick={() => removeFeature(index)} className="text-red-500 hover:text-red-400 p-2 rounded-full bg-brand-dark-accent shadow-neumorphic-inner">&times;</button>
                            </div>
                        ))}</div>
                        <button onClick={addFeature} className="mt-2 text-sm text-brand-accent hover:underline">{t.addFeature}</button>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onCancel} className="text-brand-slate font-bold py-2 px-4 rounded-md">{t.cancel}</button>
                    <button onClick={handleSave} disabled={isSaving || isTranslating} className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-md shadow-neumorphic-outer disabled:opacity-50">
                        {isSaving ? <Spinner size="sm" /> : t.savePackage}
                    </button>
                </div>
            </div>
        </div>
    );
};

const DeleteConfirmModal = ({ name, onConfirm, onCancel, t }: { name: string, onConfirm: () => void, onCancel: () => void, t: AppTranslations }) => (
    <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className="bg-brand-dark/80 border border-brand-light-accent p-6 rounded-2xl shadow-neumorphic-outer w-full max-w-sm">
            <h3 className="text-xl font-heading font-bold text-brand-light text-center">{t.confirmDeleteTitle}</h3>
            <p className="text-brand-slate my-4 text-center">{t.confirmDeleteDescription(name)}</p>
            <div className="flex justify-center gap-4">
                <button onClick={onCancel} className="text-brand-slate font-bold py-2 px-6 rounded-md">{t.cancel}</button>
                <button onClick={onConfirm} className="bg-red-600 text-white font-bold py-2 px-6 rounded-md shadow-neumorphic-outer">
                    {t.deletePackage}
                </button>
            </div>
        </div>
    </div>
);


export function SuperAdminView({ t, servicePackages, onPackagesUpdate }: SuperAdminViewProps) {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedPackage, setGeneratedPackage] = useState<ServiceDetails | null>(null);
    const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);
    const [deletingKey, setDeletingKey] = useState<string | null>(null);
    const [surgeMultiplier, setSurgeMultiplier] = useState<number>(1);

    useEffect(() => {
        setSurgeMultiplier(packageService.getSurgeMultiplier());
    }, []);

    const handleSetMultiplier = () => {
        packageService.setSurgeMultiplier(surgeMultiplier);
        onPackagesUpdate();
        alert('Surge multiplier updated!');
    };

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        setError(null);
        try {
            const result = await generateServicePackageFromPrompt(prompt);
            setGeneratedPackage(result);
        } catch (err) { setError(t.aiError); } finally { setIsGenerating(false); }
    };

    const handleSaveNewPackage = async (details: ServiceDetails) => {
        setIsSaving(true);
        setIsTranslating(true);
        setError(null);
        try {
            const key = `pkg_${Date.now()}`;
            const [detailsNl, detailsFr] = await Promise.all([
                translateServiceDetails(details, 'nl'), 
                translateServiceDetails(details, 'fr')
            ]);
            setIsTranslating(false);
            const newPackage: ServicePackage = { 
                key, 
                details: { 
                    en: details, 
                    nl: { ...details, name: detailsNl.name, features: detailsNl.features }, 
                    fr: { ...details, name: detailsFr.name, features: detailsFr.features } 
                } 
            };
            packageService.addPackage(newPackage);
            onPackagesUpdate();
            setGeneratedPackage(null);
            setPrompt('');
        } catch (err) { setError(t.aiError); } finally { setIsSaving(false); setIsTranslating(false); }
    };
    
    const handleUpdatePackage = async (details: ServiceDetails) => {
        if (!editingPackage) return;
        setIsSaving(true);
        setIsTranslating(true);
        setError(null);
        try {
            const [detailsNl, detailsFr] = await Promise.all([
                translateServiceDetails(details, 'nl'), 
                translateServiceDetails(details, 'fr')
            ]);
            setIsTranslating(false);
            const updatedPackage: ServicePackage = { 
                ...editingPackage,
                details: { 
                    en: details, 
                    nl: { ...details, name: detailsNl.name, features: detailsNl.features }, 
                    fr: { ...details, name: detailsFr.name, features: detailsFr.features } 
                }
            };
            packageService.updatePackage(updatedPackage);
            onPackagesUpdate();
            setEditingPackage(null);
        } catch (err) { setError(t.aiError); } finally { setIsSaving(false); setIsTranslating(false); }
    };

    const handleDelete = () => {
        if (!deletingKey) return;
        packageService.deletePackage(deletingKey);
        onPackagesUpdate();
        setDeletingKey(null);
    };

    return (
        <div className="w-full animate-fade-in">
            {editingPackage && <EditModal pkg={editingPackage.details.en} onSave={handleUpdatePackage} onCancel={() => setEditingPackage(null)} t={t} />}
            {generatedPackage && <EditModal pkg={generatedPackage} onSave={handleSaveNewPackage} onCancel={() => setGeneratedPackage(null)} t={t} />}
            {deletingKey && <DeleteConfirmModal name={servicePackages.find(p=>p.key === deletingKey)?.details.en.name || ''} onConfirm={handleDelete} onCancel={() => setDeletingKey(null)} t={t} />}

            <div className="bg-brand-dark/50 backdrop-blur-xl border border-brand-light-accent p-6 sm:p-8 rounded-2xl shadow-neumorphic-outer">
                <h2 className="text-3xl font-heading font-bold text-brand-light mb-6">{t.superAdminTitle}</h2>
                
                {/* Dynamic Pricing */}
                <div className="mb-8 p-4 bg-brand-dark/60 rounded-lg shadow-neumorphic-inner">
                    <h3 className="font-bold text-lg text-brand-light mb-2">{t.dynamicPricingTitle}</h3>
                    <div className="flex gap-4 items-center">
                        <input type="number" step="0.05" value={surgeMultiplier} onChange={e => setSurgeMultiplier(Number(e.target.value))} className="flex-grow px-3 py-2 text-brand-light bg-brand-dark-accent border-2 border-brand-light-accent rounded-md shadow-neumorphic-inner"/>
                        <button onClick={handleSetMultiplier} className="bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-md shadow-neumorphic-outer">{t.setMultiplier}</button>
                    </div>
                </div>

                {/* Manage Packages */}
                <div>
                    <h3 className="font-bold text-lg text-brand-light mb-2">{t.managePackages}</h3>
                    <div className="space-y-3">
                        {servicePackages.map(pkg => (
                            <div key={pkg.key} className="bg-brand-dark-accent p-3 rounded-md flex justify-between items-center shadow-neumorphic-inner">
                                <div>
                                    <p className="font-semibold text-brand-light">{pkg.details.en.name}</p>
                                    <p className="text-sm text-brand-slate">€{pkg.details.en.price}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingPackage(pkg)} className="text-sm font-semibold py-1 px-3 rounded-md bg-brand-dark shadow-neumorphic-outer">{t.editPackage}</button>
                                    <button onClick={() => setDeletingKey(pkg.key)} className="text-sm font-semibold py-1 px-3 rounded-md bg-red-800/50 text-red-300 shadow-neumorphic-outer">{t.deletePackage}</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Create New Package */}
                <div className="mt-8 pt-6 border-t border-brand-light-accent/10">
                    <h3 className="font-bold text-lg text-brand-light mb-2">{t.createPackageTitle}</h3>
                    <div className="p-4 bg-brand-dark/60 rounded-lg shadow-neumorphic-inner">
                        <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={t.createPackagePlaceholder} rows={2} className="w-full p-2 text-brand-light bg-brand-dark-accent border-2 border-brand-light-accent rounded-md shadow-neumorphic-inner"/>
                        <button onClick={handleGenerate} disabled={isGenerating} className="mt-2 w-full bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-md shadow-neumorphic-outer disabled:opacity-50">
                            {isGenerating ? <Spinner size="sm"/> : t.generatePackage}
                        </button>
                    </div>
                    {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                </div>
            </div>
        </div>
    );
}
