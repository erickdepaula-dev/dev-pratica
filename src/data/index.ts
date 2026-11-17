import { Exercise, Language, Difficulty } from '../types/exercise';
import { phpExercises } from './php';
import { jsExercises } from './js';
import { tsExercises } from './ts';

export const allExercises: Exercise[] = [...phpExercises, ...jsExercises, ...tsExercises];

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

export function getExercisesByLanguage(language: Language): Exercise[] {
  return allExercises.filter(ex => ex.language === language);
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
  return allExercises.filter(ex => ex.language === language && ex.difficulty === difficulty).length;
}

export { phpExercises } from './php';
export { jsExercises } from './js';
export { tsExercises } from './ts';
