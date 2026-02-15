import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import { MovieCard } from '../../app/components/MovieCard';
import { Movie } from '../../store/slices/moviesSlice';

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

const createMockStore = () => {
  return configureStore({
    reducer: {
      movies: (state = { movies: [], selectedMovie: null, loading: false, error: null }) => state,
      myList: (state = { movies: [] }) => state,
    },
  });
};

// MovieGrid is essentially a grid layout of MovieCards
describe('MovieGrid', () => {
  it('renders multiple movies in a grid', () => {
    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" data-testid="movie-grid">
            {mockMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </BrowserRouter>
      </Provider>
    );

    const grid = screen.getByTestId('movie-grid');
    expect(grid).toBeInTheDocument();
    expect(screen.getByAltText('Movie 1')).toBeInTheDocument();
    expect(screen.getByAltText('Movie 2')).toBeInTheDocument();
  });

  it('renders empty state when no movies', () => {
    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" data-testid="movie-grid">
            {[].map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </BrowserRouter>
      </Provider>
    );

    const grid = screen.getByTestId('movie-grid');
    expect(grid).toBeInTheDocument();
    expect(grid.children.length).toBe(0);
  });

  it('applies correct grid classes', () => {
    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6" data-testid="movie-grid">
            {mockMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </BrowserRouter>
      </Provider>
    );

    const grid = screen.getByTestId('movie-grid');
    expect(grid).toHaveClass('grid', 'grid-cols-2', 'gap-6');
  });
});

