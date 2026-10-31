'use client';

import React, { useState } from 'react';
import { Bot, Send, X, Lightbulb, ShieldAlert, BookOpen, Loader2 } from 'lucide-react';
import { Question } from '@/types';
import { generateTutorResponse } from '@/lib/tutorService';

interface TutorAiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
  isProUser: boolean;
  onOpenPricing: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function TutorAiDrawer({
  isOpen,
  onClose,
  question,
  isProUser,
  onOpenPricing,
}: TutorAiDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hola. Soy tu Tutor Académico de IA especializado en el estándar ICFES. ¿En qué aspecto de esta pregunta requieres orientación?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const sendMessage = async (userText: string, mode?: 'PISTA' | 'DESCARTE' | 'CONCEPTUAL') => {
    if (!userText.trim()) return;

    const newMsgs: Message[] = [...messages, { role: 'user', content: userText }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      // Direct client-side generation for zero-latency & GitHub Pages compatibility
      const reply = generateTutorResponse({
        questionId: question.id,
        enunciado: question.enunciado,
        opciones: question.opciones,
        claveOficial: question.clave_oficial,
        explicacionOficial: question.explicacion,
        userQuery: userText,
        mode,
      });

      setTimeout(() => {
        setMessages([...newMsgs, { role: 'assistant', content: reply }]);
        setLoading(false);
      }, 350);
    } catch {
      setMessages([
        ...newMsgs,
        {
          role: 'assistant',
          content: 'No se pudo generar la orientación en este momento. Intenta nuevamente.',
        },
      ]);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm">Tutor Académico AI</h3>
            <p className="text-[11px] text-slate-400">Pregunta {question.numero} — {question.area_nombre}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Cerrar panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Action Pills */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
        <button
          onClick={() => sendMessage('Dame una pista socrática sin decirme la respuesta', 'PISTA')}
          disabled={loading}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 whitespace-nowrap transition-colors"
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Pedir Pista</span>
        </button>
        <button
          onClick={() => sendMessage('Explica las trampas o distractores de esta pregunta', 'DESCARTE')}
          disabled={loading}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 whitespace-nowrap transition-colors"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          <span>Ver Trampas</span>
        </button>
        <button
          onClick={() => sendMessage('Explica el fundamento teórico necesario para este ítem', 'CONCEPTUAL')}
          disabled={loading}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 whitespace-nowrap transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span>Teoría Clave</span>
        </button>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              m.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white font-medium shadow-sm'
                  : 'bg-slate-950 text-slate-200 border border-slate-800'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            <span>El tutor está analizando el ítem...</span>
          </div>
        )}
      </div>

      {/* Input or Upgrade Prompt */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
          <span>{isProUser ? 'Suscripción PRO Activa' : 'Modo Básico'}</span>
          {!isProUser && (
            <button
              onClick={onOpenPricing}
              className="text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Mejorar a PRO
            </button>
          )}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta algo sobre este ejercicio..."
            disabled={loading}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-colors"
            aria-label="Enviar pregunta"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
