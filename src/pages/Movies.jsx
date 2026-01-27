import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMovies } from '../store/slices/moviesSlice'
import MovieGrid from '../components/movies/MovieGrid'

function Movies() {
  const dispatch = useDispatch()
  const { movies, loading, error } = useSelector((state) => state.movies)

  useEffect(() => {
    dispatch(fetchMovies())
  }, [dispatch])

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
  
    return (
    <div className="container mx-auto px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Tous les films
        </h1>
        <p className="text-gray-400">
          Découvrez notre sélection de {movies.length} films
        </p>
      </div>

      <MovieGrid movies={movies} />
    </div>
  )
}

export default Movies