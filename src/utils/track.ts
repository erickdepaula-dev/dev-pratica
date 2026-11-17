import type { Exercise, Language, LogicLanguage, Track } from '../types/exercise';
import { LANGUAGES } from './language';

/** Todas as trilhas do catálogo, na ordem de exibição (as linguagens + Lógica). */
export const TRACKS = [...LANGUAGES, 'logica'] as const satisfies readonly Track[];

/** Linguagens aceitas na trilha de Lógica, na ordem de exibição. */
export const LOGIC_LANGUAGES = ['javascript', 'typescript'] as const satisfies readonly LogicLanguage[];

export function isTrack(value: unknown): value is Track {
  return typeof value === 'string' && (TRACKS as readonly string[]).includes(value);
}

export function isLogicExercise(exercise: Exercise): boolean {
  return exercise.track === 'logica';
}

/** Trilha a que o exercício pertence (Lógica, ou a própria linguagem). */
export function trackOf(exercise: Exercise): Track {
  return exercise.track ?? exercise.language;
}

/**
 * Monta a versão de um exercício de Lógica na linguagem escolhida pelo aluno. O resultado é
 * um Exercise comum daquela linguagem — avaliador, compilador TS, tutor e XP funcionam sem
 * nenhum caso especial. Exercícios fora da trilha de Lógica são devolvidos como estão.
 */
export function resolveLogicExercise(exercise: Exercise, language: LogicLanguage): Exercise {
  const variant = exercise.logicVariants?.[language];
  if (!variant) return exercise;
  return {
    ...exercise,
    language: language satisfies Language,
    templateCode: variant.templateCode,
    solutionCode: variant.solutionCode,
    typeAssertions: variant.typeAssertions,
  };
}
