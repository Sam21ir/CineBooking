import { Play, Plus, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function MovieCard({ id, title, imageUrl, rating, genre }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/movies/${id}`)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className="group relative flex-shrink-0 w-full cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-4"
        >
          <h3 className="text-white font-semibold mb-2">{title}</h3>
          
          <div className="flex items-center gap-2 mb-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <Play className="w-5 h-5 fill-white text-white" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <Plus className="w-5 h-5 text-white" />
            </motion.button>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="text-white font-semibold">{rating}</span>
            </div>
            <span className="text-gray-400">{genre}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default MovieCard