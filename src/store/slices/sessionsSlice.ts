import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { movieApi } from '../../services/api';

export interface Session {
  id: string;
  movieId: string;
  date: string;
  time: string;
  roomNumber: number;
  format: string;
  language: string;
  availableSeats: number;
  price: number;
}

interface SessionsState {
  sessions: Session[];
  selectedSession: Session | null;
  selectedDate: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: SessionsState = {
  sessions: [],
  selectedSession: null,
  selectedDate: null,
  loading: false,
  error: null,
};

export const fetchSessions = createAsyncThunk(
  'sessions/fetchSessions',
  async () => {
    const response = await movieApi.getSessions();
    return response;
  }
);

export const fetchSessionsByMovieId = createAsyncThunk(
  'sessions/fetchSessionsByMovieId',
  async (movieId: string) => {
    const response = await movieApi.getSessions();
    return response.filter((session: Session) => session.movieId === movieId);
  }
);

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    setSelectedSession: (state, action: PayloadAction<Session | null>) => {
      state.selectedSession = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string | null>) => {
      state.selectedDate = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch sessions';
      })
      .addCase(fetchSessionsByMovieId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessionsByMovieId.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchSessionsByMovieId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch sessions';
      });
  },
});

export const { setSelectedSession, setSelectedDate, clearError } = sessionsSlice.actions;
export default sessionsSlice.reducer;

