

export enum AppStep {
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
}
