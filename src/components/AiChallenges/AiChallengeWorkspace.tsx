import React, { useState, useEffect, useRef } from 'react';
import { UserProgress, Exercise } from '../../types/exercise';
import {
  AiChallenge,
  AiChallengeEvaluation,
} from '../../types/aiChallenge';
import {
  recordAiChallengeAttempt,
  saveAiChallengeDraft,
} from '../../services/storage';
import { AiTutorModal } from '../AiTutorModal';

interface AiChallengeWorkspaceProps {
  challenge: AiChallenge;
  progress: UserProgress;
  onBackToHub: () => void;
  onProgressUpdated: (updated: UserProgress) => void;
}

export const AiChallengeWorkspace: React.FC<AiChallengeWorkspaceProps> = ({
  challenge,
  progress,
  onBackToHub,
  onProgressUpdated,
}) => {
  // Restore saved draft or starter code
  const existingAttempt = progress.aiChallenges?.[challenge.id];
  const [code, setCode] = useState<string>(
    existingAttempt?.userCode ?? challenge.starterCode
  );
  // XP da última avaliação: número na 1ª aprovação; 0 se já estava aprovado; null se reprovou.
  const [xpGained, setXpGained] = useState<number | null>(null);
  const [evaluation, setEvaluation] = useState<AiChallengeEvaluation | null>(
    existingAttempt?.evaluation ?? null
  );
  const [unlockedHintsCount, setUnlockedHintsCount] = useState<number>(
    existingAttempt?.unlockedHintsCount ?? 0
  );
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [hasRevealedSolution, setHasRevealedSolution] = useState<boolean>(false);
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [autoSavedNotice, setAutoSavedNotice] = useState<boolean>(false);

  // Synchronized scrolling for editor with line numbers
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Auto-save draft on changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (code !== existingAttempt?.userCode) {
        const updated = saveAiChallengeDraft(challenge, code);
        onProgressUpdated(updated);
        setAutoSavedNotice(true);
        setTimeout(() => setAutoSavedNotice(false), 2000);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [code, challenge, existingAttempt?.userCode, onProgressUpdated]);

  // Support Tab key indenting in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      setCode(newCode);
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
            start + 4;
        }
      });
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleEvaluate();
    }
  };

  // Line count for editor
  const lines = code.split('\n');
  const lineCount = Math.max(lines.length, 12);

  // Evaluate code via server endpoint
  const handleEvaluate = async () => {
    if (!code.trim()) {
      setEvalError('Por favor, escreva sua solução antes de submeter.');
      return;
    }

    setIsEvaluating(true);
    setEvalError(null);

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 20000); // 20s client timeout safeguard

    try {
      const response = await fetch('/api/gemini/evaluate-challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge,
          userCode: code,
        }),
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Erro de validação (HTTP ${response.status})`);
      }

      const evalData: AiChallengeEvaluation = await response.json();
      setEvaluation(evalData);

      // Record attempt and update streak in storage
      try {
        const wasPassed = existingAttempt?.passed ?? false;
        const updated = recordAiChallengeAttempt(
          challenge,
          code,
          evalData,
          unlockedHintsCount
        );
        setXpGained(evalData.passed ? (wasPassed ? 0 : (updated.aiChallenges?.[challenge.id]?.xpEarned ?? 0)) : null);
        onProgressUpdated(updated);
      } catch (storageErr) {
        console.warn('Aviso ao registrar progresso local:', storageErr);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error('Falha ao avaliar desafio:', err);
      if (err.name === 'AbortError') {
        setEvalError(
          'A avaliação excedeu o tempo limite. Verifique sua conexão e tente novamente.'
        );
      } else {
        setEvalError(
          err.message ||
            'Erro ao avaliar o código com o tutor sênior. Tente novamente.'
        );
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleResetCode = () => {
    if (
      window.confirm(
        'Deseja restaurar o código inicial? Suas alterações atuais serão substituídas.'
      )
    ) {
      setCode(challenge.starterCode);
    }
  };

  const handleUnlockHint = () => {
    if (unlockedHintsCount < challenge.hints.length) {
      const nextCount = unlockedHintsCount + 1;
      setUnlockedHintsCount(nextCount);
      const updated = saveAiChallengeDraft(challenge, code, nextCount);
      onProgressUpdated(updated);
    }
  };

  // Convert challenge to Exercise schema so AiTutorModal can provide line-by-line explanations and dialog
  const exerciseAdapter: Exercise = {
    id: challenge.id,
    title: challenge.title,
    summary: challenge.description.slice(0, 120),
    language: challenge.language,
    difficulty:
      challenge.difficultyLevel <= 2
        ? 'basico'
        : challenge.difficultyLevel <= 3
        ? 'intermediario'
        : 'avancado',
    topic: challenge.topic,
    type: 'codigo_livre',
    description: `${challenge.description}\n\nRequisitos Funcionais:\n${challenge.functionalRequirements
      .map(r => `• ${r}`)
      .join('\n')}`,
    realWorldContext: challenge.description,
    goal: 'Implementar a solução completa atendendo aos requisitos e casos de teste.',
    templateCode: challenge.starterCode,
    solutionCode: challenge.solutionCode,
    blanks: [],
    hints: challenge.hints,
    testCases: (challenge.testCases || []).map(tc => ({
      description: tc.description,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
    })),
    explanation: challenge.explanation,
  };

  const score = evaluation ? evaluation.score : 0;
  const isPassed = evaluation ? evaluation.passed : false;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Navigation Bar & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-subtle">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToHub}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-subtle bg-surface hover:bg-surface-hover text-primary text-xs font-semibold transition-colors cursor-pointer"
          >
            ← Voltar para Desafios
          </button>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-accent-from/10 border border-accent-from/30 text-accent">
              {challenge.language === 'php' ? '🐘 PHP' : '⚡ JavaScript'}
            </span>
            <span className="px-2 py-0.5 rounded text-xs bg-surface-hover text-primary font-mono">
              {challenge.topic}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Difficulty Indicators */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-subtle text-xs">
            <span className="text-muted">Nível {challenge.difficultyLevel}/5:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(d => (
                <span
                  key={d}
                  className={`w-2 h-2 rounded-full ${
                    d <= challenge.difficultyLevel
                      ? d <= 2
                        ? 'bg-success'
                        : d <= 3
                        ? 'bg-warning'
                        : 'bg-danger'
                      : 'bg-subtle'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* AI Tutor Button */}
          <button
            type="button"
            onClick={() => setIsTutorOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-from/20 hover:bg-accent-from/30 border border-accent-from/40 text-accent text-xs font-semibold transition-colors cursor-pointer"
            title="Abrir diálogo com o tutor IA, tirar dúvidas ou pedir explicação do código"
          >
            <span>💬</span>
            <span>Tutor IA</span>
          </button>
        </div>
      </div>

      {challenge.fallbackNotice && (
        <div className="rounded-xl border border-accent-from/30 bg-accent-from/10 px-4 py-3 flex items-center gap-3 text-xs text-accent">
          <span className="text-base">✨</span>
          <p>{challenge.fallbackNotice}</p>
        </div>
      )}

      {/* Main Workspace Grid (Left: Briefing & Requirements, Right: Editor & Evaluation) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Briefing, Requirements, Test Cases & Progressive Hints */}
        <div className="lg:col-span-5 space-y-6">
          {/* Challenge Description Card */}
          <div className="rounded-2xl border border-subtle bg-surface/80 p-5 sm:p-6 shadow-lg space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-accent uppercase tracking-wider">
                <span>🎯</span>
                <span>Desafio Técnico Sênior</span>
              </div>
              <h2 className="text-xl font-bold text-primary tracking-tight mt-1">
                {challenge.title}
              </h2>
            </div>

            <div className="text-sm text-primary leading-relaxed space-y-3">
              <p>{challenge.description}</p>
            </div>

            {/* Functional Requirements */}
            {challenge.functionalRequirements?.length > 0 && (
              <div className="pt-3 border-t border-subtle/80 space-y-2">
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-accent">📋</span> Requisitos Funcionais
                </h3>
                <ul className="space-y-1.5 text-xs text-primary">
                  {challenge.functionalRequirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-accent shrink-0 font-bold">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technical Constraints */}
            {challenge.technicalConstraints?.length > 0 && (
              <div className="pt-3 border-t border-subtle/80 space-y-2">
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-warning">⚠️</span> Restrições Técnicas
                </h3>
                <ul className="space-y-1.5 text-xs text-muted">
                  {challenge.technicalConstraints.map((tc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-warning shrink-0 font-bold">•</span>
                      <span>{tc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Usage Examples */}
            {challenge.usageExamples?.length > 0 && (
              <div className="pt-3 border-t border-subtle/80 space-y-2.5">
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <span className="text-success">💡</span> Exemplos de Uso
                </h3>
                <div className="space-y-2">
                  {challenge.usageExamples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-canvas/70 border border-subtle text-xs font-mono space-y-1"
                    >
                      <div className="text-muted">
                        <span className="text-accent">Entrada:</span> {ex.input}
                      </div>
                      <div className="text-success">
                        <span className="text-success">Saída:</span> {ex.output}
                      </div>
                      {ex.explanation && (
                        <div className="text-[11px] text-muted font-sans mt-1">
                          {ex.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Test Cases Preview */}
            {challenge.testCases?.length > 0 && (
              <div className="pt-3 border-t border-subtle/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <span className="text-syntax-variable">🧪</span> Casos de Teste ({challenge.testCases.length})
                  </h3>
                  <span className="text-[11px] text-muted">
                    Inclui edge cases
                  </span>
                </div>
                <div className="space-y-2">
                  {challenge.testCases.map((tc, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-canvas/50 border border-subtle/70 text-[11px] space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-primary">
                          {idx + 1}. {tc.description}
                        </span>
                        {tc.isEdgeCase && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-warning/10 text-warning border border-warning/20 font-mono">
                            Edge case
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-muted flex items-center gap-2">
                        <span>in: <code className="text-primary">{tc.input}</code></span>
                        <span>→</span>
                        <span>out: <code className="text-success">{tc.expectedOutput}</code></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Progressive Hints Section */}
          <div className="rounded-2xl border border-subtle bg-surface/80 p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span>🔑</span> Dicas Progressivas ({unlockedHintsCount} de {challenge.hints.length})
              </h3>
              {unlockedHintsCount < challenge.hints.length && (
                <button
                  type="button"
                  onClick={handleUnlockHint}
                  className="text-xs text-accent hover:text-accent font-semibold cursor-pointer"
                >
                  Liberar Dica {unlockedHintsCount + 1}
                </button>
              )}
            </div>

            {unlockedHintsCount === 0 ? (
              <p className="text-xs text-muted">
                Tente resolver por conta própria primeiro! Se travar, clique em &quot;Liberar Dica&quot; para desbloquear orientações graduais.
              </p>
            ) : (
              <div className="space-y-2">
                {challenge.hints.slice(0, unlockedHintsCount).map((hint, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-accent-from/10 border border-accent-from/20 text-xs text-accent space-y-1"
                  >
                    <span className="font-bold text-accent block text-[11px] uppercase tracking-wider">
                      Dica {i + 1}: {i === 0 ? 'Conceitual' : i === 1 ? 'Recurso da Linguagem' : 'Abordagem Detalhada'}
                    </span>
                    <p className="leading-relaxed">{hint}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor (Fixed 15 lines height on Desktop) & Evaluation */}
        <div className="lg:col-span-7 space-y-5">
          {/* Integrated Code Editor Card */}
          <div className="rounded-2xl border border-subtle bg-surface shadow-xl overflow-hidden flex flex-col">
            {/* Editor Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-canvas border-b border-subtle text-xs">
              <div className="flex items-center gap-2 font-mono text-muted">
                <span className="w-2.5 h-2.5 rounded-full bg-danger/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-warning/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-success/80 inline-block"></span>
                <span className="text-primary font-semibold ml-2">
                  {challenge.language === 'php' ? 'solucao.php' : 'solucao.js'}
                </span>
                {autoSavedNotice && (
                  <span className="text-[10px] text-success font-sans ml-2">
                    ✓ Rascunho salvo
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-[11px] text-muted font-mono">
                  Ctrl + Enter para avaliar
                </span>
                <button
                  type="button"
                  onClick={handleResetCode}
                  className="text-muted hover:text-primary transition-colors cursor-pointer"
                  title="Restaurar código inicial do desafio"
                >
                  Restaurar
                </button>
              </div>
            </div>

            {/* Code Textarea with Line Numbers and Fixed Desktop Height (15 lines = ~390px) */}
            <div className="relative flex bg-canvas text-primary font-mono text-xs leading-6 overflow-hidden h-[390px]">
              {/* Line numbers gutter */}
              <div
                ref={lineNumbersRef}
                className="w-12 py-3 pr-2 text-right text-muted/60 bg-canvas border-r border-subtle/80 select-none overflow-hidden"
              >
                {Array.from({ length: lineCount }).map((_, i) => (
                  <div key={i} className="h-6">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Textarea with Tab support and synchronized scroll */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={e => setCode(e.target.value)}
                onScroll={handleScroll}
                onKeyDown={handleKeyDown}
                placeholder={
                  challenge.language === 'php'
                    ? '<?php\n// Escreva sua função ou classe PHP aqui...\n'
                    : '// Escreva sua função JavaScript aqui...\n'
                }
                spellCheck={false}
                className="flex-1 py-3 px-4 bg-transparent text-primary font-mono text-xs leading-6 resize-none focus:outline-none overflow-auto whitespace-pre tab-4"
                style={{
                  tabSize: 4,
                }}
              />
            </div>

            {/* Action Bar */}
            <div className="p-4 bg-canvas/80 border-t border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsTutorOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-surface hover:bg-surface-hover border border-subtle text-primary text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>💡</span>
                  <span>Tutor IA / Explicar Código</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHasRevealedSolution(!hasRevealedSolution)}
                  className="px-3 py-2 rounded-xl bg-surface/60 hover:bg-surface-hover border border-subtle text-muted hover:text-primary text-xs transition-colors cursor-pointer"
                >
                  {hasRevealedSolution ? 'Ocultar Gabarito' : 'Ver Gabarito Sênior'}
                </button>
              </div>

              <button
                type="button"
                onClick={handleEvaluate}
                disabled={isEvaluating}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-accent-from hover:bg-accent-from text-primary text-xs font-bold shadow-md shadow-accent-from/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isEvaluating ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-primary"
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
                    <span>Avaliando solução com IA...</span>
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    <span>Verificar minha solução</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Solution Code Reveal (if toggled) */}
          {hasRevealedSolution && (
            <div className="rounded-2xl border border-accent-from/30 bg-accent-from/10 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                  <span>✨</span> Solução de Referência (Gabarito Sênior)
                </h4>
                <button
                  type="button"
                  onClick={() => setCode(challenge.solutionCode)}
                  className="text-xs text-accent hover:text-accent font-semibold cursor-pointer"
                >
                  Copiar para meu editor
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-canvas border border-subtle text-xs font-mono text-primary overflow-x-auto leading-5 max-h-[300px]">
                {challenge.solutionCode}
              </pre>
              {challenge.explanation && (
                <p className="text-xs text-muted leading-relaxed">
                  <span className="font-semibold text-primary">Explicação: </span>
                  {challenge.explanation}
                </p>
              )}
            </div>
          )}

          {/* Evaluation Error Banner */}
          {evalError && (
            <div className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-xs text-danger flex items-start gap-3">
              <span className="text-base">⚠️</span>
              <div>
                <p className="font-semibold text-danger">Não foi possível avaliar</p>
                <p>{evalError}</p>
              </div>
            </div>
          )}

          {/* Evaluation Results Card */}
          {evaluation && (
            <div className="rounded-2xl border border-subtle bg-surface/90 p-5 sm:p-6 shadow-xl space-y-5 animate-in fade-in duration-300">
              {/* Score & Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-subtle">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold shadow-inner ${
                      isPassed
                        ? 'bg-success/10 border-2 border-success/40 text-success'
                        : 'bg-warning/10 border-2 border-warning/40 text-warning'
                    }`}
                  >
                    <span className="text-lg leading-none">{score.toFixed(1)}</span>
                    <span className="text-[10px] text-muted font-normal">/10</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-primary">
                        {isPassed ? 'Solução Aprovada! 🎉' : 'Revisão Necessária'}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isPassed
                            ? 'bg-success/20 text-success border border-success/30'
                            : 'bg-warning/20 text-warning border border-warning/30'
                        }`}
                      >
                        {isPassed ? 'Aprovado' : 'Ajustes pendentes'}
                      </span>
                      {xpGained !== null && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            xpGained > 0 ? 'bg-gradient-accent text-white shadow-glow' : 'bg-surface-hover text-muted border border-subtle'
                          }`}
                        >
                          {xpGained > 0 ? '+' + xpGained + ' XP' : 'Já aprovado · sem XP extra'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-0.5">
                      {evaluation.testsPassedPercentage}% dos casos de teste passaram com sucesso.
                    </p>
                  </div>
                </div>

                {isPassed && (
                  <div className="px-3 py-1.5 rounded-xl bg-accent-from/10 border border-accent-from/30 text-accent text-xs font-semibold flex items-center gap-1.5">
                    <span>🔥</span>
                    <span>Ofensiva de estudos computada para hoje!</span>
                  </div>
                )}
              </div>

              {/* Senior Feedback Summary */}
              {evaluation.explanation && (
                <div className="text-xs text-primary bg-canvas/60 p-3.5 rounded-xl border border-subtle leading-relaxed">
                  <span className="font-semibold text-primary block mb-1">
                    Feedback do Desenvolvedor Sênior:
                  </span>
                  {evaluation.explanation}
                </div>
              )}

              {/* Requirements Checked */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Requirements Met */}
                <div className="space-y-2 p-3.5 rounded-xl bg-success/10 border border-success/20">
                  <h4 className="text-xs font-bold text-success flex items-center gap-1.5">
                    <span>✓</span> Requisitos Atendidos ({evaluation.requirementsMet?.length || 0})
                  </h4>
                  {evaluation.requirementsMet?.length > 0 ? (
                    <ul className="space-y-1 text-xs text-primary">
                      {evaluation.requirementsMet.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-success">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] text-muted">Nenhum requisito atendido ainda.</p>
                  )}
                </div>

                {/* Requirements Unmet */}
                <div className="space-y-2 p-3.5 rounded-xl bg-warning/10 border border-warning/20">
                  <h4 className="text-xs font-bold text-warning flex items-center gap-1.5">
                    <span>✗</span> Requisitos Pendentes ({evaluation.requirementsUnmet?.length || 0})
                  </h4>
                  {evaluation.requirementsUnmet?.length > 0 ? (
                    <ul className="space-y-1 text-xs text-primary">
                      {evaluation.requirementsUnmet.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-warning">✗</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] text-success">Todos os requisitos atendidos!</p>
                  )}
                </div>
              </div>

              {/* Syntax & Functional Errors */}
              {evaluation.syntaxAndErrors?.length > 0 && (
                <div className="space-y-2 p-3.5 rounded-xl bg-danger/10 border border-danger/30">
                  <h4 className="text-xs font-bold text-danger flex items-center gap-1.5">
                    <span>⚠️</span> Erros Encontrados (Correção Necessária)
                  </h4>
                  <ul className="space-y-1 text-xs text-danger">
                    {evaluation.syntaxAndErrors.map((err, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-danger font-bold">•</span>
                        <span>{err}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions & Improvements */}
              {evaluation.improvements?.length > 0 && (
                <div className="space-y-2 p-3.5 rounded-xl bg-accent-from/10 border border-accent-from/20">
                  <h4 className="text-xs font-bold text-accent flex items-center gap-1.5">
                    <span>✨</span> Sugestões de Boas Práticas (Não impedem aprovação)
                  </h4>
                  <ul className="space-y-1 text-xs text-accent">
                    {evaluation.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-accent font-bold">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Test Cases Results Detail */}
              {evaluation.testResults?.length > 0 && (
                <div className="space-y-2.5 pt-2 border-t border-subtle">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                    Execução dos Casos de Teste
                  </h4>
                  <div className="space-y-2">
                    {evaluation.testResults.map((tr, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl border text-xs font-mono space-y-1 ${
                          tr.passed
                            ? 'bg-success/10 border-success/20 text-primary'
                            : 'bg-danger/10 border-danger/20 text-primary'
                        }`}
                      >
                        <div className="flex items-center justify-between font-sans">
                          <span className="font-semibold text-primary">
                            {tr.description}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tr.passed
                                ? 'bg-success/20 text-success'
                                : 'bg-danger/20 text-danger'
                            }`}
                          >
                            {tr.passed ? 'PASSED' : 'FAILED'}
                          </span>
                        </div>
                        <div className="text-muted">
                          Entrada: <code className="text-primary">{tr.input}</code>
                        </div>
                        <div className="flex items-center gap-4 text-[11px]">
                          <div>
                            Esperado: <span className="text-success">{tr.expected}</span>
                          </div>
                          <div>
                            Obtido: <span className={tr.passed ? 'text-success' : 'text-danger'}>{tr.actual}</span>
                          </div>
                        </div>
                        {tr.error && (
                          <div className="text-[11px] text-danger font-sans mt-1">
                            Erro: {tr.error}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Environment Transparency Note */}
              {evaluation.environmentNote && (
                <div className="p-3 rounded-xl bg-canvas border border-subtle/80 text-[11px] text-muted leading-relaxed flex items-start gap-2">
                  <span>ℹ️</span>
                  <span>{evaluation.environmentNote}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Tutor Modal */}
      <AiTutorModal
        isOpen={isTutorOpen}
        onClose={() => setIsTutorOpen(false)}
        exercise={exerciseAdapter}
        currentAssembledCode={code}
        hasSolutionRevealed={hasRevealedSolution}
      />
    </div>
  );
};
