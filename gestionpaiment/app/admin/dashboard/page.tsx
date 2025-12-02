'use client';

import React, { useEffect, useState } from 'react';
import {
  FaUserTie, FaSync, FaSignOutAlt, FaUsers,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { User } from '@/app/types';
import { apiService } from '@/app/services/api';
import { AdminStats } from '@/app/components/features/admin/AdminStats';
import { UserCard } from '@/app/components/features/admin/UserCard';
import { Button } from '@/app/components/ui/Button';
import { Session } from '@/app/types';
import { SessionCard } from '@/app/components/features/admin/SessionCard';
import { AssignSessionModal } from '@/app/components/features/admin/AssignSessionModal';
import SessionDetailsCard from '@/app/components/features/admin/SessionDetailsCard';

import { CreateSessionModal } from '@/app/components/features/admin/CreateSessionModal';


export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [formateursCount, setFormateursCount] = useState(0);
  const [coordinateursCount, setCoordinateursCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [adminId, setAdminId] = useState<number | null>(null);
  const [openAssignModal, setOpenAssignModal] = useState(false);
const [selectedSession, setSelectedSession] = useState<Session | null>(null);

const openAssign = (session: Session) => {
  setSelectedSession(session);
  setOpenAssignModal(true);
};

  // -------------------- SESSIONS --------------------
const [sessions, setSessions] = useState<Session[]>([]);
const [openCreateModal, setOpenCreateModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    const adminAuth = localStorage.getItem('adminAuthenticated');
    const loginTime = localStorage.getItem('adminLoginTime');

    if (adminAuth === 'true' && loginTime) {
      const timeSinceLogin = Date.now() - parseInt(loginTime, 10);
      const day = 24 * 60 * 60 * 1000;

      if (timeSinceLogin < day) {
        await verifyBackendAdminAccess();
        return;
      }

      localStorage.removeItem('adminAuthenticated');
      localStorage.removeItem('adminLoginTime');
    }

    router.push('/admin');
  };

  const verifyBackendAdminAccess = async () => {
  try {
    const authData = await apiService.checkAuth();

    if (!authData.authenticated) {
      setError("Vous devez être connecté.");
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    const roles = Array.isArray(authData.roles) ? authData.roles : [];
    setUserRoles(roles);

 
    setAdminId(authData.id ?? null);

    const isAdminRole = roles.includes("ROLE_ADMIN");
    setIsAdmin(isAdminRole);
    setIsAuthenticated(true);

    if (!isAdminRole) {
      setError("Accès refusé. Droits administrateur requis.");
      setLoading(false);
      return;
    }

    await Promise.all([
      loadUsers(authData.id),
      loadFormateurs(),
      loadCoordinateurs(),
      loadSessions(),
    ]);

  } catch (err) {
    console.error(err);
    setError("Erreur de connexion au serveur.");
  } finally {
    setLoading(false);
  }
};


  const loadUsers = async (currentAdminId?: number) => {
    setLoading(true);
    setError('');
    try {
      const data = await apiService.getUsers();

      const idToExclude = currentAdminId ?? adminId;

      if (idToExclude !== null) {
        const filtered = data.filter(u => u.id !== idToExclude);   // 🔥 exclure l’admin connecté
        setUsers(filtered);
      } else {
        setUsers(data);
      }

    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des utilisateurs.');
    } finally {
      setLoading(false);
    }
  };

  const loadFormateurs = async () => {
    try {
      const list = await apiService.getFormateurs();
      setFormateursCount(list.length);
    } catch {}
  };

  const loadCoordinateurs = async () => {
    try {
      const list = await apiService.getCoordinateurs();
      setCoordinateursCount(list.length);
    } catch {}
  };
const loadSessions = async () => {
  try {
    const list = await apiService.getSessions();
    console.log("🔶 SESSIONS RECUES :", list);
    console.log("IS ARRAY ?", Array.isArray(list));

    // Convertir objet → tableau
    const sessionsArray = Array.isArray(list) ? list : Object.values(list);

    setSessions(sessionsArray);
  } catch (e) {
    console.error("Erreur chargement sessions", e);
  }
};



  const handleRefresh = () => {
    Promise.all([loadUsers(), loadFormateurs(), loadCoordinateurs()]);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminLoginTime');
    router.push('/admin');
  };

  const handleDelete = async (id: number) => {

    if (adminId === id) {
      alert("Vous ne pouvez pas supprimer votre propre compte administrateur !");
      return;
    }

    if (!confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      return;
    }

    try {
      setLoading(true);
      await apiService.deleteUser(id);

      await loadUsers();
      await loadFormateurs();
      await loadCoordinateurs();

    } catch (error: any) {
      alert(`Erreur lors de la suppression: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  // -------------------- SESSIONS ACTIONS --------------------
const handleCreateSession = async (data: any) => {
  try {
    await apiService.createSession(data);
    setOpenCreateModal(false);
    loadSessions();
  } catch (e) {
    alert("Erreur création session");
  }
};

const handleDeleteSession = async (id: number) => {
  if (!confirm("Supprimer cette session ?")) return;
  await apiService.deleteSession(id);
  loadSessions();
};

const handleAssignFormateur = async (sessionId: number) => {
  const id = prompt("ID du formateur ?");
  if (!id) return;
  await apiService.assignFormateur(sessionId, Number(id));
  loadSessions();
};

const handleAssignCoordinateur = async (sessionId: number) => {
  const id = prompt("ID du coordinateur ?");
  if (!id) return;
  await apiService.assignCoordinateur(sessionId, Number(id));
  loadSessions();
};


  const stats = {
    totalUsers: users.length,
    formateurs: formateursCount,
    coordinateurs: coordinateursCount,
  };

  if (!isAuthenticated) {
    console.log("➡️ ID admin connecté :", adminId);
console.log("➡️ Users récupérés :", users);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Vérification des accès administrateur...</p>
        </div>
      </div>
    );
  }

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

            <Button onClick={handleLogout} variant="danger" className="flex items-center gap-2">
              <FaSignOutAlt />
              Déconnexion
            </Button>
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
    );
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
          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <FaSync className={loading ? 'animate-spin' : ''} />
            Actualiser
          </Button>

          <div className="bg-white/10 px-4 py-2 rounded-lg">
            <span className="text-red-300 font-medium">Administrateur</span>
          </div>

          <Button onClick={handleLogout} variant="danger" className="flex items-center gap-2">
            <FaSignOutAlt />
            Déconnexion
          </Button>
        </div>
      </div>
    </header>

    <div className="container mx-auto p-6">

      {/* ------------ STATS ----------- */}
      <AdminStats stats={stats} />

      {/* ------------ ERREUR ----------- */}
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <div className="flex justify-between">
            <div>
              <h3 className="text-lg font-semibold text-red-300 mb-2">Erreur</h3>
              <p className="text-red-200">{error}</p>
            </div>
            <Button
              onClick={handleRefresh}
              variant="danger"
              className="flex items-center gap-2"
            >
              Réessayer
            </Button>
          </div>
        </div>
      )}

      {/* ------------ UTILISATEURS ----------- */}
      <div className="bg-white/10 border border-white/10 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Gestion des utilisateurs</h2>

          <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="secondary"
            className="flex items-center gap-2"
          >
            <FaSync className={loading ? 'animate-spin' : ''} />
            {loading ? 'Chargement...' : 'Actualiser'}
          </Button>
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
              <UserCard
                key={user.id}
                user={user}
                onDelete={user.id === adminId ? () => {} : handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* ------------ SESSIONS ----------- */}
      <div className="bg-white/10 border border-white/10 rounded-2xl p-6 mt-10">

  <div className="flex justify-between items-center mb-6">
    <h2 className="text-2xl font-bold text-white">Gestion des sessions</h2>

    <Button
      onClick={() => setOpenCreateModal(true)}
      variant="secondary"
      className="flex items-center gap-2"
    >
      + Nouvelle session
    </Button>
  </div>

  {sessions.length === 0 ? (
    <div className="text-center py-8 text-white/70">Aucune session trouvée</div>
  ) : (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
  {sessions.map((session) => (
  <div key={session.id}>
    <SessionCard
      session={session}
      onAssign={() => openAssign(session)}
      onDelete={handleDeleteSession}
    />

  
  </div>
))}

      
    </div>
    
  )}
</div>
{/* SECTION DÉTAILS SESSIONS */}
<div className="mt-10">
  <h2 className="text-2xl font-bold text-white mb-4">Détails des sessions</h2>

  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    {sessions.flatMap(session =>
      session.affectations?.map((aff: any) => (
        <SessionDetailsCard
          key={aff.id}
          affectation={aff}
          sessionName={`${session.classe} (${session.promotion})`}
        />
      ))
    )}
  </div>
</div>



{/* CREATE SESSION MODAL */}
<CreateSessionModal
  open={openCreateModal}
  onClose={() => setOpenCreateModal(false)}
  onCreate={handleCreateSession}
/>

{/* 🔥 AFFECTER SESSION MODAL — AJOUT OBLIGATOIRE */}
<AssignSessionModal
  open={openAssignModal}
  session={selectedSession}
  onClose={() => setOpenAssignModal(false)}
  onUpdated={loadSessions}
    sessions={sessions} // 🔥 ajout essentiel

/>


    </div> 
  </div>
);
}