import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMovies } from '../store/slices/moviesSlice';
import { Header } from '../app/components/Header';
import { Hero } from '../app/components/Hero';
import { MovieRow } from '../app/components/MovieRow';
import { Footer } from '../app/components/Footer';

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { movies, loading } = useAppSelector((state) => state.movies);

  useEffect(() => {
    if (movies.length === 0) {
      dispatch(fetchMovies());
    }
  }, [dispatch, movies.length]);

  const trendingMovies = movies.slice(0, 5);
  const popularMovies = movies.slice(5, 10);
  const newReleases = movies.slice(0, 5).reverse();

  const featuredMovie = movies[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0a0a0a]"
    >
      <Header />
      
      {featuredMovie && (
        <Hero
          title={featuredMovie.title}
          description={featuredMovie.synopsis}
          imageUrl={featuredMovie.imageUrl}
        />
      )}
      
      <div className="relative -mt-32 space-y-8 pb-12">
        {loading ? (
          <div className="text-center text-white py-12">Chargement des films...</div>
        ) : (
          <>
            {trendingMovies.length > 0 && (
              <MovieRow title="Tendances" movies={trendingMovies} />
            )}
            {popularMovies.length > 0 && (
              <MovieRow title="Populaires sur CineBooking" movies={popularMovies} />
            )}
            {newReleases.length > 0 && (
              <MovieRow title="Nouveautés" movies={newReleases} />
            )}
          </>
        )}
      </div>
      
      <Footer />
    </motion.div>
  );
}

