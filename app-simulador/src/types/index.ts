export type ExamType = 'SABER_11' | 'SABER_PRO';

export type ExamMode = 'SIMULACRO_OFICIAL' | 'ENTRENAMIENTO_AREA' | 'DIAGNOSTICO_RAPIDO';

export type AreaCode =
  | 'MATEMATICAS'
  | 'LECTURA_CRITICA'
  | 'CIENCIAS_NATURALES'
  | 'SOCIALES_Y_CIUDADANAS'
  | 'INGLES'
  | 'RAZONAMIENTO_CUANTITATIVO'
  | 'COMPETENCIAS_CIUDADANAS'
  | 'COMUNICACION_ESCRITA'
  | 'DISENO_DE_SOFTWARE';

export interface QuestionOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  texto: string;
  es_correcta: boolean;
  tipo_distractor?: string | null;
}

export interface Question {
  id: string;
  prueba: ExamType;
  area: string;
  area_nombre: string;
  numero: number;
  competencia: string;
  componente: string;
  afirmacion?: string;
  evidencia?: string;
  enunciado: string;
  opciones: QuestionOption[];
  clave_oficial: string;
  tri: {
    a_discriminacion: number;
    b_dificultad: number;
    c_azar: number;
  };
  explicacion: string;
}

export interface QuestionResponseLog {
  questionId: string;
  selectedOption: string | null;
  isCorrect: boolean;
  timeSpentSeconds: number;
  changeCount: number;
  isFlagged: boolean;
  visitedTimestamp: number;
}

export interface ExamSessionLog {
  id: string;
  userId: string;
  userName: string;
  examType: ExamType;
  mode: ExamMode;
  targetArea?: string;
  startedAt: string;
  finishedAt: string;
  totalDurationSeconds: number;
  totalQuestions: number;
  totalAnswered: number;
  totalCorrect: number;
  responses: Record<string, QuestionResponseLog>;
  scores: {
    globalScore: number; // 0-500 (Saber 11) o 0-300 (Saber Pro)
    maxPossibleScore: number;
    areaScores: Record<string, number>;
    percentilEstimado: number; // 1-100
    nivelDesempeno: string; // 'Nivel 1' | 'Nivel 2' | 'Nivel 3' | 'Nivel 4' | 'A-' | 'A1' | 'A2' | 'B1' | 'B+'
  };
  pacingMetrics: {
    avgTimePerQuestion: number;
    timeThiefQuestions: string[]; // Questions with > 3.5 min and wrong answer
    fatigueDropPercent: number; // Drop in accuracy between 1st half and 2nd half
  };
}

export interface ProcessedDocument {
  index: number;
  filename: string;
  filepath: string;
  pages: number;
  exam: string;
  module_or_area: string;
  doc_type: string;
  competencies_found: string[];
  sample_questions_count: number;
  extracted_summary: string;
  key_topics?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'ESTUDIANTE' | 'DOCENTE' | 'ADMIN';
  plan: 'FREE' | 'PRO';
  targetExam: ExamType;
  institutionCode?: string;
}
