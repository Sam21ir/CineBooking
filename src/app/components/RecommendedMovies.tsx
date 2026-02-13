import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchPersonalizedRecommendations } from '../../store/slices/recommendationsSlice';
import { isAIAvailable } from '../../services/aiService';
import { MovieRow } from './MovieRow';

interface RecommendedMoviesProps {
  movies: any[];
  userPreferences?: {
    favoriteGenres?: string[];
    favoriteMovies?: string[];
  };
}

export function RecommendedMovies({ movies, userPreferences }: RecommendedMoviesProps) {
  const dispatch = useAppDispatch();
  const { recommendedMovies, loading } = useAppSelector((state) => state.recommendations);

  // Don't render if AI is not available
  if (!isAIAvailable()) {
    return null;
  }

  useEffect(() => {
    if (movies.length > 0 && recommendedMovies.length === 0) {
      dispatch(fetchPersonalizedRecommendations({
        movies,
        userPreferences,
      }));
    }
  }, [dispatch, movies, userPreferences, recommendedMovies.length]);

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 px-4">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h2 className="text-2xl font-bold text-white">Recommandations IA</h2>
        </div>
        <div className="text-center text-gray-400 py-8">
          <p>Génération de recommandations personnalisées...</p>
        </div>
      </div>
    );
  }

  if (recommendedMovies.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-4 px-4">
        <Sparkles className="w-5 h-5 text-yellow-500" />
        <h2 className="text-2xl font-bold text-white">Recommandations IA</h2>
        <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">
          Powered by Gemini AI
        </span>
      </div>
      <MovieRow title="" movies={recommendedMovies} />
    </motion.div>
  );
}

