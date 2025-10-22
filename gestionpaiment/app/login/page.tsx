'use client'

import React, { useState } from 'react'
import { FaEnvelope, FaLock, FaMoneyBillWave } from 'react-icons/fa'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Veuillez remplir tous les champs')
      return
    }
    setError('')
    console.log({ email, password })
    alert(`Connecté avec ${email}`)
    setEmail('')
    setPassword('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105 duration-500">
        
        {/* Titre avec icône billet bleu */}
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center gap-2">
          <FaMoneyBillWave className="text-blue-500 animate-bounce" /> Connexion
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 hover:shadow-lg"
              required
            />
          </div>

          {/* Mot de passe */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 hover:shadow-lg"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Bouton avec icône billet bleu */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 hover:shadow-xl transition transform hover:-translate-y-1 duration-300"
          >
            <FaMoneyBillWave className="text-blue-500 animate-bounce" /> Se connecter
          </button>
        </form>

        <p className="text-gray-500 text-center mt-6">
          Pas de compte ?{' '}
          <Link href="/register" className="text-purple-600 font-semibold hover:underline">
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </div>
  )
}
