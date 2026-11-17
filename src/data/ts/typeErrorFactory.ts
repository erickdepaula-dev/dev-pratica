import { Difficulty, TsExercise, TypeErrorChallenge } from '../../types/exercise';

/** Campos que variam em um exercício de 'prever_erro_de_tipo'. */
export interface TypeErrorSpec<D extends Difficulty> {
  id: `ts-${D}-${string}`;
  difficulty: D;
  topic: string;
  title: string;
  summary: string;
  realWorldContext: string;
  /** Trecho com exatamente UM erro de compilação (conferido por npm run check:ts). */
  code: string;
  /** O mesmo trecho corrigido (exibido na aba Solução). */
  fixedCode: string;
  challenge: TypeErrorChallenge;
  hints: string[];
  explanation: string;
}

/** Monta um exercício 'prever_erro_de_tipo' preenchendo os campos fixos da modalidade. */
export function erroDeTipo<D extends Difficulty>(spec: TypeErrorSpec<D>): TsExercise<D> {
  return {
    id: spec.id,
    language: 'typescript',
    difficulty: spec.difficulty,
    type: 'prever_erro_de_tipo',
    topic: spec.topic,
    title: spec.title,
    summary: spec.summary,
    realWorldContext: spec.realWorldContext,
    description:
      'Este trecho não compila. Sem executar nada, leia o código como o compilador: clique na linha em que o TypeScript acusa o erro e escolha o motivo.',
    goal: 'Identificar a linha e o motivo do erro de compilação.',
    codeToPredict: spec.code,
    templateCode: spec.code,
    solutionCode: spec.fixedCode,
    typeErrorChallenge: spec.challenge,
    hints: spec.hints,
    testCases: [],
    explanation: spec.explanation,
  };
}
