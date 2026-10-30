'use client';

import React from 'react';
import { X, Check, Zap, Sparkles, ShieldCheck } from 'lucide-react';
import { updateUserProfile } from '@/lib/storage';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessUpgrade: () => void;
}

export default function PricingModal({ isOpen, onClose, onSuccessUpgrade }: PricingModalProps) {
  if (!isOpen) return null;

  const handleUpgrade = () => {
    updateUserProfile({ plan: 'PRO' });
    onSuccessUpgrade();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </span>
          <h2 className="text-xl font-bold text-slate-100">Plan Premium PRO</h2>
        </div>
        <p className="text-sm text-slate-400 mb-6">
          Desbloquea el motor de inteligencia artificial pedagógico, simulacros completos ilimitados de 9 horas y predicción de admisión universitaria.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Plan Free */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Plan Básico</div>
              <div className="text-2xl font-bold text-slate-100 mb-4">Gratis</div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Diagnósticos rápidos (15 preguntas)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Puntaje global estimado (0-500)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Acceso al catálogo de guías PDF</span>
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <X className="w-4 h-4 shrink-0" />
                  <span>Tutor con AI ilimitado</span>
                </li>
                <li className="flex items-center gap-2 text-slate-500">
                  <X className="w-4 h-4 shrink-0" />
                  <span>Telemetría psicométrica TRI avanzada</span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
              Plan actual por defecto
            </div>
          </div>

          {/* Plan Pro */}
          <div className="p-4 rounded-lg bg-gradient-to-b from-indigo-950/40 to-slate-900 border-2 border-indigo-500/60 flex flex-col justify-between relative shadow-lg">
            <div className="absolute -top-3 right-4 bg-indigo-600 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full shadow">
              Recomendado
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-indigo-400 font-semibold mb-1">Suscripción PRO</div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold text-white">$19.900</span>
                <span className="text-xs text-slate-400">COP / mes</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="font-medium text-white">Tutor AI Socrático ilimitado por ítem</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Simulacros oficiales cronometrados de 9h</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Análisis de distractores y trampas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Métricas de fatiga cognitiva y ritmo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Reportes en PDF descargables</span>
                </li>
              </ul>
            </div>

            <button
              onClick={handleUpgrade}
              className="mt-6 w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Activar Plan PRO Ahora</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Pago seguro simulado. Sin cargos reales requeridos en fase de desarrollo.</span>
        </div>
      </div>
    </div>
  );
}
