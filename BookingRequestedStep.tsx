
import React from 'react';
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
}