import { motion } from 'framer-motion';
import { useAppSelector } from '../store/hooks';
import { Header } from '../app/components/Header';
import { MovieCard } from '../app/components/MovieCard';
import { Footer } from '../app/components/Footer';

export default function MaListe() {
  const { movies } = useAppSelector((state) => state.myList);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0a0a0a]"
    >
      <Header />
      <div className="container mx-auto px-4 py-12 pt-32">
        <h1 className="text-4xl font-bold text-white mb-8">Ma Liste</h1>
        {movies.length === 0 ? (
          <div className="text-center text-white py-12">
            <p className="text-gray-400 mb-4">Votre liste est vide</p>
            <p className="text-gray-500 text-sm">Ajoutez des films à votre liste pour les retrouver facilement</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </motion.div>
  );
}

