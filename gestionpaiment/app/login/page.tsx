'use client'

import React, { useState, useEffect } from 'react'
import { FaEnvelope, FaLock, FaMoneyBillWave } from 'react-icons/fa'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [floatingEmojis, setFloatingEmojis] = useState<any[]>([])

  useEffect(() => {
    // Génération des 💸 côté client (évite l’erreur d’hydratation)
    const emojis = Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      fontSize: `${1.5 + Math.random() * 2}rem`,
      delay: `${Math.random() * 8}s`,
      duration: `${10 + Math.random() * 8}s`,
      opacity: `${0.3 + Math.random() * 0.4}`,
    }))
    setFloatingEmojis(emojis)
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 overflow-hidden">
      
      {/* 💸 Fond animé */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingEmojis.map((emoji) => (
          <span
            key={emoji.id}
            className="absolute animate-float text-white/30 select-none"
            style={{
              left: emoji.left,
              fontSize: emoji.fontSize,
              animationDelay: emoji.delay,
              animationDuration: emoji.duration,
              top: '-10%',
              opacity: emoji.opacity,
            }}
          >
            💸
          </span>
        ))}
      </div>

      {/* Carte de connexion */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/10 p-10 rounded-3xl shadow-2xl w-full max-w-md text-white transition-all duration-500 hover:scale-105">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <FaMoneyBillWave className="text-white text-2xl animate-bounce" />
          </div>
          <h2 className="text-3xl font-extrabold mt-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Connexion
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input
              type="email"
              placeholder="Adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          {/* Mot de passe */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          {/* Bouton */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 p-3 rounded-lg font-semibold text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-center gap-2">
              <FaMoneyBillWave className="animate-bounce" />
              Se connecter
            </div>
          </button>
        </form>

        <p className="text-center text-white/70 mt-6">
          Pas de compte ?{' '}
          <Link href="/register" className="text-cyan-400 hover:underline">
            Inscrivez-vous
          </Link>
        </p>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(100vh) rotate(360deg);
          }
          100% {
            transform: translateY(-10vh) rotate(720deg);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  )
}
