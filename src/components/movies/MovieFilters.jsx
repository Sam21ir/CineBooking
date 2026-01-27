function MovieFilters({ genres, selectedGenre, onGenreChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => onGenreChange('all')}
        className={`px-4 py-2 rounded-lg font-medium transition ${
          selectedGenre === 'all'
            ? 'bg-primary text-white'
            : 'bg-dark-light text-gray-400 hover:text-white'
        }`}
      >
        Tous
      </button>
      
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => onGenreChange(genre)}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            selectedGenre === genre
              ? 'bg-primary text-white'
              : 'bg-dark-light text-gray-400 hover:text-white'
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  )
}

export default MovieFilters