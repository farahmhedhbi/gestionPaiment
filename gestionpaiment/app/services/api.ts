import { User, AuthResponse } from '@/app/types';

const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = errorText;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorData.message || errorText;
      } catch {
        // Garder le message d'erreur original
      }
      
      throw new Error(errorMessage);
    }

    // Gestion spéciale pour les réponses DELETE et autres réponses non-JSON
    const contentType = response.headers.get('content-type');
    const responseText = await response.text();
    
    // Si la réponse est vide (comme pour DELETE) ou ne contient pas de JSON
    if (!responseText || !contentType?.includes('application/json')) {
      return responseText || null;
    }
    
    // Sinon parser comme JSON
    try {
      return JSON.parse(responseText);
    } catch {
      return responseText;
    }
  } // ← Cette accolade ferme correctement la méthode fetchWithAuth

  // Auth methods
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

  async checkAuth(): Promise<User> {
    return this.fetchWithAuth('/auth/check-auth');
  }

  async logout(): Promise<void> {
    await this.fetchWithAuth('/auth/logout', { method: 'POST' });
  }

  // User methods
  async getUserProfile(): Promise<User> {
    return this.fetchWithAuth('/user/profile');
  }

  async updateUserProfile(userData: Partial<User>): Promise<User> {
    return this.fetchWithAuth('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async getFonctionnalites(): Promise<{[key: string]: string}> {
    return this.fetchWithAuth('/user/fonctionnalites');
  }

  // Admin methods
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
} // ← Cette accolade ferme la classe ApiService

export const apiService = new ApiService();