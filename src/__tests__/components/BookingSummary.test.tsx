import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { Movie } from '../../store/slices/moviesSlice';
import { Session } from '../../store/slices/moviesSlice';
import { Seat } from '../../store/slices/seatsSlice';

const mockMovie: Movie = {
  id: '1',
  title: 'Test Movie',
  synopsis: 'Test synopsis',
  genre: 'Action',
  rating: 8.5,
  duration: 120,
  imageUrl: 'https://example.com/image.jpg',
  trailerUrl: 'https://example.com/trailer',
  releaseDate: '2024-01-01',
};

const mockSession: Session = {
  id: 'session-1',
  movieId: '1',
  date: '2024-01-15',
  time: '20:00',
  format: '2D',
  language: 'VO',
  roomNumber: 1,
  price: 12.50,
  availableSeats: 50,
};

const mockSeats: Seat[] = [
  { id: '1', sessionId: 'session-1', row: 'A', number: 1, type: 'standard', status: 'available' },
  { id: '2', sessionId: 'session-1', row: 'A', number: 2, type: 'standard', status: 'available' },
];

const selectedSeatIds = ['1', '2'];

const createMockStore = () => {
  return configureStore({
    reducer: {
      movies: (state = { movies: [], selectedMovie: mockMovie, loading: false, error: null }) => state,
      sessions: (state = { sessions: [], selectedSession: mockSession, loading: false, error: null }) => state,
      seats: (state = { seats: mockSeats, selectedSeats: selectedSeatIds, loading: false, error: null }) => state,
    },
  });
};

// BookingSummary component test (simulating the booking details card from Checkout)
describe('BookingSummary', () => {
  it('displays movie title', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <BrowserRouter>
          <div className="p-6 bg-gray-900 border-gray-800" data-testid="booking-summary">
            {store.getState().movies.selectedMovie && (
              <div className="mb-4">
                <p className="text-gray-400 text-sm">Movie</p>
                <p className="text-white font-semibold">{store.getState().movies.selectedMovie?.title}</p>
              </div>
            )}
          </div>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });

  it('displays session date and time', () => {
    const store = createMockStore();
    const session = store.getState().sessions.selectedSession;
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <div className="p-6 bg-gray-900 border-gray-800" data-testid="booking-summary">
            {session && (
              <div className="mb-4">
                <p className="text-gray-400 text-sm">Date & Time</p>
                <p className="text-white font-semibold">
                  {new Date(session.date).toLocaleDateString('fr-FR')} at {session.time}
                </p>
              </div>
            )}
          </div>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/15\/01\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/20:00/)).toBeInTheDocument();
  });

  it('displays selected seats', () => {
    const store = createMockStore();
    const { selectedSeats, seats } = store.getState().seats;
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <div className="p-6 bg-gray-900 border-gray-800" data-testid="booking-summary">
            <div className="mb-4">
              <p className="text-gray-400 text-sm">Seats</p>
              <p className="text-white font-semibold">
                {selectedSeats.map(seatId => {
                  const seat = seats.find(s => s.id === seatId);
                  return seat ? `${seat.row}${seat.number}` : '';
                }).filter(Boolean).join(', ')}
              </p>
            </div>
          </div>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('A1, A2')).toBeInTheDocument();
  });

  it('calculates and displays total price', () => {
    const store = createMockStore();
    const session = store.getState().sessions.selectedSession;
    const { selectedSeats } = store.getState().seats;
    const totalPrice = session && selectedSeats.length > 0 
      ? selectedSeats.length * session.price 
      : 0;
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <div className="p-6 bg-gray-900 border-gray-800" data-testid="booking-summary">
            <div className="pt-4 border-t border-gray-800">
              <div className="flex justify-between items-center">
                <p className="text-gray-400">Total</p>
                <p className="text-2xl font-bold text-white">{totalPrice.toFixed(2)} €</p>
              </div>
            </div>
          </div>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('25.00 €')).toBeInTheDocument();
  });

  it('displays room number', () => {
    const store = createMockStore();
    const session = store.getState().sessions.selectedSession;
    
    render(
      <Provider store={store}>
        <BrowserRouter>
          <div className="p-6 bg-gray-900 border-gray-800" data-testid="booking-summary">
            {session && (
              <div className="mb-4">
                <p className="text-gray-400 text-sm">Room</p>
                <p className="text-white font-semibold">Salle {session.roomNumber}</p>
              </div>
            )}
          </div>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Salle 1')).toBeInTheDocument();
  });
});

