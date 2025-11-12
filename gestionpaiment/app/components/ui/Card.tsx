import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-2xl ${className}`}>
      {children}
    </div>
  );
};