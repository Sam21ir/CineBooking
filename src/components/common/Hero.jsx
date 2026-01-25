import { Play, Info } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Hero({ id, title, description, imageUrl }) {
  const navigate = useNavigate()

  const handlePlayClick = () => {
    navigate(`/movies/${id}`)
  }

  const handleMoreInfoClick = () => {
    navigate(`/movies/${id}`)
  }

  return (
    <div className="relative h-[80vh] w-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative h-full flex items-center px-8 md:px-16">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-gray-200">
            {description}
          </p>
          <div className="flex gap-4">
            <button 
              onClick={handlePlayClick}
              className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-md hover:bg-primary-dark transition font-semibold"
            >
              <Play className="w-5 h-5 fill-current" />
              Réserver
            </button>
            <button 
              onClick={handleMoreInfoClick}
              className="flex items-center gap-2 bg-gray-500/70 text-white px-8 py-3 rounded-md hover:bg-gray-500/50 transition font-semibold"
            >
              <Info className="w-5 h-5" />
              Plus d'infos
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero