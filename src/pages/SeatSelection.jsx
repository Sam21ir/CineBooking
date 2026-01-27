import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMovies } from '../store/slices/moviesSlice'
import { fetchSessions } from '../store/slices/sessionsSlice'
import { fetchSeatsBySession, toggleSeat } from '../store/slices/seatsSlice'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import SeatMap from '../components/booking/SeatMap'
import SeatLegend from '../components/booking/SeatLegend'
import BookingSummary from '../components/booking/BookingSummary'

function SeatSelection() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { movies } = useSelector((state) => state.movies)
  const { sessions } = useSelector((state) => state.sessions)
  const { seats, selectedSeats, loading } = useSelector((state) => state.seats)

  const session = sessions.find((s) => s.id === sessionId)
  const movie = movies.find((m) => m.id === session?.movieId)

  useEffect(() => {
    if (movies.length === 0) {
      dispatch(fetchMovies())
    }
    if (sessions.length === 0) {
      dispatch(fetchSessions())
    }
    dispatch(fetchSeatsBySession(sessionId))
  }, [dispatch, sessionId, movies.length, sessions.length])

  const handleSeatToggle = (seatId) => {
    dispatch(toggleSeat(seatId))
  }

  const handleProceed = () => {
    // TODO: Navigate to checkout
    alert('Redirection vers le paiement - À implémenter!')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-2xl">Chargement des places...</p>
      </div>
    )
  }

  if (!session || !movie) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 text-2xl">Séance non trouvée</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
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

      <h1 className="text-4xl font-bold text-white mb-8">
        Sélection des places
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Seat Map */}
        <div className="lg:col-span-2">
          <SeatMap
            seats={seats}
            selectedSeats={selectedSeats}
            onSeatToggle={handleSeatToggle}
          />
          <SeatLegend />
        </div>

        {/* Right: Summary */}
        <div>
          <BookingSummary
            selectedSeats={selectedSeats}
            seats={seats}
            session={session}
            movie={movie}
            onProceed={handleProceed}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default SeatSelection