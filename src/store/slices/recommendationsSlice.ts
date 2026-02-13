import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from './moviesSlice';
import {
  getPersonalizedRecommendations,
  getSimilarMovies,
  getTrendingMovies,
  generateAISynopsis,
  type AIRecommendationRequest,
  type AISimilarMoviesRequest,
} from '../../services/aiService';

interface RecommendationsState {
  recommendedMovies: Movie[];
  similarMovies: Movie[];
  trendingMovies: Movie[];
  basedOnGenre: Movie[];
  basedOnRating: Movie[];
  aiSynopsis: Record<string, string>; // movieId -> synopsis
  loading: boolean;
  error: string | null;
}

const initialState: RecommendationsState = {
  recommendedMovies: [],
  similarMovies: [],
  trendingMovies: [],
  basedOnGenre: [],
  basedOnRating: [],
  aiSynopsis: {},
  loading: false,
  error: null,
};

// Async thunks
export const fetchPersonalizedRecommendations = createAsyncThunk(
  'recommendations/fetchPersonalized',
  async (request: AIRecommendationRequest) => {
    return await getPersonalizedRecommendations(request);
  }
);

export const fetchSimilarMovies = createAsyncThunk(
  'recommendations/fetchSimilar',
  async (request: AISimilarMoviesRequest) => {
    return await getSimilarMovies(request);
  }
);

export const fetchTrendingMovies = createAsyncThunk(
  'recommendations/fetchTrending',
  async (movies: Movie[]) => {
    return await getTrendingMovies(movies);
  }
);

export const fetchAISynopsis = createAsyncThunk(
  'recommendations/fetchAISynopsis',
  async (movie: Movie) => {
    const synopsis = await generateAISynopsis(movie);
    return { movieId: movie.id, synopsis };
  }
);

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    setRecommendedMovies: (state, action: PayloadAction<Movie[]>) => {
      state.recommendedMovies = action.payload;
    },
    setSimilarMovies: (state, action: PayloadAction<Movie[]>) => {
      state.similarMovies = action.payload;
    },
    setTrendingMovies: (state, action: PayloadAction<Movie[]>) => {
      state.trendingMovies = action.payload;
    },
    setBasedOnGenre: (state, action: PayloadAction<Movie[]>) => {
      state.basedOnGenre = action.payload;
    },
    setBasedOnRating: (state, action: PayloadAction<Movie[]>) => {
      state.basedOnRating = action.payload;
    },
    clearRecommendations: (state) => {
      state.recommendedMovies = [];
      state.similarMovies = [];
      state.trendingMovies = [];
      state.basedOnGenre = [];
      state.basedOnRating = [];
      state.aiSynopsis = {};
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Personalized Recommendations
      .addCase(fetchPersonalizedRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPersonalizedRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendedMovies = action.payload;
      })
      .addCase(fetchPersonalizedRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch recommendations';
      })
      // Similar Movies
      .addCase(fetchSimilarMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.similarMovies = action.payload;
      })
      .addCase(fetchSimilarMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch similar movies';
      })
      // Trending Movies
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.trendingMovies = action.payload;
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch trending movies';
      })
      // AI Synopsis
      .addCase(fetchAISynopsis.fulfilled, (state, action) => {
        state.aiSynopsis[action.payload.movieId] = action.payload.synopsis;
      });
  },
});

export const {
  setRecommendedMovies,
  setSimilarMovies,
  setTrendingMovies,
  setBasedOnGenre,
  setBasedOnRating,
  clearRecommendations,
  clearError,
} = recommendationsSlice.actions;
export default recommendationsSlice.reducer;

