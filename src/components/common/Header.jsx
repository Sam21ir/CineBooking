import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="bg-dark-light border-b border-dark-lighter">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            🎬 CineBooking
          </Link>

          {/* Navigation */}
          <nav className="flex gap-6">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-white transition"
            >
              Accueil
            </Link>
            <Link 
              to="/movies" 
              className="text-gray-300 hover:text-white transition"
            >
              Films
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex gap-4">
            <button className="text-gray-300 hover:text-white transition">
              Connexion
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header