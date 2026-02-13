# n8n Workflows Guide for Cinema Booking App

This guide explains how to set up n8n workflows for booking confirmations and session reminders.

## Prerequisites

1. **Install n8n** (if not already installed):
   ```bash
   npm install -g n8n
   # or
   docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
   ```

2. **Access n8n**: Open `http://localhost:5678` in your browser

3. **Set up environment variables** in your React app:
   Create a `.env` file:
   ```
   VITE_N8N_BOOKING_WEBHOOK=https://your-n8n-instance.com/webhook/booking-confirmation
   VITE_N8N_REMINDER_WEBHOOK=https://your-n8n-instance.com/webhook/session-reminder
   ```

---

## Workflow 1: Booking Confirmation (Webhook + QR + Email)

### Purpose
When a booking is confirmed, send an email with booking details and QR code.

### Steps to Create:

1. **Create New Workflow** in n8n
2. **Add Webhook Node**:
   - Method: POST
   - Path: `/webhook/booking-confirmation`
   - Response Mode: "Respond When Last Node Finishes"
   - Authentication: None (or add API key if needed)

3. **Add Set Node** (to format email data):
   - Map webhook data:
     ```
     bookingId: {{ $json.body.bookingId }}
     customerName: {{ $json.body.customerName }}
     customerEmail: {{ $json.body.customerEmail }}
     movieTitle: {{ $json.body.movieTitle }}
     sessionDate: {{ $json.body.sessionDate }}
     sessionTime: {{ $json.body.sessionTime }}
     seats: {{ $json.body.seats }}
     totalPrice: {{ $json.body.totalPrice }}
     qrCode: {{ $json.body.qrCode }}
     ```

4. **Add Email Node** (Gmail/SMTP):
   - To: `{{ $json.customerEmail }}`
   - Subject: `Confirmation de réservation - {{ $json.movieTitle }}`
   - HTML Body:
     ```html
     <h1>Réservation confirmée!</h1>
     <p>Bonjour {{ $json.customerName }},</p>
     <p>Votre réservation pour <strong>{{ $json.movieTitle }}</strong> est confirmée.</p>
     <h2>Détails de la réservation:</h2>
     <ul>
       <li>Date: {{ $json.sessionDate }}</li>
       <li>Heure: {{ $json.sessionTime }}</li>
       <li>Sièges: {{ $json.seats }}</li>
       <li>Prix total: {{ $json.totalPrice }} €</li>
       <li>Référence: {{ $json.qrCode }}</li>
     </ul>
     <h3>QR Code:</h3>
     <p>{{ $json.qrCode }}</p>
     <p>Présentez ce code QR à l'entrée du cinéma.</p>
     ```

5. **Add Respond to Webhook Node**:
   - Response Code: 200
   - Response Body: `{ "success": true, "message": "Email sent" }`

6. **Activate Workflow**

### Test the Webhook:
```bash
curl -X POST http://localhost:5678/webhook/booking-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "bookingId": "1",
    "customerName": "Test User",
    "customerEmail": "test@example.com",
    "movieTitle": "Inception",
    "sessionDate": "2024-01-15",
    "sessionTime": "20:00",
    "seats": "A1,A2",
    "totalPrice": 20,
    "qrCode": "BOOKING-123456"
  }'
```

---

## Workflow 2: Daily Session Reminders (Schedule)

### Purpose
Send daily email reminders to users about their upcoming movie sessions.

### Steps to Create:

1. **Create New Workflow**
2. **Add Schedule Trigger Node**:
   - Trigger Interval: "Every Day"
   - Hour: 9 (9 AM)
   - Minute: 0

3. **Add HTTP Request Node** (to fetch bookings from MockAPI):
   - Method: GET
   - URL: `https://69792073cd4fe130e3db380e.mockapi.io/bookings`
   - Response Format: JSON

4. **Add Code Node** (to filter bookings for today/tomorrow):
   ```javascript
   const bookings = $input.all();
   const today = new Date();
   const tomorrow = new Date(today);
   tomorrow.setDate(tomorrow.getDate() + 1);
   
   const relevantBookings = bookings.filter(booking => {
     const sessionDate = new Date(booking.json.sessionDate);
     return sessionDate.toDateString() === today.toDateString() ||
            sessionDate.toDateString() === tomorrow.toDateString();
   });
   
   return relevantBookings.map(booking => ({
     json: booking.json
   }));
   ```

5. **Add Loop Over Items Node**

6. **Add HTTP Request Node** (to fetch movie details):
   - Method: GET
   - URL: `https://69765d19c0c36a2a9950ecb3.mockapi.io/movies/{{ $json.movieId }}`

7. **Add HTTP Request Node** (to fetch session details):
   - Method: GET
   - URL: `https://69765d19c0c36a2a9950ecb3.mockapi.io/sessions/{{ $json.sessionId }}`

8. **Add Email Node**:
   - To: `{{ $json.customerEmail }}`
   - Subject: `Rappel: {{ $json.movieTitle }} - {{ $json.sessionDate }}`
   - Body:
     ```html
     <h1>Rappel de séance</h1>
     <p>Bonjour {{ $json.customerName }},</p>
     <p>Nous vous rappelons votre réservation pour:</p>
     <ul>
       <li><strong>{{ $json.movieTitle }}</strong></li>
       <li>Date: {{ $json.sessionDate }}</li>
       <li>Heure: {{ $json.sessionTime }}</li>
       <li>Sièges: {{ $json.seats }}</li>
     </ul>
     <p>À bientôt au cinéma!</p>
     ```

9. **Activate Workflow**

---

## Webhook URLs

After creating workflows, copy the webhook URLs:

1. **Booking Confirmation Webhook**:
   - In n8n, open the workflow
   - Click on the Webhook node
   - Copy the "Production URL" (e.g., `https://your-n8n.com/webhook/booking-confirmation`)
   - Add to `.env`: `VITE_N8N_BOOKING_WEBHOOK=<your-url>`

2. **Session Reminder Webhook** (if using manual trigger):
   - Same process as above
   - Add to `.env`: `VITE_N8N_REMINDER_WEBHOOK=<your-url>`

---

## Testing

### Test Booking Confirmation:
1. Complete a booking in the app
2. Check n8n workflow execution logs
3. Verify email is sent

### Test Session Reminder:
1. Wait for scheduled time (or trigger manually)
2. Check n8n workflow execution logs
3. Verify emails are sent to users with upcoming sessions

---

## Production Deployment

For production:
1. Deploy n8n to a server (or use n8n.cloud)
2. Update webhook URLs in `.env`
3. Configure email service (Gmail API, SMTP, SendGrid, etc.)
4. Set up proper authentication for webhooks
5. Monitor workflow executions

---

## Notes

- Webhook failures are non-critical - booking will still succeed even if webhook fails
- Email service requires proper configuration (Gmail API, SMTP credentials, etc.)
- For production, add error handling and retry logic in n8n workflows
- Consider adding webhook authentication (API keys) for security

