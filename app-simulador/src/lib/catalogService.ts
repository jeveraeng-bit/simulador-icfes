import catalogData from '@/data/guias_y_bancos_procesados.json';
import { ProcessedDocument } from '@/types';

export function getFilteredCatalog(params: {
  exam?: string;
  area?: string;
  query?: string;
}): ProcessedDocument[] {
  let list = (catalogData as unknown) as ProcessedDocument[];

  if (params.exam && params.exam !== 'ALL') {
    list = list.filter((d) => d.exam === params.exam);
  }

  if (params.area && params.area !== 'ALL') {
    list = list.filter((d) => d.module_or_area.toLowerCase().includes(params.area!.toLowerCase()));
  }

  if (params.query) {
    const q = params.query.toLowerCase();
    list = list.filter(
      (d) =>
        d.filename.toLowerCase().includes(q) ||
        d.module_or_area.toLowerCase().includes(q) ||
        d.extracted_summary.toLowerCase().includes(q) ||
        d.competencies_found.some((c) => c.toLowerCase().includes(q))
    );
  }

  return list;
}
