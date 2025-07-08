// services/subscriptionService.ts
import { Subscription, User } from '../types';

const SUBSCRIPTIONS_KEY = 'washgo_pro_subscriptions';

export const subscriptionService = {
  // Initialize with some mock data for existing users
  initializeSubscriptions: (users: User[]): void => {
    if (localStorage.getItem(SUBSCRIPTIONS_KEY)) return;
    
    const customer = users.find(u => u.email.includes('customer') || (!u.email.includes('admin') && !u.email.includes('tech')));
    
    if (customer) {
        const mockSubs: Subscription[] = [
            {
                id: `sub_${Date.now()}`,
                userId: customer.email,
                packageKey: 'pkg_1716301538354', // Comprehensive Detailing
                status: 'ACTIVE',
                startDate: new Date().toISOString(),
                washesRemaining: 3
            }
        ];
        localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(mockSubs));
    }
  },

  getSubscriptions: (userId: string): Subscription[] => {
    try {
      const allSubsJson = localStorage.getItem(SUBSCRIPTIONS_KEY);
      const allSubs: Subscription[] = allSubsJson ? JSON.parse(allSubsJson) : [];
      return allSubs.filter(sub => sub.userId === userId);
    } catch (error) {
      console.error("Failed to retrieve subscriptions:", error);
      return [];
    }
  },
  
  updateSubscription: (updatedSub: Subscription): void => {
      try {
          const allSubsJson = localStorage.getItem(SUBSCRIPTIONS_KEY);
          let allSubs: Subscription[] = allSubsJson ? JSON.parse(allSubsJson) : [];
          const index = allSubs.findIndex(s => s.id === updatedSub.id);
          if (index !== -1) {
              allSubs[index] = updatedSub;
              localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(allSubs));
          }
      } catch (error) {
          console.error("Failed to update subscription:", error);
      }
  },

  pauseSubscription: (subscriptionId: string): void => {
    const allSubs = JSON.parse(localStorage.getItem(SUBSCRIPTIONS_KEY) || '[]') as Subscription[];
    const subIndex = allSubs.findIndex(s => s.id === subscriptionId);
    if (subIndex > -1) {
        allSubs[subIndex].status = 'PAUSED';
        localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(allSubs));
    }
  },

  resumeSubscription: (subscriptionId: string): void => {
    const allSubs = JSON.parse(localStorage.getItem(SUBSCRIPTIONS_KEY) || '[]') as Subscription[];
    const subIndex = allSubs.findIndex(s => s.id === subscriptionId);
    if (subIndex > -1) {
        allSubs[subIndex].status = 'ACTIVE';
        localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(allSubs));
    }
  }
};
