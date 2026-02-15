import { Link } from 'react-router-dom';
import { Play, Plus, ThumbsUp, ChevronDown, Check } from 'lucide-react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleMyList } from '../../store/slices/myListSlice';
import toast from 'react-hot-toast';
import type { Movie } from '../../store/slices/moviesSlice';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useAppDispatch();
  const { movies: myList } = useAppSelector((state) => state.myList);
  const isInMyList = myList.some(m => m.id === movie.id);

  const handleAddToList = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleMyList(movie));
    if (isInMyList) {
      toast.success('Film retiré de votre liste');
    } else {
      toast.success('Film ajouté à votre liste');
    }
  };

  return (
    <Link to={`/movies/${movie.id}`} className="block w-full">
      <div 
        className="group relative w-full cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[2/3] rounded-md overflow-hidden">
          <img 
            src={movie.imageUrl} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          
          {/* Overlay on hover */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-4 animate-in fade-in duration-200">
              <h3 className="text-white font-semibold mb-2">{movie.title}</h3>
              
              <div className="flex items-center gap-2 mb-3">
                <button 
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(movie.trailerUrl, '_blank');
                  }}
                >
                  <Play className="w-4 h-4 fill-black text-black" />
                </button>
                <button 
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                    isInMyList 
                      ? 'bg-red-600 border-2 border-red-600' 
                      : 'border-2 border-gray-400 hover:border-white'
                  }`}
                  onClick={handleAddToList}
                  title={isInMyList ? 'Retirer de ma liste' : 'Ajouter à ma liste'}
                >
                  {isInMyList ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <Plus className="w-4 h-4 text-white" />
                  )}
                </button>
                <button className="w-8 h-8 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition">
                  <ThumbsUp className="w-4 h-4 text-white" />
                </button>
                <button className="w-8 h-8 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition ml-auto">
                  <ChevronDown className="w-4 h-4 text-white" />
                </button>
              </div>
              
              <div className="flex items-center gap-2 text-xs">
                <span className="text-green-500 font-semibold">{movie.rating}/10</span>
                <span className="text-gray-400">{movie.genre}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
