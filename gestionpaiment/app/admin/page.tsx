'use client'

import React, { useState } from 'react'
import { FaLock, FaUserShield, FaArrowRight } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 🔥 1. Appel API backend
      const response = await fetch('http://localhost:8080/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email, password })
})

      if (!response.ok) {
        setError('Email ou mot de passe incorrect')
        setLoading(false)
        return
      }

      const data = await response.json()
      console.log('✅ Login backend:', data)

      // 🔥 2. Vérifier si l'utilisateur est ADMIN
      if (!data.roles || !data.roles.includes('ROLE_ADMIN')) {
        setError("Accès refusé. Vous n'êtes pas administrateur.")
        setLoading(false)
        return
      }

      // ✅ 3. Authentification validée → stocker session
      localStorage.setItem('adminAuthenticated', 'true')
      localStorage.setItem('adminLoginTime', Date.now().toString())

      setTimeout(() => {
        router.push('/admin/dashboard')
      }, 800)

    } catch (err) {
      console.error('Erreur login:', err)
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-3xl shadow-2xl w-full max-w-md text-white">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30 mb-4">
            <FaUserShield className="text-white text-2xl" />
          </div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
            Admin Access
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="relative">
            <FaUserShield className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" />
            <input
              type="email"
              placeholder="Email administrateur"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 pl-12 rounded-lg bg-white/10 border border-white/20 text-white"
              required
              disabled={loading}
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" />
            <input
              type="password"
              placeholder="Mot de passe administrateur"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 pl-12 rounded-lg bg-white/10 border border-white/20 text-white"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-300 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-500 to-purple-600 p-4 rounded-lg font-semibold text-white"
          >
            <div className="flex items-center justify-center gap-3">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaUserShield className="text-lg" />
              )}
              {loading ? 'Connexion...' : 'Accéder à l\'administration'}
              <FaArrowRight className="text-sm" />
            </div>
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/')}
            className="text-white/70 hover:text-white transition-colors text-sm"
          >
            ← Retour à l'accueil
          </button>
        </div>

      </div>
    </div>
  )
}