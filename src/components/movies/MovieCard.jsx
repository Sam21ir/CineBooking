import { Play, Plus, Star } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function MovieCard({ id, title, imageUrl, rating, genre }) {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/movies/${id}`)
  }

  return (
    <div 
      className="group relative flex-shrink-0 w-64 cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="relative aspect-[2/3] rounded-md overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay on hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-4 animate-in fade-in duration-200">
            <h3 className="text-white font-semibold mb-2">{title}</h3>
            
            <div className="flex items-center gap-2 mb-3">
              <button 
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary-dark transition"
                onClick={(e) => {
                  e.stopPropagation()
                  // TODO: Play trailer
                }}
              >
                <Play className="w-5 h-5 fill-white text-white" />
              </button>
              <button 
                className="w-10 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition"
                onClick={(e) => {
                  e.stopPropagation()
                  // TODO: Add to favorites
                }}
              >
                <Plus className="w-5 h-5 text-white" />
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="text-white font-semibold">{rating}</span>
              </div>
              <span className="text-gray-400">{genre}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieCard