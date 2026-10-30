import { NextRequest, NextResponse } from 'next/server';
import catalogData from '@/data/guias_y_bancos_procesados.json';
import { ProcessedDocument } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const exam = searchParams.get('exam');
    const area = searchParams.get('area');
    const query = searchParams.get('q')?.toLowerCase() || '';

    let list = (catalogData as unknown) as ProcessedDocument[];

    if (exam && exam !== 'ALL') {
      list = list.filter((d) => d.exam === exam);
    }

    if (area && area !== 'ALL') {
      list = list.filter((d) => d.module_or_area.toLowerCase().includes(area.toLowerCase()));
    }

    if (query) {
      list = list.filter(
        (d) =>
          d.filename.toLowerCase().includes(query) ||
          d.module_or_area.toLowerCase().includes(query) ||
          d.extracted_summary.toLowerCase().includes(query) ||
          d.competencies_found.some((c) => c.toLowerCase().includes(query))
      );
    }

    return NextResponse.json({
      success: true,
      total: list.length,
      documents: list,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error al obtener catálogo';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
