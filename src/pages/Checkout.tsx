import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { createBooking } from '../store/slices/bookingsSlice';
import { clearSelectedSeats } from '../store/slices/seatsSlice';
import { sendBookingConfirmationWebhook } from '../services/webhookService';
import { Header } from '../app/components/Header';
import { Button } from '../app/components/ui/button';
import { Input } from '../app/components/ui/input';
import { Label } from '../app/components/ui/label';
import { Card } from '../app/components/ui/card';
import { calculateTotal, roundToTwoDecimals } from '../utils/priceCalculation';

interface CheckoutFormData {
  customerName: string;
  customerEmail: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>();
  const { selectedSeats, seats } = useAppSelector((state) => state.seats);
  const { selectedSession } = useAppSelector((state) => state.sessions);
  const { selectedMovie } = useAppSelector((state) => state.movies);
  const { currentUser } = useAppSelector((state) => state.users);
  const { loading } = useAppSelector((state) => state.bookings);

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (selectedSession && selectedSeats.length > 0) {
      setTotalPrice(roundToTwoDecimals(calculateTotal(selectedSession.price, selectedSeats.length)));
    }
  }, [selectedSession, selectedSeats]);

  useEffect(() => {
    // Check if user navigated here without selecting seats
    if (selectedSeats.length === 0) {
      const timer = setTimeout(() => {
        navigate('/');
        toast.error('Veuillez sélectionner des sièges d\'abord');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []); // Only check on mount

  const onSubmit = async (data: CheckoutFormData) => {
    if (!selectedSession || !selectedMovie || selectedSeats.length === 0) {
      toast.error('Missing booking information');
      return;
    }

    const selectedSeatNumbers = selectedSeats
      .map(seatId => {
        const seat = seats.find(s => s.id === seatId);
        return seat ? `${seat.row}${seat.number}` : '';
      })
      .filter(Boolean)
      .join(',');

    const bookingData = {
      userId: currentUser?.id || '1',
      sessionId: selectedSession.id,
      movieId: selectedMovie.id,
      seats: selectedSeatNumbers,
      totalPrice,
      status: 'confirmed' as const,
      bookingDate: new Date().toISOString(),
      qrCode: `BOOKING-${Date.now()}`,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
    };

    try {
      const createdBooking = await dispatch(createBooking(bookingData)).unwrap();
      dispatch(clearSelectedSeats());
      
      // Send webhook to n8n for email notification and QR code processing
      if (selectedSession && selectedMovie) {
        console.log('🚀 Attempting to send webhook...');
        sendBookingConfirmationWebhook(
          createdBooking,
          selectedMovie.title,
          selectedSession.date,
          selectedSession.time
        )
        .then(result => {
          if (result) {
            console.log('✅ Webhook completed successfully');
          } else {
            console.warn('⚠️ Webhook returned null (check console for errors)');
          }
        })
        .catch(err => {
          console.error('❌ Webhook failed (non-critical):', err);
          // Don't show error to user - webhook is optional
        });
      } else {
        console.warn('⚠️ Cannot send webhook: missing session or movie data');
      }
      
      navigate('/confirmation');
      toast.success('Booking confirmed!');
    } catch (error) {
      toast.error('Failed to create booking');
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0a0a0a]"
    >
      <Header />
      <div className="container mx-auto px-4 py-8 md:py-12 pt-24 md:pt-32">
        <h1 className="text-4xl font-bold text-white mb-8">Checkout</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 bg-gray-900 border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-6">Booking Details</h2>
            
            {selectedMovie && (
              <div className="mb-4">
                <p className="text-gray-400 text-sm">Movie</p>
                <p className="text-white font-semibold">{selectedMovie.title}</p>
              </div>
            )}
            
            {selectedSession && (
              <>
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Date & Time</p>
                  <p className="text-white font-semibold">
                    {new Date(selectedSession.date).toLocaleDateString('fr-FR')} at {selectedSession.time}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Format</p>
                  <p className="text-white font-semibold">{selectedSession.format} - {selectedSession.language}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-400 text-sm">Room</p>
                  <p className="text-white font-semibold">Salle {selectedSession.roomNumber}</p>
                </div>
              </>
            )}
            
            <div className="mb-4">
              <p className="text-gray-400 text-sm">Seats</p>
              <p className="text-white font-semibold">
                {selectedSeats.map(seatId => {
                  const seat = seats.find(s => s.id === seatId);
                  return seat ? `${seat.row}${seat.number}` : '';
                }).filter(Boolean).join(', ')}
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-800">
              <div className="flex justify-between items-center">
                <p className="text-gray-400">Total</p>
                <p className="text-2xl font-bold text-white">{totalPrice.toFixed(2)} €</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gray-900 border-gray-800">
            <h2 className="text-2xl font-semibold text-white mb-6">Customer Information</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-white block mb-2">Full Name</Label>
                <Input
                  id="customerName"
                  {...register('customerName', { required: 'Name is required' })}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  placeholder="Samir El Alami"
                />
                {errors.customerName && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail" className="text-white block mb-2">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  {...register('customerEmail', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="bg-gray-800 border-gray-700 text-white mt-1"
                  placeholder="Samir@example.com"
                />
                {errors.customerEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.customerEmail.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

