'use client';

import { useEffect, useState } from 'react';
import { FloatingEmoji } from '@/app/types';

interface FloatingEmojisProps {
  count?: number;
}

export const FloatingEmojis = ({ count = 14 }: FloatingEmojisProps) => {
  const [emojis, setEmojis] = useState<FloatingEmoji[]>([]);

  useEffect(() => {
    const generatedEmojis = Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${12 + Math.random() * 8}s`,
      size: `${1.8 + Math.random() * 2.2}rem`,
      opacity: `${0.25 + Math.random() * 0.5}`,
    }));
    setEmojis(generatedEmojis);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {emojis.map((emoji) => (
        <span
          key={emoji.id}
          className="absolute animate-float opacity-60 select-none"
          style={{
            left: emoji.left,
            animationDelay: emoji.delay,
            animationDuration: emoji.duration,
            fontSize: emoji.size,
            opacity: emoji.opacity,
            top: '-10%',
            filter: 'blur(0.3px)',
          }}
        >
          💸
        </span>
      ))}
      
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          50% {
            transform: translateY(100vh) translateX(20px) rotate(360deg);
          }
          100% {
            transform: translateY(-10vh) translateX(-10px) rotate(720deg);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};