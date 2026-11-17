import { Language, UserProgress, ExerciseAttempt } from '../types/exercise';
import { AiChallenge, AiChallengeAttempt, AiChallengeEvaluation } from '../types/aiChallenge';
import { getFortalezaDateString, getDaysDifference } from '../utils/dateUtils';

const STORAGE_KEY = 'devpratica_user_progress_v1';

const defaultProgress: UserProgress = {
  selectedLanguage: 'php',
  completedIds: [],
  attempts: {},
  aiChallenges: {},
  streak: {
    currentStreak: 0,
    lastActiveDate: '',
    activeDates: [],
  },
};

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
      saveUserProgress(defaultProgress);
      return defaultProgress;
    }
    const parsed = JSON.parse(raw) as UserProgress;

    // Sanitize defaults if corrupted
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
        if (att.completedAt === undefined) att.completedAt = null as any;
      }
    }
    if (!parsed.aiChallenges) {
      parsed.aiChallenges = {};
    } else {
      for (const chal of Object.values(parsed.aiChallenges)) {
        if (chal.completedAt === undefined) chal.completedAt = null;
      }
    }

    return parsed;
  } catch (e) {
    console.error('Falha ao carregar progresso local:', e);
    return defaultProgress;
  }
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
  }
): UserProgress {
  const current = loadUserProgress();
  const existingAttempt = current.attempts[exerciseId];
  const now = new Date().toISOString();

  const newAttempt: ExerciseAttempt = {
    exerciseId,
    passed: passed || (existingAttempt?.passed ?? false),
    attemptsCount: (existingAttempt?.attemptsCount ?? 0) + 1,
    completedAt: passed ? (existingAttempt?.completedAt || now) : (existingAttempt?.completedAt ?? null),
    lastAttemptAt: now,
    userBlanks: data.userBlanks ?? existingAttempt?.userBlanks,
    userCode: data.userCode ?? existingAttempt?.userCode,
    hintsUsed: Math.max(data.hintsUsed ?? 0, existingAttempt?.hintsUsed ?? 0),
    revealedSolution: data.revealedSolution || existingAttempt?.revealedSolution || false,
  };

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
  };

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
  }

  saveUserProgress(current);
  return current;
}

export function setSelectedLanguage(language: Language): UserProgress {
  const current = loadUserProgress();
  current.selectedLanguage = language;
  saveUserProgress(current);
  return current;
}

export function resetProgress(): UserProgress {
  const resetData: UserProgress = {
    ...defaultProgress,
    streak: {
      currentStreak: 0,
      lastActiveDate: '',
      activeDates: [],
    },
  };
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
      saveUserProgress(parsed);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
