
import { Booking, User, Locale, AppTranslations } from '../types';
import { translations } from '../translations';

const sendBookingRequestConfirmation = (booking: Booking, user: User, locale: Locale): void => {
  const t: AppTranslations = translations[locale];
  const customerName = user.firstName || 'Customer';

  const email = {
    to: user.email,
    subject: t.emailSubject_bookingRequest,
    body: `
${t.emailGreeting(customerName)}

${t.emailBody_bookingRequest(booking.id)}

${t.emailSalutation}
    `.trim(),
  };

  console.log('--- SIMULATING BOOKING REQUEST EMAIL ---');
  console.log(`To: ${email.to}`);
  console.log(`Subject: ${email.subject}`);
  console.log('Body:');
  console.log(email.body);
  console.log('------------------------------------');
};

export const emailService = {
  sendBookingRequestConfirmation,
};
