import MovieCard from './MovieCard'

function MovieGrid({ movies, title }) {
  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">Aucun film disponible</p>
      </div>
    )
  }

  return (
    <div className="mb-12">
      {title && (
        <h2 className="text-2xl font-bold text-white mb-6">{title}</h2>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            imageUrl={movie.imageUrl}
            rating={movie.rating}
            genre={movie.genre}
          />
        ))}
      </div>
    </div>
  )
}

export default MovieGrid