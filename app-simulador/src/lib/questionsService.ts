import questionsData from '@/data/seed_questions.json';
import { Question, ExamType } from '@/types';

export function getFilteredQuestions(params: {
  exam?: ExamType | null;
  area?: string;
  limit?: number;
  mode?: string;
}): Question[] {
  let list = (questionsData as unknown) as Question[];

  if (params.exam) {
    list = list.filter((q) => q.prueba === params.exam);
  }

  if (params.area && params.area !== 'ALL') {
    list = list.filter((q) => q.area === params.area);
  }

  if (params.mode === 'RANDOM' || params.mode === 'DIAGNOSTICO_RAPIDO') {
    list = [...list].sort(() => 0.5 - Math.random());
  }

  if (params.limit && params.limit > 0) {
    list = list.slice(0, params.limit);
  }

  return list;
}
