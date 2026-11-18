import { LogicExercise } from '../../types/exercise';
import { logica } from './logicFactory';

const topic = 'Estruturas Condicionais';

/**
 * Trilha de Lógica — Módulo 02: Estruturas Condicionais (índice: exercícios 16 a 35).
 * Enunciados escritos do zero (ver docs/fase-4-indice-exercicios.md).
 * Nos exercícios que devolvem uma categoria, a variante TS usa union de literais no retorno
 * ('par' | 'ímpar'): o compilador recusa qualquer texto fora das opções.
 */
export const logicModule02: LogicExercise[] = [
  // Índice nº 16 — Positivo, negativo ou zero
  logica({
    id: 'logica-016-positivo-negativo-ou-zero',
    difficulty: 'basico',
    topic,
    title: 'Positivo, Negativo ou Zero',
    summary: 'Classifique um número como positivo, negativo ou zero.',
    realWorldContext:
      'O extrato do banco pinta o valor de verde (entrada), vermelho (saída) ou cinza (zerado). Por trás da cor há um if que olha o sinal do número.',
    description:
      'Implemente classificarSinal(n), que retorna o texto "positivo", "negativo" ou "zero".',
    goal: 'Usar if / else if / else para escolher entre três saídas.',
    signature: {
      javascript: 'function classificarSinal(n)',
      typescript: "function classificarSinal(n: number): 'positivo' | 'negativo' | 'zero'",
    },
    body: `  if (n > 0) {
    return 'positivo';
  } else if (n < 0) {
    return 'negativo';
  } else {
    return 'zero';
  }`,
    typeAssertions: `// @ts-expect-error — o retorno só pode ser uma das três categorias
const categoria: 'positivo' | 'negativo' = classificarSinal(1);`,
    hints: [
      'São três casos que não se sobrepõem: maior que zero, menor que zero e o que sobrar.',
      'Com if / else if / else, só um dos blocos executa. O else final pega o caso que nenhum teste anterior pegou (o zero).',
    ],
    testCases: [
      { description: 'Positivo', input: 'classificarSinal(42)', expectedOutput: '"positivo"', testFunction: "return classificarSinal(42) === 'positivo';" },
      { description: 'Negativo', input: 'classificarSinal(-0.5)', expectedOutput: '"negativo"', testFunction: "return classificarSinal(-0.5) === 'negativo';" },
      { description: 'Zero', input: 'classificarSinal(0)', expectedOutput: '"zero"', testFunction: "return classificarSinal(0) === 'zero';" },
    ],
    explanation:
      'Uma cadeia if / else if / else testa as condições em ordem e executa só o primeiro bloco verdadeiro. No TypeScript, o retorno \'positivo\' | \'negativo\' | \'zero\' é uma union de literais: um erro de digitação como \'positvo\' vira erro de compilação, e quem chama a função sabe exatamente quais textos pode receber.',
  }),

  // Índice nº 17 — Par ou ímpar
  logica({
    id: 'logica-017-par-ou-impar',
    difficulty: 'basico',
    topic,
    title: 'Par ou Ímpar',
    summary: 'Diga se um número inteiro é par ou ímpar.',
    realWorldContext:
      'Tabelas e listas zebradas (uma linha clara, outra escura) decidem a cor pelo índice da linha: par de um jeito, ímpar de outro. O mesmo teste distribui tarefas em turnos alternados.',
    description:
      'Implemente parOuImpar(n), que retorna "par" ou "ímpar". Deve funcionar também com números negativos.',
    goal: 'Usar o resto da divisão por 2 (%) para decidir.',
    signature: {
      javascript: 'function parOuImpar(n)',
      typescript: "function parOuImpar(n: number): 'par' | 'ímpar'",
    },
    body: `  if (n % 2 === 0) {
    return 'par';
  }
  return 'ímpar';`,
    hints: [
      'Um número é par quando o resto da divisão por 2 é zero: n % 2 === 0.',
      'Cuidado com negativos: em JS/TS, -3 % 2 é -1, não 1. Testar n % 2 === 1 erra os ímpares negativos — teste o par (=== 0) e deixe o resto ser ímpar.',
    ],
    testCases: [
      { description: 'Par positivo', input: 'parOuImpar(8)', expectedOutput: '"par"', testFunction: "return parOuImpar(8) === 'par';" },
      { description: 'Ímpar positivo', input: 'parOuImpar(7)', expectedOutput: '"ímpar"', testFunction: "return parOuImpar(7) === 'ímpar';" },
      { description: 'Zero é par', input: 'parOuImpar(0)', expectedOutput: '"par"', testFunction: "return parOuImpar(0) === 'par';" },
      { description: 'Ímpar negativo', input: 'parOuImpar(-3)', expectedOutput: '"ímpar"', testFunction: "return parOuImpar(-3) === 'ímpar';" },
    ],
    explanation:
      'O operador % devolve o resto da divisão e mantém o sinal do dividendo: -3 % 2 === -1. Por isso a forma robusta é testar o caso par (resto 0) e tratar todo o resto como ímpar. Repare também no "return antecipado": quando o if retorna, o else é desnecessário.',
  }),

  // Índice nº 18 — Maior de dois números
  logica({
    id: 'logica-018-maior-de-dois-numeros',
    difficulty: 'basico',
    topic,
    title: 'Maior de Dois Números',
    summary: 'Devolva o maior entre dois números, usando if.',
    realWorldContext:
      'Num leilão online, o sistema compara o lance novo com o maior lance atual e fica com o maior. É uma comparação de dois valores — feita a cada lance.',
    description:
      'Implemente maiorDeDois(a, b), que retorna o maior dos dois números. Se forem iguais, retorne esse valor. Resolva com if — o objetivo é praticar a comparação (deixe o Math.max para depois).',
    goal: 'Comparar a e b com um if e retornar o maior.',
    signature: {
      javascript: 'function maiorDeDois(a, b)',
      typescript: 'function maiorDeDois(a: number, b: number): number',
    },
    body: `  if (a > b) {
    return a;
  }
  return b;`,
    hints: [
      'Compare a > b: se for verdade, a é o maior.',
      'Se a não é maior que b, então b é maior ou igual — e nos dois casos retornar b está certo.',
    ],
    testCases: [
      { description: 'Primeiro é maior', input: 'maiorDeDois(9, 4)', expectedOutput: '9', testFunction: 'return maiorDeDois(9, 4) === 9;' },
      { description: 'Segundo é maior', input: 'maiorDeDois(-2, 3)', expectedOutput: '3', testFunction: 'return maiorDeDois(-2, 3) === 3;' },
      { description: 'Iguais', input: 'maiorDeDois(5, 5)', expectedOutput: '5', testFunction: 'return maiorDeDois(5, 5) === 5;' },
      { description: 'Dois negativos', input: 'maiorDeDois(-8, -1)', expectedOutput: '-1', testFunction: 'return maiorDeDois(-8, -1) === -1;' },
    ],
    explanation:
      'Com dois valores, uma comparação basta: se a não é maior, b é maior ou igual. O caso "iguais" não precisa de tratamento especial porque qualquer um dos dois é a resposta. Na prática você usaria Math.max(a, b), que faz exatamente isso.',
  }),

  // Índice nº 19 — Maior e menor de três números
  logica({
    id: 'logica-019-maior-e-menor-de-tres-numeros',
    difficulty: 'intermediario',
    topic,
    title: 'Maior e Menor de Três Números',
    summary: 'Encontre o maior e o menor entre três números.',
    realWorldContext:
      'Um comparador de preços consulta três lojas e destaca a mais cara e a mais barata. Com três valores já não dá para resolver com uma comparação só — é preciso organizar o raciocínio.',
    description:
      'Implemente maiorEMenor(a, b, c), que retorna { maior, menor }. Resolva com comparações (if), sem Math.max/Math.min.',
    goal: 'Encontrar o maior e o menor de três valores com ifs.',
    signature: {
      javascript: 'function maiorEMenor(a, b, c)',
      typescript: 'function maiorEMenor(a: number, b: number, c: number): { maior: number; menor: number }',
    },
    body: `  let maior = a;
  let menor = a;
  if (b > maior) maior = b;
  if (c > maior) maior = c;
  if (b < menor) menor = b;
  if (c < menor) menor = c;
  return { maior, menor };`,
    hints: [
      'Comece supondo que o primeiro valor é ao mesmo tempo o maior e o menor.',
      'Depois compare cada um dos outros com o "campeão" atual e substitua quando achar alguém maior (ou menor).',
    ],
    testCases: [
      { description: 'Ordem qualquer', input: 'maiorEMenor(4, 9, 1)', expectedOutput: '{ maior: 9, menor: 1 }', testFunction: 'const r = maiorEMenor(4, 9, 1); return r.maior === 9 && r.menor === 1;' },
      { description: 'Maior no início', input: 'maiorEMenor(10, 2, 5)', expectedOutput: '{ maior: 10, menor: 2 }', testFunction: 'const r = maiorEMenor(10, 2, 5); return r.maior === 10 && r.menor === 2;' },
      { description: 'Menor no fim', input: 'maiorEMenor(3, 7, -4)', expectedOutput: '{ maior: 7, menor: -4 }', testFunction: 'const r = maiorEMenor(3, 7, -4); return r.maior === 7 && r.menor === -4;' },
      { description: 'Todos iguais', input: 'maiorEMenor(6, 6, 6)', expectedOutput: '{ maior: 6, menor: 6 }', testFunction: 'const r = maiorEMenor(6, 6, 6); return r.maior === 6 && r.menor === 6;' },
    ],
    explanation:
      'O padrão "supõe o primeiro e corrige ao comparar com os demais" é o mesmo que você vai usar para achar o maior de uma lista inteira com um laço (módulos 03 e 04). Ele evita a explosão de casos de tentar escrever todas as combinações (a > b && a > c, ...).',
  }),

  // Índice nº 20 — Três valores em ordem crescente
  logica({
    id: 'logica-020-tres-valores-em-ordem-crescente',
    difficulty: 'intermediario',
    topic,
    title: 'Três Valores em Ordem Crescente',
    summary: 'Coloque três números em ordem crescente usando só comparações e trocas.',
    realWorldContext:
      'Um pódio de corrida ordena os três melhores tempos. Ordenar três valores à mão — compara, troca se estiver fora de ordem — é a semente dos algoritmos de ordenação que você verá adiante.',
    description:
      'Implemente ordenarTres(a, b, c), que retorna um array com os três valores em ordem crescente. Resolva com comparações e trocas, sem usar .sort().',
    goal: 'Ordenar três valores com ifs e trocas.',
    signature: {
      javascript: 'function ordenarTres(a, b, c)',
      typescript: 'function ordenarTres(a: number, b: number, c: number): [number, number, number]',
    },
    body: `  let x = a;
  let y = b;
  let z = c;
  if (x > y) [x, y] = [y, x];
  if (y > z) [y, z] = [z, y];
  if (x > y) [x, y] = [y, x];
  return [x, y, z];`,
    hints: [
      'Compare o 1º com o 2º e troque se estiverem fora de ordem. Depois o 2º com o 3º. Isso já garante que o maior foi para o final.',
      'Falta uma última comparação entre o 1º e o 2º, porque a segunda troca pode ter trazido um valor menor para o meio. A troca pode ser feita com variável auxiliar ou com [x, y] = [y, x].',
    ],
    testCases: [
      { description: 'Ordem inversa', input: 'ordenarTres(3, 2, 1)', expectedOutput: '[1, 2, 3]', testFunction: 'return JSON.stringify(ordenarTres(3, 2, 1)) === "[1,2,3]";' },
      { description: 'Menor no fim', input: 'ordenarTres(5, 8, 1)', expectedOutput: '[1, 5, 8]', testFunction: 'return JSON.stringify(ordenarTres(5, 8, 1)) === "[1,5,8]";' },
      { description: 'Já ordenado', input: 'ordenarTres(1, 2, 3)', expectedOutput: '[1, 2, 3]', testFunction: 'return JSON.stringify(ordenarTres(1, 2, 3)) === "[1,2,3]";' },
      { description: 'Com repetidos e negativo', input: 'ordenarTres(4, -2, 4)', expectedOutput: '[-2, 4, 4]', testFunction: 'return JSON.stringify(ordenarTres(4, -2, 4)) === "[-2,4,4]";' },
    ],
    explanation:
      'Três comparações com troca bastam para ordenar três valores: as duas primeiras levam o maior para o fim e a terceira acerta os dois primeiros. Isso é, em miniatura, o Bubble Sort — que repete essas "passadas" até a lista inteira estar em ordem.',
  }),
];
