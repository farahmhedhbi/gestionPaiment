'use client'

import React, { useEffect, useState } from 'react'
import {
  FaUserTie,
  FaChalkboardTeacher,
  FaTrash,
  FaEdit,
  FaSignOutAlt,
  FaUsers,
  FaSync,
  FaExclamationTriangle,
} from 'react-icons/fa'
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
  const [formateursCount, setFormateursCount] = useState(0)
  const [coordinateursCount, setCoordinateursCount] = useState(0)

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
      const timeSinceLogin = Date.now() - parseInt(loginTime, 10)
      const day = 24 * 60 * 60 * 1000

      if (timeSinceLogin < day) {
        await verifyBackendAdminAccess()
        return
      }

      localStorage.removeItem('adminAuthenticated')
      localStorage.removeItem('adminLoginTime')
    }

    router.push('/admin')
  }

  const verifyBackendAdminAccess = async () => {
    try {
      const authResponse = await fetch('http://localhost:8080/api/auth/check-auth', {
        method: 'GET',
        credentials: 'include',
      })

      if (!authResponse.ok) {
        setError('Session expirée. Veuillez vous reconnecter.')
        handleLogout()
        return
      }

      const authData = await authResponse.json()
      const roles = authData.roles || []
      setUserRoles(roles)

      const isAdminRole = roles.includes('ROLE_ADMIN')
      setIsAdmin(isAdminRole)
      setIsAuthenticated(true)

      if (!isAdminRole) {
        setError("Accès refusé. Droits administrateur requis.")
        setLoading(false)
        return
      }

      await Promise.all([loadUsers(), loadFormateurs(), loadCoordinateurs()])
    } catch (err) {
      console.error(err)
      setError('Erreur de connexion au serveur.')
      setLoading(false)
    }
  }

  // ✅ CHARGE UNIQUEMENT LES NON-ADMINS
  const loadUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('http://localhost:8080/api/admin/users', {
        credentials: 'include',
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(`HTTP ${res.status}: ${text}`)
      }

      const data: User[] = await res.json()

      // ✅ IMPORTANT : filtre admin
      setUsers(data.filter(u => !u.roles.includes('ROLE_ADMIN')))

    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Erreur lors du chargement des utilisateurs.')
    } finally {
      setLoading(false)
    }
  }

  const loadFormateurs = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/formateurs', { credentials: 'include' })
      if (res.ok) {
        const list: User[] = await res.json()
        setFormateursCount(list.length)
      }
    } catch {}
  }

  const loadCoordinateurs = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/coordinateurs', { credentials: 'include' })
      if (res.ok) {
        const list: User[] = await res.json()
        setCoordinateursCount(list.length)
      }
    } catch {}
  }

  const handleRefresh = () => {
    Promise.all([loadUsers(), loadFormateurs(), loadCoordinateurs()])
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminLoginTime')
    router.push('/admin')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) return
    try {
      const res = await fetch(`http://localhost:8080/api/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        const t = await res.text()
        alert(`Erreur lors de la suppression: ${t}`)
        return
      }
      await handleRefresh()
    } catch {
      alert('Erreur lors de la suppression')
    }
  }

  const handleEdit = (user: User) => {
    alert(`Édition de l'utilisateur: ${user.firstName} ${user.lastName}`)
  }

const getRoleDisplay = (roles: any[]) => {
  if (!roles || roles.length === 0) return "Utilisateur"

  let role = roles[0]

  // Si le rôle est un objet
  if (typeof role === "object") {
    role = role.name || role.roleName || "ROLE_USER"
  }

  // Si c’est encore pas une string
  if (typeof role !== "string") return "Utilisateur"

  return role.replace("ROLE_", "")
}




  const getRoleColor = (roles: string[]) => {
    if (roles.includes('ROLE_COORDINATEUR')) return 'bg-purple-500/20 text-purple-300'
    if (roles.includes('ROLE_FORMATEUR')) return 'bg-blue-500/20 text-blue-300'
    return 'bg-gray-500/20 text-gray-300'
  }

  const getRoleIcon = (roles: string[]) =>
    roles.includes('ROLE_COORDINATEUR') ? <FaUserTie /> : <FaChalkboardTeacher />

  // ✅ Écran loading
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

  // ✅ Auth mais pas admin
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
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg"
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
              <p className="text-white/70 text-sm mb-2">Vos rôles détectés :</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {userRoles.map((r, i) => (
                  <span key={i} className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                    {r.replace('ROLE_', '')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ✅ Dashboard
  const stats = {
    totalUsers: users.length,
    formateurs: formateursCount,
    coordinateurs: coordinateursCount,
  }

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
              <p className="text-white/70 text-sm">Panel de gestion des utilisateurs</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg"
            >
              <FaSync className={loading ? 'animate-spin' : ''} />
              Actualiser
            </button>

            <div className="bg-white/10 px-4 py-2 rounded-lg">
              <span className="text-red-300 font-medium">Administrateur</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg"
            >
              <FaSignOutAlt />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* ✅ 3 blocs (admin supprimé) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 border border-white/10 rounded-2xl p-6">
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

          <div className="bg-white/10 border border-white/10 rounded-2xl p-6">
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

          <div className="bg-white/10 border border-white/10 rounded-2xl p-6">
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
        </div>

        {/* ✅ erreurs */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
            <div className="flex justify-between">
              <div>
                <h3 className="text-lg font-semibold text-red-300 mb-2">Erreur</h3>
                <p className="text-red-200">{error}</p>
              </div>
              <button
                onClick={handleRefresh}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-lg"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* ✅ Liste sans admins */}
        <div className="bg-white/10 border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Gestion des utilisateurs</h2>

            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-lg"
              >
                <FaSync className={loading ? 'animate-spin' : ''} />
                {loading ? 'Chargement...' : 'Actualiser'}
              </button>

            
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/70">Chargement des utilisateurs...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <FaUsers className="text-4xl text-white/30 mx-auto mb-4" />
              <p className="text-white/70">Aucun utilisateur trouvé</p>
              <button onClick={handleRefresh} className="mt-4 text-blue-400">
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
                     
                    </div>

                    <div className="flex gap-2">
                      
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg"
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
