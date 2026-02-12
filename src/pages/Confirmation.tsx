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

          <Card className="p-8 bg-gray-900 border-gray-800 mb-6">
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

          <div className="flex gap-4 justify-center">
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
  );
}

