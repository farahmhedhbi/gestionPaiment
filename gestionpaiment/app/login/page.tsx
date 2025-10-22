'use client'

import React, { useState } from 'react'
import { FaEnvelope, FaLock, FaMoneyBillWave } from 'react-icons/fa'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Veuillez remplir tous les champs')
      return
    }
    setError('')
    alert(`Connecté avec ${email}`)
    setEmail('')
    setPassword('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 animate-gradient-x px-4">
      <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-3xl shadow-2xl w-full max-w-md transition-all duration-500 hover:scale-105">
        
        {/* Effet lumineux */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-3xl opacity-20 blur-2xl"></div>

        <div className="relative z-10">
          {/* Titre avec icône */}
          <h2 className="text-3xl font-bold mb-8 text-center text-white flex items-center justify-center gap-3">
            <FaMoneyBillWave className="text-cyan-300 animate-bounce" />
            Connexion
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              />
            </div>

            {/* Mot de passe */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300" />
              <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              />
            </div>

            {error && <p className="text-red-300 text-sm">{error}</p>}

            {/* Bouton */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-white p-3 rounded-lg font-semibold shadow-lg hover:shadow-cyan-500/50 transition-transform hover:-translate-y-1 duration-300"
            >
              <FaMoneyBillWave className="text-white animate-pulse" />
              Se connecter
            </button>
          </form>

          <p className="text-gray-200 text-center mt-6">
            Pas de compte ?{' '}
            <Link href="/register" className="text-cyan-300 font-semibold hover:underline">
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
