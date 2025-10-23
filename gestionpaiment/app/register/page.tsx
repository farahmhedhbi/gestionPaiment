'use client'

import React, { useState } from 'react'
import { FaUser, FaEnvelope, FaLock, FaUserTie, FaMoneyBillWave } from 'react-icons/fa'
import Link from 'next/link'

export default function Register() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('coordinateur')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas !")
      return
    }

    setError('')
    setSuccess('')

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          roles: [role === 'coordinateur' ? 'ROLE_COORDINATEUR' : 'ROLE_FORMATEUR']
        }),
      })

      if (!response.ok) {
        const msg = await response.text()
        throw new Error(msg || 'Erreur serveur')
      }

      const data = await response.json()
      console.log('✅ Utilisateur créé :', data)
      setSuccess('Inscription réussie !')
      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setRole('coordinateur')
    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-10 rounded-3xl shadow-2xl w-full max-w-md text-white">
        <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Créer un compte
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input type="text" placeholder="Prénom"
            value={firstName} onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
            required />

          <input type="text" placeholder="Nom"
            value={lastName} onChange={(e) => setLastName(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
            required />

          <input type="email" placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
            required />

          <input type="password" placeholder="Mot de passe"
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
            required />

          <input type="password" placeholder="Confirmer mot de passe"
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
            required />

          <select value={role} onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20">
            <option value="coordinateur" className="text-black">Coordinateur</option>
            <option value="formateur" className="text-black">Formateur</option>
          </select>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          {success && <p className="text-green-400 text-sm text-center">{success}</p>}

          <button type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 p-3 rounded-lg font-semibold text-white shadow-lg">
            <div className="flex items-center justify-center gap-2">
              <FaMoneyBillWave className="animate-bounce" /> S'inscrire
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
    </div>
  )
}
