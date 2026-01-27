import { Search } from 'lucide-react'

function MovieSearch({ searchTerm, onSearchChange }) {
  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Rechercher un film..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-3 bg-dark-light border border-dark-lighter rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition"
      />
    </div>
  )
}

export default MovieSearch