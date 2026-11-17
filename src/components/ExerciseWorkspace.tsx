import React, { useState, useEffect } from 'react';
import { Exercise, UserProgress } from '../types/exercise';
import { FillInBlanksEditor } from './FillInBlanksEditor';
import { FreeCodeEditor } from './FreeCodeEditor';
import { PredictOutputViewer } from './PredictOutputViewer';
import {
  evaluateBlanks,
  evaluateJavaScriptFreeCode,
  evaluatePhpFreeCode,
  evaluateOutputPrediction,
  evaluateBugFix,
  evaluatePracticalChallenge,
  EvaluationResult,
} from '../services/evaluator';
import { recordExerciseAttempt } from '../services/storage';
import { requestGeminiContextualHint } from '../services/aiHint';
import { AiTutorModal } from './AiTutorModal';

interface ExerciseWorkspaceProps {
  exercise: Exercise;
  progress: UserProgress;
  onBackToList: () => void;
  onNavigateToExercise: (id: string) => void;
  allExercisesInTrack: Exercise[];
  onProgressUpdated: (newProgress: UserProgress) => void;
}

export const ExerciseWorkspace: React.FC<ExerciseWorkspaceProps> = ({
  exercise,
  progress,
  onBackToList,
  onNavigateToExercise,
  allExercisesInTrack,
  onProgressUpdated,
}) => {
  const currentAttempt = progress.attempts[exercise.id];
  const isAlreadyCompleted = progress.completedIds.includes(exercise.id);

  // Blanks state
  const [userBlanks, setUserBlanks] = useState<Record<string, string>>(() => {
    return currentAttempt?.userBlanks || {};
  });

  // Prediction state (for prever_saida)
  const [userPrediction, setUserPrediction] = useState<string>(() => {
    return currentAttempt?.outputPrediction || '';
  });

  // Free code / bug fix state
  const [userCode, setUserCode] = useState<string>(() => {
    if (currentAttempt?.userCode) return currentAttempt.userCode;
    if (exercise.type === 'corrigir_erros' && exercise.initialBuggyCode) {
      return exercise.initialBuggyCode;
    }
    return exercise.templateCode;
  });

  // Evaluation state
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [hasAttempted, setHasAttempted] = useState<boolean>(false);
  const [hintsUnlockedCount, setHintsUnlockedCount] = useState<number>(() => {
    return currentAttempt?.hintsUsed || 0;
  });
  const [showSolution, setShowSolution] = useState<boolean>(() => {
    return currentAttempt?.revealedSolution || isAlreadyCompleted;
  });
  const [showConfirmSolution, setShowConfirmSolution] = useState(false);
  const [activeTab, setActiveTab] = useState<'instrucoes' | 'po_brief' | 'requisitos' | 'dicas' | 'solucao'>('instrucoes');

  // Interactive Acceptance Criteria checklist for DEV projects
  const [checkedCriteria, setCheckedCriteria] = useState<string[]>(() => {
    return currentAttempt?.checklistDone || [];
  });

  // Gemini contextual hint state
  const [aiHintLoading, setAiHintLoading] = useState<boolean>(false);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [aiHintError, setAiHintError] = useState<string | null>(null);
  const [showAiHintBanner, setShowAiHintBanner] = useState<boolean>(false);
  const [showAiTutorModal, setShowAiTutorModal] = useState<boolean>(false);
  const [sqlCopied, setSqlCopied] = useState<boolean>(false);

  // Reconstruct current assembled code for Tutor analysis
  const assembledCode = React.useMemo(() => {
    if (exercise.type === 'prever_saida') {
      return exercise.codeToPredict || exercise.templateCode;
    }
    if (exercise.type !== 'lacunas') {
      return userCode;
    }
    let code = exercise.templateCode;
    if (exercise.blanks) {
      exercise.blanks.forEach(b => {
        const val = userBlanks[b.id];
        code = code.replace(
          new RegExp(`\\{\\{${b.id}\\}\\}`, 'g'),
          val && val.trim() ? val : `/* lacuna "${b.label}" pendente */`
        );
      });
    }
    return code;
  }, [exercise, userCode, userBlanks]);

  // Reset local state when switching exercises
  useEffect(() => {
    const attempt = progress.attempts[exercise.id];
    const completed = progress.completedIds.includes(exercise.id);
    setUserBlanks(attempt?.userBlanks || {});
    setUserPrediction(attempt?.outputPrediction || '');
    setUserCode(
      attempt?.userCode ||
      (exercise.type === 'corrigir_erros' && exercise.initialBuggyCode ? exercise.initialBuggyCode : exercise.templateCode)
    );
    setEvaluationResult(null);
    setHasAttempted(false);
    setHintsUnlockedCount(attempt?.hintsUsed || 0);
    setShowSolution(attempt?.revealedSolution || completed);
    setShowConfirmSolution(false);
    if (exercise.difficulty === 'dev') {
      setActiveTab('po_brief');
    } else if (exercise.practicalRequirements && exercise.practicalRequirements.length > 0) {
      setActiveTab('requisitos');
    } else {
      setActiveTab('instrucoes');
    }
    setCheckedCriteria(attempt?.checklistDone || []);
    setAiHint(null);
    setAiHintError(null);
    setAiHintLoading(false);
    setShowAiHintBanner(false);
  }, [exercise.id]);

  // Navigation indices
  const currentIndex = allExercisesInTrack.findIndex(e => e.id === exercise.id);
  const prevExercise = currentIndex > 0 ? allExercisesInTrack[currentIndex - 1] : null;
  const nextExercise = currentIndex < allExercisesInTrack.length - 1 ? allExercisesInTrack[currentIndex + 1] : null;

  // Change single blank value
  const handleChangeBlank = (blankId: string, val: string) => {
    setUserBlanks(prev => ({ ...prev, [blankId]: val }));
  };

  // Toggle Acceptance Criterion in DEV project
  const handleToggleCriterion = (criterionId: string) => {
    const updated = checkedCriteria.includes(criterionId)
      ? checkedCriteria.filter(id => id !== criterionId)
      : [...checkedCriteria, criterionId];

    setCheckedCriteria(updated);

    const saved = recordExerciseAttempt(exercise.id, isAlreadyCompleted, {
      userBlanks: exercise.type === 'lacunas' ? userBlanks : undefined,
      userCode: exercise.type !== 'lacunas' && exercise.type !== 'prever_saida' ? userCode : undefined,
      outputPrediction: exercise.type === 'prever_saida' ? userPrediction : undefined,
      hintsUsed: hintsUnlockedCount,
      revealedSolution: showSolution,
    });
    if (saved.attempts[exercise.id]) {
      saved.attempts[exercise.id].checklistDone = updated;
    }
    onProgressUpdated(saved);
  };

  // Request contextual AI hint from Gemini based on user's current code
  const handleRequestAiHint = async () => {
    setAiHintLoading(true);
    setAiHintError(null);
    setShowAiHintBanner(true);

    try {
      const res = await requestGeminiContextualHint({
        exercise,
        userBlanks: exercise.type === 'lacunas' ? userBlanks : undefined,
        currentCode: assembledCode,
      });

      setAiHintLoading(false);
      if (res.hint) {
        setAiHint(res.hint);
      } else {
        setAiHintError(res.error || 'Não foi possível gerar a dica no momento.');
      }
    } catch (err: any) {
      setAiHintLoading(false);
      setAiHintError(err?.message || 'Erro ao conectar ao assistente de IA.');
    }
  };

  // Submit & evaluate answer
  const handleVerify = async () => {
    setHasAttempted(true);

    let result: EvaluationResult;

    if (exercise.type === 'lacunas') {
      result = evaluateBlanks(exercise, userBlanks);
    } else if (exercise.type === 'prever_saida') {
      result = evaluateOutputPrediction(exercise, userPrediction);
    } else if (exercise.type === 'corrigir_erros') {
      result = await evaluateBugFix(exercise, userCode);
    } else if (exercise.type === 'desafio_pratico') {
      result = await evaluatePracticalChallenge(exercise, userCode);
    } else {
      if (exercise.language === 'javascript') {
        result = await evaluateJavaScriptFreeCode(exercise, userCode);
      } else {
        result = evaluatePhpFreeCode(exercise, userCode);
      }
    }

    setEvaluationResult(result);

    // Persist attempt and update streak if passed
    const updated = recordExerciseAttempt(exercise.id, result.passed, {
      userBlanks: exercise.type === 'lacunas' ? userBlanks : undefined,
      userCode: exercise.type !== 'lacunas' && exercise.type !== 'prever_saida' ? userCode : undefined,
      outputPrediction: exercise.type === 'prever_saida' ? userPrediction : undefined,
      hintsUsed: hintsUnlockedCount,
      revealedSolution: showSolution,
    });
    if (updated.attempts[exercise.id]) {
      updated.attempts[exercise.id].checklistDone = checkedCriteria;
    }
    onProgressUpdated(updated);

    if (result.passed) {
      setShowSolution(true);
    }
  };

  // Try again
  const handleTryAgain = () => {
    setEvaluationResult(null);
    setHasAttempted(false);
  };

  // Reset inputs
  const handleReset = () => {
    setUserBlanks({});
    setUserPrediction('');
    setUserCode(
      exercise.type === 'corrigir_erros' && exercise.initialBuggyCode
        ? exercise.initialBuggyCode
        : exercise.templateCode
    );
    setEvaluationResult(null);
    setHasAttempted(false);
  };

  // Request next progressive hint
  const handleRequestHint = () => {
    if (hintsUnlockedCount < exercise.hints.length) {
      const nextCount = hintsUnlockedCount + 1;
      setHintsUnlockedCount(nextCount);
      setActiveTab('dicas');
      const updated = recordExerciseAttempt(exercise.id, false, {
        userBlanks: exercise.type === 'lacunas' ? userBlanks : undefined,
        userCode: exercise.type !== 'lacunas' && exercise.type !== 'prever_saida' ? userCode : undefined,
        outputPrediction: exercise.type === 'prever_saida' ? userPrediction : undefined,
        hintsUsed: nextCount,
      });
      onProgressUpdated(updated);
    }
  };

  // Confirm viewing solution
  const handleConfirmViewSolution = () => {
    setShowSolution(true);
    setShowConfirmSolution(false);
    setActiveTab('solucao');
    const updated = recordExerciseAttempt(exercise.id, isAlreadyCompleted, {
      userBlanks: exercise.type === 'lacunas' ? userBlanks : undefined,
      userCode: exercise.type !== 'lacunas' && exercise.type !== 'prever_saida' ? userCode : undefined,
      outputPrediction: exercise.type === 'prever_saida' ? userPrediction : undefined,
      hintsUsed: hintsUnlockedCount,
      revealedSolution: true,
    });
    onProgressUpdated(updated);
  };

  const getModalityLabel = (type: string) => {
    switch (type) {
      case 'lacunas':
        return 'Preenchimento de Lacunas';
      case 'corrigir_erros':
        return 'Depuração & Correção de Bug';
      case 'prever_saida':
        return 'Previsão de Saída';
      case 'desafio_pratico':
        return 'Desafio Prático';
      case 'codigo_livre':
        return 'Código Livre';
      default:
        return 'Exercício';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5 font-sans">
      {/* Top Bar Navigation Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <button
          onClick={onBackToList}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>←</span>
          <span>Voltar ao Catálogo</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          {prevExercise ? (
            <button
              onClick={() => onNavigateToExercise(prevExercise.id)}
              className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              ← Anterior
            </button>
          ) : (
            <span className="px-3 py-1.5 rounded-lg border border-transparent text-slate-600 cursor-not-allowed">
              ← Anterior
            </span>
          )}

          <span className="text-slate-500 font-mono text-[11px]">
            {currentIndex + 1} de {allExercisesInTrack.length}
          </span>

          {nextExercise ? (
            <button
              onClick={() => onNavigateToExercise(nextExercise.id)}
              className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Próximo →
            </button>
          ) : (
            <span className="px-3 py-1.5 rounded-lg border border-transparent text-slate-600 cursor-not-allowed">
              Próximo →
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Left Column (5 Cols) Context & Requirements, Right Column (7 Cols) Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Problem context & Tabs */}
        <div className="lg:col-span-5 space-y-4">
          {/* Header Info */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              {isAlreadyCompleted ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <span>✓</span> Concluído
                </span>
              ) : (
                <span className="text-amber-400/90 font-medium">○ Pendente</span>
              )}
              <span className="text-slate-600">·</span>
              <span className="text-indigo-400 font-semibold">
                {getModalityLabel(exercise.type)}
              </span>
              <span className="text-slate-600">·</span>
              <span className="capitalize text-slate-400">{exercise.difficulty}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {exercise.title}
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              {exercise.summary}
            </p>
          </div>

          {/* Sub-Tabs: Briefing / Requisitos / Instruções / Dicas / Solução */}
          <div className="border border-slate-800 rounded-xl bg-slate-900/40 overflow-hidden shadow-sm">
            <div className="flex border-b border-slate-800 bg-slate-950/60 p-1 gap-1 overflow-x-auto">
              {exercise.projectBrief && (
                <button
                  onClick={() => setActiveTab('po_brief')}
                  className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    activeTab === 'po_brief'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-rose-400 hover:text-rose-200'
                  }`}
                >
                  📋 Briefing PO
                </button>
              )}
              {exercise.practicalRequirements && exercise.practicalRequirements.length > 0 && (
                <button
                  onClick={() => setActiveTab('requisitos')}
                  className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    activeTab === 'requisitos'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-emerald-400 hover:text-emerald-200'
                  }`}
                >
                  ⚡ Requisitos
                </button>
              )}
              <button
                onClick={() => setActiveTab('instrucoes')}
                className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  activeTab === 'instrucoes'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Instruções
              </button>
              <button
                onClick={() => setActiveTab('dicas')}
                className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap relative ${
                  activeTab === 'dicas'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Dicas ({hintsUnlockedCount}/{exercise.hints.length})
              </button>
              <button
                onClick={() => setActiveTab('solucao')}
                className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  activeTab === 'solucao'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Solução
              </button>
            </div>

            <div className="p-4 text-xs space-y-4 max-h-[500px] overflow-y-auto leading-relaxed">
              {/* Requirements Tab for Desafio Prático */}
              {activeTab === 'requisitos' && exercise.practicalRequirements && (
                <div className="space-y-3">
                  <span className="font-bold text-white uppercase tracking-wider text-[11px] block">
                    Regras de Negócio Obrigatórias:
                  </span>
                  <div className="space-y-2">
                    {exercise.practicalRequirements.map((req, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="text-slate-200">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PO Briefing Tab for DEV Module */}
              {activeTab === 'po_brief' && exercise.projectBrief && (
                <div className="space-y-3 text-slate-300">
                  <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40 space-y-1">
                    <div><strong className="text-rose-300">Cliente:</strong> {exercise.projectBrief.clientName}</div>
                    <div><strong className="text-rose-300">Product Owner:</strong> {exercise.projectBrief.poName}</div>
                  </div>

                  <div>
                    <strong className="text-white block mb-1">Contexto de Negócio:</strong>
                    <p className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      {exercise.projectBrief.businessContext}
                    </p>
                  </div>

                  <div>
                    <strong className="text-white block mb-1">Critérios de Aceite do PO:</strong>
                    <div className="space-y-1.5">
                      {exercise.projectBrief.acceptanceCriteria.map(ac => (
                        <label key={ac.id} className="flex items-center gap-2 p-2 rounded bg-slate-950 border border-slate-800 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checkedCriteria.includes(ac.id)}
                            onChange={() => handleToggleCriterion(ac.id)}
                            className="rounded border-slate-700 text-indigo-600 focus:ring-0"
                          />
                          <span className={checkedCriteria.includes(ac.id) ? 'line-through text-slate-500' : 'text-slate-200'}>
                            {ac.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Instruções Tab */}
              {activeTab === 'instrucoes' && (
                <div className="space-y-3 text-slate-300">
                  <div>
                    <strong className="text-white block mb-1">Enunciado:</strong>
                    <p className="bg-slate-950 p-3 rounded-lg border border-slate-800 whitespace-pre-line leading-relaxed">
                      {exercise.description}
                    </p>
                  </div>

                  <div>
                    <strong className="text-white block mb-1">Objetivo:</strong>
                    <div className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-900/40 text-indigo-200 font-medium">
                      🎯 {exercise.goal}
                    </div>
                  </div>

                  {exercise.realWorldContext && (
                    <div className="text-slate-400 italic pt-1">
                      💡 <strong>Onde isso é usado no dia a dia:</strong> {exercise.realWorldContext}
                    </div>
                  )}
                </div>
              )}

              {/* Dicas Tab */}
              {activeTab === 'dicas' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
                    <span>Dicas progressivas disponíveis:</span>
                    <span className="font-mono">{hintsUnlockedCount}/{exercise.hints.length}</span>
                  </div>

                  {hintsUnlockedCount === 0 ? (
                    <div className="text-center py-4 space-y-2">
                      <p className="text-slate-400">Tente resolver primeiro antes de liberar dicas.</p>
                      <button
                        onClick={handleRequestHint}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700"
                      >
                        Liberar Dica 1
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {exercise.hints.slice(0, hintsUnlockedCount).map((hint, i) => (
                        <div key={i} className="p-3 rounded-lg bg-amber-950/20 border border-amber-900/40 text-amber-200/90">
                          <strong className="text-amber-300 block mb-1">Dica #{i + 1}:</strong>
                          {hint}
                        </div>
                      ))}

                      {hintsUnlockedCount < exercise.hints.length && (
                        <button
                          onClick={handleRequestHint}
                          className="w-full py-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 border border-dashed border-slate-800 rounded-lg"
                        >
                          Liberar Próxima Dica ({hintsUnlockedCount + 1}/{exercise.hints.length})
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Solução Tab */}
              {activeTab === 'solucao' && (
                <div className="space-y-3">
                  {!showSolution ? (
                    <div className="text-center py-6 space-y-3">
                      <p className="text-slate-400">
                        A solução comentada contém o código completo e a análise técnica detalhada.
                      </p>
                      <button
                        onClick={() => setShowConfirmSolution(true)}
                        className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700"
                      >
                        Revelar Solução e Análise
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-slate-400 mb-1 font-semibold">
                          <span>Código da Solução:</span>
                          <span className="uppercase">{exercise.language}</span>
                        </div>
                        <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-emerald-300 text-xs leading-relaxed overflow-x-auto max-h-[460px] overflow-y-auto">
                          {exercise.solutionCode}
                        </pre>
                      </div>

                      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                        <strong className="text-white block">Por que funciona e boas práticas:</strong>
                        <p className="text-slate-300">{exercise.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Editor & Execution Actions (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* INLINE AI HINT CALLOUT (When active) */}
          {showAiHintBanner && (
            <div className="rounded-xl border border-indigo-500/50 bg-indigo-950/30 p-3.5 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-200">
                <span className="flex items-center gap-1.5">
                  <span>✨</span> Dica Contextual da IA (Gemini):
                </span>
                <button
                  type="button"
                  onClick={() => setShowAiHintBanner(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {aiHintLoading ? (
                <div className="flex items-center gap-2 text-xs text-indigo-300 py-1">
                  <span className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  <span>Analisando o código atual para formular a orientação...</span>
                </div>
              ) : aiHintError ? (
                <div className="text-xs text-rose-300">{aiHintError}</div>
              ) : (
                <div className="text-xs text-slate-200 leading-relaxed font-sans">
                  {aiHint}
                </div>
              )}
            </div>
          )}

          {/* DYNAMIC EDITOR SWITCHER ACCORDING TO EXERCISE MODALITY */}
          {exercise.type === 'lacunas' ? (
            <FillInBlanksEditor
              templateCode={exercise.templateCode}
              blanks={exercise.blanks || []}
              userValues={userBlanks}
              validationResults={evaluationResult?.blankResults}
              hasAttempted={hasAttempted}
              onChangeBlank={handleChangeBlank}
              onSubmit={handleVerify}
            />
          ) : exercise.type === 'prever_saida' ? (
            <PredictOutputViewer
              language={exercise.language}
              code={exercise.codeToPredict || exercise.templateCode}
              userPrediction={userPrediction}
              onChangePrediction={setUserPrediction}
              onSubmit={handleVerify}
            />
          ) : (
            <div className="space-y-3">
              {exercise.type === 'corrigir_erros' && (
                <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/20 text-xs text-rose-200 space-y-1 shadow-sm">
                  <div className="font-bold text-rose-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span>🚨</span> Relatório do Bug a Investigar:
                  </div>
                  <p className="leading-relaxed">
                    {exercise.bugDescription || 'O código apresenta uma falha que precisa ser corrigida.'}
                  </p>
                  {exercise.buggyLineNumbers && exercise.buggyLineNumbers.length > 0 && (
                    <div className="text-[11px] text-rose-300 font-mono pt-1">
                      Linha(s) suspeita(s): {exercise.buggyLineNumbers.join(', ')}
                    </div>
                  )}
                </div>
              )}

              {exercise.type === 'desafio_pratico' && (
                <div className="p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/20 text-xs text-emerald-200 flex items-center justify-between shadow-sm">
                  <span className="font-bold text-emerald-300 uppercase tracking-wider text-[11px]">
                    ⚡ Desafio com Regras de Negócio Reais
                  </span>
                  <span className="text-slate-400">Atenda aos requisitos listados à esquerda</span>
                </div>
              )}

              <FreeCodeEditor
                language={exercise.language}
                code={userCode}
                onChangeCode={setUserCode}
                onSubmit={handleVerify}
                onReset={handleReset}
              />
            </div>
          )}

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/60">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleVerify}
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Verificar Resposta</span>
                <span className="opacity-75 font-mono">↵</span>
              </button>

              <button
                type="button"
                onClick={handleTryAgain}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Tentar Novamente
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAiTutorModal(true)}
                className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border border-indigo-400/40 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
                title="Converse com o Tutor IA ou analise o código linha a linha"
              >
                <span>💬 Tutor IA</span>
              </button>

              <button
                type="button"
                onClick={handleRequestAiHint}
                disabled={aiHintLoading}
                className="px-3 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-indigo-200 border border-slate-700 text-xs font-medium transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {aiHintLoading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin inline-block" />
                    <span>Analisando...</span>
                  </>
                ) : (
                  <>
                    <span>✨ Dica Rápida</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!showSolution) setShowConfirmSolution(true);
                  else setActiveTab('solucao');
                }}
                className="px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-medium transition-colors cursor-pointer"
              >
                Solução
              </button>
            </div>
          </div>

          {/* Evaluation Results Feedback Panel */}
          {evaluationResult && (
            <div
              className={`rounded-xl border p-4 space-y-3 transition-all ${
                evaluationResult.passed
                  ? 'border-emerald-800/80 bg-emerald-950/20'
                  : 'border-rose-800/80 bg-rose-950/20'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white flex items-center gap-1.5">
                      {evaluationResult.passed ? (
                        <>
                          <span className="text-emerald-400">✓</span> Resposta Correta!
                        </>
                      ) : (
                        <>
                          <span className="text-rose-400">✗</span> Existem pendências a corrigir
                        </>
                      )}
                    </span>
                    <span className="font-mono text-xs text-slate-400 tabular-nums">
                      ({evaluationResult.scorePercent}% acerto)
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {evaluationResult.generalFeedback}
                  </p>
                </div>

                {evaluationResult.passed && nextExercise && (
                  <button
                    onClick={() => onNavigateToExercise(nextExercise.id)}
                    className="shrink-0 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Próximo</span>
                    <span>→</span>
                  </button>
                )}
              </div>

              {/* Detailed Test Results Breakdown */}
              {evaluationResult.testCaseResults.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800/60 font-mono text-xs">
                  {evaluationResult.testCaseResults.map((tc, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg border flex items-center justify-between gap-2 ${
                        tc.passed
                          ? 'border-emerald-900/40 bg-emerald-950/40 text-emerald-200'
                          : 'border-rose-900/40 bg-rose-950/40 text-rose-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{tc.passed ? '✓' : '✗'}</span>
                        <span>{tc.description}</span>
                      </div>
                      <span className="text-[11px] opacity-80">{tc.output || tc.error}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal to View Solution */}
      {showConfirmSolution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Visualizar a Solução Completa?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              O aprendizado é mais profundo quando você tenta resolver e consulta as dicas progressivas antes de ver a resposta pronta. Tem certeza de que deseja visualizar a solução agora?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmSolution(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Voltar e Tentar
              </button>
              <button
                type="button"
                onClick={handleConfirmViewSolution}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                Sim, Revelar Solução
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive AI Tutor Modal with Dialog & Line-by-Line Code Breakdown */}
      <AiTutorModal
        isOpen={showAiTutorModal}
        onClose={() => setShowAiTutorModal(false)}
        exercise={exercise}
        currentAssembledCode={assembledCode}
        hasSolutionRevealed={showSolution}
      />
    </div>
  );
};
