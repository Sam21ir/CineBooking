import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMovies } from '../store/slices/moviesSlice';
import { Header } from '../app/components/Header';
import { MovieCard } from '../app/components/MovieCard';
import { Footer } from '../app/components/Footer';

export default function Populaires() {
  const dispatch = useAppDispatch();
  const { movies, loading } = useAppSelector((state) => state.movies);

  useEffect(() => {
    if (movies.length === 0) {
      dispatch(fetchMovies());
    }
  }, [dispatch, movies.length]);

  // Sort movies by rating (highest first)
  const popularMovies = [...movies].sort((a, b) => b.rating - a.rating);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0a0a0a] overflow-x-hidden"
    >
      <Header />
      <div className="container mx-auto px-3 sm:px-4 py-8 md:py-12 pt-24 md:pt-32 max-w-full overflow-x-hidden">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 md:mb-8">Populaires</h1>
        {loading ? (
          <div className="text-center text-white py-12">Chargement des films...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {popularMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </motion.div>
  );
}

