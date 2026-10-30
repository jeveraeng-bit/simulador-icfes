'use client';

import React from 'react';
import { Bookmark, Sparkles, BookCheck, Shield } from 'lucide-react';
import { Question } from '@/types';

interface QuestionCardProps {
  question: Question;
  selectedOption: string | null;
  isFlagged: boolean;
  onSelectOption: (optionId: string) => void;
  onToggleFlag: () => void;
  onOpenTutor: () => void;
  currentIndex: number;
  totalQuestions: number;
}

export default function QuestionCard({
  question,
  selectedOption,
  isFlagged,
  onSelectOption,
  onToggleFlag,
  onOpenTutor,
  currentIndex,
  totalQuestions,
}: QuestionCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 md:p-7 shadow-lg flex flex-col justify-between">
      <div>
        {/* Metadata & Actions bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-100 bg-slate-800 px-2.5 py-1 rounded border border-slate-700">
              Pregunta {currentIndex + 1} de {totalQuestions}
            </span>
            <span className="text-indigo-400 bg-indigo-950/40 border border-indigo-500/20 px-2 py-0.5 rounded font-medium">
              {question.area_nombre}
            </span>
            <span className="text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded hidden sm:inline">
              {question.competencia}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Flag for review */}
            <button
              onClick={onToggleFlag}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium transition-colors ${
                isFlagged
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Marcar pregunta para revisarla antes de finalizar"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isFlagged ? 'Marcada' : 'Marcar para revisar'}</span>
            </button>

            {/* AI Tutor Button */}
            <button
              onClick={onOpenTutor}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Consultar Tutor AI</span>
            </button>
          </div>
        </div>

        {/* Question Statement */}
        <div className="text-slate-100 text-sm md:text-base leading-relaxed mb-6 font-normal">
          {question.enunciado}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.opciones.map((opt) => {
            const isSelected = selectedOption === opt.id;
            return (
              <label
                key={opt.id}
                onClick={() => onSelectOption(opt.id)}
                className={`flex items-start gap-3.5 p-3.5 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 text-slate-100 shadow-sm'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {opt.id}
                </div>
                <div className="text-sm leading-snug flex-1 select-none">
                  {opt.texto}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-slate-400" />
          <span>Modelo Basado en Evidencias (MBE) — Parámetro TRI b: {question.tri?.b_dificultad ?? 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <BookCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Componente: {question.componente}</span>
        </div>
      </div>
    </div>
  );
}
