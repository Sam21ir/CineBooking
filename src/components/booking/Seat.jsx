import { motion } from 'framer-motion'

function Seat({ seat, isSelected, onToggle }) {
  const isOccupied = seat.status === 'occupied'
  const isPMR = seat.type === 'pmr'
  const isPremium = seat.type === 'premium'

  const getSeatColor = () => {
    if (isOccupied) return 'bg-gray-600 cursor-not-allowed'
    if (isSelected) return 'bg-green-500 hover:bg-green-600'
    if (isPremium) return 'bg-accent hover:bg-accent-light'
    if (isPMR) return 'bg-blue-500 hover:bg-blue-600'
    return 'bg-gray-400 hover:bg-gray-300'
  }

  const handleClick = () => {
    if (!isOccupied) {
      onToggle(seat.id)
    }
  }

  return (
    <motion.button
      whileHover={!isOccupied ? { scale: 1.1 } : {}}
      whileTap={!isOccupied ? { scale: 0.95 } : {}}
      onClick={handleClick}
      disabled={isOccupied}
      className={`w-8 h-8 rounded-t-lg text-xs font-bold text-white transition-colors ${getSeatColor()}`}
      title={`${seat.row}${seat.number} - ${seat.type}`}
    >
      {seat.row}{seat.number}
    </motion.button>
  )
}

export default Seat