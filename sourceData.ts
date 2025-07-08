
// This file contains the source code of all application files for download purposes.
// It is programmatically generated to be correct.

export const sourceFiles: Record<string, string> = {
  "index.tsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
  "metadata.json": `{\n  \"name\": \"Copy of Wash&Go Pro\",\n  \"description\": \"The Wash&Go Pro app provides a 3-step vehicle analysis and booking flow, subscription management, and role-based views for customers, technicians, and administrators. Features include dynamic pricing, AI risk scoring, AR-guided photo uploads, and comprehensive dashboards.\",\n  \"requestFramePermissions\": [],\n  \"prompt\": \"\"\n}`,
  "index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Wash&Go Pro - Premium Vehicle Analysis</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Lexend:wght@700;800&family=Lora:ital,wght@0,400;1,400..700&display=swap" rel="stylesheet">
    <style>
      @property --p {
        syntax: '<number>';
        inherits: true;
        initial-value: 0;
      }
      @property --c {
        syntax: '<color>';
        inherits: true;
        initial-value: #D4AF37;
      }
    </style>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              brand: {
                'dark': '#0A2342', // Deep Navy
                'accent': '#D4AF37', // Brushed Gold
                'light': '#F5F5F5', // Porcelain White
                'slate': '#6E7F80', // Slate Gray
                'dark-accent': '#08203d',
                'light-accent': '#0c2647',
              }
            },
            fontFamily: {
              sans: ['Inter', 'sans-serif'],
              heading: ['Lexend', 'sans-serif'],
              serif: ['Lora', 'serif'],
            },
            keyframes: {
                'fade-in': { 
                    '0%': { opacity: 0, transform: 'translateY(20px) scale(0.98)' },
                    '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
                },
                'border-spin': {
                    '100%': { 'transform': 'rotate(360deg)' }
                },
                'shimmer': {
                    '100%': { transform: 'translateX(100%)' },
                }
            },
            animation: {
                'fade-in': 'fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'border-spin': 'border-spin 3s linear infinite',
                'shimmer': 'shimmer 1.5s infinite'
            },
            boxShadow: { 
              'neumorphic-outer': '12px 12px 24px #081d36, -12px -12px 24px #0c294e',
              'neumorphic-inner': 'inset 6px 6px 12px #081d36, inset -6px -6px 12px #0c294e',
              'neumorphic-press': 'inset 5px 5px 10px #081d36, inset -5px -5px 10px #0c294e',
            }
          }
        }
      }
    </script>
  <script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@^19.1.0",
    "react-dom/": "https://esm.sh/react-dom@^19.1.0/",
    "react/": "https://esm.sh/react@^19.1.0/",
    "@google/genai": "https://esm.sh/@google/genai@^1.7.0"
  }
}
</script>
</head>
  <body>
    <div id="root"></div>
    <script type="module" src="/index.tsx"></script>
  </body>
</html>`,
  "App.tsx": `import React, { useState, useEffect, useCallback } from 'react';
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
      firstName: 'Guest', lastName: '', email: \`guest-\${Date.now()}@washgo.pro\`,
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
            <div className={\`flex-grow flex items-center justify-center \${!shouldShowStepper ? 'self-center w-full max-w-6xl' : ''}\`}>
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
}`,
  "types.ts": `export enum AppStep {
  Login,
  ImageUpload,
  Analysis,
  Confirmation,
  BookingRequested,
  AdminView,
  SuperAdmin,
  CustomerDashboard,
  TechnicianView,
}

export enum UserRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  TECHNICIAN = 'TECHNICIAN',
  CUSTOMER = 'CUSTOMER',
  GUEST = 'GUEST',
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  phone: string;
  role: UserRole;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Booking {
  id: string;
  licensePlate: string;
  make: string;
  model: string;
  color: string;
  serviceKey: string;
  requestedDateTime: string;
  status: BookingStatus;
  customerEmail: string;
  travelTime?: number; // in minutes
  fuelCost?: number; // in euros
  optimizedRoute?: string;
  riskScore?: number;
  sos: boolean;
  finalPrice: number;
  afterPhotoUrl?: string;
  technicianDamageNotes?: string[];
  assignedTechnician?: string;
  pickupAddress: string;
  deliveryAddress?: string;
}

export interface Subscription {
  id: string;
  userId: string;
  packageKey: string;
  status: 'ACTIVE' | 'PAUSED';
  startDate: string;
  washesRemaining: number;
}


export interface Issue {
  area: string;
  observation: string;
  recommendation: string;
}

export interface DamageReport {
  make: string;
  model: string;
  color: string;
  persuasiveSummary: string;
  exteriorIssues: Issue[];
  interiorIssues: Issue[];
  bestSuggestionKey: string;
  riskScore: number; // 1-100
}

export interface ServiceDetails {
  name: string;
  price: number;
  features: string[];
}

export interface ServicePackage {
  key: string;
  details: Record<Locale, ServiceDetails>;
}

export type Locale = 'en' | 'nl' | 'fr';

export interface AppTranslations {
  // --- AUTH & LOGIN ---
  loginTitle: string;
  loginTab: string;
  registerTab: string;
  emailLabel: string;
  passwordLabel: string;
  loginButton: string;
  orContinueAs: string;
  guestButton: string;
  logoutButton: string;
  firstNameLabel: string;
  lastNameLabel: string;
  addressLabel: string;
  phoneLabel: string;
  registerButton: string;
  registering: string;
  welcomeBack: (name: string) => string;
  loginError: string;
  registrationError: string;
  
  // Popup
  languagePopupTitle: string;
  languagePopupDescription: string;
  consentCheckboxLabel: string;
  confirmButton: string;

  // Header & Footer
  headerTitle: string;
  promoBanner: (amount: number) => string;
  footerText: string;

  // Home Screen (VehicleStep)
  homeTitle: string;
  homeDescription: string;
  howItWorksTitle: string;
  homeStep1Title: string;
  homeStep1Desc: string;
  homeStep2Title: string;
  homeStep2Desc: string;
  homeStep3Title: string;
  homeStep3Desc: string;
  featuredServicesTitle: string;

  // General
  continue: string;
  back: string;
  loading: string;
  
  // Image Upload Step
  step1Title: string;
  step1Description: string;
  licensePlateLabel: string;
  licensePlatePlaceholder: string;
  exteriorPhoto: string;
  interiorPhoto: string;
  exteriorDescription: string;
  interiorDescription: string;
  arGuidance: string;
  clickOrDrag: string;
  change: string;
  startAnalysis: string;
  
  // Image Uploader Errors
  fileSizeError: string;
  fileTypeError: string;
  
  // Stepper
  stepperInspection: string;
  stepperReport: string;
  stepperConfirm: string;
  
  // Analysis Report & Service Selection
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
  aiRecommendsTitle: string;
  recommendedBadge: string;
  liveAdviceTitle: string;
  liveAdviceDescription: string;
  liveAdviceButton: string;
  sosCleanTitle: string;
  sosCleanDescription: (percent: number) => string;
  finalPrice: string;
  aiRiskScore: string;
  riskScoreDescription: (score: number) => string;
  expertSummaryTitle: string;
  areaLabel: string;
  observationLabel: string;
  recommendationLabel: string;

  // Confirmation/Scheduling Step
  confirmationTitle: string;
  confirmationDescription: (service: string, make: string, model: string) => string;
  chosenService: string;
  packageInclusions: string;
  changePackageButton: string;
  scheduleTitle: string;
  scheduleDateLabel: string;
  scheduleTimeLabel: string;
  requestBookingButton: string;
  requestingBooking: string;
  addressSectionTitle: string;
  pickupAddressLabel: string;
  deliveryAddressLabel: string;
  differentDeliveryAddressCheckbox: string;
  deliverySurchargeNotice: (amount: number) => string;
  basePriceLabel: string;
  deliverySurchargeLabel: string;
  totalPriceLabel: string;
  
  // Booking Requested Step
  bookingRequestedTitle: string;
  bookingRequestedDescription: (id: string) => string;
  trackYourBooking: string;
  
  // Loading & Error states
  analyzing: string;
  analyzingDescription: string;
  analysisFailed: string;
  startOver: string;
  errorAllFields: string;
  errorUnknown: string;
  errorSafety: string;
  
  // Admin View
  adminViewTitle: string;
  adminBookingsTab: string;
  adminPerformanceTab: string;
  adminAIAssistantTab: string;
  adminExportTab: string;
  bookingId: string;
  customerDetails: string;
  dateTime: string;
  logistics: string;
  travelTime: string;
  fuelCost: string;
  status: string;
  actions: string;
  confirmAction: string;
  status_PENDING: string;
  status_CONFIRMED: string;
  status_COMPLETED: string;
  status_CANCELLED: string;
  uploadAfterPhoto: string;
  employeePerformanceTitle: string;
  jobsCompleted: string;
  averageRating: string;
  totalRevenue: string;

  // AI Assistant Tab
  aiAssistantTitle: string;
  aiAssistantDescription: string;
  generateAnswer: string;
  generatingAnswer: string;
  copyAnswer: string;
  answerCopied: string;
  customerQuestion: string;
  aiGeneratedAnswer: string;

  // Export Tab
  exportTitle: string;
  exportDescription: string;
  exportBookingsButton: string;
  exportUsersButton: string;

  // Customer Dashboard
  customerDashboardTitle: string;
  bookingsTab: string;
  subscriptionsTab: string;
  claimTab: string;
  chatTab: string;
  yourBookings: string;
  bookNewService: string;
  noBookingsYet: string;
  requestedOn: string;
  service: string;
  viewDetails: string;
  hideDetails: string;
  technicianNotes: string;
  noTechnicianNotes: string;
  technicianNotesDescription: string;
  viewBeforeAfter: string;
  beforeAfterModalTitle: string;
  before: string;
  after: string;
  close: string;
  yourSubscriptions: string;
  noSubscriptions: string;
  pauseSubscription: string;
  resumeSubscription: string;
  paused: string;
  active: string;
  fileClaimTitle: string;
  claimDescription: string;
  bookingIdLabel: string;
  claimDetailsLabel: string;
  submitClaim: string;
  claimSubmitted: string;
  liveChatTitle: string;
  liveChatDescription: string;
  chatPlaceholder: string;
  send: string;

  // Super Admin View
  superAdminTitle: string;
  managePackages: string;
  dynamicPricingTitle: string;
  surgeMultiplierLabel: string;
  setMultiplier: string;
  noPackages: string;
  createPackageTitle: string;
  createPackagePrompt: string;
  createPackagePlaceholder: string;
  generatePackage: string;
  generatingPackage: string;
  reviewAndSave: string;
  packageNameLabel: string;
  priceLabel: string;
  featuresLabel: string;
  addFeature: string;
  savePackage: string;
  savingPackage: string;
  deletePackage: string;
  editPackage: string;
  cancel: string;
  confirmDeleteTitle: string;
  confirmDeleteDescription: (name: string) => string;
  aiError: string;
  translating: string;

  // Owner Access Modal
  ownerAccessTitle: string;
  ownerAccessDescription: string;
  ownerAccessCodeLabel: string;
  ownerAccessSubmit: string;
  ownerAccessError: string;

  // Technician View
  technicianViewTitle: string;
  assignedJobs: string;
  noAssignedJobs: string;
  reportDamage: string;
  reportDamageTitle: string;
  newScratch: string;
  newDent: string;
  otherNote: string;
  submitReport: string;
  damageReported: string;

  // Email Confirmation
  emailSubject_bookingRequest: string;
  emailGreeting: (name: string) => string;
  emailBody_bookingRequest: (id: string) => string;
  emailSalutation: string;

  // Source Code Modal
  sourceCodeModalTitle: string;
  sourceCodeDescription: string;
  copyCode: string;
  codeCopied: string;
}`,
  "services/geminiService.ts": `import { GoogleGenAI } from "@google/genai";
import { DamageReport, ServicePackage, ServiceDetails, Locale, Issue } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

const localeToLanguageName = (locale: Locale): string => {
    switch (locale) {
        case 'nl': return 'Dutch';
        case 'fr': return 'French';
        case 'en':
        default: return 'English';
    }
};

export const analyzeVehicleImage = async (
  exteriorImageBase64: string,
  interiorImageBase64: string,
  licensePlate: string,
  servicePackages: ServicePackage[],
  locale: Locale
): Promise<DamageReport> => {
  const model = 'gemini-2.5-flash-preview-04-17';

  const suggestionKeys = servicePackages.map(p => p.key);
  const languageName = localeToLanguageName(locale);

  const prompt = \`
    You are an expert car detailer and sales assistant. Analyze the two provided images of a vehicle with license plate \${licensePlate}. Image 1 is the EXTERIOR, Image 2 is the INTERIOR.
    Your task is to provide a detailed analysis in JSON format. The JSON object MUST strictly follow this structure:
    {
      "make": "string",
      "model": "string",
      "color": "string",
      "persuasiveSummary": "string (A friendly, expert summary for the customer, linking the observations to the benefits of the recommended service. Max 2-3 sentences.)",
      "exteriorIssues": [
        {
          "area": "string (e.g., 'Driver side door', 'Front bumper')",
          "observation": "string (e.g., 'Noticeable road tar and bug splatter')",
          "recommendation": "string (e.g., 'Requires chemical decontamination')"
        }
      ],
      "interiorIssues": [
        {
          "area": "string (e.g., 'Driver\\'s seat', 'Center console')",
          "observation": "string (e.g., 'Light dust and fingerprints')",
          "recommendation": "string (e.g., 'Suggests interior wipe-down and protection')"
        }
      ],
      "bestSuggestionKey": "string (use ONE of the allowed Suggestion Keys)",
      "riskScore": "number (a score from 1-100)"
    }

    ALLOWED SUGGESTION KEYS: \${JSON.stringify(suggestionKeys)}

    IMPORTANT: The entire response, including all strings within the JSON object (make, model, color, summary, all fields in issues), must be in \${languageName}.

    YOUR TASKS:
    1.  From the EXTERIOR image, identify the vehicle's make, model, and primary color.
    2.  Carefully inspect both images. For each specific issue you find, create an issue object and add it to the appropriate 'exteriorIssues' or 'interiorIssues' array. Be specific about the area. If an area is clean, do not add an issue for it.
    3.  Based on the overall condition, determine the single most appropriate service package and provide its key in 'bestSuggestionKey'.
    4.  Write the 'persuasiveSummary'. This is crucial. It should be customer-facing. For example: "The analysis of your vehicle shows some typical buildup on the exterior and minor signs of use inside. Our '\${suggestionKeys.length > 0 ? servicePackages.find(p => p.key === suggestionKeys[0])?.details['en'].name : 'recommended'}' package is perfectly suited to address these points, restoring the deep shine of the paintwork and refreshing the cabin for a like-new feel." (This example is in English, you must translate it and the full response to \${languageName}).
    5.  Calculate a 'riskScore' from 1 (low risk, clean, low-value car) to 100 (high risk, expensive car, severe damage). Consider the vehicle's perceived value (e.g., a Porsche is higher risk than a Toyota) and the severity/type of existing damages. A luxury car with deep scratches should have a very high score (e.g., 85-95). A clean economy car should have a very low score (e.g., 5-15).

    Return ONLY the raw JSON object, without any markdown formatting, comments, or explanations.
  \`;

  try {
    const textPart = { text: prompt };
    const exteriorImagePart = fileToGenerativePart(exteriorImageBase64, 'image/jpeg');
    const interiorImagePart = fileToGenerativePart(interiorImageBase64, 'image/jpeg');

    const result = await ai.models.generateContent({
      model: model,
      contents: { parts: [textPart, exteriorImagePart, interiorImagePart] },
      config: {
        responseMimeType: "application/json",
      },
    });

    let jsonStr = result.text.trim();
    const fenceRegex = /^\`\`\`(\\w*)?\\s*\\n?(.*?)\\n?\\s*\`\`\`\$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr) as DamageReport;

    if (!parsedData.make || !parsedData.model || !Array.isArray(parsedData.exteriorIssues) || !Array.isArray(parsedData.interiorIssues) || !parsedData.persuasiveSummary || !parsedData.bestSuggestionKey || typeof parsedData.riskScore !== 'number') {
        throw new Error("AI response is missing required fields or has an invalid structure.");
    }
    
    if (!suggestionKeys.includes(parsedData.bestSuggestionKey)) {
        console.warn(\`AI suggested a key '\${parsedData.bestSuggestionKey}' that is not in the allowed list. Defaulting to first available key.\`);
        parsedData.bestSuggestionKey = suggestionKeys[0] || '';
    }

    return parsedData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('SAFETY')) {
        throw new Error("errorSafety");
    }
    throw new Error("Failed to analyze vehicle image. The AI model may be temporarily unavailable or the response was invalid.");
  }
};


export const generateServicePackageFromPrompt = async (prompt: string): Promise<ServiceDetails> => {
    const model = 'gemini-2.5-flash-preview-04-17';
    const generationPrompt = \`
      You are a service package creator for a car detailing web app. Based on the user's prompt, create a JSON object for a single service package. The JSON MUST strictly follow this structure:
      {
        "name": "string (the package name in English)",
        "price": "number (the price in euros, as a number, not a string)",
        "features": ["string", "string", ...] (a list of key features in English)
      }
      User Prompt: "\${prompt}"

      IMPORTANT: Extract the name, price, and features from the prompt. Provide ONLY the raw JSON object. Do not add any markdown, comments, or explanations. If the prompt is unclear, create a sensible default package based on the words you can understand.
    \`;

    try {
        const result = await ai.models.generateContent({
            model: model,
            contents: generationPrompt,
            config: {
                responseMimeType: "application/json",
            },
        });
        
        let jsonStr = result.text.trim();
        const fenceRegex = /^\`\`\`(\\w*)?\\s*\\n?(.*?)\\n?\\s*\`\`\`\$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }
        const parsedData = JSON.parse(jsonStr) as ServiceDetails;

        if (!parsedData.name || typeof parsedData.price !== 'number' || !Array.isArray(parsedData.features)) {
            throw new Error("AI response for package generation is missing required fields or has an invalid structure.");
        }

        return parsedData;

    } catch (error) {
        console.error("Error generating service package:", error);
        throw new Error("Failed to generate service package from prompt.");
    }
};

export const translateServiceDetails = async (details: ServiceDetails, targetLocale: Locale): Promise<ServiceDetails> => {
    if (targetLocale === 'en') return details;
    
    const localeMap = {
        'nl': 'Dutch',
        'fr': 'French'
    };

    const model = 'gemini-2.5-flash-preview-04-17';
    const translationPrompt = \`
      You are a translation assistant for a car detailing app. Translate the 'name' and each item in the 'features' array of the following JSON object into \${localeMap[targetLocale]}.
      Source JSON (English):
      \${JSON.stringify({ name: details.name, features: details.features })}

      Provide the translated data in a JSON object with the exact same structure as the source. Return ONLY the raw JSON object, without any markdown formatting.
    \`;

    try {
        const result = await ai.models.generateContent({
            model: model,
            contents: translationPrompt,
            config: {
                responseMimeType: "application/json",
            },
        });
        
        let jsonStr = result.text.trim();
        const fenceRegex = /^\`\`\`(\\w*)?\\s*\\n?(.*?)\\n?\\s*\`\`\`\$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }
        const parsedData = JSON.parse(jsonStr) as { name: string; features: string[] };

        if (!parsedData.name || !Array.isArray(parsedData.features)) {
            throw new Error(\`AI response for translation to \${targetLocale} is invalid.\`);
        }

        return {
            ...details,
            name: parsedData.name,
            features: parsedData.features,
        };

    } catch (error) {
        console.error(\`Error translating service details to \${targetLocale}:\`, error);
        throw new Error(\`Failed to translate service details to \${targetLocale}.\`);
    }
};

export const generateQueryAnswer = async (customerQuestion: string): Promise<string> => {
  const model = 'gemini-2.5-flash-preview-04-17';
  const systemInstruction = \`JOUW ROL:
Jij bent een behulpzame, efficiënte en tekst-gebaseerde assistent voor onze app Wash&go PRO. Je taak is om vragen en verzoeken van klanten te verwerken en te beantwoorden op basis van de reeds ingegeven kennis.

INVOER:
Je ontvangt altijd platte tekst. Deze tekst is een vraag of een verzoek van een klant, direct afkomstig uit een cel van een spreadsheet. Er worden GEEN bestanden, codeblokken, of speciale formaten gestuurd, alleen pure, onopgemaakte tekst.

TAAK:
1. Lees de klantvraag zorgvuldig.
2. Beantwoord de vraag of voer het verzoek uit op een duidelijke en beknopte manier.
3. Als de vraag om specifieke informatie vraagt (bijv. een prijs, een procedure, een datum), geef deze dan direct.
4. Als je meer informatie nodig hebt om een accuraat antwoord te geven, stel dan een specifieke vervolgvraag.

UITVOERFORMAAT:
Jouw antwoord moet ALTIJD platte tekst zijn.
**Geef GEEN omkadering zoals "--- START OF FILE ---", "--- END OF FILE ---", of andere markers.**
**Geef GEEN codeblokken, JSON, XML, Markdown-tabellen of andere gestructureerde formaten, tenzij de vraag hier expliciet om vraagt.**
Concentreer je alleen op het pure, directe antwoord dat past in één cel van een spreadsheet.
Het antwoord moet direct en klaar zijn voor de klant.

---

VOORBEELDEN:
(Dit deel is cruciaal! Geef hier minstens 2-3 voorbeelden die laten zien hoe de invoer eruitziet en wat voor antwoord je van de AI verwacht, precies in het formaat dat je wilt.)

**Voorbeeld 1:**
Gebruikersvraag: Ik wil een kleine beurt voor mijn auto. Wat zijn de kosten?
Antwoord: Een kleine beurt kost gemiddeld €120. Dit omvat olie verversen, filters controleren en vloeistoffen bijvullen.

**Voorbeeld 2:**
Gebruikersvraag: Wat is de snelste manier om een auto te laten reinigen?
Antwoord: De snelste manier is onze express buitenreiniging, die ongeveer 30 minuten duurt.

**Voorbeeld 3:**
Gebruikersvraag: Wat zijn de openingstijden op zaterdag?
Antwoord: Op zaterdag zijn we geopend van 09:00 tot 17:00 uur.\`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: customerQuestion,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for query answer:", error);
    throw new Error("Failed to generate answer. The AI model may be unavailable.");
  }
};`,
  "components/common/Header.tsx": `import React from 'react';
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
}`,
  "components/common/Icons.tsx": `import React from 'react';

type IconProps = {
  className?: string;
  strokeWidth?: string | number;
};

export const CarIcon = ({ className = 'w-7 h-7', strokeWidth = 2 }: IconProps): React.ReactNode => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M5 12C5 11.4477 5.44772 11 6 11H18C18.5523 11 19 11.4477 19 12V17H5V12Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.5 17V19" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16.5 17V19" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 11L8 7H16L18 11" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 7H5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"/>
    </svg>
);


export const GiftIcon = ({ className = 'w-6 h-6', strokeWidth = 2 }: IconProps): React.ReactNode => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth={strokeWidth}/>
        <path d="M12 20V10" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 10C10.3431 10 9 8.65685 9 7C9 5.34315 10.3431 4 12 4" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 10C13.6569 10 15 8.65685 15 7C15 5.34315 13.6569 4 12 4" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"/>
    </svg>
);

export const InteriorIcon = ({ className = 'w-7 h-7', strokeWidth = 2 }: IconProps): React.ReactNode => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M15 13C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13C9 11.3431 10.3431 10 12 10C13.6569 10 15 11.3431 15 13Z" stroke="currentColor" strokeWidth={strokeWidth} className="text-brand-accent"/>
        <path d="M4 17V7C4 5.89543 4.89543 5 6 5H18C19.1046 5 20 5.89543 20 7V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17Z" stroke="currentColor" strokeWidth={strokeWidth}/>
    </svg>
);


export const UploadIcon = ({ className = 'w-8 h-8', strokeWidth = 2 }: IconProps): React.ReactNode => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 15V4" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 8L12 4L16 8" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"/>
        <path d="M20 14V19C20 19.5523 19.5523 20 19 20H5C4.44772 20 4 19.5523 4 19V14" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


export const AlertTriangleIcon = ({ className = 'w-7 h-7', strokeWidth = 2 }: IconProps): React.ReactNode => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M2.14816 18.2194C1.72147 18.9103 2.21589 19.8334 3.01255 19.8334H20.9874C21.7841 19.8334 22.2785 18.9103 21.8518 18.2194L12.8644 4.25696C12.4497 3.58411 11.5503 3.58411 11.1356 4.25696L2.14816 18.2194Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round"/>
        <path d="M12 10V14" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"/>
        <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="currentColor" className="text-brand-accent" />
    </svg>
);

export const ArrowLeftIcon = ({ className = 'w-6 h-6', strokeWidth = 2.5 }: IconProps): React.ReactNode => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const ArrowRightIcon = ({ className = 'w-6 h-6', strokeWidth = 2.5 }: IconProps): React.ReactNode => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const ArrowDownIcon = ({ className = 'w-6 h-6', strokeWidth = 2.5 }: IconProps): React.ReactNode => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const CheckCircleIcon = ({ className = 'w-7 h-7', strokeWidth = 2 }: IconProps): React.ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"/>
  </svg>
);

export const CheckIcon = ({ className = 'w-6 h-6', strokeWidth = 2.5 }: IconProps): React.ReactNode => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const ClipboardListIcon = ({ className = 'w-7 h-7', strokeWidth = 2 }: IconProps): React.ReactNode => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 12h6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"/>
        <path d="M9 16h6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"/>
    </svg>
);

export const SparklesIcon = ({ className = 'w-7 h-7', strokeWidth = 2 }: IconProps): React.ReactNode => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 2L14.09 7.91L20 10L14.09 12.09L12 18L9.91 12.09L4 10L9.91 7.91L12 2Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M18 6L17.2 8.8L15 9.6L17.2 10.4L18 13L18.8 10.4L21 9.6L18.8 8.8L18 6Z" stroke="currentColor" strokeWidth={strokeWidth} className="text-brand-accent"/>
        <path d="M6 18L6.8 15.2L9 14.4L6.8 13.6L6 11L5.2 13.6L3 14.4L5.2 15.2L6 18Z" stroke="currentColor" strokeWidth={strokeWidth} className="text-brand-accent"/>
    </svg>
);

export const CalendarIcon = ({ className = 'w-6 h-6', strokeWidth = 2 }: IconProps): React.ReactNode => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="5" y="6" width="14" height="14" rx="2" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 4V8" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 4V8" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 10H19" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const UserIcon = ({ className = 'w-6 h-6', strokeWidth = 2 }: IconProps): React.ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"/>
  </svg>
);

export const MailIcon = ({ className = 'w-6 h-6', strokeWidth = 2 }: IconProps): React.ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 7.00005C4 6.44776 4.44772 6.00005 5 6.00005H19C19.5523 6.00005 20 6.44776 20 7.00005V17C20 17.5523 19.5523 18 19 18H5C4.44772 18 4 17.5523 4 17V7.00005Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 7L12 12.5L20 7" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"/>
  </svg>
);

export const LockIcon = ({ className = 'w-6 h-6', strokeWidth = 2 }: IconProps): React.ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="11" width="16" height="10" rx="2" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"/>
  </svg>
);

export const LogOutIcon = ({ className = 'w-6 h-6', strokeWidth = 2 }: IconProps): React.ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M15 3H19C19.5523 3 20 3.44772 20 4V20C20 20.5523 19.5523 21 19 21H15" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"/>
    <path d="M15 12H3" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const HomeIcon = ({ className = 'w-6 h-6', strokeWidth = 2 }: IconProps): React.ReactNode => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 21V12H15V21" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"/>
    </svg>
);

export const PhoneIcon = ({ className = 'w-6 h-6', strokeWidth = 2 }: IconProps): React.ReactNode => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M18.8572 14.6143C18.8572 15.7618 18.3986 16.8523 17.5756 17.6753C16.7112 18.5411 15.5418 19.0526 14.2858 19.0526C11.6669 19.0526 9.15578 18.0645 7.23893 16.1477C5.32208 14.2308 4.33398 11.7197 4.33398 9.1008C4.33398 7.84481 4.8455 6.67544 5.71129 5.81105C6.53428 4.98806 7.62477 4.52942 8.77227 4.52942C9.11529 4.52942 9.4511 4.59599 9.76282 4.72496L11.5361 5.48538C12.062 5.70059 12.4414 6.16246 12.5578 6.71184L13.1164 9.48967C13.2503 10.1173 12.9774 10.7681 12.4831 11.1685L11.1558 12.2471C12.0298 14.0084 13.3773 15.3559 15.1386 16.2299L16.2172 14.9026C16.6176 14.4083 17.2684 14.1354 17.8961 14.2693L20.6739 14.8279C21.2233 14.9443 21.6852 15.3237 21.9004 15.8496L22.6608 17.6229C22.7898 17.9346 22.8563 18.2704 22.8563 18.6134L18.8572 14.6143Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const CurrencyEuroIcon = ({ className = 'w-6 h-6', strokeWidth = 2 }: IconProps): React.ReactNode => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M18.364 7.63604C16.5134 5.78541 14.1166 4.66663 11.5 4.66663C6.82117 4.66663 3 8.4878 3 13.1666C3 17.8454 6.82117 21.6666 11.5 21.6666C14.1166 21.6666 16.5134 20.5478 18.364 18.6972" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 10.3333H8" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"/>
        <path d="M4 16H8" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"/>
    </svg>
);

export const StarIcon = ({ className = 'w-6 h-6', strokeWidth = 2 }: IconProps): React.ReactNode => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const CameraIcon = ({ className = 'w-6 h-6', strokeWidth = 2 }: IconProps): React.ReactNode => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"/>
    </svg>
);

export const ShieldCheckIcon = ({ className = 'w-6 h-6', strokeWidth = 2 }: IconProps): React.ReactNode => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"/>
    </svg>
);

export const MessageSquareIcon = ({ className = 'w-6 h-6', strokeWidth = 2 }: IconProps): React.ReactNode => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const PaperclipIcon = ({ className = 'w-6 h-6', strokeWidth = 2 }: IconProps): React.ReactNode => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const CopyIcon = ({ className = 'w-6 h-6', strokeWidth = 2 }: IconProps): React.ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" className="text-brand-accent"/>
  </svg>
);

export const DownloadIcon = ({ className = 'w-6 h-6', strokeWidth = 2 }: IconProps): React.ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className="text-brand-accent"/>
    <path d="M12 15V3" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const XIcon = ({ className = 'w-6 h-6', strokeWidth = 2.5 }: IconProps): React.ReactNode => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M18 6L6 18" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M6 6L18 18" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);`,
  "components/common/Spinner.tsx": `import React from 'react';

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
};

export function Spinner({ size = 'md', text, className='' }: SpinnerProps): React.ReactNode {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={\`flex flex-col items-center justify-center gap-4 \${className}\`}>
      <div
        className={\`\${sizeClasses[size]} animate-spin rounded-full border-4 border-brand-slate/30 border-t-brand-accent\`}
        role="status"
      >
        <span className="sr-only">{text || 'Loading...'}</span>
      </div>
      {text && <p className="text-brand-light animate-pulse font-medium">{text}</p>}
    </div>
  );
}`,
  "components/VehicleStep.tsx": `import React, { useState } from 'react';
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
}`,
  "components/ImageUploadStep.tsx": `import React, { useState, useRef } from 'react';
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
                backgroundImage: \`url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23D4AF37' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")\`
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
                alt={\`\${type} preview\`}
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
}`,
  "components/AnalysisReport.tsx": `import React, { useState } from 'react';
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
          className={\`relative block p-4 sm:p-5 rounded-xl border-2 bg-brand-dark cursor-pointer transition-all duration-300 transform hover:-translate-y-1 shadow-neumorphic-outer active:shadow-neumorphic-inner \${borderClass}\`}
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
                            href={\`tel:\${CONTACT_PHONE_NUMBER}\`}
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
}`,
  "config.ts": `// config.ts

/**
 * The cash discount amount to be offered to new users on their first service.
 * This value is displayed in the promotional banner.
 */
export const PROMOTIONAL_DISCOUNT_CASH_AMOUNT: number = 10;

/**
 * The phone number for customers to call for live advice.
 * Used in the "Call for Live Advice" button.
 */
export const CONTACT_PHONE_NUMBER: string = '+15551234567'; // Placeholder number

/**
 * The company's address, used as the starting point for travel time calculations.
 */
export const COMPANY_ADDRESS: string = 'Kerkstraat 10, 9050 Gent, Belgium';

/**
 * The surcharge applied when the delivery address is different from the pickup address.
 */
export const DELIVERY_SURCHARGE: number = 20;`,
  "translations.ts": `// translations.ts
import { AppTranslations } from './types';
import { DELIVERY_SURCHARGE } from './config';

export const translations: { nl: AppTranslations, en: AppTranslations, fr: AppTranslations } = {
  nl: {
    // --- AUTH & LOGIN ---
    loginTitle: 'Welkom terug',
    loginTab: 'Inloggen',
    registerTab: 'Registreren',
    emailLabel: 'E-mailadres',
    passwordLabel: 'Wachtwoord',
    loginButton: 'Inloggen',
    orContinueAs: 'Of ga verder als',
    guestButton: 'Gast',
    logoutButton: 'Uitloggen',
    firstNameLabel: 'Voornaam',
    lastNameLabel: 'Achternaam',
    addressLabel: 'Adres',
    phoneLabel: 'Telefoonnummer',
    registerButton: 'Registreren',
    registering: 'Registreren...',
    welcomeBack: (name: string) => \`Welkom terug, \${name}!\`,
    loginError: 'Ongeldige e-mail of wachtwoord.',
    registrationError: 'Een gebruiker met dit e-mailadres bestaat al.',

    // Popup
    languagePopupTitle: 'Welkom bij Wash&Go Pro',
    languagePopupDescription: 'Selecteer uw taal om door te gaan.',
    consentCheckboxLabel: 'Ik ga akkoord met de <a href="#" class="font-medium underline text-brand-accent/80 hover:text-brand-accent">Gebruiksvoorwaarden</a>.',
    confirmButton: 'Bevestig',
    
    // Header & Footer
    headerTitle: 'Wash&Go Pro',
    promoBanner: (amount: number) => \`Exclusieve aanbieding! Ontvang €\${amount} korting op uw eerste service.\`,
    footerText: 'Mogelijk gemaakt door Wash&Go Pro. Alleen voor demonstratiedoeleinden.',

    // Home Screen (VehicleStep)
    homeTitle: 'Uw Auto, Perfect Schoon',
    homeDescription: 'Voer uw kenteken in voor een directe, AI-gestuurde analyse en serviceaanbeveling.',
    howItWorksTitle: 'Hoe het Werkt',
    homeStep1Title: '1. Foto & Analyse',
    homeStep1Desc: 'Voer uw kenteken in en upload foto\\'s. Onze AI analyseert direct de staat van uw auto.',
    homeStep2Title: '2. Controleer & Boek',
    homeStep2Desc: 'Bekijk ons aanbevolen pakket en plan een service wanneer het u uitkomt.',
    homeStep3Title: '3. Wij Komen Naar U Toe',
    homeStep3Desc: 'Onze deskundige technici komen op tijd om uw voertuig te laten stralen.',
    featuredServicesTitle: 'Onze Populaire Services',

    // General
    continue: 'Doorgaan',
    back: 'Terug',
    loading: 'Laden...',
        
    // Image Upload Step (Step 1)
    step1Title: 'Visuele Check',
    step1Description: 'Voer uw kenteken in en upload foto\\'s van de buiten- en binnenkant om de analyse te starten.',
    licensePlateLabel: 'Kenteken',
    licensePlatePlaceholder: '1-ABC-123',
    exteriorPhoto: 'Exterieur',
    interiorPhoto: 'Interieur',
    exteriorDescription: 'Een duidelijk zicht op de zijkant van het voertuig.',
    interiorDescription: 'Een overzicht van het dashboard en de voorstoelen.',
    arGuidance: 'Lijn uw voertuig uit met het silhouet.',
    clickOrDrag: 'Klik of sleep een foto hierheen',
    change: 'Wijzig',
    startAnalysis: 'Start Analyse',
    
    // Image Uploader Errors
    fileSizeError: 'Bestandsgrootte moet minder dan 4MB zijn.',
    fileTypeError: 'Ongeldig bestandstype. Upload een JPG, PNG, of WEBP.',
    
    // Stepper
    stepperInspection: 'Visuele Check',
    stepperReport: 'Rapport & Service',
    stepperConfirm: 'Plannen & Bevestigen',

    // Analysis Report & Service Selection (Step 2)
    analysisReportTitle: 'Uw Gepersonaliseerd Rapport',
    analysisCompleteFor: (make: string, model: string) => \`Analyse voltooid voor de \${make} \${model}.\`,
    vehicleDetails: 'Voertuigdetails',
    make: 'Merk',
    model: 'Model',
    color: 'Kleur',
    detectedDamages: 'Gedetailleerde Analyse',
    noExteriorDamages: 'Geen specifieke aandachtspunten voor het exterieur gevonden.',
    noInteriorDamages: 'Geen specifieke aandachtspunten voor het interieur gevonden.',
    noSuggestions: 'Geen specifieke services voorgesteld.',
    confirmService: 'Accepteer & Ga Verder',
    aiRecommendsTitle: 'Onze technische analyse beveelt aan',
    recommendedBadge: 'Aanbevolen',
    liveAdviceTitle: 'Hulp Nodig?',
    liveAdviceDescription: 'Ons team staat klaar om u te helpen de perfecte service te vinden.',
    liveAdviceButton: 'Bel voor Live Advies',
    sosCleanTitle: 'SOS Schoonmaak (Spoed)',
    sosCleanDescription: (percent: number) => \`Voor een toeslag van \${percent}% behandelen we uw aanvraag met voorrang.\`,
    finalPrice: 'Uiteindelijke Prijs',
    aiRiskScore: 'Wash&Go analyse',
    riskScoreDescription: (score: number) => \`Analyse op basis van de staat van het voertuig. Score: \${score}/100.\`,
    expertSummaryTitle: 'Samenvatting van de Expert',
    areaLabel: 'Locatie',
    observationLabel: 'Observatie',
    recommendationLabel: 'Aanbeveling',

    // Confirmation/Scheduling Step (Step 3)
    confirmationTitle: "Service & Planning",
    confirmationDescription: (service: string, make: string, model: string) => \`U heeft de service '\${service}' geselecteerd voor uw \${make} \${model}. Plan hieronder uw afspraak.\`,
    chosenService: "Gekozen Service",
    packageInclusions: "Inbegrepen in Pakket",
    changePackageButton: "Pakket wijzigen",
    scheduleTitle: 'Kies een gewenst tijdstip',
    scheduleDateLabel: 'Datum',
    scheduleTimeLabel: 'Tijd',
    requestBookingButton: 'Boeking Aanvragen',
    requestingBooking: 'Boeking aanvragen...',
    addressSectionTitle: 'Ophaal- & Afleveradres',
    pickupAddressLabel: 'Ophaaladres',
    deliveryAddressLabel: 'Afleveradres',
    differentDeliveryAddressCheckbox: 'Op een ander adres afleveren?',
    deliverySurchargeNotice: (amount: number) => \`Een meerkost van €\${amount} is van toepassing voor een andere afleverlocatie.\`,
    basePriceLabel: 'Basisprijs',
    deliverySurchargeLabel: 'Leveringstoeslag',
    totalPriceLabel: 'Totaalprijs',

    // Booking Requested
    bookingRequestedTitle: 'Boekingsaanvraag verzonden!',
    bookingRequestedDescription: (id: string) => \`Uw aanvraag (ID: \${id}) is succesvol ontvangen. U ontvangt een bevestigingsmail.\`,
    trackYourBooking: 'Volg uw Boeking',

    // Loading & Error states
    analyzing: 'Analyse van uw voertuig...',
    analyzingDescription: 'Onze technologie inspecteert de beelden.',
    analysisFailed: 'Analyse Mislukt',
    startOver: 'Begin Opnieuw',
    errorAllFields: 'Vul alstublieft alle velden in en upload beide foto\\'s.',
    errorUnknown: 'Er is een onbekende fout opgetreden.',
    errorSafety: "De afbeelding kon niet worden verwerkt vanwege ons veiligheidsbeleid.",
    aiError: 'AI kon de opdracht niet verwerken.',
    translating: 'Pakketdetails vertalen...',
    
    // Admin View
    adminViewTitle: 'Admin Dashboard',
    adminBookingsTab: 'Boekingen',
    adminPerformanceTab: 'Prestaties',
    adminAIAssistantTab: 'AI Assistent',
    adminExportTab: 'Exporteren',
    bookingId: 'Boeking ID',
    customerDetails: 'Klantgegevens',
    dateTime: 'Gevraagde Datum/Tijd',
    logistics: 'Logistiek',
    travelTime: 'Reistijd',
    fuelCost: 'Brandstofkosten',
    status: 'Status',
    actions: 'Acties',
    confirmAction: 'Bevestig',
    status_PENDING: 'In afwachting',
    status_CONFIRMED: 'Bevestigd',
    status_COMPLETED: 'Voltooid',
    status_CANCELLED: 'Geannuleerd',
    uploadAfterPhoto: 'Upload "Na" Foto',
    employeePerformanceTitle: 'Werknemersprestaties (Q3)',
    jobsCompleted: 'Voltooide Klussen',
    averageRating: 'Gemiddelde Beoordeling',
    totalRevenue: 'Totale Omzet',

    // AI Assistant Tab
    aiAssistantTitle: 'AI Assistent voor Klantvragen',
    aiAssistantDescription: 'Genereer antwoorden voor vragen die binnenkomen via externe kanalen zoals een Google Sheet.',
    generateAnswer: 'Genereer Antwoord',
    generatingAnswer: 'Bezig met genereren...',
    copyAnswer: 'Kopieer',
    answerCopied: 'Gekopieerd!',
    customerQuestion: 'Vraag van Klant',
    aiGeneratedAnswer: 'AI Gegenereerd Antwoord',

    // Export Tab
    exportTitle: 'Exporteer Applicatiegegevens',
    exportDescription: 'Download data in CSV-formaat, klaar voor gebruik in Google Sheets of andere spreadsheetsoftware.',
    exportBookingsButton: 'Exporteer Boekingen (CSV)',
    exportUsersButton: 'Exporteer Gebruikers (CSV)',
    
    // Customer Dashboard
    customerDashboardTitle: 'Mijn Dashboard',
    bookingsTab: 'Mijn Boekingen',
    subscriptionsTab: 'Abonnementen',
    claimTab: 'Claim Indienen',
    chatTab: 'Live Chat',
    yourBookings: 'Uw Boekingen',
    bookNewService: 'Nieuwe Service Boeken',
    noBookingsYet: 'U heeft nog geen boekingen.',
    requestedOn: 'Aangevraagd op',
    service: 'Service',
    viewDetails: 'Details bekijken',
    hideDetails: 'Details verbergen',
    technicianNotes: 'Notities van de Technicus',
    noTechnicianNotes: 'Geen notities voor deze boeking.',
    technicianNotesDescription: 'Aanbevelingen van onze expert voor uw volgende bezoek om uw auto in topconditie te houden.',
    viewBeforeAfter: 'Bekijk Voor/Na',
    beforeAfterModalTitle: 'Voor & Na Resultaat',
    before: 'Voor',
    after: 'Na',
    close: 'Sluiten',
    yourSubscriptions: 'Uw Abonnementen',
    noSubscriptions: 'U heeft geen actieve abonnementen.',
    pauseSubscription: 'Pauzeren',
    resumeSubscription: 'Hervatten',
    paused: 'Gepauzeerd',
    active: 'Actief',
    fileClaimTitle: 'Dien een Schadeclaim in',
    claimDescription: 'Heeft u een probleem met een recente service? Laat het ons weten.',
    bookingIdLabel: 'Relevante Boeking ID',
    claimDetailsLabel: 'Beschrijf uw claim',
    submitClaim: 'Claim Indienen',
    claimSubmitted: 'Uw claim is verzonden.',
    liveChatTitle: 'Live Chat met Support',
    liveChatDescription: 'Heeft u een vraag? Ons supportteam staat voor u klaar om u in real-time te helpen.',
    chatPlaceholder: 'Typ uw bericht...',
    send: 'Verstuur',

    // Super Admin View
    superAdminTitle: 'Super Admin - Beheer',
    managePackages: 'Beheer Servicepakketten',
    dynamicPricingTitle: 'Dynamische Prijzen',
    surgeMultiplierLabel: 'Prijstoeslag (bv. 1.2 voor 20% toeslag)',
    setMultiplier: 'Instellen',
    noPackages: 'Er zijn nog geen servicepakketten.',
    createPackageTitle: 'Creëer Nieuw Pakket met AI',
    createPackagePrompt: 'Beschrijf het pakket',
    createPackagePlaceholder: "bv. 'Basis exterieurpakket voor €39 met handwas.'",
    generatePackage: 'Genereer Pakket',
    generatingPackage: 'Pakket genereren...',
    reviewAndSave: 'Controleren en Opslaan',
    packageNameLabel: 'Pakketnaam',
    priceLabel: 'Prijs (€)',
    featuresLabel: 'Kenmerken',
    addFeature: 'Kenmerk toevoegen',
    savePackage: 'Pakket Opslaan',
    savingPackage: 'Pakket opslaan...',
    deletePackage: 'Verwijder',
    editPackage: 'Bewerk',
    cancel: 'Annuleren',
    confirmDeleteTitle: 'Pakket Verwijderen',
    confirmDeleteDescription: (name: string) => \`Weet u zeker dat u het pakket '\${name}' wilt verwijderen?\`,
    
    // Owner Access Modal
    ownerAccessTitle: 'Toegang voor Eigenaar',
    ownerAccessDescription: 'Voer de speciale toegangscode in.',
    ownerAccessCodeLabel: 'Toegangscode',
    ownerAccessSubmit: 'Toegang Verlenen',
    ownerAccessError: 'Ongeldige toegangscode.',

    // Technician View
    technicianViewTitle: 'Technicus Dashboard',
    assignedJobs: 'Toegewezen Klussen',
    noAssignedJobs: 'Geen toegewezen klussen.',
    reportDamage: 'Schade Melden',
    reportDamageTitle: 'Meld Nieuwe Schade',
    newScratch: 'Nieuwe kras opgemerkt',
    newDent: 'Nieuwe deuk opgemerkt',
    otherNote: 'Andere opmerking',
    submitReport: 'Rapport Indienen',
    damageReported: 'Schade succesvol gemeld.',

    // Email Confirmation
    emailSubject_bookingRequest: 'Uw Wash&Go Pro Boekingsaanvraag is Ontvangen',
    emailGreeting: (name: string) => \`Beste \${name},\`,
    emailBody_bookingRequest: (id: string) => \`Bedankt voor uw aanvraag bij Wash&Go Pro. We hebben uw verzoek met ID \${id} in goede orde ontvangen. Ons team zal dit zo snel mogelijk bekijken en u ontvangt een bevestiging zodra uw afspraak is ingepland.\`,
    emailSalutation: 'Met vriendelijke groet,\\nHet Wash&Go Pro Team',

    // Source Code Modal
    sourceCodeModalTitle: 'Broncode van de Applicatie',
    sourceCodeDescription: 'Kopieer de inhoud van elk bestand om het project lokaal op te zetten of op een platform zoals GitHub te plaatsen.',
    copyCode: 'Kopieer Code',
    codeCopied: 'Gekopieerd!',
  },
  en: {
    // --- AUTH & LOGIN ---
    loginTitle: 'Welcome Back',
    loginTab: 'Login',
    registerTab: 'Register',
    emailLabel: 'Email Address',
    passwordLabel: 'Password',
    loginButton: 'Login',
    orContinueAs: 'Or continue as',
    guestButton: 'Guest',
    logoutButton: 'Logout',
    firstNameLabel: 'First Name',
    lastNameLabel: 'Last Name',
    addressLabel: 'Address',
    phoneLabel: 'Phone Number',
    registerButton: 'Register',
    registering: 'Registering...',
    welcomeBack: (name: string) => \`Welcome back, \${name}!\`,
    loginError: 'Invalid email or password.',
    registrationError: 'A user with this email already exists.',

    // Popup
    languagePopupTitle: 'Welcome to Wash&Go Pro',
    languagePopupDescription: 'Please select your language to continue.',
    consentCheckboxLabel: 'I agree to the <a href="#" class="font-medium underline text-brand-accent/80 hover:text-brand-accent">Terms of Service</a>.',
    confirmButton: 'Confirm',
    
    // Header & Footer
    headerTitle: 'Wash&Go Pro',
    promoBanner: (amount: number) => \`Exclusive Offer! Get €\${amount} off your first service.\`,
    footerText: 'Powered by Wash&Go Pro. For demonstration purposes only.',

    // Home Screen (VehicleStep)
    homeTitle: 'Your Car, Perfectly Clean',
    homeDescription: 'Enter your license plate for an instant, AI-powered analysis and service recommendation.',
    howItWorksTitle: 'How It Works',
    homeStep1Title: '1. Photo & Analysis',
    homeStep1Desc: 'Enter your license plate and upload photos. Our AI instantly analyzes your car\\'s condition.',
    homeStep2Title: '2. Review & Book',
    homeStep2Desc: 'Review our recommended package and schedule a service at your convenience.',
    homeStep3Title: '3. We Come To You',
    homeStep3Desc: 'Our expert technicians arrive on time to make your vehicle shine.',
    featuredServicesTitle: 'Our Popular Services',
    
    // General
    continue: 'Continue',
    back: 'Back',
    loading: 'Loading...',

    // Image Upload Step (Step 1)
    step1Title: 'Visual Check',
    step1Description: 'Enter your license plate and upload photos of the exterior and interior to start the analysis.',
    licensePlateLabel: 'License Plate',
    licensePlatePlaceholder: '1-ABC-123',
    exteriorPhoto: 'Exterior',
    interiorPhoto: 'Interior',
    exteriorDescription: 'A clear side view of the vehicle.',
    interiorDescription: 'An overview of the dashboard and front seats.',
    arGuidance: 'Align your vehicle with the silhouette.',
    clickOrDrag: 'Click or drag a photo here',
    change: 'Change',
    startAnalysis: 'Start Analysis',

    // Image Uploader Errors
    fileSizeError: 'File size must be less than 4MB.',
    fileTypeError: 'Invalid file type. Please upload a JPG, PNG, or WEBP.',
    
    // Stepper
    stepperInspection: 'Visual Check',
    stepperReport: 'Report & Service',
    stepperConfirm: 'Schedule & Confirm',

    // Analysis Report & Service Selection (Step 2)
    analysisReportTitle: 'Your Personalized Report',
    analysisCompleteFor: (make: string, model: string) => \`Analysis complete for the \${make} \${model}.\`,
    vehicleDetails: 'Vehicle Details',
    make: 'Make',
    model: 'Model',
    color: 'Color',
    detectedDamages: 'Detailed Analysis',
    noExteriorDamages: 'No specific points of attention found for the exterior.',
    noInteriorDamages: 'No specific points of attention found for the interior.',
    noSuggestions: 'No specific services suggested.',
    confirmService: 'Accept & Continue',
    aiRecommendsTitle: 'Our technical analysis recommends',
    recommendedBadge: 'Recommended',
    liveAdviceTitle: 'Need Help?',
    liveAdviceDescription: 'Our team is ready to help you find the perfect service.',
    liveAdviceButton: 'Call for Live Advice',
    sosCleanTitle: 'SOS Clean (Urgent)',
    sosCleanDescription: (percent: number) => \`For a \${percent}% surcharge, we will prioritize your request.\`,
    finalPrice: 'Final Price',
    aiRiskScore: 'Wash&Go Analysis',
    riskScoreDescription: (score: number) => \`Analysis based on vehicle condition. Score: \${score}/100.\`,
    expertSummaryTitle: 'Expert Summary',
    areaLabel: 'Area',
    observationLabel: 'Observation',
    recommendationLabel: 'Recommendation',

    // Confirmation/Scheduling Step (Step 3)
    confirmationTitle: 'Service & Scheduling',
    confirmationDescription: (service: string, make: string, model: string) => \`You have selected the '\${service}' service for your \${make} \${model}. Please schedule your appointment below.\`,
    chosenService: 'Chosen Service',
    packageInclusions: "Package Inclusions",
    changePackageButton: 'Change Package',
    scheduleTitle: 'Choose a desired time slot',
    scheduleDateLabel: 'Date',
    scheduleTimeLabel: 'Time',
    requestBookingButton: 'Request Booking',
    requestingBooking: 'Requesting booking...',
    addressSectionTitle: 'Pickup & Delivery Address',
    pickupAddressLabel: 'Pickup Address',
    deliveryAddressLabel: 'Delivery Address',
    differentDeliveryAddressCheckbox: 'Deliver to a different address?',
    deliverySurchargeNotice: (amount: number) => \`A surcharge of €\${amount} applies for a different delivery location.\`,
    basePriceLabel: 'Base Price',
    deliverySurchargeLabel: 'Delivery Surcharge',
    totalPriceLabel: 'Total Price',
    
    // Booking Requested
    bookingRequestedTitle: 'Booking Request Sent!',
    bookingRequestedDescription: (id: string) => \`Your request (ID: \${id}) has been successfully received. You will receive a confirmation email.\`,
    trackYourBooking: 'Track Your Booking',
    
    // Loading & Error states
    analyzing: 'Analyzing your vehicle...',
    analyzingDescription: 'Our technology is inspecting the images.',
    analysisFailed: 'Analysis Failed',
    startOver: 'Start Over',
    errorAllFields: 'Please fill in all fields and upload both photos.',
    errorUnknown: 'An unknown error occurred.',
    errorSafety: "The image could not be processed due to our safety policy.",
    aiError: 'AI could not process the request.',
    translating: 'Translating package details...',

    // Admin View
    adminViewTitle: 'Admin Dashboard',
    adminBookingsTab: 'Bookings',
    adminPerformanceTab: 'Performance',
    adminAIAssistantTab: 'AI Assistant',
    adminExportTab: 'Export',
    bookingId: 'Booking ID',
    customerDetails: 'Customer Details',
    dateTime: 'Requested Date/Time',
    logistics: 'Logistics',
    travelTime: 'Travel Time',
    fuelCost: 'Fuel Cost',
    status: 'Status',
    actions: 'Actions',
    confirmAction: 'Confirm',
    status_PENDING: 'Pending',
    status_CONFIRMED: 'Confirmed',
    status_COMPLETED: 'Completed',
    status_CANCELLED: 'Cancelled',
    uploadAfterPhoto: 'Upload After Photo',
    employeePerformanceTitle: 'Employee Performance (Q3)',
    jobsCompleted: 'Jobs Completed',
    averageRating: 'Average Rating',
    totalRevenue: 'Total Revenue',

    // AI Assistant Tab
    aiAssistantTitle: 'AI Assistant for Customer Queries',
    aiAssistantDescription: 'Generate answers for questions coming from external channels like a Google Sheet.',
    generateAnswer: 'Generate Answer',
    generatingAnswer: 'Generating...',
    copyAnswer: 'Copy',
    answerCopied: 'Copied!',
    customerQuestion: 'Customer Question',
    aiGeneratedAnswer: 'AI Generated Answer',

    // Export Tab
    exportTitle: 'Export Application Data',
    exportDescription: 'Download data in CSV format, ready for use in Google Sheets or other spreadsheet software.',
    exportBookingsButton: 'Export Bookings (CSV)',
    exportUsersButton: 'Export Users (CSV)',

    // Customer Dashboard
    customerDashboardTitle: 'My Dashboard',
    bookingsTab: 'My Bookings',
    subscriptionsTab: 'Subscriptions',
    claimTab: 'File a Claim',
    chatTab: 'Live Chat',
    yourBookings: 'Your Bookings',
    bookNewService: 'Book New Service',
    noBookingsYet: 'You have no bookings yet.',
    requestedOn: 'Requested On',
    service: 'Service',
    viewDetails: 'View Details',
    hideDetails: 'Hide Details',
    technicianNotes: 'Technician\\'s Notes',
    noTechnicianNotes: 'No notes for this booking.',
    technicianNotesDescription: 'Recommendations from our expert for your next visit to keep your car in top condition.',
    viewBeforeAfter: 'View Before/After',
    beforeAfterModalTitle: 'Before & After Result',
    before: 'Before',
    after: 'After',
    close: 'Close',
    yourSubscriptions: 'Your Subscriptions',
    noSubscriptions: 'You have no active subscriptions.',
    pauseSubscription: 'Pause',
    resumeSubscription: 'Resume',
    paused: 'Paused',
    active: 'Active',
    fileClaimTitle: 'File a Damage Claim',
    claimDescription: 'Have an issue with a recent service? Let us know.',
    bookingIdLabel: 'Relevant Booking ID',
    claimDetailsLabel: 'Describe your claim',
    submitClaim: 'Submit Claim',
    claimSubmitted: 'Your claim has been submitted.',
    liveChatTitle: 'Live Chat with Support',
    liveChatDescription: 'Have a question? Our support team is here to help you in real-time.',
    chatPlaceholder: 'Type your message...',
    send: 'Send',
    
    // Super Admin View
    superAdminTitle: 'Super Admin - Management',
    managePackages: 'Manage Service Packages',
    dynamicPricingTitle: 'Dynamic Pricing',
    surgeMultiplierLabel: 'Price Surge (e.g., 1.2 for 20% surcharge)',
    setMultiplier: 'Set',
    noPackages: 'There are no service packages yet.',
    createPackageTitle: 'Create New Package with AI',
    createPackagePrompt: 'Describe the package',
    createPackagePlaceholder: "e.g., 'Basic exterior package for €39 with hand wash.'",
    generatePackage: 'Generate Package',
    generatingPackage: 'Generating package...',
    reviewAndSave: 'Review and Save',
    packageNameLabel: 'Package Name',
    priceLabel: 'Price (€)',
    featuresLabel: 'Features',
    addFeature: 'Add feature',
    savePackage: 'Save Package',
    savingPackage: 'Saving package...',
    deletePackage: 'Delete',
    editPackage: 'Edit',
    cancel: 'Cancel',
    confirmDeleteTitle: 'Delete Package',
    confirmDeleteDescription: (name: string) => \`Are you sure you want to delete the package '\${name}'?\`,

    // Owner Access Modal
    ownerAccessTitle: 'Owner Access',
    ownerAccessDescription: 'Enter the special access code.',
    ownerAccessCodeLabel: 'Access Code',
    ownerAccessSubmit: 'Grant Access',
    ownerAccessError: 'Invalid access code.',

    // Technician View
    technicianViewTitle: 'Technician Dashboard',
    assignedJobs: 'Assigned Jobs',
    noAssignedJobs: 'No assigned jobs.',
    reportDamage: 'Report Damage',
    reportDamageTitle: 'Report New Damage',
    newScratch: 'New scratch noted',
    newDent: 'New dent noted',
    otherNote: 'Other note',
    submitReport: 'Submit Report',
    damageReported: 'Damage reported successfully.',

    // Email Confirmation
    emailSubject_bookingRequest: 'Your Wash&Go Pro Booking Request has been Received',
    emailGreeting: (name: string) => \`Dear \${name},\`,
    emailBody_bookingRequest: (id: string) => \`Thank you for your request with Wash&Go Pro. We have successfully received your request with ID \${id}. Our team will review it as soon as possible, and you will receive a confirmation once your appointment is scheduled.\`,
    emailSalutation: 'Best regards,\\nThe Wash&Go Pro Team',

    // Source Code Modal
    sourceCodeModalTitle: 'Application Source Code',
    sourceCodeDescription: 'Copy the contents of each file to set up the project locally or host it on a platform like GitHub.',
    copyCode: 'Copy Code',
    codeCopied: 'Copied!',
  },
  fr: {
    // --- AUTH & LOGIN ---
    loginTitle: 'Content de vous revoir',
    loginTab: 'Connexion',
    registerTab: 'S\\'inscrire',
    emailLabel: 'Adresse e-mail',
    passwordLabel: 'Mot de passe',
    loginButton: 'Se connecter',
    orContinueAs: 'Ou continuer en tant que',
    guestButton: 'Invité',
    logoutButton: 'Déconnexion',
    firstNameLabel: 'Prénom',
    lastNameLabel: 'Nom',
    addressLabel: 'Adresse',
    phoneLabel: 'Téléphone',
    registerButton: 'S\\'inscrire',
    registering: 'Inscription...',
    welcomeBack: (name: string) => \`Content de vous revoir, \${name} !\`,
    loginError: 'E-mail ou mot de passe invalide.',
    registrationError: 'Un utilisateur avec cet e-mail existe déjà.',

    // Popup
    languagePopupTitle: 'Bienvenue chez Wash&Go Pro',
    languagePopupDescription: 'Veuillez sélectionner votre langue pour continuer.',
    consentCheckboxLabel: 'J\\'accepte les <a href="#" class="font-medium underline text-brand-accent/80 hover:text-brand-accent">Conditions d\\'utilisation</a>.',
    confirmButton: 'Confirmer',
    
    // Header & Footer
    headerTitle: 'Wash&Go Pro',
    promoBanner: (amount: number) => \`Offre exclusive ! Obtenez \${amount} € de réduction sur votre premier service.\`,
    footerText: 'Propulsé par Wash&Go Pro. À des fins de démonstration uniquement.',

    // Home Screen (VehicleStep)
    homeTitle: 'Votre Voiture, Parfaitement Propre',
    homeDescription: 'Entrez votre plaque d\\'immatriculation pour une analyse instantanée par IA et une recommandation de service.',
    howItWorksTitle: 'Comment ça marche',
    homeStep1Title: '1. Photo & Analyse',
    homeStep1Desc: 'Entrez votre plaque et téléchargez des photos. Notre IA analyse instantanément l\\'état de votre voiture.',
    homeStep2Title: '2. Vérifiez & Réservez',
    homeStep2Desc: 'Consultez notre forfait recommandé et planifiez un service à votre convenance.',
    homeStep3Title: '3. Nous Venons à Vous',
    homeStep3Desc: 'Nos techniciens experts arrivent à l\\'heure pour faire briller votre véhicule.',
    featuredServicesTitle: 'Nos Services Populaires',
    
    // General
    continue: 'Continuer',
    back: 'Retour',
    loading: 'Chargement...',

    // Image Upload Step (Step 1)
    step1Title: 'Vérification Visuelle',
    step1Description: 'Entrez votre plaque et téléchargez des photos de l\\'extérieur et de l\\'intérieur pour lancer l\\'analyse.',
    licensePlateLabel: 'Plaque d\\'immatriculation',
    licensePlatePlaceholder: '1-ABC-123',
    exteriorPhoto: 'Extérieur',
    interiorPhoto: 'Intérieur',
    exteriorDescription: 'Une vue latérale claire du véhicule.',
    interiorDescription: 'Un aperçu du tableau de bord et des sièges avant.',
    arGuidance: 'Alignez votre véhicule avec la silhouette.',
    clickOrDrag: 'Cliquez ou glissez une photo ici',
    change: 'Changer',
    startAnalysis: 'Lancer l\\'Analyse',
    
    // Image Uploader Errors
    fileSizeError: 'La taille du fichier doit être inférieure à 4 Mo.',
    fileTypeError: 'Type de fichier invalide. Veuillez télécharger un JPG, PNG ou WEBP.',

    // Stepper
    stepperInspection: 'Vérif. Visuelle',
    stepperReport: 'Rapport & Service',
    stepperConfirm: 'Planifier & Confirmer',

    // Analysis Report & Service Selection (Step 2)
    analysisReportTitle: 'Votre Rapport Personnalisé',
    analysisCompleteFor: (make: string, model: string) => \`Analyse terminée pour la \${make} \${model}.\`,
    vehicleDetails: 'Détails du Véhicule',
    make: 'Marque',
    model: 'Modèle',
    color: 'Couleur',
    detectedDamages: 'Analyse Détaillée',
    noExteriorDamages: 'Aucun point d\\'attention spécifique trouvé pour l\\'extérieur.',
    noInteriorDamages: 'Aucun point d\\'attention spécifique trouvé pour l\\'intérieur.',
    noSuggestions: 'Aucun service spécifique suggéré.',
    confirmService: 'Accepter & Continuer',
    aiRecommendsTitle: 'Notre analyse technique recommande',
    recommendedBadge: 'Recommandé',
    liveAdviceTitle: 'Besoin d\\'aide ?',
    liveAdviceDescription: 'Notre équipe est prête à vous aider à trouver le service parfait.',
    liveAdviceButton: 'Appelez pour un Conseil',
    sosCleanTitle: 'Nettoyage SOS (Urgent)',
    sosCleanDescription: (percent: number) => \`Pour un supplément de \${percent}%, nous traiterons votre demande en priorité.\`,
    finalPrice: 'Prix Final',
    aiRiskScore: 'Analyse Wash&Go',
    riskScoreDescription: (score: number) => \`Analyse basée sur l\\'état du véhicule. Score : \${score}/100.\`,
    expertSummaryTitle: 'Résumé de l\\'Expert',
    areaLabel: 'Zone',
    observationLabel: 'Observation',
    recommendationLabel: 'Recommandation',

    // Confirmation/Scheduling Step (Step 3)
    confirmationTitle: "Service et Planification",
    confirmationDescription: (service: string, make: string, model: string) => \`Vous avez sélectionné le service '\${service}' pour votre \${make} \${model}. Veuillez planifier votre rendez-vous ci-dessous.\`,
    chosenService: 'Service Choisi',
    packageInclusions: "Inclus dans le Forfait",
    changePackageButton: 'Changer de Forfait',
    scheduleTitle: 'Choisissez un créneau horaire',
    scheduleDateLabel: 'Date',
    scheduleTimeLabel: 'Heure',
    requestBookingButton: 'Demander une Réservation',
    requestingBooking: 'Demande de réservation...',
    addressSectionTitle: 'Adresse de Collecte et de Livraison',
    pickupAddressLabel: 'Adresse de Collecte',
    deliveryAddressLabel: 'Adresse de Livraison',
    differentDeliveryAddressCheckbox: 'Livrer à une adresse différente ?',
    deliverySurchargeNotice: (amount: number) => \`Un supplément de \${amount} € s'applique pour un lieu de livraison différent.\`,
    basePriceLabel: 'Prix de Base',
    deliverySurchargeLabel: 'Supplément de Livraison',
    totalPriceLabel: 'Prix Total',
    
    // Booking Requested
    bookingRequestedTitle: 'Demande de Réservation Envoyée !',
    bookingRequestedDescription: (id: string) => \`Votre demande (ID : \${id}) a bien été reçue. Vous recevrez un e-mail de confirmation.\`,
    trackYourBooking: 'Suivre votre Réservation',
    
    // Loading & Error states
    analyzing: 'Analyse de votre véhicule...',
    analyzingDescription: 'Notre technologie inspecte les images.',
    analysisFailed: 'Analyse Échouée',
    startOver: 'Recommencer',
    errorAllFields: 'Veuillez remplir tous les champs et télécharger les deux photos.',
    errorUnknown: 'Une erreur inconnue est survenue.',
    errorSafety: "L'image n'a pas pu être traitée en raison de notre politique de sécurité.",
    aiError: 'L\\'IA n\\'a pas pu traiter la requête.',
    translating: 'Traduction des détails du forfait...',
    
    // Admin View
    adminViewTitle: 'Tableau de Bord Admin',
    adminBookingsTab: 'Réservations',
    adminPerformanceTab: 'Performance',
    adminAIAssistantTab: 'Assistant IA',
    adminExportTab: 'Exporter',
    bookingId: 'ID Réservation',
    customerDetails: 'Détails Client',
    dateTime: 'Date/Heure Demandée',
    logistics: 'Logistique',
    travelTime: 'Temps Trajet',
    fuelCost: 'Coût Carburant',
    status: 'Statut',
    actions: 'Actions',
    confirmAction: 'Confirmer',
    status_PENDING: 'En attente',
    status_CONFIRMED: 'Confirmé',
    status_COMPLETED: 'Terminé',
    status_CANCELLED: 'Annulé',
    uploadAfterPhoto: 'Uploader Photo "Après"',
    employeePerformanceTitle: 'Performance des Employés (T3)',
    jobsCompleted: 'Tâches Terminées',
    averageRating: 'Note Moyenne',
    totalRevenue: 'Revenu Total',

    // AI Assistant Tab
    aiAssistantTitle: 'Assistant IA pour les requêtes clients',
    aiAssistantDescription: 'Générez des réponses aux questions provenant de canaux externes comme un Google Sheet.',
    generateAnswer: 'Générer une réponse',
    generatingAnswer: 'Génération...',
    copyAnswer: 'Copier',
    answerCopied: 'Copié !',
    customerQuestion: 'Question du client',
    aiGeneratedAnswer: 'Réponse générée par l\\'IA',

    // Export Tab
    exportTitle: 'Exporter les Données de l\\'Application',
    exportDescription: 'Téléchargez les données au format CSV, prêtes à être utilisées dans Google Sheets ou un autre tableur.',
    exportBookingsButton: 'Exporter les Réservations (CSV)',
    exportUsersButton: 'Exporter les Utilisateurs (CSV)',

    // Customer Dashboard
    customerDashboardTitle: 'Mon Tableau de Bord',
    bookingsTab: 'Mes Réservations',
    subscriptionsTab: 'Abonnements',
    claimTab: 'Faire une Réclamation',
    chatTab: 'Chat en Direct',
    yourBookings: 'Vos Réservations',
    bookNewService: 'Réserver un Nouveau Service',
    noBookingsYet: 'Vous n\\'avez pas encore de réservations.',
    requestedOn: 'Demandé le',
    service: 'Service',
    viewDetails: 'Voir les détails',
    hideDetails: 'Masquer les détails',
    technicianNotes: 'Notes du Technicien',
    noTechnicianNotes: 'Aucune note pour cette réservation.',
    technicianNotesDescription: 'Recommandations de notre expert pour votre prochaine visite afin de garder votre voiture en parfait état.',
    viewBeforeAfter: 'Voir Avant/Après',
    beforeAfterModalTitle: 'Résultat Avant & Après',
    before: 'Avant',
    after: 'Après',
    close: 'Fermer',
    yourSubscriptions: 'Vos Abonnements',
    noSubscriptions: 'Vous n\\'avez pas d\\'abonnements actifs.',
    pauseSubscription: 'Mettre en pause',
    resumeSubscription: 'Reprendre',
    paused: 'En pause',
    active: 'Actif',
    fileClaimTitle: 'Déposer une Réclamation',
    claimDescription: 'Un problème avec un service récent ? Faites-le nous savoir.',
    bookingIdLabel: 'ID de réservation pertinent',
    claimDetailsLabel: 'Décrivez votre réclamation',
    submitClaim: 'Soumettre la réclamation',
    claimSubmitted: 'Votre réclamation a été envoyée.',
    liveChatTitle: 'Chat en direct avec le support',
    liveChatDescription: 'Une question ? Notre équipe de support est là pour vous aider en temps réel.',
    chatPlaceholder: 'Écrivez votre message...',
    send: 'Envoyer',

    // Super Admin View
    superAdminTitle: 'Super Admin - Gestion',
    managePackages: 'Gérer les Forfaits',
    dynamicPricingTitle: 'Tarification Dynamique',
    surgeMultiplierLabel: 'Majoration de Prix (ex: 1.2 pour 20%)',
    setMultiplier: 'Définir',
    noPackages: 'Il n\\'y a pas encore de forfaits de service.',
    createPackageTitle: 'Créer un Nouveau Forfait avec l\\'IA',
    createPackagePrompt: 'Décrivez le forfait',
    createPackagePlaceholder: "ex: 'Forfait extérieur de base pour 39 € avec lavage à la main.'",
    generatePackage: 'Générer le Forfait',
    generatingPackage: 'Génération du forfait...',
    reviewAndSave: 'Vérifier et Enregistrer',
    packageNameLabel: 'Nom du Forfait',
    priceLabel: 'Prix (€)',
    featuresLabel: 'Caractéristiques',
    addFeature: 'Ajouter une caractéristique',
    savePackage: 'Enregistrer le Forfait',
    savingPackage: 'Enregistrement du forfait...',
    deletePackage: 'Supprimer',
    editPackage: 'Modifier',
    cancel: 'Annuler',
    confirmDeleteTitle: 'Supprimer le Forfait',
    confirmDeleteDescription: (name: string) => \`Êtes-vous sûr de vouloir supprimer le forfait '\${name}' ?\`,
    
    // Owner Access Modal
    ownerAccessTitle: 'Accès Propriétaire',
    ownerAccessDescription: 'Entrez le code d\\'accès spécial.',
    ownerAccessCodeLabel: 'Code d\\'accès',
    ownerAccessSubmit: 'Autoriser l\\'accès',
    ownerAccessError: 'Code d\\'accès invalide.',

    // Technician View
    technicianViewTitle: 'Tableau de Bord Technicien',
    assignedJobs: 'Tâches Assignées',
    noAssignedJobs: 'Aucune tâche assignée.',
    reportDamage: 'Signaler un Dommage',
    reportDamageTitle: 'Signaler un Nouveau Dommage',
    newScratch: 'Nouvelle rayure signalée',
    newDent: 'Nouvelle bosse signalée',
    otherNote: 'Autre note',
    submitReport: 'Soumettre le Rapport',
    damageReported: 'Dommage signalé avec succès.',

    // Email Confirmation
    emailSubject_bookingRequest: 'Votre demande de réservation Wash&Go Pro a été reçue',
    emailGreeting: (name: string) => \`Cher \${name},\`,
    emailBody_bookingRequest: (id: string) => \`Merci pour votre demande chez Wash&Go Pro. Nous avons bien reçu votre demande avec l'ID \${id}. Notre équipe l'examinera dès que possible, et vous recevrez une confirmation une fois votre rendez-vous programmé.\`,
    emailSalutation: 'Cordialement,\\nL\\'équipe Wash&Go Pro',
    
    // Source Code Modal
    sourceCodeModalTitle: 'Code Source de l\\'Application',
    sourceCodeDescription: 'Copiez le contenu de chaque fichier pour configurer le projet localement ou l\\'héberger sur une plateforme comme GitHub.',
    copyCode: 'Copier le Code',
    codeCopied: 'Copié !',
  },
};`,
  "components/LanguageConsentPopup.tsx": `import React, { useState } from 'react';
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
          return \`\${baseClasses} bg-brand-light text-brand-dark border-transparent ring-2 ring-brand-light\`;
      }
      return \`\${baseClasses} bg-brand-dark text-brand-slate border-brand-light-accent hover:border-brand-accent hover:text-brand-light\`;
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
}`,
  "components/ConfirmationStep.tsx": `import React, { useState, useMemo } from 'react';
import { DamageReport, User, ServicePackage, Locale } from '../types';
import { CarIcon, CalendarIcon, UserIcon as UserIconDetail, ArrowLeftIcon, CheckCircleIcon, HomeIcon } from './common/Icons';
import { Spinner } from './common/Spinner';
import { DELIVERY_SURCHARGE } from '../config';

type ConfirmationStepProps = {
    report: DamageReport | null;
    selectedService: string | null; // This is a service KEY
    isSos: boolean;
    finalPrice: number; // This is the base price (package + SOS)
    onRequestBooking: (data: { 
      requestedDateTime: string; 
      pickupAddress: string;
      deliveryAddress?: string;
      finalPrice: number;
    }) => void;
    onBack: () => void;
    isBooking: boolean;
    t: {
        confirmationTitle: string;
        confirmationDescription: (service: string, make: string, model: string) => string;
        chosenService: string;
        packageInclusions: string;
        changePackageButton: string;
        vehicleDetails: string;
        customerDetails: string;
        scheduleTitle: string;
        scheduleDateLabel: string;
        scheduleTimeLabel: string;
        requestBookingButton: string;
        requestingBooking: string;
        back: string;
        addressSectionTitle: string;
        pickupAddressLabel: string;
        deliveryAddressLabel: string;
        differentDeliveryAddressCheckbox: string;
        deliverySurchargeNotice: (amount: number) => string;
        basePriceLabel: string;
        deliverySurchargeLabel: string;
        totalPriceLabel: string;
    };
    currentUser: User | null;
    servicePackages: ServicePackage[];
    locale: Locale;
};

const timeSlots = ["09:00", "11:00", "14:00", "16:00"];

const inputStyles = "w-full px-4 py-3 text-base text-brand-light bg-brand-dark-accent border-2 border-brand-light-accent rounded-lg shadow-neumorphic-inner placeholder:text-brand-slate focus:ring-2 focus:ring-brand-accent focus:border-brand-accent transition-all";

export function ConfirmationStep({ report, selectedService, isSos, finalPrice, onRequestBooking, onBack, isBooking, t, currentUser, servicePackages, locale }: ConfirmationStepProps): React.ReactNode {
    const today = useMemo(() => new Date().toISOString().split('T')[0], []);
    const [date, setDate] = useState<string>(today);
    const [time, setTime] = useState<string>(timeSlots[0]);

    const [isDifferentDelivery, setIsDifferentDelivery] = useState(false);
    const [pickupAddress, setPickupAddress] = useState(currentUser?.address || '');
    const [deliveryAddress, setDeliveryAddress] = useState('');

    const totalPrice = isDifferentDelivery ? finalPrice + DELIVERY_SURCHARGE : finalPrice;
    
    const handleRequestBooking = () => {
        if (isDifferentDelivery && !deliveryAddress.trim()) {
          alert('Please enter a delivery address.');
          return;
        }
        const dateTimeString = \`\${date}T\${time}\`;
        onRequestBooking({
          requestedDateTime: dateTimeString,
          pickupAddress: pickupAddress,
          deliveryAddress: isDifferentDelivery ? deliveryAddress : undefined,
          finalPrice: totalPrice
        });
    };
    
    if (!report || !selectedService || !currentUser) {
        return null;
    }
    
    const servicePackage = servicePackages.find(p => p.key === selectedService);
    const serviceDetails = servicePackage?.details[locale];
    const translatedService = serviceDetails?.name || selectedService;

    return (
        <div className="bg-brand-dark/50 backdrop-blur-sm border border-brand-light-accent p-6 sm:p-8 rounded-2xl max-w-3xl mx-auto animate-fade-in shadow-neumorphic-outer w-full">
            <div className="text-center">
                <div className="mx-auto w-20 h-20 flex items-center justify-center bg-brand-accent/10 rounded-full border-2 border-brand-accent/30 mb-4 shadow-neumorphic-outer">
                    <CalendarIcon className="w-12 h-12 text-brand-accent" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-brand-light">{t.confirmationTitle}</h2>
                <p className="text-brand-slate mt-2 text-base sm:text-lg">
                    {t.confirmationDescription(translatedService, report.make, report.model)}
                </p>
            </div>

            <div className="mt-8 bg-brand-dark/60 p-6 rounded-lg shadow-neumorphic-inner space-y-4 divide-y divide-brand-light-accent/10">
                {/* --- SERVICE & PRICE --- */}
                <div>
                    <h3 className="text-sm font-semibold text-brand-slate uppercase tracking-wider">{t.chosenService}</h3>
                    <div className="flex justify-between items-baseline gap-4 mt-1">
                        <p className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-500">{translatedService}{isSos && " (SOS)"}</p>
                        <button onClick={onBack} className="text-sm font-semibold text-brand-accent hover:underline flex-shrink-0">
                            {t.changePackageButton}
                        </button>
                    </div>
                </div>

                {serviceDetails && (
                    <div className="pt-4">
                        <h3 className="text-sm font-semibold text-brand-slate uppercase tracking-wider mb-3">{t.packageInclusions}</h3>
                        <ul className="space-y-2 text-sm text-brand-slate">
                            {serviceDetails.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                    <CheckCircleIcon className="w-5 h-5 text-brand-accent/70 flex-shrink-0 mt-0.5" strokeWidth="2.5" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {/* --- ADDRESS --- */}
                <div className="pt-4">
                    <h3 className="text-sm font-semibold text-brand-slate uppercase tracking-wider flex items-center gap-2 mb-3"><HomeIcon className="w-5 h-5 text-brand-slate"/>{t.addressSectionTitle}</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="pickup-address" className="block text-xs font-medium text-brand-slate mb-1">{t.pickupAddressLabel}</label>
                            <input id="pickup-address" type="text" value={pickupAddress} onChange={e => setPickupAddress(e.target.value)} className={inputStyles} placeholder={t.pickupAddressLabel} required />
                        </div>
                        
                        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-brand-light-accent/10">
                           <input type="checkbox" id="different-delivery" checked={isDifferentDelivery} onChange={e => setIsDifferentDelivery(e.target.checked)} className="h-5 w-5 rounded border-brand-slate bg-brand-dark text-brand-accent focus:ring-brand-accent focus:ring-offset-brand-dark"/>
                           <label htmlFor="different-delivery" className="text-sm text-brand-slate cursor-pointer">{t.differentDeliveryAddressCheckbox}</label>
                        </div>

                        {isDifferentDelivery && (
                           <div className="animate-fade-in">
                               <label htmlFor="delivery-address" className="block text-xs font-medium text-brand-slate mb-1">{t.deliveryAddressLabel}</label>
                               <input id="delivery-address" type="text" value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} className={inputStyles} placeholder={t.deliveryAddressLabel} required />
                               <p className="text-xs text-amber-400 mt-2">{t.deliverySurchargeNotice(DELIVERY_SURCHARGE)}</p>
                           </div>
                        )}
                    </div>
                </div>

                 {/* --- VEHICLE & CUSTOMER --- */}
                 <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-brand-slate uppercase tracking-wider flex items-center gap-2"><CarIcon className="w-5 h-5 text-brand-slate"/>{t.vehicleDetails}</h3>
                      <div className="mt-2 text-brand-light text-sm">
                          <span>{report.make} {report.model} ({report.color})</span>
                      </div>
                    </div>
                     {currentUser.role !== 'GUEST' && (
                        <div>
                            <h3 className="text-sm font-semibold text-brand-slate uppercase tracking-wider flex items-center gap-2"><UserIconDetail className="w-5 h-5 text-brand-slate"/>{t.customerDetails}</h3>
                            <div className="mt-2 text-brand-light text-sm">
                                <span>{currentUser.firstName} {currentUser.lastName} ({currentUser.email})</span>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            <div className="mt-8">
                <h3 className="text-center text-xl font-heading font-bold text-brand-light mb-4">{t.scheduleTitle}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="booking-date" className="block text-sm font-medium text-brand-slate mb-2">{t.scheduleDateLabel}</label>
                        <input type="date" id="booking-date" value={date} onChange={e => setDate(e.target.value)} min={today} className={inputStyles} />
                    </div>
                    <div>
                        <label htmlFor="booking-time" className="block text-sm font-medium text-brand-slate mb-2">{t.scheduleTimeLabel}</label>
                        <select id="booking-time" value={time} onChange={e => setTime(e.target.value)} className={inputStyles}>
                            {timeSlots.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 bg-brand-dark/60 p-4 rounded-lg shadow-neumorphic-inner">
                <div className="flex justify-between items-center text-sm text-brand-slate">
                    <span>{t.basePriceLabel}</span>
                    <span>€{finalPrice.toFixed(2)}</span>
                </div>
                {isDifferentDelivery && (
                    <div className="flex justify-between items-center text-sm text-brand-slate mt-1">
                        <span>{t.deliverySurchargeLabel}</span>
                        <span>€{DELIVERY_SURCHARGE.toFixed(2)}</span>
                    </div>
                )}
                 <div className="border-t border-brand-light-accent/20 my-2"></div>
                 <div className="flex justify-between items-center text-lg font-bold text-brand-light">
                    <span>{t.totalPriceLabel}</span>
                    <span className="text-2xl text-brand-accent">€{totalPrice.toFixed(2)}</span>
                </div>
            </div>

            <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
                <button onClick={onBack} className="flex w-full sm:w-auto items-center justify-center gap-2 text-brand-slate font-semibold py-3 px-4 rounded-md hover:bg-brand-light-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-slate/50 transition-all">
                    <ArrowLeftIcon className="w-5 h-5" />
                    {t.back}
                </button>
                <button onClick={handleRequestBooking} disabled={isBooking} className="relative group overflow-hidden w-full sm:w-auto bg-brand-accent text-brand-dark font-bold py-3 px-8 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-accent transition-all shadow-neumorphic-outer disabled:opacity-70 disabled:cursor-wait active:shadow-neumorphic-press">
                    <span className="relative z-10">
                        {isBooking ? (
                            <Spinner size="sm" text={t.requestingBooking} className="text-brand-dark" />
                        ) : (
                            <span className="bg-gradient-to-r from-yellow-900 to-amber-900 bg-clip-text text-transparent font-extrabold">{t.requestBookingButton}</span>
                        )}
                    </span>
                     {!isBooking && <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:animate-shimmer"></span>}
                </button>
            </div>
        </div>
    );
}`,
  "components/common/Logo.tsx": `import React from 'react';

export const Logo = ({ className = 'h-10' }: { className?: string }): React.ReactNode => (
  <div className={\`flex items-center gap-3 \${className}\`}>
    <svg 
      viewBox="0 0 40 40" 
      className="h-full w-auto text-brand-accent"
      aria-hidden="true"
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M20 0C31.0457 0 40 8.95431 40 20C40 31.0457 31.0457 40 20 40C8.95431 40 0 31.0457 0 20C0 8.95431 8.95431 0 20 0ZM19.648 10.211C19.8623 9.71295 20.5221 9.62145 20.8495 9.9882L28.1829 18.2549C28.7112 18.8494 28.3116 19.7891 27.5673 19.882L15.6881 21.2407C15.0598 21.3196 14.6537 20.7302 14.9912 20.177L19.648 10.211ZM12.2327 20.118C11.6884 20.0249 11.2888 20.9646 11.8171 21.5591L19.1505 29.8257C19.4779 30.1925 20.1377 30.101 20.352 29.6029L25.0088 19.6369C25.3463 19.0839 24.9402 18.4945 24.3119 18.5734L12.2327 20.118Z"
        fill="currentColor" 
      />
    </svg>
    <span className="text-2xl font-heading font-bold tracking-tight text-brand-light">
      Wash&Go Pro
    </span>
  </div>
);`,
  "components/common/ProgressStepper.tsx": `import React from 'react';

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
                className={\`group flex flex-col border-l-4 py-2 pl-4 transition-colors duration-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 \${borderColor}\`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span className={\`text-xs font-bold tracking-wider uppercase transition-colors duration-300 \${textColor}\`}>
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
}`,
  "services/bookingService.ts": `import { Booking, BookingStatus, Locale, User } from '../types';
import { mapsService } from './mapsService';
import { authService } from './authService';
import { COMPANY_ADDRESS } from '../config';
import { emailService } from './emailService';

const BOOKINGS_KEY = 'washgo_pro_bookings';

export const bookingService = {
  getAllBookings: (): Booking[] => {
    try {
      const bookingsJson = localStorage.getItem(BOOKINGS_KEY);
      return bookingsJson ? JSON.parse(bookingsJson) : [];
    } catch (error) {
      console.error("Failed to retrieve bookings:", error);
      return [];
    }
  },

  createBookingRequest: async (
      bookingData: Omit<Booking, 'id' | 'status' | 'travelTime' | 'fuelCost' | 'optimizedRoute' | 'customerEmail' | 'assignedTechnician' | 'afterPhotoUrl' | 'technicianDamageNotes'>,
      customer: User,
      locale: Locale
  ): Promise<Booking> => {
    const allBookings = bookingService.getAllBookings();
    
    const { travelTime, fuelCost, optimizedRoute } = await mapsService.getTravelTime(COMPANY_ADDRESS, bookingData.pickupAddress);

    const newBooking: Booking = {
      ...bookingData,
      customerEmail: customer.email,
      id: crypto.randomUUID().slice(0, 8).toUpperCase(),
      status: BookingStatus.PENDING,
      travelTime,
      fuelCost,
      optimizedRoute,
      assignedTechnician: 'tech@washgo.pro', // Mock assignment
    };
    
    const updatedBookings = [...allBookings, newBooking];
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updatedBookings));
    
    emailService.sendBookingRequestConfirmation(newBooking, customer, locale);
    
    return newBooking;
  },

  updateBookingStatus: (id: string, status: BookingStatus): Booking | null => {
    const allBookings = bookingService.getAllBookings();
    let updatedBooking: Booking | null = null;

    const updatedBookings = allBookings.map(booking => {
      if (booking.id === id) {
        updatedBooking = { ...booking, status };
        return updatedBooking;
      }
      return booking;
    });

    if (updatedBooking) {
        localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updatedBookings));
        if (status === BookingStatus.CONFIRMED) {
          console.log(\`SIMULATING: Generating insurance documentation for booking \${id}.\`);
        }
    }
    
    console.log(\`Simulating email to customer for booking \${id}: Status changed to \${status}\`);
    return updatedBooking;
  },
  
  addAfterPhoto: (id: string, photoUrl: string): void => {
      const allBookings = bookingService.getAllBookings();
      const updatedBookings = allBookings.map(booking =>
        booking.id === id ? { ...booking, afterPhotoUrl: photoUrl } : booking
      );
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updatedBookings));
  },
  
  addDamageNote: (id: string, note: string): void => {
      const allBookings = bookingService.getAllBookings();
      const updatedBookings = allBookings.map(booking => {
          if (booking.id === id) {
              const notes = booking.technicianDamageNotes || [];
              return { ...booking, technicianDamageNotes: [...notes, note] };
          }
          return booking;
      });
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updatedBookings));
  },

  getBookingsByEmail: (email: string): Booking[] => {
    const allBookings = bookingService.getAllBookings();
    return allBookings.filter(booking => booking.customerEmail === email);
  },

  getBookingsByTechnician: (email: string): Booking[] => {
      const allBookings = bookingService.getAllBookings();
      return allBookings.filter(booking => booking.assignedTechnician === email && booking.status !== BookingStatus.COMPLETED);
  }
};`,
  "components/BookingRequestedStep.tsx": `import React from 'react';
import { Booking } from '../types';
import { CheckCircleIcon } from './common/Icons';

type BookingRequestedStepProps = {
    booking: Booking | null;
    onTrackBooking: () => void;
    t: {
        bookingRequestedTitle: string;
        bookingRequestedDescription: (id: string) => string;
        trackYourBooking: string;
    };
};

export function BookingRequestedStep({ booking, onTrackBooking, t }: BookingRequestedStepProps) {
    if (!booking) {
        return null; // or some fallback UI
    }

    return (
        <div className="bg-brand-dark/50 backdrop-blur-sm border border-brand-light-accent p-6 sm:p-8 rounded-2xl max-w-2xl mx-auto animate-fade-in shadow-neumorphic-outer">
            <div className="text-center">
                <div className="mx-auto w-20 h-20 flex items-center justify-center bg-brand-accent/10 rounded-full border-2 border-brand-accent/30 mb-4 shadow-neumorphic-outer">
                    <CheckCircleIcon className="w-16 h-16 text-brand-accent" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-brand-light">{t.bookingRequestedTitle}</h2>
                <p className="text-brand-slate mt-2 text-base sm:text-lg">
                    {t.bookingRequestedDescription(booking.id)}
                </p>

                <div className="mt-8">
                     <button
                        onClick={onTrackBooking}
                        className="w-full sm:w-auto bg-brand-accent text-brand-dark font-bold py-3 px-8 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-accent transition-all shadow-neumorphic-outer"
                    >
                        <span className="bg-gradient-to-r from-yellow-900 to-amber-900 bg-clip-text text-transparent font-extrabold">{t.trackYourBooking}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}`,
  "components/AdminView.tsx": `import React, { useState, useEffect, useCallback } from 'react';
import { Booking, BookingStatus, AppTranslations, ServicePackage, Locale, User } from '../types';
import { bookingService } from '../services/bookingService';
import { Spinner } from './common/Spinner';
import { authService } from '../services/authService';
import { CheckCircleIcon, CurrencyEuroIcon, SparklesIcon, StarIcon, ClipboardListIcon, DownloadIcon } from './common/Icons';
import { RiskGauge } from './common/RiskGauge';
import { AIAssistantTab } from './AIAssistantTab';
import { ExportDataTab } from './ExportDataTab';

type AdminViewProps = {
  t: AppTranslations;
  servicePackages: ServicePackage[];
  locale: Locale;
};

type ActiveTab = 'bookings' | 'performance' | 'ai_assistant' | 'export';

export function AdminView({ t, servicePackages, locale }: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = useCallback(() => {
    setIsLoading(true);
    const allBookings = bookingService.getAllBookings();
    allBookings.sort((a, b) => {
        if (a.status === BookingStatus.PENDING && b.status !== BookingStatus.PENDING) return -1;
        if (a.status !== BookingStatus.PENDING && b.status === BookingStatus.PENDING) return 1;
        return new Date(b.requestedDateTime).getTime() - new Date(a.requestedDateTime).getTime();
    });
    setBookings(allBookings);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchBookings();
    const allUsers = authService.getAllUsers();
    setUsers(allUsers);
  }, [fetchBookings]);

  const handleConfirm = (id: string) => {
    bookingService.updateBookingStatus(id, BookingStatus.CONFIRMED);
    fetchBookings();
  };
  
  const handleComplete = (id: string) => {
    // In a real app, you'd open a file picker. Here we use a placeholder.
    const mockAfterPhoto = \`https://picsum.photos/seed/\${id}/400/300\`;
    bookingService.addAfterPhoto(id, mockAfterPhoto);
    bookingService.updateBookingStatus(id, BookingStatus.COMPLETED);
    fetchBookings();
  };
  
  const getStatusChip = (status: BookingStatus) => {
      const statusKey = \`status_\${status}\` as 'status_PENDING' | 'status_CONFIRMED' | 'status_COMPLETED' | 'status_CANCELLED';
      const statusText = t[statusKey] || status;
      let classes = "px-3 py-1 text-xs font-bold rounded-full ";
      switch(status) {
          case BookingStatus.PENDING: classes += "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"; break;
          case BookingStatus.CONFIRMED: classes += "bg-green-500/20 text-green-300 border border-green-500/30"; break;
          case BookingStatus.COMPLETED: classes += "bg-blue-500/20 text-blue-300 border border-blue-500/30"; break;
          case BookingStatus.CANCELLED: classes += "bg-brand-slate/20 text-brand-slate border border-brand-slate/30"; break;
      }
      return <span className={classes}>{statusText}</span>
  }

  const formatDateTime = (isoString: string) => {
      try {
          return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(isoString));
      } catch (e) {
          return isoString;
      }
  }
  
  const getCustomerName = (email: string) => {
      if (email.startsWith('guest-')) return 'Guest';
      const user = users.find(u => u.email === email);
      return user ? \`\${user.firstName} \${user.lastName}\` : 'N/A';
  }

  const getTabClass = (tab: ActiveTab) => activeTab === tab ? 'border-brand-accent text-brand-accent' : 'border-transparent text-brand-slate hover:text-brand-light';

  const renderBookings = () => (
     <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-brand-light-accent/20">
            <thead className="bg-brand-dark/30">
                <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-brand-light sm:pl-6">{t.bookingId}</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-brand-light">{t.customerDetails}</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-brand-light">{t.chosenService}</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-brand-light">{t.dateTime}</th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-brand-light bg-brand-dark/60">{t.aiRiskScore}</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-brand-light">{t.logistics}</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-brand-light">{t.status}</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">{t.actions}</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-brand-light-accent/10 bg-brand-dark/20">
                {bookings.map((booking, index) => {
                    const servicePackage = servicePackages.find(p => p.key === booking.serviceKey);
                    const serviceName = servicePackage?.details[locale]?.name || booking.serviceKey;
                    const customerName = getCustomerName(booking.customerEmail);
                    return (
                        <tr key={booking.id} className={\`transition-colors hover:bg-brand-dark-accent/50 \${index % 2 !== 0 ? 'bg-brand-dark/40' : ''}\`}>
                            <td className="py-4 pl-4 pr-3 text-sm font-mono text-brand-slate sm:pl-6">{booking.id}</td>
                            <td className="px-3 py-4 text-sm text-brand-light">
                                <div className="font-medium">{customerName}</div>
                                <div className="text-brand-slate">{booking.customerEmail}</div>
                            </td>
                            <td className="px-3 py-4 text-sm text-brand-light">{serviceName}</td>
                            <td className="px-3 py-4 text-sm text-brand-slate">{formatDateTime(booking.requestedDateTime)}</td>
                            <td className="px-3 py-4 text-sm text-center bg-brand-dark/60">
                                <div className="flex justify-center items-center" title={\`\${t.aiRiskScore}: \${booking.riskScore}\`}>
                                  <RiskGauge score={booking.riskScore || 0} />
                                </div>
                            </td>
                             <td className="px-3 py-4 text-sm text-brand-slate">
                                <div>{\`~\${booking.travelTime} min / €\${booking.fuelCost?.toFixed(2)}\`}</div>
                                <div className="text-xs text-brand-slate/70" title={booking.optimizedRoute}>
                                  Route...
                                </div>
                            </td>
                            <td className="px-3 py-4 text-sm">{getStatusChip(booking.status)}</td>
                            <td className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                {booking.status === BookingStatus.PENDING && <button onClick={() => handleConfirm(booking.id)} className="bg-brand-accent/20 text-brand-accent font-bold py-1 px-3 rounded-md hover:bg-brand-accent/30">{t.confirmAction}</button>}
                                {booking.status === BookingStatus.CONFIRMED && <button onClick={() => handleComplete(booking.id)} className="bg-blue-500/20 text-blue-300 font-bold py-1 px-3 rounded-md hover:bg-blue-500/30">{t.uploadAfterPhoto}</button>}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
  );

  const PerfCard = ({ title, value, icon, unit }: { title: string, value: string | number, icon: React.ReactNode, unit?: string }) => (
    <div className="bg-brand-dark/60 p-6 rounded-lg shadow-neumorphic-inner">
      <div className="flex items-center gap-4">
        <div className="bg-brand-dark p-3 rounded-full shadow-neumorphic-outer">{icon}</div>
        <div>
          <p className="text-sm text-brand-slate">{title}</p>
          <p className="text-2xl font-bold text-brand-light">{value} <span className="text-base text-brand-slate">{unit}</span></p>
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div>
        <h3 className="text-xl font-heading font-bold text-brand-light mb-4">{t.employeePerformanceTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PerfCard title={t.jobsCompleted} value="128" icon={<CheckCircleIcon className="w-6 h-6 text-green-400"/>} />
          <PerfCard title={t.averageRating} value="4.8" unit="/ 5" icon={<StarIcon className="w-6 h-6 text-yellow-400"/>} />
          <PerfCard title={t.totalRevenue} value="15,230" unit="€" icon={<CurrencyEuroIcon className="w-6 h-6 text-brand-accent"/>} />
        </div>
        <div className="mt-8 p-6 bg-brand-dark/60 rounded-lg shadow-neumorphic-inner">
          <p className="text-brand-slate text-center">More charts and detailed reports coming soon.</p>
        </div>
    </div>
  );

  const renderContent = () => {
      if (isLoading) {
          return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
      }
      switch(activeTab) {
          case 'bookings': return renderBookings();
          case 'performance': return renderPerformance();
          case 'ai_assistant': return <AIAssistantTab t={t} />;
          case 'export': return <ExportDataTab t={t} bookings={bookings} users={users} servicePackages={servicePackages} locale={locale} />;
          default: return null;
      }
  }

  return (
    <div className="w-full animate-fade-in bg-brand-dark/50 backdrop-blur-xl border border-brand-light-accent p-6 sm:p-8 rounded-2xl shadow-neumorphic-outer">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-3xl font-heading font-bold text-brand-light">{t.adminViewTitle}</h2>
          <div className="border border-brand-light-accent/20 rounded-lg p-1 flex flex-wrap gap-1 bg-brand-dark shadow-neumorphic-inner">
            <button onClick={() => setActiveTab('bookings')} className={\`px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 \${getTabClass('bookings')}\`}>
                <ClipboardListIcon className="w-4 h-4"/>
                {t.adminBookingsTab}
            </button>
            <button onClick={() => setActiveTab('performance')} className={\`px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 \${getTabClass('performance')}\`}>
                <StarIcon className="w-4 h-4"/>
                {t.adminPerformanceTab}
            </button>
            <button onClick={() => setActiveTab('ai_assistant')} className={\`px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 \${getTabClass('ai_assistant')}\`}>
                <SparklesIcon className="w-4 h-4" />
                {t.adminAIAssistantTab}
            </button>
             <button onClick={() => setActiveTab('export')} className={\`px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 \${getTabClass('export')}\`}>
                <DownloadIcon className="w-4 h-4" />
                {t.adminExportTab}
            </button>
          </div>
        </div>
        {renderContent()}
    </div>
  );
}`,
  "services/authService.ts": `import { User, UserRole } from '../types';

type StoredUser = Omit<User, 'role'> & { passwordHash: string };

const USERS_KEY = 'washgo_pro_users';
const SESSION_KEY = 'washgo_pro_session';

// --- Mock Database ---
// In a real app, this would be a backend API call.
const getStoredUsers = (): StoredUser[] => {
  try {
    const usersJson = localStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    console.error("Failed to retrieve users:", error);
    return [];
  }
};

const saveStoredUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Initialize with a default admin user if one doesn't exist
const initializeAdmin = () => {
    const users = getStoredUsers();
    
    if (!users.some(u => u.email === 'admin@washgo.pro')) {
        users.push({
            firstName: 'Admin', lastName: 'User', email: 'admin@washgo.pro',
            passwordHash: 'admin', address: '123 Admin Ave, New York, NY 10001', phone: '555-0100',
        });
    }
    
    if (!users.some(u => u.email === 'superadmin@washgo.pro')) {
        users.push({
            firstName: 'Super', lastName: 'Admin', email: 'superadmin@washgo.pro',
            passwordHash: 'superadmin', address: '1 Super Admin Way, San Francisco, CA 94102', phone: '555-0199',
        });
    }

    if (!users.some(u => u.email === 'tech@washgo.pro')) {
        users.push({
            firstName: 'Tech', lastName: 'Nichan', email: 'tech@washgo.pro',
            passwordHash: 'tech', address: 'On The Road', phone: '555-0101',
        });
    }

    saveStoredUsers(users);
};

initializeAdmin();

// --- Authentication Service ---
export const authService = {
  getCurrentUser: (): User | null => {
    try {
      const sessionJson = localStorage.getItem(SESSION_KEY);
      return sessionJson ? JSON.parse(sessionJson) : null;
    } catch (error) {
      console.error("Failed to retrieve session:", error);
      return null;
    }
  },

  login: (email: string, password_sent: string): User | null => {
    const users = getStoredUsers();
    const userFound = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    // FIXED: Made logic more robust to prevent crashes.
    if (!userFound) {
      // Special hardcoded fallback for tech user, in case local storage is cleared
      if (email.toLowerCase() === 'tech@washgo.pro' && password_sent === 'tech') {
          const techUser: User = { 
              firstName: 'Tech', lastName: 'Nichan', email: 'tech@washgo.pro',
              address: 'On The Road', phone: '555-0101', role: UserRole.TECHNICIAN 
          };
          localStorage.setItem(SESSION_KEY, JSON.stringify(techUser));
          return techUser;
      }
      return null; // User not found, and not the special tech user.
    }

    // Now that we know userFound exists, we can safely check the password.
    if (password_sent !== userFound.passwordHash) {
        return null; // Incorrect password for found user
    }
    
    // Correct password
    let role = UserRole.CUSTOMER;
    if (userFound.email === 'superadmin@washgo.pro') role = UserRole.SUPER_ADMIN;
    else if (userFound.email === 'admin@washgo.pro') role = UserRole.ADMIN;
    else if (userFound.email === 'tech@washgo.pro') role = UserRole.TECHNICIAN;

    const { passwordHash, ...userToStore } = userFound;
    const sessionUser: User = { ...userToStore, role };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  register: (userData: Omit<User, 'role'> & { password_sent: string }): User | null => {
    const users = getStoredUsers();
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
        return null; // User already exists
    }
    
    const newUser: StoredUser = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        address: userData.address,
        phone: userData.phone,
        passwordHash: userData.password_sent, // Mock hash
    };
    
    users.push(newUser);
    saveStoredUsers(users);
    
    const { passwordHash, ...userToStore } = newUser;
    const sessionUser: User = { ...userToStore, role: UserRole.CUSTOMER };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
    return sessionUser;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  // For admin panel and other services usage
  getUserByEmail: (email: string): User | null => {
    const users = getStoredUsers();
    const userFound = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!userFound) return null;
    
    let role = UserRole.CUSTOMER;
    if (userFound.email === 'admin@washgo.pro') role = UserRole.ADMIN;
    else if (userFound.email === 'superadmin@washgo.pro') role = UserRole.SUPER_ADMIN;
    else if (userFound.email === 'tech@washgo.pro') role = UserRole.TECHNICIAN;
    
    const { passwordHash, ...user } = userFound;
    return { ...user, role };
  },

  getAllUsers: (): User[] => {
    const storedUsers = getStoredUsers();
    return storedUsers.map(u => {
      let role = UserRole.CUSTOMER;
      if (u.email === 'admin@washgo.pro') role = UserRole.ADMIN;
      else if (u.email === 'superadmin@washgo.pro') role = UserRole.SUPER_ADMIN;
      else if (u.email === 'tech@washgo.pro') role = UserRole.TECHNICIAN;
      const { passwordHash, ...user } = u;
      return { ...user, role };
    });
  }
};`,
  "components/LoginScreen.tsx": `import React, { useState } from 'react';
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
      return \`\${baseClasses} bg-brand-dark/50 text-brand-accent border-b-2 border-brand-accent\`;
    }
    return \`\${baseClasses} text-brand-slate hover:text-brand-light\`;
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
}`,
  "services/packageService.ts": `import { ServicePackage } from '../types';

const PACKAGES_KEY = 'washgo_pro_packages';
const SURGE_MULTIPLIER_KEY = 'washgo_pro_surge_multiplier';

const defaultPackages: ServicePackage[] = [
    {
        key: 'pkg_1716301538352',
        details: {
            nl: { name: 'Exterieur Was & Decontaminatie', price: 49, features: ['Hogedruk voorwas', 'Twee-emmer handwas', 'Velgen en banden reiniging', 'Chemische decontaminatie (ijzer & teer)', 'Aanbrengen beschermende sealant'] },
            en: { name: 'Exterior Wash & Decontamination', price: 49, features: ['High-pressure pre-wash', 'Two-bucket hand wash', 'Wheel and tire cleaning', 'Chemical decontamination (iron & tar)', 'Protective sealant applied'] },
            fr: { name: 'Lavage & Décontamination Extérieur', price: 49, features: ['Prélavage haute pression', 'Lavage manuel à deux seaux', 'Nettoyage des jantes et pneus', 'Décontamination chimique (fer & goudron)', 'Application d\\'un scellant protecteur'] }
        }
    },
    {
        key: 'pkg_1716301538353',
        details: {
            nl: { name: 'Dieptereiniging Interieur & Bekleding', price: 79, features: ['Volledig stofzuigen van het interieur', 'Dieptereiniging van stoffen/leren stoelen', 'Reiniging van tapijten en matten', 'Dashboard- en paneelreiniging', 'Ramen reinigen (binnenkant)'] },
            en: { name: 'Deep Interior Cleaning & Upholstery', price: 79, features: ['Complete interior vacuum', 'Deep cleaning of fabric/leather seats', 'Carpet and mat shampooing', 'Dashboard and panel cleaning', 'Interior window cleaning'] },
            fr: { name: 'Nettoyage en Profondeur Intérieur & Sellerie', price: 79, features: ['Aspiration complète de l\\'intérieur', 'Nettoyage en profondeur des sièges en tissu/cuir', 'Nettoyage des moquettes et tapis', 'Nettoyage tableau de bord et panneaux', 'Nettoyage des vitres (intérieur)'] }
        }
    },
    {
        key: 'pkg_1716301538354',
        details: {
            nl: { name: 'Volledig Detailing Pakket', price: 119, features: ['Alle diensten van Exterieur Was', 'Alle diensten van Interieur Dieptereiniging', 'Kunststof exterieurdelen behandelen', 'Motorruimte reiniging (op verzoek)', 'Luxe interieurgeur'] },
            en: { name: 'Comprehensive Detailing Package', price: 119, features: ['All services from Exterior Wash', 'All services from Interior Deep Clean', 'Exterior plastic trim restored', 'Engine bay cleaning (on request)', 'Luxury interior fragrance'] },
            fr: { name: 'Forfait Detailing Complet', price: 119, features: ['Tous les services du Lavage Extérieur', 'Tous les services du Nettoyage en Profondeur Intérieur', 'Restauration des plastiques extérieurs', 'Nettoyage du compartiment moteur (sur demande)', 'Parfum d\\'intérieur de luxe'] }
        }
    },
    {
        key: 'pkg_1716301538355',
        details: {
            nl: { name: 'Premium Wax & Polish', price: 89, features: ['Inclusief Exterieur Was & Decontaminatie', 'Lichte polijstbehandeling om glans te herstellen', 'Aanbrengen van hoogwaardige Carnauba wax', 'Verbetert de kleurdiepte', 'Biedt 3-6 maanden bescherming'] },
            en: { name: 'Premium Wax & Polish', price: 89, features: ['Includes Exterior Wash & Decontamination', 'Light polish to enhance gloss', 'Application of high-grade Carnauba wax', 'Improves color depth', 'Provides 3-6 months of protection'] },
            fr: { name: 'Cire & Lustrage Premium', price: 89, features: ['Inclut Lavage & Décontamination Extérieur', 'Polissage léger pour rehausser la brillance', 'Application d\\'une cire Carnauba de haute qualité', 'Améliore la profondeur de la couleur', 'Offre 3-6 mois de protection'] }
        }
    },
    {
        key: 'pkg_1716301538356',
        details: {
            nl: { name: 'Lakcorrectie & Polijsten', price: 249, features: ['Inclusief Exterieur Was & Decontaminatie', 'Meer-staps polijstproces', 'Verwijdering van 70-90% van de krassen', 'Herstelt diepe glans en reflectie', 'Voorbereiding voor keramische coating'] },
            en: { name: 'Paint Correction & Polishing', price: 249, features: ['Includes Exterior Wash & Decontamination', 'Multi-stage machine polishing', 'Removes 70-90% of swirls and scratches', 'Restores deep gloss and reflection', 'Prepares surface for ceramic coating'] },
            fr: { name: 'Correction & Polissage de la Peinture', price: 249, features: ['Inclut Lavage & Décontamination Extérieur', 'Processus de polissage en plusieurs étapes', 'Élimination de 70-90% des rayures', 'Restaure une brillance et une réflexion profondes', 'Préparation pour un revêtement céramique'] }
        }
    }
];

export const packageService = {
  initializePackages: (): void => {
    try {
      const packagesJson = localStorage.getItem(PACKAGES_KEY);
      if (!packagesJson || JSON.parse(packagesJson).length === 0) {
        localStorage.setItem(PACKAGES_KEY, JSON.stringify(defaultPackages));
      }
    } catch (error) {
      console.error("Failed to initialize packages:", error);
      localStorage.setItem(PACKAGES_KEY, JSON.stringify(defaultPackages));
    }
  },
  
  getPackages: (): ServicePackage[] => {
    try {
      const packagesJson = localStorage.getItem(PACKAGES_KEY);
      return packagesJson ? JSON.parse(packagesJson) : [];
    } catch (error) {
      console.error("Failed to retrieve packages:", error);
      return [];
    }
  },

  savePackages: (packages: ServicePackage[]): void => {
    localStorage.setItem(PACKAGES_KEY, JSON.stringify(packages));
  },

  addPackage: (newPackage: ServicePackage): void => {
    const packages = packageService.getPackages();
    packages.push(newPackage);
    packageService.savePackages(packages);
  },

  updatePackage: (updatedPackage: ServicePackage): void => {
    const packages = packageService.getPackages();
    const index = packages.findIndex(p => p.key === updatedPackage.key);
    if (index !== -1) {
      packages[index] = updatedPackage;
      packageService.savePackages(packages);
    }
  },

  deletePackage: (key: string): void => {
    const packages = packageService.getPackages();
    const filteredPackages = packages.filter(p => p.key !== key);
    packageService.savePackages(filteredPackages);
  },
  
  getSurgeMultiplier: (): number => {
      const multiplier = localStorage.getItem(SURGE_MULTIPLIER_KEY);
      return multiplier ? parseFloat(multiplier) : 1;
  },

  setSurgeMultiplier: (multiplier: number): void => {
      localStorage.setItem(SURGE_MULTIPLIER_KEY, multiplier.toString());
  }
};`,
  "components/SuperAdminView.tsx": `
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
            const key = \`pkg_\${Date.now()}\`;
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
            {editingPackage && <EditModal pkg={editingPackage.details