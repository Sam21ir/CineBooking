import { motion } from 'framer-motion'

function BookingSummary({ selectedSeats, seats, session, movie, onProceed }) {
  const getSelectedSeatsDetails = () => {
    return selectedSeats.map(seatId => 
      seats.find(seat => seat.id === seatId)
    ).filter(Boolean)
  }

  const calculateTotal = () => {
    const seatsDetails = getSelectedSeatsDetails()
    const basePrice = session?.price || 0
    
    return seatsDetails.reduce((total, seat) => {
      if (seat.type === 'premium') return total + basePrice + 3
      return total + basePrice
    }, 0)
  }

  const seatsDetails = getSelectedSeatsDetails()
  const total = calculateTotal()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-light p-6 rounded-lg sticky top-8"
    >
      <h3 className="text-xl font-bold text-white mb-4">Récapitulatif</h3>

      {/* Movie Info */}
      {movie && (
        <div className="mb-4 pb-4 border-b border-dark-lighter">
          <p className="text-white font-semibold">{movie.title}</p>
          {session && (
            <div className="text-sm text-gray-400 mt-1">
              <p>{new Date(session.date).toLocaleDateString('fr-FR')}</p>
              <p>{session.time} • {session.format} • {session.language}</p>
            </div>
          )}
        </div>
      )}

      {/* Selected Seats */}
      <div className="mb-4">
        <p className="text-gray-400 text-sm mb-2">Places sélectionnées:</p>
        {seatsDetails.length === 0 ? (
          <p className="text-gray-500 text-sm">Aucune place sélectionnée</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {seatsDetails.map(seat => (
              <span
                key={seat.id}
                className="px-3 py-1 bg-dark text-white rounded text-sm"
              >
                {seat.row}{seat.number}
                {seat.type === 'premium' && ' ⭐'}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      {seatsDetails.length > 0 && (
        <div className="mb-4 pb-4 border-b border-dark-lighter space-y-2">
          {seatsDetails.map((seat, index) => (
            <div key={seat.id} className="flex justify-between text-sm">
              <span className="text-gray-400">
                Place {seat.row}{seat.number} 
                {seat.type === 'premium' && ' (Premium)'}
              </span>
              <span className="text-white">
                {seat.type === 'premium' 
                  ? (session.price + 3).toFixed(2) 
                  : session.price.toFixed(2)} €
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-white font-semibold">Total</span>
        <span className="text-2xl font-bold text-primary">
          {total.toFixed(2)} €
        </span>
      </div>

      {/* Proceed Button */}
      <button
        onClick={onProceed}
        disabled={seatsDetails.length === 0}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          seatsDetails.length === 0
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-primary text-white hover:bg-primary-dark'
        }`}
      >
        Continuer
      </button>

      {seatsDetails.length === 0 && (
        <p className="text-xs text-gray-500 text-center mt-2">
          Veuillez sélectionner au moins une place
        </p>
      )}

      {seatsDetails.length >= 10 && (
        <p className="text-xs text-amber-500 text-center mt-2">
          Maximum 10 places par réservation
        </p>
      )}
    </motion.div>
  )
}

export default BookingSummary