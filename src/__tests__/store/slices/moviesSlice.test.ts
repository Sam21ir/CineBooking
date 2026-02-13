import { configureStore } from '@reduxjs/toolkit';
import moviesReducer, { fetchMovies, setSelectedMovie } from '../../../store/slices/moviesSlice';
import { movieApi } from '../../../services/api';
import { Movie } from '../../../store/slices/moviesSlice';

// Mock the API
jest.mock('../../../services/api', () => ({
  movieApi: {
    getMovies: jest.fn(),
    getMovieById: jest.fn(),
  },
}));

describe('moviesSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        movies: moviesReducer,
      },
    });
  });

  it('should have initial state', () => {
    const state = store.getState().movies;
    expect(state.movies).toEqual([]);
    expect(state.selectedMovie).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should set selected movie', () => {
    const movie: Movie = {
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

    store.dispatch(setSelectedMovie(movie));
    const state = store.getState().movies;
    expect(state.selectedMovie).toEqual(movie);
  });

  it('should handle fetchMovies pending', () => {
    store.dispatch({ type: fetchMovies.pending.type });
    const state = store.getState().movies;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchMovies fulfilled', async () => {
    const mockMovies: Movie[] = [
      {
        id: '1',
        title: 'Movie 1',
        synopsis: 'Synopsis 1',
        genre: 'Action',
        rating: 8,
        duration: 120,
        imageUrl: 'img1.jpg',
        trailerUrl: 'trailer1.mp4',
        releaseDate: '2024-01-01',
      },
    ];

    (movieApi.getMovies as jest.Mock).mockResolvedValue(mockMovies);

    await store.dispatch(fetchMovies());
    const state = store.getState().movies;
    expect(state.movies).toEqual(mockMovies);
    expect(state.loading).toBe(false);
  });
});

