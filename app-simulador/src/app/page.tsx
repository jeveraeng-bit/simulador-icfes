'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import AdBanner from '@/components/AdBanner';
import { getUserProfile } from '@/lib/storage';
import { ExamType } from '@/types';
import {
  GraduationCap,
  Sparkles,
  Zap,
  Timer,
  CheckCircle2,
  BookOpen,
  Building2,
  BarChart3,
  Bot,
  BrainCircuit,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function HomePage() {
  const [profile, setProfile] = useState(getUserProfile());
  const [targetExam, setTargetExam] = useState<ExamType>('SABER_11');

  useEffect(() => {
    const p = getUserProfile();
    setProfile(p);
    setTargetExam(p.targetExam);

    const onExamChange = () => {
      const updated = getUserProfile();
      setProfile(updated);
      setTargetExam(updated.targetExam);
    };

    window.addEventListener('exam-type-changed', onExamChange);
    return () => window.removeEventListener('exam-type-changed', onExamChange);
  }, []);

  const areasSaber11 = [
    { code: 'MATEMATICAS', name: 'Matemáticas', questions: 50, time: '80 min' },
    { code: 'LECTURA_CRITICA', name: 'Lectura Crítica', questions: 41, time: '70 min' },
    { code: 'CIENCIAS_NATURALES', name: 'Ciencias Naturales', questions: 58, time: '90 min' },
    { code: 'SOCIALES_Y_CIUDADANAS', name: 'Sociales y Ciudadanas', questions: 50, time: '80 min' },
    { code: 'INGLES', name: 'Inglés (MCER)', questions: 55, time: '60 min' },
  ];

  const areasSaberPro = [
    { code: 'RAZONAMIENTO_CUANTITATIVO', name: 'Razonamiento Cuantitativo', questions: 35, time: '60 min' },
    { code: 'LECTURA_CRITICA', name: 'Lectura Crítica', questions: 35, time: '60 min' },
    { code: 'COMPETENCIAS_CIUDADANAS', name: 'Competencias Ciudadanas', questions: 35, time: '60 min' },
    { code: 'INGLES', name: 'Inglés Profesional (B2)', questions: 55, time: '60 min' },
    { code: 'DISENO_DE_SOFTWARE', name: 'Diseño de Software (Específico)', questions: 30, time: '60 min' },
  ];

  const activeAreas = targetExam === 'SABER_11' ? areasSaber11 : areasSaberPro;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />
      <AdBanner slot="top" />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Desarrollado por Juan Esteban Vera Rodríguez | UAN Sede Ibagué</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight max-w-4xl leading-tight">
            Simulador de Pruebas <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">
              Saber 11.° y Saber Pro
            </span>
          </h1>

          <p className="mt-5 text-sm md:text-base text-slate-400 max-w-2xl leading-relaxed">
            Entrena bajo las condiciones de las pruebas de Estado en Colombia. Baterías oficiales extraídas de las guías
            censales, calificación psicométrica de 0 a 500 y tutoría socrática impulsada por IA.
          </p>

          {/* Quick Metrics Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Modelo Basado en Evidencias (MBE)</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              <span>Teoría de Respuesta al Ítem (TRI 3PL)</span>
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>58 Guías Oficiales Indexadas</span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Modes Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-12">
        {/* Core Modes: Diagnostic vs Full Mock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Diagnostic Card */}
          <div className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 md:p-8 shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                  <Zap className="w-6 h-6" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded">
                  25 Minutos
                </span>
              </div>

              <h2 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                Diagnóstico Rápido Inteligente
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Evaluación adaptativa de 15 preguntas con selección probabilística. Estima tu percentil nacional y detecta brechas prioritarias de estudio en minutos.
              </p>

              <ul className="mt-5 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>15 reactivos de alta discriminación psicométrica</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Estimación inmediata de percentil y nivel de desempeño</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>Tutor AI habilitado para retroalimentación</span>
                </li>
              </ul>
            </div>

            <Link
              href={`/simulador?exam=${targetExam}&mode=DIAGNOSTICO_RAPIDO`}
              className="mt-8 w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow flex items-center justify-center gap-2"
            >
              <span>Comenzar Diagnóstico Rápido</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Full Mock Exam Card */}
          <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 md:p-8 shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                  <Timer className="w-6 h-6" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded">
                  Condición Censal Real
                </span>
              </div>

              <h2 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                Simulacro Oficial Completo
              </h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Réplica de la jornada del examen. Temporizador oficial, cuadrícula de navegación, control de marcación para revisión y telemetría de fatiga cognitiva.
              </p>

              <ul className="mt-5 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Cuadernillo multiarea con ponderación oficial (3-3-3-3-1)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Detección de preguntas ladronas de tiempo (&gt;3.5 min)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Generación de Cuaderno de Errores detallado</span>
                </li>
              </ul>
            </div>

            <Link
              href={`/simulador?exam=${targetExam}&mode=SIMULACRO_OFICIAL`}
              className="mt-8 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow flex items-center justify-center gap-2"
            >
              <span>Presentar Simulacro Oficial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Section: Practice by Area */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-400" />
                <span>Entrenamiento Deliberado por Módulos ({targetExam === 'SABER_11' ? 'Saber 11' : 'Saber Pro'})</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Practica focalizadamente en las competencias específicas del Modelo Basado en Evidencias.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeAreas.map((area) => (
              <div
                key={area.code}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    {area.code}
                  </span>
                  <h3 className="font-bold text-slate-100 text-sm mt-1 mb-2">{area.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                    <span>{area.questions} preguntas</span>
                    <span>•</span>
                    <span>{area.time}</span>
                  </div>
                </div>

                <Link
                  href={`/simulador?exam=${targetExam}&mode=ENTRENAMIENTO_AREA&area=${area.code}`}
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Entrenar Módulo</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* AI Tutor Feature Banner */}
        <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Tutor Académico con Inteligencia Artificial</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                ¿Dudas con una pregunta durante tu práctica? Consulta al tutor socrático para recibir pistas de resolución,
                análisis de distractores y trampas comunes, o la explicación conceptual sin arruinar la clave.
              </p>
            </div>
          </div>

          <Link
            href="/simulador?mode=DIAGNOSTICO_RAPIDO"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shrink-0 transition-colors shadow"
          >
            Probar Tutor en Vivo
          </Link>
        </div>

        {/* Paperless Initiative Banner */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
                Para Colegios y Universidades
              </div>
              <h3 className="text-lg font-bold text-white">Convocatorias Digitales &ldquo;Cero Papel&rdquo;</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                Reduce el consumo de papel y hojas ópticas. Los docentes pueden programar convocatorias institucionales
                con código de sala y obtener las notas y actas del salón en tiempo real.
              </p>
            </div>
          </div>

          <Link
            href="/institucional"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shrink-0 transition-colors shadow"
          >
            Configurar Convocatoria
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-950 border-t border-slate-800 py-8 px-4 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-slate-200">Simulador ICFES Saber 11 & Saber Pro</span>
            </div>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-slate-400">
              Desarrollado por <strong className="text-slate-200 font-semibold">Juan Esteban Vera Rodríguez</strong>, estudiante de Ingeniería Electrónica en la Universidad Antonio Nariño (Sede Ibagué).
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <Link href="/catalogo-guias" className="hover:text-slate-300 transition-colors">
              58 Guías Indexadas
            </Link>
            <Link href="/institucional" className="hover:text-slate-300 transition-colors">
              Modo Cero Papel
            </Link>
            <Link href="/logs" className="hover:text-slate-300 transition-colors">
              Logs por Usuario
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
