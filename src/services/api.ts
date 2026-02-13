import axios from 'axios';
import type { Movie, Session } from '../store/slices/moviesSlice';
import type { Seat } from '../store/slices/seatsSlice';
import type { Booking } from '../store/slices/bookingsSlice';
import type { User } from '../store/slices/usersSlice';

// API Base URLs
const MOVIES_API_BASE_URL = 'https://69765d19c0c36a2a9950ecb3.mockapi.io';
const BOOKINGS_API_BASE_URL = 'https://69792073cd4fe130e3db380e.mockapi.io';
const USERS_API_BASE_URL = 'https://698d4a76b79d1c928ed4e75e.mockapi.io';

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

// Users API
const usersApiClient = axios.create({
  baseURL: USERS_API_BASE_URL,
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

// Users API
export const userApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await usersApiClient.get<User[]>('/users');
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await usersApiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    const response = await usersApiClient.post<User>('/users', userData);
    return response.data;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await usersApiClient.put<User>(`/users/${id}`, userData);
    return response.data;
  },

  login: async (email: string, password: string): Promise<User | null> => {
    // In a real app, this would be a proper login endpoint with password hashing
    // For MockAPI, we'll search for a user with matching email AND password
    const users = await userApi.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return null;
    }
    // Return user without password for security
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    // Check if user already exists
    const existingUsers = await userApi.getUsers();
    const existingUser = existingUsers.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user with password
    // In production, password would be hashed on the backend
    const newUser = await userApi.createUser({
      name,
      email,
      password, // Store password for MockAPI (in production, this would be hashed)
    });
    
    // Return user without password for security
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  },
};

