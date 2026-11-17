import { Exercise } from '../../types/exercise';
import { tsBasicExercises } from './basic';
import { tsIntermediateExercises } from './intermediate';
import { tsAdvancedExercises } from './advanced';
import { tsDevProjects } from './dev';
import { tsBasicModalities } from './modalitiesBasic';
import { tsIntermediateModalities } from './modalitiesIntermediate';
import { tsAdvancedModalities } from './modalitiesAdvanced';

/** Trilha TypeScript completa, na mesma ordem de níveis das trilhas JS e PHP. */
export const tsExercises: Exercise[] = [
  ...tsBasicExercises,
  ...tsBasicModalities,
  ...tsIntermediateExercises,
  ...tsIntermediateModalities,
  ...tsAdvancedExercises,
  ...tsAdvancedModalities,
  ...tsDevProjects,
];

export {
  tsBasicExercises,
  tsIntermediateExercises,
  tsAdvancedExercises,
  tsDevProjects,
  tsBasicModalities,
  tsIntermediateModalities,
  tsAdvancedModalities,
};
