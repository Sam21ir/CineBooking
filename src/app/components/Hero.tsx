import { Play, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';

interface HeroProps {
  title: string;
  description: string;
  imageUrl: string;
  movieId?: string;
  trailerUrl?: string;
}

export function Hero({ title, description, imageUrl, movieId, trailerUrl }: HeroProps) {
  const navigate = useNavigate();
  const { selectedMovie } = useAppSelector((state) => state.movies);

  const handlePlay = () => {
    if (trailerUrl) {
      window.open(trailerUrl, '_blank');
    } else if (selectedMovie?.trailerUrl) {
      window.open(selectedMovie.trailerUrl, '_blank');
    }
  };

  const handleMoreInfo = () => {
    if (movieId) {
      navigate(`/movies/${movieId}`);
    } else if (selectedMovie?.id) {
      navigate(`/movies/${selectedMovie.id}`);
    }
  };

  return (
    <div className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] w-full mt-16 sm:mt-20 md:mt-0">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative h-full flex items-center px-4 md:px-8 lg:px-16 pt-20 md:pt-0">
        <div className="max-w-2xl space-y-4 md:space-y-6">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white leading-tight">
            {title}
          </h1>
          <p className="text-sm md:text-lg lg:text-xl text-gray-200 line-clamp-2 md:line-clamp-none">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button 
              onClick={handlePlay}
              className="flex items-center justify-center gap-2 bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded-md hover:bg-gray-200 transition font-semibold text-sm md:text-base"
            >
              <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
              Play
            </button>
            <button 
              onClick={handleMoreInfo}
              className="flex items-center justify-center gap-2 bg-gray-500/70 text-white px-6 md:px-8 py-2 md:py-3 rounded-md hover:bg-gray-500/50 transition font-semibold text-sm md:text-base"
            >
              <Info className="w-4 h-4 md:w-5 md:h-5" />
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
