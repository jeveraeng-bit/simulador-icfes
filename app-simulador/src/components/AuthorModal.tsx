'use client';

import React from 'react';
import { X, GraduationCap, Cpu, Building2, MapPin, Award, CheckCircle, Code } from 'lucide-react';

interface AuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthorModal({ isOpen, onClose }: AuthorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Author Header */}
        <div className="flex items-start gap-4 pb-4 border-b border-slate-800">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 border border-indigo-500/30 px-2 py-0.5 rounded inline-block mb-1">
              Desarrollador y Creador del Proyecto
            </div>
            <h2 className="text-xl font-bold text-white">Juan Esteban Vera Rodríguez</h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
              <GraduationCap className="w-4 h-4 text-slate-400" />
              <span>Estudiante de Ingeniería Electrónica</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Universidad Antonio Nariño</span>
              <span className="text-slate-600">•</span>
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Sede Ibagué</span>
            </div>
          </div>
        </div>

        {/* Bio & Project Impact */}
        <div className="py-4 space-y-3 text-xs leading-relaxed text-slate-300">
          <p>
            Este simulador integral de pruebas de Estado (Saber 11 y Saber Pro) fue concebido y desarrollado
            por <strong>Juan Esteban Vera Rodríguez</strong> como una contribución técnica y pedagógica al sistema
            educativo colombiano.
          </p>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Pilares de Innovación del Proyecto:</span>
            </div>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Modelo Basado en Evidencias (MBE)</strong> y calibración psicométrica mediante Teoría de Respuesta al Ítem (TRI).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Tutoría Socrática con Inteligencia Artificial</strong> para democratizar el entrenamiento deliberado de alta calidad.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Iniciativa &ldquo;Cero Papel&rdquo;</strong> para habilitar exámenes institucionales en salas de cómputo y reducir la tala y residuos en colegios y universidades.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Code className="w-3.5 h-3.5" />
            <span>Ibagué, Tolima, Colombia</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
