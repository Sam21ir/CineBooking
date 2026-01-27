import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMovies } from '../store/slices/moviesSlice'
import { fetchSessionsByMovie } from '../store/slices/sessionsSlice'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Film } from 'lucide-react'

function SessionSelection() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { movies } = useSelector((state) => state.movies)
  const { sessions, loading, error } = useSelector((state) => state.sessions)

  const movie = movies.find((m) => m.id === id)

  useEffect(() => {
    if (movies.length === 0) {
      dispatch(fetchMovies())
    }
    dispatch(fetchSessionsByMovie(id))
  }, [dispatch, id, movies.length])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-2xl">Chargement des séances...</p>
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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400 text-2xl">Film non trouvé</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-8 py-12"
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour
      </button>

      {/* Movie Header */}
      <div className="flex gap-6 mb-12">
        <img
          src={movie.imageUrl}
          alt={movie.title}
          className="w-32 h-48 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
          <div className="flex items-center gap-4 text-gray-400">
            <span>{movie.genre}</span>
            <span>•</span>
            <span>{movie.duration} min</span>
            <span>•</span>
            <span>⭐ {movie.rating}/10</span>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">
          Séances disponibles
        </h2>

        {sessions.length === 0 ? (
          <p className="text-gray-400">Aucune séance disponible pour ce film</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <motion.div
                key={session.id}
                whileHover={{ scale: 1.02 }}
                className="bg-dark-light p-6 rounded-lg border border-dark-lighter hover:border-primary transition cursor-pointer"
                onClick={() => navigate(`/booking/${session.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <span className="text-white font-semibold">
                        {new Date(session.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <span className="text-white text-xl font-bold">
                        {session.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Film className="w-5 h-5 text-primary" />
                      <span className="text-gray-400">
                        {session.format} • {session.language}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-400 mb-1">
                      {session.availableSeats} places disponibles
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {session.price.toFixed(2)} €
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default SessionSelection