import { Exercise } from '../../types/exercise';
import { tsBasicExercises } from './basic';
import { tsIntermediateExercises } from './intermediate';
import { tsAdvancedExercises } from './advanced';
import { tsDevProjects } from './dev';
import { tsBasicModalities } from './modalitiesBasic';
import { tsIntermediateModalities } from './modalitiesIntermediate';
import { tsAdvancedModalities } from './modalitiesAdvanced';
import { tsBasicTypeErrors } from './typeErrorsBasic';
import { tsIntermediateTypeErrors } from './typeErrorsIntermediate';
import { tsAdvancedTypeErrors } from './typeErrorsAdvanced';

/** Trilha TypeScript completa, na mesma ordem de níveis das trilhas JS e PHP. */
export const tsExercises: Exercise[] = [
  ...tsBasicExercises,
  ...tsBasicModalities,
  ...tsBasicTypeErrors,
  ...tsIntermediateExercises,
  ...tsIntermediateModalities,
  ...tsIntermediateTypeErrors,
  ...tsAdvancedExercises,
  ...tsAdvancedModalities,
  ...tsAdvancedTypeErrors,
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
  tsBasicTypeErrors,
  tsIntermediateTypeErrors,
  tsAdvancedTypeErrors,
};
