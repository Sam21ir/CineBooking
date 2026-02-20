import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Download, Trash2, X, Loader2 } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addNotification } from '../store/slices/notificationsSlice';
import { clearCurrentBooking } from '../store/slices/bookingsSlice';
import { Header } from '../app/components/Header';
import { Button } from '../app/components/ui/button';
import { Card } from '../app/components/ui/card';
import {
  sendAllBookingWebhooks,
  sendCancellationWebhook,
} from '../services/webhookService';

export default function Confirmation() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentBooking } = useAppSelector((state) => state.bookings);
  const { selectedMovie } = useAppSelector((state) => state.movies);
  const { selectedSession } = useAppSelector((state) => state.sessions);

  // ── État modal d'annulation ───────────────────────────────────────────────
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  // ── Envoi des webhooks post-confirmation ─────────────────────────────────
  useEffect(() => {
    if (!currentBooking) {
      navigate('/');
      return;
    }

    // Notification Redux
    dispatch(addNotification({
      type: 'booking',
      title: 'Réservation confirmée !',
      message: `Votre réservation pour "${selectedMovie?.title}" est confirmée. Référence: ${currentBooking.qrCode}`,
      link: '/confirmation',
    }));

    // Workflows n8n : confirmation + rappel + Google Sheets (non-bloquant)
    if (selectedMovie && selectedSession) {
      // Construit un ISO 8601 pour le nœud Wait du workflow rappel
      const seanceDateTime = selectedSession.date
        ? `${selectedSession.date}T${selectedSession.time ?? '00:00'}:00`
        : new Date().toISOString();

      sendAllBookingWebhooks(
        currentBooking,
        selectedMovie.title,
        new Date(selectedSession.date).toLocaleDateString('fr-FR'),
        selectedSession.time,
        seanceDateTime
      );
    }
  }, [currentBooking, navigate, dispatch, selectedMovie, selectedSession]);

  if (!currentBooking) return null;

  // ── Annulation ────────────────────────────────────────────────────────────
  const handleConfirmCancel = async () => {
    if (!currentBooking || !selectedMovie || !selectedSession) return;

    setIsCancelling(true);
    try {
      // 1. Webhook n8n : email annulation + Google Sheets (non-bloquant)
      await sendCancellationWebhook(
        currentBooking,
        selectedMovie.title,
        new Date(selectedSession.date).toLocaleDateString('fr-FR'),
        selectedSession.time
      );

      // 2. Notification Redux
      dispatch(addNotification({
        type: 'booking',
        title: 'Réservation annulée',
        message: `Votre réservation pour "${selectedMovie.title}" a été annulée.`,
        link: '/',
      }));

      // 3. Nettoyer le store et afficher l'état annulé
      dispatch(clearCurrentBooking());
      setIsCancelled(true);
    } catch {
      // Même en cas d'erreur inattendue, on affiche l'annulation
      setIsCancelled(true);
    } finally {
      setIsCancelling(false);
      setShowCancelModal(false);
    }
  };

  // ── Vue "Annulée" ─────────────────────────────────────────────────────────
  if (isCancelled) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-[#0a0a0a] flex flex-col"
      >
        <Header />
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="max-w-md text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
              className="mb-6"
            >
              <X className="w-20 h-20 text-red-500 mx-auto" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-3">Réservation annulée</h1>
            <p className="text-gray-400 mb-2">
              Un email de confirmation d'annulation vous a été envoyé.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Le remboursement sera effectué sous 3 à 5 jours ouvrés.
            </p>
            <Link to="/">
              <Button className="bg-red-600 hover:bg-red-700">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Vue principale ────────────────────────────────────────────────────────
  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          @page { margin: 0; size: A4; }
          body * { visibility: hidden; }
          #ticket-card, #ticket-card * { visibility: visible; }
          #ticket-card {
            position: absolute; left: 0; top: 0; width: 100%;
            background: white !important; color: black !important;
            padding: 2cm; box-shadow: none; border: none;
          }
          #ticket-card .text-white  { color: black !important; }
          #ticket-card .text-gray-400 { color: #666 !important; }
          #ticket-card .bg-gray-900 { background: white !important; }
          .no-print { display: none !important; }
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-[#0a0a0a]"
      >
        <Header />
        <div className="container mx-auto px-4 py-12 pt-32">
          <div className="max-w-2xl mx-auto text-center">

            {/* Icône ✓ */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-6"
            >
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
            </motion.div>

            <h1 className="text-4xl font-bold text-white mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-gray-400 mb-8">
              Your tickets have been reserved successfully
            </p>

            {/* Ticket */}
            <Card id="ticket-card" className="p-8 bg-gray-900 border-gray-800 mb-6 print-only">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="bg-white p-4 rounded-lg">
                  <QRCode value={currentBooking.qrCode} size={200} />
                </div>

                <div className="flex-1 text-left">
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm">Booking Reference</p>
                    <p className="text-white font-mono text-lg">{currentBooking.qrCode}</p>
                  </div>

                  {selectedMovie && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm">Movie</p>
                      <p className="text-white font-semibold">{selectedMovie.title}</p>
                    </div>
                  )}

                  {selectedSession && (
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm">Date & Time</p>
                      <p className="text-white font-semibold">
                        {new Date(selectedSession.date).toLocaleDateString('fr-FR')} at {selectedSession.time}
                      </p>
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="text-gray-400 text-sm">Seats</p>
                    <p className="text-white font-semibold">{currentBooking.seats}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-400 text-sm">Total</p>
                    <p className="text-white font-bold text-2xl">
                      {currentBooking.totalPrice.toFixed(2)} €
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center no-print">
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Ticket
              </Button>

              <Link to="/">
                <Button className="bg-red-600 hover:bg-red-700">
                  Back to Home
                </Button>
              </Link>

              {/* Bouton Annuler */}
              <Button
                onClick={() => setShowCancelModal(true)}
                variant="outline"
                className="flex items-center gap-2 border-red-800 text-red-400 hover:bg-red-900/30 hover:text-red-300"
              >
                <Trash2 className="w-4 h-4" />
                Annuler la réservation
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Modal confirmation d'annulation ────────────────────────────────── */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={() => !isCancelling && setShowCancelModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4">
                <Trash2 className="w-12 h-12 text-red-500 mx-auto" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                Annuler la réservation ?
              </h2>
              <p className="text-gray-400 mb-2 text-sm">
                Cette action est irréversible.
              </p>

              {selectedMovie && (
                <div className="bg-gray-800 rounded-lg px-4 py-3 mb-6 text-left">
                  <p className="text-gray-400 text-xs mb-1">Réservation concernée</p>
                  <p className="text-white font-semibold">{selectedMovie.title}</p>
                  {selectedSession && (
                    <p className="text-gray-400 text-sm">
                      {new Date(selectedSession.date).toLocaleDateString('fr-FR')} · {selectedSession.time}
                    </p>
                  )}
                  <p className="text-gray-400 text-sm">
                    Sièges : {currentBooking.seats} · {currentBooking.totalPrice.toFixed(2)} €
                  </p>
                </div>
              )}

              <p className="text-gray-500 text-xs mb-6">
                Un email de confirmation d'annulation vous sera envoyé automatiquement.<br />
                Remboursement sous 3 à 5 jours ouvrés.
              </p>

              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelModal(false)}
                  disabled={isCancelling}
                  className="flex-1"
                >
                  Garder ma réservation
                </Button>
                <Button
                  onClick={handleConfirmCancel}
                  disabled={isCancelling}
                  className="flex-1 bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Annulation...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Confirmer l'annulation
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
