'use client';

import { User } from '@/app/types';
import { FaUser, FaEdit, FaSignOutAlt, FaHistory } from 'react-icons/fa';

interface ProfileMenuProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onLogout: () => void;
}

export const ProfileMenu = ({ user, isOpen, onClose, onEdit, onLogout }: ProfileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="profile-menu absolute right-0 top-16 w-80 bg-gradient-to-br from-slate-800/95 to-purple-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/20 z-50 overflow-hidden animate-fadeIn">
      {/* En-tête */}
      <div className="p-6 bg-gradient-to-r from-cyan-600/40 to-purple-600/40 border-b border-cyan-500/30">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
            <FaUser className="text-white text-xl" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-white">{user.firstName} {user.lastName}</h3>
            <p className="text-cyan-200 text-sm">{user.email}</p>
            <div className="flex gap-1 mt-2">
              {user.roles?.map((role: string, index: number) => (
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
            <span className="text-white font-medium">{user.firstName} {user.lastName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-cyan-100/80">Email</span>
            <span className="text-cyan-300 font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-cyan-100/80">CIN</span>
            <span className="text-white font-medium">{user.cin || 'Non renseigné'}</span>
          </div>
          {user.fonctionnalite && (
            <div className="flex justify-between items-center">
              <span className="text-cyan-100/80">Fonctionnalité</span>
              <span className="text-purple-300 font-medium">{user.fonctionnalite}</span>
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
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 bg-slate-800/50">
        <button
          onClick={onEdit}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500/30 to-cyan-600/30 hover:from-cyan-500/40 hover:to-cyan-600/40 text-cyan-100 border border-cyan-500/30 px-4 py-3 rounded-xl transition-all duration-200 mb-3 hover:shadow-lg hover:shadow-cyan-500/20"
        >
          <FaEdit className="text-sm" />
          Modifier le profil
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 text-red-300 border border-red-500/30 px-4 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-red-500/10"
        >
          <FaSignOutAlt className="text-sm" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};