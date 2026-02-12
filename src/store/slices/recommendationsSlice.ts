import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Movie } from './moviesSlice';

interface RecommendationsState {
  recommendedMovies: Movie[];
  basedOnGenre: Movie[];
  basedOnRating: Movie[];
}

const initialState: RecommendationsState = {
  recommendedMovies: [],
  basedOnGenre: [],
  basedOnRating: [],
};

const recommendationsSlice = createSlice({
  name: 'recommendations',
  initialState,
  reducers: {
    setRecommendedMovies: (state, action: PayloadAction<Movie[]>) => {
      state.recommendedMovies = action.payload;
    },
    setBasedOnGenre: (state, action: PayloadAction<Movie[]>) => {
      state.basedOnGenre = action.payload;
    },
    setBasedOnRating: (state, action: PayloadAction<Movie[]>) => {
      state.basedOnRating = action.payload;
    },
    clearRecommendations: (state) => {
      state.recommendedMovies = [];
      state.basedOnGenre = [];
      state.basedOnRating = [];
    },
  },
});

export const { setRecommendedMovies, setBasedOnGenre, setBasedOnRating, clearRecommendations } = recommendationsSlice.actions;
export default recommendationsSlice.reducer;

