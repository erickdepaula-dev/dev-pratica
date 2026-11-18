import type { Exercise, Language, LogicLanguage, Track, UserProgress } from '../types/exercise';
import { LANGUAGES } from './language';

/** Todas as trilhas do catálogo, na ordem de exibição (as linguagens + Lógica). */
export const TRACKS = [...LANGUAGES, 'logica'] as const satisfies readonly Track[];

/** Linguagens aceitas na trilha de Lógica, na ordem de exibição. */
export const LOGIC_LANGUAGES = ['javascript', 'typescript'] as const satisfies readonly LogicLanguage[];

export function isTrack(value: unknown): value is Track {
  return typeof value === 'string' && (TRACKS as readonly string[]).includes(value);
}

export function isLogicLanguage(value: unknown): value is LogicLanguage {
  return typeof value === 'string' && (LOGIC_LANGUAGES as readonly string[]).includes(value);
}

/** Trilha selecionada; progresso anterior à Fase 4 não tem o campo e usa a linguagem. */
export function getSelectedTrack(progress: UserProgress): Track {
  return progress.selectedTrack ?? progress.selectedLanguage;
}

/** Linguagem preferida na trilha de Lógica (padrão: JavaScript). */
export function getLogicLanguage(progress: UserProgress): LogicLanguage {
  return progress.logicLanguage ?? 'javascript';
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
