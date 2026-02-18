import axios from 'axios';
import { Booking } from '../store/slices/bookingsSlice';

// ─── URLs Webhooks n8n ────────────────────────────────────────────────────────

const N8N_BOOKING_CONFIRMATION_WEBHOOK = import.meta.env.VITE_N8N_BOOKING_WEBHOOK ||
  'https://79bb3796.kube-ops.com/webhook/booking-confirmation';

const N8N_REMINDER_WEBHOOK = import.meta.env.VITE_N8N_REMINDER_WEBHOOK || 'https://79bb3796.kube-ops.com/webhook/cinebooking-reminder';
const N8N_SHEETS_WEBHOOK = import.meta.env.VITE_N8N_SHEETS_WEBHOOK || 'https://79bb3796.kube-ops.com/webhook/cinebooking-sheets';
const N8N_CANCEL_WEBHOOK = import.meta.env.VITE_N8N_CANCEL_WEBHOOK || 'https://79bb3796.kube-ops.com/webhook/cinebooking-cancel';

// ─── Helper interne ───────────────────────────────────────────────────────────

async function postWebhook(url: string, payload: object, label: string): Promise<unknown> {
  if (!url) {
    console.warn(`⚠️ Webhook "${label}" non configuré (URL manquante).`);
    return null;
  }
  try {
    console.log(`📤 [${label}] Envoi du payload:`, payload);
    const response = await axios.post(url, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000,
    });
    console.log(`✅ [${label}] Succès:`, response.data);
    return response.data;
  } catch (error: any) {
    // NON-BLOQUANT : ne jamais bloquer le flux de réservation
    console.error(`❌ [${label}] Échec (non-bloquant):`, error);
    if (error.response) {
      console.error(`📛 Réponse erreur:`, {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error(`📛 Pas de réponse du serveur:`, url);
    } else {
      console.error(`📛 Erreur:`, error.message);
    }
    return null;
  }
}

// ─── Workflow 1 — Confirmation de réservation (existant) ─────────────────────

/**
 * Send booking confirmation webhook to n8n
 * This will trigger n8n workflow for email notification and QR code generation
 */
export async function sendBookingConfirmationWebhook(
  booking: Booking,
  movieTitle: string,
  sessionDate: string,
  sessionTime: string
) {
  console.log('🔗 Webhook URL:', N8N_BOOKING_CONFIRMATION_WEBHOOK);

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

  return postWebhook(N8N_BOOKING_CONFIRMATION_WEBHOOK, payload, 'Confirmation réservation');
}

// ─── Workflow 2 — Rappel séance 2h avant ─────────────────────────────────────

/**
 * Programme un rappel automatique envoyé 2h avant la séance.
 * Le nœud Wait de n8n calcule le délai à partir de seanceDateTime.
 * Appeler en même temps que sendBookingConfirmationWebhook.
 */
export async function sendSeanceReminderWebhook(
  booking: Booking,
  movieTitle: string,
  sessionDate: string,
  sessionTime: string,
  seanceDateTime: string   // ISO 8601 ex: "2025-06-20T20:30:00"
) {
  const payload = {
    bookingId: booking.id,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    movieTitle,
    sessionDate,
    sessionTime,
    seanceDateTime,          // utilisé par le nœud Wait de n8n
    seats: booking.seats,
    totalPrice: booking.totalPrice,
  };

  return postWebhook(N8N_REMINDER_WEBHOOK, payload, 'Rappel séance');
}

// ─── Workflow 3 — Google Sheets dashboard admin ───────────────────────────────

/**
 * Logue chaque réservation dans le Google Sheet admin en temps réel.
 * Appeler en même temps que sendBookingConfirmationWebhook.
 */
export async function sendSheetsLogWebhook(
  booking: Booking,
  movieTitle: string,
  sessionDate: string,
  sessionTime: string
) {
  const payload = {
    bookingId: booking.id,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    movieTitle,
    sessionDate,
    sessionTime,
    seats: booking.seats,
    seatsCount: booking.seats.length,
    totalPrice: booking.totalPrice,
    bookingDate: booking.bookingDate,
    status: booking.status,
  };

  return postWebhook(N8N_SHEETS_WEBHOOK, payload, 'Google Sheets log');
}

// ─── Workflow 6 — Annulation de réservation ──────────────────────────────────

/**
 * Déclenche l'email d'annulation client + le log Google Sheets.
 * Appeler APRÈS avoir annulé la réservation dans MockAPI.
 */
export async function sendCancellationWebhook(
  booking: Booking,
  movieTitle: string,
  sessionDate: string,
  sessionTime: string
) {
  const payload = {
    bookingId: booking.id,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    movieTitle,
    sessionDate,
    sessionTime,
    seats: booking.seats,
    seatsCount: booking.seats.length,
    totalPrice: booking.totalPrice,
    cancelledAt: new Date().toISOString(),
  };

  return postWebhook(N8N_CANCEL_WEBHOOK, payload, 'Annulation réservation');
}

// ─── Helper : lancer tous les workflows post-checkout en parallèle ────────────

/**
 * Lance confirmation + rappel + Google Sheets en parallèle (non-bloquant).
 * Remplace les 3 appels séparés dans ta page Confirmation.
 *
 * @example
 * // Dans ConfirmationPage.tsx, après création de la réservation :
 * sendAllBookingWebhooks(booking, movie.title, session.date, session.time, session.dateTime);
 */
export async function sendAllBookingWebhooks(
  booking: Booking,
  movieTitle: string,
  sessionDate: string,
  sessionTime: string,
  seanceDateTime: string
): Promise<void> {
  // Promise.allSettled : les 3 s'exécutent même si l'un échoue
  await Promise.allSettled([
    sendBookingConfirmationWebhook(booking, movieTitle, sessionDate, sessionTime),
    sendSeanceReminderWebhook(booking, movieTitle, sessionDate, sessionTime, seanceDateTime),
    sendSheetsLogWebhook(booking, movieTitle, sessionDate, sessionTime),
  ]);
}

// ─── (Legacy) sendSessionReminderWebhook — conservé pour compatibilité ────────

/**
 * @deprecated Utilise sendSeanceReminderWebhook à la place.
 */
export async function sendSessionReminderWebhook(
  userEmail: string,
  movieTitle: string,
  sessionDate: string,
  sessionTime: string
) {
  const payload = {
    userEmail,
    movieTitle,
    sessionDate,
    sessionTime,
    reminderType: 'session_reminder',
  };

  return postWebhook(N8N_REMINDER_WEBHOOK, payload, 'Rappel séance (legacy)');
}