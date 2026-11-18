import { Language, LogicLanguage, Track, UserProgress, ExerciseAttempt } from '../types/exercise';
import { AiChallenge, AiChallengeAttempt, AiChallengeEvaluation } from '../types/aiChallenge';
import { getFortalezaDateString, getDaysDifference } from '../utils/dateUtils';
import { isLanguage } from '../utils/language';
import { isLogicLanguage, isTrack } from '../utils/track';
import { allExercises, getExerciseById } from '../data';
import { computeAiChallengeXp, computeExerciseXp, retroactiveAiChallengeXp, retroactiveExerciseXp } from './xp';
import { unlockBadges } from './badges';

const STORAGE_KEY = 'devpratica_user_progress_v1';

/**
 * Progresso vazio — sempre um objeto NOVO. Antes era uma constante compartilhada e
 * retornada por referência; hoje nenhum fluxo a modifica (a gravação relê o localStorage),
 * mas um objeto novo por chamada elimina o risco por construção.
 */
function createDefaultProgress(): UserProgress {
  return {
    selectedLanguage: 'php',
    completedIds: [],
    attempts: {},
    aiChallenges: {},
    streak: { currentStreak: 0, lastActiveDate: '', activeDates: [] },
    badges: [],
  };
}

/**
 * Returns the effective displayed streak state based on America/Fortaleza calendar days.
 * Does not mutate storage.
 */
export function calculateEffectiveStreak(streak: UserProgress['streak']): {
  count: number;
  isActiveToday: boolean;
  isAtRisk: boolean;
  daysSinceLast: number;
} {
  if (!streak || streak.currentStreak <= 0 || !streak.lastActiveDate) {
    return { count: 0, isActiveToday: false, isAtRisk: false, daysSinceLast: 999 };
  }

  const today = getFortalezaDateString();
  const diff = getDaysDifference(streak.lastActiveDate, today);

  if (diff === 0) {
    // Studied today in Fortaleza
    return { count: streak.currentStreak, isActiveToday: true, isAtRisk: false, daysSinceLast: 0 };
  }

  if (diff === 1) {
    // Studied yesterday in Fortaleza: streak is preserved, user needs to practice today to advance
    return { count: streak.currentStreak, isActiveToday: false, isAtRisk: true, daysSinceLast: 1 };
  }

  // Missed one or more days without studying (diff > 1): streak broken until next exercise completion
  return { count: 0, isActiveToday: false, isAtRisk: false, daysSinceLast: diff };
}

/**
 * Loads user progress from local storage.
 * Strictly adheres to Rule 6: opening the app or viewing never alters the streak.
 */
export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const fresh = createDefaultProgress();
      saveUserProgress(fresh);
      return fresh;
    }
    const parsed = JSON.parse(raw) as UserProgress;

    // Sanitize defaults if corrupted
    // Migração defensiva (Fase 2): progresso antigo só tem 'php' | 'javascript', que continuam
    // válidos. Qualquer valor desconhecido (corrompido ou de versão futura) volta para 'php'.
    if (!isLanguage(parsed.selectedLanguage)) {
      parsed.selectedLanguage = 'php';
    }
    // Migração defensiva (Fase 4): campos opcionais; valor inválido é descartado (volta ao padrão).
    if (parsed.selectedTrack !== undefined && !isTrack(parsed.selectedTrack)) {
      delete parsed.selectedTrack;
    }
    if (parsed.logicLanguage !== undefined && !isLogicLanguage(parsed.logicLanguage)) {
      delete parsed.logicLanguage;
    }
    if (!parsed.streak) {
      parsed.streak = { currentStreak: 0, lastActiveDate: '', activeDates: [] };
    }
    if (!Array.isArray(parsed.completedIds)) {
      parsed.completedIds = [];
    }
    if (!parsed.attempts) {
      parsed.attempts = {};
    } else {
      for (const att of Object.values(parsed.attempts)) {
        if (att.completedAt === undefined) att.completedAt = null;
      }
    }
    if (!parsed.aiChallenges) {
      parsed.aiChallenges = {};
    } else {
      for (const chal of Object.values(parsed.aiChallenges)) {
        if (chal.completedAt === undefined) chal.completedAt = null;
      }
    }

    // Migração defensiva (Fase 3): XP retroativo e badges retroativas
    const { progress: migrated, changed } = migrateProgress(parsed);
    if (changed) saveUserProgress(migrated);
    return migrated;
  } catch (e) {
    console.error('Falha ao carregar progresso local:', e);
    return createDefaultProgress();
  }
}

/**
 * Migração defensiva da gamificação (Fase 3). Idempotente: rodar de novo não muda nada.
 * - Tentativas concluídas sem `xpEarned` (anteriores à Fase 3) recebem o XP retroativo.
 * - Tentativas concluídas sem `completedAt` (dados muito antigos) usam `lastAttemptAt`.
 * - Badges cujas condições já são atendidas são desbloqueadas.
 * Usada na carga local, na mesclagem com o Firestore e na importação de JSON.
 */
export function migrateProgress(progress: UserProgress): { progress: UserProgress; changed: boolean } {
  let changed = false;

  for (const attempt of Object.values(progress.attempts ?? {})) {
    if (!attempt.passed) continue;
    if (!attempt.completedAt && attempt.lastAttemptAt) {
      attempt.completedAt = attempt.lastAttemptAt;
      changed = true;
    }
    if (attempt.xpEarned === undefined) {
      const exercise = getExerciseById(attempt.exerciseId);
      if (exercise) {
        attempt.xpEarned = retroactiveExerciseXp(exercise.difficulty, attempt);
        changed = true;
      }
    }
  }

  for (const attempt of Object.values(progress.aiChallenges ?? {})) {
    if (!attempt.passed) continue;
    if (!attempt.completedAt && attempt.lastAttemptAt) {
      attempt.completedAt = attempt.lastAttemptAt;
      changed = true;
    }
    if (attempt.xpEarned === undefined && attempt.challenge) {
      attempt.xpEarned = retroactiveAiChallengeXp(attempt);
      changed = true;
    }
  }

  if (!Array.isArray(progress.badges)) {
    progress.badges = [];
    changed = true;
  }
  const { badges, newlyUnlocked } = unlockBadges(progress, allExercises, new Date().toISOString());
  if (newlyUnlocked.length > 0) {
    progress.badges = badges;
    changed = true;
  }

  return { progress, changed };
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Falha ao salvar progresso local:', e);
  }
}

/**
 * Records an exercise attempt.
 * The streak is ONLY evaluated and advanced when an exercise is successfully completed (passed === true).
 */
export function recordExerciseAttempt(
  exerciseId: string,
  passed: boolean,
  data: {
    userBlanks?: Record<string, string>;
    userCode?: string;
    hintsUsed?: number;
    revealedSolution?: boolean;
    outputPrediction?: string;
    typeErrorAnswer?: { line: number; reason: number };
    /** Trilha de Lógica: linguagem em que o código foi escrito. */
    logicLanguage?: LogicLanguage;
    /**
     * false para gravações que NÃO são envio de resposta (liberar dica, revelar solução,
     * marcar critério de aceite). Elas não podem consumir a "1ª tentativa" do bônus de XP.
     */
    countAttempt?: boolean;
  }
): UserProgress {
  const current = loadUserProgress();
  const existingAttempt = current.attempts[exerciseId];
  const now = new Date().toISOString();
  const isFirstCompletion = passed && !existingAttempt?.passed;

  const newAttempt: ExerciseAttempt = {
    exerciseId,
    passed: passed || (existingAttempt?.passed ?? false),
    attemptsCount: (existingAttempt?.attemptsCount ?? 0) + (data.countAttempt === false ? 0 : 1),
    completedAt: passed ? (existingAttempt?.completedAt || now) : (existingAttempt?.completedAt ?? null),
    lastAttemptAt: now,
    userBlanks: data.userBlanks ?? existingAttempt?.userBlanks,
    userCode: data.userCode ?? existingAttempt?.userCode,
    hintsUsed: Math.max(data.hintsUsed ?? 0, existingAttempt?.hintsUsed ?? 0),
    revealedSolution: data.revealedSolution || existingAttempt?.revealedSolution || false,
    // Antes da Fase 2 estes campos eram descartados a cada gravação:
    outputPrediction: data.outputPrediction ?? existingAttempt?.outputPrediction,
    checklistDone: existingAttempt?.checklistDone,
    typeErrorAnswer: data.typeErrorAnswer ?? existingAttempt?.typeErrorAnswer,
    xpEarned: existingAttempt?.xpEarned,
    logicLanguage: data.logicLanguage ?? existingAttempt?.logicLanguage,
  };

  // XP: calculado só na PRIMEIRA conclusão e congelado; refazer não acumula.
  if (isFirstCompletion) {
    const exercise = getExerciseById(exerciseId);
    if (exercise) {
      newAttempt.xpEarned = computeExerciseXp({
        difficulty: exercise.difficulty,
        firstTry: newAttempt.attemptsCount === 1,
        hintsUsed: newAttempt.hintsUsed,
        revealedSolution: newAttempt.revealedSolution ?? false,
      }).total;
    }
  }

  current.attempts[exerciseId] = newAttempt;

  if (passed && !current.completedIds.includes(exerciseId)) {
    current.completedIds.push(exerciseId);
  }

  // Centralized Study Streak Logic:
  // Rules 1 to 5 apply strictly upon successfully passing/completing an exercise:
  if (passed) {
    const today = getFortalezaDateString();
    const lastActive = current.streak.lastActiveDate;

    if (!lastActive) {
      // Rule 1: First exercise completed -> streak = 1
      current.streak.currentStreak = 1;
      current.streak.lastActiveDate = today;
    } else {
      const diff = getDaysDifference(lastActive, today);

      if (diff === 0) {
        // Rule 2 & 4: Already studied today -> maintain current streak
        // (Do not double-count multiple exercises in the same day)
      } else if (diff === 1) {
        // Rule 3: Last active date was yesterday -> increment streak by 1
        current.streak.currentStreak += 1;
        current.streak.lastActiveDate = today;
      } else if (diff > 1) {
        // Rule 5: One or more calendar days skipped -> start a new 1-day streak
        current.streak.currentStreak = 1;
        current.streak.lastActiveDate = today;
      } else {
        // Clock skew safeguard
        current.streak.lastActiveDate = today;
      }
    }

    if (!current.streak.activeDates.includes(today)) {
      current.streak.activeDates.push(today);
    }
    current.badges = unlockBadges(current, allExercises, now).badges;
  }

  saveUserProgress(current);
  return current;
}

/**
 * Saves in-progress draft code for an AI Challenge without submitting an attempt or mutating streak.
 */
export function saveAiChallengeDraft(
  challenge: AiChallenge,
  userCode: string,
  unlockedHintsCount: number = 0
): UserProgress {
  const current = loadUserProgress();
  if (!current.aiChallenges) {
    current.aiChallenges = {};
  }

  const existing = current.aiChallenges[challenge.id];
  const now = new Date().toISOString();

  current.aiChallenges[challenge.id] = {
    challengeId: challenge.id,
    challenge,
    userCode,
    evaluation: existing?.evaluation ?? null,
    passed: existing?.passed ?? false,
    score: existing?.score ?? 0,
    attemptsCount: existing?.attemptsCount ?? 0,
    lastAttemptAt: existing?.lastAttemptAt ?? now,
    completedAt: existing?.completedAt ?? null,
    unlockedHintsCount: Math.max(unlockedHintsCount, existing?.unlockedHintsCount ?? 0),
    // Salvar rascunho depois de concluir não pode apagar o XP já ganho
    xpEarned: existing?.xpEarned,
  };

  saveUserProgress(current);
  return current;
}

/**
 * Records an AI Challenge evaluation attempt and integrates with the study streak.
 * Passing score (e.g. >= 7.0 or evaluation.passed === true) advances the streak.
 */
export function recordAiChallengeAttempt(
  challenge: AiChallenge,
  userCode: string,
  evaluation: AiChallengeEvaluation | null,
  unlockedHintsCount: number = 0
): UserProgress {
  const current = loadUserProgress();
  if (!current.aiChallenges) {
    current.aiChallenges = {};
  }

  const existing = current.aiChallenges[challenge.id];
  const now = new Date().toISOString();
  const isPassed = evaluation ? evaluation.passed : (existing?.passed ?? false);
  const score = evaluation ? evaluation.score : (existing?.score ?? 0);

  const attempt: AiChallengeAttempt = {
    challengeId: challenge.id,
    challenge,
    userCode,
    evaluation: evaluation ?? existing?.evaluation ?? null,
    passed: isPassed,
    score: Math.max(score, existing?.score ?? 0),
    attemptsCount: (existing?.attemptsCount ?? 0) + 1,
    lastAttemptAt: now,
    completedAt: isPassed ? (existing?.completedAt || now) : (existing?.completedAt ?? null),
    unlockedHintsCount: Math.max(unlockedHintsCount, existing?.unlockedHintsCount ?? 0),
    xpEarned: existing?.xpEarned,
  };

  // XP: só na primeira aprovação, congelado
  if (isPassed && !existing?.passed) {
    attempt.xpEarned = computeAiChallengeXp({
      difficultyLevel: challenge.difficultyLevel,
      score: attempt.score,
      firstTry: attempt.attemptsCount === 1,
      hintsUsed: attempt.unlockedHintsCount,
    });
  }

  current.aiChallenges[challenge.id] = attempt;

  // If passed, integrate with the centralized streak rules
  if (isPassed) {
    const today = getFortalezaDateString();
    const lastActive = current.streak.lastActiveDate;

    if (!lastActive) {
      current.streak.currentStreak = 1;
      current.streak.lastActiveDate = today;
    } else {
      const diff = getDaysDifference(lastActive, today);

      if (diff === 0) {
        // Already studied today
      } else if (diff === 1) {
        current.streak.currentStreak += 1;
        current.streak.lastActiveDate = today;
      } else if (diff > 1) {
        current.streak.currentStreak = 1;
        current.streak.lastActiveDate = today;
      } else {
        current.streak.lastActiveDate = today;
      }
    }

    if (!current.streak.activeDates.includes(today)) {
      current.streak.activeDates.push(today);
    }
    current.badges = unlockBadges(current, allExercises, now).badges;
  }

  saveUserProgress(current);
  return current;
}

/** Seleciona uma trilha. Trilha de linguagem também atualiza `selectedLanguage`. */
export function setSelectedTrack(track: Track): UserProgress {
  const current = loadUserProgress();
  current.selectedTrack = track;
  if (isLanguage(track)) current.selectedLanguage = track;
  saveUserProgress(current);
  return current;
}

export function setSelectedLanguage(language: Language): UserProgress {
  return setSelectedTrack(language);
}

/** Linguagem preferida para a trilha de Lógica. */
export function setLogicLanguage(language: LogicLanguage): UserProgress {
  const current = loadUserProgress();
  current.logicLanguage = language;
  saveUserProgress(current);
  return current;
}

export function resetProgress(): UserProgress {
  const resetData = createDefaultProgress();
  saveUserProgress(resetData);
  return resetData;
}

export function exportProgressJSON(): string {
  const current = loadUserProgress();
  return JSON.stringify(current, null, 2);
}

export function importProgressJSON(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString) as UserProgress;
    if (parsed && Array.isArray(parsed.completedIds) && parsed.attempts) {
      saveUserProgress(migrateProgress(parsed).progress);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
