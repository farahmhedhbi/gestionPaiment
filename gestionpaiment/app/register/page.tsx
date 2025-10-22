'use client'

import React, { useState } from 'react'
import { FaUser, FaEnvelope, FaLock, FaUserTie, FaMoneyBillWave } from 'react-icons/fa'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('coordinateur')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas !")
      return
    }
    setError('')
    console.log({ name, email, password, role })
    alert(`Utilisateur ${name} enregistré avec le rôle ${role} !`)
    setName(''); setEmail(''); setPassword(''); setConfirmPassword(''); setRole('coordinateur')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 animate-gradient-x">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105 duration-500 relative overflow-hidden"
           style={{ backgroundImage: "url('/images/money-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-white bg-opacity-80"></div>

        {/* Formulaire */}
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center gap-2">
            <FaMoneyBillWave className="text-blue-500 animate-bounce" /> Créer un compte
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nom */}
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Nom complet" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 hover:shadow-lg" required />
            </div>
            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 hover:shadow-lg" required />
            </div>
            {/* Mot de passe */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 hover:shadow-lg" required />
            </div>
            {/* Confirmer mot de passe */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="password" placeholder="Confirmer mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 hover:shadow-lg" required />
            </div>
            {/* Rôle */}
            <div className="relative">
              <FaUserTie className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 hover:shadow-lg appearance-none">
                <option value="coordinateur">Coordinateur</option>
                <option value="formateur">Formateur</option>
              </select>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Bouton S'inscrire avec icône billet animée */}
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white p-3 rounded-lg font-semibold hover:bg-purple-700 hover:shadow-xl transition transform hover:-translate-y-1 duration-300">
              <FaMoneyBillWave className="text-blue-500 animate-bounce" /> S'inscrire
            </button>
          </form>

          <p className="text-gray-500 text-center mt-6">
            Déjà un compte ? <a href="/login" className="text-purple-600 font-semibold hover:underline">Connectez-vous</a>
          </p>
        </div>
      </div>
    </div>
  )
}
