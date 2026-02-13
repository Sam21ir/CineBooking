import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Ticket, MapPin } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchBookingHistory } from '../../store/slices/bookingsSlice';
import { fetchMovies } from '../../store/slices/moviesSlice';
import { Card } from './ui/card';
import { Button } from './ui/button';

export function BookingHistory() {
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.users);
  const { bookingHistory, loading } = useAppSelector((state) => state.bookings);
  const { movies } = useAppSelector((state) => state.movies);

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchBookingHistory(currentUser.id));
    }
    // Fetch movies if not loaded (needed to display movie titles)
    if (movies.length === 0) {
      dispatch(fetchMovies());
    }
  }, [dispatch, currentUser, movies.length]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Loading booking history...</p>
      </div>
    );
  }

  if (bookingHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg mb-2">No bookings yet</p>
        <p className="text-gray-500 text-sm mb-6">Start booking your favorite movies!</p>
        <Link to="/movies">
          <Button className="bg-red-600 hover:bg-red-700">
            Browse Movies
          </Button>
        </Link>
      </div>
    );
  }

  const getMovieTitle = (movieId: string) => {
    const movie = movies.find(m => m.id === movieId);
    return movie?.title || 'Unknown Movie';
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Booking History</h2>
      {bookingHistory.map((booking, index) => (
        <motion.div
          key={booking.id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="p-6 bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="bg-red-600/20 p-3 rounded-lg">
                    <Ticket className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {getMovieTitle(booking.movieId)}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(booking.bookingDate).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>Seats: {booking.seats}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          booking.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                          booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {booking.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Total</p>
                  <p className="text-white font-bold text-xl">{booking.totalPrice.toFixed(2)} €</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">Reference</p>
                  <p className="text-gray-500 text-xs font-mono">{booking.qrCode}</p>
                </div>
                <Link to={`/confirmation?bookingId=${booking.id}`}>
                  <Button variant="outline" size="sm" className="mt-2">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

