import React, { useState } from 'react';
import { AI_ENABLED, showAiDisabled } from '../../config/ai';
import { UserProgress } from '../../types/exercise';
import {
  AiChallenge,
  AiChallengeDifficulty,
  AiChallengeLanguage,
  toAiChallengeLanguage,
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
  const [language, setLanguage] = useState<AiChallengeLanguage>(() =>
    toAiChallengeLanguage(progress.selectedLanguage)
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
    if (!AI_ENABLED) {
      showAiDisabled();
      return;
    }
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
      <div className="relative overflow-hidden rounded-2xl border border-accent-from/20 bg-surface bg-[radial-gradient(ellipse_at_top_left,color-mix(in_srgb,var(--accent-from)_30%,transparent),transparent_65%)] p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-from/10 border border-accent-from/30 text-accent text-xs font-semibold">
            <span>✨</span>
            <span>Motor de Mentoria com IA Sênior</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            Desafios de Programação com IA
          </h1>
          <p className="text-primary text-sm sm:text-base leading-relaxed">
            Exercícios práticos gerados sob medida simulando demandas reais do mercado de trabalho.
            Enunciados com requisitos funcionais, restrições técnicas, casos de teste com edge cases,
            dicas graduais e avaliação inteligente com nota de 0 a 10.
          </p>
        </div>
      </div>

      {/* Generator Form */}
      <div className="rounded-2xl border border-subtle bg-surface/70 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-subtle pb-4">
          <div>
            <h2 className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-from"></span>
              Configurar Novo Desafio
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Defina a linguagem, tema opcional e nível de dificuldade desejado
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-xs text-danger flex items-start gap-3">
            <span className="text-base">⚠️</span>
            <div className="space-y-1">
              <p className="font-semibold text-danger">Falha na geração do desafio</p>
              <p>{errorMsg}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-primary uppercase tracking-wider">
              Linguagem do Desafio
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLanguage('php')}
                className={`relative flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  language === 'php'
                    ? 'border-accent-from bg-accent-from/10 text-primary shadow-md'
                    : 'border-subtle bg-surface/60 text-muted hover:border-subtle hover:text-primary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🐘</span>
                  <div className="text-left">
                    <div className="text-sm font-bold flex items-center gap-1.5">
                      PHP
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-accent-from/20 text-accent border border-accent-from/30 font-semibold">
                        Principal
                      </span>
                    </div>
                    <div className="text-[11px] text-muted">Recomendado para backend</div>
                  </div>
                </div>
                {language === 'php' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-from"></div>
                )}
              </button>

              <button
                type="button"
                onClick={() => setLanguage('javascript')}
                className={`relative flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  language === 'javascript'
                    ? 'border-warning bg-warning/10 text-primary shadow-md'
                    : 'border-subtle bg-surface/60 text-muted hover:border-subtle hover:text-primary'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚡</span>
                  <div className="text-left">
                    <div className="text-sm font-bold">JavaScript</div>
                    <div className="text-[11px] text-muted">Trilha secundária</div>
                  </div>
                </div>
                {language === 'javascript' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-warning"></div>
                )}
              </button>
            </div>
          </div>

          {/* Subject / Topic (Optional) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-primary uppercase tracking-wider">
                Tema ou Assunto <span className="text-muted font-normal lowercase">(opcional)</span>
              </label>
              {topic && (
                <button
                  type="button"
                  onClick={() => setTopic('')}
                  className="text-[11px] text-muted hover:text-primary cursor-pointer"
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
              className="w-full rounded-xl border border-subtle bg-canvas px-4 py-3 text-sm text-primary placeholder:text-muted/70 focus:border-accent-from focus:outline-none focus:ring-1 focus:ring-accent-from transition-colors"
            />
            <p className="text-[11px] text-muted">
              💡 Deixe vazio para a IA escolher automaticamente um assunto adequado ao nível.
            </p>
          </div>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
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
                    ? 'border-accent-from bg-accent-from/20 text-accent font-semibold'
                    : 'border-subtle bg-canvas/60 text-muted hover:border-subtle hover:text-primary'
                }`}
              >
                + {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selection with 5 Visual Levels */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-semibold text-primary uppercase tracking-wider">
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
                      ? 'border-accent-from bg-accent-from/10 ring-1 ring-accent-from text-primary shadow-md'
                      : 'border-subtle bg-canvas/70 text-muted hover:border-subtle hover:text-primary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">{config.label}</span>
                    {/* Visual Dots/Bars */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(dot => (
                        <span
                          key={dot}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            dot <= config.level
                              ? dot === 1
                                ? 'bg-success'
                                : dot === 2
                                ? 'bg-[color-mix(in_srgb,var(--success)_55%,var(--warning))]'
                                : dot === 3
                                ? 'bg-warning'
                                : dot === 4
                                ? 'bg-streak-from'
                                : 'bg-danger'
                              : 'bg-subtle'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-muted leading-tight">
                    {config.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-subtle">
          <div className="text-xs text-muted">
            Cada exercício inclui requisitos técnicos, casos de teste com edge cases e dicas progressivas.
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-from to-accent-to hover:from-accent-from hover:to-accent-to text-primary font-semibold text-sm shadow-lg shadow-accent-from/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isGenerating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary"
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
            <h3 className="text-lg font-bold text-primary">Meus Desafios de IA</h3>
            <p className="text-xs text-muted">
              Desafios gerados anteriormente, códigos salvos e avaliações do sênior
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-surface-hover text-primary font-mono">
            {pastAttempts.length} {pastAttempts.length === 1 ? 'desafio' : 'desafios'}
          </span>
        </div>

        {pastAttempts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-subtle p-8 text-center bg-surface/30">
            <span className="text-3xl">🎯</span>
            <h4 className="text-sm font-semibold text-primary mt-2">Nenhum desafio de IA gerado ainda</h4>
            <p className="text-xs text-muted max-w-md mx-auto mt-1">
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
                  className="rounded-xl border border-subtle bg-surface/80 p-5 flex flex-col justify-between hover:border-subtle transition-all shadow-md group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-surface-hover text-primary">
                        {ch.language === 'php' ? '🐘 PHP' : '⚡ JavaScript'}
                      </span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(d => (
                          <span
                            key={d}
                            className={`w-1.5 h-1.5 rounded-full ${
                              d <= (ch.difficultyLevel || diffConfig.level)
                                ? 'bg-accent-from'
                                : 'bg-subtle'
                            }`}
                          />
                        ))}
                        <span className="text-[10px] text-muted ml-1">
                          {diffConfig.label}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-primary group-hover:text-accent transition-colors line-clamp-1">
                        {ch.title}
                      </h4>
                      <p className="text-xs text-muted line-clamp-2 mt-1">
                        {ch.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-muted font-mono">
                      <span>🏷️ {ch.topic}</span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-subtle/80 flex items-center justify-between">
                    <div>
                      {hasEvaluation ? (
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              passed
                                ? 'bg-success/10 text-success border border-success/30'
                                : 'bg-warning/10 text-warning border border-warning/30'
                            }`}
                          >
                            Nota {attempt.score.toFixed(1)}/10
                          </span>
                          <span className="text-[10px] text-muted">
                            {passed ? 'Aprovado' : 'Em revisão'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-muted">
                          Rascunho salvo ({attempt.attemptsCount || 0} envios)
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectChallenge(ch)}
                      className="px-3 py-1.5 rounded-lg bg-accent-from/20 hover:bg-accent-from/30 border border-accent-from/30 text-accent text-xs font-semibold transition-colors cursor-pointer"
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
