// Mock axios BEFORE importing the api module
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

import { movieApi } from '../../services/api';
import { Movie, Session } from '../../store/slices/moviesSlice';

describe('movieService (movieApi)', () => {
  const mockGet = (global as any).__mockGet;
  const mockPost = (global as any).__mockPost;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getMovies', () => {
    it('should fetch all movies', async () => {
      const mockMovies: Movie[] = [
        {
          id: '1',
          title: 'Movie 1',
          synopsis: 'Synopsis 1',
          genre: 'Action',
          rating: 8.5,
          duration: 120,
          imageUrl: 'https://example.com/image1.jpg',
          trailerUrl: 'https://example.com/trailer1',
          releaseDate: '2024-01-01',
        },
        {
          id: '2',
          title: 'Movie 2',
          synopsis: 'Synopsis 2',
          genre: 'Comedy',
          rating: 7.5,
          duration: 90,
          imageUrl: 'https://example.com/image2.jpg',
          trailerUrl: 'https://example.com/trailer2',
          releaseDate: '2024-02-01',
        },
      ];

      mockGet.mockResolvedValue({ data: mockMovies });

      const movies = await movieApi.getMovies();

      expect(movies).toEqual(mockMovies);
      expect(mockGet).toHaveBeenCalledWith('/movies');
    });

    it('should handle errors when fetching movies', async () => {
      mockGet.mockRejectedValue(new Error('Network error'));

      await expect(movieApi.getMovies()).rejects.toThrow('Network error');
    });
  });

  describe('getMovieById', () => {
    it('should fetch a movie by id', async () => {
      const mockMovie: Movie = {
        id: '1',
        title: 'Movie 1',
        synopsis: 'Synopsis 1',
        genre: 'Action',
        rating: 8.5,
        duration: 120,
        imageUrl: 'https://example.com/image1.jpg',
        trailerUrl: 'https://example.com/trailer1',
        releaseDate: '2024-01-01',
      };

      mockGet.mockResolvedValue({ data: mockMovie });

      const movie = await movieApi.getMovieById('1');

      expect(movie).toEqual(mockMovie);
      expect(mockGet).toHaveBeenCalledWith('/movies/1');
    });

    it('should handle errors when fetching movie by id', async () => {
      mockGet.mockRejectedValue(new Error('Movie not found'));

      await expect(movieApi.getMovieById('999')).rejects.toThrow('Movie not found');
    });
  });

  describe('getSessions', () => {
    it('should fetch all sessions', async () => {
      const mockSessions: Session[] = [
        {
          id: 'session-1',
          movieId: '1',
          date: '2024-01-15',
          time: '20:00',
          format: '2D',
          language: 'VO',
          roomNumber: 1,
          price: 12.50,
          availableSeats: 50,
        },
        {
          id: 'session-2',
          movieId: '1',
          date: '2024-01-15',
          time: '22:00',
          format: '3D',
          language: 'VF',
          roomNumber: 2,
          price: 15.00,
          availableSeats: 30,
        },
      ];

      mockGet.mockResolvedValue({ data: mockSessions });

      const sessions = await movieApi.getSessions();

      expect(sessions).toEqual(mockSessions);
      expect(mockGet).toHaveBeenCalledWith('/sessions');
    });
  });

  describe('getSessionById', () => {
    it('should fetch a session by id', async () => {
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

      mockGet.mockResolvedValue({ data: mockSession });

      const session = await movieApi.getSessionById('session-1');

      expect(session).toEqual(mockSession);
      expect(mockGet).toHaveBeenCalledWith('/sessions/session-1');
    });
  });
});

