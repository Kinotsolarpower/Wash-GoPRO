import React, { useState, useEffect } from 'react';
import { User, AppTranslations, Booking, ServicePackage, Locale, BookingStatus, Subscription } from '../types';
import { bookingService } from '../services/bookingService';
import { subscriptionService } from '../services/subscriptionService';
import { Spinner } from './common/Spinner';
import { CheckCircleIcon, ArrowDownIcon } from './common/Icons';

type CustomerDashboardProps = {
    currentUser: User;
    t: AppTranslations;
    onBookNewService: () => void;
    servicePackages: ServicePackage[];
    locale: Locale;
};

type ActiveTab = 'bookings' | 'subscriptions' | 'claim' | 'chat';

const BeforeAfterModal = ({ booking, imageUrl, onClose, t }: { booking: Booking, imageUrl: string, onClose: () => void, t: AppTranslations }) => (
    <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
        <div className="bg-brand-dark/80 border border-brand-light-accent p-6 rounded-2xl shadow-neumorphic-outer w-full max-w-4xl relative">
            <h3 className="text-xl font-heading font-bold text-brand-light text-center mb-4">{t.beforeAfterModalTitle}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-bold text-brand-slate text-center mb-2">{t.before}</h4>
                    <img src={imageUrl} alt="Before cleaning" className="rounded-lg w-full h-64 object-cover" />
                </div>
                <div>
                    <h4 className="font-bold text-brand-slate text-center mb-2">{t.after}</h4>
                    <img src={booking.afterPhotoUrl} alt="After cleaning" className="rounded-lg w-full h-64 object-cover" />
                </div>
            </div>
            <button onClick={onClose} className="mt-6 w-full bg-brand-accent text-brand-dark font-bold py-2 px-4 rounded-md shadow-neumorphic-outer active:shadow-neumorphic-press">{t.close}</button>
        </div>
    </div>
);

const ExpandedBookingDetails = ({ booking, t, onShowBeforeAfter }: { booking: Booking, t: AppTranslations, onShowBeforeAfter: () => void }) => {
    return (
        <div className="col-span-full bg-brand-dark/30 p-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="text-sm font-bold uppercase text-brand-slate tracking-wider mb-2">{t.technicianNotes}</h4>
                    <div className="bg-brand-dark/50 p-4 rounded-lg shadow-neumorphic-inner font-serif">
                        {booking.technicianDamageNotes && booking.technicianDamageNotes.length > 0 ? (
                            <ul className="space-y-2">
                                {booking.technicianDamageNotes.map((note, index) => (
                                    <li key={index} className="flex items-start gap-2 text-brand-light/90">
                                        <CheckCircleIcon className="w-4 h-4 text-brand-accent/80 flex-shrink-0 mt-0.5"/>
                                        <span className="italic">{note}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : <p className="text-sm text-brand-slate italic">{t.noTechnicianNotes}</p>}
                        <p className="text-xs text-brand-slate/70 mt-3 not-italic">{t.technicianNotesDescription}</p>
                    </div>
                </div>
                <div>
                    {booking.status === BookingStatus.COMPLETED && booking.afterPhotoUrl && (
                        <>
                            <h4 className="text-sm font-bold uppercase text-brand-slate tracking-wider mb-2">{t.beforeAfterModalTitle}</h4>
                             <button onClick={onShowBeforeAfter} className="w-full p-4 bg-brand-dark/50 rounded-lg shadow-neumorphic-inner hover:bg-brand-light-accent/10">
                                <p className="font-bold">{t.viewBeforeAfter}</p>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export function CustomerDashboard({ currentUser, t, onBookNewService, servicePackages, locale }: CustomerDashboardProps) {
    const [activeTab, setActiveTab] = useState<ActiveTab>('bookings');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const userBookings = bookingService.getBookingsByEmail(currentUser.email);
        userBookings.sort((a, b) => new Date(b.requestedDateTime).getTime() - new Date(a.requestedDateTime).getTime());
        setBookings(userBookings);
        const userSubs = subscriptionService.getSubscriptions(currentUser.email);
        setSubscriptions(userSubs);
        setIsLoading(false);
    }, [currentUser.email]);
    
    const handleSubscriptionToggle = (subId: string, status: 'ACTIVE' | 'PAUSED') => {
        if (status === 'ACTIVE') subscriptionService.pauseSubscription(subId);
        else subscriptionService.resumeSubscription(subId);
        setSubscriptions(subscriptionService.getSubscriptions(currentUser.email));
    };

    const toggleBookingDetails = (bookingId: string) => {
        setExpandedBookingId(prevId => prevId === bookingId ? null : bookingId);
    };

    const getTabClass = (tab: ActiveTab) => activeTab === tab ? 'border-brand-accent text-brand-accent' : 'border-transparent text-brand-slate hover:text-brand-light';
    const getStatusChip = (status: BookingStatus) => {
      const statusKey = `status_${status}` as 'status_PENDING' | 'status_CONFIRMED' | 'status_COMPLETED' | 'status_CANCELLED';
      const statusText = t[statusKey] || status;
      let classes = "px-3 py-1 text-xs font-bold rounded-full ";
      switch(status) {
          case BookingStatus.PENDING: classes += "bg-yellow-500/20 text-yellow-300"; break;
          case BookingStatus.CONFIRMED: classes += "bg-green-500/20 text-green-300"; break;
          case BookingStatus.COMPLETED: classes += "bg-blue-500/20 text-blue-300"; break;
          case BookingStatus.CANCELLED: classes += "bg-brand-slate/20 text-brand-slate"; break;
      }
      return <span className={classes}>{statusText}</span>
    };

    const formatDateTime = (isoString: string) => new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(isoString));
    
    const renderBookings = () => (
      <div>
        <h3 className="text-xl font-heading font-bold text-brand-light mb-4">{t.yourBookings}</h3>
        {bookings.length === 0 ? (
            <div className="text-center py-10 px-6 border-2 border-dashed border-brand-slate/30 rounded-lg bg-brand-dark/30 shadow-neumorphic-inner">
                <p className="mt-4 text-brand-slate">{t.noBookingsYet}</p>
            </div>
        ) : (
          <div className="overflow-hidden rounded-lg shadow-neumorphic-inner border border-brand-light-accent/10">
              <div className="grid grid-cols-[1fr,1fr,1fr,auto] bg-brand-dark/30 text-left text-sm font-semibold text-brand-slate uppercase tracking-wider">
                  <div className="py-3.5 px-4 sm:px-6">{t.service}</div>
                  <div className="py-3.5 px-3">{t.requestedOn}</div>
                  <div className="py-3.5 px-3">{t.status}</div>
                  <div className="py-3.5 px-4 sm:pr-6"></div>
              </div>
              <div className="divide-y divide-brand-light-accent/10 bg-brand-dark/20">
                  {bookings.map((booking, index) => {
                      const servicePackage = servicePackages.find(p => p.key === booking.serviceKey);
                      const serviceName = servicePackage?.details[locale]?.name || booking.serviceKey;
                      const isExpanded = expandedBookingId === booking.id;
                      return (
                          <div key={booking.id} className={`grid grid-cols-[1fr,1fr,1fr,auto] items-center transition-colors hover:bg-brand-dark-accent/50 ${index % 2 !== 0 ? 'bg-brand-dark/40' : ''}`}>
                              <div className="py-4 px-4 sm:px-6 text-sm font-medium text-brand-light">{serviceName}</div>
                              <div className="py-4 px-3 text-sm text-brand-slate">{formatDateTime(booking.requestedDateTime)}</div>
                              <div className="py-4 px-3 text-sm">{getStatusChip(booking.status)}</div>
                              <div className="py-4 px-4 sm:pr-6 text-right">
                                <button onClick={() => toggleBookingDetails(booking.id)} className="p-2 rounded-full hover:bg-brand-light-accent/20">
                                  <ArrowDownIcon className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>
                              </div>
                              {isExpanded && <ExpandedBookingDetails booking={booking} t={t} onShowBeforeAfter={() => setIsModalOpen(true)} />}
                          </div>
                      );
                  })}
              </div>
          </div>
        )}
        {isModalOpen && expandedBookingId && <BeforeAfterModal booking={bookings.find(b => b.id === expandedBookingId)!} imageUrl={`https://picsum.photos/seed/${expandedBookingId}/400/300`} onClose={() => setIsModalOpen(false)} t={t} />}
      </div>
    );
    
    const renderSubscriptions = () => (
      <div>
        <h3 className="text-xl font-heading font-bold text-brand-light mb-4">{t.yourSubscriptions}</h3>
        {subscriptions.length === 0 ? <p className="text-brand-slate text-center py-10">{t.noSubscriptions}</p> : (
          <div className="space-y-4">
            {subscriptions.map(sub => {
              const servicePackage = servicePackages.find(p => p.key === sub.packageKey);
              const serviceName = servicePackage?.details[locale]?.name || sub.packageKey;
              const isActive = sub.status === 'ACTIVE';
              return (
                <div key={sub.id} className="bg-brand-dark/60 p-4 rounded-lg shadow-neumorphic-inner flex justify-between items-center">
                  <div>
                    <p className="font-bold text-brand-light">{serviceName}</p>
                    <p className="text-sm text-brand-slate">{sub.washesRemaining} washes remaining</p>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className={`px-3 py-1 text-xs font-bold rounded-full ${isActive ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{isActive ? t.active : t.paused}</span>
                    <button onClick={() => handleSubscriptionToggle(sub.id, sub.status)} className="font-semibold text-sm text-brand-accent hover:underline">{isActive ? t.pauseSubscription : t.resumeSubscription}</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );

    const renderFileClaim = () => (
      <div>
        <h3 className="text-xl font-heading font-bold text-brand-light mb-2">{t.fileClaimTitle}</h3>
        <p className="text-brand-slate text-sm mb-4">{t.claimDescription}</p>
        <form onSubmit={e => {e.preventDefault(); alert(t.claimSubmitted);}} className="space-y-4">
          <input type="text" placeholder={t.bookingIdLabel} className="w-full px-4 py-3 text-brand-light bg-brand-dark-accent border-2 border-brand-light-accent rounded-lg shadow-neumorphic-inner" />
          <textarea placeholder={t.claimDetailsLabel} rows={4} className="w-full px-4 py-3 text-brand-light bg-brand-dark-accent border-2 border-brand-light-accent rounded-lg shadow-neumorphic-inner"></textarea>
          <button type="submit" className="w-full bg-brand-accent text-brand-dark font-bold py-3 px-4 rounded-md shadow-neumorphic-outer active:shadow-neumorphic-press">{t.submitClaim}</button>
        </form>
      </div>
    );
    
    const renderChat = () => (
      <div className="flex flex-col h-96">
        <h3 className="text-xl font-heading font-bold text-brand-light mb-4">{t.liveChatTitle}</h3>
        <div className="flex-grow bg-brand-dark/60 rounded-t-lg shadow-neumorphic-inner p-4 space-y-4 overflow-y-auto">
          <div className="flex justify-end"><p className="bg-brand-accent/80 text-brand-dark p-3 rounded-lg max-w-xs">Hello, I have a question about my last booking.</p></div>
          <div className="flex justify-start"><p className="bg-brand-light-accent p-3 rounded-lg max-w-xs text-brand-light">Hi there! How can I help you today?</p></div>
        </div>
        <form onSubmit={e => e.preventDefault()} className="flex gap-2 p-2 border-t border-brand-light-accent/20 bg-brand-dark rounded-b-lg">
          <input type="text" placeholder={t.chatPlaceholder} className="flex-grow px-4 py-2 text-brand-light bg-brand-dark-accent border-2 border-brand-light-accent rounded-lg shadow-neumorphic-inner"/>
          <button type="submit" className="bg-brand-accent text-brand-dark font-bold p-3 rounded-lg shadow-neumorphic-outer active:shadow-neumorphic-press">{t.send}</button>
        </form>
      </div>
    );

    return (
        <div className="w-full animate-fade-in bg-brand-dark/50 backdrop-blur-xl border border-brand-light-accent p-6 sm:p-8 rounded-2xl shadow-neumorphic-outer">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-3xl font-heading font-bold text-brand-light">{t.customerDashboardTitle}</h2>
                    <p className="text-brand-slate mt-1">{t.welcomeBack(currentUser.firstName)}</p>
                </div>
                <button onClick={onBookNewService} className="relative group overflow-hidden w-full sm:w-auto bg-brand-accent text-brand-dark font-bold py-3 px-6 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-dark focus:ring-brand-accent transition-all shadow-neumorphic-outer active:shadow-neumorphic-press">
                    <span className="relative z-10 bg-gradient-to-r from-yellow-900 to-amber-900 bg-clip-text text-transparent font-extrabold">{t.bookNewService}</span>
                    <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:animate-shimmer"></span>
                </button>
            </div>
            
            <div className="border-b border-brand-light-accent/20 mb-6">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    <button onClick={() => setActiveTab('bookings')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${getTabClass('bookings')}`}>{t.bookingsTab}</button>
                    <button onClick={() => setActiveTab('subscriptions')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${getTabClass('subscriptions')}`}>{t.subscriptionsTab}</button>
                    <button onClick={() => setActiveTab('claim')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${getTabClass('claim')}`}>{t.claimTab}</button>
                    <button onClick={() => setActiveTab('chat')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${getTabClass('chat')}`}>{t.chatTab}</button>
                </nav>
            </div>

            {isLoading ? <Spinner /> : (
              <div>
                {activeTab === 'bookings' && renderBookings()}
                {activeTab === 'subscriptions' && renderSubscriptions()}
                {activeTab === 'claim' && renderFileClaim()}
                {activeTab === 'chat' && renderChat()}
              </div>
            )}
        </div>
    );
}