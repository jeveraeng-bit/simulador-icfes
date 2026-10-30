'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  GraduationCap,
  BookOpen,
  Building2,
  History,
  Sparkles,
  Zap,
  SlidersHorizontal,
  User,
} from 'lucide-react';
import { getUserProfile, updateUserProfile } from '@/lib/storage';
import { UserProfile, ExamType } from '@/types';
import PricingModal from '@/components/PricingModal';
import AuthorModal from '@/components/AuthorModal';

export default function Header() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAuthorOpen, setIsAuthorOpen] = useState(false);

  useEffect(() => {
    setProfile(getUserProfile());
  }, []);

  const handleToggleExam = (newExam: ExamType) => {
    const updated = updateUserProfile({ targetExam: newExam });
    setProfile(updated);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('exam-type-changed'));
    }
  };

  const navLinks = [
    { href: '/', label: 'Inicio', icon: GraduationCap },
    { href: '/simulador', label: 'Simulador', icon: SlidersHorizontal },
    { href: '/catalogo-guias', label: 'Guías y Cuadernillos (58)', icon: BookOpen },
    { href: '/institucional', label: 'Cero Papel (Colegios)', icon: Building2 },
    { href: '/logs', label: 'Historial & Logs', icon: History },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:bg-indigo-500 transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-slate-100 text-base leading-tight tracking-tight flex items-center gap-1.5">
                <span>SIMULADOR ICFES</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 font-medium px-1.5 py-0.5 rounded border border-slate-700">
                  ESTÁNDAR MBE
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Saber 11 & Saber Pro</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-indigo-400 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right actions: Exam Switcher & User Plan */}
          <div className="flex items-center gap-2.5">
            {/* Exam Switcher */}
            <div className="flex items-center p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => handleToggleExam('SABER_11')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  profile?.targetExam === 'SABER_11'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Saber 11
              </button>
              <button
                onClick={() => handleToggleExam('SABER_PRO')}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  profile?.targetExam === 'SABER_PRO'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Saber Pro
              </button>
            </div>

            {/* Plan Button */}
            {profile?.plan === 'PRO' ? (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>PRO</span>
              </span>
            ) : (
              <button
                onClick={() => setIsPricingOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Mejorar a</span>
                <span className="font-semibold text-indigo-400">PRO</span>
              </button>
            )}

            {/* Author Button */}
            <button
              onClick={() => setIsAuthorOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition-colors"
              title="Información del Desarrollador: Juan Esteban Vera Rodríguez (UAN Ibagué)"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-semibold">Desarrollador</span>
            </button>
          </div>
        </div>
      </header>

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        onSuccessUpgrade={() => setProfile(getUserProfile())}
      />

      <AuthorModal
        isOpen={isAuthorOpen}
        onClose={() => setIsAuthorOpen(false)}
      />
    </>
  );
}
