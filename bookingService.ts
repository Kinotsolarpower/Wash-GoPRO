

import { Booking, BookingStatus, Locale, User } from '../types';
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
          console.log(`SIMULATING: Generating insurance documentation for booking ${id}.`);
        }
    }
    
    console.log(`Simulating email to customer for booking ${id}: Status changed to ${status}`);
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
};