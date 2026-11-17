import React from 'react';
import { Language } from '../types/exercise';

interface StudyGuideProps {
  onStartTrack: (lang: Language) => void;
}

export const StudyGuide: React.FC<StudyGuideProps> = ({ onStartTrack }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 pb-4 border-b border-subtle">
        <div className="flex items-center gap-2 text-xs text-accent font-medium">
          <span>Metodologia & Boas Práticas</span>
          <span aria-hidden="true">·</span>
          <span>Aprender na Prática</span>
        </div>
        <h1 className="text-2xl font-extrabold text-primary tracking-tight">
          Guia de Estudos & Roteiro de Domínio
        </h1>
        <p className="text-sm text-muted leading-relaxed">
          Como aproveitar a plataforma ao máximo para consolidar sua lógica e se preparar para desafios reais do mercado.
        </p>
      </div>

      {/* Methodology Section */}
      <div className="rounded-xl border border-subtle bg-surface/40 p-6 space-y-4">
        <h2 className="text-base font-bold text-primary flex items-center gap-2">
          <span>🧠</span>
          <span>Por que o método com lacunas (Cloze Testing) funciona tão bem?</span>
        </h2>
        <div className="text-xs text-primary space-y-3 leading-relaxed">
          <p>
            Copiar e colar soluções prontas cria uma falsa sensação de aprendizado conhecida como "ilusão de competência". Quando você é desafiado a preencher lacunas em código real estruturado:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-muted">
            <li><strong className="text-primary">Recuperação Ativa (Active Recall):</strong> Seu cérebro precisa buscar na memória a sintaxe exata e a função nativa correta.</li>
            <li><strong className="text-primary">Reconhecimento de Padrões:</strong> Você aprende a ler código com indentação e contexto real em vez de exercícios isolados de 1 linha.</li>
            <li><strong className="text-primary">Feedback Imediato:</strong> Ao testar instantaneamente, você descobre se cometeu um erro de digitação, esquecimento de argumento ou falha lógica.</li>
          </ul>
        </div>
      </div>

      {/* Roteiros das trilhas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* PHP Roadmap */}
        <div className="rounded-xl border border-accent-from/30 bg-surface/50 p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐘</span>
              <div>
                <h3 className="font-bold text-primary text-base">Trilha de Domínio PHP</h3>
                <span className="text-xs text-accent">Prioridade da sua carreira</span>
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              O PHP moderno (PHP 8+) é rápido, fortemente tipado e robusto. O roteiro profissional compreende:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-canvas border border-subtle/80">
                <span className="font-semibold text-primary block mb-0.5">1. Fundamentos & Tipagem</span>
                <span className="text-muted">Operadores, strict_types, loops foreach e o operador null coalescing (??).</span>
              </div>

              <div className="p-2.5 rounded bg-canvas border border-subtle/80">
                <span className="font-semibold text-primary block mb-0.5">2. Web & Banco de Dados</span>
                <span className="text-muted">Validação com filter_var, sessões, PDO com prepared statements contra SQL Injection.</span>
              </div>

              <div className="p-2.5 rounded bg-canvas border border-subtle/80">
                <span className="font-semibold text-primary block mb-0.5">3. Arquitetura & SOLID</span>
                <span className="text-muted">Classes com atributos privados, Interfaces para Injeção de Dependência, Traits e Repositories.</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onStartTrack('php')}
            className="w-full mt-4 py-2 px-4 rounded-lg bg-accent-from hover:bg-accent-from text-primary text-xs font-semibold shadow-sm transition-colors text-center"
          >
            Focar na Trilha PHP →
          </button>
        </div>

        {/* JS Roadmap */}
        <div className="rounded-xl border border-warning/30 bg-surface/50 p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <div>
                <h3 className="font-bold text-primary text-base">Trilha de JavaScript</h3>
                <span className="text-xs text-warning">Linguagem secundária</span>
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              JavaScript moderno (ES6+) é a espinha dorsal de qualquer frontend interativo e APIs Node.js:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-canvas border border-subtle/80">
                <span className="font-semibold text-primary block mb-0.5">1. ES6+ Essencial</span>
                <span className="text-muted">Arrow functions, desestruturação de objetos, template literals e valores padrão.</span>
              </div>

              <div className="p-2.5 rounded bg-canvas border border-subtle/80">
                <span className="font-semibold text-primary block mb-0.5">2. Métodos de Array & Imutabilidade</span>
                <span className="text-muted">Pipelines de transformação com filter, map e reduce sem alterar os dados originais.</span>
              </div>

              <div className="p-2.5 rounded bg-canvas border border-subtle/80">
                <span className="font-semibold text-primary block mb-0.5">3. Assincronismo & Performance</span>
                <span className="text-muted">Promises, Async / Await, fetch com validação e padrão utilitário de debounce.</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onStartTrack('javascript')}
            className="w-full mt-4 py-2 px-4 rounded-lg bg-warning hover:bg-warning text-primary text-xs font-semibold shadow-sm transition-colors text-center"
          >
            Explorar Trilha JavaScript →
          </button>
        </div>

        {/* Roteiro TypeScript */}
        <div className="rounded-xl border border-typescript/40 bg-surface/50 p-6 space-y-4 flex flex-col justify-between md:col-span-2 lg:col-span-1">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">🔷</span>
              <div>
                <h3 className="font-bold text-primary text-base">Trilha de TypeScript</h3>
                <span className="text-xs text-typescript-text">O sistema de tipos como ferramenta</span>
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              TypeScript é JavaScript com um compilador que confere seus tipos antes de o código rodar. Aqui o código é
              compilado de verdade (modo strict), e o erro de tipo é o protagonista:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded bg-canvas border border-subtle/80">
                <span className="font-semibold text-primary block mb-0.5">1. Tipos que Documentam</span>
                <span className="text-muted">Anotações, inferência, interfaces, uniões de literais, tuplas e funções tipadas.</span>
              </div>

              <div className="p-2.5 rounded bg-canvas border border-subtle/80">
                <span className="font-semibold text-primary block mb-0.5">2. Narrowing & Reuso</span>
                <span className="text-muted">unknown em vez de any, type guards, generics e utility types (Partial, Pick, Omit, Record).</span>
              </div>

              <div className="p-2.5 rounded bg-canvas border border-subtle/80">
                <span className="font-semibold text-primary block mb-0.5">3. Tipos que Modelam o Domínio</span>
                <span className="text-muted">Discriminated unions, exaustividade com never, mapped e template literal types, satisfies.</span>
              </div>

              <div className="p-2.5 rounded bg-canvas border border-subtle/80">
                <span className="font-semibold text-primary block mb-0.5">Treino exclusivo: Erro de Tipo</span>
                <span className="text-muted">Leia trechos que não compilam e aponte a linha e o motivo — como o compilador faria.</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onStartTrack('typescript')}
            className="w-full mt-4 py-2 px-4 rounded-lg bg-typescript hover:brightness-110 text-white text-xs font-semibold shadow-sm transition-[filter] text-center"
          >
            Explorar Trilha TypeScript →
          </button>
        </div>
      </div>

      {/* Developer Checklist */}
      <div className="rounded-xl border border-subtle bg-surface/30 p-6 space-y-3">
        <h3 className="text-sm font-bold text-primary">Checklist de Hábitos para o Dia a Dia</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted">
          <div className="p-3 rounded-lg bg-canvas border border-subtle">
            <strong className="text-primary block mb-1">✓ Pratique 15 a 20 minutos por dia</strong>
            Constância supera sessões longas e cansativas. Mantenha seu streak ativo.
          </div>
          <div className="p-3 rounded-lg bg-canvas border border-subtle">
            <strong className="text-primary block mb-1">✓ Não pule direto para a solução</strong>
            Use as 3 dicas graduais. Forçar o raciocínio é o momento em que as sinapses são fixadas.
          </div>
          <div className="p-3 rounded-lg bg-canvas border border-subtle">
            <strong className="text-primary block mb-1">✓ Leia a explicação mesmo quando acertar</strong>
            Descubra nuances de segurança (XSS, SQL Injection) e abordagens alternativas.
          </div>
          <div className="p-3 rounded-lg bg-canvas border border-subtle">
            <strong className="text-primary block mb-1">✓ Exporte seu progresso regularmente</strong>
            Grave seu arquivo JSON de progresso para não perder seu histórico ao limpar cookies.
          </div>
        </div>
      </div>
    </div>
  );
};
