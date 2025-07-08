
import React, { useState, useRef } from 'react';
import { UploadIcon, ArrowLeftIcon, CarIcon, InteriorIcon, CheckCircleIcon } from './common/Icons';

type TranslationStrings = {
    licensePlateLabel: string;
    licensePlatePlaceholder: string;
    exteriorPhoto: string;
    interiorPhoto: string;
    exteriorDescription: string;
    interiorDescription: string;
    arGuidance: string;
    clickOrDrag: string;
    change: string;
    fileSizeError: string;
    fileTypeError: string;
};

type ImageUploaderProps = {
  type: 'exterior' | 'interior';
  onFileSelect: (file: File, base64: string, type: 'exterior' | 'interior') => void;
  selectedImage: File | null;
  t: TranslationStrings;
};

function ImageUploader({ type, onFileSelect, selectedImage, t }: ImageUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError(t.fileSizeError);
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError(t.fileTypeError);
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        onFileSelect(file, base64String, type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
        handleFileChange({ target: fileInputRef.current } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const triggerFileSelect = () => fileInputRef.current?.click();

  const Icon = type === 'exterior' ? CarIcon : InteriorIcon;
  const title = type === 'exterior' ? t.exteriorPhoto : t.interiorPhoto;

  return (
    <div className="flex flex-col">
        <h3 className="text-lg font-heading font-semibold text-brand-light mb-2 flex items-center gap-2">
            <Icon className="w-7 h-7 text-brand-accent" />
            {title}
        </h3>
      {!selectedImage ? (
        <div 
          className="relative w-full h-48 border-2 border-dashed border-brand-slate/50 rounded-lg p-6 text-center cursor-pointer hover:border-brand-accent transition-colors bg-brand-dark shadow-neumorphic-inner group flex flex-col justify-center items-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={triggerFileSelect}
        >
            <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity" style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23D4AF37' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`
            }}></div>

            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
              aria-hidden="true"
            >
              {type === 'exterior' ? (
                <CarIcon className="w-2/3 h-2/3 text-brand-slate/10" strokeWidth="1"/>
              ) : (
                <InteriorIcon className="w-1/3 h-1/3 text-brand-slate/10" strokeWidth="1"/>
              )}
            </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg, image/png, image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="relative z-10 flex flex-col items-center text-brand-slate">
              <UploadIcon className="w-10 h-10 mb-2 text-brand-slate/70"/>
              <p className="font-semibold text-brand-light">{t.clickOrDrag}</p>
              <p className="text-sm mt-1">{t.arGuidance}</p>
          </div>
        </div>
      ) : (
        <div className="p-3 border border-brand-light-accent rounded-lg bg-brand-dark shadow-neumorphic-inner relative">
            <img 
                src={URL.createObjectURL(selectedImage)} 
                alt={`${type} preview`}
                className="h-40 w-full object-contain rounded-md"
            />
            <div className="absolute top-4 right-4 bg-brand-dark/80 rounded-full">
                <CheckCircleIcon className="w-7 h-7 text-brand-accent" />
            </div>
            <div className="flex justify-between items-center mt-3 text-sm">
                <p className="text-brand-slate truncate ">{selectedImage.name}</p>
                <button onClick={triggerFileSelect} className="text-brand-accent font-semibold hover:underline">{t.change}</button>
            </div>
        </div>
      )}
      {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
    </div>
  );
}

type ImageUploadStepProps = {
  onFileSelect: (file: File, base64: string, type: 'exterior' | 'interior') => void;
  onNext: () => void;
  onBack: () => void;
  exteriorImage: File | null;
  interiorImage: File | null;
  licensePlate: string;
  setLicensePlate: (plate: string) => void;
  t: {
    step1Title: string;
    step1Description: string;
    back: string;
    startAnalysis: string;
  } & TranslationStrings;
};

export function ImageUploadStep({ onFileSelect, onNext, onBack, exteriorImage, interiorImage, licensePlate, setLicensePlate, t }: ImageUploadStepProps): React.ReactNode {

  const canProceed = exteriorImage && interiorImage && licensePlate.trim();

  return (
    <div className="bg-brand-dark/50 backdrop-blur-sm border border-brand-light-accent p-6 sm:p-8 rounded-2xl shadow-neumorphic-outer max-w-3xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-brand-light">{t.step1Title}</h2>
        <p className="text-brand-slate mt-2 max-w-xl mx-auto">
          {t.step1Description}
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <label htmlFor="license-plate" className="block text-lg font-heading font-semibold text-brand-light mb-2">{t.licensePlateLabel}</label>
          <input
              id="license-plate"
              type="text"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder={t.licensePlatePlaceholder}
              className="w-full px-4 py-4 text-center text-xl font-mono font-bold tracking-widest text-brand-light bg-brand-dark-accent border-2 border-brand-light-accent rounded-lg shadow-neumorphic-inner placeholder:text-brand-slate focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all uppercase"
              required
            />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageUploader type="exterior" onFileSelect={onFileSelect} selectedImage={exteriorImage} t={t} />
          <ImageUploader type="interior" onFileSelect={onFileSelect} selectedImage={interiorImage} t={t} />
        </div>
      </div>


      <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
        <button
          onClick={onBack}
          className="flex w-full sm:w-auto items-center justify-center gap-2 text-brand-slate font-semibold py-3 px-4 rounded-md hover:bg-brand-light-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-slate/50 transition-all"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          {t.back}
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="w-full sm:w-auto bg-brand-accent text-brand-dark font-bold py-3 px-6 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-neumorphic-outer active:shadow-neumorphic-press"
        >
          <span className="bg-gradient-to-r from-yellow-900 to-amber-900 bg-clip-text text-transparent font-extrabold">{t.startAnalysis}</span>
        </button>
      </div>
    </div>
  );
}