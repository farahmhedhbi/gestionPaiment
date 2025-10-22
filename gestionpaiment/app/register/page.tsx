'use client'

import React, { useState } from 'react'
import { FaUser, FaEnvelope, FaLock, FaUserTie, FaMoneyBillWave } from 'react-icons/fa'
import Link from 'next/link'

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
    alert(`Utilisateur ${name} enregistré avec le rôle ${role} !`)
    setName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setRole('coordinateur')
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 overflow-hidden">

      {/* 💸 Floating Background Emojis */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="absolute animate-float text-white/30 select-none"
            style={{
              left: `${Math.random() * 100}%`,
              fontSize: `${1.5 + Math.random() * 2}rem`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${10 + Math.random() * 8}s`,
              top: '-10%',
            }}
          >
            💸
          </span>
        ))}
      </div>

      {/* Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/10 p-10 rounded-3xl shadow-2xl w-full max-w-md text-white">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <FaMoneyBillWave className="text-white text-2xl animate-bounce" />
          </div>
          <h2 className="text-3xl font-extrabold mt-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Créer un compte
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nom */}
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input
              type="text"
              placeholder="Nom complet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

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

          {/* Confirmer mot de passe */}
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          {/* Rôle */}
          <div className="relative">
            <FaUserTie className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
            >
              <option value="coordinateur" className="text-black">Coordinateur</option>
              <option value="formateur" className="text-black">Formateur</option>
            </select>
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          {/* Bouton */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 p-3 rounded-lg font-semibold text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="flex items-center justify-center gap-2">
              <FaMoneyBillWave className="animate-bounce" />
              S'inscrire
            </div>
          </button>
        </form>

        <p className="text-center text-white/70 mt-6">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-cyan-400 hover:underline">
            Connectez-vous
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
