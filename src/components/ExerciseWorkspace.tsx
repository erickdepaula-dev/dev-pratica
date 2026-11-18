import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, useAnimate, useReducedMotion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { Exercise, ExerciseAttempt, LogicLanguage, UserProgress } from '../types/exercise';
import { getLanguageTheme } from '../utils/exerciseTheme';
import { LOGIC_LANGUAGES } from '../utils/track';
import { FillInBlanksEditor } from './FillInBlanksEditor';
import { FreeCodeEditor } from './FreeCodeEditor';
import { PredictOutputViewer } from './PredictOutputViewer';
import { PredictTypeErrorViewer } from './PredictTypeErrorViewer';
import { DeskCheckViewer } from './DeskCheckViewer';
import { OperatorReference } from './OperatorReference';
import { flattenDeskCheck, givenRowCount, runDeskCheck, unflattenDeskCheck } from '../services/deskCheck';
import {
  evaluateBlanks,
  evaluateCodeForLanguage,
  evaluateOutputPrediction,
  evaluateTypeErrorPrediction,
  evaluateDeskCheck,
  evaluateBugFix,
  evaluatePracticalChallenge,
  EvaluationResult,
} from '../services/evaluator';
import { recordExerciseAttempt } from '../services/storage';
import { requestGeminiContextualHint } from '../services/aiHint';
import { AiTutorModal } from './AiTutorModal';
import { getDifficultyTheme, getExerciseTypeTheme } from '../utils/exerciseTheme';
import { assertNever } from '../utils/language';
import { formatDiagnostic } from '../services/typescript/compilerCore';

type WorkspaceTab = 'instrucoes' | 'po_brief' | 'requisitos' | 'dicas' | 'solucao';

interface WorkspaceTabItem {
  id: WorkspaceTab;
  label: string;
  /** Classe do indicador animado quando a aba está ativa. */
  indicatorClass: string;
  /** Cor do texto quando inativa. */
  idleClass: string;
}

const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-from';

/** Shake curto e sutil para resposta incorreta (só transform). */
const SHAKE_KEYFRAMES = { x: [0, -7, 7, -5, 5, -2, 0] };

interface ExerciseWorkspaceProps {
  exercise: Exercise;
  progress: UserProgress;
  onBackToList: () => void;
  onNavigateToExercise: (id: string) => void;
  allExercisesInTrack: Exercise[];
  onProgressUpdated: (newProgress: UserProgress) => void;
  /** Trilha de Lógica: troca a linguagem em que o exercício é resolvido (JS ou TS). */
  onChangeLogicLanguage?: (language: LogicLanguage) => void;
}

/**
 * Código salvo que pode ser restaurado. Na trilha de Lógica, o código só volta se foi escrito
 * na mesma linguagem exibida agora (senão o editor TS mostraria o código JS, e vice-versa).
 */
function restorableCode(exercise: Exercise, attempt: ExerciseAttempt | undefined): string | undefined {
  if (!attempt?.userCode) return undefined;
  if (exercise.track === 'logica' && (attempt.logicLanguage ?? 'javascript') !== exercise.language) return undefined;
  return attempt.userCode;
}

export const ExerciseWorkspace: React.FC<ExerciseWorkspaceProps> = ({
  exercise,
  progress,
  onBackToList,
  onNavigateToExercise,
  allExercisesInTrack,
  onProgressUpdated,
  onChangeLogicLanguage,
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

  // Resposta de 'prever_erro_de_tipo' (linha + motivo)
  const [typeErrorLine, setTypeErrorLine] = useState<number | null>(() => currentAttempt?.typeErrorAnswer?.line ?? null);
  const [typeErrorReason, setTypeErrorReason] = useState<number | null>(() => currentAttempt?.typeErrorAnswer?.reason ?? null);

  // 'teste_de_mesa': gabarito gerado executando o código do exercício (ver services/deskCheck.ts)
  const deskCheckExpected = React.useMemo<string[][]>(() => {
    if (exercise.type !== 'teste_de_mesa' || !exercise.deskCheck) return [];
    try {
      return runDeskCheck(exercise.deskCheck);
    } catch {
      return [];
    }
  }, [exercise]);
  const deskCheckGiven = exercise.deskCheck ? givenRowCount(exercise.deskCheck, deskCheckExpected.length) : 0;
  const deskCheckColumns = exercise.deskCheck?.columns.length ?? 0;
  const [deskAnswer, setDeskAnswer] = useState<string[][]>(() =>
    unflattenDeskCheck(currentAttempt?.deskCheckAnswer, deskCheckExpected.length, deskCheckColumns)
  );

  // Free code / bug fix state
  const [userCode, setUserCode] = useState<string>(() => {
    const saved = restorableCode(exercise, currentAttempt);
    if (saved) return saved;
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
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('instrucoes');
  // Incrementa a cada verificação para reanimar o painel de feedback.
  const [evaluationCount, setEvaluationCount] = useState(0);
  // XP ganho na última verificação: número na 1ª conclusão; 0 ao refazer; null sem acerto.
  const [xpGained, setXpGained] = useState<number | null>(null);
  const [verifyButtonScope, animateVerifyButton] = useAnimate<HTMLButtonElement>();
  const prefersReducedMotion = useReducedMotion();

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
    if (exercise.type === 'prever_saida' || exercise.type === 'prever_erro_de_tipo') {
      return exercise.codeToPredict || exercise.templateCode;
    }
    if (exercise.type === 'teste_de_mesa') {
      return exercise.deskCheck?.code ?? exercise.templateCode;
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
    setTypeErrorLine(attempt?.typeErrorAnswer?.line ?? null);
    setTypeErrorReason(attempt?.typeErrorAnswer?.reason ?? null);
    setDeskAnswer(unflattenDeskCheck(attempt?.deskCheckAnswer, deskCheckExpected.length, deskCheckColumns));
    setUserCode(
      restorableCode(exercise, attempt) ||
      (exercise.type === 'corrigir_erros' && exercise.initialBuggyCode ? exercise.initialBuggyCode : exercise.templateCode)
    );
    setEvaluationResult(null);
    setXpGained(null);
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

  // Diagnósticos do compilador da última avaliação, enviados ao tutor IA (só TS).
  // Em 'prever_erro_de_tipo' nunca são enviados: entregariam a resposta.
  const compilerDiagnostics =
    exercise.language === 'typescript' && exercise.type !== 'prever_erro_de_tipo'
      ? (evaluationResult?.diagnostics ?? []).map(formatDiagnostic)
      : undefined;

  const logicLanguageToSave: LogicLanguage | undefined =
    exercise.track === 'logica' && (exercise.language === 'javascript' || exercise.language === 'typescript')
      ? exercise.language
      : undefined;

  // Modalidades em que o aluno escreve código (nas outras, userCode não é resposta)
  const savesCode =
    exercise.type !== 'lacunas' &&
    exercise.type !== 'prever_saida' &&
    exercise.type !== 'prever_erro_de_tipo' &&
    exercise.type !== 'teste_de_mesa';

  const deskCheckAnswerToSave =
    exercise.type === 'teste_de_mesa' && deskAnswer.some(row => row.some(cell => cell.trim() !== ''))
      ? flattenDeskCheck(deskAnswer)
      : undefined;

  const typeErrorAnswerToSave =
    exercise.type === 'prever_erro_de_tipo' && typeErrorLine !== null && typeErrorReason !== null
      ? { line: typeErrorLine, reason: typeErrorReason }
      : undefined;

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
      countAttempt: false,
      userBlanks: exercise.type === 'lacunas' ? userBlanks : undefined,
      userCode: savesCode ? userCode : undefined,
      outputPrediction: exercise.type === 'prever_saida' ? userPrediction : undefined,
      typeErrorAnswer: typeErrorAnswerToSave,
      deskCheckAnswer: deskCheckAnswerToSave,
      logicLanguage: logicLanguageToSave,
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
        compilerDiagnostics,
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

    // switch exaustivo: uma modalidade nova sem avaliador quebra o tsc
    switch (exercise.type) {
      case 'lacunas':
        result = evaluateBlanks(exercise, userBlanks);
        break;
      case 'prever_saida':
        result = evaluateOutputPrediction(exercise, userPrediction);
        break;
      case 'teste_de_mesa':
        result = evaluateDeskCheck(exercise, deskAnswer);
        break;
      case 'prever_erro_de_tipo':
        result = await evaluateTypeErrorPrediction(exercise, { line: typeErrorLine, reason: typeErrorReason });
        break;
      case 'corrigir_erros':
        result = await evaluateBugFix(exercise, userCode);
        break;
      case 'desafio_pratico':
        result = await evaluatePracticalChallenge(exercise, userCode);
        break;
      case 'codigo_livre':
        result = await evaluateCodeForLanguage(exercise, userCode);
        break;
      default:
        return assertNever(exercise.type, 'Modalidade do exercício');
    }

    setEvaluationResult(result);
    setEvaluationCount(c => c + 1);
    if (!result.passed && !prefersReducedMotion && verifyButtonScope.current) {
      animateVerifyButton(verifyButtonScope.current, SHAKE_KEYFRAMES, { duration: 0.4, ease: 'easeInOut' });
    }

    // Persist attempt and update streak if passed
    const updated = recordExerciseAttempt(exercise.id, result.passed, {
      userBlanks: exercise.type === 'lacunas' ? userBlanks : undefined,
      userCode: savesCode ? userCode : undefined,
      outputPrediction: exercise.type === 'prever_saida' ? userPrediction : undefined,
      typeErrorAnswer: typeErrorAnswerToSave,
      deskCheckAnswer: deskCheckAnswerToSave,
      logicLanguage: logicLanguageToSave,
      hintsUsed: hintsUnlockedCount,
      revealedSolution: showSolution,
    });
    if (updated.attempts[exercise.id]) {
      updated.attempts[exercise.id].checklistDone = checkedCriteria;
    }
    setXpGained(result.passed ? (isAlreadyCompleted ? 0 : (updated.attempts[exercise.id]?.xpEarned ?? 0)) : null);
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
    setTypeErrorLine(null);
    setTypeErrorReason(null);
    setDeskAnswer(unflattenDeskCheck(undefined, deskCheckExpected.length, deskCheckColumns));
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
        countAttempt: false,
        userBlanks: exercise.type === 'lacunas' ? userBlanks : undefined,
        userCode: savesCode ? userCode : undefined,
        outputPrediction: exercise.type === 'prever_saida' ? userPrediction : undefined,
        typeErrorAnswer: typeErrorAnswerToSave,
        deskCheckAnswer: deskCheckAnswerToSave,
        logicLanguage: logicLanguageToSave,
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
      countAttempt: false,
      userBlanks: exercise.type === 'lacunas' ? userBlanks : undefined,
      userCode: savesCode ? userCode : undefined,
      outputPrediction: exercise.type === 'prever_saida' ? userPrediction : undefined,
      typeErrorAnswer: typeErrorAnswerToSave,
      deskCheckAnswer: deskCheckAnswerToSave,
      logicLanguage: logicLanguageToSave,
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
      case 'prever_erro_de_tipo':
        return 'Previsão de Erro de Tipo';
      case 'teste_de_mesa':
        return 'Teste de Mesa';
      default:
        return 'Exercício';
    }
  };

  const workspaceTabs: WorkspaceTabItem[] = [
    ...(exercise.projectBrief
      ? [{ id: 'po_brief' as const, label: '📋 Briefing PO', indicatorClass: 'bg-danger', idleClass: 'text-danger hover:brightness-125' }]
      : []),
    ...(exercise.practicalRequirements && exercise.practicalRequirements.length > 0
      ? [{ id: 'requisitos' as const, label: '⚡ Requisitos', indicatorClass: 'bg-success', idleClass: 'text-success hover:brightness-125' }]
      : []),
    { id: 'instrucoes', label: 'Instruções', indicatorClass: 'bg-gradient-accent', idleClass: 'text-muted hover:text-primary' },
    {
      id: 'dicas',
      label: `Dicas (${hintsUnlockedCount}/${exercise.hints.length})`,
      indicatorClass: 'bg-gradient-accent',
      idleClass: 'text-muted hover:text-primary',
    },
    { id: 'solucao', label: 'Solução', indicatorClass: 'bg-gradient-accent', idleClass: 'text-muted hover:text-primary' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5 font-sans">
      {/* Top Bar Navigation Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-subtle/80">
        <button
          onClick={onBackToList}
          className="text-xs font-semibold text-muted hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>←</span>
          <span>Voltar ao Catálogo</span>
        </button>

        <div className="flex items-center gap-2 text-xs">
          {prevExercise ? (
            <button
              onClick={() => onNavigateToExercise(prevExercise.id)}
              className="px-3 py-1.5 rounded-lg border border-subtle bg-surface/60 text-primary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            >
              ← Anterior
            </button>
          ) : (
            <span className="px-3 py-1.5 rounded-lg border border-transparent text-muted/60 cursor-not-allowed">
              ← Anterior
            </span>
          )}

          <span className="text-muted font-mono text-[11px]">
            {currentIndex + 1} de {allExercisesInTrack.length}
          </span>

          {nextExercise ? (
            <button
              onClick={() => onNavigateToExercise(nextExercise.id)}
              className="px-3 py-1.5 rounded-lg border border-subtle bg-surface/60 text-primary hover:text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            >
              Próximo →
            </button>
          ) : (
            <span className="px-3 py-1.5 rounded-lg border border-transparent text-muted/60 cursor-not-allowed">
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
                <span className="text-success font-semibold flex items-center gap-1">
                  <span>✓</span> Concluído
                </span>
              ) : (
                <span className="text-warning/90 font-medium">○ Pendente</span>
              )}
              <span className="text-muted/60">·</span>
              <span className={`font-semibold ${getExerciseTypeTheme(exercise.type).textClass}`}>
                {getModalityLabel(exercise.type)}
              </span>
              <span className="text-muted/60">·</span>
              <span className={getDifficultyTheme(exercise.difficulty).textClass}>
                {getDifficultyTheme(exercise.difficulty).label}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-primary tracking-tight">
              {exercise.title}
            </h1>
            {exercise.track === 'logica' && exercise.type !== 'teste_de_mesa' && onChangeLogicLanguage && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] text-muted">Resolver em:</span>
                <div role="radiogroup" aria-label="Linguagem da solução" className="flex items-center p-0.5 bg-canvas border border-subtle rounded-full">
                  {LOGIC_LANGUAGES.map(language => {
                    const theme = getLanguageTheme(language);
                    const isActive = exercise.language === language;
                    return (
                      <button
                        key={language}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => !isActive && onChangeLogicLanguage(language)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                          isActive ? 'bg-logica text-white' : 'text-muted hover:text-primary'
                        }`}
                      >
                        <span aria-hidden="true">{theme.emoji}</span> {theme.name}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[11px] text-muted">o progresso do exercício vale para as duas</span>
              </div>
            )}
            <p className="text-xs text-muted leading-relaxed">
              {exercise.summary}
            </p>
          </div>

          {/* Sub-Tabs: Briefing / Requisitos / Instruções / Dicas / Solução */}
          <div className="border border-subtle rounded-xl bg-surface/40 overflow-hidden shadow-sm">
            <div role="tablist" className="flex border-b border-subtle bg-canvas/60 p-1 gap-1 overflow-x-auto">
              {workspaceTabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex-1 py-1.5 px-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${FOCUS_RING} ${
                      isActive ? 'text-white' : tab.idleClass
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId={`workspace-tab-indicator-${exercise.id}`}
                        transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                        className={`absolute inset-0 rounded-md shadow-sm ${tab.indicatorClass}`}
                      />
                    )}
                    <span className="relative">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 text-xs max-h-[500px] overflow-y-auto overflow-x-hidden leading-relaxed">
              <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeTab}
                role="tabpanel"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                className="space-y-4"
              >
              {/* Requirements Tab for Desafio Prático */}
              {activeTab === 'requisitos' && exercise.practicalRequirements && (
                <div className="space-y-3">
                  <span className="font-bold text-primary uppercase tracking-wider text-[11px] block">
                    Regras de Negócio Obrigatórias:
                  </span>
                  <div className="space-y-2">
                    {exercise.practicalRequirements.map((req, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-canvas border border-subtle flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-success/20 border border-success/40 text-success font-bold flex items-center justify-center shrink-0 text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="text-primary">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PO Briefing Tab for DEV Module */}
              {activeTab === 'po_brief' && exercise.projectBrief && (
                <div className="space-y-3 text-primary">
                  <div className="p-3 rounded-lg bg-danger/10 border border-danger/30 space-y-1">
                    <div><strong className="text-danger">Cliente:</strong> {exercise.projectBrief.clientName}</div>
                    <div><strong className="text-danger">Product Owner:</strong> {exercise.projectBrief.poName}</div>
                  </div>

                  <div>
                    <strong className="text-primary block mb-1">Contexto de Negócio:</strong>
                    <p className="bg-canvas p-3 rounded-lg border border-subtle">
                      {exercise.projectBrief.businessContext}
                    </p>
                  </div>

                  <div>
                    <strong className="text-primary block mb-1">Critérios de Aceite do PO:</strong>
                    <div className="space-y-1.5">
                      {exercise.projectBrief.acceptanceCriteria.map(ac => (
                        <label key={ac.id} className="flex items-center gap-2 p-2 rounded bg-canvas border border-subtle cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checkedCriteria.includes(ac.id)}
                            onChange={() => handleToggleCriterion(ac.id)}
                            className="rounded border-subtle text-accent-from focus:ring-0"
                          />
                          <span className={checkedCriteria.includes(ac.id) ? 'line-through text-muted' : 'text-primary'}>
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
                <div className="space-y-3 text-primary">
                  <div>
                    <strong className="text-primary block mb-1">Enunciado:</strong>
                    <p className="bg-canvas p-3 rounded-lg border border-subtle whitespace-pre-line leading-relaxed">
                      {exercise.description}
                    </p>
                  </div>

                  <div>
                    <strong className="text-primary block mb-1">Objetivo:</strong>
                    <div className="p-2.5 rounded-lg bg-accent-from/10 border border-accent-from/30 text-accent font-medium">
                      🎯 {exercise.goal}
                    </div>
                  </div>

                  {exercise.realWorldContext && (
                    <div className="text-muted italic pt-1">
                      💡 <strong>Onde isso é usado no dia a dia:</strong> {exercise.realWorldContext}
                    </div>
                  )}

                  {exercise.track === 'logica' && (
                    <details className="group rounded-lg border border-subtle bg-canvas/60">
                      <summary className="cursor-pointer select-none px-3 py-2 text-xs font-semibold text-primary hover:text-accent">
                        📘 Consulta rápida: operadores e precedência
                      </summary>
                      <div className="px-3 pb-3 pt-1">
                        <OperatorReference compact />
                      </div>
                    </details>
                  )}
                </div>
              )}

              {/* Dicas Tab */}
              {activeTab === 'dicas' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-subtle text-muted">
                    <span>Dicas progressivas disponíveis:</span>
                    <span className="font-mono">{hintsUnlockedCount}/{exercise.hints.length}</span>
                  </div>

                  {hintsUnlockedCount === 0 ? (
                    <div className="text-center py-4 space-y-2">
                      <p className="text-muted">Tente resolver primeiro antes de liberar dicas.</p>
                      <button
                        onClick={handleRequestHint}
                        className="px-3 py-1.5 rounded-lg bg-surface-hover hover:bg-subtle text-primary font-semibold border border-subtle"
                      >
                        Liberar Dica 1
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {exercise.hints.slice(0, hintsUnlockedCount).map((hint, i) => (
                        <div key={i} className="p-3 rounded-lg bg-warning/10 border border-warning/30 text-warning/90">
                          <strong className="text-warning block mb-1">Dica #{i + 1}:</strong>
                          {hint}
                        </div>
                      ))}

                      {hintsUnlockedCount < exercise.hints.length && (
                        <button
                          onClick={handleRequestHint}
                          className="w-full py-2 text-xs font-semibold text-accent hover:text-accent border border-dashed border-subtle rounded-lg"
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
                      <p className="text-muted">
                        A solução comentada contém o código completo e a análise técnica detalhada.
                      </p>
                      <button
                        onClick={() => setShowConfirmSolution(true)}
                        className="px-4 py-2 rounded-lg bg-surface-hover hover:bg-subtle text-primary font-semibold border border-subtle"
                      >
                        Revelar Solução e Análise
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {exercise.type === 'teste_de_mesa' && exercise.deskCheck ? (
                        <div className="space-y-1">
                          <div className="text-muted font-semibold">Tabela completa:</div>
                          <div className="overflow-x-auto rounded-lg border border-subtle bg-canvas">
                            <table className="w-full text-xs font-mono">
                              <thead>
                                <tr className="text-muted">
                                  <th scope="col" className="px-2 py-1.5 text-left font-semibold">#</th>
                                  {exercise.deskCheck.columns.map(column => (
                                    <th key={column} scope="col" className="px-2 py-1.5 text-left font-semibold text-primary">{column}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {deskCheckExpected.map((row, r) => (
                                  <tr key={r} className="border-t border-subtle/70">
                                    <th scope="row" className="px-2 py-1 text-left font-normal text-muted">{r + 1}</th>
                                    {row.map((value, c) => (
                                      <td key={c} className="px-2 py-1 text-success">{value}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                      <div>
                        <div className="flex items-center justify-between text-muted mb-1 font-semibold">
                          <span>Código da Solução:</span>
                          <span className="uppercase">{exercise.language}</span>
                        </div>
                        <pre className="p-3 bg-canvas rounded-lg border border-subtle font-mono text-success text-xs leading-relaxed overflow-x-auto max-h-[460px] overflow-y-auto">
                          {exercise.solutionCode}
                        </pre>
                      </div>
                      )}

                      <div className="p-3 bg-canvas rounded-lg border border-subtle space-y-1">
                        <strong className="text-primary block">Por que funciona e boas práticas:</strong>
                        <p className="text-primary">{exercise.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Editor & Execution Actions (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* INLINE AI HINT CALLOUT (When active) */}
          {showAiHintBanner && (
            <div className="rounded-xl border border-accent-from/50 bg-accent-from/10 p-3.5 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-accent">
                <span className="flex items-center gap-1.5">
                  <span>✨</span> Dica Contextual da IA (Gemini):
                </span>
                <button
                  type="button"
                  onClick={() => setShowAiHintBanner(false)}
                  className="text-muted hover:text-primary"
                >
                  ✕
                </button>
              </div>

              {aiHintLoading ? (
                <div className="flex items-center gap-2 text-xs text-accent py-1">
                  <span className="w-3.5 h-3.5 border-2 border-accent-from border-t-transparent rounded-full animate-spin" />
                  <span>Analisando o código atual para formular a orientação...</span>
                </div>
              ) : aiHintError ? (
                <div className="text-xs text-danger">{aiHintError}</div>
              ) : (
                <div className="text-xs text-primary leading-relaxed font-sans">
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
          ) : exercise.type === 'teste_de_mesa' && exercise.deskCheck ? (
            <DeskCheckViewer
              challenge={exercise.deskCheck}
              expectedRows={deskCheckExpected}
              givenRows={deskCheckGiven}
              answer={deskAnswer}
              onChangeCell={(row, column, value) => {
                setDeskAnswer(prev => prev.map((cells, r) => (r === row ? cells.map((cell, c) => (c === column ? value : cell)) : cells)));
                setEvaluationResult(null);
              }}
              cellResults={evaluationResult?.deskCheckCells ?? null}
              onSubmit={handleVerify}
            />
          ) : exercise.type === 'prever_erro_de_tipo' && exercise.typeErrorChallenge ? (
            <PredictTypeErrorViewer
              code={exercise.codeToPredict || exercise.templateCode}
              challenge={exercise.typeErrorChallenge}
              selectedLine={typeErrorLine}
              selectedReason={typeErrorReason}
              onSelectLine={line => {
                setTypeErrorLine(line);
                setEvaluationResult(null);
              }}
              onSelectReason={reason => {
                setTypeErrorReason(reason);
                setEvaluationResult(null);
              }}
              lineFeedback={
                evaluationResult
                  ? typeErrorLine === exercise.typeErrorChallenge.errorLine
                    ? 'correta'
                    : 'incorreta'
                  : null
              }
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
                <div className="p-3.5 rounded-xl border border-danger/40 bg-danger/10 text-xs text-danger space-y-1 shadow-sm">
                  <div className="font-bold text-danger uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <span>🚨</span> Relatório do Bug a Investigar:
                  </div>
                  <p className="leading-relaxed">
                    {exercise.bugDescription || 'O código apresenta uma falha que precisa ser corrigida.'}
                  </p>
                  {exercise.buggyLineNumbers && exercise.buggyLineNumbers.length > 0 && (
                    <div className="text-[11px] text-danger font-mono pt-1">
                      Linha(s) suspeita(s): {exercise.buggyLineNumbers.join(', ')}
                    </div>
                  )}
                </div>
              )}

              {exercise.type === 'desafio_pratico' && (
                <div className="p-3 rounded-xl border border-success/40 bg-success/10 text-xs text-success flex items-center justify-between shadow-sm">
                  <span className="font-bold text-success uppercase tracking-wider text-[11px]">
                    ⚡ Desafio com Regras de Negócio Reais
                  </span>
                  <span className="text-muted">Atenda aos requisitos listados à esquerda</span>
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
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-subtle bg-surface/60">
            <div className="flex items-center gap-2">
              <button
                ref={verifyButtonScope}
                type="button"
                onClick={handleVerify}
                className={`px-5 py-2 rounded-control bg-gradient-accent text-white font-semibold text-xs shadow-glow transition-[filter] hover:brightness-110 active:brightness-95 flex items-center gap-1.5 cursor-pointer ${FOCUS_RING}`}
              >
                <span>Verificar Resposta</span>
                <span className="opacity-75 font-mono">↵</span>
              </button>

              <button
                type="button"
                onClick={handleTryAgain}
                className="px-3 py-2 rounded-lg bg-surface-hover hover:bg-subtle text-primary hover:text-primary text-xs font-medium transition-colors cursor-pointer"
              >
                Tentar Novamente
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAiTutorModal(true)}
                className={`px-3.5 py-2 rounded-control bg-gradient-accent hover:brightness-110 text-white text-xs font-semibold transition-[filter] flex items-center gap-1.5 shadow-glow cursor-pointer ${FOCUS_RING}`}
                title="Converse com o Tutor IA ou analise o código linha a linha"
              >
                <span>💬 Tutor IA</span>
              </button>

              <button
                type="button"
                onClick={handleRequestAiHint}
                disabled={aiHintLoading}
                className="px-3 py-2 rounded-lg bg-surface-hover/90 hover:bg-subtle text-accent border border-subtle text-xs font-medium transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {aiHintLoading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-accent-from border-t-transparent rounded-full animate-spin inline-block" />
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
                className="px-3 py-2 rounded-lg border border-subtle bg-surface text-primary hover:text-primary hover:bg-surface-hover text-xs font-medium transition-colors cursor-pointer"
              >
                Solução
              </button>
            </div>
          </div>

          {/* Evaluation Results Feedback Panel */}
          <AnimatePresence mode="wait">
          {evaluationResult && (
            <motion.div
              key={evaluationCount}
              role="status"
              aria-live="polite"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`rounded-card border p-4 space-y-3 ${
                evaluationResult.passed
                  ? 'border-success/40 bg-success/10 shadow-[0_0_32px_color-mix(in_srgb,var(--success)_18%,transparent)]'
                  : 'border-danger/30 bg-danger/10'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary flex items-center gap-2">
                      {evaluationResult.passed ? (
                        <>
                          {/* Selo de sucesso: pop com spring + um anel que se expande uma vez */}
                          <span className="relative w-6 h-6 flex items-center justify-center" aria-hidden="true">
                            <motion.span
                              className="absolute inset-0 rounded-full border-2 border-success"
                              initial={{ scale: 1, opacity: 0.7 }}
                              animate={{ scale: 2, opacity: 0 }}
                              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
                            />
                            <motion.span
                              className="relative w-6 h-6 rounded-full bg-success flex items-center justify-center"
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 420, damping: 16 }}
                            >
                              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                            </motion.span>
                          </span>
                          Resposta correta!
                          {xpGained !== null && (
                            <motion.span
                              className={`ml-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                                xpGained > 0 ? 'bg-gradient-accent text-white shadow-glow' : 'bg-surface-hover text-muted border border-subtle'
                              }`}
                              initial={{ opacity: 0, scale: 0.6, y: 4 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ type: 'spring', stiffness: 420, damping: 18, delay: 0.25 }}
                            >
                              {xpGained > 0 ? '+' + xpGained + ' XP' : 'Já concluído · sem XP extra'}
                            </motion.span>
                          )}
                        </>
                      ) : (
                        <>
                          <span className="w-6 h-6 rounded-full bg-danger/20 border border-danger/40 flex items-center justify-center" aria-hidden="true">
                            <X className="w-3.5 h-3.5 text-danger" strokeWidth={3} />
                          </span>
                          Existem pendências a corrigir
                        </>
                      )}
                    </span>
                    <span className="font-mono text-xs text-muted tabular-nums">
                      ({evaluationResult.scorePercent}% acerto)
                    </span>
                  </div>

                  <p className="text-xs text-muted leading-relaxed">
                    {evaluationResult.generalFeedback}
                  </p>
                </div>

                {evaluationResult.passed && nextExercise && (
                  <button
                    onClick={() => onNavigateToExercise(nextExercise.id)}
                    className={`shrink-0 px-4 py-2 rounded-control bg-success hover:brightness-110 text-white font-semibold text-xs shadow-sm transition-[filter] flex items-center gap-1.5 cursor-pointer ${FOCUS_RING}`}
                  >
                    <span>Próximo</span>
                    <span>→</span>
                  </button>
                )}
              </div>

              {/* Detailed Test Results Breakdown */}
              {evaluationResult.testCaseResults.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-subtle/60 font-mono text-xs">
                  {evaluationResult.testCaseResults.map((tc, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded-lg border flex items-center justify-between gap-2 ${
                        tc.passed
                          ? 'border-success/30 bg-success/10 text-success'
                          : 'border-danger/30 bg-danger/10 text-danger'
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
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>

      {/* Confirmation Modal to View Solution */}
      <AnimatePresence>
      {showConfirmSolution && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            className="max-w-md w-full rounded-card border border-subtle bg-surface p-6 space-y-4 shadow-card"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <h3 className="text-lg font-bold text-primary">Visualizar a Solução Completa?</h3>
            <p className="text-xs text-muted leading-relaxed">
              O aprendizado é mais profundo quando você tenta resolver e consulta as dicas progressivas antes de ver a resposta pronta. Tem certeza de que deseja visualizar a solução agora?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmSolution(false)}
                className="px-4 py-2 rounded-lg bg-surface-hover hover:bg-subtle text-primary text-xs font-semibold transition-colors cursor-pointer"
              >
                Voltar e Tentar
              </button>
              <button
                type="button"
                onClick={handleConfirmViewSolution}
                className={`px-4 py-2 rounded-control bg-gradient-accent hover:brightness-110 text-white text-xs font-semibold transition-[filter] cursor-pointer ${FOCUS_RING}`}
              >
                Sim, Revelar Solução
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Interactive AI Tutor Modal with Dialog & Line-by-Line Code Breakdown */}
      <AiTutorModal
        isOpen={showAiTutorModal}
        onClose={() => setShowAiTutorModal(false)}
        exercise={exercise}
        currentAssembledCode={assembledCode}
        hasSolutionRevealed={showSolution}
        compilerDiagnostics={compilerDiagnostics}
      />
    </div>
  );
};
