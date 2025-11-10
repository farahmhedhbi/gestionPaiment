'use client'

import React, { useState, FormEvent, useEffect } from 'react'
import { FaEnvelope, FaLock, FaMoneyBillWave, FaKey, FaArrowLeft, FaCheck } from 'react-icons/fa'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'login' | 'verification'>('login')
  const [floatingEmojis, setFloatingEmojis] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
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

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('http://localhost:8080/api/auth/signin', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      let responseData
      const responseText = await response.text()
      
      try {
        responseData = responseText ? JSON.parse(responseText) : {}
      } catch (parseError) {
        responseData = { error: responseText }
      }

      if (response.ok) {
        if (responseData.firstLogin) {
          // Première connexion - besoin de code
          setSuccess('Code de vérification envoyé à votre email pour première connexion!')
          setStep('verification')
        } else {
          // Utilisateur déjà vérifié - connexion directe
          setSuccess('Connexion réussie! Redirection...')
          setTimeout(() => {
            router.push('/dashboard')
          }, 1000)
        }
      } else {
        const errorMessage = responseData.error || responseData.message || responseText || 'Erreur de connexion'
        
        // Nettoyer le message d'erreur
        let cleanErrorMessage = errorMessage
        if (cleanErrorMessage.startsWith('Error: ')) {
          cleanErrorMessage = cleanErrorMessage.substring(7)
        }
        
        setError(cleanErrorMessage)
      }
    } catch (err: any) {
      console.error('Erreur réseau:', err)
      setError('Erreur réseau: Impossible de contacter le serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleVerification = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8080/api/auth/verify-code', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      })

      let responseData
      const responseText = await response.text()
      
      try {
        responseData = responseText ? JSON.parse(responseText) : {}
      } catch (parseError) {
        responseData = { error: responseText }
      }

      if (response.ok) {
        setSuccess('Connexion réussie! Redirection...')
        
        // Vérifier que l'utilisateur est bien authentifié avant la redirection
        setTimeout(async () => {
          try {
            const authCheck = await fetch('http://localhost:8080/api/auth/check-auth', {
              method: 'GET',
              credentials: 'include',
            })
            
            if (authCheck.ok) {
              console.log('✅ Authentification confirmée, redirection vers /dashboard')
              router.push('/dashboard')
            } else {
              console.log('❌ Authentification échouée, redirection vers /login')
              setError('Erreur d\'authentification, veuillez réessayer')
              setStep('login')
            }
          } catch (authError) {
            console.error('Erreur vérification auth:', authError)
            setError('Erreur de vérification d\'authentification')
            setStep('login')
          }
        }, 1500)
        
      } else {
        const errorMessage = responseData.error || responseData.message || responseText || 'Code invalide'
        setError(errorMessage)
      }
    } catch (err: any) {
      console.error('Erreur réseau:', err)
      setError('Erreur réseau: Impossible de contacter le serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8080/api/auth/resend-code', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      let responseData
      const responseText = await response.text()
      
      try {
        responseData = responseText ? JSON.parse(responseText) : {}
      } catch (parseError) {
        responseData = { error: responseText }
      }

      if (response.ok) {
        setSuccess('Nouveau code envoyé! Vérifiez votre email.')
      } else {
        const errorMessage = responseData.error || responseData.message || responseText || 'Erreur lors de l\'envoi du code'
        setError(errorMessage)
      }
    } catch (err: any) {
      console.error('Erreur réseau:', err)
      setError('Erreur réseau: Impossible de contacter le serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setStep('login')
    setError('')
    setSuccess('')
    setCode('')
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 overflow-hidden">
      
      {/* Fond animé */}
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
            {step === 'login' ? 'Connexion' : 'Vérification'}
          </h2>
          <p className="text-white/70 text-sm mt-2 text-center">
            {step === 'login' 
              ? 'Connectez-vous à votre compte' 
              : 'Entrez le code reçu par email'}
          </p>
        </div>

        {step === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
              <input
                type="email"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 pl-10 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
                required
                disabled={loading}
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
                className="w-full p-3 pl-10 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-300"
                required
                disabled={loading}
              />
            </div>

            {/* Messages d'erreur/succès */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 animate-pulse">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-green-400 text-sm text-center">{success}</p>
              </div>
            )}

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 p-3 rounded-lg font-semibold text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FaCheck className="group-hover:scale-110 transition-transform" />
                )}
                {loading ? 'Connexion...' : 'Se connecter'}
              </div>
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerification} className="space-y-5">
            {/* Retour au login */}
            <button
              type="button"
              onClick={handleBackToLogin}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4 group"
            >
              <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
              Retour à la connexion
            </button>

            {/* Message d'information */}
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 text-sm">
              <p className="text-cyan-300 font-medium">
                Première connexion - Vérification requise
              </p>
              <p className="text-cyan-300 text-xs mt-1">
                Un code a été envoyé à: <strong>{email}</strong>
              </p>
              <p className="text-cyan-300 text-xs mt-1">
                Vérifiez votre boîte email et vos spams
              </p>
            </div>

            {/* Code de vérification */}
            <div className="relative">
              <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
              <input
                type="text"
                placeholder="Code à 6 chiffres"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                  setCode(value)
                }}
                className="w-full p-3 pl-10 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-center text-xl tracking-widest font-mono transition-all duration-300"
                maxLength={6}
                required
                disabled={loading}
              />
            </div>

            {/* Indicateur de longueur du code */}
            <div className="flex justify-center space-x-1">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-1 rounded-full transition-all duration-300 ${
                    index < code.length ? 'bg-cyan-400' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Messages d'erreur/succès */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 animate-pulse">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}
            
            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-green-400 text-sm text-center">{success}</p>
              </div>
            )}

            {/* Bouton de vérification */}
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 p-3 rounded-lg font-semibold text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <div className="flex items-center justify-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FaKey className="group-hover:scale-110 transition-transform" />
                )}
                {loading ? 'Vérification...' : 'Vérifier le code'}
              </div>
            </button>

            {/* Renvoyer le code */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FaEnvelope className="text-xs" />
                )}
                {loading ? 'Envoi...' : 'Renvoyer le code'}
              </button>
            </div>
          </form>
        )}

        {step === 'login' && (
          <p className="text-center text-white/70 mt-6">
            Pas de compte ?{' '}
            <Link 
              href="/register" 
              className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
            >
              Inscrivez-vous
            </Link>
          </p>
        )}
      </div>

      {/* Styles d'animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  )
}