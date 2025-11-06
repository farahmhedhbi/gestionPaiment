'use client'

import React, { useState, useEffect } from 'react'
import { FaUserTie, FaChalkboardTeacher, FaTrash, FaEdit, FaSignOutAlt, FaUsers, FaMoneyBillWave, FaChartBar, FaSync, FaExclamationTriangle } from 'react-icons/fa'
import { useRouter } from 'next/navigation'

type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  roles: string[]
  createdAt: string
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [error, setError] = useState('')
  const [userRoles, setUserRoles] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    const adminAuth = localStorage.getItem('adminAuthenticated')
    const loginTime = localStorage.getItem('adminLoginTime')
    
    if (adminAuth === 'true' && loginTime) {
      const timeSinceLogin = Date.now() - parseInt(loginTime)
      const twentyFourHours = 24 * 60 * 60 * 1000
      
      if (timeSinceLogin < twentyFourHours) {
        // Vérifier avec le backend si l'utilisateur est vraiment admin
        await verifyBackendAdminAccess()
      } else {
        // Session expirée
        localStorage.removeItem('adminAuthenticated')
        localStorage.removeItem('adminLoginTime')
        router.push('/admin')
      }
    } else {
      router.push('/admin')
    }
  }

  const verifyBackendAdminAccess = async () => {
    try {
      console.log('🔍 Vérification des droits administrateur avec le backend...')
      
      // 1. Vérifier l'authentification générale
      const authResponse = await fetch('http://localhost:8080/api/auth/check-auth', {
        method: 'GET',
        credentials: 'include',
      })

      if (authResponse.ok) {
        const authData = await authResponse.json()
        console.log('✅ Auth check - Rôles:', authData.roles)
        
        const roles = authData.roles || []
        setUserRoles(roles)
        
        // Vérifier si l'utilisateur a le rôle ADMIN
        const hasAdminRole = roles.includes('ROLE_ADMIN')
        setIsAdmin(hasAdminRole)
        setIsAuthenticated(true)

        if (hasAdminRole) {
          console.log('✅ Utilisateur a le rôle ADMIN, chargement des données...')
          await loadUsersFromBackend()
        } else {
          console.log('❌ Utilisateur n\'a pas le rôle ADMIN')
          setError('Accès refusé. Vous n\'avez pas les droits administrateur nécessaires.')
          setLoading(false)
        }
      } else {
        console.log('❌ Échec de la vérification d\'authentification')
        setError('Session expirée. Veuillez vous reconnecter.')
        handleLogout()
      }
    } catch (err) {
      console.error('💥 Erreur vérification admin:', err)
      setError('Erreur de connexion au serveur')
      setLoading(false)
    }
  }

  const loadUsersFromBackend = async () => {
    try {
      setLoading(true)
      setError('')
      
      console.log('🔄 Chargement des utilisateurs depuis le backend...')
      
      const response = await fetch('http://localhost:8080/api/admin/users', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      console.log('📡 Statut réponse users:', response.status)

      if (response.ok) {
        const usersData = await response.json()
        console.log('✅ Utilisateurs reçus:', usersData)
        setUsers(usersData)
      } else {
        const errorText = await response.text()
        console.error('❌ Erreur chargement users:', response.status, errorText)
        
        if (response.status === 401) {
          setError('Session expirée. Veuillez vous reconnecter.')
          handleLogout()
        } else if (response.status === 403) {
          setError('Accès refusé. Droits administrateur requis.')
          setIsAdmin(false)
        } else {
          setError(`Erreur ${response.status}: ${errorText}`)
        }
      }
    } catch (err) {
      console.error('💥 Erreur réseau:', err)
      setError('Erreur de connexion au serveur. Vérifiez que le backend est démarré.')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadUsersFromBackend()
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminLoginTime')
    router.push('/admin')
  }

  const handleDelete = async (id: number) => {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
          method: 'DELETE',
          credentials: 'include',
        })

        if (response.ok) {
          console.log('✅ Utilisateur supprimé:', id)
          // Recharger la liste
          loadUsersFromBackend()
        } else {
          const errorText = await response.text()
          alert(`Erreur lors de la suppression: ${errorText}`)
        }
      } catch (err) {
        console.error('Erreur suppression:', err)
        alert('Erreur lors de la suppression')
      }
    }
  }

  const handleEdit = (user: User) => {
    alert(`Édition de l'utilisateur: ${user.firstName} ${user.lastName}`)
  }

  const getRoleDisplay = (roles: string[]) => {
    if (roles.includes('ROLE_ADMIN')) return 'Administrateur'
    if (roles.includes('ROLE_COORDINATEUR')) return 'Coordinateur'
    if (roles.includes('ROLE_FORMATEUR')) return 'Formateur'
    return 'Utilisateur'
  }

  const getRoleColor = (roles: string[]) => {
    if (roles.includes('ROLE_ADMIN')) return 'bg-red-500/20 text-red-300'
    if (roles.includes('ROLE_COORDINATEUR')) return 'bg-purple-500/20 text-purple-300'
    if (roles.includes('ROLE_FORMATEUR')) return 'bg-blue-500/20 text-blue-300'
    return 'bg-gray-500/20 text-gray-300'
  }

  const getRoleIcon = (roles: string[]) => {
    if (roles.includes('ROLE_ADMIN')) return <FaUserTie />
    if (roles.includes('ROLE_COORDINATEUR')) return <FaUserTie />
    return <FaChalkboardTeacher />
  }

  // Si pas authentifié
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Vérification des accès administrateur...</p>
        </div>
      </div>
    )
  }

  // Si authentifié mais pas admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
        <header className="bg-white/10 backdrop-blur-lg border-b border-white/10 p-6">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FaUserTie className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
                  Administration
                </h1>
                <p className="text-white/70 text-sm">Accès refusé</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <FaSignOutAlt />
              Déconnexion
            </button>
          </div>
        </header>

        <div className="container mx-auto p-6">
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
            <FaExclamationTriangle className="text-6xl text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-300 mb-4">Accès Refusé</h2>
            <p className="text-red-200 text-lg mb-4">{error}</p>
            <div className="bg-white/5 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-white/70 text-sm mb-2">Vos rôles actuels:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {userRoles.map((role, index) => (
                  <span key={index} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                    {role.replace('ROLE_', '')}
                  </span>
                ))}
              </div>
              {userRoles.length === 0 && (
                <p className="text-white/50 text-sm">Aucun rôle détecté</p>
              )}
            </div>
            <div className="mt-6 space-y-3">
              <button
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-6 py-3 rounded-lg transition-colors"
              >
                Se déconnecter
              </button>
              <button
                onClick={verifyBackendAdminAccess}
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-6 py-3 rounded-lg transition-colors ml-4"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Si authentifié ET admin - afficher le dashboard
  const stats = {
    totalUsers: users.length,
    formateurs: users.filter(u => u.roles.includes('ROLE_FORMATEUR')).length,
    coordinateurs: users.filter(u => u.roles.includes('ROLE_COORDINATEUR')).length,
    admins: users.filter(u => u.roles.includes('ROLE_ADMIN')).length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-lg border-b border-white/10 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-purple-600 rounded-xl flex items-center justify-center">
              <FaUserTie className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
                Administration
              </h1>
              <p className="text-white/70 text-sm">Panel de gestion des utilisateurs</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
              title="Actualiser"
            >
              <FaSync className={loading ? 'animate-spin' : ''} />
              Actualiser
            </button>
            <div className="bg-white/10 px-4 py-2 rounded-lg">
              <span className="text-red-300 font-medium">Administrateur</span>
            </div>
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

      {/* Statistiques */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <FaUsers className="text-white text-xl" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Utilisateurs totaux</p>
                <p className="text-2xl font-bold text-cyan-300">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <FaChalkboardTeacher className="text-white text-xl" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Formateurs</p>
                <p className="text-2xl font-bold text-emerald-300">{stats.formateurs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <FaUserTie className="text-white text-xl" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Coordinateurs</p>
                <p className="text-2xl font-bold text-pink-300">{stats.coordinateurs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <FaUserTie className="text-white text-xl" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Administrateurs</p>
                <p className="text-2xl font-bold text-orange-300">{stats.admins}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-red-300 mb-2">Erreur</h3>
                <p className="text-red-200">{error}</p>
              </div>
              <button
                onClick={handleRefresh}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg transition-colors"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Liste des utilisateurs */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Gestion des utilisateurs</h2>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <FaSync className={loading ? 'animate-spin' : ''} />
                {loading ? 'Chargement...' : 'Actualiser'}
              </button>
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-lg font-semibold text-white hover:shadow-lg hover:shadow-green-500/30 transition-all">
                + Ajouter un utilisateur
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/70">Chargement des utilisateurs depuis le serveur...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <FaUsers className="text-4xl text-white/30 mx-auto mb-4" />
              <p className="text-white/70">Aucun utilisateur trouvé</p>
              <button
                onClick={handleRefresh}
                className="mt-4 text-blue-400 hover:text-blue-300"
              >
                Actualiser la liste
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map(user => (
                <div
                  key={user.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getRoleColor(user.roles)}`}>
                        {getRoleIcon(user.roles)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{user.firstName} {user.lastName}</h3>
                        <p className="text-white/60 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(user.roles)}`}>
                        {getRoleDisplay(user.roles)}
                      </span>
                      <p className="text-white/50 text-xs mt-1">
                        Créé le: {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg transition-colors"
                        title="Éditer"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}