import { LogicExercise } from '../../types/exercise';

/**
 * Trilha de Lógica — Módulo 01: Primeiros Algoritmos (índice: exercícios 1 a 15).
 * Enunciados escritos do zero (o material de origem é comercial — ver
 * docs/fase-4-indice-exercicios.md). Cada exercício tem as variantes JS e TS.
 */
export const logicModule01: LogicExercise[] = [
  // Índice nº 1 — Soma de dois números (piloto da tarefa 4.6)
  {
    id: 'logica-001-soma-de-dois-numeros',
    track: 'logica',
    language: 'javascript',
    difficulty: 'basico',
    type: 'codigo_livre',
    topic: 'Primeiros Algoritmos',
    title: 'Soma de Dois Números',
    summary: 'Escreva a função que recebe dois números e devolve a soma.',
    realWorldContext:
      'Todo sistema que movimenta valores começa aqui: o caixa de uma padaria soma o preço de dois itens, a planilha soma duas colunas. Entender entrada → processamento → saída é a base de qualquer algoritmo.',
    description:
      'Implemente a função somar(a, b), que recebe dois números e retorna a soma deles. Ela deve funcionar com números negativos e com decimais.',
    goal: 'Retornar a soma dos dois parâmetros.',
    templateCode: `function somar(a, b) {
  // Escreva aqui o seu algoritmo
}
`,
    solutionCode: `function somar(a, b) {
  return a + b;
}
`,
    logicVariants: {
      javascript: {
        templateCode: `function somar(a, b) {
  // Escreva aqui o seu algoritmo
}
`,
        solutionCode: `function somar(a, b) {
  return a + b;
}
`,
      },
      typescript: {
        templateCode: `function somar(a: number, b: number): number {
  // Escreva aqui o seu algoritmo
}
`,
        solutionCode: `function somar(a: number, b: number): number {
  return a + b;
}
`,
        typeAssertions: `// @ts-expect-error — texto não é número: em TS, "2" + 3 não passa despercebido
somar('2', 3);`,
      },
    },
    hints: [
      'Um algoritmo tem entrada (a e b), processamento (a operação) e saída (o return).',
      'O operador de soma é o +. Não esqueça do return: sem ele a função devolve undefined.',
    ],
    testCases: [
      { description: 'Soma de positivos', expectedOutput: '5', testFunction: 'return somar(2, 3) === 5;' },
      { description: 'Soma com negativo', expectedOutput: '-4', testFunction: 'return somar(-10, 6) === -4;' },
      { description: 'Soma de decimais', expectedOutput: '0.75', testFunction: 'return somar(0.5, 0.25) === 0.75;' },
    ],
    explanation:
      'A função recebe os dados (entrada), aplica a operação (processamento) e devolve o resultado com return (saída). Em JavaScript, se um dos valores fosse texto ("2" + 3), o + concatenaria e o resultado seria "23"; na variante TypeScript o compilador recusa essa chamada antes de executar.',
  },
];
