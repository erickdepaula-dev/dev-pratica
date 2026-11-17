import { Exercise, Language, Difficulty } from '../types/exercise';
import { phpExercises } from './php';
import { jsExercises } from './js';

export const allExercises: Exercise[] = [...phpExercises, ...jsExercises];

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
