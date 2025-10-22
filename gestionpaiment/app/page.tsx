'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Génération d’emojis 💸 flottants avec positions aléatoires
  const floatingEmojis = Array.from({ length: 16 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${12 + Math.random() * 8}s`,
    size: `${1.8 + Math.random() * 2.2}rem`,
    opacity: `${0.25 + Math.random() * 0.5}`,
  }))

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 overflow-hidden text-white">

      {/* 💸 Arrière-plan animé */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingEmojis.map((emoji) => (
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
      </div>

      {/* 🌟 Header */}
      <header className="relative z-10 backdrop-blur-md bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between items-center py-6">

            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
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
            </nav>
          </div>
        </div>
      </header>

      {/* 🏠 Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div
          className={`transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {/* Tagline */}
          <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-8">
            <div className="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm text-cyan-300 font-medium tracking-wide">
              Plateforme de paiement nouvelle génération
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
            <span className="block">Révolutionnez</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent bg-size-200 animate-gradient">
              vos paiements
            </span>
          </h1>

          {/* CTA */}
          <div className="flex justify-center space-x-6 mt-12">
            <Link
              href="/register"
              className="group relative bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-12 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 transform hover:-translate-y-1"
            >
              <span className="relative z-10">Commencer maintenant</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </main>

      {/* 🌈 Animations */}
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

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient {
          animation: gradient 8s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </div>
  )
}
