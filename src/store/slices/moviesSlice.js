import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { movieService } from '../../services/movieService'

// Async thunk to fetch movies
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async () => {
    const response = await movieService.getAllMovies()
    return response.data
  }
)

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    selectedMovie: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload
    },
    clearSelectedMovie: (state) => {
      state.selectedMovie = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false
        state.movies = action.payload
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { setSelectedMovie, clearSelectedMovie } = moviesSlice.actions
export default moviesSlice.reducer