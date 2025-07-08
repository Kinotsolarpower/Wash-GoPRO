import React, { useState, useEffect, useCallback } from 'react';
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
    const mockAfterPhoto = `https://picsum.photos/seed/${id}/400/300`;
    bookingService.addAfterPhoto(id, mockAfterPhoto);
    bookingService.updateBookingStatus(id, BookingStatus.COMPLETED);
    fetchBookings();
  };
  
  const getStatusChip = (status: BookingStatus) => {
      const statusKey = `status_${status}` as 'status_PENDING' | 'status_CONFIRMED' | 'status_COMPLETED' | 'status_CANCELLED';
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
      return user ? `${user.firstName} ${user.lastName}` : 'N/A';
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
                        <tr key={booking.id} className={`transition-colors hover:bg-brand-dark-accent/50 ${index % 2 !== 0 ? 'bg-brand-dark/40' : ''}`}>
                            <td className="py-4 pl-4 pr-3 text-sm font-mono text-brand-slate sm:pl-6">{booking.id}</td>
                            <td className="px-3 py-4 text-sm text-brand-light">
                                <div className="font-medium">{customerName}</div>
                                <div className="text-brand-slate">{booking.customerEmail}</div>
                            </td>
                            <td className="px-3 py-4 text-sm text-brand-light">{serviceName}</td>
                            <td className="px-3 py-4 text-sm text-brand-slate">{formatDateTime(booking.requestedDateTime)}</td>
                            <td className="px-3 py-4 text-sm text-center bg-brand-dark/60">
                                <div className="flex justify-center items-center" title={`${t.aiRiskScore}: ${booking.riskScore}`}>
                                  <RiskGauge score={booking.riskScore || 0} />
                                </div>
                            </td>
                             <td className="px-3 py-4 text-sm text-brand-slate">
                                <div>{`~${booking.travelTime} min / €${booking.fuelCost?.toFixed(2)}`}</div>
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
            <button onClick={() => setActiveTab('bookings')} className={`px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 ${getTabClass('bookings')}`}>
                <ClipboardListIcon className="w-4 h-4"/>
                {t.adminBookingsTab}
            </button>
            <button onClick={() => setActiveTab('performance')} className={`px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 ${getTabClass('performance')}`}>
                <StarIcon className="w-4 h-4"/>
                {t.adminPerformanceTab}
            </button>
            <button onClick={() => setActiveTab('ai_assistant')} className={`px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 ${getTabClass('ai_assistant')}`}>
                <SparklesIcon className="w-4 h-4" />
                {t.adminAIAssistantTab}
            </button>
             <button onClick={() => setActiveTab('export')} className={`px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 ${getTabClass('export')}`}>
                <DownloadIcon className="w-4 h-4" />
                {t.adminExportTab}
            </button>
          </div>
        </div>
        {renderContent()}
    </div>
  );
}