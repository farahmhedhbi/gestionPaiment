import Link from 'next/link';
import { User } from '@/app/types';

interface HeaderProps {
  user?: User | null;
  onLogout?: () => void;
}

export const Header = ({ user, onLogout }: HeaderProps) => {
  return (
    <header className="relative z-10 backdrop-blur-md bg-white/5 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                💸
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-25"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              PayFlow
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-white/80">Bonjour, {user.firstName}</span>
                <button
                  onClick={onLogout}
                  className="text-white/80 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white/80 hover:text-white px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/10"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:shadow-xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};