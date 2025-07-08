

import React, { useState, useEffect, useCallback } from 'react';
import { AppStep, AppTranslations, DamageReport, Locale, Booking, User, UserRole, ServicePackage } from './types';
import { Header } from './components/common/Header';
import { ImageUploadStep } from './components/ImageUploadStep';
import { AnalysisReport } from './components/AnalysisReport';
import { ConfirmationStep } from './components/ConfirmationStep';
import { LanguageConsentPopup } from './components/LanguageConsentPopup';
import { analyzeVehicleImage } from './services/geminiService';
import { translations } from './translations';
import { Spinner } from './components/common/Spinner';
import { AlertTriangleIcon, DownloadIcon } from './components/common/Icons';
import { ProgressStepper } from './components/common/ProgressStepper';
import { bookingService } from './services/bookingService';
import { BookingRequestedStep } from './components/BookingRequestedStep';
import { AdminView } from './components/AdminView';
import { LoginScreen } from './components/LoginScreen';
import { authService } from './services/authService';
import { packageService } from './services/packageService';
import { SuperAdminView } from './components/SuperAdminView';
import { CustomerDashboard } from './components/CustomerDashboard';
import { TechnicianView } from './components/TechnicianView';
import { subscriptionService } from './services/subscriptionService';
import { SourceCodeModal } from './components/common/SourceCodeModal';

type ImageState = { file: File | null; base64: string; };
const initialImageState: ImageState = { file: null, base64: '' };

const getStepperSteps = (t: AppTranslations) => [
  { title: t.stepperInspection }, { title: t.stepperReport }, { title: t.stepperConfirm },
];

const getStepIndex = (step: AppStep): number => {
    switch (step) {
        case AppStep.ImageUpload: return 0;
        case AppStep.Analysis: return 1;
        case AppStep.Confirmation: return 2;
        default: return -1; // Indicates no stepper
    }
};

export default function App(): React.ReactNode {
  const [step, setStep] = useState<AppStep>(AppStep.Login);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authIsLoading, setAuthIsLoading] = useState<boolean>(true);
  
  const [licensePlate, setLicensePlate] = useState<string>('');
  const [exteriorImage, setExteriorImage] = useState<ImageState>(initialImageState);
  const [interiorImage, setInteriorImage] = useState<ImageState>(initialImageState);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DamageReport | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isSos, setIsSos] = useState<boolean>(false);
  const [finalPrice, setFinalPrice] = useState<number>(0);
  
  const [latestBooking, setLatestBooking] = useState<Booking | null>(null);
  const [isBooking, setIsBooking] = useState<boolean>(false);

  const [locale, setLocale] = useState<Locale>('nl');
  const [isLanguageSelected, setIsLanguageSelected] = useState<boolean>(false);
  
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>([]);
  const [surgeMultiplier, setSurgeMultiplier] = useState<number>(1);

  const [showSourceModal, setShowSourceModal] = useState<boolean>(false);
  
  const t = translations[locale];

  const initializeAppData = useCallback(() => {
    packageService.initializePackages();
    subscriptionService.initializeSubscriptions(authService.getAllUsers());
    setServicePackages(packageService.getPackages());
    setSurgeMultiplier(packageService.getSurgeMultiplier());

    const savedLocale = localStorage.getItem('app_locale') as Locale | null;
    if (savedLocale && ['en', 'nl', 'fr'].includes(savedLocale)) {
      setLocale(savedLocale);
      setIsLanguageSelected(true);
    } else {
       setIsLanguageSelected(false);
    }
    
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
       if (user.role === UserRole.CUSTOMER) setStep(AppStep.CustomerDashboard);
       else if (user.role === UserRole.TECHNICIAN) setStep(AppStep.TechnicianView);
       else if (user.role === UserRole.ADMIN) setStep(AppStep.Login); // Admins go to login to re-auth
       else if (user.role === UserRole.SUPER_ADMIN) setStep(AppStep.Login);
    }
    setAuthIsLoading(false);
  }, []);

  useEffect(() => {
    initializeAppData();
  }, [initializeAppData]);
  
  const handlePackagesUpdate = () => {
    setServicePackages(packageService.getPackages());
    setSurgeMultiplier(packageService.getSurgeMultiplier());
  };

  const handleLanguageConfirm = (selectedLocale: Locale) => {
    setLocale(selectedLocale);
    localStorage.setItem('app_locale', selectedLocale);
    setIsLanguageSelected(true);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if(user.role === UserRole.CUSTOMER) setStep(AppStep.CustomerDashboard);
    else if (user.role === UserRole.TECHNICIAN) setStep(AppStep.TechnicianView);
    else if (user.role === UserRole.ADMIN) setStep(AppStep.AdminView);
    else if (user.role === UserRole.SUPER_ADMIN) setStep(AppStep.SuperAdmin);
  };

  const handleRegister = (user: User) => {
    setCurrentUser(user);
    setStep(AppStep.CustomerDashboard);
  };

  const handleGuest = () => {
    setCurrentUser({
      firstName: 'Guest', lastName: '', email: `guest-${Date.now()}@washgo.pro`,
      address: '', phone: '', role: UserRole.GUEST,
    });
    setStep(AppStep.ImageUpload);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setStep(AppStep.Login);
  };

  const handleFileSelect = (file: File, base64: string, type: 'exterior' | 'interior') => {
    if (type === 'exterior') setExteriorImage({ file, base64 });
    else setInteriorImage({ file, base64 });
  };

  const handleStartAnalysis = useCallback(async () => {
    if (!exteriorImage.base64 || !interiorImage.base64 || !licensePlate) {
      setError(t.errorAllFields);
      return;
    }
    setIsLoading(true);
    setError(null);
    setStep(AppStep.Analysis);

    try {
      const result = await analyzeVehicleImage(exteriorImage.base64, interiorImage.base64, licensePlate, servicePackages, locale);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : t.errorUnknown);
    } finally {
      setIsLoading(false);
    }
  }, [exteriorImage.base64, interiorImage.base64, licensePlate, t, servicePackages, locale]);
  
  const handleServiceConfirm = (serviceKey: string, sos: boolean, price: number) => {
      setSelectedService(serviceKey);
      setIsSos(sos);
      setFinalPrice(price);
      setStep(AppStep.Confirmation);
  };
  
  const handleBookingRequest = async (data: { 
    requestedDateTime: string; 
    pickupAddress: string;
    deliveryAddress?: string;
    finalPrice: number;
  }) => {
      if (!analysisResult || !selectedService || !currentUser || data.finalPrice <= 0) return;
      
      setIsBooking(true);
      try {
        const newBooking = await bookingService.createBookingRequest({
          licensePlate,
          make: analysisResult.make, model: analysisResult.model, color: analysisResult.color,
          serviceKey: selectedService,
          requestedDateTime: data.requestedDateTime,
          sos: isSos,
          finalPrice: data.finalPrice,
          riskScore: analysisResult.riskScore,
          pickupAddress: data.pickupAddress,
          deliveryAddress: data.deliveryAddress,
        }, currentUser, locale);

        setLatestBooking(newBooking);
        setStep(AppStep.BookingRequested);
      } catch (error) {
        console.error("Booking failed:", error);
        setError(error instanceof Error ? error.message : t.errorUnknown);
      } finally {
        setIsBooking(false);
      }
  };

  const resetBookingFlow = () => {
    setLicensePlate('');
    setExteriorImage(initialImageState);
    setInteriorImage(initialImageState);
    setIsLoading(false);
    setError(null);
    setAnalysisResult(null);
    setSelectedService(null);
    setLatestBooking(null);
    setIsBooking(false);
    setIsSos(false);
    setFinalPrice(0);
  }

  const goToDashboard = () => {
    resetBookingFlow();
    const userRole = currentUser?.role;
    if (userRole === UserRole.CUSTOMER) {
        setStep(AppStep.CustomerDashboard);
    } else {
        // Guests go back to the start
        setStep(AppStep.ImageUpload);
    }
  };
  
  const renderCustomerFlow = () => {
    switch (step) {
      case AppStep.ImageUpload:
        return <ImageUploadStep onFileSelect={handleFileSelect} onNext={handleStartAnalysis} onBack={() => { resetBookingFlow(); setStep(AppStep.Login); }} exteriorImage={exteriorImage.file} interiorImage={interiorImage.file} licensePlate={licensePlate} setLicensePlate={setLicensePlate} t={t} />;
      case AppStep.Analysis:
        if (isLoading) {
            return <div className="flex flex-col items-center justify-center p-8 rounded-2xl min-h-[400px]"><Spinner size="lg" text={t.analyzing} /><p className="text-brand-slate mt-4 text-center">{t.analyzingDescription}</p></div>;
        }
        if (error) {
            const errorMessage = error === "errorSafety" ? t.errorSafety : error;
            return (
              <div className="bg-brand-dark/80 border p-6 sm:p-8 rounded-2xl text-center animate-fade-in shadow-neumorphic-outer">
                <div className="mx-auto w-16 h-16 flex items-center justify-center bg-red-500/10 rounded-full border border-red-500/20"><AlertTriangleIcon className="w-8 h-8 text-red-500" /></div>
                <h2 className="mt-4 text-xl sm:text-2xl font-heading font-bold text-brand-light">{t.analysisFailed}</h2>
                <p className="mt-2 text-red-400 bg-red-900/20 p-3 rounded-md border border-red-500/20">{errorMessage}</p>
                <button onClick={goToDashboard} className="mt-6 bg-brand-accent text-brand-dark font-bold py-3 px-8 rounded-md">{t.startOver}</button>
              </div>
            );
        }
        return <AnalysisReport report={analysisResult} onConfirmSelection={handleServiceConfirm} onBack={() => setStep(AppStep.ImageUpload)} imageUrl={exteriorImage.file ? URL.createObjectURL(exteriorImage.file) : ''} t={t} servicePackages={servicePackages} locale={locale} surgeMultiplier={surgeMultiplier} />;
       case AppStep.Confirmation:
        return <ConfirmationStep report={analysisResult} selectedService={selectedService} isSos={isSos} finalPrice={finalPrice} onRequestBooking={handleBookingRequest} onBack={() => setStep(AppStep.Analysis)} isBooking={isBooking} t={t} currentUser={currentUser} servicePackages={servicePackages} locale={locale} />;
      case AppStep.BookingRequested:
          return <BookingRequestedStep booking={latestBooking} onTrackBooking={goToDashboard} t={t} />;
      default:
        // This case should ideally not be hit in the customer flow, but as a fallback:
        return <CustomerDashboard currentUser={currentUser!} t={t} onBookNewService={() => { resetBookingFlow(); setStep(AppStep.ImageUpload); }} servicePackages={servicePackages} locale={locale}/>;
    }
  };

  const renderContent = () => {
    if (authIsLoading) return <div className="flex-grow flex items-center justify-center"><Spinner size="lg" text={t.loading} /></div>;
    
    switch(step) {
      case AppStep.Login:
        return <LoginScreen onLogin={handleLogin} onRegister={handleRegister} onGuest={handleGuest} t={t} />;
      case AppStep.SuperAdmin:
        return <SuperAdminView t={t} onPackagesUpdate={handlePackagesUpdate} servicePackages={servicePackages} />;
      case AppStep.AdminView:
        return <AdminView t={t} servicePackages={servicePackages} locale={locale} />;
      case AppStep.TechnicianView:
        return <TechnicianView currentUser={currentUser!} t={t} servicePackages={servicePackages} locale={locale} />;
      case AppStep.CustomerDashboard:
        return <CustomerDashboard currentUser={currentUser!} t={t} onBookNewService={() => { resetBookingFlow(); setStep(AppStep.ImageUpload); }} servicePackages={servicePackages} locale={locale} />;
      default:
        return renderCustomerFlow();
    }
  }

  if (!isLanguageSelected) return <LanguageConsentPopup onConfirm={handleLanguageConfirm} initialLocale={locale} />;
  
  const currentStepIndex = getStepIndex(step);
  const shouldShowStepper = (currentUser?.role === UserRole.CUSTOMER || currentUser?.role === UserRole.GUEST) && currentStepIndex !== -1;

  return (
    <div className="relative bg-gradient-to-br from-brand-dark to-brand-slate min-h-screen font-sans text-brand-light overflow-x-hidden">
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-brand-dark bg-[radial-gradient(#6E7F80_1px,transparent_1px)] [background-size:40px_40px] opacity-10"></div>
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
          <Header t={t} discount={0} currentUser={currentUser} onLogout={handleLogout} />
          <main className="flex-grow max-w-4xl mx-auto p-4 sm:p-8 lg:p-10 w-full flex flex-col">
            {shouldShowStepper && (
              <div className="mb-8 sm:mb-12 animate-fade-in">
                  <ProgressStepper steps={getStepperSteps(t)} currentStepIndex={currentStepIndex} />
              </div>
            )}
            <div className={`flex-grow flex items-center justify-center ${!shouldShowStepper ? 'self-center w-full max-w-6xl' : ''}`}>
                {renderContent()}
            </div>
          </main>
          <footer className="relative text-center p-4 text-brand-slate text-sm">
              <p>{t.footerText}</p>
              <button
                onClick={() => setShowSourceModal(true)}
                title="Download Source Code"
                className="absolute bottom-2 right-2 p-2 rounded-full text-brand-slate hover:text-brand-accent transition-colors"
                aria-label="Download source code"
              >
                <DownloadIcon className="w-5 h-5"/>
              </button>
          </footer>
      </div>
      {showSourceModal && <SourceCodeModal onClose={() => setShowSourceModal(false)} t={t} />}
    </div>
  );
}
