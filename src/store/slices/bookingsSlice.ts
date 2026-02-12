import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { bookingApi } from '../../services/api';

export interface Booking {
  id?: string;
  userId: string;
  sessionId: string;
  movieId: string;
  seats: string;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  bookingDate: string;
  qrCode: string;
  customerName: string;
  customerEmail: string;
}

interface BookingsState {
  currentBooking: Booking | null;
  bookingHistory: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingsState = {
  currentBooking: null,
  bookingHistory: [],
  loading: false,
  error: null,
};

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData: Omit<Booking, 'id'>) => {
    const response = await bookingApi.createBooking(bookingData);
    return response;
  }
);

export const fetchBookingHistory = createAsyncThunk(
  'bookings/fetchBookingHistory',
  async (userId: string) => {
    const response = await bookingApi.getBookings();
    return response.filter((booking: Booking) => booking.userId === userId);
  }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.bookingHistory.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create booking';
      })
      .addCase(fetchBookingHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingHistory = action.payload;
      })
      .addCase(fetchBookingHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch booking history';
      });
  },
});

export const { clearCurrentBooking, clearError } = bookingsSlice.actions;
export default bookingsSlice.reducer;

