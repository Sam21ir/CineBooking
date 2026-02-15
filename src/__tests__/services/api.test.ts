// Mock axios BEFORE importing the api module
const mockGet = jest.fn();
const mockPost = jest.fn();

jest.mock('axios', () => {
  const mockGetFn = jest.fn();
  const mockPostFn = jest.fn();
  
  // Store references globally so we can use them in tests
  (global as any).__mockGet = mockGetFn;
  (global as any).__mockPost = mockPostFn;
  
  return {
    __esModule: true,
    default: {
      create: jest.fn(() => ({
        get: mockGetFn,
        post: mockPostFn,
      })),
    },
  };
});

import { movieApi, bookingApi } from '../../services/api';
import { Movie, Session } from '../../store/slices/moviesSlice';
import { Seat, Booking } from '../../store/slices/bookingsSlice';

describe('API Services', () => {
  const mockGet = (global as any).__mockGet;
  const mockPost = (global as any).__mockPost;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('movieApi', () => {
    it('should fetch movies', async () => {
      const mockMovies: Movie[] = [
        {
          id: '1',
          title: 'Test Movie',
          synopsis: 'Test',
          genre: 'Action',
          rating: 8,
          duration: 120,
          imageUrl: 'test.jpg',
          trailerUrl: 'test.mp4',
          releaseDate: '2024-01-01',
        },
      ];

      mockGet.mockResolvedValue({ data: mockMovies });

      const movies = await movieApi.getMovies();
      expect(movies).toEqual(mockMovies);
      expect(mockGet).toHaveBeenCalledWith('/movies');
    });

    it('should fetch movie by id', async () => {
      const mockMovie: Movie = {
        id: '1',
        title: 'Test Movie',
        synopsis: 'Test',
        genre: 'Action',
        rating: 8,
        duration: 120,
        imageUrl: 'test.jpg',
        trailerUrl: 'test.mp4',
        releaseDate: '2024-01-01',
      };

      mockGet.mockResolvedValue({ data: mockMovie });

      const movie = await movieApi.getMovieById('1');
      expect(movie).toEqual(mockMovie);
      expect(mockGet).toHaveBeenCalledWith('/movies/1');
    });
  });

  describe('bookingApi', () => {
    it('should create booking', async () => {
      const mockBooking: Booking = {
        id: '1',
        userId: '1',
        sessionId: '1',
        movieId: '1',
        seats: 'A1,A2',
        totalPrice: 20,
        status: 'confirmed',
        bookingDate: '2024-01-01',
        qrCode: 'QR123',
        customerName: 'Test User',
        customerEmail: 'test@example.com',
      };

      mockPost.mockResolvedValue({ data: mockBooking });

      const booking = await bookingApi.createBooking({
        userId: '1',
        sessionId: '1',
        movieId: '1',
        seats: 'A1,A2',
        totalPrice: 20,
        status: 'confirmed',
        bookingDate: '2024-01-01',
        qrCode: 'QR123',
        customerName: 'Test User',
        customerEmail: 'test@example.com',
      });

      expect(booking).toEqual(mockBooking);
      expect(mockPost).toHaveBeenCalledWith('/bookings', expect.objectContaining({
        userId: '1',
        sessionId: '1',
        movieId: '1',
      }));
    });
  });
});

