'use client';

import { User } from '@/app/types';
import { FaUserTie, FaChalkboardTeacher, FaTrash, FaEdit } from 'react-icons/fa';

interface UserCardProps {
  user: User;
  onDelete: (userId: number) => void;
}

export const UserCard = ({ user,  onDelete }: UserCardProps) => {
  const getRoleDisplay = (roles: any[]) => {
    if (!roles || roles.length === 0) return "Utilisateur";

    let role = roles[0];

    if (typeof role === "object") {
      role = role.name || role.roleName || "ROLE_USER";
    }

    if (typeof role !== "string") return "Utilisateur";

    return role.replace("ROLE_", "");
  };

  const getRoleColor = (roles: string[]) => {
    if (roles.includes('ROLE_COORDINATEUR')) return 'bg-purple-500/20 text-purple-300';
    if (roles.includes('ROLE_FORMATEUR')) return 'bg-blue-500/20 text-blue-300';
    return 'bg-gray-500/20 text-gray-300';
  };

  const getRoleIcon = (roles: string[]) =>
    roles.includes('ROLE_COORDINATEUR') ? <FaUserTie /> : <FaChalkboardTeacher />;

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
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
            onClick={() => onDelete(user.id)}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </div>
  );
};