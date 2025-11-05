'use client'

import React, { useState, useEffect } from 'react'
import { FaUser, FaSignOutAlt, FaMoneyBillWave, FaHome } from 'react-icons/fa'

export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const checkAuthAndLoadData = async () => {
    try {
      console.log('🔍 Vérification de l\'authentification...')
      
      // 1. Vérifier d'abord si on est authentifié
      const authResponse = await fetch('http://localhost:8080/api/auth/check-auth', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      console.log('🔐 Statut vérification auth:', authResponse.status)

      if (authResponse.ok) {
        const authData = await authResponse.json()
        console.log('✅ Authentifié:', authData)
        
        // 2. Charger les données du dashboard
        await fetchDashboardData()
      } else {
        console.log('❌ Non authentifié, redirection vers login')
        setError('Session expirée. Veuillez vous reconnecter.')
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      }
      
    } catch (error) {
      console.error('💥 Erreur vérification auth:', error)
      setError('Erreur de connexion au serveur')
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    }
  }

  const fetchDashboardData = async () => {
    try {
      console.log('🔄 Chargement des données du dashboard...')
      
      const response = await fetch('http://localhost:8080/api/home', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      console.log('📡 Statut réponse dashboard:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Données dashboard reçues:', data)
        setUserInfo(data)
        setError('')
      } else {
        const errorText = await response.text()
        console.log('❌ Erreur dashboard:', response.status, errorText)
        setError(`Erreur ${response.status}: ${errorText}`)
      }
    } catch (error) {
      console.error('💥 Erreur réseau dashboard:', error)
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Erreur logout:', error)
    } finally {
      window.location.href = '/login'
    }
  }

  const handleRetry = () => {
    setLoading(true)
    setError('')
    checkAuthAndLoadData()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Chargement du tableau de bord...</p>
          <p className="text-sm text-cyan-300 mt-2">Vérification de l'authentification</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/10 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FaHome className="text-white text-lg" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Tableau de Bord
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {userInfo && (
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <FaUser className="text-cyan-400" />
                <span className="font-medium">{userInfo.user || userInfo.username}</span>
                <div className="flex gap-1">
                  {userInfo.roles?.map((role: string, index: number) => (
                    <span key={index} className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded text-xs font-medium">
                      {role.replace('ROLE_', '')}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <FaSignOutAlt />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto p-6">
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-red-300 mb-2">Erreur</h3>
                <p className="text-red-200">{error}</p>
              </div>
              <button
                onClick={handleRetry}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {userInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Carte de bienvenue */}
            <div className="col-span-full bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <FaUser className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Bienvenue !</h2>
                  <p className="text-white/70">Voici votre tableau de bord personnel</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white/70 text-sm">Email</p>
                  <p className="font-semibold text-cyan-300">{userInfo.user || userInfo.username}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white/70 text-sm">Authentifié</p>
                  <p className={`font-semibold ${userInfo.authenticated ? 'text-green-400' : 'text-red-400'}`}>
                    {userInfo.authenticated ? '✅ Oui' : '❌ Non'}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white/70 text-sm">Session</p>
                  <p className={`font-semibold ${userInfo.sessionActive ? 'text-green-400' : 'text-red-400'}`}>
                    {userInfo.sessionActive ? '✅ Active' : '❌ Inactive'}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white/70 text-sm">Rôles</p>
                  <p className="font-semibold text-purple-300">
                    {userInfo.roles?.length || 0}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-white/60">
                  <strong>Message:</strong> {userInfo.message}
                </p>
                {userInfo.roles && userInfo.roles.length > 0 && (
                  <p className="text-white/60 mt-1">
                    <strong>Rôles détaillés:</strong> {userInfo.roles.join(', ').replace(/ROLE_/g, '')}
                  </p>
                )}
              </div>
            </div>

            {/* Cartes de fonctionnalités */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors duration-200">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-3">
                <FaMoneyBillWave className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Gestion des Paiements</h3>
              <p className="text-white/70">Consultez et gérez tous les paiements de votre organisation.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors duration-200">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg flex items-center justify-center mb-3">
                <FaUser className="text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-3">Utilisateurs</h3>
              <p className="text-white/70">Gérez les comptes utilisateurs et les permissions.</p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/15 transition-colors duration-200">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mb-3">
                <span className="text-white font-bold">R</span>
              </div>
              <h3 className="text-lg font-semibold mb-3">Rapports</h3>
              <p className="text-white/70">Accédez aux rapports détaillés et statistiques.</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-lg border-t border-white/10 p-4 mt-8">
        <div className="container mx-auto text-center">
          <p className="text-white/60 text-sm">
            © 2024 Gestion Paiement - Tous droits réservés
          </p>
        </div>
      </footer>
    </div>
  )
}