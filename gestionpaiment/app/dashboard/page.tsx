'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaUser, FaHome, FaCreditCard, FaUniversity, FaIdCard,
  FaBell, FaCog, FaHistory, FaTasks
} from 'react-icons/fa';
import { useAuth } from '@/app/hooks/useAuth';
import { apiService } from '@/app/services/api';
import { User } from '@/app/types';
import { ProfileMenu } from '@/app/components/features/dashboard/ProfileMenu';
import { EditProfileForm } from '@/app/components/features/dashboard/EditProfileForm';
import { useRouter } from "next/navigation";   

export default function DashboardPage() {

  const router = useRouter();
  const { user: authUser, logout } = useAuth();

  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiService.checkAuth();

        if (!res.authenticated) {
          return router.push("/login");
        }

        setAuthChecking(false);

      } catch (e) {
        router.push("/login");
      }
    };

    checkAuth();
  }, []);
  // ===============================
  // TON ANCIEN CODE RESTE ICI NORMAL
  // ===============================

  const [userData, setUserData] = useState<User>({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    roles: [],
    cin: '',
    rib: '',
    bankName: '',
    fonctionnalite: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [cinModified, setCinModified] = useState(false);
  const [nameModified, setNameModified] = useState(false);
  const [fonctionnalites, setFonctionnalites] = useState<{[key: string]: string}>({});

  const isCoordinateur = authUser?.roles?.some(
    (role: string) => role.includes("COORDINATEUR") || role.includes("ADMIN")
  );

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    if (isEditing) setShowProfileMenu(false);
  }, [isEditing]);

  const loadUserData = async () => {
    try {
      setError('');
      setLoading(true);

      const profileData = await apiService.getUserProfile();

      const userIsCoordinateur = profileData.roles?.some(
        (role: string) => role.includes("COORDINATEUR") || role.includes("ADMIN")
      );

      let fonctionnalitesData = {};
      if (userIsCoordinateur) {
        try {
          fonctionnalitesData = await apiService.getFonctionnalites();
          if (!fonctionnalitesData || typeof fonctionnalitesData !== "object") {
            fonctionnalitesData = getFonctionnalitesParDefaut();
          }
        } catch {
          fonctionnalitesData = getFonctionnalitesParDefaut();
        }
      }

      setUserData(profileData);
      setFonctionnalites(fonctionnalitesData);

      if (profileData.cin) setCinModified(true);
      if (profileData.firstName && profileData.lastName) setNameModified(true);

    } catch (error: any) {
      setError(`Erreur de chargement: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getFonctionnalitesParDefaut = () => ({
    'GESTION_FORMATEURS': 'Gestion des formateurs',
    'SUIVI_FORMATIONS': 'Suivi des formations',
    'VALIDATION_DOSSIERS': 'Validation des dossiers',
    'RAPPORTS_STATISTIQUES': 'Rapports statistiques',
    'GESTION_UTILISATEURS': 'Gestion des utilisateurs',
  });

  const handleSaveProfile = async (updatedData: User) => {
    try {
      await apiService.updateUserProfile(updatedData);
      setUserData(updatedData);
      setCinModified(true);
      setNameModified(true);
      setSuccess("Profil mis à jour avec succès !");
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    await logout();
  };
  // 🔒 Tant que la vérification d'authentification n'est pas finie
if (authChecking) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      Vérification de sécurité…
    </div>
  );
}


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-light">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
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
                  {userData.roles?.[0]?.replace('ROLE_', '') || 'Utilisateur'}
                </p>
              </div>
            </button>

            <ProfileMenu
              user={userData}
              isOpen={showProfileMenu}
              onClose={() => setShowProfileMenu(false)}
              onEdit={() => setIsEditing(true)}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto p-6 relative z-10">
        {/* Messages d'erreur/succès */}
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
                ✕
              </button>
            </div>
          </div>
        )}

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
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Formulaire d'édition */}
        {isEditing && (
          <EditProfileForm
            userData={userData}
            fonctionnalites={fonctionnalites}
            isCoordinateur={!!isCoordinateur}
            cinModified={cinModified}
            nameModified={nameModified}
            onSave={handleSaveProfile}
            onCancel={() => setIsEditing(false)}
          />
        )}

        {/* Grille principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte de bienvenue */}
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
                </div>
              </div>
            </div>
            
            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
          </div>

          {/* Carte COORDONNÉES avec fonctionnalité */}
          <div className="bg-gradient-to-br from-slate-800/60 to-purple-900/60 backdrop-blur-lg border border-cyan-500/20 rounded-2xl p-6 hover:border-cyan-400/40 transition-all duration-500">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaCreditCard className="text-white text-lg" />
              </div>
              <h3 className="text-xl font-semibold text-cyan-300">Coordonnées</h3>
            </div>

            {/* Coordonnées bancaires */}
            <div className="space-y-4 mb-6">
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

            {/* Fonctionnalité */}
            {isCoordinateur && (
              <div className="pt-4 border-t border-cyan-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <FaTasks className="text-orange-400 text-lg" />
                  <h4 className="text-lg font-semibold text-orange-300">Fonctionnalité</h4>
                </div>
                
                {userData.fonctionnalite ? (
                  <div className="bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/30 rounded-xl p-4">
                    <p className="text-orange-300 font-semibold text-center">{userData.fonctionnalite}</p>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-500/30 rounded-xl p-4 text-center">
                    <p className="text-cyan-100/60 mb-2">Aucune fonctionnalité définie</p>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-orange-400 hover:text-orange-300 text-sm font-medium"
                    >
                      Définir votre fonctionnalité
                    </button>
                  </div>
                )}
              </div>
            )}
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
  );
}