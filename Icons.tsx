import React from 'react';

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
);
