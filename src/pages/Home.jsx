import MovieGrid from '../components/movies/MovieGrid'
import Hero from '../components/common/Hero'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMovies } from '../store/slices/moviesSlice'
import { motion } from 'framer-motion'

function Home() {
  const dispatch = useDispatch()
  const { movies, loading, error } = useSelector((state) => state.movies)

  useEffect(() => {
    dispatch(fetchMovies())
  }, [dispatch])

  // Featured movie (first one from API)
  const featuredMovie = movies && movies.length > 0 ? movies[0] : null

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-white text-2xl">Chargement des films...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-red-500 text-2xl">Erreur: {error}</p>
        </div>
      )
    }

    if (!movies || movies.length === 0) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-400 text-2xl">Aucun film disponible</p>
        </div>
      )
    }


      return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {featuredMovie && (
              <Hero
                id={featuredMovie.id}
                title={featuredMovie.title}
                description={featuredMovie.synopsis}
                imageUrl={featuredMovie.imageUrl}
              />
            )}

          <div className="p-8">
            <h2 className="text-3xl font-bold text-white mb-8">Films à l'affiche</h2>
            
            <MovieGrid movies={movies} />
          </div>
        </motion.div>
      )
    }

export default Home