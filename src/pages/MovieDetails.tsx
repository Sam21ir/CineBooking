import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Star, Play, Plus, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMovieById, fetchMovies } from '../store/slices/moviesSlice';
import { fetchSessionsByMovieId } from '../store/slices/sessionsSlice';
import { toggleMyList } from '../store/slices/myListSlice';
import toast from 'react-hot-toast';
import { Header } from '../app/components/Header';
import { Button } from '../app/components/ui/button';

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedMovie, loading: movieLoading } = useAppSelector((state) => state.movies);
  const { sessions, loading: sessionsLoading } = useAppSelector((state) => state.sessions);
  const { movies: myList } = useAppSelector((state) => state.myList);
  const isInMyList = selectedMovie ? myList.some(m => m.id === selectedMovie.id) : false;

  const handleToggleMyList = () => {
    if (selectedMovie) {
      dispatch(toggleMyList(selectedMovie));
      if (isInMyList) {
        toast.success('Film retiré de votre liste');
      } else {
        toast.success('Film ajouté à votre liste');
      }
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchMovieById(id));
      dispatch(fetchSessionsByMovieId(id));
    }
  }, [dispatch, id]);

  if (movieLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!selectedMovie) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        Movie not found
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0a0a0a]"
    >
      <Header />
      <div className="pt-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="relative"
            >
              <img
                src={selectedMovie.imageUrl}
                alt={selectedMovie.title}
                className="w-full rounded-lg"
              />
            </motion.div>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-white"
            >
              <h1 className="text-5xl font-bold mb-4">{selectedMovie.title}</h1>
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xl">{selectedMovie.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span>{selectedMovie.duration} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(selectedMovie.releaseDate).getFullYear()}</span>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">{selectedMovie.synopsis}</p>
              <div className="mb-6">
                <span className="px-3 py-1 bg-red-600 rounded-full text-sm">
                  {selectedMovie.genre}
                </span>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => window.open(selectedMovie.trailerUrl, '_blank')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Voir la bande-annonce
                </Button>
                <Button
                  onClick={handleToggleMyList}
                  variant={isInMyList ? "default" : "outline"}
                  className={`flex items-center gap-2 ${
                    isInMyList ? 'bg-red-600 hover:bg-red-700' : ''
                  }`}
                >
                  {isInMyList ? (
                    <>
                      <Check className="w-4 h-4" />
                      Dans ma liste
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Ajouter à ma liste
                    </>
                  )}
                </Button>
                {sessions.length > 0 && (
                  <Link to={`/sessions/${id}`}>
                    <Button className="bg-red-600 hover:bg-red-700">
                      Réserver
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

