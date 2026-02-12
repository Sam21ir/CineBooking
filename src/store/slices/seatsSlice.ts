import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { bookingApi } from '../../services/api';

export interface Seat {
  id: string;
  sessionId: string;
  row: string;
  number: number;
  type: 'standard' | 'premium' | 'pmr';
  status: 'available' | 'occupied';
}

interface SeatsState {
  seats: Seat[];
  selectedSeats: string[];
  loading: boolean;
  error: string | null;
}

const initialState: SeatsState = {
  seats: [],
  selectedSeats: [],
  loading: false,
  error: null,
};

export const fetchSeats = createAsyncThunk(
  'seats/fetchSeats',
  async (sessionId: string) => {
    const response = await bookingApi.getSeats(sessionId);
    return response;
  }
);

const seatsSlice = createSlice({
  name: 'seats',
  initialState,
  reducers: {
    toggleSeatSelection: (state, action: PayloadAction<string>) => {
      const seatId = action.payload;
      if (state.selectedSeats.includes(seatId)) {
        state.selectedSeats = state.selectedSeats.filter(id => id !== seatId);
      } else {
        state.selectedSeats.push(seatId);
      }
    },
    clearSelectedSeats: (state) => {
      state.selectedSeats = [];
    },
    setSelectedSeats: (state, action: PayloadAction<string[]>) => {
      state.selectedSeats = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeats.fulfilled, (state, action) => {
        state.loading = false;
        state.seats = action.payload;
      })
      .addCase(fetchSeats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch seats';
      });
  },
});

export const { toggleSeatSelection, clearSelectedSeats, setSelectedSeats, clearError } = seatsSlice.actions;
export default seatsSlice.reducer;

