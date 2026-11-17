import { Exercise } from '../../types/exercise';
import { jsBasicExercises } from './basic';
import { jsIntermediateExercises } from './intermediate';
import { jsAdvancedExercises } from './advanced';
import { jsDevProjects } from './dev';
import { jsBasicModalities } from './modalitiesBasic';
import { jsIntermediateModalities } from './modalitiesIntermediate';
import { jsAdvancedModalities } from './modalitiesAdvanced';

export const jsExercises: Exercise[] = [
  ...jsBasicExercises,
  ...jsBasicModalities,
  ...jsIntermediateExercises,
  ...jsIntermediateModalities,
  ...jsAdvancedExercises,
  ...jsAdvancedModalities,
  ...jsDevProjects,
];

export {
  jsBasicExercises,
  jsIntermediateExercises,
  jsAdvancedExercises,
  jsDevProjects,
  jsBasicModalities,
  jsIntermediateModalities,
  jsAdvancedModalities,
};
