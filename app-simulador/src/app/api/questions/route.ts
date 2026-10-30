import { NextRequest, NextResponse } from 'next/server';
import questionsData from '@/data/seed_questions.json';
import { Question, ExamType } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const exam = searchParams.get('exam') as ExamType | null;
    const area = searchParams.get('area');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 0;
    const mode = searchParams.get('mode');

    let list = (questionsData as unknown) as Question[];

    if (exam) {
      list = list.filter((q) => q.prueba === exam);
    }

    if (area && area !== 'ALL') {
      list = list.filter((q) => q.area === area);
    }

    // Shuffle questions for randomized mock exams if requested
    if (mode === 'RANDOM' || mode === 'DIAGNOSTICO_RAPIDO') {
      list = [...list].sort(() => 0.5 - Math.random());
    }

    if (limit > 0) {
      list = list.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      total: list.length,
      questions: list,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al obtener preguntas';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
