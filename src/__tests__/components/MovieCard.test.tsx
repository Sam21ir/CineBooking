import { render, screen } from '@testing-library/react';
import { MovieCard } from '../../app/components/MovieCard';
import { Movie } from '../../store/slices/moviesSlice';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';

const mockMovie: Movie = {
  id: '1',
  title: 'Test Movie',
  synopsis: 'A test movie synopsis',
  genre: 'Action',
  rating: 8.5,
  duration: 120,
  imageUrl: 'https://example.com/image.jpg',
  trailerUrl: 'https://example.com/trailer',
  releaseDate: '2024-01-01',
};

const createMockStore = () => {
  return configureStore({
    reducer: {
      movies: (state = { movies: [], selectedMovie: null, loading: false, error: null }) => state,
      myList: (state = { movies: [] }) => state,
    },
  });
};

describe('MovieCard', () => {
  it('renders movie image with alt text', () => {
    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <MovieCard movie={mockMovie} />
        </BrowserRouter>
      </Provider>
    );
    
    const image = screen.getByAltText('Test Movie');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('renders link to movie details page', () => {
    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <MovieCard movie={mockMovie} />
        </BrowserRouter>
      </Provider>
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/movies/1');
  });

  it('renders movie card container', () => {
    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <MovieCard movie={mockMovie} />
        </BrowserRouter>
      </Provider>
    );
    
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
  });
});

