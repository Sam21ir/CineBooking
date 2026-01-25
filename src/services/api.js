import axios from 'axios'

const api = axios.create({
  baseURL: 'https://69765d19c0c36a2a9950ecb3.mockapi.io',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api