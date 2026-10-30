'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import AdBanner from '@/components/AdBanner';
import {
  Building2,
  TreePine,
  ShieldCheck,
  FileCheck2,
  QrCode,
  Sparkles,
  CheckCircle,
  Copy,
  Laptop,
} from 'lucide-react';

export default function InstitucionalPage() {
  const [sessionCode, setSessionCode] = useState<string | null>('ICFES-2026-COL-9982');
  const [copied, setCopied] = useState(false);
  const [created, setCreated] = useState(false);

  const [form, setForm] = useState({
    institutionName: 'Colegio Distrital Santander',
    gradeOrGroup: 'Grado 11-A (Jornada Mañana)',
    examType: 'SABER_11',
    studentCount: 38,
    proctorName: 'Prof. Carlos Alberto Mendoza',
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCode = `ICFES-${Math.floor(1000 + Math.random() * 9000)}-${form.examType === 'SABER_11' ? '11' : 'PRO'}`;
    setSessionCode(newCode);
    setCreated(true);
  };

  const copyCode = () => {
    if (sessionCode) {
      navigator.clipboard.writeText(sessionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />
      <AdBanner slot="top" />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        {/* Banner Hero */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <TreePine className="w-4 h-4" />
            <span>Iniciativa Sostenible — Reducción de Huella de Carbono</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Módulo Institucional &ldquo;Cero Papel&rdquo; para Colegios y Universidades
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
            Plataforma escalable para la aplicación de simulacros censales y exámenes de Estado 100% digitales en salas
            de cómputo. Elimina el gasto de cuadernillos impresos y hojas ópticas de respuesta de papel, con calificación psicométrica en tiempo real y consolidado por grupo.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
              <Laptop className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <div className="text-lg font-bold text-white">100% Digital</div>
                <div className="text-xs text-slate-400">Sin hojas ópticas ni lápiz #2</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
              <FileCheck2 className="w-8 h-8 text-sky-400 shrink-0" />
              <div>
                <div className="text-lg font-bold text-white">Calificación Inmediata</div>
                <div className="text-xs text-slate-400">Actas y ranking al instante</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-indigo-400 shrink-0" />
              <div>
                <div className="text-lg font-bold text-white">Control Antifraude</div>
                <div className="text-xs text-slate-400">Monitoreo de foco y pestañas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Grid: Session Creation & Live Monitoring */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-md">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
              <Building2 className="w-5 h-5 text-indigo-400" />
              <span>Programar Convocatoria Digital de Examen</span>
            </h2>

            <form onSubmit={handleGenerate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nombre de la Institución Educativa / Plantel
                </label>
                <input
                  type="text"
                  value={form.institutionName}
                  onChange={(e) => setForm({ ...form, institutionName: e.target.value })}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Grado, Curso o Semestre
                  </label>
                  <input
                    type="text"
                    value={form.gradeOrGroup}
                    onChange={(e) => setForm({ ...form, gradeOrGroup: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Tipo de Examen
                  </label>
                  <select
                    value={form.examType}
                    onChange={(e) => setForm({ ...form, examType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="SABER_11">Saber 11.° (Educación Media)</option>
                    <option value="SABER_PRO">Saber Pro (Educación Superior)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Número Estimado de Estudiantes
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={form.studentCount}
                    onChange={(e) => setForm({ ...form, studentCount: parseInt(e.target.value, 10) })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Docente o Jefe de Salón Responsable
                  </label>
                  <input
                    type="text"
                    value={form.proctorName}
                    onChange={(e) => setForm({ ...form, proctorName: e.target.value })}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generar Convocatoria y Código de Sala</span>
              </button>
            </form>
          </div>

          {/* Code & Credentials Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-md">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                <QrCode className="w-5 h-5 text-emerald-400" />
                <span>Acceso de los Estudiantes</span>
              </h2>

              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Comparte este código en la sala de cómputo. Los alumnos ingresan al simulador y digitan este token para quedar vinculados a tu grupo.
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center mb-4">
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                  Código de Convocatoria Activo
                </div>
                <div className="text-xl font-mono font-extrabold text-emerald-400 tracking-wider">
                  {sessionCode}
                </div>
                <button
                  onClick={copyCode}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copiado' : 'Copiar Token'}</span>
                </button>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>{created ? 'Convocatoria Recién Creada' : 'Sesión Habilitada'}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {form.institutionName} — {form.gradeOrGroup} ({form.studentCount} plazas)
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 text-center">
              Ahorro estimado en esta sesión: ~{form.studentCount * 65} hojas de papel y cartillas físicas.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
