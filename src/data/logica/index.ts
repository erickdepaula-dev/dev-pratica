import { Exercise, LogicExercise } from '../../types/exercise';
import { logicModule01 } from './m01PrimeirosAlgoritmos';
import { logicModule02 } from './m02EstruturasCondicionais';
import { logicModule03 } from './m03EstruturasDeRepeticao';
import { logicModule04 } from './m04VetoresEMatrizes';
import { logicModule05 } from './m05FuncoesEDesafios';

/**
 * Trilha de Lógica (Fase 4) — 160 exercícios independentes de linguagem, resolvidos em
 * JavaScript ou TypeScript (ver `resolveLogicExercise` em src/utils/track.ts).
 * Mapa de origem: docs/fase-4-indice-exercicios.md. Conteúdo entra nas tarefas 4.3 e 4.4,
 * em arquivos por módulo (ex.: m01PrimeirosAlgoritmos.ts) importados aqui.
 * IDs: `logica-<nnn>-<slug>` (100 principais), `logica-c<nn>-<slug>` e `logica-r<nn>-<slug>` (bônus).
 */
export const logicExercises: LogicExercise[] = [
  ...logicModule01,
  ...logicModule02,
  ...logicModule03,
  ...logicModule04,
  ...logicModule05,
];

/** Mesma lista, tipada como Exercise para o agregador geral. */
export const logicTrackExercises: Exercise[] = logicExercises;
