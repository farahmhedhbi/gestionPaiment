'use client'

import React, { useState, useEffect } from 'react'
import { 
  FaUser, FaHome, FaEdit, FaSave, FaTimes, 
  FaUniversity, FaIdCard, FaCreditCard, 
  FaHistory, FaCog, FaBell, FaSignOutAlt,
  FaTasks, FaList 
} from 'react-icons/fa'

export default function DashboardPage() {
  const [userInfo, setUserInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [success, setSuccess] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [cinModified, setCinModified] = useState(false)
  const [nameModified, setNameModified] = useState(false)
  const [fonctionnalites, setFonctionnalites] = useState<{[key: string]: string}>({})
  
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cin: '',
    rib: '',
    bankName: '',
    fonctionnalite: ''
  })

  // Liste des banques tunisiennes
  const bankNames = [
    'Banque Centrale de Tunisie',
    'Banque de Tunisie',
    'Société Tunisienne de Banque',
    'Banque Nationale Agricole',
    'Banque de l\'Habitat',
    'Banque Internationale Arabe de Tunisie',
    'Amen Bank',
    'Union Internationale de Banques',
    'Arab Tunisian Bank',
    'Banque de Tunisie et des Emirats',
    'Attijari Bank',
    'Banque de Financement des Petites et Moyennes Entreprises',
    'Banque Tuniso-Koweitienne',
    'Tunisian Saudi Bank',
    'Banque de Tunisie et des Emirats',
    'Banque Tuniso-Libyenne',
    'Banque Zitouna',
    'Al Baraka Bank',
    'Banque de Développement Local',
    'Banque Tuniso-Qatari'
  ]

  // Fonction de validation du CIN
  const validateCIN = (cin: string) => {
    return /^[0-9]{8}$/.test(cin);
  }

  // Fonction de validation du RIB
  const validateRIB = (rib: string) => {
    return /^[0-9]{20}$/.test(rib);
  }

  // Vérifier si l'utilisateur est coordinateur
  const isCoordinateur = userInfo?.roles?.some((role: string) => 
    role.includes('COORDINATEUR') || role.includes('ADMIN')
  )

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
        await fetchFonctionnalites()
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
          fonctionnalite: profileData.fonctionnalite || ''
        })
        // Si le CIN existe déjà, on considère qu'il a déjà été saisi
        if (profileData.cin) {
          setCinModified(true)
        }
        // Si le nom et prénom existent déjà, on considère qu'ils ont déjà été saisis
        if (profileData.firstName && profileData.lastName) {
          setNameModified(true)
        }
      }
    } catch (error) {
      console.error('Erreur chargement profil:', error)
    }
  }

  const fetchFonctionnalites = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/user/fonctionnalites', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        const data = await response.json()
        setFonctionnalites(data)
      }
    } catch (error) {
      console.error('Erreur chargement fonctionnalités:', error)
    }
  }

  const handleSaveProfile = async () => {
    // Validation du CIN
    if (userData.cin && !validateCIN(userData.cin)) {
      setError('Le CIN doit contenir exactement 8 chiffres');
      setSuccess('');
      return;
    }

    // Validation du RIB
    if (userData.rib && !validateRIB(userData.rib)) {
      setError('Le RIB doit contenir exactement 20 chiffres');
      setSuccess('');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/user/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      if (response.ok) {
        setIsEditing(false)
        setCinModified(true)
        setNameModified(true)
        await fetchUserProfile()
        setError('')
        setSuccess('Profil mis à jour avec succès!')
        
        // Masquer le message de succès après 3 secondes
        setTimeout(() => {
          setSuccess('')
        }, 3000)
      } else {
        const errorText = await response.text()
        setError(`Erreur lors de la mise à jour: ${errorText}`)
        setSuccess('')
      }
    } catch (error) {
      setError('Erreur lors de la sauvegarde des données')
      setSuccess('')
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
                    {isCoordinateur && userData.fonctionnalite && (
                      <div className="flex justify-between items-center">
                        <span className="text-cyan-100/80">Fonctionnalité</span>
                        <span className="text-purple-300 font-medium">{userData.fonctionnalite}</span>
                      </div>
                    )}
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

        {/* Message de succès */}
        {success && (
          <div className="mb-6 bg-green-500/10 backdrop-blur-lg border border-green-500/30 rounded-2xl p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-green-400">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-300 mb-1">Succès</h3>
                  <p className="text-green-200 text-sm">{success}</p>
                </div>
              </div>
              <button 
                onClick={() => setSuccess('')}
                className="text-green-300 hover:text-green-200 transition-colors"
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
                    <label className="block text-cyan-200 text-sm mb-2 font-medium">
                      Prénom {nameModified && <span className="text-green-400 text-xs">(Verrouillé)</span>}
                    </label>
                    <input
                      type="text"
                      value={userData.firstName}
                      onChange={(e) => {
                        if (!nameModified) {
                          setUserData({...userData, firstName: e.target.value})
                        }
                      }}
                      readOnly={nameModified}
                      className={`w-full bg-slate-700/60 border ${
                        nameModified ? 'border-green-500/30' : 'border-cyan-500/30'
                      } rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-slate-700/80 transition-all duration-300 placeholder-slate-400 ${
                        nameModified ? 'cursor-not-allowed opacity-80' : ''
                      }`}
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-cyan-200 text-sm mb-2 font-medium">
                      Nom {nameModified && <span className="text-green-400 text-xs">(Verrouillé)</span>}
                    </label>
                    <input
                      type="text"
                      value={userData.lastName}
                      onChange={(e) => {
                        if (!nameModified) {
                          setUserData({...userData, lastName: e.target.value})
                        }
                      }}
                      readOnly={nameModified}
                      className={`w-full bg-slate-700/60 border ${
                        nameModified ? 'border-green-500/30' : 'border-cyan-500/30'
                      } rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-slate-700/80 transition-all duration-300 placeholder-slate-400 ${
                        nameModified ? 'cursor-not-allowed opacity-80' : ''
                      }`}
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

              {/* Coordonnées bancaires et fonctionnalité */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-2">
                  <FaCreditCard className="text-cyan-400" />
                  Coordonnées et Fonctionnalité
                </h3>
                
                <div className="space-y-4">
                  {/* Champ CIN - lecture seule après première modification */}
                  <div>
                    <label className="block text-cyan-200 text-sm mb-2 font-medium">
                      CIN {cinModified && <span className="text-green-400 text-xs">(Verrouillé)</span>}
                    </label>
                    <input
                      type="text"
                      value={userData.cin}
                      onChange={(e) => {
                        if (!cinModified) {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          if (value.length <= 8) {
                            setUserData({...userData, cin: value})
                          }
                        }
                      }}
                      readOnly={cinModified}
                      maxLength={8}
                      className={`w-full bg-slate-700/60 border ${
                        cinModified ? 'border-green-500/30' : 'border-cyan-500/30'
                      } rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-slate-700/80 transition-all duration-300 placeholder-slate-400 ${
                        cinModified ? 'cursor-not-allowed opacity-80' : ''
                      }`}
                      placeholder="8 chiffres"
                    />
                    {userData.cin && !validateCIN(userData.cin) && (
                      <p className="text-red-400 text-xs mt-1">Le CIN doit contenir 8 chiffres</p>
                    )}
                  </div>

                  {/* Champ RIB - toujours modifiable */}
                  <div>
                    <label className="block text-cyan-200 text-sm mb-2 font-medium">RIB</label>
                    <input
                      type="text"
                      value={userData.rib}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        if (value.length <= 20) {
                          setUserData({...userData, rib: value})
                        }
                      }}
                      maxLength={20}
                      className="w-full bg-slate-700/60 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-slate-700/80 transition-all duration-300 placeholder-slate-400"
                      placeholder="20 chiffres"
                    />
                    {userData.rib && !validateRIB(userData.rib) && (
                      <p className="text-red-400 text-xs mt-1">Le RIB doit contenir 20 chiffres</p>
                    )}
                  </div>

                  {/* Champ nom de la banque - liste déroulante */}
                  <div>
                    <label className="block text-cyan-200 text-sm mb-2 font-medium">Nom de la banque</label>
                    <select
                      value={userData.bankName}
                      onChange={(e) => setUserData({...userData, bankName: e.target.value})}
                      className="w-full bg-slate-700/60 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-slate-700/80 transition-all duration-300"
                    >
                      <option value="">Sélectionnez une banque</option>
                      {bankNames.map((bankName, index) => (
                        <option key={index} value={bankName}>
                          {bankName}
                        </option>
                      ))}
                    </select>
                  </div>

                  

                  {/* Sélection de fonctionnalité pour coordinateur */}
                  {isCoordinateur && (
                    <div>
                      <label className="block text-cyan-200 text-sm mb-2 font-medium">
                        Fonctionnalité principale
                      </label>
                      <div className="relative">
                        <FaList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 z-10" />
                        <select
                          value={userData.fonctionnalite}
                          onChange={(e) => setUserData({...userData, fonctionnalite: e.target.value})}
                          className="w-full bg-slate-700/60 border border-cyan-500/30 rounded-xl px-10 py-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-slate-700/80 transition-all duration-300 appearance-none"
                        >
                          <option value="">Sélectionnez une fonctionnalité</option>
                          {Object.entries(fonctionnalites).map(([key, value]) => (
                            <option key={key} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-400 pointer-events-none">
                          ▼
                        </div>
                      </div>
                      <p className="text-cyan-200/60 text-xs mt-2">
                        Choisissez votre fonctionnalité principale en tant que coordinateur
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte de bienvenue AVEC FONCTIONNALITE INTEGREE */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-800/60 to-purple-900/60 backdrop-blur-lg border border-cyan-500/20 rounded-2xl p-8 hover:border-cyan-400/40 transition-all duration-500 group">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-cyan-500/30 group-hover:shadow-cyan-500/40 transition-all duration-500">
                  <FaUser className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    Bonjour, {userData.firstName} !
                  </h2>
                  <p className="text-cyan-100/70 text-lg">Bienvenue dans votre espace personnel</p>
                  
                  {/* Affichage de la fonctionnalité pour coordinateur */}
                  {isCoordinateur && userData.fonctionnalite && (
                    <div className="mt-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                        <FaTasks className="text-white text-sm" />
                      </div>
                      <div>
                        <p className="text-cyan-100/60 text-sm">Fonctionnalité active</p>
                        <p className="text-orange-300 font-semibold text-lg">{userData.fonctionnalite}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Bouton modifier fonctionnalité pour coordinateur */}
              
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
              <div className="bg-white/5 rounded-xl p-4 text-center hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-purple-500/20">
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

            {/* Section fonctionnalité étendue pour coordinateur */}
            {isCoordinateur && (
              <div className="mt-6 pt-6 border-t border-cyan-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <FaTasks className="text-orange-400 text-lg" />
                  <h3 className="text-lg font-semibold text-cyan-300">Ma Fonctionnalité</h3>
                </div>
                
                {userData.fonctionnalite ? (
                  <div className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-300 font-semibold text-lg">{userData.fonctionnalite}</p>
                        <p className="text-orange-200/60 text-sm mt-1">
                          Cette fonctionnalité définit votre rôle principal dans le système
                        </p>
                      </div>
                      <div className="text-orange-400 text-2xl">🚀</div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-500/30 rounded-xl p-4 text-center">
                    <p className="text-cyan-100/60 mb-2">Aucune fonctionnalité définie</p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-orange-400 hover:text-orange-300 text-sm font-medium"
                    >
                      Cliquez ici pour définir votre fonctionnalité
                    </button>
                  </div>
                )}
              </div>
            )}
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
                  <p className="text-cyan-100/60 text-sm">
                    CIN {cinModified && <span className="text-green-400 text-xs">(Verrouillé)</span>}
                  </p>
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