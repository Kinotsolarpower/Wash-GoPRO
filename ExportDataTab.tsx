import React from 'react';
import { AppTranslations, Booking, User, ServicePackage, Locale } from '../types';
import { exportService } from '../services/exportService';
import { DownloadIcon } from './common/Icons';

type ExportDataTabProps = {
    t: AppTranslations;
    bookings: Booking[];
    users: User[];
    servicePackages: ServicePackage[];
    locale: Locale;
};

const downloadCSV = (csvString: string, filename: string) => {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
};

export function ExportDataTab({ t, bookings, users, servicePackages, locale }: ExportDataTabProps) {

    const handleExportBookings = () => {
        const csvString = exportService.exportBookingsToCSV(bookings, users, servicePackages, locale);
        downloadCSV(csvString, 'washgo-bookings.csv');
    };

    const handleExportUsers = () => {
        const csvString = exportService.exportUsersToCSV(users);
        downloadCSV(csvString, 'washgo-users.csv');
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h3 className="text-2xl font-heading font-bold text-brand-light">{t.exportTitle}</h3>
                <p className="text-brand-slate mt-1 max-w-2xl mx-auto">{t.exportDescription}</p>
            </div>
            <div className="max-w-md mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                    onClick={handleExportBookings}
                    className="flex flex-col items-center justify-center gap-3 bg-brand-dark-accent p-6 rounded-lg shadow-neumorphic-outer hover:bg-brand-light-accent/10 transition-colors group"
                >
                    <DownloadIcon className="w-10 h-10 text-brand-accent group-hover:scale-110 transition-transform"/>
                    <span className="font-bold text-brand-light mt-2">{t.exportBookingsButton}</span>
                </button>
                <button
                    onClick={handleExportUsers}
                    className="flex flex-col items-center justify-center gap-3 bg-brand-dark-accent p-6 rounded-lg shadow-neumorphic-outer hover:bg-brand-light-accent/10 transition-colors group"
                >
                    <DownloadIcon className="w-10 h-10 text-brand-accent group-hover:scale-110 transition-transform"/>
                    <span className="font-bold text-brand-light mt-2">{t.exportUsersButton}</span>
                </button>
            </div>
        </div>
    );
}
