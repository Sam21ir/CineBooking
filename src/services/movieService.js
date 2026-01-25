import api from './api'

export const movieService = {
  // get all
  getAllMovies: async () => {
    const response = await api.get('/movies')
    return response.data
  },

  // get one
  getMovieById: async (id) => {
    const response = await api.get(`/movies/${id}`)
    return response.data
  },

  // Create 
  createMovie: async (movieData) => {
    const response = await api.post('/movies', movieData)
    return response.data
  },

  // Update 
  updateMovie: async (id, movieData) => {
    const response = await api.put(`/movies/${id}`, movieData)
    return response.data
  },

  // Delete
  deleteMovie: async (id) => {
    const response = await api.delete(`/movies/${id}`)
    return response.data
  },
}