import { ExamType, Question, QuestionResponseLog } from '@/types';

// Normal Cumulative Distribution Function approximation for percentiles
function normalCDF(z: number): number {
  const t = 1.0 / (1.0 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1.0 - prob : prob;
}

export function computeExamResults(
  examType: ExamType,
  questions: Question[],
  responses: Record<string, QuestionResponseLog>
): {
  globalScore: number;
  maxPossibleScore: number;
  areaScores: Record<string, number>;
  percentilEstimado: number;
  nivelDesempeno: string;
  pacingMetrics: {
    avgTimePerQuestion: number;
    timeThiefQuestions: string[];
    fatigueDropPercent: number;
  };
} {
  const areaStats: Record<string, { total: number; correct: number; triSum: number }> = {};

  const totalQuestionsCount = questions.length;
  let correctCount = 0;
  let totalTime = 0;
  const timeThiefQuestions: string[] = [];

  // Group by question order for fatigue detection
  const orderedResponses: { isCorrect: boolean }[] = [];

  questions.forEach((q) => {
    const area = q.area;
    if (!areaStats[area]) {
      areaStats[area] = { total: 0, correct: 0, triSum: 0 };
    }
    areaStats[area].total += 1;

    const resp = responses[q.id];
    const isCorrect = resp?.isCorrect ?? false;
    const timeSpent = resp?.timeSpentSeconds ?? 0;
    totalTime += timeSpent;

    if (isCorrect) {
      correctCount += 1;
      areaStats[area].correct += 1;
      areaStats[area].triSum += q.tri?.a_discriminacion ?? 1.0;
    }

    if (!isCorrect && timeSpent > 210) {
      // > 3.5 minutes and wrong -> Time Thief
      timeThiefQuestions.push(q.id);
    }

    orderedResponses.push({ isCorrect });
  });

  // Calculate Fatigue drop between first half and second half
  let fatigueDropPercent = 0;
  if (orderedResponses.length >= 6) {
    const half = Math.floor(orderedResponses.length / 2);
    const firstHalfCorrect = orderedResponses.slice(0, half).filter((r) => r.isCorrect).length / half;
    const secondHalfCorrect = orderedResponses.slice(half).filter((r) => r.isCorrect).length / (orderedResponses.length - half);
    fatigueDropPercent = Math.max(0, Math.round((firstHalfCorrect - secondHalfCorrect) * 100));
  }

  const avgTimePerQuestion = totalQuestionsCount > 0 ? Math.round(totalTime / totalQuestionsCount) : 0;

  // Calculate Area Scores
  const areaScores: Record<string, number> = {};

  if (examType === 'SABER_11') {
    // Areas: MATEMATICAS, LECTURA_CRITICA, CIENCIAS_NATURALES, SOCIALES_Y_CIUDADANAS, INGLES
    Object.keys(areaStats).forEach((area) => {
      const stats = areaStats[area];
      const accuracy = stats.total > 0 ? stats.correct / stats.total : 0;
      // Linear scaling with baseline 20 and max 100
      const score = Math.round(20 + accuracy * 78 + (stats.triSum / (stats.total || 1)) * 2);
      areaScores[area] = Math.min(100, Math.max(10, score));
    });

    // Provide default scores if some areas had 0 questions in small drills
    const matScore = areaScores['MATEMATICAS'] ?? Math.round(correctCount / (totalQuestionsCount || 1) * 80 + 20);
    const lecScore = areaScores['LECTURA_CRITICA'] ?? matScore;
    const socScore = areaScores['SOCIALES_Y_CIUDADANAS'] ?? matScore;
    const natScore = areaScores['CIENCIAS_NATURALES'] ?? matScore;
    const ingScore = areaScores['INGLES'] ?? Math.max(10, matScore - 5);

    // Official ICFES weights: 3, 3, 3, 3, 1 (Total = 13)
    const weightedSum = (matScore * 3) + (lecScore * 3) + (socScore * 3) + (natScore * 3) + (ingScore * 1);
    const globalScore = Math.round((weightedSum / 13) * 5);

    // Percentile estimation against national mean ~ 252, std ~ 48
    const zScore = (globalScore - 252) / 48;
    const percentilEstimado = Math.min(99, Math.max(1, Math.round(normalCDF(zScore) * 100)));

    // Performance Level
    let nivelDesempeno = 'Nivel 2 (Mínimo)';
    if (globalScore < 200) nivelDesempeno = 'Nivel 1 (Insuficiente)';
    else if (globalScore >= 320 && globalScore < 390) nivelDesempeno = 'Nivel 3 (Satisfactorio)';
    else if (globalScore >= 390) nivelDesempeno = 'Nivel 4 (Avanzado)';

    return {
      globalScore: Math.min(500, Math.max(0, globalScore)),
      maxPossibleScore: 500,
      areaScores,
      percentilEstimado,
      nivelDesempeno,
      pacingMetrics: {
        avgTimePerQuestion,
        timeThiefQuestions,
        fatigueDropPercent,
      },
    };
  } else {
    // SABER PRO (Scale 0 to 300)
    Object.keys(areaStats).forEach((area) => {
      const stats = areaStats[area];
      const accuracy = stats.total > 0 ? stats.correct / stats.total : 0;
      // Saber Pro area scale 0 to 300 (mean 150)
      const score = Math.round(60 + accuracy * 230 + (stats.triSum / (stats.total || 1)) * 5);
      areaScores[area] = Math.min(300, Math.max(30, score));
    });

    const activeAreaValues = Object.values(areaScores);
    const sum = activeAreaValues.reduce((a, b) => a + b, 0);
    const globalScore = activeAreaValues.length > 0 ? Math.round(sum / activeAreaValues.length) : 150;

    // National benchmark mean ~ 150, std ~ 30
    const zScore = (globalScore - 150) / 30;
    const percentilEstimado = Math.min(99, Math.max(1, Math.round(normalCDF(zScore) * 100)));

    let nivelDesempeno = 'Nivel 2 (Mínimo)';
    if (globalScore < 120) nivelDesempeno = 'Nivel 1 (Insuficiente)';
    else if (globalScore >= 180 && globalScore < 225) nivelDesempeno = 'Nivel 3 (Satisfactorio)';
    else if (globalScore >= 225) nivelDesempeno = 'Nivel 4 (Avanzado)';

    return {
      globalScore: Math.min(300, Math.max(0, globalScore)),
      maxPossibleScore: 300,
      areaScores,
      percentilEstimado,
      nivelDesempeno,
      pacingMetrics: {
        avgTimePerQuestion,
        timeThiefQuestions,
        fatigueDropPercent,
      },
    };
  }
}
