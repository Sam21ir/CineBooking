import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchTrendingMovies } from '../../store/slices/recommendationsSlice';
import { isAIAvailable } from '../../services/aiService';
import { Movie } from '../../store/slices/moviesSlice';
import { MovieRow } from './MovieRow';

interface TrendingSectionProps {
  movies: Movie[];
}

export function TrendingSection({ movies }: TrendingSectionProps) {
  const dispatch = useAppDispatch();
  const { trendingMovies, loading } = useAppSelector((state) => state.recommendations);

  // Don't render if AI is not available
  if (!isAIAvailable()) {
    return null;
  }

  useEffect(() => {
    if (movies.length > 0) {
      // Always fetch fresh trending movies (don't cache)
      // This ensures variety each time
      dispatch(fetchTrendingMovies(movies));
    }
  }, [dispatch, movies]);

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 px-4">
          <TrendingUp className="w-5 h-5 text-red-500" />
          <h2 className="text-2xl font-bold text-white">Tendances</h2>
        </div>
        <div className="text-center text-gray-400 py-8">
          <p>Analyse des tendances...</p>
        </div>
      </div>
    );
  }

  if (trendingMovies.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-4 px-4">
        <TrendingUp className="w-5 h-5 text-red-500" />
        <h2 className="text-2xl font-bold text-white">Tendances IA</h2>
        <span className="text-xs text-red-500 bg-red-500/10 px-2 py-1 rounded">
          Powered by Gemini AI
        </span>
      </div>
      <MovieRow title="" movies={trendingMovies} />
    </motion.div>
  );
}

