import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { createBooking } from '../store/slices/bookingsSlice'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock } from 'lucide-react'
import PaymentForm from '../components/payment/PaymentForm'
import OrderSummary from '../components/payment/OrderSummary'

function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)

  // Get data passed from SeatSelection
  const { movie, session, selectedSeats, seats, total } = location.state || {}

  // Redirect if no data
  if (!movie || !session || !selectedSeats || selectedSeats.length === 0) {
    navigate('/')
    return null
  }

  const handlePaymentSubmit = async (paymentData) => {
    setIsLoading(true)

    try {
      // Get selected seats details
      const seatsDetails = selectedSeats.map(seatId =>
        seats.find(seat => seat.id === seatId)
      ).filter(Boolean)

      // Format seats as string (e.g., "A1,A2,B3")
      const seatsString = seatsDetails
        .map(seat => `${seat.row}${seat.number}`)
        .join(',')

      // Create booking data
      const bookingData = {
        userId: '1', // TODO: Replace with real user ID when auth is implemented
        sessionId: session.id,
        movieId: movie.id,
        seats: seatsString,
        totalPrice: total,
        status: 'confirmed',
        bookingDate: new Date().toISOString(),
        qrCode: `BOOKING-${Date.now()}`, // Simple QR code simulation
        customerName: paymentData.name,
        customerEmail: paymentData.email,
      }

      // Create booking in API
      const result = await dispatch(createBooking(bookingData)).unwrap()

      // Navigate to confirmation with booking data
      navigate('/confirmation', {
        state: {
          booking: result,
          movie,
          session,
          seatsDetails,
        }
      })
    } catch (error) {
      console.error('Booking failed:', error)
      alert('Erreur lors de la réservation. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-8 py-12"
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour
      </button>

      <div className="flex items-center gap-3 mb-8">
        <Lock className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-bold text-white">
          Paiement sécurisé
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Payment Form */}
        <div className="lg:col-span-2">
          <div className="bg-dark-light p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-6">
              Informations de paiement
            </h2>
            <PaymentForm onSubmit={handlePaymentSubmit} isLoading={isLoading} />
          </div>
        </div>

        {/* Right: Order Summary */}
        <div>
          <OrderSummary
            movie={movie}
            session={session}
            selectedSeats={selectedSeats}
            seats={seats}
            total={total}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default Checkout