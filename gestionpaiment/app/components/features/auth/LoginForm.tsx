'use client';

import { useState, FormEvent } from 'react';
import { FaEnvelope, FaLock, FaKey, FaArrowLeft, FaCheck } from 'react-icons/fa';
import Link from 'next/link';
import { Input } from '@/app/components/ui/Input';
import { Button } from '@/app/components/ui/Button';
import { Card } from '@/app/components/ui/Card';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<any>;
  onVerifyCode: (email: string, code: string) => Promise<any>;
  onResendCode: (email: string) => Promise<any>;
}

export const LoginForm = ({ onLogin, onVerifyCode, onResendCode }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'login' | 'verification'>('login');

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await onLogin(email, password);
      
      if (response.firstLogin) {
        setSuccess('Code de vérification envoyé à votre email pour première connexion!');
        setStep('verification');
      } else {
        setSuccess('Connexion réussie! Redirection...');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onVerifyCode(email, code);
      setSuccess('Connexion réussie! Redirection...');
    } catch (err: any) {
      setError(err.message || 'Code invalide');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');

    try {
      await onResendCode(email);
      setSuccess('Nouveau code envoyé! Vérifiez votre email.');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi du code');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setStep('login');
    setError('');
    setSuccess('');
    setCode('');
  };

  return (
    <Card className="w-full max-w-md text-white transition-all duration-500 hover:scale-105">
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <span className="text-2xl">💸</span>
        </div>
        <h2 className="text-3xl font-extrabold mt-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          {step === 'login' ? 'Connexion' : 'Vérification'}
        </h2>
        <p className="text-white/70 text-sm mt-2 text-center">
          {step === 'login' 
            ? 'Connectez-vous à votre compte' 
            : 'Entrez le code reçu par email'}
        </p>
      </div>

      {step === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-5">
          <Input
            type="email"
            placeholder="Adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<FaEnvelope />}
            required
            disabled={loading}
          />

          <Input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<FaLock />}
            required
            disabled={loading}
          />

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 animate-pulse">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-green-400 text-sm text-center">{success}</p>
            </div>
          )}

          <Button type="submit" loading={loading} className="w-full">
            <FaCheck />
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerification} className="space-y-5">
          <button
            type="button"
            onClick={handleBackToLogin}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors mb-4 group"
          >
            <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
            Retour à la connexion
          </button>

          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 text-sm">
            <p className="text-cyan-300 font-medium">
              Première connexion - Vérification requise
            </p>
            <p className="text-cyan-300 text-xs mt-1">
              Un code a été envoyé à: <strong>{email}</strong>
            </p>
          </div>

          <Input
            type="text"
            placeholder="Code à 6 chiffres"
            value={code}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setCode(value);
            }}
            icon={<FaKey />}
            className="text-center text-xl tracking-widest font-mono"
            maxLength={6}
            required
            disabled={loading}
          />

          <div className="flex justify-center space-x-1">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={`w-3 h-1 rounded-full transition-all duration-300 ${
                  index < code.length ? 'bg-cyan-400' : 'bg-white/20'
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 animate-pulse">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-green-400 text-sm text-center">{success}</p>
            </div>
          )}

          <Button 
            type="submit" 
            loading={loading} 
            disabled={code.length !== 6}
            className="w-full"
          >
            <FaKey />
            {loading ? 'Vérification...' : 'Vérifier le code'}
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={loading}
              className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <FaEnvelope className="text-xs" />
              )}
              {loading ? 'Envoi...' : 'Renvoyer le code'}
            </button>
          </div>
        </form>
      )}

      {step === 'login' && (
        <p className="text-center text-white/70 mt-6">
          Pas de compte ?{' '}
          <Link 
            href="/register" 
            className="text-cyan-400 hover:text-cyan-300 underline transition-colors"
          >
            Inscrivez-vous
          </Link>
        </p>
      )}
    </Card>
  );
};