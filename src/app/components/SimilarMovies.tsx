import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shuffle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSimilarMovies } from '../../store/slices/recommendationsSlice';
import { Movie } from '../../store/slices/moviesSlice';
import { MovieRow } from './MovieRow';

interface SimilarMoviesProps {
  movie: Movie;
  allMovies: Movie[];
}

export function SimilarMovies({ movie, allMovies }: SimilarMoviesProps) {
  const dispatch = useAppDispatch();
  const { similarMovies, loading } = useAppSelector((state) => state.recommendations);

  useEffect(() => {
    if (movie && allMovies.length > 0) {
      dispatch(fetchSimilarMovies({ movie, allMovies }));
    }
  }, [dispatch, movie, allMovies]);

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 px-4">
          <Shuffle className="w-5 h-5 text-blue-500" />
          <h2 className="text-2xl font-bold text-white">Films Similaires</h2>
        </div>
        <div className="text-center text-gray-400 py-8">
          <p>Recherche de films similaires...</p>
        </div>
      </div>
    );
  }

  if (similarMovies.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-4 px-4">
        <Shuffle className="w-5 h-5 text-blue-500" />
        <h2 className="text-2xl font-bold text-white">Films Similaires</h2>
        <span className="text-xs text-blue-500 bg-blue-500/10 px-2 py-1 rounded">
          IA
        </span>
      </div>
      <MovieRow title="" movies={similarMovies} />
    </motion.div>
  );
}

