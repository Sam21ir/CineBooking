import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMovies } from '../store/slices/moviesSlice'
import MovieGrid from '../components/movies/MovieGrid'
import MovieSearch from '../components/movies/MovieSearch'
import MovieFilters from '../components/movies/MovieFilters'

function Movies() {
  const dispatch = useDispatch()
  const { movies, loading, error } = useSelector((state) => state.movies)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')

  useEffect(() => {
    dispatch(fetchMovies())
  }, [dispatch])

  // Get unique genres from movies
  const genres = useMemo(() => {
    const allGenres = movies.map((movie) => movie.genre)
    return [...new Set(allGenres)]
  }, [movies])

  // Filter movies based on search and genre
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGenre = selectedGenre === 'all' || movie.genre === selectedGenre
    return matchesSearch && matchesGenre
  })

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
        
        <div className="space-y-6">
          <MovieSearch 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />
          
          <div>
            <h3 className="text-white font-semibold mb-3">Filtrer par genre</h3>
            <MovieFilters
              genres={genres}
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
            />
          </div>
        </div>
      </div>

      {filteredMovies.length > 0 ? (
        <div>
          <p className="text-gray-400 mb-4">
            {filteredMovies.length} film{filteredMovies.length > 1 ? 's' : ''} trouvé{filteredMovies.length > 1 ? 's' : ''}
          </p>
          <MovieGrid movies={filteredMovies} />
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            Aucun film trouvé
          </p>
        </div>
      )}
    </div>
  )
}

export default Movies