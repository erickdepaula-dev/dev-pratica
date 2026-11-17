/**
 * Cálculo de XP e níveis de carreira (Fase 3). Funções puras — sem IO.
 * O modelo está documentado em docs/fase-3-gamificacao.md.
 */
import type { Difficulty, ExerciseAttempt, UserProgress } from '../types/exercise';
import type { AiChallengeAttempt } from '../types/aiChallenge';
import type {
  CareerLevel,
  CareerProgress,
  XpBreakdown,
  XpEvent,
  XpInput,
} from '../types/gamification';

export const XP_BASE: Record<Difficulty, number> = {
  basico: 10,
  intermediario: 25,
  avancado: 50,
  dev: 120,
};

export const FIRST_TRY_MULTIPLIER = 1.5;
/** Cada dica multiplica por 0.8, com piso de 0.5. */
export const HINT_MULTIPLIER = 0.8;
export const HINT_MULTIPLIER_FLOOR = 0.5;
export const SOLUTION_MULTIPLIER = 0.2;

/**
 * Calibrado contra o volume real (2026-11-17): XP base total das 3 trilhas = 9.200
 * (13.800 com bônus de 1ª tentativa em tudo). Júnior ≈ básico de uma trilha;
 * Sênior ≈ uma trilha e meia; Staff ≈ as três trilhas. Ajustar após a Fase 4.
 */
export const CAREER_LEVELS: readonly CareerLevel[] = [
  { id: 'iniciante', name: 'Iniciante', minXp: 0 },
  { id: 'junior', name: 'Júnior', minXp: 400 },
  { id: 'pleno', name: 'Pleno', minXp: 1500 },
  { id: 'senior', name: 'Sênior', minXp: 4000 },
  { id: 'staff', name: 'Staff', minXp: 8000 },
];

/** Desafios com IA: base por nível de dificuldade (1–5), proporcional à nota (0–10). */
export const AI_CHALLENGE_XP_BASE: Record<1 | 2 | 3 | 4 | 5, number> = {
  1: 10,
  2: 20,
  3: 35,
  4: 60,
  5: 100,
};

function hintMultiplier(hintsUsed: number): number {
  return Math.max(HINT_MULTIPLIER_FLOOR, HINT_MULTIPLIER ** Math.max(0, hintsUsed));
}

/** XP de uma conclusão de exercício, com o detalhamento de cada fator. */
export function computeExerciseXp(input: XpInput): XpBreakdown {
  const base = XP_BASE[input.difficulty];
  const firstTryMultiplier = input.firstTry ? FIRST_TRY_MULTIPLIER : 1;
  const hint = hintMultiplier(input.hintsUsed);
  const solutionMultiplier = input.revealedSolution ? SOLUTION_MULTIPLIER : 1;
  return {
    base,
    firstTryMultiplier,
    hintMultiplier: hint,
    solutionMultiplier,
    total: Math.round(base * firstTryMultiplier * hint * solutionMultiplier),
  };
}

/** Maior XP possível de um exercício (1ª tentativa, sem dicas) — exibido no card. */
export function potentialExerciseXp(difficulty: Difficulty): number {
  return computeExerciseXp({ difficulty, firstTry: true, hintsUsed: 0, revealedSolution: false }).total;
}

/** XP de um Desafio com IA concluído. */
export function computeAiChallengeXp(params: {
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  score: number;
  firstTry: boolean;
  hintsUsed: number;
}): number {
  const base = AI_CHALLENGE_XP_BASE[params.difficultyLevel] ?? AI_CHALLENGE_XP_BASE[3];
  const scoreFactor = Math.min(10, Math.max(0, params.score)) / 10;
  const firstTry = params.firstTry ? FIRST_TRY_MULTIPLIER : 1;
  return Math.round(base * scoreFactor * firstTry * hintMultiplier(params.hintsUsed));
}

/**
 * XP retroativo de uma tentativa concluída antes da Fase 3 (sem xpEarned).
 * Os dados antigos não distinguem "revelou a solução antes de acertar" de "a solução foi
 * exibida automaticamente depois do acerto", então o fator de solução é ignorado aqui —
 * na dúvida, o aluno não é penalizado. Dicas e 1ª tentativa usam os dados gravados.
 */
export function retroactiveExerciseXp(difficulty: Difficulty, attempt: ExerciseAttempt): number {
  return computeExerciseXp({
    difficulty,
    firstTry: attempt.attemptsCount <= 1,
    hintsUsed: attempt.hintsUsed ?? 0,
    revealedSolution: false,
  }).total;
}

export function retroactiveAiChallengeXp(attempt: AiChallengeAttempt): number {
  return computeAiChallengeXp({
    difficultyLevel: attempt.challenge.difficultyLevel,
    score: attempt.score,
    firstTry: attempt.attemptsCount <= 1,
    hintsUsed: attempt.unlockedHintsCount ?? 0,
  });
}

/** Todos os ganhos de XP registrados, do mais antigo para o mais recente. */
export function collectXpEvents(progress: UserProgress): XpEvent[] {
  const events: XpEvent[] = [];
  for (const attempt of Object.values(progress.attempts ?? {})) {
    if (attempt.passed && attempt.xpEarned && attempt.completedAt) {
      events.push({ source: 'exercicio', sourceId: attempt.exerciseId, xp: attempt.xpEarned, earnedAt: attempt.completedAt });
    }
  }
  for (const attempt of Object.values(progress.aiChallenges ?? {})) {
    if (attempt.passed && attempt.xpEarned && attempt.completedAt) {
      events.push({ source: 'desafio_ia', sourceId: attempt.challengeId, xp: attempt.xpEarned, earnedAt: attempt.completedAt });
    }
  }
  return events.sort((a, b) => a.earnedAt.localeCompare(b.earnedAt));
}

export function totalXp(progress: UserProgress): number {
  return collectXpEvents(progress).reduce((sum, e) => sum + e.xp, 0);
}

export function getCareerProgress(xp: number): CareerProgress {
  let index = 0;
  for (let i = 0; i < CAREER_LEVELS.length; i++) {
    if (xp >= CAREER_LEVELS[i].minXp) index = i;
  }
  const level = CAREER_LEVELS[index];
  const nextLevel = CAREER_LEVELS[index + 1] ?? null;
  const xpIntoLevel = xp - level.minXp;
  const xpForNextLevel = nextLevel ? nextLevel.minXp - level.minXp : 0;
  const percent = nextLevel ? Math.min(100, Math.round((xpIntoLevel / xpForNextLevel) * 100)) : 100;
  return { xp, level, nextLevel, xpIntoLevel, xpForNextLevel, percent };
}
