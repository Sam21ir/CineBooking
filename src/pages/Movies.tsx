import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMovies } from '../store/slices/moviesSlice';
import { Header } from '../app/components/Header';
import { MovieCard } from '../app/components/MovieCard';

export default function Movies() {
  const dispatch = useAppDispatch();
  const { movies, loading } = useAppSelector((state) => state.movies);

  useEffect(() => {
    if (movies.length === 0) {
      dispatch(fetchMovies());
    }
  }, [dispatch, movies.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0a0a0a]"
    >
      <Header />
      <div className="container mx-auto px-4 py-12 pt-32">
        <h1 className="text-4xl font-bold text-white mb-8">Tous les Films</h1>
        {loading ? (
          <div className="text-center text-white py-12">Chargement des films...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

