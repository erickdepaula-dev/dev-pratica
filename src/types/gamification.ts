import { Difficulty, ExerciseType } from './exercise';

/**
 * Gamificação (Fase 3): XP, níveis de carreira e conquistas.
 *
 * Princípios:
 * - O XP de cada exercício é calculado UMA vez, na primeira conclusão, e congelado em
 *   `ExerciseAttempt.xpEarned` / `AiChallengeAttempt.xpEarned`. Refazer não soma de novo.
 * - O XP total NÃO é armazenado: é a soma dos valores congelados (fonte única de verdade,
 *   sem risco de divergir na sincronização com o Firestore).
 * - Badges desbloqueadas são armazenadas (nunca somem); as condições são declarativas.
 */

export type CareerLevelId = 'iniciante' | 'junior' | 'pleno' | 'senior' | 'staff';

export interface CareerLevel {
  id: CareerLevelId;
  name: string;
  /** XP acumulado mínimo para chegar a este nível. */
  minXp: number;
}

export interface CareerProgress {
  xp: number;
  level: CareerLevel;
  /** null no último nível. */
  nextLevel: CareerLevel | null;
  xpIntoLevel: number;
  /** XP necessário entre o nível atual e o próximo (0 no último nível). */
  xpForNextLevel: number;
  /** 0 a 100. */
  percent: number;
}

/** Fatores que compõem o XP de uma conclusão. */
export interface XpInput {
  difficulty: Difficulty;
  /** Concluiu na primeira tentativa. */
  firstTry: boolean;
  hintsUsed: number;
  revealedSolution: boolean;
}

export interface XpBreakdown {
  base: number;
  firstTryMultiplier: number;
  hintMultiplier: number;
  solutionMultiplier: number;
  total: number;
}

export type XpSource = 'exercicio' | 'desafio_ia';

/** Um ganho de XP já registrado (derivado das tentativas concluídas). */
export interface XpEvent {
  source: XpSource;
  sourceId: string;
  xp: number;
  /** ISO 8601 da conclusão. */
  earnedAt: string;
}

/**
 * Condições declarativas de badge. Para criar uma conquista nova basta compor uma condição
 * existente; um tipo novo de condição exige um `case` em services/badges.ts (o `assertNever`
 * faz o tsc apontar o lugar).
 */
export type BadgeCondition =
  /** Total de exercícios concluídos (qualquer trilha). */
  | { kind: 'concluidos'; min: number }
  /** Maior sequência de dias seguidos de estudo já alcançada (derivada de activeDates). */
  | { kind: 'maior_ofensiva'; dias: number }
  /** Exercícios concluídos em sequência (ordem de conclusão) sem usar dica. */
  | { kind: 'sequencia_sem_dica'; quantidade: number }
  /** Concluiu pelo menos um exercício em N trilhas de LINGUAGEM diferentes (Lógica não conta). */
  | { kind: 'trilhas_distintas'; min: number }
  /** Concluiu 100% de uma trilha em algum nível (ex.: todo o básico de PHP). */
  | { kind: 'nivel_completo' }
  /** Concluiu N exercícios de uma modalidade. */
  | { kind: 'modalidade'; tipo: ExerciseType; quantidade: number }
  /** Concluiu todos os projetos DEV de alguma trilha. */
  | { kind: 'projetos_dev_trilha' }
  /** Atingiu um nível de carreira. */
  | { kind: 'nivel_carreira'; nivel: CareerLevelId };

export interface Badge {
  id: string;
  name: string;
  description: string;
  /** Emoji exibido no grid de conquistas. */
  icon: string;
  condition: BadgeCondition;
}

export interface UnlockedBadge {
  id: string;
  /** ISO 8601. */
  unlockedAt: string;
}
