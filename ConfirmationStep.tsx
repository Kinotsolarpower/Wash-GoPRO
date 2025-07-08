
import React, { useState, useMemo } from 'react';
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
        const dateTimeString = `${date}T${time}`;
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
}