import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, Film } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchSessionsByMovieId, setSelectedSession } from '../store/slices/sessionsSlice';
import { Header } from '../app/components/Header';
import { Button } from '../app/components/ui/button';
import { Card } from '../app/components/ui/card';

export default function Sessions() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { sessions, loading } = useAppSelector((state) => state.sessions);
  const { selectedMovie } = useAppSelector((state) => state.movies);

  useEffect(() => {
    if (id) {
      dispatch(fetchSessionsByMovieId(id));
    }
  }, [dispatch, id]);

  const handleSelectSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      dispatch(setSelectedSession(session));
      navigate(`/booking/${sessionId}`);
    }
  };

  // Group sessions by date
  const sessionsByDate = sessions.reduce((acc, session) => {
    if (!acc[session.date]) {
      acc[session.date] = [];
    }
    acc[session.date].push(session);
    return acc;
  }, {} as Record<string, typeof sessions>);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0a0a0a]"
    >
      <Header />
      <div className="container mx-auto px-4 py-12 pt-32">
        <h1 className="text-4xl font-bold text-white mb-2">
          Select a Session
        </h1>
        {selectedMovie && (
          <p className="text-gray-400 mb-8">{selectedMovie.title}</p>
        )}
        
        {loading ? (
          <div className="text-center text-white py-12">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-white py-12">
            <p className="text-xl mb-4">Aucune séance disponible pour ce film</p>
            <p className="text-gray-400 mb-4">
              Les séances doivent être ajoutées dans MockAPI avec le movieId correspondant.
            </p>
            <Button onClick={() => navigate(-1)} className="bg-red-600 hover:bg-red-700">
              Retour
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(sessionsByDate).map(([date, dateSessions]) => (
              <div key={date}>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {new Date(date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {dateSessions.map((session) => (
                    <Card
                      key={session.id}
                      className="p-4 bg-gray-900 border-gray-800 hover:border-red-600 transition-colors cursor-pointer"
                      onClick={() => handleSelectSession(session.id)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-white font-semibold">{session.time}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Film className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300 text-sm">{session.format} - {session.language}</span>
                      </div>
                      <div className="text-gray-400 text-sm mb-2">
                        Salle {session.roomNumber}
                      </div>
                      <div className="text-red-600 font-bold">
                        {session.price.toFixed(2)} €
                      </div>
                      <div className="text-gray-500 text-xs mt-2">
                        {session.availableSeats} places disponibles
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

