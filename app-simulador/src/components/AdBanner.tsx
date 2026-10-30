'use client';

import React from 'react';
import { Megaphone, ExternalLink } from 'lucide-react';

interface AdBannerProps {
  slot?: 'top' | 'sidebar' | 'footer';
  title?: string;
  subtitle?: string;
}

export default function AdBanner({
  slot = 'top',
  title = 'Convocatoria Nacional de Becas y Preuniversitarios 2026',
  subtitle = 'Inscríbete a los programas de financiamiento para educación superior y convenios universitarios.',
}: AdBannerProps) {
  if (slot === 'sidebar') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-slate-300 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-medium tracking-wide uppercase text-[10px] mb-2">
          <Megaphone className="w-3.5 h-3.5 text-indigo-400" />
          <span>Patrocinado</span>
        </div>
        <p className="font-semibold text-slate-100 text-sm mb-1">{title}</p>
        <p className="text-slate-400 text-xs leading-relaxed mb-3">{subtitle}</p>
        <a
          href="#anuncios"
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          <span>Más información</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  return (
    <aside className="w-full bg-slate-900/80 border-y border-slate-800 py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="bg-slate-800 text-indigo-400 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase border border-slate-700">
            Anuncio
          </span>
          <span className="text-slate-200 font-medium">{title}</span>
          <span className="hidden md:inline text-slate-400">— {subtitle}</span>
        </div>
        <a
          href="#patrocinador"
          onClick={(e) => e.preventDefault()}
          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium shrink-0 transition-colors"
        >
          <span>Conocer detalles</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </aside>
  );
}
