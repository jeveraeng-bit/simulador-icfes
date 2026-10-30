'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import AdBanner from '@/components/AdBanner';
import QuestionCard from '@/components/QuestionCard';
import QuestionMatrix from '@/components/QuestionMatrix';
import ExamTimer from '@/components/ExamTimer';
import TutorAiDrawer from '@/components/TutorAiDrawer';
import { Question, QuestionResponseLog, ExamType, ExamMode, ExamSessionLog } from '@/types';
import { computeExamResults } from '@/lib/scoringEngine';
import { getUserProfile, saveSessionLog } from '@/lib/storage';
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

function SimuladorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const examTypeParam = (searchParams.get('exam') as ExamType) || 'SABER_11';
  const modeParam = (searchParams.get('mode') as ExamMode) || 'SIMULACRO_OFICIAL';
  const areaParam = searchParams.get('area') || 'ALL';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, QuestionResponseLog>>({});
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [userProfile] = useState(getUserProfile());

  const sessionStartTime = useRef<string>(new Date().toISOString());
  const itemActiveStartTime = useRef<number>(Date.now());

  // Determine duration:
  // Quick diagnostic: 15 questions = 25 minutes (1500s)
  // Drill: 20 questions = 35 minutes (2100s)
  // Full mock: 50 questions = 90 minutes (5400s)
  const initialSeconds =
    modeParam === 'DIAGNOSTICO_RAPIDO'
      ? 1500
      : modeParam === 'ENTRENAMIENTO_AREA'
      ? 2400
      : 5400;

  // Load questions from API
  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      try {
        const limit = modeParam === 'DIAGNOSTICO_RAPIDO' ? '15' : modeParam === 'ENTRENAMIENTO_AREA' ? '20' : '40';
        const url = `/api/questions?exam=${examTypeParam}&area=${areaParam}&limit=${limit}&mode=${modeParam}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.success && data.questions?.length > 0) {
          setQuestions(data.questions);

          // Initialize responses map
          const initialMap: Record<string, QuestionResponseLog> = {};
          data.questions.forEach((q: Question) => {
            initialMap[q.id] = {
              questionId: q.id,
              selectedOption: null,
              isCorrect: false,
              timeSpentSeconds: 0,
              changeCount: 0,
              isFlagged: false,
              visitedTimestamp: Date.now(),
            };
          });
          setResponses(initialMap);
        }
      } catch (err) {
        console.error('Error fetching questions', err);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [examTypeParam, modeParam, areaParam]);

  // Update item active time when navigating
  const recordCurrentItemTime = () => {
    if (!questions[currentIndex]) return;
    const currentQId = questions[currentIndex].id;
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - itemActiveStartTime.current) / 1000));

    setResponses((prev) => {
      const existing = prev[currentQId] || {
        questionId: currentQId,
        selectedOption: null,
        isCorrect: false,
        timeSpentSeconds: 0,
        changeCount: 0,
        isFlagged: false,
        visitedTimestamp: Date.now(),
      };
      return {
        ...prev,
        [currentQId]: {
          ...existing,
          timeSpentSeconds: existing.timeSpentSeconds + elapsedSeconds,
        },
      };
    });

    itemActiveStartTime.current = Date.now();
  };

  const handleSelectOption = (optionId: string) => {
    if (!questions[currentIndex]) return;
    const currentQ = questions[currentIndex];
    const isCorrect = currentQ.clave_oficial === optionId;

    setResponses((prev) => {
      const existing = prev[currentQ.id];
      const hasChanged = existing.selectedOption !== null && existing.selectedOption !== optionId;
      return {
        ...prev,
        [currentQ.id]: {
          ...existing,
          selectedOption: optionId,
          isCorrect,
          changeCount: hasChanged ? existing.changeCount + 1 : existing.changeCount,
        },
      };
    });
  };

  const handleToggleFlag = () => {
    if (!questions[currentIndex]) return;
    const currentQId = questions[currentIndex].id;
    setResponses((prev) => {
      const existing = prev[currentQId];
      return {
        ...prev,
        [currentQId]: {
          ...existing,
          isFlagged: !existing.isFlagged,
        },
      };
    });
  };

  const handleNavigate = (newIdx: number) => {
    if (newIdx < 0 || newIdx >= questions.length) return;
    recordCurrentItemTime();
    setCurrentIndex(newIdx);
  };

  const handleFinishExam = () => {
    recordCurrentItemTime();

    const confirmed = window.confirm(
      '¿Deseas finalizar el simulacro y generar tu reporte oficial de puntaje y telemetría?'
    );
    if (!confirmed) return;

    // Calculate score
    const results = computeExamResults(examTypeParam, questions, responses);
    const finishedAt = new Date().toISOString();
    const durationSeconds = Math.round(
      (new Date(finishedAt).getTime() - new Date(sessionStartTime.current).getTime()) / 1000
    );

    const answeredCount = Object.values(responses).filter((r) => r.selectedOption !== null).length;
    const correctCount = Object.values(responses).filter((r) => r.isCorrect).length;

    const sessionLog: ExamSessionLog = {
      id: `ses_${Date.now()}`,
      userId: userProfile.id,
      userName: userProfile.name,
      examType: examTypeParam,
      mode: modeParam,
      targetArea: areaParam !== 'ALL' ? areaParam : undefined,
      startedAt: sessionStartTime.current,
      finishedAt,
      totalDurationSeconds: durationSeconds,
      totalQuestions: questions.length,
      totalAnswered: answeredCount,
      totalCorrect: correctCount,
      responses,
      scores: results,
      pacingMetrics: results.pacingMetrics,
    };

    saveSessionLog(sessionLog);
    router.push(`/resultados?sessionId=${sessionLog.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
          <h2 className="text-lg font-bold text-slate-200">Cargando batería de preguntas oficiales...</h2>
          <p className="text-xs text-slate-400 mt-1">Configurando telemetría y Modelo Basado en Evidencias</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-amber-400 mb-3" />
          <h2 className="text-lg font-bold text-slate-200">No se encontraron preguntas</h2>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            No hay ítems disponibles para los filtros seleccionados ({examTypeParam} - {areaParam}).
          </p>
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

  const currentQ = questions[currentIndex];
  const currentResp = responses[currentQ?.id];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />
      <AdBanner slot="top" />

      {/* Main Examination Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Timer, Active Question, Navigation */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <ExamTimer
            initialSeconds={initialSeconds}
            onTimeExpired={handleFinishExam}
            onFinishExam={handleFinishExam}
          />

          {currentQ && (
            <QuestionCard
              question={currentQ}
              selectedOption={currentResp?.selectedOption ?? null}
              isFlagged={currentResp?.isFlagged ?? false}
              onSelectOption={handleSelectOption}
              onToggleFlag={handleToggleFlag}
              onOpenTutor={() => setIsTutorOpen(true)}
              currentIndex={currentIndex}
              totalQuestions={questions.length}
            />
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-4">
            <button
              onClick={() => handleNavigate(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <span className="text-xs text-slate-400 font-medium">
              {currentIndex + 1} de {questions.length}
            </span>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleFinishExam}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-sm transition-colors"
              >
                <span>Finalizar Examen</span>
              </button>
            ) : (
              <button
                onClick={() => handleNavigate(currentIndex + 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition-colors"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Question Grid Matrix & Sidebar Ad */}
        <aside className="lg:col-span-1 flex flex-col gap-4">
          <QuestionMatrix
            totalQuestions={questions.length}
            currentIndex={currentIndex}
            responses={responses}
            questionsIds={questions.map((q) => q.id)}
            onSelectIndex={handleNavigate}
          />

          <AdBanner
            slot="sidebar"
            title="Pre-ICFES Saber 11 Intensivo"
            subtitle="Simulacros adaptativos calibrados por microdatos del ICFES. Accede a tutorías personalizadas."
          />
        </aside>
      </main>

      {/* AI Tutor Drawer */}
      {currentQ && (
        <TutorAiDrawer
          isOpen={isTutorOpen}
          onClose={() => setIsTutorOpen(false)}
          question={currentQ}
          isProUser={userProfile.plan === 'PRO'}
          onOpenPricing={() => {}}
        />
      )}
    </div>
  );
}

export default function SimuladorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      }
    >
      <SimuladorContent />
    </Suspense>
  );
}
