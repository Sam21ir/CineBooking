function Footer() {
  return (
    <footer className="bg-dark-light border-t border-dark-lighter mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">
              🎬 CineBooking
            </h3>
            <p className="text-gray-400 text-sm">
              Votre plateforme de réservation de billets de cinéma en ligne.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>À propos</li>
              <li>Contact</li>
              <li>CGU</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Suivez-nous</h4>
            <p className="text-sm text-gray-400">
              © 2026 CineBooking. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer