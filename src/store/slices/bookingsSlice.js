import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { bookingService } from '../../services/bookingService'

// Create new booking
export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData) => {
    const data = await bookingService.createBooking(bookingData)
    return data
  }
)

// Fetch user bookings
export const fetchUserBookings = createAsyncThunk(
  'bookings/fetchUserBookings',
  async (userId) => {
    const data = await bookingService.getBookingsByUser(userId)
    return data
  }
)

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    currentBooking: null,
    bookingHistory: [],
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentBooking: (state, action) => {
      state.currentBooking = action.payload
    },
    clearCurrentBooking: (state) => {
      state.currentBooking = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false
        state.currentBooking = action.payload
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })

      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false
        state.bookingHistory = action.payload
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  },
})

export const { setCurrentBooking, clearCurrentBooking } = bookingsSlice.actions
export default bookingsSlice.reducer