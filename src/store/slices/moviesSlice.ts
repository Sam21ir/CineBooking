import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { movieApi } from '../../services/api';

export interface Movie {
  id: string;
  title: string;
  synopsis: string;
  genre: string;
  rating: number;
  duration: number;
  imageUrl: string;
  trailerUrl: string;
  releaseDate: string;
}

interface MoviesState {
  movies: Movie[];
  selectedMovie: Movie | null;
  loading: boolean;
  error: string | null;
}

const initialState: MoviesState = {
  movies: [],
  selectedMovie: null,
  loading: false,
  error: null,
};

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async () => {
    const response = await movieApi.getMovies();
    return response;
  }
);

export const fetchMovieById = createAsyncThunk(
  'movies/fetchMovieById',
  async (id: string) => {
    const response = await movieApi.getMovieById(id);
    return response;
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSelectedMovie: (state, action: PayloadAction<Movie | null>) => {
      state.selectedMovie = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      })
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMovie = action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movie';
      });
  },
});

export const { setSelectedMovie, clearError } = moviesSlice.actions;
export default moviesSlice.reducer;

