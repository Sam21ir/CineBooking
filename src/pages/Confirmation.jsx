import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Download, Mail, Calendar, Clock, MapPin, Home } from 'lucide-react'
import QRCode from 'react-qr-code'

function Confirmation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { booking, movie, session, seatsDetails } = location.state || {}

  useEffect(() => {
    // Redirect if no booking data
    if (!booking) {
      navigate('/')
    }
  }, [booking, navigate])

  if (!booking) return null

  const handleDownload = () => {
    // Simple download simulation
    alert('Téléchargement du billet... (Fonctionnalité à implémenter)')
  }

  const handleEmailSend = () => {
    // Email sending simulation
    alert(`Billet envoyé à ${booking.customerEmail}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-8 py-12"
    >
      {/* Success Message */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="text-center mb-12"
      >
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white mb-2">
          Réservation confirmée !
        </h1>
        <p className="text-gray-400 text-lg">
          Votre réservation a été enregistrée avec succès
        </p>
      </motion.div>

      {/* Ticket */}
      <div className="max-w-4xl mx-auto bg-dark-light rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left: Movie & Session Info */}
          <div className="md:col-span-2 p-8 border-r border-dark-lighter">
            {/* Movie Info */}
            <div className="flex gap-4 mb-6">
              <img
                src={movie.imageUrl}
                alt={movie.title}
                className="w-24 h-36 object-cover rounded-lg"
              />
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {movie.title}
                </h2>
                <p className="text-gray-400">{movie.genre} • {movie.duration} min</p>
              </div>
            </div>

            {/* Session Details */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-300">
                <Calendar className="w-5 h-5 text-primary" />
                <span>
                  {new Date(session.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Clock className="w-5 h-5 text-primary" />
                <span className="text-xl font-bold">{session.time}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="w-5 h-5 text-primary" />
                <span>Salle {session.roomNumber} • {session.format} • {session.language}</span>
              </div>
            </div>

            {/* Seats */}
            <div>
              <h3 className="text-white font-semibold mb-3">
                Places réservées
              </h3>
              <div className="flex flex-wrap gap-2">
                {seatsDetails.map(seat => (
                  <span
                    key={seat.id}
                    className="px-4 py-2 bg-primary text-white rounded-lg font-semibold"
                  >
                    {seat.row}{seat.number}
                  </span>
                ))}
              </div>
            </div>

            {/* Booking Info */}
            <div className="mt-6 pt-6 border-t border-dark-lighter">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Numéro de réservation</span>
                <span className="text-white font-mono">{booking.id}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Nom</span>
                <span className="text-white">{booking.customerName}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-white">Total payé</span>
                <span className="text-primary">{booking.totalPrice.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Right: QR Code */}
          <div className="p-8 bg-dark flex flex-col items-center justify-center">
            <div className="bg-white p-4 rounded-lg mb-4">
              <QRCode
                value={booking.qrCode}
                size={160}
              />
            </div>
            <p className="text-gray-400 text-sm text-center">
              Présentez ce QR code à l'entrée
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-dark-lighter p-6 flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            <Download className="w-5 h-5" />
            Télécharger le billet
          </button>
          <button
            onClick={handleEmailSend}
            className="flex items-center gap-2 px-6 py-3 bg-dark-lighter text-white rounded-lg hover:bg-dark transition"
          >
            <Mail className="w-5 h-5" />
            Envoyer par email
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-6 py-3 bg-dark-lighter text-white rounded-lg hover:bg-dark transition"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default Confirmation