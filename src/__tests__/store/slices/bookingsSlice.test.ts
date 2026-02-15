import { configureStore } from '@reduxjs/toolkit';
import bookingsReducer, { createBooking, fetchBookingHistory, clearCurrentBooking, clearError } from '../../../store/slices/bookingsSlice';
import { bookingApi } from '../../../services/api';
import { Booking } from '../../../store/slices/bookingsSlice';

// Mock the API
jest.mock('../../../services/api', () => ({
  bookingApi: {
    createBooking: jest.fn(),
    getBookings: jest.fn(),
  },
}));

describe('bookingsSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        bookings: bookingsReducer,
      },
    });
    jest.clearAllMocks();
  });

  it('should have initial state', () => {
    const state = store.getState().bookings;
    expect(state.currentBooking).toBeNull();
    expect(state.bookingHistory).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should handle createBooking pending', () => {
    store.dispatch({ type: createBooking.pending.type });
    const state = store.getState().bookings;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle createBooking fulfilled', async () => {
    const mockBooking: Booking = {
      id: '1',
      userId: 'user-1',
      sessionId: 'session-1',
      movieId: 'movie-1',
      seats: 'A1,A2',
      totalPrice: 25.00,
      status: 'confirmed',
      bookingDate: '2024-01-15T20:00:00Z',
      qrCode: 'QR123',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
    };

    (bookingApi.createBooking as jest.Mock).mockResolvedValue(mockBooking);

    await store.dispatch(createBooking({
      userId: 'user-1',
      sessionId: 'session-1',
      movieId: 'movie-1',
      seats: 'A1,A2',
      totalPrice: 25.00,
      status: 'confirmed',
      bookingDate: '2024-01-15T20:00:00Z',
      qrCode: 'QR123',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
    }));

    const state = store.getState().bookings;
    expect(state.loading).toBe(false);
    expect(state.currentBooking).toEqual(mockBooking);
    expect(state.bookingHistory).toContainEqual(mockBooking);
  });

  it('should handle createBooking rejected', async () => {
    const errorMessage = 'Failed to create booking';
    (bookingApi.createBooking as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await store.dispatch(createBooking({
      userId: 'user-1',
      sessionId: 'session-1',
      movieId: 'movie-1',
      seats: 'A1',
      totalPrice: 12.50,
      status: 'confirmed',
      bookingDate: '2024-01-15T20:00:00Z',
      qrCode: 'QR123',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
    }));

    const state = store.getState().bookings;
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should handle fetchBookingHistory fulfilled', async () => {
    const mockBookings: Booking[] = [
      {
        id: '1',
        userId: 'user-1',
        sessionId: 'session-1',
        movieId: 'movie-1',
        seats: 'A1',
        totalPrice: 12.50,
        status: 'confirmed',
        bookingDate: '2024-01-15T20:00:00Z',
        qrCode: 'QR123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
      },
      {
        id: '2',
        userId: 'user-1',
        sessionId: 'session-2',
        movieId: 'movie-2',
        seats: 'B1',
        totalPrice: 15.00,
        status: 'confirmed',
        bookingDate: '2024-01-16T20:00:00Z',
        qrCode: 'QR456',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
      },
    ];

    (bookingApi.getBookings as jest.Mock).mockResolvedValue(mockBookings);

    await store.dispatch(fetchBookingHistory('user-1'));

    const state = store.getState().bookings;
    expect(state.loading).toBe(false);
    expect(state.bookingHistory).toEqual(mockBookings);
  });

  it('should filter bookings by userId', async () => {
    const allBookings: Booking[] = [
      {
        id: '1',
        userId: 'user-1',
        sessionId: 'session-1',
        movieId: 'movie-1',
        seats: 'A1',
        totalPrice: 12.50,
        status: 'confirmed',
        bookingDate: '2024-01-15T20:00:00Z',
        qrCode: 'QR123',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
      },
      {
        id: '2',
        userId: 'user-2',
        sessionId: 'session-2',
        movieId: 'movie-2',
        seats: 'B1',
        totalPrice: 15.00,
        status: 'confirmed',
        bookingDate: '2024-01-16T20:00:00Z',
        qrCode: 'QR456',
        customerName: 'Jane Doe',
        customerEmail: 'jane@example.com',
      },
    ];

    (bookingApi.getBookings as jest.Mock).mockResolvedValue(allBookings);

    await store.dispatch(fetchBookingHistory('user-1'));

    const state = store.getState().bookings;
    expect(state.bookingHistory).toHaveLength(1);
    expect(state.bookingHistory[0].userId).toBe('user-1');
  });

  it('should clear current booking', () => {
    const mockBooking: Booking = {
      id: '1',
      userId: 'user-1',
      sessionId: 'session-1',
      movieId: 'movie-1',
      seats: 'A1',
      totalPrice: 12.50,
      status: 'confirmed',
      bookingDate: '2024-01-15T20:00:00Z',
      qrCode: 'QR123',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
    };

    // Set a booking first
    store.dispatch({ type: createBooking.fulfilled.type, payload: mockBooking });
    
    // Then clear it
    store.dispatch(clearCurrentBooking());
    
    const state = store.getState().bookings;
    expect(state.currentBooking).toBeNull();
  });

  it('should clear error', () => {
    // Set an error first
    store.dispatch({ type: createBooking.rejected.type, error: { message: 'Test error' } });
    
    // Then clear it
    store.dispatch(clearError());
    
    const state = store.getState().bookings;
    expect(state.error).toBeNull();
  });
});

