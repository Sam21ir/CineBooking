import MovieGrid from '../components/movies/MovieGrid'

function Home() {
  // Dummy data for testing
  const movies = [
    {
      id: 1,
      title: "Inception",
      imageUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      rating: "8.8",
      genre: "Sci-Fi"
    },
    {
      id: 2,
      title: "The Dark Knight",
      imageUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      rating: "9.0",
      genre: "Action"
    },
    {
      id: 3,
      title: "Interstellar",
      imageUrl: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      rating: "8.6",
      genre: "Sci-Fi"
    },
    {
      id: 4,
      title: "The Matrix",
      imageUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      rating: "8.7",
      genre: "Sci-Fi"
    },
    {
      id: 5,
      title: "Pulp Fiction",
      imageUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      rating: "8.9",
      genre: "Crime"
    }
  ]

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-white mb-8">Films à l'affiche</h1>
      
      <MovieGrid movies={movies} />
    </div>
  )
}

export default Home

// import MovieCard from '../components/movies/MovieCard'

// function Home() {
//     const testMovie = {
//     id: 1,
//     title: "Inception",
//     imageUrl: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
//     rating: "8.8",
//     genre: "Sci-Fi"
//   }

//   return (
//     <div className="p-8">
//       <h1 className="text-4xl font-bold text-white mb-8">Films à l'affiche</h1>
      
//       <div className="flex gap-4">
//         <MovieCard {...testMovie} />
//         <MovieCard {...testMovie} id={2} title="The Dark Knight" />
//         <MovieCard {...testMovie} id={3} title="Interstellar" />
//       </div>
//     </div>
//   )
// }

// export default Home