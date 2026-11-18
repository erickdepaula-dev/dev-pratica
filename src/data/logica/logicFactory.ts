import { ExerciseType, LogicExercise } from '../../types/exercise';

/**
 * Especificação compacta de um exercício de Lógica. Quase sempre o corpo da função é igual
 * em JS e TS — só a assinatura muda (o TS ganha os tipos). O helper `logica()` monta o
 * template ("// Escreva aqui o seu algoritmo") e a solução das duas variantes a partir dela.
 */
export type LogicSpec = Omit<
  LogicExercise,
  'track' | 'language' | 'type' | 'templateCode' | 'solutionCode' | 'logicVariants'
> & {
  /** Padrão: 'codigo_livre'. */
  type?: ExerciseType;
  /** Linha da assinatura, sem a chave: `function somar(a, b)` / `function somar(a: number, b: number): number`. */
  signature: { javascript: string; typescript: string };
  /** Corpo da solução de referência (já indentado com 2 espaços), igual nas duas linguagens. */
  body: string;
  /** Corpo específico do TS, quando difere do JS. */
  tsBody?: string;
  /** Testes de tipo da variante TS (ver `Exercise.typeAssertions`). */
  typeAssertions?: string;
};

const PLACEHOLDER = '  // Escreva aqui o seu algoritmo';

function fn(signature: string, body: string): string {
  return `${signature} {\n${body.replace(/\n+$/, '')}\n}\n`;
}

export function logica(spec: LogicSpec): LogicExercise {
  const { signature, body, tsBody, typeAssertions, type, ...rest } = spec;
  const javascript = { templateCode: fn(signature.javascript, PLACEHOLDER), solutionCode: fn(signature.javascript, body) };
  const typescript = {
    templateCode: fn(signature.typescript, PLACEHOLDER),
    solutionCode: fn(signature.typescript, tsBody ?? body),
    ...(typeAssertions ? { typeAssertions } : {}),
  };
  return {
    ...rest,
    track: 'logica',
    language: 'javascript',
    type: type ?? 'codigo_livre',
    templateCode: javascript.templateCode,
    solutionCode: javascript.solutionCode,
    logicVariants: { javascript, typescript },
  };
}

/**
 * Especificação de um exercício 'teste_de_mesa' (Fase 4.5). Não há código a escrever: o
 * aluno preenche a tabela. `deskCheck.code` é JavaScript válido também como TypeScript, então
 * as duas variantes mostram o mesmo trecho (o seletor de linguagem fica oculto nessa modalidade).
 * Os testCases são só descritivos: a nota vem da tabela (evaluateDeskCheck).
 */
export type DeskCheckSpec = Omit<
  LogicExercise,
  'track' | 'language' | 'type' | 'templateCode' | 'solutionCode' | 'logicVariants' | 'testCases' | 'deskCheck'
> & {
  deskCheck: NonNullable<LogicExercise['deskCheck']>;
};

export function testeDeMesa(spec: DeskCheckSpec): LogicExercise {
  const variant = { templateCode: spec.deskCheck.code, solutionCode: spec.deskCheck.code };
  return {
    ...spec,
    track: 'logica',
    language: 'javascript',
    type: 'teste_de_mesa',
    templateCode: variant.templateCode,
    solutionCode: variant.solutionCode,
    testCases: [
      {
        description: 'Cada linha da tabela confere com a execução real do código',
        expectedOutput: 'Tabela completa (ver a aba Solução depois de acertar)',
      },
    ],
    logicVariants: { javascript: variant, typescript: variant },
  };
}
