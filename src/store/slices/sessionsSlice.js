import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = 'https://69765d19c0c36a2a9950ecb3.mockapi.io'

export const fetchSessions = createAsyncThunk(
  'sessions/fetchSessions',
  async () => {
    const response = await axios.get(`${API_URL}/sessions`)
    return response.data
  }
)

export const fetchSessionsByMovie = createAsyncThunk(
  'sessions/fetchSessionsByMovie',
  async (movieId) => {
    const response = await axios.get(`${API_URL}/sessions`)
    return response.data.filter(session => session.movieId === movieId)
  }
)

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState: {
    sessions: [],
    selectedSession: null,
    selectedDate: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedSession: (state, action) => {
      state.selectedSession = action.payload
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload
    },
    clearSelectedSession: (state) => {
      state.selectedSession = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false
        state.sessions = action.payload
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(fetchSessionsByMovie.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSessionsByMovie.fulfilled, (state, action) => {
        state.loading = false
        state.sessions = action.payload
      })
      .addCase(fetchSessionsByMovie.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { setSelectedSession, setSelectedDate, clearSelectedSession } = sessionsSlice.actions
export default sessionsSlice.reducer