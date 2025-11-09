'use client'

import React, { useState, useEffect } from 'react'
import { 
  FaUser, FaHome, FaEdit, FaSave, FaTimes, 
  FaUniversity, FaIdCard, FaCreditCard, 
  FaHistory, FaCog, FaBell, FaSignOutAlt 
} from 'react-icons/fa'

export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cin: '',
    rib: '',
    bankName: '',
    accountNumber: ''
  })

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const checkAuthAndLoadData = async () => {
    try {
      const authResponse = await fetch('http://localhost:8080/api/auth/check-auth', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })

      if (authResponse.ok) {
        await fetchDashboardData()
        await fetchUserProfile()
      } else {
        setError('Session expirée. Veuillez vous reconnecter.')
        setTimeout(() => window.location.href = '/login', 2000)
      }
    } catch (error) {
      setError('Erreur de connexion au serveur')
      setTimeout(() => window.location.href = '/login', 2000)
    }
  }

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/home', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        const data = await response.json()
        setUserInfo(data)
        setError('')
      }
    } catch (error) {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/user/profile', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        const profileData = await response.json()
        setUserData({
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          email: profileData.email || '',
          cin: profileData.cin || '',
          rib: profileData.rib || '',
          bankName: profileData.bankName || '',
          accountNumber: profileData.accountNumber || ''
        })
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error)
    }
  }

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/user/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        setIsEditing(false)
        await fetchUserProfile()
        setError('')
      } else {
        const errorText = await response.text()
        setError(`Erreur lors de la mise à jour: ${errorText}`)
      }
    } catch (error) {
      setError('Erreur lors de la sauvegarde des données')
    }
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    fetchUserProfile() 
  }

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } finally {
      window.location.href = '/login'
    }
  }

  // Fermer le menu profil en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.profile-menu') && !target.closest('.profile-button')) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-light">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-xl border-b border-cyan-500/20 p-6 relative z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <FaHome className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Tableau de Bord
              </h1>
              <p className="text-cyan-100/70 text-sm">Gestion de votre espace personnel</p>
            </div>
          </div>

          {/* Bouton profil */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="profile-button flex items-center gap-3 bg-cyan-500/10 hover:bg-cyan-500/20 px-4 py-3 rounded-2xl transition-all duration-300 backdrop-blur-lg border border-cyan-500/30 hover:border-cyan-400/50"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <FaUser className="text-white text-sm" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm text-white">{userData.firstName} {userData.lastName}</p>
                <p className="text-cyan-300 text-xs">
                  {userInfo?.roles?.[0]?.replace('ROLE_', '') || 'Utilisateur'}
                </p>
              </div>
            </button>

            {/* Menu profil */}
            {showProfileMenu && (
              <div className="profile-menu absolute right-0 top-16 w-80 bg-gradient-to-br from-slate-800/95 to-purple-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 z-50 overflow-hidden animate-fadeIn">
                {/* En-tête */}
                <div className="p-6 bg-gradient-to-r from-cyan-600/40 to-purple-600/40 border-b border-cyan-500/30">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <FaUser className="text-white text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-white">{userData.firstName} {userData.lastName}</h3>
                      <p className="text-cyan-200 text-sm">{userData.email}</p>
                      <div className="flex gap-1 mt-2">
                        {userInfo?.roles?.map((role: string, index: number) => (
                          <span 
                            key={index} 
                            className="bg-cyan-500/40 text-cyan-100 px-2 py-1 rounded-full text-xs font-medium border border-cyan-400/30"
                          >
                            {role.replace('ROLE_', '')}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations personnelles */}
                <div className="p-4 border-b border-cyan-500/20">
                  <h4 className="font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                    <FaUser className="text-sm" />
                    Informations Personnelles
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-cyan-100/80">Nom complet</span>
                      <span className="text-white font-medium">{userData.firstName} {userData.lastName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-cyan-100/80">Email</span>
                      <span className="text-cyan-300 font-medium">{userData.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-cyan-100/80">CIN</span>
                      <span className="text-white font-medium">{userData.cin || 'Non renseigné'}</span>
                    </div>
                  </div>
                </div>

                {/* Historique */}
                <div className="p-4 border-b border-cyan-500/20">
                  <h4 className="font-semibold text-cyan-300 mb-3 flex items-center gap-2">
                    <FaHistory className="text-sm" />
                    Historique Récent
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-cyan-100/80">Connexion</span>
                      <span className="text-green-400 text-xs bg-green-400/10 px-2 py-1 rounded-full">Aujourd'hui</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-cyan-100/80">Profil consulté</span>
                      <span className="text-cyan-400 text-xs bg-cyan-400/10 px-2 py-1 rounded-full">Il y a 2 jours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-cyan-100/80">Compte créé</span>
                      <span className="text-purple-400 text-xs bg-purple-400/10 px-2 py-1 rounded-full">Il y a 1 semaine</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 bg-slate-800/50">
                  <button
                    onClick={() => { setIsEditing(true); setShowProfileMenu(false); }}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500/30 to-cyan-600/30 hover:from-cyan-500/40 hover:to-cyan-600/40 text-cyan-100 border border-cyan-500/30 px-4 py-3 rounded-xl transition-all duration-200 mb-3 hover:shadow-lg hover:shadow-cyan-500/20"
                  >
                    <FaEdit className="text-sm" />
                    Modifier le profil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-300 border border-red-500/30 px-4 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-red-500/10"
                  >
                    <FaSignOutAlt className="text-sm" />
                    Déconnexion
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto p-6 relative z-10">
        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 bg-red-500/10 backdrop-blur-lg border border-red-500/30 rounded-2xl p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-red-400">⚠️</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-300 mb-1">Erreur</h3>
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              </div>
              <button 
                onClick={() => setError('')}
                className="text-red-300 hover:text-red-200 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {/* Formulaire d'édition */}
        {isEditing && (
          <div className="mb-6 bg-gradient-to-br from-slate-800/80 to-purple-900/80 backdrop-blur-lg border border-cyan-500/30 rounded-2xl p-6 animate-slideDown shadow-2xl shadow-cyan-500/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-cyan-300">Modifier le Profil</h2>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/40"
                >
                  <FaSave />
                  Sauvegarder
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-slate-500/30"
                >
                  <FaTimes />
                  Annuler
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Informations personnelles */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-2">
                  <FaUser className="text-cyan-400" />
                  Informations Personnelles
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-cyan-200 text-sm mb-2 font-medium">Prénom</label>
                    <input
                      type="text"
                      value={userData.firstName}
                      onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                      className="w-full bg-slate-700/60 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-slate-700/80 transition-all duration-300 placeholder-slate-400"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-200 text-sm mb-2 font-medium">Nom</label>
                    <input
                      type="text"
                      value={userData.lastName}
                      onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                      className="w-full bg-slate-700/60 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-slate-700/80 transition-all duration-300 placeholder-slate-400"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-200 text-sm mb-2 font-medium">Email</label>
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                      className="w-full bg-slate-700/60 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-slate-700/80 transition-all duration-300 placeholder-slate-400"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>
              </div>

              {/* Coordonnées bancaires */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-2">
                  <FaCreditCard className="text-cyan-400" />
                  Coordonnées Bancaires
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-cyan-200 text-sm mb-2 font-medium">CIN</label>
                    <input
                      type="text"
                      value={userData.cin}
                      onChange={(e) => setUserData({...userData, cin: e.target.value})}
                      className="w-full bg-slate-700/60 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-slate-700/80 transition-all duration-300 placeholder-slate-400"
                      placeholder="Votre numéro CIN"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-200 text-sm mb-2 font-medium">RIB</label>
                    <input
                      type="text"
                      value={userData.rib}
                      onChange={(e) => setUserData({...userData, rib: e.target.value})}
                      className="w-full bg-slate-700/60 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-slate-700/80 transition-all duration-300 placeholder-slate-400"
                      placeholder="Votre RIB"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-200 text-sm mb-2 font-medium">Nom de la banque</label>
                    <input
                      type="text"
                      value={userData.bankName}
                      onChange={(e) => setUserData({...userData, bankName: e.target.value})}
                      className="w-full bg-slate-700/60 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-slate-700/80 transition-all duration-300 placeholder-slate-400"
                      placeholder="Nom de votre banque"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-200 text-sm mb-2 font-medium">Numéro de compte</label>
                    <input
                      type="text"
                      value={userData.accountNumber}
                      onChange={(e) => setUserData({...userData, accountNumber: e.target.value})}
                      className="w-full bg-slate-700/60 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-slate-700/80 transition-all duration-300 placeholder-slate-400"
                      placeholder="Numéro de compte"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Carte de bienvenue */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/60 to-purple-900/60 backdrop-blur-lg border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-400/40 transition-all duration-500 group">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/30 group-hover:shadow-cyan-500/40 transition-all duration-500">
                <FaUser className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  Bonjour, {userData.firstName} !
                </h2>
                <p className="text-cyan-100/70 text-lg">Bienvenue dans votre espace personnel</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-cyan-500/20">
                <div className="text-cyan-400 text-2xl font-bold mb-1">
                  {userInfo?.roles?.length || 0}
                </div>
                <div className="text-cyan-100/60 text-sm">Rôles</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-green-500/20">
                <div className="text-green-400 text-2xl font-bold mb-1">
                  {userData.cin ? '✅' : '❌'}
                </div>
                <div className="text-cyan-100/60 text-sm">CIN</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transitionall duration-300 border border-white/5 hover:border-purple-500/20">
                <div className="text-purple-400 text-2xl font-bold mb-1">
                  {userData.rib ? '✅' : '❌'}
                </div>
                <div className="text-cyan-100/60 text-sm">RIB</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-cyan-500/20">
                <div className="text-cyan-400 text-2xl font-bold mb-1">
                  {userData.bankName ? '🏦' : '❌'}
                </div>
                <div className="text-cyan-100/60 text-sm">Banque</div>
              </div>
            </div>
          </div>

          {/* Carte coordonnées bancaires */}
          <div className="bg-gradient-to-br from-slate-800/60 to-purple-900/60 backdrop-blur-lg border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-400/40 transition-all duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaCreditCard className="text-white text-lg" />
              </div>
              <h3 className="text-xl font-semibold text-cyan-300">Coordonnées Bancaires</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/5">
                <FaIdCard className="text-cyan-400 text-lg" />
                <div className="flex-1">
                  <p className="text-cyan-100/60 text-sm">CIN</p>
                  <p className="font-semibold text-white">{userData.cin || 'Non renseigné'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/5">
                <FaCreditCard className="text-cyan-400 text-lg" />
                <div className="flex-1">
                  <p className="text-cyan-100/60 text-sm">RIB</p>
                  <p className="font-semibold text-white">{userData.rib || 'Non renseigné'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/5">
                <FaUniversity className="text-cyan-400 text-lg" />
                <div className="flex-1">
                  <p className="text-cyan-100/60 text-sm">Banque</p>
                  <p className="font-semibold text-white">{userData.bankName || 'Non renseigné'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/5">
                <FaCreditCard className="text-cyan-400 text-lg" />
                <div className="flex-1">
                  <p className="text-cyan-100/60 text-sm">Numéro de compte</p>
                  <p className="font-semibold text-white">{userData.accountNumber || 'Non renseigné'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gradient-to-br from-cyan-900/40 to-slate-800/60 backdrop-blur-lg border border-cyan-500/20 rounded-2xl p-6 text-center hover:border-cyan-400/40 transition-all duration-300 group">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-cyan-500/30 transition-all duration-300">
              <FaBell className="text-cyan-400 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-cyan-300 mb-2">Notifications</h3>
            <p className="text-3xl font-bold text-white mb-1">0</p>
            <p className="text-cyan-100/60 text-sm">Aucune notification</p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-slate-800/60 backdrop-blur-lg border border-purple-500/20 rounded-2xl p-6 text-center hover:border-purple-400/40 transition-all duration-300 group">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/30 transition-all duration-300">
              <FaCog className="text-purple-400 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-purple-300 mb-2">Paramètres</h3>
            <p className="text-3xl font-bold text-white mb-1">3</p>
            <p className="text-cyan-100/60 text-sm">Options disponibles</p>
          </div>

          <div className="bg-gradient-to-br from-green-900/40 to-slate-800/60 backdrop-blur-lg border border-green-500/20 rounded-2xl p-6 text-center hover:border-green-400/40 transition-all duration-300 group">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/30 transition-all duration-300">
              <FaHistory className="text-green-400 text-xl" />
            </div>
            <h3 className="text-lg font-semibold text-green-300 mb-2">Activité</h3>
            <p className="text-3xl font-bold text-white mb-1">12</p>
            <p className="text-cyan-100/60 text-sm">Actions ce mois</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800/80 backdrop-blur-lg border-t border-cyan-500/20 p-6 mt-12">
        <div className="container mx-auto text-center">
          <p className="text-cyan-100/60 text-sm">
            © 2025 Espace Personnel - Conçu avec soin pour vous
          </p>
          <div className="flex justify-center gap-6 mt-3">
            <span className="text-cyan-400/60 text-xs">🔒 Sécurisé</span>
            <span className="text-purple-400/60 text-xs">⚡ Rapide</span>
            <span className="text-green-400/60 text-xs">🛡️ Fiable</span>
          </div>
        </div>
      </footer>

      {/* Styles d'animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(-10px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translateY(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}