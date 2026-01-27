import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMovies } from '../store/slices/moviesSlice'
import MovieGrid from '../components/movies/MovieGrid'
import MovieSearch from '../components/movies/MovieSearch'

function Movies() {
  const dispatch = useDispatch()
  const { movies, loading, error } = useSelector((state) => state.movies)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    dispatch(fetchMovies())
  }, [dispatch])

  // Filter movies based on search
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        <p className="text-gray-400 mb-6">
          Découvrez notre sélection de {movies.length} films
        </p>
        
        <MovieSearch 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />
      </div>

      {filteredMovies.length > 0 ? (
        <MovieGrid movies={filteredMovies} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            Aucun film trouvé pour "{searchTerm}"
          </p>
        </div>
      )}
    </div>
  )
}

export default Movies