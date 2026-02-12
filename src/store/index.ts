import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './slices/moviesSlice';
import sessionsReducer from './slices/sessionsSlice';
import seatsReducer from './slices/seatsSlice';
import bookingsReducer from './slices/bookingsSlice';
import usersReducer from './slices/usersSlice';
import recommendationsReducer from './slices/recommendationsSlice';
import myListReducer from './slices/myListSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    sessions: sessionsReducer,
    seats: seatsReducer,
    bookings: bookingsReducer,
    users: usersReducer,
    recommendations: recommendationsReducer,
    myList: myListReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

