import { motion } from 'framer-motion'
import Seat from './Seat'

function SeatMap({ seats, selectedSeats, onSeatToggle }) {
  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) {
      acc[seat.row] = []
    }
    acc[seat.row].push(seat)
    return acc
  }, {})

  // Sort rows alphabetically
  const sortedRows = Object.keys(seatsByRow).sort()

  return (
    <div className="bg-dark-light p-8 rounded-lg">
      {/* Screen */}
      <div className="mb-12">
        <div className="h-2 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full mb-2" />
        <p className="text-center text-gray-400 text-sm">Écran</p>
      </div>

      {/* Seats Grid */}
      <div className="space-y-3">
        {sortedRows.map((row) => (
          <motion.div
            key={row}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: row.charCodeAt(0) * 0.05 }}
            className="flex items-center justify-center gap-2"
          >
            {/* Row Label */}
            <span className="text-gray-400 font-bold w-8 text-center">
              {row}
            </span>

            {/* Seats */}
            {seatsByRow[row]
              .sort((a, b) => a.number - b.number)
              .map((seat) => (
                <Seat
                  key={seat.id}
                  seat={seat}
                  isSelected={selectedSeats.includes(seat.id)}
                  onToggle={onSeatToggle}
                />
              ))}

            {/* Row Label (right side) */}
            <span className="text-gray-400 font-bold w-8 text-center">
              {row}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default SeatMap