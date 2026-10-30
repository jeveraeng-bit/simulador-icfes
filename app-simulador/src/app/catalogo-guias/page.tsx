'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import AdBanner from '@/components/AdBanner';
import { ProcessedDocument } from '@/types';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle,
  Loader2,
} from 'lucide-react';

export default function CatalogoGuiasPage() {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [examFilter, setExamFilter] = useState('ALL');
  const [selectedDoc, setSelectedDoc] = useState<ProcessedDocument | null>(null);

  useEffect(() => {
    async function loadCatalog() {
      setLoading(true);
      try {
        const res = await fetch(`/api/catalog?exam=${examFilter}&q=${encodeURIComponent(search)}`);
        const data = await res.json();
        if (data.success) {
          setDocuments(data.documents);
        }
      } catch (err) {
        console.error('Error cargando catalogo', err);
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, [examFilter, search]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />
      <AdBanner slot="top" />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-6">
        {/* Title */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Biblioteca Oficial Procesada</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Catálogo de Guías y Cuadernillos ICFES (58 Documentos)
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
            Consorcio de guías de orientación, cuadernillos censales y bancos de preguntas procesados para
            Saber 11.° y Saber Pro (módulos genéricos y áreas específicas de ingeniería, salud, derecho, educación y ciencias económicas).
          </p>

          {/* Filter and Search Bar */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por área, materia, competencia o nombre de archivo..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={examFilter}
                onChange={(e) => setExamFilter(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">Todas las pruebas (Saber 11 & Pro)</option>
                <option value="SABER_11">Saber 11.° (Educación Media)</option>
                <option value="SABER_PRO">Saber Pro (Educación Superior)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <div className="flex items-center gap-2">
            <span>Mostrando {documents.length} documentos encontrados</span>
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />}
          </div>
          <span>58 archivos analizados en total</span>
        </div>

        {/* Grid of Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => {
            return (
              <div
                key={doc.filename}
                onClick={() => setSelectedDoc(doc)}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        doc.exam === 'SABER_11'
                          ? 'bg-sky-950/40 text-sky-400 border-sky-500/20'
                          : 'bg-indigo-950/40 text-indigo-400 border-indigo-500/20'
                      }`}
                    >
                      {doc.exam === 'SABER_11' ? 'Saber 11' : 'Saber Pro'}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono font-medium">
                      {doc.pages} págs
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-100 text-sm group-hover:text-indigo-300 transition-colors line-clamp-2 mb-2">
                    {doc.module_or_area}
                  </h3>

                  <p className="text-[11px] text-slate-400 font-mono truncate mb-3">
                    {doc.filename}
                  </p>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                    {doc.extracted_summary || 'Documento oficial con especificaciones curriculares del ICFES.'}
                  </p>
                </div>

                <div>
                  {doc.competencies_found && doc.competencies_found.length > 0 && (
                    <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400">
                      <div className="font-semibold text-slate-300 mb-1">Competencias identificadas:</div>
                      <div className="flex flex-wrap gap-1">
                        {doc.competencies_found.slice(0, 2).map((c, i) => (
                          <span
                            key={i}
                            className="bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800 truncate max-w-[200px]"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Document Detail Modal */}
        {selectedDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl relative max-h-[85vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-950/60 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded">
                    {selectedDoc.exam} — {selectedDoc.pages} Páginas
                  </span>
                  <h2 className="text-lg font-bold text-white mt-1.5">{selectedDoc.module_or_area}</h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedDoc.filename}</p>
                </div>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="py-4 space-y-4 text-xs">
                <div>
                  <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                    Descripción y Propósito del Instrumento
                  </h4>
                  <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                    {selectedDoc.extracted_summary}
                  </p>
                </div>

                {selectedDoc.competencies_found && selectedDoc.competencies_found.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
                      Competencias y Afirmaciones del Modelo Basado en Evidencias (MBE)
                    </h4>
                    <ul className="space-y-1.5">
                      {selectedDoc.competencies_found.map((c, i) => (
                        <li key={i} className="flex items-start gap-2 bg-slate-950 p-2 rounded border border-slate-800">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-slate-200">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-500/20 text-indigo-300">
                  <span className="font-semibold">Integración en el Simulador: </span>
                  Los estándares y reactivos de este cuadernillo se encuentran incorporados en la base de datos de preguntas y calibrados psicométricamente bajo el modelo 3PL de la TRI.
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                >
                  Cerrar Ficha Técnica
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
