import React from 'react';
import { Language } from '../types/exercise';

interface StudyGuideProps {
  onStartTrack: (lang: Language) => void;
}

export const StudyGuide: React.FC<StudyGuideProps> = ({ onStartTrack }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
          <span>Metodologia & Boas Práticas</span>
          <span aria-hidden="true">·</span>
          <span>Aprender na Prática</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Guia de Estudos & Roteiro de Domínio
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Como aproveitar a plataforma ao máximo para consolidar sua lógica e se preparar para desafios reais do mercado.
        </p>
      </div>

      {/* Methodology Section */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <span>🧠</span>
          <span>Por que o método com lacunas (Cloze Testing) funciona tão bem?</span>
        </h2>
        <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
          <p>
            Copiar e colar soluções prontas cria uma falsa sensação de aprendizado conhecida como "ilusão de competência". Quando você é desafiado a preencher lacunas em código real estruturado:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
            <li><strong className="text-slate-200">Recuperação Ativa (Active Recall):</strong> Seu cérebro precisa buscar na memória a sintaxe exata e a função nativa correta.</li>
            <li><strong className="text-slate-200">Reconhecimento de Padrões:</strong> Você aprende a ler código com indentação e contexto real em vez de exercícios isolados de 1 linha.</li>
            <li><strong className="text-slate-200">Feedback Imediato:</strong> Ao testar instantaneamente, você descobre se cometeu um erro de digitação, esquecimento de argumento ou falha lógica.</li>
          </ul>
        </div>
      </div>

      {/* Two Roadmap tracks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PHP Roadmap */}
        <div className="rounded-xl border border-indigo-900/40 bg-slate-900/50 p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐘</span>
              <div>
                <h3 className="font-bold text-white text-base">Trilha de Domínio PHP</h3>
                <span className="text-xs text-indigo-400">Prioridade da sua carreira</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              O PHP moderno (PHP 8+) é rápido, fortemente tipado e robusto. O roteiro profissional compreende:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                <span className="font-semibold text-slate-200 block mb-0.5">1. Fundamentos & Tipagem</span>
                <span className="text-slate-400">Operadores, strict_types, loops foreach e o operador null coalescing (??).</span>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                <span className="font-semibold text-slate-200 block mb-0.5">2. Web & Banco de Dados</span>
                <span className="text-slate-400">Validação com filter_var, sessões, PDO com prepared statements contra SQL Injection.</span>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                <span className="font-semibold text-slate-200 block mb-0.5">3. Arquitetura & SOLID</span>
                <span className="text-slate-400">Classes com atributos privados, Interfaces para Injeção de Dependência, Traits e Repositories.</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onStartTrack('php')}
            className="w-full mt-4 py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors text-center"
          >
            Focar na Trilha PHP →
          </button>
        </div>

        {/* JS Roadmap */}
        <div className="rounded-xl border border-amber-900/40 bg-slate-900/50 p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="font-bold text-white text-base">Trilha de JavaScript</h3>
                <span className="text-xs text-amber-400">Linguagem secundária</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              JavaScript moderno (ES6+) é a espinha dorsal de qualquer frontend interativo e APIs Node.js:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                <span className="font-semibold text-slate-200 block mb-0.5">1. ES6+ Essencial</span>
                <span className="text-slate-400">Arrow functions, desestruturação de objetos, template literals e valores padrão.</span>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                <span className="font-semibold text-slate-200 block mb-0.5">2. Métodos de Array & Imutabilidade</span>
                <span className="text-slate-400">Pipelines de transformação com filter, map e reduce sem alterar os dados originais.</span>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                <span className="font-semibold text-slate-200 block mb-0.5">3. Assincronismo & Performance</span>
                <span className="text-slate-400">Promises, Async / Await, fetch com validação e padrão utilitário de debounce.</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onStartTrack('javascript')}
            className="w-full mt-4 py-2 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-colors text-center"
          >
            Explorar Trilha JavaScript →
          </button>
        </div>
      </div>

      {/* Developer Checklist */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 space-y-3">
        <h3 className="text-sm font-bold text-white">Checklist de Hábitos para o Dia a Dia</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <strong className="text-slate-200 block mb-1">✓ Pratique 15 a 20 minutos por dia</strong>
            Constância supera sessões longas e cansativas. Mantenha seu streak ativo.
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <strong className="text-slate-200 block mb-1">✓ Não pule direto para a solução</strong>
            Use as 3 dicas graduais. Forçar o raciocínio é o momento em que as sinapses são fixadas.
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <strong className="text-slate-200 block mb-1">✓ Leia a explicação mesmo quando acertar</strong>
            Descubra nuances de segurança (XSS, SQL Injection) e abordagens alternativas.
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <strong className="text-slate-200 block mb-1">✓ Exporte seu progresso regularmente</strong>
            Grave seu arquivo JSON de progresso para não perder seu histórico ao limpar cookies.
          </div>
        </div>
      </div>
    </div>
  );
};
