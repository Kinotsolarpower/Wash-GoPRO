import { Booking, User, ServicePackage, Locale } from '../types';
import { DELIVERY_SURCHARGE } from '../config';

// Helper to correctly format a value for CSV, handling commas and quotes.
const escapeCSV = (value: string | number | undefined | null): string => {
  if (value === undefined || value === null) {
    return '""';
  }
  const stringValue = String(value);
  // If the string contains a comma, double quote, or newline, wrap it in double quotes.
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    // Also, any double quotes within the string must be escaped by another double quote.
    const escapedString = stringValue.replace(/"/g, '""');
    return `"${escapedString}"`;
  }
  return `"${stringValue}"`;
};

const convertToCSV = (headers: string[], data: (string | number | undefined | null)[][]): string => {
  const headerRow = headers.join(',');
  const dataRows = data.map(row => row.map(escapeCSV).join(','));
  return [headerRow, ...dataRows].join('\n');
};

const exportBookingsToCSV = (
    bookings: Booking[], 
    users: User[], 
    servicePackages: ServicePackage[], 
    locale: Locale
): string => {
    const headers = [
        "Booking ID", "Status", "Requested Date", "Requested Time",
        "Service Name", "Base Price", "SOS Surcharge", "Delivery Surcharge", "Final Price",
        "Customer First Name", "Customer Last Name", "Customer Email", "Customer Phone",
        "Pickup Address", "Delivery Address",
        "Vehicle Make", "Vehicle Model", "Vehicle Color",
        "AI Risk Score", "Travel Time (min)", "Fuel Cost (eur)",
        "Assigned Technician", "Technician Notes"
    ];

    const data = bookings.map(booking => {
        const customer = users.find(u => u.email === booking.customerEmail);
        const servicePackage = servicePackages.find(p => p.key === booking.serviceKey);
        const serviceDetails = servicePackage?.details[locale];
        
        const basePrice = serviceDetails?.price || 0;
        const sosSurcharge = booking.sos ? parseFloat((basePrice * 0.3).toFixed(2)) : 0;
        const deliverySurcharge = booking.deliveryAddress ? DELIVERY_SURCHARGE : 0;

        return [
            booking.id,
            booking.status,
            new Date(booking.requestedDateTime).toLocaleDateString(locale),
            new Date(booking.requestedDateTime).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' }),
            serviceDetails?.name || booking.serviceKey,
            basePrice,
            sosSurcharge,
            deliverySurcharge,
            booking.finalPrice,
            customer?.firstName || 'Guest',
            customer?.lastName || '',
            booking.customerEmail,
            customer?.phone,
            booking.pickupAddress,
            booking.deliveryAddress,
            booking.make,
            booking.model,
            booking.color,
            booking.riskScore,
            booking.travelTime,
            booking.fuelCost,
            booking.assignedTechnician,
            booking.technicianDamageNotes?.join('; ')
        ];
    });

    return convertToCSV(headers, data);
};

const exportUsersToCSV = (users: User[]): string => {
    const headers = ["First Name", "Last Name", "Email", "Phone", "Address", "Role"];
    const data = users.map(user => [
        user.firstName,
        user.lastName,
        user.email,
        user.phone,
        user.address,
        user.role
    ]);
    return convertToCSV(headers, data);
};

export const exportService = {
  exportBookingsToCSV,
  exportUsersToCSV,
};
