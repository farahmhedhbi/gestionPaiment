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
  );
};