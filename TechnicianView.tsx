// components/TechnicianView.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { User, AppTranslations, Booking, ServicePackage, Locale, BookingStatus } from '../types';
import { bookingService } from '../services/bookingService';
import { Spinner } from './common/Spinner';
import { CarIcon, AlertTriangleIcon, CheckCircleIcon } from './common/Icons';

type TechnicianViewProps = {
    currentUser: User;
    t: AppTranslations;
    servicePackages: ServicePackage[];
    locale: Locale;
};

const DamageReportModal = ({ booking, onClose, t }: { booking: Booking, onClose: () => void, t: AppTranslations }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (note: string) => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            bookingService.addDamageNote(booking.id, note);
            setIsSubmitting(false);
            onClose();
            alert(t.damageReported);
        }, 500);
    };

    return (
        <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-brand-dark/80 border border-brand-light-accent p-6 rounded-2xl shadow-neumorphic-outer w-full max-w-md">
                <h3 className="text-xl font-heading font-bold text-brand-light text-center">{t.reportDamageTitle}</h3>
                <p className="text-sm text-brand-slate text-center mt-1 mb-6">Booking ID: {booking.id}</p>
                {isSubmitting ? <Spinner /> : (
                    <div className="space-y-3">
                        <button onClick={() => handleSubmit(t.newScratch)} className="w-full text-left p-4 bg-brand-dark-accent rounded-lg shadow-neumorphic-inner hover:bg-brand-light-accent/10 flex items-center gap-3">
                            <AlertTriangleIcon className="w-5 h-5 text-red-500"/>{t.newScratch}
                        </button>
                        <button onClick={() => handleSubmit(t.newDent)} className="w-full text-left p-4 bg-brand-dark-accent rounded-lg shadow-neumorphic-inner hover:bg-brand-light-accent/10 flex items-center gap-3">
                             <AlertTriangleIcon className="w-5 h-5 text-yellow-500"/>{t.newDent}
                        </button>
                        <button onClick={() => { const note = prompt(t.otherNote); if (note) handleSubmit(note); }} className="w-full text-left p-4 bg-brand-dark-accent rounded-lg shadow-neumorphic-inner hover:bg-brand-light-accent/10 flex items-center gap-3">
                             <CheckCircleIcon className="w-5 h-5 text-brand-slate"/>{t.otherNote}...
                        </button>
                    </div>
                )}
                <button onClick={onClose} className="w-full mt-6 text-brand-slate font-semibold py-2 rounded-md hover:bg-brand-light-accent/10">{t.cancel}</button>
            </div>
        </div>
    );
};


export function TechnicianView({ currentUser, t, servicePackages, locale }: TechnicianViewProps) {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [reportingDamageFor, setReportingDamageFor] = useState<Booking | null>(null);

    const fetchJobs = useCallback(() => {
        setIsLoading(true);
        const assignedBookings = bookingService.getBookingsByTechnician(currentUser.email);
        assignedBookings.sort((a, b) => new Date(a.requestedDateTime).getTime() - new Date(b.requestedDateTime).getTime());
        setBookings(assignedBookings);
        setIsLoading(false);
    }, [currentUser.email]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const formatDateTime = (isoString: string) => new Intl.DateTimeFormat(locale, { dateStyle: 'short', timeStyle: 'short' }).format(new Date(isoString));

    return (
        <div className="w-full animate-fade-in bg-brand-dark/50 backdrop-blur-xl border border-brand-light-accent p-6 sm:p-8 rounded-2xl shadow-neumorphic-outer">
            {reportingDamageFor && <DamageReportModal booking={reportingDamageFor} onClose={() => setReportingDamageFor(null)} t={t} />}

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-heading font-bold text-brand-light">{t.technicianViewTitle}</h2>
                <p className="text-brand-slate">{t.welcomeBack(currentUser.firstName)}</p>
            </div>

            <h3 className="text-xl font-heading font-bold text-brand-light mb-4">{t.assignedJobs}</h3>

            {isLoading ? <Spinner /> : bookings.length === 0 ? (
                <div className="text-center py-10"><p className="text-brand-slate">{t.noAssignedJobs}</p></div>
            ) : (
                <div className="space-y-4">
                    {bookings.map(booking => {
                        const servicePackage = servicePackages.find(p => p.key === booking.serviceKey);
                        const serviceName = servicePackage?.details[locale]?.name || booking.serviceKey;
                        return (
                            <div key={booking.id} className="bg-brand-dark/60 p-4 rounded-lg shadow-neumorphic-inner flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div className="flex-grow">
                                    <p className="text-xs font-mono text-brand-slate">{booking.id}</p>
                                    <p className="font-bold text-brand-light">{serviceName}</p>
                                    <p className="text-sm text-brand-slate">{booking.make} {booking.model}</p>
                                </div>
                                <div className="text-sm text-brand-light flex-shrink-0">
                                    {formatDateTime(booking.requestedDateTime)}
                                </div>
                                <div className="w-full sm:w-auto">
                                    <button onClick={() => setReportingDamageFor(booking)} className="w-full sm:w-auto bg-yellow-500/20 text-yellow-300 font-bold py-2 px-4 rounded-md hover:bg-yellow-500/30 flex items-center justify-center gap-2">
                                        <AlertTriangleIcon className="w-5 h-5"/>{t.reportDamage}
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
