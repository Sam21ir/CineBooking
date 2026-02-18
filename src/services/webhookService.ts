import axios from 'axios';
import { Booking } from '../store/slices/bookingsSlice';

// n8n Webhook URLs - Update these with your actual n8n webhook URLs
const N8N_BOOKING_CONFIRMATION_WEBHOOK = import.meta.env.VITE_N8N_BOOKING_WEBHOOK || 
  'https://79bb3796.kube-ops.com/webhook/booking-confirmation';
// const N8N_SESSION_REMINDER_WEBHOOK = import.meta.env.VITE_N8N_REMINDER_WEBHOOK || 
//   'https://your-n8n-instance.com/webhook/session-reminder';

/**
 * Send booking confirmation webhook to n8n
 * This will trigger n8n workflow for email notification and QR code generation
 */
export async function sendBookingConfirmationWebhook(booking: Booking, movieTitle: string, sessionDate: string, sessionTime: string) {
  // Log webhook URL for debugging
  console.log('🔗 Webhook URL:', N8N_BOOKING_CONFIRMATION_WEBHOOK);
  
  try {
    const payload = {
      bookingId: booking.id,
      userId: booking.userId,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      movieTitle,
      sessionDate,
      sessionTime,
      seats: booking.seats,
      totalPrice: booking.totalPrice,
      qrCode: booking.qrCode,
      bookingDate: booking.bookingDate,
      status: booking.status,
    };

    console.log('📤 Sending webhook payload:', payload);

    const response = await axios.post(N8N_BOOKING_CONFIRMATION_WEBHOOK, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000, // 5 second timeout
    });

    console.log('✅ Webhook sent successfully! Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Failed to send booking confirmation webhook:', error);
    
    // More detailed error logging
    if (error.response) {
      console.error('📛 Response error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error('📛 Request error:', {
        message: 'No response received from server',
        url: N8N_BOOKING_CONFIRMATION_WEBHOOK,
      });
    } else {
      console.error('📛 Error:', error.message);
    }
    
    // Don't throw - webhook failure shouldn't break booking flow
    return null;
  }
}

/**
 * Send session reminder webhook to n8n
 * This can be called by n8n's scheduled workflow or manually
 */
export async function sendSessionReminderWebhook(userEmail: string, movieTitle: string, sessionDate: string, sessionTime: string) {
  try {
    const payload = {
      userEmail,
      movieTitle,
      sessionDate,
      sessionTime,
      reminderType: 'session_reminder',
    };

    const response = await axios.post(N8N_SESSION_REMINDER_WEBHOOK, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });

    return response.data;
  } catch (error) {
    console.error('Failed to send session reminder webhook:', error);
    return null;
  }
}

