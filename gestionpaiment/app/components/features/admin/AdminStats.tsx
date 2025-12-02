'use client';

import { FaUsers, FaChalkboardTeacher, FaUserTie } from 'react-icons/fa';

interface AdminStatsProps {
  stats: {
    totalUsers: number;
    formateurs: number;
    coordinateurs: number;
  };
}

export const AdminStats = ({ stats }: AdminStatsProps) => {
 return (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

    {/* TOTAL USERS */}
    <div
      className="
        bg-gradient-to-br from-gray-900/40 to-blue-900/20
        border border-white/10 rounded-2xl p-6 backdrop-blur-md
        shadow-lg hover:shadow-blue-500/20 transition-all duration-300
      "
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center 
                        bg-gradient-to-r from-blue-500 to-cyan-500 shadow-md">
          <FaUsers className="text-white text-2xl" />
        </div>

        <div>
          <p className="text-white/60 text-sm">Utilisateurs totaux</p>
          <p className="text-3xl font-bold text-cyan-300">{stats.totalUsers}</p>
        </div>
      </div>
    </div>

    {/* FORMATEURS */}
    <div
      className="
        bg-gradient-to-br from-gray-900/40 to-blue-900/20
        border border-white/10 rounded-2xl p-6 backdrop-blur-md
        shadow-lg hover:shadow-emerald-500/20 transition-all duration-300
      "
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center 
                        bg-gradient-to-r from-green-500 to-emerald-500 shadow-md">
          <FaChalkboardTeacher className="text-white text-2xl" />
        </div>

        <div>
          <p className="text-white/60 text-sm">Formateurs</p>
          <p className="text-3xl font-bold text-emerald-300">{stats.formateurs}</p>
        </div>
      </div>
    </div>

    {/* COORDINATEURS */}
    <div
      className="
        bg-gradient-to-br from-gray-900/40 to-blue-900/20
        border border-white/10 rounded-2xl p-6 backdrop-blur-md
        shadow-lg hover:shadow-pink-500/20 transition-all duration-300
      "
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center 
                        bg-gradient-to-r from-purple-500 to-pink-500 shadow-md">
          <FaUserTie className="text-white text-2xl" />
        </div>

        <div>
          <p className="text-white/60 text-sm">Coordinateurs</p>
          <p className="text-3xl font-bold text-pink-300">{stats.coordinateurs}</p>
        </div>
      </div>
    </div>

  </div>
);
};
