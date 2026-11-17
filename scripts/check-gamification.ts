/**
 * Testes de sanidade da gamificação (Fase 3): XP, níveis e badges.
 * Uso: npm run check:xp
 *
 * Usa node:assert com cenários construídos à mão (catálogo e progresso falsos), e no fim
 * imprime a calibração dos níveis contra o volume real de exercícios.
 */
import assert from 'node:assert/strict';
import { allExercises } from '../src/data/index';
import {
  CAREER_LEVELS,
  XP_BASE,
  collectXpEvents,
  computeAiChallengeXp,
  computeExerciseXp,
  getCareerProgress,
  potentialExerciseXp,
  retroactiveExerciseXp,
  totalXp,
} from '../src/services/xp';
import { BADGES, buildBadgeContext, isConditionMet, longestStreakFromDates, unlockBadges } from '../src/services/badges';
import { migrateProgress } from '../src/services/storage';
import type { Exercise, ExerciseAttempt, UserProgress } from '../src/types/exercise';

let passed = 0;
function test(name: string, fn: () => void): void {
  fn();
  passed++;
  console.log('✓ ' + name);
}

// ---------------------------------------------------------------- XP
test('XP base por dificuldade', () => {
  assert.equal(computeExerciseXp({ difficulty: 'basico', firstTry: false, hintsUsed: 0, revealedSolution: false }).total, 10);
  assert.equal(computeExerciseXp({ difficulty: 'dev', firstTry: false, hintsUsed: 0, revealedSolution: false }).total, 120);
});

test('1ª tentativa multiplica por 1.5', () => {
  assert.equal(computeExerciseXp({ difficulty: 'intermediario', firstTry: true, hintsUsed: 0, revealedSolution: false }).total, 38); // 37.5 → 38
  assert.equal(potentialExerciseXp('avancado'), 75);
});

test('Dicas: × 0.8 por dica, com piso de × 0.5', () => {
  const xp = (h: number) => computeExerciseXp({ difficulty: 'avancado', firstTry: false, hintsUsed: h, revealedSolution: false });
  assert.equal(xp(1).total, 40); // 50 × 0.8
  assert.equal(xp(2).total, 32); // 50 × 0.64
  assert.equal(xp(3).total, 26); // 0.8³ = 0.512, ainda acima do piso
  assert.equal(xp(4).hintMultiplier, 0.5); // 0.8⁴ = 0.4096 → piso 0.5
  assert.equal(xp(10).total, 25);
});

test('Revelar a solução multiplica por 0.2', () => {
  assert.equal(computeExerciseXp({ difficulty: 'dev', firstTry: false, hintsUsed: 0, revealedSolution: true }).total, 24);
});

test('XP retroativo ignora o fator de solução (dado antigo ambíguo)', () => {
  const att: ExerciseAttempt = { exerciseId: 'x', passed: true, attemptsCount: 1, lastAttemptAt: '', hintsUsed: 0, revealedSolution: true };
  assert.equal(retroactiveExerciseXp('basico', att), 15);
});

test('Desafio IA: proporcional à nota', () => {
  assert.equal(computeAiChallengeXp({ difficultyLevel: 5, score: 10, firstTry: false, hintsUsed: 0 }), 100);
  assert.equal(computeAiChallengeXp({ difficultyLevel: 3, score: 7, firstTry: false, hintsUsed: 0 }), 25); // 24.5 → 25
});

// ---------------------------------------------------------------- Níveis
test('Níveis de carreira e porcentagem', () => {
  assert.equal(getCareerProgress(0).level.id, 'iniciante');
  assert.equal(getCareerProgress(399).level.id, 'iniciante');
  assert.equal(getCareerProgress(400).level.id, 'junior');
  const p = getCareerProgress(950);
  assert.equal(p.level.id, 'junior');
  assert.equal(p.percent, 50); // (950-400)/(1500-400)
  const top = getCareerProgress(99999);
  assert.equal(top.level.id, 'staff');
  assert.equal(top.nextLevel, null);
  assert.equal(top.percent, 100);
});

// ---------------------------------------------------------------- Progresso falso
const catalogo: Exercise[] = [
  ['php-a', 'php', 'basico', 'lacunas'],
  ['php-b', 'php', 'basico', 'corrigir_erros'],
  ['js-a', 'javascript', 'basico', 'prever_saida'],
  ['ts-a', 'typescript', 'basico', 'prever_erro_de_tipo'],
  ['ts-dev', 'typescript', 'dev', 'codigo_livre'],
].map(([id, language, difficulty, type]) => ({
  id, language, difficulty, type, topic: '', title: id, summary: '', description: '', realWorldContext: '',
  goal: '', templateCode: '', solutionCode: '', hints: [], testCases: [], explanation: '',
}) as Exercise);

function tentativa(exerciseId: string, completedAt: string, xpEarned: number, hintsUsed = 0): ExerciseAttempt {
  return { exerciseId, passed: true, attemptsCount: 1, completedAt, lastAttemptAt: completedAt, hintsUsed, xpEarned };
}

function progresso(attempts: ExerciseAttempt[], activeDates: string[] = []): UserProgress {
  return {
    selectedLanguage: 'php',
    completedIds: attempts.map(a => a.exerciseId),
    attempts: Object.fromEntries(attempts.map(a => [a.exerciseId, a])),
    streak: { currentStreak: 0, lastActiveDate: activeDates.at(-1) ?? '', activeDates },
  };
}

test('XP total = soma dos valores congelados, eventos em ordem cronológica', () => {
  const p = progresso([tentativa('js-a', '2026-11-02T10:00:00Z', 15), tentativa('php-a', '2026-11-01T10:00:00Z', 10)]);
  assert.equal(totalXp(p), 25);
  assert.deepEqual(collectXpEvents(p).map(e => e.sourceId), ['php-a', 'js-a']);
});

test('Tentativa não concluída ou sem xpEarned não soma XP', () => {
  const pendente: ExerciseAttempt = { exerciseId: 'php-b', passed: false, attemptsCount: 3, lastAttemptAt: '', hintsUsed: 0 };
  const p = progresso([tentativa('php-a', '2026-11-01T10:00:00Z', 10)]);
  p.attempts['php-b'] = pendente;
  assert.equal(totalXp(p), 10);
});

test('Maior ofensiva derivada de activeDates (com lacunas e duplicatas)', () => {
  assert.equal(longestStreakFromDates([]), 0);
  assert.equal(longestStreakFromDates(['2026-11-01', '2026-11-02', '2026-11-02', '2026-11-04', '2026-11-05', '2026-11-06']), 3);
  assert.equal(longestStreakFromDates(['2026-12-30', '2026-12-31', '2027-01-01']), 3); // virada de ano
});

const badge = (id: string) => {
  const b = BADGES.find(x => x.id === id);
  assert.ok(b, 'badge inexistente: ' + id);
  return b;
};

test('Badges: primeiro commit, poliglota, trilha fechada, product owner', () => {
  const vazio = buildBadgeContext(progresso([]), catalogo);
  assert.equal(isConditionMet(badge('primeiro-commit').condition, vazio), false);

  const tres = buildBadgeContext(progresso([tentativa('php-a', '1', 1), tentativa('js-a', '2', 1), tentativa('ts-a', '3', 1)]), catalogo);
  assert.equal(isConditionMet(badge('primeiro-commit').condition, tres), true);
  assert.equal(isConditionMet(badge('poliglota').condition, tres), true);
  // js/basico tem só js-a e ts/basico só ts-a → nível completo
  assert.equal(isConditionMet(badge('trilha-fechada').condition, tres), true);
  assert.equal(isConditionMet(badge('product-owner').condition, tres), false);

  const dev = buildBadgeContext(progresso([tentativa('ts-dev', '1', 1)]), catalogo);
  assert.equal(isConditionMet(badge('product-owner').condition, dev), true);
});

test('Badge "Sem rede": sequência em ordem de conclusão, zera ao usar dica', () => {
  const base = Array.from({ length: 10 }, (_, i) => ({ ...catalogo[0], id: 'e' + i }));
  const semDica = base.map((ex, i) => tentativa(ex.id, '2026-11-01T10:' + String(i).padStart(2, '0'), 1));
  assert.equal(isConditionMet(badge('sem-rede').condition, buildBadgeContext(progresso(semDica), base)), true);
  const comDica = semDica.map((a, i) => (i === 5 ? { ...a, hintsUsed: 1 } : a));
  assert.equal(isConditionMet(badge('sem-rede').condition, buildBadgeContext(progresso(comDica), base)), false);
});

test('Badges de ofensiva e de nível de carreira', () => {
  const dias = Array.from({ length: 7 }, (_, i) => '2026-11-' + String(i + 1).padStart(2, '0'));
  const ctx = buildBadgeContext(progresso([tentativa('php-a', '1', 4000)], dias), catalogo);
  assert.equal(isConditionMet(badge('semana-cheia').condition, ctx), true);
  assert.equal(isConditionMet(badge('mes-de-disciplina').condition, ctx), false);
  assert.equal(isConditionMet(badge('senioridade').condition, ctx), true);
});

test('unlockBadges: só acrescenta as novas e nunca remove', () => {
  const p = progresso([tentativa('php-a', '1', 10)]);
  const r1 = unlockBadges(p, catalogo, 'T1');
  assert.deepEqual(r1.newlyUnlocked.map(b => b.id), ['primeiro-commit']);
  const r2 = unlockBadges({ ...p, badges: r1.badges }, catalogo, 'T2');
  assert.equal(r2.newlyUnlocked.length, 0);
  assert.equal(r2.badges[0].unlockedAt, 'T1');
  // Mesmo com o progresso "zerado", a badge permanece
  const r3 = unlockBadges({ ...progresso([]), badges: r1.badges }, catalogo, 'T3');
  assert.deepEqual(r3.badges.map(b => b.id), ['primeiro-commit']);
});

test('IDs de badge únicos', () => {
  assert.equal(new Set(BADGES.map(b => b.id)).size, BADGES.length);
});

// ---------------------------------------------------------------- Migração (dados reais)
test('Migração: progresso de antes da Fase 3 recebe XP e badges retroativos, de forma idempotente', () => {
  const dias = Array.from({ length: 8 }, (_, i) => '2026-10-' + String(i + 10).padStart(2, '0'));
  const antigo = {
    selectedLanguage: 'php',
    completedIds: ['php-basico-01', 'js-basico-01'],
    attempts: {
      // 1ª tentativa, sem dica → 10 × 1.5 = 15
      'php-basico-01': { exerciseId: 'php-basico-01', passed: true, attemptsCount: 1, completedAt: '2026-10-10T12:00:00Z', lastAttemptAt: '2026-10-10T12:00:00Z', hintsUsed: 0, revealedSolution: true },
      // 3 tentativas, 1 dica, sem completedAt (dado muito antigo) → 10 × 0.8 = 8
      'js-basico-01': { exerciseId: 'js-basico-01', passed: true, attemptsCount: 3, completedAt: null, lastAttemptAt: '2026-10-11T12:00:00Z', hintsUsed: 1 },
      // não concluída → sem XP
      'php-basico-02': { exerciseId: 'php-basico-02', passed: false, attemptsCount: 2, completedAt: null, lastAttemptAt: '2026-10-12T12:00:00Z', hintsUsed: 0 },
    },
    aiChallenges: {},
    streak: { currentStreak: 0, lastActiveDate: dias.at(-1) ?? '', activeDates: dias },
  } as UserProgress;

  const r1 = migrateProgress(structuredClone(antigo));
  assert.equal(r1.changed, true);
  assert.equal(r1.progress.attempts['php-basico-01'].xpEarned, 15);
  assert.equal(r1.progress.attempts['js-basico-01'].xpEarned, 8);
  assert.equal(r1.progress.attempts['js-basico-01'].completedAt, '2026-10-11T12:00:00Z');
  assert.equal(r1.progress.attempts['php-basico-02'].xpEarned, undefined);
  assert.equal(totalXp(r1.progress), 23);
  const ids = (r1.progress.badges ?? []).map(b => b.id);
  assert.ok(ids.includes('primeiro-commit'));
  assert.ok(ids.includes('semana-cheia'), 'ofensiva antiga de 8 dias deve render a badge');

  // Idempotente: rodar de novo não muda nada (nem as datas de desbloqueio)
  const r2 = migrateProgress(structuredClone(r1.progress));
  assert.equal(r2.changed, false);
  assert.deepEqual(r2.progress, r1.progress);
});

test('Migração não recalcula XP já congelado', () => {
  const p = progresso([tentativa('php-basico-01', '2026-11-01T10:00:00Z', 3)]);
  assert.equal(migrateProgress(p).progress.attempts['php-basico-01'].xpEarned, 3);
});

// ---------------------------------------------------------------- Calibração
console.log(`\n${passed} testes passaram.\n\nCalibração contra o volume real:`);
const porTrilha = new Map<string, number>();
for (const ex of allExercises) porTrilha.set(ex.language, (porTrilha.get(ex.language) ?? 0) + XP_BASE[ex.difficulty]);
const total = [...porTrilha.values()].reduce((a, b) => a + b, 0);
console.table(Object.fromEntries([...porTrilha].map(([k, v]) => [k, { 'XP base': v, 'com 1ª tentativa': v * 1.5 }])));
console.table(
  CAREER_LEVELS.map(l => ({ nivel: l.name, 'XP mínimo': l.minXp, '% do XP base total': Math.round((l.minXp / total) * 100) + '%' }))
);
