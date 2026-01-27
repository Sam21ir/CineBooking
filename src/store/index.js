import { configureStore } from '@reduxjs/toolkit'
import moviesReducer from './slices/moviesSlice'
import sessionsReducer from './slices/sessionsSlice'

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    sessions: sessionsReducer,
  },
})