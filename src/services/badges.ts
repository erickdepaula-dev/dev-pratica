/**
 * Conquistas (badges) declarativas — Fase 3. Funções puras.
 *
 * Para criar uma conquista nova, adicione um item em BADGES compondo uma BadgeCondition
 * existente. Um tipo novo de condição exige um `case` em isConditionMet (o assertNever
 * faz o tsc apontar o lugar).
 */
import type { Exercise, ExerciseAttempt, Language, UserProgress } from '../types/exercise';
import type { Badge, BadgeCondition, UnlockedBadge } from '../types/gamification';
import { assertNever, isLanguage, LANGUAGES } from '../utils/language';
import { trackOf } from '../utils/track';
import { getDaysDifference } from '../utils/dateUtils';
import { CAREER_LEVELS, getCareerProgress, totalXp } from './xp';

export const BADGES: readonly Badge[] = [
  { id: 'primeiro-commit', name: 'Primeiro commit', description: 'Conclua o seu primeiro exercício.', icon: '🌱', condition: { kind: 'concluidos', min: 1 } },
  { id: 'semana-cheia', name: 'Semana cheia', description: 'Estude 7 dias seguidos.', icon: '🔥', condition: { kind: 'maior_ofensiva', dias: 7 } },
  { id: 'mes-de-disciplina', name: 'Mês de disciplina', description: 'Estude 30 dias seguidos.', icon: '🏔️', condition: { kind: 'maior_ofensiva', dias: 30 } },
  { id: 'sem-rede', name: 'Sem rede', description: 'Conclua 10 exercícios seguidos sem usar dica.', icon: '🎯', condition: { kind: 'sequencia_sem_dica', quantidade: 10 } },
  { id: 'poliglota', name: 'Poliglota', description: 'Conclua ao menos um exercício em cada trilha.', icon: '🌎', condition: { kind: 'trilhas_distintas', min: LANGUAGES.length } },
  { id: 'trilha-fechada', name: 'Trilha fechada', description: 'Conclua 100% de uma trilha em um nível.', icon: '🏁', condition: { kind: 'nivel_completo' } },
  { id: 'cacador-de-bugs', name: 'Caçador de bugs', description: 'Conclua 25 exercícios de corrigir erros.', icon: '🐞', condition: { kind: 'modalidade', tipo: 'corrigir_erros', quantidade: 25 } },
  { id: 'compilador-humano', name: 'Compilador humano', description: 'Conclua 25 exercícios de prever a saída.', icon: '🧠', condition: { kind: 'modalidade', tipo: 'prever_saida', quantidade: 25 } },
  { id: 'type-checker', name: 'Type checker', description: 'Conclua 25 exercícios de prever o erro de tipo.', icon: '🔷', condition: { kind: 'modalidade', tipo: 'prever_erro_de_tipo', quantidade: 25 } },
  { id: 'product-owner', name: 'Product Owner', description: 'Conclua todos os projetos DEV de uma trilha.', icon: '📋', condition: { kind: 'projetos_dev_trilha' } },
  { id: 'senioridade', name: 'Senioridade', description: 'Alcance o nível de carreira Sênior.', icon: '🎖️', condition: { kind: 'nivel_carreira', nivel: 'senior' } },
];

/** Dados derivados do progresso, calculados uma vez por avaliação. */
export interface BadgeContext {
  /** Exercícios concluídos, em ordem de conclusão. */
  completed: Array<{ exercise: Exercise; attempt: ExerciseAttempt }>;
  longestStreak: number;
  xp: number;
  catalog: readonly Exercise[];
}

/** Maior sequência de dias consecutivos em activeDates (YYYY-MM-DD, fuso de Fortaleza). */
export function longestStreakFromDates(activeDates: readonly string[]): number {
  const dates = [...new Set(activeDates)].sort();
  let best = 0;
  let current = 0;
  for (let i = 0; i < dates.length; i++) {
    current = i > 0 && getDaysDifference(dates[i - 1], dates[i]) === 1 ? current + 1 : 1;
    best = Math.max(best, current);
  }
  return best;
}

export function buildBadgeContext(progress: UserProgress, catalog: readonly Exercise[]): BadgeContext {
  const byId = new Map(catalog.map(ex => [ex.id, ex]));
  const completed = Object.values(progress.attempts ?? {})
    .filter(a => a.passed)
    .flatMap(attempt => {
      const exercise = byId.get(attempt.exerciseId);
      return exercise ? [{ exercise, attempt }] : [];
    })
    .sort((a, b) => (a.attempt.completedAt ?? '').localeCompare(b.attempt.completedAt ?? ''));
  return {
    completed,
    longestStreak: Math.max(longestStreakFromDates(progress.streak?.activeDates ?? []), progress.streak?.currentStreak ?? 0),
    xp: totalXp(progress),
    catalog,
  };
}

function everyCompletedIn(group: readonly Exercise[], completedIds: ReadonlySet<string>): boolean {
  return group.length > 0 && group.every(ex => completedIds.has(ex.id));
}

export function isConditionMet(condition: BadgeCondition, ctx: BadgeContext): boolean {
  const completedIds = new Set(ctx.completed.map(c => c.exercise.id));
  switch (condition.kind) {
    case 'concluidos':
      return ctx.completed.length >= condition.min;
    case 'maior_ofensiva':
      return ctx.longestStreak >= condition.dias;
    case 'sequencia_sem_dica': {
      let run = 0;
      for (const { attempt } of ctx.completed) {
        run = (attempt.hintsUsed ?? 0) === 0 ? run + 1 : 0;
        if (run >= condition.quantidade) return true;
      }
      return false;
    }
    case 'trilhas_distintas':
      // Só trilhas de linguagem: exercícios de Lógica não contam como "trilha JS"
      return new Set(ctx.completed.map(c => trackOf(c.exercise)).filter(isLanguage)).size >= condition.min;
    case 'nivel_completo': {
      const groups = new Map<string, Exercise[]>();
      for (const ex of ctx.catalog) {
        const key = trackOf(ex) + '/' + ex.difficulty;
        groups.set(key, [...(groups.get(key) ?? []), ex]);
      }
      return [...groups.values()].some(group => everyCompletedIn(group, completedIds));
    }
    case 'modalidade':
      return ctx.completed.filter(c => c.exercise.type === condition.tipo).length >= condition.quantidade;
    case 'projetos_dev_trilha':
      return LANGUAGES.some((language: Language) =>
        everyCompletedIn(ctx.catalog.filter(ex => trackOf(ex) === language && ex.difficulty === 'dev'), completedIds)
      );
    case 'nivel_carreira': {
      const target = CAREER_LEVELS.findIndex(l => l.id === condition.nivel);
      const current = CAREER_LEVELS.findIndex(l => l.id === getCareerProgress(ctx.xp).level.id);
      return target >= 0 && current >= target;
    }
    default:
      return assertNever(condition, 'Condição de badge');
  }
}

/**
 * Acrescenta as badges recém-conquistadas à lista já desbloqueada (que nunca diminui).
 * Retorna a lista completa e as novas, para a UI anunciar.
 */
export function unlockBadges(
  progress: UserProgress,
  catalog: readonly Exercise[],
  now: string
): { badges: UnlockedBadge[]; newlyUnlocked: Badge[] } {
  const current = progress.badges ?? [];
  const owned = new Set(current.map(b => b.id));
  const ctx = buildBadgeContext(progress, catalog);
  const newlyUnlocked = BADGES.filter(b => !owned.has(b.id) && isConditionMet(b.condition, ctx));
  return {
    badges: [...current, ...newlyUnlocked.map(b => ({ id: b.id, unlockedAt: now }))],
    newlyUnlocked,
  };
}
