'use client';

import { useState, FormEvent } from 'react';
import { FaUser, FaEnvelope, FaLock, FaUserTie } from 'react-icons/fa';
import Link from 'next/link';
import { Input } from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import { Card } from '@/app/components/ui/Card';

interface RegisterFormProps {
  onRegister: (userData: any) => Promise<any>;
}

export const RegisterForm = ({ onRegister }: RegisterFormProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'coordinateur'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas !");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères !");
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const rolesToSend = formData.role === 'coordinateur' ? ['coordinateur'] : ['formateur'];
      
      await onRegister({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        roles: rolesToSend
      });

      setSuccess('Inscription réussie ! Vous pouvez maintenant vous connecter.');
      
      // Réinitialiser le formulaire
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'coordinateur'
      });

    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="w-full max-w-md text-white">
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <span className="text-2xl">💸</span>
        </div>
        <h2 className="text-3xl font-extrabold mt-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Créer un compte
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          type="text"
          placeholder="Prénom"
          value={formData.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          icon={<FaUser />}
          required
        />

        <Input
          type="text"
          placeholder="Nom"
          value={formData.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          icon={<FaUser />}
          required
        />

        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          icon={<FaEnvelope />}
          required
        />

        <Input
          type="password"
          placeholder="Mot de passe (min. 6 caractères)"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          icon={<FaLock />}
          required
          minLength={6}
        />

        <Input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          icon={<FaLock />}
          required
        />

        <div className="relative">
          <FaUserTie className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 z-10" />
          <select 
            value={formData.role} 
            onChange={(e) => handleChange('role', e.target.value)}
            className="w-full p-3 pl-10 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none"
          >
            <option value="coordinateur">Coordinateur</option>
            <option value="formateur">Formateur</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none">
            ▼
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-green-400 text-sm text-center">{success}</p>
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full">
          <span className="animate-bounce">💸</span>
          {loading ? 'Inscription...' : 'S\'inscrire'}
        </Button>
      </form>

      <p className="text-center text-white/70 mt-6">
        Déjà un compte ?{' '}
        <Link href="/login" className="text-cyan-400 hover:underline font-semibold">
          Connectez-vous
        </Link>
      </p>
    </Card>
  );
};