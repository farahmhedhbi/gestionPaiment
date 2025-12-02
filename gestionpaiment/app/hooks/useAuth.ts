import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiService } from '@/app/services/api';
import { User } from '@/app/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await apiService.checkAuth();

      if (res.authenticated) {
        // Construire un vrai user minimal
        const loggedUser: User = {
          id: res.id!,
          email: res.email!,
          roles: res.roles || [],
          firstName: "",
          lastName: "",
          cin: "",
          rib: "",
          bankName: "",
          fonctionnalite: ""
        };

        setUser(loggedUser);
      } else {
        setUser(null);
      }

    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
  setLoading(true);
  try {
    // 1) On fait le login
    const response = await apiService.login(email, password);

    // 2) Puis immédiatement checkAuth pour récupérer les vraies infos utilisateur
    const authData = await apiService.checkAuth();

    if (authData.authenticated) {
      const loggedUser: User = {
        id: authData.id!,
        email: authData.email!,
        roles: authData.roles || [],
        firstName: "",
        lastName: "",
        cin: "",
        rib: "",
        bankName: "",
        fonctionnalite: ""
      };

      setUser(loggedUser);
    }

    return response;

  } finally {
    setLoading(false);
  }
};


  const logout = async () => {
    await apiService.logout();
    setUser(null);
    router.push('/login');
  };

  return {
    user,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
    isAdmin: user?.roles?.some(role => role.includes('ADMIN')),
    isCoordinateur: user?.roles?.some(role => role.includes('COORDINATEUR')),
  };
};
