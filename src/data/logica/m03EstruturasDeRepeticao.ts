import { LogicExercise } from '../../types/exercise';
import { logica } from './logicFactory';

const topic = 'Estruturas de Repetição';

/**
 * Trilha de Lógica — Módulo 03: Estruturas de Repetição (índice: exercícios 36 a 60).
 * Enunciados escritos do zero (ver docs/fase-4-indice-exercicios.md).
 * "Mostrar na tela" vira "devolver a lista": a função retorna um array com o que seria
 * exibido, o que permite testar o resultado. Na variante TS, o array começa tipado
 * (`const numeros: number[] = []`) — por isso esses exercícios têm `tsBody`.
 */
export const logicModule03: LogicExercise[] = [
  // Índice nº 36 — Contagem de 1 até 10
  logica({
    id: 'logica-036-contagem-de-1-ate-10',
    difficulty: 'basico',
    topic,
    title: 'Contagem de 1 até 10',
    summary: 'Use um laço for para gerar os números de 1 a 10.',
    realWorldContext:
      'Repetir uma tarefa um número conhecido de vezes é o uso mais comum de um laço: gerar as 10 páginas de um relatório, enviar 10 lembretes, desenhar 10 linhas numa tabela.',
    description:
      'Implemente contarAteDez(), que retorna um array com os números de 1 a 10, em ordem. Use um laço for — o objetivo é praticar a repetição, não digitar a lista.',
    goal: 'Montar um array com um laço for de 1 a 10.',
    signature: {
      javascript: 'function contarAteDez()',
      typescript: 'function contarAteDez(): number[]',
    },
    body: `  const numeros = [];
  for (let i = 1; i <= 10; i++) {
    numeros.push(i);
  }
  return numeros;`,
    tsBody: `  const numeros: number[] = [];
  for (let i = 1; i <= 10; i++) {
    numeros.push(i);
  }
  return numeros;`,
    hints: [
      'O for tem três partes: início (let i = 1), condição para continuar (i <= 10) e passo (i++).',
      'Comece com um array vazio e, a cada volta, adicione i com numeros.push(i). Retorne o array depois do laço.',
    ],
    testCases: [
      { description: 'Tem 10 números', input: 'contarAteDez().length', expectedOutput: '10', testFunction: 'return contarAteDez().length === 10;' },
      { description: 'Começa em 1 e termina em 10', input: 'contarAteDez()', expectedOutput: '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]', testFunction: 'return JSON.stringify(contarAteDez()) === "[1,2,3,4,5,6,7,8,9,10]";' },
    ],
    explanation:
      'O for junta numa linha as três peças de qualquer repetição: onde começa, até quando vai e como avança. Errar a condição por um (i < 10 em vez de i <= 10) é o bug mais comum de laços — o famoso "erro de off-by-one".',
  }),

  // Índice nº 37 — Contagem regressiva
  logica({
    id: 'logica-037-contagem-regressiva',
    difficulty: 'basico',
    topic,
    title: 'Contagem Regressiva',
    summary: 'Gere a contagem regressiva de N até 0.',
    realWorldContext:
      'Cronômetros de forno, lançamentos e telas de "o leilão termina em…" contam para trás. O laço é o mesmo da contagem normal, com início, condição e passo invertidos.',
    description:
      'Implemente contagemRegressiva(n), que retorna um array de n até 0, decrescendo de 1 em 1. Ex.: 3 → [3, 2, 1, 0].',
    goal: 'Escrever um laço que decrementa.',
    signature: {
      javascript: 'function contagemRegressiva(n)',
      typescript: 'function contagemRegressiva(n: number): number[]',
    },
    body: `  const numeros = [];
  for (let i = n; i >= 0; i--) {
    numeros.push(i);
  }
  return numeros;`,
    tsBody: `  const numeros: number[] = [];
  for (let i = n; i >= 0; i--) {
    numeros.push(i);
  }
  return numeros;`,
    hints: [
      'Comece em n, continue enquanto i >= 0 e use i-- para diminuir.',
      'O 0 faz parte da contagem: a condição é >= 0, não > 0.',
    ],
    testCases: [
      { description: 'De 5', input: 'contagemRegressiva(5)', expectedOutput: '[5, 4, 3, 2, 1, 0]', testFunction: 'return JSON.stringify(contagemRegressiva(5)) === "[5,4,3,2,1,0]";' },
      { description: 'De 0', input: 'contagemRegressiva(0)', expectedOutput: '[0]', testFunction: 'return JSON.stringify(contagemRegressiva(0)) === "[0]";' },
      { description: 'De 10 tem 11 itens', input: 'contagemRegressiva(10).length', expectedOutput: '11', testFunction: 'return contagemRegressiva(10).length === 11;' },
    ],
    explanation:
      'Inverter um laço é inverter as três partes: começa no fim, a condição olha o limite de baixo e o passo diminui. De n até 0 há n + 1 números — contar os itens de um intervalo fechado é outro ponto clássico de erro por um.',
  }),

  // Índice nº 38 — Contagem até um limite
  logica({
    id: 'logica-038-contagem-ate-um-limite',
    difficulty: 'basico',
    topic,
    title: 'Contagem até um Limite',
    summary: 'Gere os números de 1 até um limite informado.',
    realWorldContext:
      'Na maioria das vezes, quantas repetições fazer só é conhecido quando o programa roda: o número de parcelas que o cliente escolheu, de itens no carrinho, de alunos da turma.',
    description:
      'Implemente contarAte(limite), que retorna os números de 1 até limite. Se o limite for menor que 1, retorne um array vazio.',
    goal: 'Usar um parâmetro como condição de parada do laço.',
    signature: {
      javascript: 'function contarAte(limite)',
      typescript: 'function contarAte(limite: number): number[]',
    },
    body: `  const numeros = [];
  for (let i = 1; i <= limite; i++) {
    numeros.push(i);
  }
  return numeros;`,
    tsBody: `  const numeros: number[] = [];
  for (let i = 1; i <= limite; i++) {
    numeros.push(i);
  }
  return numeros;`,
    hints: [
      'É o laço do exercício 36 trocando o 10 fixo pelo parâmetro limite.',
      'Se limite for 0 ou negativo, a condição i <= limite já é falsa na primeira volta: o laço não executa e o array sai vazio — sem nenhum if.',
    ],
    testCases: [
      { description: 'Até 4', input: 'contarAte(4)', expectedOutput: '[1, 2, 3, 4]', testFunction: 'return JSON.stringify(contarAte(4)) === "[1,2,3,4]";' },
      { description: 'Até 1', input: 'contarAte(1)', expectedOutput: '[1]', testFunction: 'return JSON.stringify(contarAte(1)) === "[1]";' },
      { description: 'Limite 0', input: 'contarAte(0)', expectedOutput: '[]', testFunction: 'return JSON.stringify(contarAte(0)) === "[]";' },
      { description: 'Limite negativo', input: 'contarAte(-3)', expectedOutput: '[]', testFunction: 'return JSON.stringify(contarAte(-3)) === "[]";' },
    ],
    explanation:
      'O for testa a condição antes de cada volta, inclusive a primeira. Por isso um limite menor que 1 resulta em zero repetições, e o caso "vazio" sai de graça. Sempre pense no que o laço faz quando não deveria repetir nenhuma vez.',
  }),

  // Índice nº 39 — Números pares de 1 até 100
  logica({
    id: 'logica-039-numeros-pares-de-1-ate-100',
    difficulty: 'basico',
    topic,
    title: 'Números Pares de 1 até 100',
    summary: 'Gere os números pares de 1 até um limite (por padrão, 100).',
    realWorldContext:
      'Filtrar enquanto se percorre é o dia a dia de quem programa: pedidos pagos, clientes ativos, linhas pares de uma tabela. Aqui o filtro é "ser par".',
    description:
      'Implemente paresAte(limite), que retorna todos os números pares de 1 até limite (inclusive), em ordem. Com limite 100, são 2, 4, …, 100.',
    goal: 'Percorrer um intervalo e guardar só os pares.',
    signature: {
      javascript: 'function paresAte(limite)',
      typescript: 'function paresAte(limite: number): number[]',
    },
    body: `  const pares = [];
  for (let i = 1; i <= limite; i++) {
    if (i % 2 === 0) {
      pares.push(i);
    }
  }
  return pares;`,
    tsBody: `  const pares: number[] = [];
  for (let i = 1; i <= limite; i++) {
    if (i % 2 === 0) {
      pares.push(i);
    }
  }
  return pares;`,
    hints: [
      'Percorra de 1 até limite e use um if com i % 2 === 0 para decidir se o número entra.',
      'Alternativa sem if: comece em 2 e ande de 2 em 2 (i += 2).',
    ],
    testCases: [
      { description: 'Até 10', input: 'paresAte(10)', expectedOutput: '[2, 4, 6, 8, 10]', testFunction: 'return JSON.stringify(paresAte(10)) === "[2,4,6,8,10]";' },
      { description: 'Até 100: 50 pares', input: 'paresAte(100).length', expectedOutput: '50', testFunction: 'const p = paresAte(100); return p.length === 50 && p[0] === 2 && p[49] === 100;' },
      { description: 'Limite ímpar', input: 'paresAte(7)', expectedOutput: '[2, 4, 6]', testFunction: 'return JSON.stringify(paresAte(7)) === "[2,4,6]";' },
    ],
    explanation:
      'Há duas estratégias: percorrer tudo e filtrar com if, ou gerar só os pares com passo 2. A segunda faz metade das voltas; a primeira é mais geral (serve para qualquer filtro). Saber as duas ajuda a escolher conforme o problema.',
  }),

  // Índice nº 40 — Números ímpares de 1 até 100
  logica({
    id: 'logica-040-numeros-impares-de-1-ate-100',
    difficulty: 'basico',
    topic,
    title: 'Números Ímpares de 1 até 100',
    summary: 'Gere os números ímpares de 1 até um limite, andando de 2 em 2.',
    realWorldContext:
      'Escolher o passo do laço é uma otimização simples: em vez de testar cada número, você pula direto para os que interessam — como imprimir só as páginas ímpares (a frente das folhas).',
    description:
      'Implemente imparesAte(limite), que retorna os números ímpares de 1 até limite (inclusive). Desta vez, tente gerar só os ímpares, começando em 1 e avançando de 2 em 2.',
    goal: 'Usar um passo diferente de 1 no laço.',
    signature: {
      javascript: 'function imparesAte(limite)',
      typescript: 'function imparesAte(limite: number): number[]',
    },
    body: `  const impares = [];
  for (let i = 1; i <= limite; i += 2) {
    impares.push(i);
  }
  return impares;`,
    tsBody: `  const impares: number[] = [];
  for (let i = 1; i <= limite; i += 2) {
    impares.push(i);
  }
  return impares;`,
    hints: [
      'O primeiro ímpar é 1, e o próximo está sempre 2 à frente.',
      'No for, troque i++ por i += 2.',
    ],
    testCases: [
      { description: 'Até 9', input: 'imparesAte(9)', expectedOutput: '[1, 3, 5, 7, 9]', testFunction: 'return JSON.stringify(imparesAte(9)) === "[1,3,5,7,9]";' },
      { description: 'Até 100: 50 ímpares', input: 'imparesAte(100).length', expectedOutput: '50', testFunction: 'const p = imparesAte(100); return p.length === 50 && p[0] === 1 && p[49] === 99;' },
      { description: 'Limite par', input: 'imparesAte(6)', expectedOutput: '[1, 3, 5]', testFunction: 'return JSON.stringify(imparesAte(6)) === "[1,3,5]";' },
    ],
    explanation:
      'O passo do for pode ser qualquer expressão: i += 2, i += 5, i *= 2. Com passo 2 a partir de 1, todo número gerado já é ímpar, então nenhum teste é necessário dentro do laço.',
  }),
];
