'use client';

import { useRouter } from 'next/navigation';
import { FloatingEmojis } from '@/app/components/features/FloatingEmojis';
import { RegisterForm } from '@/app/components/features/auth/RegisterForm';
import { apiService } from '@/app/services/api';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = async (userData: any) => {
    await apiService.register(userData);
    
    setTimeout(() => {
      router.push('/login');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <FloatingEmojis count={10} />
      <RegisterForm onRegister={handleRegister} />
    </div>
  );
}