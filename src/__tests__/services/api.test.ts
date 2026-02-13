import axios from 'axios';
import { movieApi, bookingApi } from '../../services/api';
import { Movie, Session } from '../../store/slices/moviesSlice';
import { Seat, Booking } from '../../store/slices/bookingsSlice';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Services', () => {
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

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockMovies }),
      } as any);

      const movies = await movieApi.getMovies();
      expect(movies).toEqual(mockMovies);
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

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue({ data: mockMovie }),
      } as any);

      const movie = await movieApi.getMovieById('1');
      expect(movie).toEqual(mockMovie);
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

      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue({ data: mockBooking }),
      } as any);

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
    });
  });
});

