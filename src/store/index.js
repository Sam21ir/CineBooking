import { configureStore } from '@reduxjs/toolkit'
import moviesReducer from './slices/moviesSlice'
import sessionsReducer from './slices/sessionsSlice'
import seatsReducer from './slices/seatsSlice'
import bookingsReducer from './slices/bookingsSlice'



export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    sessions: sessionsReducer,
    seats: seatsReducer,
    bookings: bookingsReducer,
  },
})