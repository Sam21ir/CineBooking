import { useState } from 'react'
import { CreditCard, User, Mail } from 'lucide-react'

function PaymentForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide'
    }

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Le numéro de carte est requis'
    } else if (formData.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Le numéro doit contenir 16 chiffres'
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'La date d\'expiration est requise'
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = 'Le CVV est requis'
    } else if (formData.cvv.length !== 3) {
      newErrors.cvv = 'Le CVV doit contenir 3 chiffres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-white font-semibold mb-2">
          <User className="w-4 h-4 inline mr-2" />
          Nom complet
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Jean Dupont"
          className={`w-full px-4 py-3 bg-dark-light border ${
            errors.name ? 'border-red-500' : 'border-dark-lighter'
          } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-white font-semibold mb-2">
          <Mail className="w-4 h-4 inline mr-2" />
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="jean.dupont@email.com"
          className={`w-full px-4 py-3 bg-dark-light border ${
            errors.email ? 'border-red-500' : 'border-dark-lighter'
          } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Card Number */}
      <div>
        <label className="block text-white font-semibold mb-2">
          <CreditCard className="w-4 h-4 inline mr-2" />
          Numéro de carte
        </label>
        <input
          type="text"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          maxLength="19"
          className={`w-full px-4 py-3 bg-dark-light border ${
            errors.cardNumber ? 'border-red-500' : 'border-dark-lighter'
          } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition`}
        />
        {errors.cardNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
        )}
      </div>

      {/* Expiry & CVV */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white font-semibold mb-2">
            Date d'expiration
          </label>
          <input
            type="text"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            placeholder="MM/AA"
            maxLength="5"
            className={`w-full px-4 py-3 bg-dark-light border ${
              errors.expiryDate ? 'border-red-500' : 'border-dark-lighter'
            } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition`}
          />
          {errors.expiryDate && (
            <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
          )}
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">
            CVV
          </label>
          <input
            type="text"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            placeholder="123"
            maxLength="3"
            className={`w-full px-4 py-3 bg-dark-light border ${
              errors.cvv ? 'border-red-500' : 'border-dark-lighter'
            } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary transition`}
          />
          {errors.cvv && (
            <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 rounded-lg font-bold text-lg transition ${
          isLoading
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-primary text-white hover:bg-primary-dark'
        }`}
      >
        {isLoading ? 'Traitement...' : 'Confirmer le paiement'}
      </button>
    </form>
  )
}

export default PaymentForm