import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Download } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addNotification } from '../store/slices/notificationsSlice';
import { Header } from '../app/components/Header';
import { Button } from '../app/components/ui/button';
import { Card } from '../app/components/ui/card';

export default function Confirmation() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentBooking } = useAppSelector((state) => state.bookings);
  const { selectedMovie } = useAppSelector((state) => state.movies);
  const { selectedSession } = useAppSelector((state) => state.sessions);

  useEffect(() => {
    if (!currentBooking) {
      navigate('/');
    } else {
      // Add notification when booking is confirmed
      dispatch(addNotification({
        type: 'booking',
        title: 'Réservation confirmée !',
        message: `Votre réservation pour "${selectedMovie?.title}" est confirmée. Référence: ${currentBooking.qrCode}`,
        link: '/confirmation',
      }));
    }
  }, [currentBooking, navigate, dispatch, selectedMovie]);

  if (!currentBooking) {
    return null;
  }

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          body * {
            visibility: hidden;
          }
          #ticket-card,
          #ticket-card * {
            visibility: visible;
          }
          #ticket-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 2cm;
            box-shadow: none;
            border: none;
          }
          #ticket-card .text-white {
            color: black !important;
          }
          #ticket-card .text-gray-400 {
            color: #666 !important;
          }
          #ticket-card .bg-gray-900 {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
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
                  <p className="text-white font-bold text-2xl">{currentBooking.totalPrice.toFixed(2)} €</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-4 justify-center no-print">
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
          </div>
        </div>
      </div>
    </motion.div>
    </>
  );
}

