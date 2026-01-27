import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMovies } from '../store/slices/moviesSlice'
import { Play, Clock, Calendar, Star, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'


function MovieDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { movies, loading, error } = useSelector((state) => state.movies)

  useEffect(() => {
    if (movies.length === 0) {
      dispatch(fetchMovies())
    }
  }, [dispatch, movies.length])

  const movie = movies.find((m) => m.id === id)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-2xl">Chargement...</p>
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

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-400 text-2xl">Film non trouvé</p>
        <button
          onClick={() => navigate('/movies')}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
        >
          Retour aux films
        </button>
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
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0">
          <img
            src={movie.imageUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent" />
        </div>

        <div className="relative h-full container mx-auto px-8 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-8 left-8 flex items-center gap-2 text-white hover:text-primary transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>

          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {movie.title}
            </h1>

            <div className="flex items-center gap-6 text-gray-300 mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-accent text-accent" />
                <span className="font-semibold">{movie.rating}/10</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{movie.duration} min</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{new Date(movie.releaseDate).getFullYear()}</span>
              </div>
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                {movie.genre}
              </span>
            </div>

            <p className="text-lg text-gray-300 mb-8">
              {movie.synopsis}
            </p>

            <div className="flex gap-4">
              <button 
                onClick={() => navigate(`/sessions/${movie.id}`)}
                className="flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition font-semibold"
              >
                <Play className="w-5 h-5" />
                Réserver
              </button>
              <button className="flex items-center gap-2 bg-gray-500/70 text-white px-8 py-3 rounded-lg hover:bg-gray-500/50 transition font-semibold">
                Bande-annonce
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-dark-light p-6 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Genre</h3>
            <p className="text-gray-400">{movie.genre}</p>
          </div>
          <div className="bg-dark-light p-6 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Durée</h3>
            <p className="text-gray-400">{movie.duration} minutes</p>
          </div>
          <div className="bg-dark-light p-6 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Date de sortie</h3>
            <p className="text-gray-400">
              {new Date(movie.releaseDate).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default MovieDetails