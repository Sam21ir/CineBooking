import axios from 'axios'

const BOOKINGS_API_URL = 'https://69792073cd4fe130e3db380e.mockapi.io'

export const bookingService = {
  // Get all bookings
  getAllBookings: async () => {
    const response = await axios.get(`${BOOKINGS_API_URL}/bookings`)
    return response.data
  },

  // Get bookings by user ID
  getBookingsByUser: async (userId) => {
    const response = await axios.get(`${BOOKINGS_API_URL}/bookings`)
    return response.data.filter(booking => booking.userId === userId)
  },

  getBookingById: async (id) => {
    const response = await axios.get(`${BOOKINGS_API_URL}/bookings/${id}`)
    return response.data
  },

  createBooking: async (bookingData) => {
    const response = await axios.post(`${BOOKINGS_API_URL}/bookings`, bookingData)
    return response.data
  },

  updateBooking: async (id, bookingData) => {
    const response = await axios.put(`${BOOKINGS_API_URL}/bookings/${id}`, bookingData)
    return response.data
  },

  deleteBooking: async (id) => {
    const response = await axios.delete(`${BOOKINGS_API_URL}/bookings/${id}`)
    return response.data
  },
}