'use client'

import React, { useState, FormEvent } from 'react'
import { FaUser, FaEnvelope, FaLock, FaUserTie, FaMoneyBillWave } from 'react-icons/fa'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Register() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('coordinateur')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas !")
      return
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères !")
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const rolesToSend = role === 'coordinateur' ? ['coordinateur'] : ['formateur']

      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          roles: rolesToSend
        }),
      })

      // Essayer de parser la réponse comme JSON
      let responseData;
      const responseText = await response.text();
      
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        // Si le parsing JSON échoue, utiliser le texte brut
        responseData = { error: responseText };
      }

      if (!response.ok) {
        // Gérer les différents formats d'erreur
        const errorMessage = 
          responseData.error || 
          responseData.message || 
          responseText || 
          'Erreur serveur';
        throw new Error(errorMessage);
      }

      console.log('✅ Utilisateur créé :', responseData)
      setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.')
      
      // Réinitialiser le formulaire
      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setRole('coordinateur')

      // Redirection automatique vers login après 3 secondes
      setTimeout(() => {
        router.push('/login')
      }, 3000)

    } catch (err: any) {
      console.error('Erreur inscription:', err)
      
      // Nettoyer le message d'erreur
      let errorMessage = err.message || 'Une erreur est survenue lors de l\'inscription';
      
      // Supprimer les préfixes inutiles
      if (errorMessage.startsWith('Error: ')) {
        errorMessage = errorMessage.substring(7);
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-10 rounded-3xl shadow-2xl w-full max-w-md text-white">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
            <FaMoneyBillWave className="text-white text-2xl animate-bounce" />
          </div>
          <h2 className="text-3xl font-extrabold mt-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Créer un compte
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Prénom */}
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input 
              type="text" 
              placeholder="Prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required 
            />
          </div>

          {/* Nom */}
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input 
              type="text" 
              placeholder="Nom"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required 
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
            <input 
              type="email" 
              placeholder="Email"
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
              placeholder="Mot de passe (min. 6 caractères)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required 
              minLength={6}
            />
          </div>

          {/* Confirmation mot de passe */}
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
            <FaUserTie className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 z-10" />
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
            >
              <option value="coordinateur">Coordinateur</option>
              <option value="formateur">Formateur</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none">
              ▼
            </div>
          </div>

          {/* Messages d'erreur/succès */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-green-400 text-sm text-center">{success}</p>
              <p className="text-green-300 text-xs text-center mt-1">
                Redirection automatique dans 3 secondes...
              </p>
            </div>
          )}

          {/* Bouton d'inscription */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 p-3 rounded-lg font-semibold text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaMoneyBillWave className="animate-bounce" />
              )}
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </div>
          </button>
        </form>

        <p className="text-center text-white/70 mt-6">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-cyan-400 hover:underline font-semibold">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  )
}