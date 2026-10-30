'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import AdBanner from '@/components/AdBanner';
import { getSessionLogById } from '@/lib/storage';
import { ExamSessionLog, Question } from '@/types';
import questionsData from '@/data/seed_questions.json';
import {
  Trophy,
  Target,
  Clock,
  AlertTriangle,
  RotateCcw,
  Printer,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BarChart3,
  BookCheck,
} from 'lucide-react';

function ResultadosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('sessionId');

  const [session, setSession] = useState<ExamSessionLog | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      const found = getSessionLogById(sessionId);
      if (found) {
        setSession(found);
      }
    }
  }, [sessionId]);

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <HelpCircle className="w-12 h-12 text-slate-500 mb-3" />
          <h2 className="text-lg font-bold text-slate-200">No se encontró el reporte de examen</h2>
          <p className="text-xs text-slate-400 mt-1 mb-4">El identificador de sesión no es válido o ha expirado.</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
          >
            Regresar al Inicio
          </button>
        </div>
      </div>
    );
  }

  const allQuestionsMap = new Map<string, Question>();
  ((questionsData as unknown) as Question[]).forEach((q) => allQuestionsMap.set(q.id, q));

  const { scores, pacingMetrics } = session;
  const accuracyPercent =
    session.totalQuestions > 0 ? Math.round((session.totalCorrect / session.totalQuestions) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />
      <AdBanner slot="top" />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Top Summary Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-2.5 py-1 rounded">
                Informe Diagnóstico Psicométrico Oficial
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white mt-2">
                Resultados {session.examType === 'SABER_11' ? 'Saber 11.°' : 'Saber Pro'}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Evaluado: {session.userName} — Fecha: {new Date(session.finishedAt).toLocaleDateString()} a las{' '}
                {new Date(session.finishedAt).toLocaleTimeString()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / PDF</span>
              </button>
              <button
                onClick={() => router.push('/simulador')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Nuevo Simulacro</span>
              </button>
            </div>
          </div>

          {/* Scores Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {/* Global Score */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Puntaje Global Estimado</span>
                <Trophy className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">{scores.globalScore}</span>
                <span className="text-sm font-medium text-slate-500">/ {scores.maxPossibleScore}</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Ponderación oficial: {session.examType === 'SABER_11' ? 'Pesos 3-3-3-3-1' : 'Media Genérica'}
              </div>
            </div>

            {/* Percentile */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Percentil Nacional</span>
                <Target className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-indigo-400">{scores.percentilEstimado}</span>
                <span className="text-sm font-medium text-slate-500">/ 100</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Superas al {scores.percentilEstimado}% de evaluados nacionales
              </div>
            </div>

            {/* Performance Level */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Nivel de Desempeño</span>
                <BookCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-lg font-bold text-emerald-400 leading-tight">
                {scores.nivelDesempeno}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Estándar curricular del MEN
              </div>
            </div>

            {/* Accuracy & Pacing */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Efectividad y Ritmo</span>
                <Clock className="w-4 h-4 text-sky-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white">{accuracyPercent}%</span>
                <span className="text-xs text-slate-400">({session.totalCorrect}/{session.totalQuestions})</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                {pacingMetrics.avgTimePerQuestion} seg/pregunta (meta: 108s)
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown: Areas & Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Area Scores Breakdown */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <span>Desglose por Áreas y Componentes del MBE</span>
            </h2>

            <div className="space-y-4">
              {Object.entries(scores.areaScores).map(([areaKey, areaScore]) => {
                const maxArea = session.examType === 'SABER_11' ? 100 : 300;
                const ratio = Math.round((areaScore / maxArea) * 100);

                return (
                  <div key={areaKey} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-200">{areaKey.replace(/_/g, ' ')}</span>
                      <span className="font-mono font-bold text-indigo-400">
                        {areaScore} / {maxArea} pts
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Col: Telemetry & Fatigue Analytics */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>Telemetría de Examen</span>
              </h2>

              <div className="space-y-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 mb-1">Duración Total Registrada</div>
                  <div className="text-lg font-bold text-slate-100 font-mono">
                    {Math.floor(session.totalDurationSeconds / 60)} min {session.totalDurationSeconds % 60} seg
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 mb-1">Preguntas Ladronas de Tiempo (&gt; 3.5 min y erradas)</div>
                  <div className="text-lg font-bold text-rose-400">
                    {pacingMetrics.timeThiefQuestions.length} preguntas
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Invertiste exceso de tiempo sin asegurar el acierto. Revisa la técnica de descarte temprano.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 mb-1">Caída por Fatiga Cognitiva</div>
                  <div className="text-lg font-bold text-amber-400">
                    {pacingMetrics.fatigueDropPercent}% de descenso
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Variación de efectividad entre la primera mitad y la segunda mitad del simulacro.
                  </p>
                </div>
              </div>
            </div>

            <AdBanner
              slot="sidebar"
              title="Plan de Entrenamiento Deliberado"
              subtitle="Refuerza tus áreas críticas con sets de active recall."
            />
          </div>
        </div>

        {/* Error Notebook / Detailed Questions Review */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="pb-4 mb-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookCheck className="w-5 h-5 text-indigo-400" />
                <span>Cuaderno de Errores y Retroalimentación Pedagógica</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Revisa cada pregunta, comprueba la clave oficial y comprende la justificación de los distractores.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(session.responses).map(([qId, respLog], idx) => {
              const qData = allQuestionsMap.get(qId);
              if (!qData) return null;

              const isExpanded = expandedQuestion === qId;
              const isCorrect = respLog.isCorrect;

              return (
                <div
                  key={qId}
                  className={`border rounded-lg transition-all ${
                    isCorrect
                      ? 'bg-slate-950/60 border-slate-800'
                      : 'bg-rose-950/10 border-rose-900/30'
                  }`}
                >
                  {/* Item Accordion Header */}
                  <div
                    onClick={() => setExpandedQuestion(isExpanded ? null : qId)}
                    className="p-4 flex items-center justify-between cursor-pointer select-none gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      )}
                      <div>
                        <div className="text-xs font-bold text-slate-200">
                          Pregunta {idx + 1} — {qData.area_nombre}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xl">
                          {qData.enunciado.slice(0, 100)}...
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs">
                        <span className="text-slate-400 font-medium">Marcaste: </span>
                        <span className={`font-bold ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {respLog.selectedOption ?? 'En blanco'}
                        </span>
                        <span className="text-slate-500 mx-1.5">|</span>
                        <span className="text-slate-400 font-medium">Clave: </span>
                        <span className="font-bold text-emerald-400">{qData.clave_oficial}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Explanation */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 text-xs space-y-3">
                      <div className="text-slate-200 leading-relaxed font-normal bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                        {qData.enunciado}
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {qData.opciones.map((opt) => (
                          <div
                            key={opt.id}
                            className={`p-2.5 rounded border text-xs ${
                              opt.es_correcta
                                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300 font-medium'
                                : opt.id === respLog.selectedOption
                                ? 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}
                          >
                            <span className="font-bold mr-2">{opt.id}.</span>
                            <span>{opt.texto}</span>
                          </div>
                        ))}
                      </div>

                      {/* Official Explanation */}
                      <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/20 text-indigo-300 leading-relaxed">
                        <span className="font-bold">Fundamentación Oficial ICFES: </span>
                        {qData.explicacion}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ResultadosPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
          <HelpCircle className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      }
    >
      <ResultadosContent />
    </Suspense>
  );
}
