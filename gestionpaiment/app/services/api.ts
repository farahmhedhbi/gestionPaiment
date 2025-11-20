import { User, AuthResponse } from '@/app/types';

const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {

  // ===========================================================
  // 🔒 Requête avec session + gestion JSON automatiquement
  // ===========================================================
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const contentType = response.headers.get('content-type');
    const responseText = await response.text();

    // --- Gestion des erreurs ---
    if (!response.ok) {
      let errorMessage = responseText;

      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // si ce n'est pas du JSON, on garde le texte tel quel
      }

      throw new Error(errorMessage);
    }

    // --- Réponse vide (DELETE etc.) ---
    if (!responseText || !contentType?.includes('application/json')) {
      return responseText || null;
    }

    // --- Réponse JSON ---
    try {
      return JSON.parse(responseText);
    } catch {
      return responseText;
    }
  }

  // ===========================================================
  // 🔐 AUTH
  // ===========================================================
  async login(email: string, password: string): Promise<AuthResponse> {
    return this.fetchWithAuth('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any): Promise<AuthResponse> {
    return this.fetchWithAuth('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyCode(email: string, code: string): Promise<AuthResponse> {
    return this.fetchWithAuth('/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  }

  async resendCode(email: string): Promise<void> {
    return this.fetchWithAuth('/auth/resend-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // ⭐⭐⭐ CORRECTION ICI : checkAuth doit renvoyer un type générique ⭐⭐⭐
  async checkAuth(): Promise<{ authenticated: boolean; id?: number; email?: string; roles?: string[] }> {
    try {
      return await this.fetchWithAuth('/auth/check-auth', {
        method: 'GET',
      });
    } catch (e) {
      return { authenticated: false }; // éviter les crashs côté Front
    }
  }

  async logout(): Promise<void> {
    await this.fetchWithAuth('/auth/logout', { method: 'POST' });
  }

  // ===========================================================
  // 👤 USER PROFILE
  // ===========================================================
  async getUserProfile(): Promise<User> {
    return this.fetchWithAuth('/user/profile');
  }

  async updateUserProfile(userData: Partial<User>): Promise<User> {
    return this.fetchWithAuth('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getFonctionnalites(): Promise<{ [key: string]: string }> {
    return this.fetchWithAuth('/user/fonctionnalites');
  }

  // ===========================================================
  // 🛡️ ADMIN
  // ===========================================================
  async getUsers(): Promise<User[]> {
    return this.fetchWithAuth('/admin/users');
  }

  async getFormateurs(): Promise<User[]> {
    return this.fetchWithAuth('/admin/formateurs');
  }

  async getCoordinateurs(): Promise<User[]> {
    return this.fetchWithAuth('/admin/coordinateurs');
  }

  async deleteUser(userId: number): Promise<void> {
    console.log(`🗑️ Suppression utilisateur ID: ${userId}`);

    try {
      await this.fetchWithAuth(`/admin/users/${userId}`, {
        method: 'DELETE',
      });
      console.log(`✅ Utilisateur ${userId} supprimé avec succès`);
    } catch (error) {
      console.error(`❌ Erreur suppression utilisateur ${userId}:`, error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
