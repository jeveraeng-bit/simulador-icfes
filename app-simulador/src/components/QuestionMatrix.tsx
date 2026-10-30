'use client';

import React from 'react';
import { QuestionResponseLog } from '@/types';

interface QuestionMatrixProps {
  totalQuestions: number;
  currentIndex: number;
  responses: Record<string, QuestionResponseLog>;
  questionsIds: string[];
  onSelectIndex: (index: number) => void;
}

export default function QuestionMatrix({
  totalQuestions,
  currentIndex,
  responses,
  questionsIds,
  onSelectIndex,
}: QuestionMatrixProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-md">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
          Navegación de Preguntas
        </h3>
        <span className="text-xs text-slate-400 font-medium">
          {Object.values(responses).filter((r) => r.selectedOption !== null).length} de {totalQuestions} respondidas
        </span>
      </div>

      {/* Grid of buttons */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-5 lg:grid-cols-6 gap-2 max-h-72 overflow-y-auto p-1">
        {questionsIds.map((qId, idx) => {
          const resp = responses[qId];
          const isAnswered = resp && resp.selectedOption !== null;
          const isFlagged = resp && resp.isFlagged;
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={qId}
              onClick={() => onSelectIndex(idx)}
              className={`relative h-9 rounded-md text-xs font-bold flex items-center justify-center transition-all ${
                isCurrent
                  ? 'ring-2 ring-indigo-400 bg-slate-800 text-white'
                  : isAnswered
                  ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{idx + 1}</span>
              {isFlagged && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600 shrink-0" />
          <span>Respondida</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-slate-950 border border-slate-700 shrink-0" />
          <span>Sin responder</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
          <span>Marcada p/ revisión</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm ring-1 ring-indigo-400 bg-slate-800 shrink-0" />
          <span>Pregunta actual</span>
        </div>
      </div>
    </div>
  );
}
