'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Pause, Play, CheckCircle2 } from 'lucide-react';

interface ExamTimerProps {
  initialSeconds: number;
  onTimeExpired: () => void;
  onFinishExam: () => void;
}

export default function ExamTimer({ initialSeconds, onTimeExpired, onFinishExam }: ExamTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    if (secondsLeft <= 0) {
      onTimeExpired();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft, isPaused, onTimeExpired]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const isLowTime = secondsLeft < 300; // less than 5 min

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between gap-3 shadow-md">
      {/* Clock display */}
      <div className="flex items-center gap-2">
        <Clock
          className={`w-5 h-5 ${
            isLowTime ? 'text-rose-500 animate-pulse' : 'text-indigo-400'
          }`}
        />
        <div>
          <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            Tiempo Restante
          </div>
          <div
            className={`font-mono text-base font-bold leading-none ${
              isLowTime ? 'text-rose-400' : 'text-slate-100'
            }`}
          >
            {formattedTime}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          title={isPaused ? 'Reanudar simulacro' : 'Pausar simulacro'}
        >
          {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
        </button>

        <button
          onClick={onFinishExam}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Finalizar Examen</span>
        </button>
      </div>
    </div>
  );
}
