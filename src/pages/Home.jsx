import MovieCard from '../components/movies/MovieCard'

function Home() {
    const testMovie = {
    id: 1,
    title: "Inception",
    imageUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    rating: "8.8",
    genre: "Sci-Fi"
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Films à l'affiche</h1>
      
      <div className="flex gap-4">
        <MovieCard {...testMovie} />
        <MovieCard {...testMovie} id={2} title="The Dark Knight" />
        <MovieCard {...testMovie} id={3} title="Interstellar" />
      </div>
    </div>
  )
}

export default Home