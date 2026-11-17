import { Difficulty, ExerciseType } from '../types/exercise';

/**
 * Tema visual por modalidade e por dificuldade de exercício.
 *
 * Fonte única para rótulos e cores de badges — junto com `src/styles/tokens.css`,
 * é o único lugar onde cores de modalidade/dificuldade devem ser definidas.
 * As classes ficam como strings literais para o Tailwind conseguir detectá-las.
 */

export interface BadgeTheme {
  /** Rótulo completo (ex.: "Completar Lacunas"). */
  label: string;
  /** Rótulo curto, para chips e cards compactos (ex.: "Lacunas"). */
  shortLabel: string;
  /** Classes de fundo + texto + borda do badge. */
  badgeClass: string;
  /** Classe de texto isolada, para ícones e destaques. */
  textClass: string;
}

const EXERCISE_TYPE_THEME: Record<ExerciseType, BadgeTheme> = {
  lacunas: {
    label: 'Completar Lacunas',
    shortLabel: 'Lacunas',
    badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    textClass: 'text-indigo-400',
  },
  corrigir_erros: {
    label: 'Corrigir Erros',
    shortLabel: 'Corrigir Erro',
    badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    textClass: 'text-rose-400',
  },
  prever_saida: {
    label: 'Prever a Saída',
    shortLabel: 'Prever Saída',
    badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    textClass: 'text-amber-400',
  },
  desafio_pratico: {
    label: 'Desafio Prático',
    shortLabel: 'Desafio Prático',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    textClass: 'text-emerald-400',
  },
  codigo_livre: {
    label: 'Código Livre',
    shortLabel: 'Código Livre',
    badgeClass: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    textClass: 'text-cyan-400',
  },
};

const FALLBACK_TYPE_THEME: BadgeTheme = {
  label: 'Exercício',
  shortLabel: 'Exercício',
  badgeClass: 'bg-surface text-muted border-subtle',
  textClass: 'text-muted',
};

const DIFFICULTY_THEME: Record<Difficulty, BadgeTheme> = {
  basico: {
    label: 'Básico',
    shortLabel: 'Básico',
    badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    textClass: 'text-emerald-400',
  },
  intermediario: {
    label: 'Intermediário',
    shortLabel: 'Intermediário',
    badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    textClass: 'text-sky-400',
  },
  avancado: {
    label: 'Avançado',
    shortLabel: 'Avançado',
    badgeClass: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    textClass: 'text-violet-400',
  },
  dev: {
    label: 'DEV • Projeto PO',
    shortLabel: 'DEV',
    badgeClass: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30',
    textClass: 'text-fuchsia-400',
  },
};

/** Tema da modalidade. Aceita `string` para tolerar dados antigos/desconhecidos. */
export function getExerciseTypeTheme(type: ExerciseType | string): BadgeTheme {
  return EXERCISE_TYPE_THEME[type as ExerciseType] ?? FALLBACK_TYPE_THEME;
}

/** Tema da dificuldade. Aceita `string` para tolerar dados antigos/desconhecidos. */
export function getDifficultyTheme(difficulty: Difficulty | string): BadgeTheme {
  return (
    DIFFICULTY_THEME[difficulty as Difficulty] ?? {
      ...FALLBACK_TYPE_THEME,
      label: difficulty,
      shortLabel: difficulty,
    }
  );
}
