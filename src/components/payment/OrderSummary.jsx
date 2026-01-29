import { Calendar, Clock, Film, MapPin } from 'lucide-react'

function OrderSummary({ movie, session, selectedSeats, seats, total }) {
  const getSelectedSeatsDetails = () => {
    return selectedSeats.map(seatId => 
      seats.find(seat => seat.id === seatId)
    ).filter(Boolean)
  }

  const seatsDetails = getSelectedSeatsDetails()

  return (
    <div className="bg-dark-light p-6 rounded-lg">
      <h3 className="text-2xl font-bold text-white mb-6">Récapitulatif</h3>

      {/* Movie Poster & Info */}
      {movie && (
        <div className="flex gap-4 mb-6 pb-6 border-b border-dark-lighter">
          <img
            src={movie.imageUrl}
            alt={movie.title}
            className="w-24 h-36 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h4 className="text-xl font-bold text-white mb-2">
              {movie.title}
            </h4>
            <div className="space-y-1 text-sm text-gray-400">
              <p className="flex items-center gap-2">
                <Film className="w-4 h-4" />
                {movie.genre} • {movie.duration} min
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Session Info */}
      {session && (
        <div className="mb-6 pb-6 border-b border-dark-lighter space-y-2">
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar className="w-4 h-4 text-primary" />
            <span>
              {new Date(session.date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="w-4 h-4 text-primary" />
            <span>{session.time}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Salle {session.roomNumber} • {session.format} • {session.language}</span>
          </div>
        </div>
      )}

      {/* Selected Seats */}
      <div className="mb-6 pb-6 border-b border-dark-lighter">
        <h4 className="text-white font-semibold mb-3">
          Places sélectionnées ({seatsDetails.length})
        </h4>
        <div className="flex flex-wrap gap-2">
          {seatsDetails.map(seat => (
            <span
              key={seat.id}
              className="px-3 py-1 bg-dark rounded-lg text-white text-sm"
            >
              {seat.row}{seat.number}
              {seat.type === 'premium' && ' ⭐'}
            </span>
          ))}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        {seatsDetails.map((seat) => (
          <div key={seat.id} className="flex justify-between text-sm">
            <span className="text-gray-400">
              Place {seat.row}{seat.number}
              {seat.type === 'premium' && ' (Premium)'}
            </span>
            <span className="text-white font-medium">
              {seat.type === 'premium' 
                ? (session.price + 3).toFixed(2) 
                : session.price.toFixed(2)} €
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-4 border-t border-dark-lighter">
        <span className="text-xl font-bold text-white">Total</span>
        <span className="text-3xl font-bold text-primary">
          {total.toFixed(2)} €
        </span>
      </div>
    </div>
  )
}

export default OrderSummary