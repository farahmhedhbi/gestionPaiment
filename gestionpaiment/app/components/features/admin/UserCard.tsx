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
  <div className="
      bg-gradient-to-br from-gray-900/60 to-blue-900/40
      border border-white/10 rounded-xl p-6
      shadow-lg hover:shadow-blue-500/20 
      transition-all duration-300 backdrop-blur-md
    "
  >
    {/* HEADER */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div
          className={`
            w-11 h-11 rounded-xl flex items-center justify-center text-xl
            ${getRoleColor(user.roles)} shadow-md
          `}
        >
          {getRoleIcon(user.roles)}
        </div>

        <div>
          <h3 className="font-semibold text-white text-md">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-white/50 text-sm">{user.email}</p>
        </div>
      </div>
    </div>

    {/* ROLE BADGE */}
    <div className="flex justify-between items-center mt-5">
      <span
        className={`
          px-3 py-1 rounded-lg text-xs tracking-wide font-semibold 
          ${getRoleColor(user.roles)} 
          shadow-sm
        `}
      >
        {getRoleDisplay(user.roles)}
      </span>

      {/* DELETE BUTTON */}
      <button
        onClick={() => onDelete(user.id)}
        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 
                   text-red-300 transition-all duration-200 shadow-md"
      >
        <FaTrash className="text-sm" />
      </button>
    </div>
  </div>
);
}