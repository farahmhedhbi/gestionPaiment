'use client';

import { useRouter } from 'next/navigation';
import { FloatingEmojis } from '@/app/components/features/FloatingEmojis';
import { LoginForm } from '@/app/components/features/auth/LoginForm';
import { apiService } from '@/app/services/api';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    const response = await apiService.login(email, password);
    
    if (!response.firstLogin) {
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    }
    
    return response;
  };

  const handleVerifyCode = async (email: string, code: string) => {
    await apiService.verifyCode(email, code);
    
    setTimeout(async () => {
      try {
        await apiService.checkAuth();
        router.push('/dashboard');
      } catch {
        router.push('/login');
      }
    }, 1500);
  };

  const handleResendCode = async (email: string) => {
    await apiService.resendCode(email);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 overflow-hidden">
      <FloatingEmojis count={14} />
      <LoginForm 
        onLogin={handleLogin}
        onVerifyCode={handleVerifyCode}
        onResendCode={handleResendCode}
      />
    </div>
  );
}