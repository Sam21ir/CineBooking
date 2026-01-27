import MovieGrid from '../components/movies/MovieGrid'
import Hero from '../components/common/Hero'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMovies } from '../store/slices/moviesSlice'

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
        <div>
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