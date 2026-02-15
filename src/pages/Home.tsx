import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMovies, setSelectedMovie } from '../store/slices/moviesSlice';
import { Header } from '../app/components/Header';
import { Hero } from '../app/components/Hero';
import { MovieRow } from '../app/components/MovieRow';
import { TrendingSection } from '../app/components/TrendingSection';
import { RecommendedMovies } from '../app/components/RecommendedMovies';
import { Footer } from '../app/components/Footer';

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { movies, loading, selectedMovie } = useAppSelector((state) => state.movies);
  const { movies: myList } = useAppSelector((state) => state.myList);
  const { currentUser } = useAppSelector((state) => state.users);

  // Define featuredMovie and other derived values first
  const featuredMovie = movies[0];
  const trendingMovies = movies.slice(0, 5);
  const popularMovies = movies.slice(5, 10);
  const newReleases = movies.slice(0, 5).reverse();

  useEffect(() => {
    if (movies.length === 0) {
      dispatch(fetchMovies());
    }
  }, [dispatch, movies.length]);

  // Set featured movie as selected when it loads
  useEffect(() => {
    if (featuredMovie && !selectedMovie) {
      dispatch(setSelectedMovie(featuredMovie));
    }
  }, [dispatch, featuredMovie, selectedMovie]);

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
          movieId={featuredMovie.id}
          trailerUrl={featuredMovie.trailerUrl}
        />
      )}
      
      <div className="relative -mt-20 md:-mt-32 space-y-8 pb-12 pt-8 md:pt-0">
        {loading ? (
          <div className="text-center text-white py-12">Chargement des films...</div>
        ) : (
          <>
            {/* AI-Powered Trending Section */}
            {movies.length > 0 && (
              <TrendingSection movies={movies} />
            )}
            
            {/* AI Personalized Recommendations (if user is logged in) */}
            {currentUser && movies.length > 0 && (
              <RecommendedMovies
                movies={movies}
                userPreferences={{
                  favoriteGenres: myList.length > 0
                    ? [...new Set(myList.map(m => m.genre))]
                    : undefined,
                  favoriteMovies: myList.map(m => m.title),
                }}
              />
            )}
            
            {trendingMovies.length > 0 && (
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

