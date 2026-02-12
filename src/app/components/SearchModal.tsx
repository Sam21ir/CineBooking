import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import { Input } from './ui/input';
import { useAppSelector } from '../../store/hooks';
import type { Movie } from '../../store/slices/moviesSlice';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { movies } = useAppSelector((state) => state.movies);

  // Filter movies based on search query
  const filteredMovies = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    return movies.filter(movie => 
      movie.title.toLowerCase().includes(query) ||
      movie.genre.toLowerCase().includes(query) ||
      movie.synopsis.toLowerCase().includes(query)
    );
  }, [movies, searchQuery]);

  const handleMovieClick = (movieId: string) => {
    navigate(`/movies/${movieId}`);
    onOpenChange(false);
    setSearchQuery('');
  };

  useEffect(() => {
    if (!open) {
      setSearchQuery('');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col bg-gray-900 border-gray-800">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Rechercher un film, un genre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-red-600"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {searchQuery.trim() === '' ? (
            <div className="text-center text-gray-400 py-12">
              <p>Commencez à taper pour rechercher des films</p>
            </div>
          ) : filteredMovies.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <p>Aucun film trouvé pour "{searchQuery}"</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-400 text-sm mb-3">
                {filteredMovies.length} résultat{filteredMovies.length > 1 ? 's' : ''} trouvé{filteredMovies.length > 1 ? 's' : ''}
              </p>
              {filteredMovies.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => handleMovieClick(movie.id)}
                  className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-800 transition-colors text-left group"
                >
                  <img
                    src={movie.imageUrl}
                    alt={movie.title}
                    className="w-16 h-24 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold group-hover:text-red-600 transition-colors truncate">
                      {movie.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">{movie.genre}</p>
                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                      {movie.synopsis}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-yellow-400 text-sm">★ {movie.rating}</span>
                      <span className="text-gray-500 text-sm">•</span>
                      <span className="text-gray-500 text-sm">{movie.duration} min</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

