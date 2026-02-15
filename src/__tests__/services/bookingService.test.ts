// Mock axios BEFORE importing the api module
jest.mock('axios', () => {
  const mockGetFn = jest.fn();
  const mockPostFn = jest.fn();
  
  // Store references globally so we can use them in tests
  (global as any).__mockGet = mockGetFn;
  (global as any).__mockPost = mockPostFn;
  
  return {
    __esModule: true,
    default: {
      create: jest.fn(() => ({
        get: mockGetFn,
        post: mockPostFn,
      })),
    },
  };
});

import { bookingApi } from '../../services/api';
import { Seat } from '../../store/slices/seatsSlice';
import { Booking } from '../../store/slices/bookingsSlice';

describe('bookingService (bookingApi)', () => {
  const mockGet = (global as any).__mockGet;
  const mockPost = (global as any).__mockPost;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSeats', () => {
    it('should fetch seats for a session', async () => {
      const mockSeats: Seat[] = [
        {
          id: '1',
          sessionId: 'session-1',
          row: 'A',
          number: 1,
          type: 'standard',
          status: 'available',
        },
        {
          id: '2',
          sessionId: 'session-1',
          row: 'A',
          number: 2,
          type: 'premium',
          status: 'available',
        },
      ];

      mockGet.mockResolvedValue({ data: mockSeats });

      const seats = await bookingApi.getSeats('session-1');

      expect(seats).toEqual(mockSeats);
      expect(mockGet).toHaveBeenCalledWith('/seats');
    });

    it('should filter seats by sessionId', async () => {
      const allSeats: Seat[] = [
        {
          id: '1',
          sessionId: 'session-1',
          row: 'A',
          number: 1,
          type: 'standard',
          status: 'available',
        },
        {
          id: '2',
          sessionId: 'session-2',
          row: 'A',
          number: 1,
          type: 'standard',
          status: 'available',
        },
      ];

      mockGet.mockResolvedValue({ data: allSeats });

      const seats = await bookingApi.getSeats('session-1');

      expect(seats).toHaveLength(1);
      expect(seats[0].sessionId).toBe('session-1');
    });

    it('should handle empty seats array', async () => {
      mockGet.mockResolvedValue({ data: [] });

      const seats = await bookingApi.getSeats('session-1');

      expect(seats).toEqual([]);
    });
  });

  describe('createBooking', () => {
    it('should create a booking', async () => {
      const bookingData: Omit<Booking, 'id'> = {
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

      const mockBooking: Booking = {
        id: '1',
        ...bookingData,
      };

      mockPost.mockResolvedValue({ data: mockBooking });

      const booking = await bookingApi.createBooking(bookingData);

      expect(booking).toEqual(mockBooking);
      expect(mockPost).toHaveBeenCalledWith('/bookings', bookingData);
    });

    it('should handle errors when creating booking', async () => {
      const bookingData: Omit<Booking, 'id'> = {
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

      mockPost.mockRejectedValue(new Error('Failed to create booking'));

      await expect(bookingApi.createBooking(bookingData)).rejects.toThrow('Failed to create booking');
    });
  });

  describe('getBookings', () => {
    it('should fetch all bookings', async () => {
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

      mockGet.mockResolvedValue({ data: mockBookings });

      const bookings = await bookingApi.getBookings();

      expect(bookings).toEqual(mockBookings);
      expect(mockGet).toHaveBeenCalledWith('/bookings');
    });
  });

  describe('getBookingById', () => {
    it('should fetch a booking by id', async () => {
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

      mockGet.mockResolvedValue({ data: mockBooking });

      const booking = await bookingApi.getBookingById('1');

      expect(booking).toEqual(mockBooking);
      expect(mockGet).toHaveBeenCalledWith('/bookings/1');
    });

    it('should handle errors when fetching booking by id', async () => {
      mockGet.mockRejectedValue(new Error('Booking not found'));

      await expect(bookingApi.getBookingById('999')).rejects.toThrow('Booking not found');
    });
  });
});

