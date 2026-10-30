'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import AdBanner from '@/components/AdBanner';
import { getSessionLogs } from '@/lib/storage';
import { ExamSessionLog } from '@/types';
import {
  History,
  Target,
  Clock,
  Calendar,
  ChevronRight,
  Trash2,
  Activity,
} from 'lucide-react';

export default function LogsPage() {
  const [logs, setLogs] = useState<ExamSessionLog[]>([]);

  useEffect(() => {
    setLogs(getSessionLogs());
  }, []);

  const handleClear = () => {
    if (window.confirm('¿Seguro que deseas reiniciar el historial de simulacros guardados?')) {
      localStorage.removeItem('icfes_simulador_user_logs');
      setLogs([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />
      <AdBanner slot="top" />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Activity className="w-4 h-4" />
              <span>Telemetría y Registro Académico</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Historial de Simulacros y Logs por Usuario
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Registro longitudinal de intentos, tiempos de resolución por reactivo, cambios de respuesta y curva de evolución psicométrica.
            </p>
          </div>

          {logs.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Limpiar Historial</span>
            </button>
          )}
        </div>

        {logs.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center max-w-md mx-auto">
            <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-200">Aún no hay registros de simulacros</h3>
            <p className="text-xs text-slate-400 mt-1 mb-5">
              Completa un simulacro o una sesión de entrenamiento para comenzar a registrar tu telemetría y curva de puntajes.
            </p>
            <Link
              href="/simulador"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
            >
              Iniciar Primer Simulacro
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((item) => {
              const dateStr = new Date(item.finishedAt).toLocaleDateString();
              const timeStr = new Date(item.finishedAt).toLocaleTimeString();
              const accuracy =
                item.totalQuestions > 0
                  ? Math.round((item.totalCorrect / item.totalQuestions) * 100)
                  : 0;

              return (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center p-1 shrink-0">
                      <span className="text-xs font-mono font-bold text-slate-400">Puntaje</span>
                      <span className="text-lg font-mono font-extrabold text-white leading-none">
                        {item.scores.globalScore}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-100">
                          {item.examType === 'SABER_11' ? 'Saber 11.°' : 'Saber Pro'} — {item.mode.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono border border-slate-700">
                          {item.scores.nivelDesempeno}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{dateStr} {timeStr}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{Math.floor(item.totalDurationSeconds / 60)}m {item.totalDurationSeconds % 60}s</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Percentil {item.scores.percentilEstimado}</span>
                        </span>
                        <span>•</span>
                        <span>{accuracy}% aciertos ({item.totalCorrect}/{item.totalQuestions})</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-auto">
                    <Link
                      href={`/resultados?sessionId=${item.id}`}
                      className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                    >
                      <span>Ver Reporte Completo</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
