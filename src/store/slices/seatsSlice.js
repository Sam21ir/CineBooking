import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const SEATS_API_URL = 'https://69792073cd4fe130e3db380e.mockapi.io'


export const fetchSeatsBySession = createAsyncThunk(
  'seats/fetchSeatsBySession',
  async (sessionId) => {
    const response = await axios.get(`${SEATS_API_URL}/seats`)
    return response.data.filter(seat => seat.sessionId === sessionId)
  }
)

const seatsSlice = createSlice({
  name: 'seats',
  initialState: {
    seats: [],
    selectedSeats: [],
    loading: false,
    error: null,
  },
  reducers: {
    toggleSeat: (state, action) => {
      const seatId = action.payload
      const isSelected = state.selectedSeats.includes(seatId)
      
      if (isSelected) {

        state.selectedSeats = state.selectedSeats.filter(id => id !== seatId)
      } else {
        if (state.selectedSeats.length < 10) {
          state.selectedSeats.push(seatId)
        }
      }
    },
    clearSelectedSeats: (state) => {
      state.selectedSeats = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeatsBySession.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSeatsBySession.fulfilled, (state, action) => {
        state.loading = false
        state.seats = action.payload
      })
      .addCase(fetchSeatsBySession.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { toggleSeat, clearSelectedSeats } = seatsSlice.actions
export default seatsSlice.reducer