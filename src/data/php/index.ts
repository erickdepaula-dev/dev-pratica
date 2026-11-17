import { Exercise } from '../../types/exercise';
import { phpBasicExercises } from './basic';
import { phpIntermediateExercises } from './intermediate';
import { phpAdvancedExercises } from './advanced';
import { phpDevProjects } from './dev';
import { phpBasicModalities } from './modalitiesBasic';
import { phpIntermediateModalities } from './modalitiesIntermediate';
import { phpAdvancedModalities } from './modalitiesAdvanced';

export const phpExercises: Exercise[] = [
  ...phpBasicExercises,
  ...phpBasicModalities,
  ...phpIntermediateExercises,
  ...phpIntermediateModalities,
  ...phpAdvancedExercises,
  ...phpAdvancedModalities,
  ...phpDevProjects,
];

export {
  phpBasicExercises,
  phpIntermediateExercises,
  phpAdvancedExercises,
  phpDevProjects,
  phpBasicModalities,
  phpIntermediateModalities,
  phpAdvancedModalities,
};
