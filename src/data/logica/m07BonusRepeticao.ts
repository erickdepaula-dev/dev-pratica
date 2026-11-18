import { LogicExercise } from '../../types/exercise';
import { logica } from './logicFactory';

const topic = 'Bônus — Repetição';

/**
 * Trilha de Lógica — Bônus 03: exercícios extras de estruturas de repetição (índice: r01 a r30).
 * Enunciados escritos do zero; a especificação vem de docs/material-apoio/BANCO_EXERCICIOS.md.
 *
 * Só os 8 que acrescentam algo ao módulo 03 estão aqui. Ficaram de fora 5 duplicatas de regra
 * idêntica (contagem regressiva, somatório de 1 até N, ler até zero, maior e menor valor, notas
 * acima da média) e 17 variações do mesmo acumulador que o módulo 03 já treina (somar pares,
 * somar ímpares, produto de 1 até N, contar múltiplos de 3...). A lista está em docs/fase-4-exercicios.md.
 *
 * O que estes 8 treinam: devolver a lista em vez de só o total, laço com sentinela genérica,
 * gerar uma sequência inteira (Fibonacci) em vez de um termo, parar por soma acumulada em vez de
 * por contagem, e contagem com filtro sobre um conjunto de tamanho fixo.
 */
export const logicModule07: LogicExercise[] = [
  // Índice nº r16 — Somar até a sentinela
  logica({
    id: 'logica-r16-somar-ate-a-sentinela',
    difficulty: 'intermediario',
    topic,
    title: 'Somar até a Sentinela',
    summary: 'Some os valores até encontrar a sentinela, que vem como parâmetro.',
    realWorldContext:
      'Sentinela é um valor combinado que significa "acabou": o -1 no fim de uma lista de notas, o 0 num caixa, a linha em branco num arquivo. Cada sistema escolhe o seu — então quem escreve a função recebe qual é, em vez de fixar um valor no código.',
    description:
      'Implemente somarAteSentinela(valores, sentinela), que soma os números do array na ordem até encontrar o valor sentinela e retorna essa soma. A sentinela não entra na soma, e o que vier depois dela é ignorado. Se a sentinela não aparecer, some tudo.',
    goal: 'Parar o laço por conteúdo, com o valor de parada vindo de fora.',
    signature: {
      javascript: 'function somarAteSentinela(valores, sentinela)',
      typescript: 'function somarAteSentinela(valores: number[], sentinela: number): number',
    },
    body: `  let soma = 0;
  for (let i = 0; i < valores.length; i++) {
    if (valores[i] === sentinela) {
      break;
    }
    soma = soma + valores[i];
  }
  return soma;`,
    hints: [
      'Teste a sentinela antes de somar. Somando primeiro e saindo depois, ela entra na conta e o resultado sai errado.',
      'A comparação é com o parâmetro, nunca com um número escrito no laço. É isso que faz a mesma função servir para uma leitura que termina em -1 e outra que termina em 0.',
    ],
    testCases: [
      { description: 'Sentinela -1, como no enunciado', input: 'somarAteSentinela([4, 7, 2, -1], -1)', expectedOutput: '13', testFunction: 'return somarAteSentinela([4, 7, 2, -1], -1) === 13;' },
      { description: 'Sentinela no segundo valor', input: 'somarAteSentinela([5, -1], -1)', expectedOutput: '5', testFunction: 'return somarAteSentinela([5, -1], -1) === 5;' },
      { description: 'O que vem depois é ignorado', input: 'somarAteSentinela([3, 4, -1, 100, 200], -1)', expectedOutput: '7', testFunction: 'return somarAteSentinela([3, 4, -1, 100, 200], -1) === 7;' },
      { description: 'Sentinela na primeira posição', input: 'somarAteSentinela([-1, 5, 5], -1)', expectedOutput: '0', testFunction: 'return somarAteSentinela([-1, 5, 5], -1) === 0;' },
      { description: 'Sem sentinela: soma tudo', input: 'somarAteSentinela([10, 20, 30, 40], -1)', expectedOutput: '100', testFunction: 'return somarAteSentinela([10, 20, 30, 40], -1) === 100;' },
      { description: 'Outra sentinela, mesmos dados', input: 'somarAteSentinela([10, 20, 0, 30], 0) e com sentinela 30', expectedOutput: '30 e 30', testFunction: 'return somarAteSentinela([10, 20, 0, 30], 0) === 30 && somarAteSentinela([10, 20, 0, 30], 30) === 30;' },
      { description: 'Sentinela 0 não para em valor negativo', input: 'somarAteSentinela([5, -3, 0, 9], 0)', expectedOutput: '2', testFunction: 'return somarAteSentinela([5, -3, 0, 9], 0) === 2;' },
    ],
    explanation:
      'O penúltimo teste é o que prova a parametrização: os mesmos quatro números dão 30 com sentinela 0 (para no terceiro) e também 30 com sentinela 30 (soma os três primeiros) — coincidência de valor, caminhos diferentes. Uma solução com o -1 escrito dentro do laço passa nos primeiros testes e falha nesse. E [3, 4, -1, 100, 200] mostra que o laço para de verdade: somando tudo e descontando a sentinela, viria 307.',
  }),

  // Índice nº r17 — Os N primeiros termos de Fibonacci
  logica({
    id: 'logica-r17-primeiros-termos-de-fibonacci',
    difficulty: 'intermediario',
    topic,
    title: 'Os N Primeiros Termos de Fibonacci',
    summary: 'Gere a sequência de Fibonacci com N termos.',
    realWorldContext:
      'Devolver a sequência é outro problema que devolver um termo. Aqui cada valor novo depende dos dois anteriores, que já estão no array — então a própria lista que você está construindo é de onde vêm os dados do próximo passo.',
    description:
      'Implemente primeirosFibonacci(n), que retorna um array com os n primeiros termos da sequência, começando em 0 e 1. Para n = 1 o resultado é [0]; para n = 2, [0, 1]. Para n menor que 1, retorne um array vazio.',
    goal: 'Construir uma sequência lendo os valores já acumulados.',
    signature: {
      javascript: 'function primeirosFibonacci(n)',
      typescript: 'function primeirosFibonacci(n: number): number[]',
    },
    body: `  const termos = [];
  for (let i = 0; i < n; i++) {
    if (i < 2) {
      termos.push(i);
    } else {
      termos.push(termos[i - 1] + termos[i - 2]);
    }
  }
  return termos;`,
    tsBody: `  const termos: number[] = [];
  for (let i = 0; i < n; i++) {
    if (i < 2) {
      termos.push(i);
    } else {
      termos.push(termos[i - 1] + termos[i - 2]);
    }
  }
  return termos;`,
    hints: [
      'Os dois primeiros termos são 0 e 1 e não vêm de soma nenhuma — eles são o ponto de partida. Repare que, para i igual a 0 e 1, o próprio i já é o termo.',
      'A partir do terceiro, o termo é a soma dos dois últimos que você já colocou no array: termos[i - 1] + termos[i - 2].',
    ],
    testCases: [
      { description: 'Seis termos', input: 'primeirosFibonacci(6)', expectedOutput: '[0, 1, 1, 2, 3, 5]', testFunction: 'return JSON.stringify(primeirosFibonacci(6)) === "[0,1,1,2,3,5]";' },
      { description: 'Um termo', input: 'primeirosFibonacci(1)', expectedOutput: '[0]', testFunction: 'return JSON.stringify(primeirosFibonacci(1)) === "[0]";' },
      { description: 'Dois termos', input: 'primeirosFibonacci(2)', expectedOutput: '[0, 1]', testFunction: 'return JSON.stringify(primeirosFibonacci(2)) === "[0,1]";' },
      { description: 'Cinco termos', input: 'primeirosFibonacci(5)', expectedOutput: '[0, 1, 1, 2, 3]', testFunction: 'return JSON.stringify(primeirosFibonacci(5)) === "[0,1,1,2,3]";' },
      { description: 'Oito termos', input: 'primeirosFibonacci(8)', expectedOutput: '[0, 1, 1, 2, 3, 5, 8, 13]', testFunction: 'return JSON.stringify(primeirosFibonacci(8)) === "[0,1,1,2,3,5,8,13]";' },
      { description: 'Zero termos', input: 'primeirosFibonacci(0)', expectedOutput: '[]', testFunction: 'const r = primeirosFibonacci(0); return Array.isArray(r) && r.length === 0;' },
      { description: 'Cada termo é a soma dos dois anteriores', input: 'primeirosFibonacci(12)', expectedOutput: 'relação válida em toda a sequência', testFunction: 'const f = primeirosFibonacci(12); if (f.length !== 12) return false; for (let i = 2; i < f.length; i++) { if (f[i] !== f[i - 1] + f[i - 2]) return false; } return f[0] === 0 && f[1] === 1;' },
    ],
    explanation:
      'O último teste não compara com uma lista pronta: ele confere a regra da sequência em todos os termos e os dois valores iniciais. É um teste mais forte, porque reprova qualquer sequência consistente que comece errado — uma que arranque em 1 e 1, por exemplo, satisfaz a soma mas não é o que o enunciado pede. Os casos n = 1 e n = 2 são os que pegam a solução que já empurra 0 e 1 no array antes do laço e estoura a contagem.',
  }),

  // Índice nº r26 — Contar valores acima de um limite
  logica({
    id: 'logica-r26-contar-valores-acima-do-limite',
    difficulty: 'basico',
    topic,
    title: 'Contar Valores Acima do Limite',
    summary: 'Conte quantos valores passam de um limite informado.',
    realWorldContext:
      'Quantos produtos passaram do preço de corte, quantos dias passaram da temperatura de alerta, quantos alunos passaram da nota mínima. Receber o limite como parâmetro é o que faz uma função servir para todos esses casos em vez de um só.',
    description:
      'Implemente contarAcimaDe(valores, limite), que retorna quantos elementos de valores são estritamente maiores que limite. Valores iguais ao limite não contam.',
    goal: 'Parametrizar o critério em vez de fixá-lo no código.',
    signature: {
      javascript: 'function contarAcimaDe(valores, limite)',
      typescript: 'function contarAcimaDe(valores: number[], limite: number): number',
    },
    body: `  let total = 0;
  for (let i = 0; i < valores.length; i++) {
    if (valores[i] > limite) {
      total = total + 1;
    }
  }
  return total;`,
    hints: [
      'O limite é um parâmetro, então a comparação usa a variável e nunca um número escrito no meio do laço.',
      '"Acima de" é estritamente maior: use > e não >=. O valor igual ao limite fica de fora.',
    ],
    testCases: [
      { description: 'Conjunto do enunciado, limite 10', input: 'contarAcimaDe([5, 12, 8, 20, 11, 3, 15], 10)', expectedOutput: '4', testFunction: 'return contarAcimaDe([5, 12, 8, 20, 11, 3, 15], 10) === 4;' },
      { description: 'Nenhum acima', input: 'contarAcimaDe([1, 2, 3, 4, 5, 6, 7], 10)', expectedOutput: '0', testFunction: 'return contarAcimaDe([1, 2, 3, 4, 5, 6, 7], 10) === 0;' },
      { description: 'Todos acima', input: 'contarAcimaDe([11, 12, 13, 14, 15, 16, 17], 10)', expectedOutput: '7', testFunction: 'return contarAcimaDe([11, 12, 13, 14, 15, 16, 17], 10) === 7;' },
      { description: 'Todos iguais ao limite não contam', input: 'contarAcimaDe([10, 10, 10, 10], 10)', expectedOutput: '0', testFunction: 'return contarAcimaDe([10, 10, 10, 10], 10) === 0;' },
      { description: 'Outro limite, mesmos dados', input: 'contarAcimaDe([5, 12, 8, 20, 11, 3, 15], 14)', expectedOutput: '2', testFunction: 'return contarAcimaDe([5, 12, 8, 20, 11, 3, 15], 14) === 2;' },
      { description: 'Limite negativo', input: 'contarAcimaDe([-5, 0, 3], -1)', expectedOutput: '2', testFunction: 'return contarAcimaDe([-5, 0, 3], -1) === 2;' },
    ],
    explanation:
      'O array de valores todos iguais a 10 com limite 10 devolve 0, e é aí que > se separa de >=. O penúltimo teste usa os mesmos dados com limite 14 para provar que o critério é mesmo o parâmetro: uma solução com o 10 escrito dentro do laço passa no primeiro teste e devolve 4 no segundo, quando a resposta é 2.',
  }),

  // Índice nº r27 — Somar até atingir 100
  logica({
    id: 'logica-r27-somar-ate-atingir-100',
    difficulty: 'intermediario',
    topic,
    title: 'Somar até Atingir 100',
    summary: 'Acumule valores até a soma chegar a 100 ou passar disso.',
    realWorldContext:
      'Carregar o caminhão até bater o peso máximo, somar pedidos até fechar o lote mínimo de frete grátis, encher a barra de progresso. O laço não para num número de voltas: para quando o acumulado chega onde precisava.',
    description:
      'Implemente somarAte100(valores), que soma os números do array na ordem e para assim que a soma atingir 100 ou passar disso, retornando essa soma. Se a soma de todos ainda ficar abaixo de 100, retorne a soma total.',
    goal: 'Usar o próprio acumulador como condição de parada.',
    signature: {
      javascript: 'function somarAte100(valores)',
      typescript: 'function somarAte100(valores: number[]): number',
    },
    body: `  let soma = 0;
  for (let i = 0; i < valores.length; i++) {
    soma = soma + valores[i];
    if (soma >= 100) {
      break;
    }
  }
  return soma;`,
    hints: [
      'Aqui o valor é somado antes do teste: só depois de somar você sabe se já chegou a 100. É o contrário do exercício da sentinela, em que o teste vem primeiro.',
      'A soma final pode passar de 100 — o enunciado pede para parar quando atingir ou ultrapassar, não para parar exatamente em 100.',
    ],
    testCases: [
      { description: 'Conjunto do enunciado', input: 'somarAte100([20, 15, 30, 25, 18])', expectedOutput: '108', testFunction: 'return somarAte100([20, 15, 30, 25, 18]) === 108;' },
      { description: 'Chega exatamente em 100', input: 'somarAte100([50, 50])', expectedOutput: '100', testFunction: 'return somarAte100([50, 50]) === 100;' },
      { description: 'Exatamente 100 no último valor', input: 'somarAte100([10, 20, 30, 40])', expectedOutput: '100', testFunction: 'return somarAte100([10, 20, 30, 40]) === 100;' },
      { description: 'Ultrapassa no terceiro valor', input: 'somarAte100([60, 25, 20])', expectedOutput: '105', testFunction: 'return somarAte100([60, 25, 20]) === 105;' },
      { description: 'Ultrapassa no quarto', input: 'somarAte100([33, 33, 33, 10])', expectedOutput: '109', testFunction: 'return somarAte100([33, 33, 33, 10]) === 109;' },
      { description: 'Atinge 100 exatamente e ainda sobra valor', input: 'somarAte100([50, 50, 7])', expectedOutput: '100', testFunction: 'return somarAte100([50, 50, 7]) === 100;' },
      { description: 'O resto é ignorado depois de atingir', input: 'somarAte100([50, 60, 999])', expectedOutput: '110', testFunction: 'return somarAte100([50, 60, 999]) === 110;' },
      { description: 'Nunca atinge 100', input: 'somarAte100([10, 20, 30])', expectedOutput: '60', testFunction: 'return somarAte100([10, 20, 30]) === 60;' },
    ],
    explanation:
      'O caso [50, 60, 999] confirma a parada: a resposta é 110 e não 1109. E [50, 50, 7] separa o >= do >: a soma bate exatamente em 100 e ainda há valor no array, então quem escreve soma > 100 continua e devolve 107. E [10, 20, 30] mostra o outro extremo — o laço termina por ter acabado o array, e a função devolve o que conseguiu somar. O exercício tem duas saídas possíveis, e as duas precisam devolver a soma correta: por isso o return fica fora do laço, depois de tudo.',
  }),
];
