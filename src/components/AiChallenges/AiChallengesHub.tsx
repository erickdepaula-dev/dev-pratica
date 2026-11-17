import React, { useState } from 'react';
import { Language, UserProgress } from '../../types/exercise';
import {
  AiChallenge,
  AiChallengeDifficulty,
} from '../../types/aiChallenge';

interface AiChallengesHubProps {
  progress: UserProgress;
  onSelectChallenge: (challenge: AiChallenge) => void;
  onProgressUpdated: (updated: UserProgress) => void;
}

const DIFFICULTY_CONFIG: Record<
  AiChallengeDifficulty,
  { label: string; level: 1 | 2 | 3 | 4 | 5; color: string; desc: string }
> = {
  muito_facil: {
    label: 'Muito fácil',
    level: 1,
    color: 'emerald',
    desc: 'Fundamentos, sintaxe direta e lógica inicial',
  },
  facil: {
    label: 'Fácil',
    level: 2,
    color: 'teal',
    desc: 'Problemas de 1 ou 2 regras funcionais simples',
  },
  intermediario: {
    label: 'Intermediário',
    level: 3,
    color: 'amber',
    desc: 'Múltiplos requisitos, manipulação de dados e coleções',
  },
  dificil: {
    label: 'Difícil',
    level: 4,
    color: 'orange',
    desc: 'Regras de negócio densas, exceções e validações rigorosas',
  },
  muito_dificil: {
    label: 'Muito difícil',
    level: 5,
    color: 'rose',
    desc: 'Arquitetura, múltiplos edge-cases e lógica avançada',
  },
};

const PHP_TOPIC_SUGGESTIONS = [
  'Arrays Associativos & Filtros',
  'Cálculo de Desconto & Juros',
  'Validação de Formulários & Regras',
  'PDO & Consultas Preparadas',
  'Tratamento de Exceções & Try/Catch',
  'POO: Classes & Encapsulamento',
  'Manipulação de Strings & Formatação',
  'Processamento de Pedidos de Venda',
  'CRUD & Camada de Serviço',
  'Identificação de Duplicidades em Dados',
];

const JS_TOPIC_SUGGESTIONS = [
  'Métodos de Array (map, filter, reduce)',
  'Objetos & Desestruturação',
  'Validação de Dados & Schemas',
  'Cálculo de Carrinho de Compras',
  'Promises & Async/Await',
  'Lógica de Negócios & Algoritmos',
  'Formatação de Datas & Moedas',
];

export const AiChallengesHub: React.FC<AiChallengesHubProps> = ({
  progress,
  onSelectChallenge,
}) => {
  const [language, setLanguage] = useState<Language>(
    progress.selectedLanguage || 'php'
  );
  const [topic, setTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<AiChallengeDifficulty>('intermediario');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // List past challenges from progress
  const pastAttempts = Object.values(progress.aiChallenges || {}).sort((a, b) => {
    return new Date(b.lastAttemptAt).getTime() - new Date(a.lastAttemptAt).getTime();
  });

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/gemini/generate-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          topic: topic.trim() || undefined,
          difficulty,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Erro HTTP ${response.status}`);
      }

      const challenge: AiChallenge = await response.json();
      onSelectChallenge(challenge);
    } catch (err: any) {
      console.error('Falha ao gerar desafio IA:', err);
      setErrorMsg(
        err.message ||
          'Não foi possível gerar o desafio no momento. Verifique sua conexão e tente novamente.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <span>✨</span>
            <span>Motor de Mentoria com IA Sênior</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Desafios de Programação com IA
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Exercícios práticos gerados sob medida simulando demandas reais do mercado de trabalho.
            Enunciados com requisitos funcionais, restrições técnicas, casos de teste com edge cases,
            dicas graduais e avaliação inteligente com nota de 0 a 10.
          </p>
        </div>
      </div>

      {/* Generator Form */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Configurar Novo Desafio
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Defina a linguagem, tema opcional e nível de dificuldade desejado
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-4 text-xs text-rose-300 flex items-start gap-3">
            <span className="text-base">⚠️</span>
            <div className="space-y-1">
              <p className="font-semibold text-rose-200">Falha na geração do desafio</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Linguagem do Desafio
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLanguage('php')}
                className={`relative flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  language === 'php'
                    ? 'border-indigo-500 bg-indigo-950/40 text-white shadow-md'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🐘</span>
                  <div className="text-left">
                    <div className="text-sm font-bold flex items-center gap-1.5">
                      PHP
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                        Principal
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">Recomendado para backend</div>
                  </div>
                </div>
                {language === 'php' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-400"></div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setLanguage('javascript')}
                className={`relative flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  language === 'javascript'
                    ? 'border-amber-500 bg-amber-950/30 text-white shadow-md'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <div className="text-left">
                    <div className="text-sm font-bold">JavaScript</div>
                    <div className="text-[11px] text-slate-400">Trilha secundária</div>
                  </div>
                </div>
                {language === 'javascript' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                )}
              </button>
            </div>
          </div>

          {/* Subject / Topic (Optional) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Tema ou Assunto <span className="text-slate-500 font-normal lowercase">(opcional)</span>
              </label>
              {topic && (
                <button
                  type="button"
                  onClick={() => setTopic('')}
                  className="text-[11px] text-slate-400 hover:text-white cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder={
                language === 'php'
                  ? 'Ex: Arrays associativos, Tratamento de exceções, PDO...'
                  : 'Ex: Métodos de array, Objetos, Regras de carrinho...'
              }
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
            <p className="text-[11px] text-slate-500">
              💡 Deixe vazio para a IA escolher automaticamente um assunto adequado ao nível.
            </p>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Sugestões rápidas de temas ({language === 'php' ? 'PHP' : 'JavaScript'}):
          </span>
          <div className="flex flex-wrap gap-2 pt-1">
            {(language === 'php' ? PHP_TOPIC_SUGGESTIONS : JS_TOPIC_SUGGESTIONS).map(sug => (
              <button
                key={sug}
                type="button"
                onClick={() => setTopic(sug)}
                className={`px-2.5 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                  topic === sug
                    ? 'border-indigo-500 bg-indigo-500/20 text-indigo-200 font-semibold'
                    : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                + {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection with 5 Visual Levels */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Nível de Dificuldade (5 Níveis com Indicador Visual)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {(
              Object.entries(DIFFICULTY_CONFIG) as [
                AiChallengeDifficulty,
                (typeof DIFFICULTY_CONFIG)[AiChallengeDifficulty]
              ][]
            ).map(([diffKey, config]) => {
              const isSelected = difficulty === diffKey;
              return (
                <button
                  key={diffKey}
                  type="button"
                  onClick={() => setDifficulty(diffKey)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/40 ring-1 ring-indigo-500 text-white shadow-md'
                      : 'border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{config.label}</span>
                    {/* Visual Dots/Bars */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(dot => (
                        <span
                          key={dot}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            dot <= config.level
                              ? dot === 1
                                ? 'bg-emerald-400'
                                : dot === 2
                                ? 'bg-teal-400'
                                : dot === 3
                                ? 'bg-amber-400'
                                : dot === 4
                                ? 'bg-orange-400'
                                : 'bg-rose-500'
                              : 'bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {config.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Cada exercício inclui requisitos técnicos, casos de teste com edge cases e dicas progressivas.
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span>A IA está formulando o desafio técnico...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Gerar exercício com IA</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* History of AI Challenges */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Meus Desafios de IA</h3>
            <p className="text-xs text-slate-400">
              Desafios gerados anteriormente, códigos salvos e avaliações do sênior
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
            {pastAttempts.length} {pastAttempts.length === 1 ? 'desafio' : 'desafios'}
          </span>
        </div>

        {pastAttempts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center bg-slate-900/30">
            <span className="text-3xl">🎯</span>
            <h4 className="text-sm font-semibold text-white mt-2">Nenhum desafio de IA gerado ainda</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Configure os parâmetros acima e clique em &quot;Gerar exercício com IA&quot; para iniciar seu primeiro problema prático de programação.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastAttempts.map(attempt => {
              const ch = attempt.challenge;
              const hasEvaluation = !!attempt.evaluation;
              const passed = attempt.passed;
              const diffConfig = DIFFICULTY_CONFIG[ch.difficulty] || DIFFICULTY_CONFIG.intermediario;

              return (
                <div
                  key={ch.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-800 text-slate-300">
                        {ch.language === 'php' ? '🐘 PHP' : '⚡ JavaScript'}
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(d => (
                          <span
                            key={d}
                            className={`w-1.5 h-1.5 rounded-full ${
                              d <= (ch.difficultyLevel || diffConfig.level)
                                ? 'bg-indigo-400'
                                : 'bg-slate-700'
                            }`}
                          />
                        ))}
                        <span className="text-[10px] text-slate-400 ml-1">
                          {diffConfig.label}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {ch.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {ch.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                      <span>🏷️ {ch.topic}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      {hasEvaluation ? (
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              passed
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            Nota {attempt.score.toFixed(1)}/10
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {passed ? 'Aprovado' : 'Em revisão'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500">
                          Rascunho salvo ({attempt.attemptsCount || 0} envios)
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectChallenge(ch)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-200 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Abrir Desafio →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
