import axios from 'axios';
import type { Movie, Session } from '../store/slices/moviesSlice';
import type { Seat } from '../store/slices/seatsSlice';
import type { Booking } from '../store/slices/bookingsSlice';

// API Base URLs
const MOVIES_API_BASE_URL = 'https://69765d19c0c36a2a9950ecb3.mockapi.io';
const BOOKINGS_API_BASE_URL = 'https://69792073cd4fe130e3db380e.mockapi.io';

// Movies & Sessions API
const moviesApiClient = axios.create({
  baseURL: MOVIES_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Bookings & Seats API
const bookingsApiClient = axios.create({
  baseURL: BOOKINGS_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Movies API
export const movieApi = {
  getMovies: async (): Promise<Movie[]> => {
    const response = await moviesApiClient.get<Movie[]>('/movies');
    return response.data;
  },

  getMovieById: async (id: string): Promise<Movie> => {
    const response = await moviesApiClient.get<Movie>(`/movies/${id}`);
    return response.data;
  },

  getSessions: async (): Promise<Session[]> => {
    const response = await moviesApiClient.get<Session[]>('/sessions');
    return response.data;
  },

  getSessionById: async (id: string): Promise<Session> => {
    const response = await moviesApiClient.get<Session>(`/sessions/${id}`);
    return response.data;
  },
};

// Bookings & Seats API
export const bookingApi = {
  getSeats: async (sessionId: string): Promise<Seat[]> => {
    const response = await bookingsApiClient.get<Seat[]>('/seats');
    // Filter by sessionId (assuming all seats are for sessionId "1" as per spec)
    return response.data.filter(seat => seat.sessionId === sessionId);
  },

  createBooking: async (bookingData: Omit<Booking, 'id'>): Promise<Booking> => {
    const response = await bookingsApiClient.post<Booking>('/bookings', bookingData);
    return response.data;
  },

  getBookings: async (): Promise<Booking[]> => {
    const response = await bookingsApiClient.get<Booking[]>('/bookings');
    return response.data;
  },

  getBookingById: async (id: string): Promise<Booking> => {
    const response = await bookingsApiClient.get<Booking>(`/bookings/${id}`);
    return response.data;
  },
};

