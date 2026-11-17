import { Exercise, Language, Difficulty, Track } from '../types/exercise';
import { phpExercises } from './php';
import { jsExercises } from './js';
import { tsExercises } from './ts';
import { logicTrackExercises } from './logica';

export const allExercises: Exercise[] = [...phpExercises, ...jsExercises, ...tsExercises, ...logicTrackExercises];

/** IDs que aparecem mais de uma vez. O progresso salvo é indexado por ID, então isso deve ser sempre vazio. */
export function findDuplicateExerciseIds(exercises: Exercise[] = allExercises): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const { id } of exercises) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  return [...duplicates];
}

if (import.meta.env?.DEV) {
  const duplicates = findDuplicateExerciseIds();
  if (duplicates.length > 0) {
    console.error('[DevPrática] IDs de exercício duplicados:', duplicates);
  }
}

/**
 * Exercícios da trilha de uma linguagem. Exercícios da trilha de Lógica (Fase 4) ficam de fora:
 * eles têm `language: 'javascript'` como variante padrão, mas não pertencem à trilha JS.
 */
export function getExercisesByLanguage(language: Language): Exercise[] {
  return allExercises.filter(ex => ex.language === language && ex.track === undefined);
}

/** Exercícios de uma trilha do catálogo (uma linguagem ou Lógica). */
export function getExercisesByTrack(track: Track): Exercise[] {
  return track === 'logica' ? allExercises.filter(ex => ex.track === 'logica') : getExercisesByLanguage(track);
}

export function getExerciseById(id: string): Exercise | undefined {
  return allExercises.find(ex => ex.id === id);
}

export function getAvailableTopics(language: Language): string[] {
  const exercises = getExercisesByLanguage(language);
  const topics = new Set<string>();
  exercises.forEach(ex => topics.add(ex.topic));
  return Array.from(topics);
}

export function getDifficultyCount(language: Language, difficulty: Difficulty): number {
  return getExercisesByLanguage(language).filter(ex => ex.difficulty === difficulty).length;
}

export { phpExercises } from './php';
export { jsExercises } from './js';
export { tsExercises } from './ts';
