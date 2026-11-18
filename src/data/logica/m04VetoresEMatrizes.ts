import { LogicExercise } from '../../types/exercise';
import { logica } from './logicFactory';

const topic = 'Vetores e Matrizes';

/**
 * Trilha de Lógica — Módulo 04: Vetores e Matrizes (índice: exercícios 61 a 80, completo).
 * Enunciados escritos do zero (ver docs/fase-4-indice-exercicios.md).
 * Vetor = array; matriz = array de arrays (number[][]). Os exercícios pedem o algoritmo "na mão":
 * nada de reverse, sort, filter, indexOf, includes ou Math.max — eles aparecem nas explicações
 * como o atalho que a linguagem oferece. Funções que recebem um vetor não devem alterá-lo.
 */
export const logicModule04: LogicExercise[] = [
  // Índice nº 61 — Vetor com múltiplos de 5
  logica({
    id: 'logica-061-vetor-com-multiplos-de-5',
    difficulty: 'basico',
    topic,
    title: 'Vetor com Múltiplos de 5',
    summary: 'Preencha um vetor com os N primeiros múltiplos de 5.',
    realWorldContext:
      'Escalas de gráfico (0, 5, 10, 15…), horários de 5 em 5 minutos num agendamento, faixas de preço: muitas telas começam gerando um vetor com valores em sequência.',
    description:
      'Implemente multiplosDe5(n), que retorna um vetor com os n primeiros múltiplos positivos de 5. Ex.: multiplosDe5(4) → [5, 10, 15, 20].',
    goal: 'Preencher um vetor posição a posição, calculando o valor pelo índice.',
    signature: { javascript: 'function multiplosDe5(n)', typescript: 'function multiplosDe5(n: number): number[]' },
    body: `  const vetor = [];
  for (let i = 0; i < n; i++) {
    vetor[i] = (i + 1) * 5;
  }
  return vetor;`,
    tsBody: `  const vetor: number[] = [];
  for (let i = 0; i < n; i++) {
    vetor[i] = (i + 1) * 5;
  }
  return vetor;`,
    hints: [
      'A posição 0 guarda o 1º múltiplo (5), a posição 1 o 2º (10)… O valor da posição i é (i + 1) * 5.',
      'Você pode atribuir direto na posição (vetor[i] = ...) ou usar vetor.push(...).',
    ],
    testCases: [
      { description: '4 múltiplos', input: 'multiplosDe5(4)', expectedOutput: '[5, 10, 15, 20]', testFunction: 'return JSON.stringify(multiplosDe5(4)) === "[5,10,15,20]";' },
      { description: '10 múltiplos', input: 'multiplosDe5(10)', expectedOutput: '[5, …, 50]', testFunction: 'const v = multiplosDe5(10); return v.length === 10 && v[0] === 5 && v[9] === 50;' },
      { description: 'Nenhum', input: 'multiplosDe5(0)', expectedOutput: '[]', testFunction: 'return JSON.stringify(multiplosDe5(0)) === "[]";' },
    ],
    explanation:
      'Vetores começam na posição 0, então a posição e a "ordem humana" diferem de 1: o 1º elemento está em [0]. Calcular o valor a partir do índice, (i + 1) * 5, é uma técnica que volta muito em vetores e matrizes.',
  }),

  // Índice nº 62 — Leitura e exibição de vetor
  logica({
    id: 'logica-062-leitura-e-exibicao-de-vetor',
    difficulty: 'basico',
    topic,
    title: 'Leitura e Exibição de Vetor',
    summary: 'Gere uma linha de texto para cada elemento, mostrando a posição e o valor.',
    realWorldContext:
      'Depurar um programa muitas vezes é "imprimir o vetor com as posições" para ver o que tem em cada uma. Listas numeradas em telas e relatórios seguem o mesmo formato.',
    description:
      'Implemente exibirVetor(valores), que retorna um vetor de textos no formato "[posição] = valor". Ex.: exibirVetor([7, 3]) → ["[0] = 7", "[1] = 3"].',
    goal: 'Percorrer com índice, usando tanto a posição quanto o valor.',
    signature: { javascript: 'function exibirVetor(valores)', typescript: 'function exibirVetor(valores: number[]): string[]' },
    body: `  const linhas = [];
  for (let i = 0; i < valores.length; i++) {
    linhas.push(\`[\${i}] = \${valores[i]}\`);
  }
  return linhas;`,
    tsBody: `  const linhas: string[] = [];
  for (let i = 0; i < valores.length; i++) {
    linhas.push(\`[\${i}] = \${valores[i]}\`);
  }
  return linhas;`,
    hints: [
      'Aqui você precisa da posição, então use o for com índice (i de 0 até valores.length - 1), e não o for...of.',
      'O valor da posição i é valores[i]. Monte o texto com template string.',
    ],
    testCases: [
      { description: 'Dois elementos', input: 'exibirVetor([7, 3])', expectedOutput: '["[0] = 7", "[1] = 3"]', testFunction: 'const l = exibirVetor([7, 3]); return l.length === 2 && l[0] === "[0] = 7" && l[1] === "[1] = 3";' },
      { description: 'Valores negativos', input: 'exibirVetor([-1, 0, 5])', expectedOutput: '["[0] = -1", "[1] = 0", "[2] = 5"]', testFunction: 'const l = exibirVetor([-1, 0, 5]); return l[2] === "[2] = 5" && l[0] === "[0] = -1";' },
      { description: 'Vetor vazio', input: 'exibirVetor([])', expectedOutput: '[]', testFunction: 'return exibirVetor([]).length === 0;' },
    ],
    explanation:
      'O for com índice dá acesso às duas coisas: a posição (i) e o conteúdo (valores[i]). O for...of é mais curto, mas só entrega o valor. A condição i < valores.length (e não <=) evita ler uma posição que não existe — valores[valores.length] é sempre undefined.',
  }),

  // Índice nº 63 — Vetor em ordem inversa
  logica({
    id: 'logica-063-vetor-em-ordem-inversa',
    difficulty: 'basico',
    topic,
    title: 'Vetor em Ordem Inversa',
    summary: 'Crie um novo vetor com os elementos na ordem contrária, sem usar reverse().',
    realWorldContext:
      'Feeds mostram o mais recente primeiro, históricos de navegação voltam do fim para o começo. Inverter uma lista é comum — e alterar a lista original sem querer é um bug comum também.',
    description:
      'Implemente inverter(valores), que retorna um NOVO vetor com os elementos de valores em ordem inversa. Não altere o vetor recebido e não use reverse().',
    goal: 'Percorrer de trás para frente montando um vetor novo.',
    signature: { javascript: 'function inverter(valores)', typescript: 'function inverter(valores: number[]): number[]' },
    body: `  const invertido = [];
  for (let i = valores.length - 1; i >= 0; i--) {
    invertido.push(valores[i]);
  }
  return invertido;`,
    tsBody: `  const invertido: number[] = [];
  for (let i = valores.length - 1; i >= 0; i--) {
    invertido.push(valores[i]);
  }
  return invertido;`,
    hints: [
      'A última posição é valores.length - 1. Comece nela e vá até 0 com i--.',
      'Use push num vetor novo. (valores.reverse() inverteria o próprio vetor recebido — justamente o que o enunciado proíbe.)',
    ],
    testCases: [
      { description: 'Inverte', input: 'inverter([1, 2, 3, 4])', expectedOutput: '[4, 3, 2, 1]', testFunction: 'return JSON.stringify(inverter([1, 2, 3, 4])) === "[4,3,2,1]";' },
      { description: 'Um elemento', input: 'inverter([9])', expectedOutput: '[9]', testFunction: 'return JSON.stringify(inverter([9])) === "[9]";' },
      { description: 'Não altera o original', input: 'const v = [1, 2, 3]; inverter(v); v', expectedOutput: '[1, 2, 3]', testFunction: 'const v = [1, 2, 3]; inverter(v); return JSON.stringify(v) === "[1,2,3]";' },
    ],
    explanation:
      'Arrays são passados por referência: se a função alterasse valores, quem a chamou veria a mudança. Criar um vetor novo mantém a função "pura" — mesma entrada, mesma saída, sem efeitos colaterais. A linguagem também oferece [...valores].reverse() e, nas versões novas, valores.toReversed().',
  }),

  // Índice nº 64 — Soma dos elementos do vetor
  logica({
    id: 'logica-064-soma-dos-elementos-do-vetor',
    difficulty: 'basico',
    topic,
    title: 'Soma dos Elementos do Vetor',
    summary: 'Calcule a soma e a média dos elementos de um vetor.',
    realWorldContext:
      'Total e média andam juntos em quase todo painel: faturamento total e ticket médio, horas totais e média por dia. Uma passada pelo vetor entrega os dois.',
    description:
      'Implemente somaEMedia(valores), que retorna { soma, media }. Para o vetor vazio, os dois valem 0.',
    goal: 'Percorrer o vetor por índice acumulando a soma; dividir pelo tamanho no fim.',
    signature: {
      javascript: 'function somaEMedia(valores)',
      typescript: 'function somaEMedia(valores: number[]): { soma: number; media: number }',
    },
    body: `  let soma = 0;
  for (let i = 0; i < valores.length; i++) {
    soma += valores[i];
  }
  const media = valores.length > 0 ? soma / valores.length : 0;
  return { soma, media };`,
    hints: [
      'Some valores[i] para i de 0 até valores.length - 1.',
      'A média é soma / valores.length — mas só se houver elementos.',
    ],
    testCases: [
      { description: 'Vetor comum', input: 'somaEMedia([2, 4, 6, 8])', expectedOutput: '{ soma: 20, media: 5 }', testFunction: 'const r = somaEMedia([2, 4, 6, 8]); return r.soma === 20 && r.media === 5;' },
      { description: 'Média decimal', input: 'somaEMedia([1, 2])', expectedOutput: '{ soma: 3, media: 1.5 }', testFunction: 'const r = somaEMedia([1, 2]); return r.soma === 3 && r.media === 1.5;' },
      { description: 'Vazio', input: 'somaEMedia([])', expectedOutput: '{ soma: 0, media: 0 }', testFunction: 'const r = somaEMedia([]); return r.soma === 0 && r.media === 0;' },
    ],
    explanation:
      'É o mesmo acumulador do módulo 03, agora com acesso por índice. Na prática, valores.reduce((total, v) => total + v, 0) faz a soma numa linha — mas entender o laço por trás é o que permite adaptar quando a regra fica mais complicada.',
  }),

  // Índice nº 65 — Valores acima da média
  logica({
    id: 'logica-065-valores-acima-da-media',
    difficulty: 'intermediario',
    topic,
    title: 'Valores Acima da Média',
    summary: 'Devolva os elementos do vetor que estão acima da média.',
    realWorldContext:
      'Destacar os produtos que vendem acima da média, os funcionários com produtividade acima da média, os dias mais quentes que o normal: primeiro calcula-se a média, depois filtra-se.',
    description:
      'Implemente acimaDaMedia(valores), que retorna um novo vetor com os elementos maiores que a média, na ordem em que aparecem. Não use filter.',
    goal: 'Duas passadas: uma para a média, outra para selecionar os elementos.',
    signature: { javascript: 'function acimaDaMedia(valores)', typescript: 'function acimaDaMedia(valores: number[]): number[]' },
    body: `  const selecionados = [];
  if (valores.length === 0) {
    return selecionados;
  }
  let soma = 0;
  for (const valor of valores) {
    soma += valor;
  }
  const media = soma / valores.length;
  for (const valor of valores) {
    if (valor > media) {
      selecionados.push(valor);
    }
  }
  return selecionados;`,
    tsBody: `  const selecionados: number[] = [];
  if (valores.length === 0) {
    return selecionados;
  }
  let soma = 0;
  for (const valor of valores) {
    soma += valor;
  }
  const media = soma / valores.length;
  for (const valor of valores) {
    if (valor > media) {
      selecionados.push(valor);
    }
  }
  return selecionados;`,
    hints: [
      'Primeiro laço: calcule a média. Segundo laço: guarde num vetor novo cada valor maior que ela.',
      'Estritamente acima: valor > media. Um vetor vazio não tem média — devolva [] logo de cara.',
    ],
    testCases: [
      { description: 'Vetor comum', input: 'acimaDaMedia([1, 5, 3, 9, 2])', expectedOutput: '[5, 9]', testFunction: 'return JSON.stringify(acimaDaMedia([1, 5, 3, 9, 2])) === "[5,9]";' },
      { description: 'Todos iguais', input: 'acimaDaMedia([4, 4, 4])', expectedOutput: '[]', testFunction: 'return JSON.stringify(acimaDaMedia([4, 4, 4])) === "[]";' },
      { description: 'Mantém a ordem', input: 'acimaDaMedia([10, 0, 8, 2])', expectedOutput: '[10, 8]', testFunction: 'return JSON.stringify(acimaDaMedia([10, 0, 8, 2])) === "[10,8]";' },
      { description: 'Vazio', input: 'acimaDaMedia([])', expectedOutput: '[]', testFunction: 'return JSON.stringify(acimaDaMedia([])) === "[]";' },
    ],
    explanation:
      'É o exercício 53 devolvendo os próprios valores em vez de contá-los. A versão com os métodos da linguagem seria valores.filter(v => v > media) — o filter faz exatamente o segundo laço: percorre e guarda quem passa no teste.',
  }),

  // Índice nº 66 — Pares e suas posições
  logica({
    id: 'logica-066-pares-e-suas-posicoes',
    difficulty: 'intermediario',
    topic,
    title: 'Pares e suas Posições',
    summary: 'Liste os números pares do vetor junto com a posição de cada um.',
    realWorldContext:
      'Validadores de planilha apontam "linha 3, linha 7" com problema: não basta saber o valor, é preciso dizer onde ele está. Guardar posição e valor juntos é o primeiro passo.',
    description:
      'Implemente paresComPosicao(valores), que retorna um vetor de objetos { posicao, valor } para cada número par, na ordem do vetor.',
    goal: 'Percorrer por índice e montar um objeto para cada elemento selecionado.',
    signature: {
      javascript: 'function paresComPosicao(valores)',
      typescript: 'function paresComPosicao(valores: number[]): { posicao: number; valor: number }[]',
    },
    body: `  const pares = [];
  for (let i = 0; i < valores.length; i++) {
    if (valores[i] % 2 === 0) {
      pares.push({ posicao: i, valor: valores[i] });
    }
  }
  return pares;`,
    tsBody: `  const pares: { posicao: number; valor: number }[] = [];
  for (let i = 0; i < valores.length; i++) {
    if (valores[i] % 2 === 0) {
      pares.push({ posicao: i, valor: valores[i] });
    }
  }
  return pares;`,
    hints: [
      'Use o for com índice: a posição é o i e o valor é valores[i].',
      'Para cada par, faça push de um objeto { posicao: i, valor: valores[i] }.',
    ],
    testCases: [
      { description: 'Vetor misto', input: 'paresComPosicao([3, 8, 5, 6])', expectedOutput: '[{ posicao: 1, valor: 8 }, { posicao: 3, valor: 6 }]', testFunction: 'const p = paresComPosicao([3, 8, 5, 6]); return p.length === 2 && p[0].posicao === 1 && p[0].valor === 8 && p[1].posicao === 3 && p[1].valor === 6;' },
      { description: 'Par na posição 0', input: 'paresComPosicao([4, 1])', expectedOutput: '[{ posicao: 0, valor: 4 }]', testFunction: 'const p = paresComPosicao([4, 1]); return p.length === 1 && p[0].posicao === 0 && p[0].valor === 4;' },
      { description: 'Sem pares', input: 'paresComPosicao([1, 3, 5])', expectedOutput: '[]', testFunction: 'return paresComPosicao([1, 3, 5]).length === 0;' },
    ],
    explanation:
      'Um vetor de objetos é a estrutura mais comum em sistemas reais (lista de pedidos, de usuários…). No TypeScript, o tipo { posicao: number; valor: number }[] descreve cada item; com ele, o compilador recusa um push com o campo escrito errado.',
  }),

  // Índice nº 67 — Maior valor e posição
  logica({
    id: 'logica-067-maior-valor-e-posicao',
    difficulty: 'intermediario',
    topic,
    title: 'Maior Valor e Posição',
    summary: 'Encontre o maior valor do vetor e a posição em que ele aparece primeiro.',
    realWorldContext:
      'Saber o maior valor é metade da resposta: o gerente quer saber qual foi o melhor dia de vendas, não só quanto se vendeu nele. A posição identifica o dia.',
    description:
      'Implemente maiorComPosicao(valores), que retorna { valor, posicao } do maior elemento de um vetor com pelo menos um item. Se o maior se repetir, retorne a primeira posição.',
    goal: 'Guardar o maior valor e o índice dele ao mesmo tempo.',
    signature: {
      javascript: 'function maiorComPosicao(valores)',
      typescript: 'function maiorComPosicao(valores: number[]): { valor: number; posicao: number }',
    },
    body: `  let posicao = 0;
  for (let i = 1; i < valores.length; i++) {
    if (valores[i] > valores[posicao]) {
      posicao = i;
    }
  }
  return { valor: valores[posicao], posicao };`,
    hints: [
      'Basta guardar a posição do maior: o valor é valores[posicao]. Comece supondo a posição 0.',
      'Use > (e não >=) na comparação: assim, num empate, a primeira posição é mantida.',
    ],
    testCases: [
      { description: 'Vetor comum', input: 'maiorComPosicao([4, 9, 2, 7])', expectedOutput: '{ valor: 9, posicao: 1 }', testFunction: 'const r = maiorComPosicao([4, 9, 2, 7]); return r.valor === 9 && r.posicao === 1;' },
      { description: 'Empate fica com o primeiro', input: 'maiorComPosicao([5, 8, 8, 1])', expectedOutput: '{ valor: 8, posicao: 1 }', testFunction: 'const r = maiorComPosicao([5, 8, 8, 1]); return r.valor === 8 && r.posicao === 1;' },
      { description: 'Todos negativos', input: 'maiorComPosicao([-5, -2, -9])', expectedOutput: '{ valor: -2, posicao: 1 }', testFunction: 'const r = maiorComPosicao([-5, -2, -9]); return r.valor === -2 && r.posicao === 1;' },
      { description: 'Maior na posição 0', input: 'maiorComPosicao([10, 3])', expectedOutput: '{ valor: 10, posicao: 0 }', testFunction: 'const r = maiorComPosicao([10, 3]); return r.valor === 10 && r.posicao === 0;' },
    ],
    explanation:
      'Guardar só o índice evita manter duas variáveis em sincronia. A escolha entre > e >= decide o empate: > mantém a primeira ocorrência, >= ficaria com a última. Regras de desempate parecem detalhe, mas mudam o resultado — sempre vale deixá-las explícitas no enunciado.',
  }),

  // Índice nº 68 — Menor valor e posição
  logica({
    id: 'logica-068-menor-valor-e-posicao',
    difficulty: 'intermediario',
    topic,
    title: 'Menor Valor e Posição',
    summary: 'Encontre o menor valor do vetor e todas as posições em que ele aparece.',
    realWorldContext:
      'Num ranking de tempos, o menor tempo vence — e pode haver empate. O resultado precisa mostrar todos os empatados, não só o primeiro.',
    description:
      'Implemente menorComPosicoes(valores), que retorna { valor, posicoes } para um vetor com pelo menos um item: o menor valor e um vetor com todas as posições em que ele aparece.',
    goal: 'Uma passada para achar o menor e outra para coletar as posições.',
    signature: {
      javascript: 'function menorComPosicoes(valores)',
      typescript: 'function menorComPosicoes(valores: number[]): { valor: number; posicoes: number[] }',
    },
    body: `  let menor = valores[0];
  for (const valor of valores) {
    if (valor < menor) {
      menor = valor;
    }
  }
  const posicoes = [];
  for (let i = 0; i < valores.length; i++) {
    if (valores[i] === menor) {
      posicoes.push(i);
    }
  }
  return { valor: menor, posicoes };`,
    tsBody: `  let menor = valores[0];
  for (const valor of valores) {
    if (valor < menor) {
      menor = valor;
    }
  }
  const posicoes: number[] = [];
  for (let i = 0; i < valores.length; i++) {
    if (valores[i] === menor) {
      posicoes.push(i);
    }
  }
  return { valor: menor, posicoes };`,
    hints: [
      'Primeiro descubra o menor valor (começando por valores[0]).',
      'Depois percorra de novo, por índice, guardando cada posição em que valores[i] === menor.',
    ],
    testCases: [
      { description: 'Menor único', input: 'menorComPosicoes([4, 1, 7])', expectedOutput: '{ valor: 1, posicoes: [1] }', testFunction: 'const r = menorComPosicoes([4, 1, 7]); return r.valor === 1 && JSON.stringify(r.posicoes) === "[1]";' },
      { description: 'Empate', input: 'menorComPosicoes([3, 2, 5, 2])', expectedOutput: '{ valor: 2, posicoes: [1, 3] }', testFunction: 'const r = menorComPosicoes([3, 2, 5, 2]); return r.valor === 2 && JSON.stringify(r.posicoes) === "[1,3]";' },
      { description: 'Todos iguais', input: 'menorComPosicoes([6, 6, 6])', expectedOutput: '{ valor: 6, posicoes: [0, 1, 2] }', testFunction: 'const r = menorComPosicoes([6, 6, 6]); return r.valor === 6 && JSON.stringify(r.posicoes) === "[0,1,2]";' },
    ],
    explanation:
      'Daria para fazer em uma passada (zerando a lista de posições toda vez que aparece um menor novo), mas duas passadas simples são mais fáceis de acertar. Escolher a versão mais clara, quando a diferença de desempenho é irrelevante, é uma decisão de engenharia legítima.',
  }),

  // Índice nº 69 — Busca de valor no vetor
  logica({
    id: 'logica-069-busca-de-valor-no-vetor',
    difficulty: 'basico',
    topic,
    title: 'Busca de Valor no Vetor',
    summary: 'Encontre a posição de um valor no vetor, sem usar indexOf.',
    realWorldContext:
      'Procurar um CPF numa lista de clientes ou um código num estoque é busca. A versão mais simples — olhar um por um até achar — se chama busca sequencial.',
    description:
      'Implemente buscar(valores, alvo), que retorna a posição da primeira ocorrência de alvo no vetor, ou -1 se ele não estiver lá. Não use indexOf nem includes.',
    goal: 'Implementar a busca sequencial com saída antecipada.',
    signature: { javascript: 'function buscar(valores, alvo)', typescript: 'function buscar(valores: number[], alvo: number): number' },
    body: `  for (let i = 0; i < valores.length; i++) {
    if (valores[i] === alvo) {
      return i;
    }
  }
  return -1;`,
    hints: [
      'Percorra por índice e, ao encontrar valores[i] === alvo, retorne i na hora.',
      'Se o laço terminar sem achar, o valor não está no vetor: retorne -1.',
    ],
    testCases: [
      { description: 'Encontra', input: 'buscar([5, 8, 2, 9], 2)', expectedOutput: '2', testFunction: 'return buscar([5, 8, 2, 9], 2) === 2;' },
      { description: 'Primeira ocorrência', input: 'buscar([1, 7, 7], 7)', expectedOutput: '1', testFunction: 'return buscar([1, 7, 7], 7) === 1;' },
      { description: 'Na posição 0', input: 'buscar([3, 4], 3)', expectedOutput: '0', testFunction: 'return buscar([3, 4], 3) === 0;' },
      { description: 'Não encontra', input: 'buscar([1, 2, 3], 10)', expectedOutput: '-1', testFunction: 'return buscar([1, 2, 3], 10) === -1;' },
    ],
    explanation:
      'A busca sequencial olha, no pior caso, todos os elementos. Para listas ordenadas existe a busca binária, que descarta metade a cada passo (para 1 milhão de itens, cerca de 20 comparações). O indexOf da linguagem faz exatamente esta busca sequencial.',
  }),

  // Índice nº 70 — Quantidade de ocorrências
  logica({
    id: 'logica-070-quantidade-de-ocorrencias',
    difficulty: 'basico',
    topic,
    title: 'Quantidade de Ocorrências',
    summary: 'Conte quantas vezes um valor aparece no vetor.',
    realWorldContext:
      'Quantas vezes um produto foi vendido, quantos votos um candidato recebeu, quantas vezes um erro apareceu no log: contar ocorrências é a base de qualquer estatística simples.',
    description:
      'Implemente contarOcorrencias(valores, alvo), que retorna quantas vezes alvo aparece no vetor.',
    goal: 'Percorrer o vetor inteiro contando as igualdades.',
    signature: {
      javascript: 'function contarOcorrencias(valores, alvo)',
      typescript: 'function contarOcorrencias(valores: number[], alvo: number): number',
    },
    body: `  let quantidade = 0;
  for (const valor of valores) {
    if (valor === alvo) {
      quantidade++;
    }
  }
  return quantidade;`,
    hints: [
      'Diferente da busca, aqui não dá para parar no primeiro: é preciso olhar o vetor inteiro.',
      'Um contador começando em 0, incrementado a cada valor === alvo.',
    ],
    testCases: [
      { description: 'Várias vezes', input: 'contarOcorrencias([2, 5, 2, 2, 7], 2)', expectedOutput: '3', testFunction: 'return contarOcorrencias([2, 5, 2, 2, 7], 2) === 3;' },
      { description: 'Uma vez', input: 'contarOcorrencias([1, 2, 3], 3)', expectedOutput: '1', testFunction: 'return contarOcorrencias([1, 2, 3], 3) === 1;' },
      { description: 'Nenhuma', input: 'contarOcorrencias([1, 2, 3], 4)', expectedOutput: '0', testFunction: 'return contarOcorrencias([1, 2, 3], 4) === 0;' },
      { description: 'Vetor vazio', input: 'contarOcorrencias([], 1)', expectedOutput: '0', testFunction: 'return contarOcorrencias([], 1) === 0;' },
    ],
    explanation:
      'Buscar (parar no primeiro) e contar (olhar todos) parecem iguais, mas o critério de parada é diferente. Um return dentro do laço aqui seria um bug: devolveria 1 sempre que o valor existisse.',
  }),

  // Índice nº 71 — Copiar apenas valores positivos
  logica({
    id: 'logica-071-copiar-apenas-valores-positivos',
    difficulty: 'basico',
    topic,
    title: 'Copiar Apenas Valores Positivos',
    summary: 'Crie um novo vetor só com os valores positivos, sem usar filter.',
    realWorldContext:
      'Limpar dados antes de analisar é rotina: descartar leituras negativas de um sensor, entradas zeradas de uma planilha. O original fica intacto; o resultado vai para um vetor novo.',
    description:
      'Implemente somentePositivos(valores), que retorna um novo vetor com os elementos maiores que zero, na ordem original. Não altere o vetor recebido e não use filter.',
    goal: 'Copiar seletivamente para um vetor novo.',
    signature: { javascript: 'function somentePositivos(valores)', typescript: 'function somentePositivos(valores: number[]): number[]' },
    body: `  const positivos = [];
  for (const valor of valores) {
    if (valor > 0) {
      positivos.push(valor);
    }
  }
  return positivos;`,
    tsBody: `  const positivos: number[] = [];
  for (const valor of valores) {
    if (valor > 0) {
      positivos.push(valor);
    }
  }
  return positivos;`,
    hints: [
      'Crie um vetor vazio e faça push só dos valores maiores que zero.',
      'O zero não é positivo: a condição é valor > 0.',
    ],
    testCases: [
      { description: 'Vetor misto', input: 'somentePositivos([3, -1, 0, 8, -4])', expectedOutput: '[3, 8]', testFunction: 'return JSON.stringify(somentePositivos([3, -1, 0, 8, -4])) === "[3,8]";' },
      { description: 'Sem positivos', input: 'somentePositivos([-1, 0])', expectedOutput: '[]', testFunction: 'return JSON.stringify(somentePositivos([-1, 0])) === "[]";' },
      { description: 'Não altera o original', input: 'const v = [1, -2]; somentePositivos(v); v', expectedOutput: '[1, -2]', testFunction: 'const v = [1, -2]; somentePositivos(v); return JSON.stringify(v) === "[1,-2]";' },
    ],
    explanation:
      'Este é o padrão "filtrar": percorrer, testar, copiar quem passa. É exatamente o que valores.filter(v => v > 0) faz. Remover os negativos do próprio vetor (com splice dentro do laço) seria mais difícil de acertar — os índices mudam enquanto você percorre.',
  }),

  // Índice nº 72 — Intercalar dois vetores
  logica({
    id: 'logica-072-intercalar-dois-vetores',
    difficulty: 'intermediario',
    topic,
    title: 'Intercalar Dois Vetores',
    summary: 'Junte dois vetores alternando um elemento de cada.',
    realWorldContext:
      'Um feed que alterna posts de amigos e de páginas, uma playlist que intercala duas listas, um baralho embaralhado "à americana": todos intercalam duas sequências e precisam lidar com a que acaba primeiro.',
    description:
      'Implemente intercalar(a, b), que retorna um vetor com a[0], b[0], a[1], b[1], … Se um vetor for maior, os elementos que sobrarem vão para o final, na ordem.',
    goal: 'Percorrer até o tamanho do maior vetor, pegando de cada um quando houver elemento.',
    signature: { javascript: 'function intercalar(a, b)', typescript: 'function intercalar(a: number[], b: number[]): number[]' },
    body: `  const resultado = [];
  const tamanho = Math.max(a.length, b.length);
  for (let i = 0; i < tamanho; i++) {
    if (i < a.length) resultado.push(a[i]);
    if (i < b.length) resultado.push(b[i]);
  }
  return resultado;`,
    tsBody: `  const resultado: number[] = [];
  const tamanho = Math.max(a.length, b.length);
  for (let i = 0; i < tamanho; i++) {
    if (i < a.length) resultado.push(a[i]);
    if (i < b.length) resultado.push(b[i]);
  }
  return resultado;`,
    hints: [
      'Percorra os índices até o tamanho do maior vetor. Em cada volta, pegue a[i] e depois b[i].',
      'Antes de pegar, confira se aquele vetor ainda tem a posição i (i < a.length); senão você empurraria undefined.',
    ],
    testCases: [
      { description: 'Mesmo tamanho', input: 'intercalar([1, 3, 5], [2, 4, 6])', expectedOutput: '[1, 2, 3, 4, 5, 6]', testFunction: 'return JSON.stringify(intercalar([1, 3, 5], [2, 4, 6])) === "[1,2,3,4,5,6]";' },
      { description: 'Primeiro maior', input: 'intercalar([1, 3, 5, 7], [2])', expectedOutput: '[1, 2, 3, 5, 7]', testFunction: 'return JSON.stringify(intercalar([1, 3, 5, 7], [2])) === "[1,2,3,5,7]";' },
      { description: 'Segundo maior', input: 'intercalar([9], [8, 7, 6])', expectedOutput: '[9, 8, 7, 6]', testFunction: 'return JSON.stringify(intercalar([9], [8, 7, 6])) === "[9,8,7,6]";' },
      { description: 'Um vazio', input: 'intercalar([], [1, 2])', expectedOutput: '[1, 2]', testFunction: 'return JSON.stringify(intercalar([], [1, 2])) === "[1,2]";' },
    ],
    explanation:
      'O cuidado é com tamanhos diferentes: ler a[i] além do fim dá undefined, e JSON.stringify o mostraria como null. Conferir os limites antes de acessar — "esse índice existe?" — é a principal fonte de bugs com vetores.',
  }),

  // Índice nº 73 — Comparar dois vetores
  logica({
    id: 'logica-073-comparar-dois-vetores',
    difficulty: 'intermediario',
    topic,
    title: 'Comparar Dois Vetores',
    summary: 'Verifique se dois vetores têm os mesmos elementos na mesma ordem.',
    realWorldContext:
      'Testes automatizados comparam o resultado obtido com o esperado; sistemas de sincronização comparam a versão local com a da nuvem. E em JS/TS, a === b não compara o conteúdo de arrays.',
    description:
      'Implemente vetoresIguais(a, b), que retorna true se os dois vetores têm o mesmo tamanho e os mesmos elementos nas mesmas posições.',
    goal: 'Comparar tamanho e depois elemento a elemento, parando na primeira diferença.',
    signature: { javascript: 'function vetoresIguais(a, b)', typescript: 'function vetoresIguais(a: number[], b: number[]): boolean' },
    body: `  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;`,
    hints: [
      'Se os tamanhos forem diferentes, já não são iguais.',
      'Depois compare posição a posição: na primeira diferença, retorne false. Se o laço terminar, são iguais.',
    ],
    testCases: [
      { description: 'Iguais', input: 'vetoresIguais([1, 2, 3], [1, 2, 3])', expectedOutput: 'true', testFunction: 'return vetoresIguais([1, 2, 3], [1, 2, 3]) === true;' },
      { description: 'Ordem diferente', input: 'vetoresIguais([1, 2, 3], [3, 2, 1])', expectedOutput: 'false', testFunction: 'return vetoresIguais([1, 2, 3], [3, 2, 1]) === false;' },
      { description: 'Tamanhos diferentes', input: 'vetoresIguais([1, 2], [1, 2, 3])', expectedOutput: 'false', testFunction: 'return vetoresIguais([1, 2], [1, 2, 3]) === false && vetoresIguais([1, 2, 3], [1, 2]) === false;' },
      { description: 'Dois vazios', input: 'vetoresIguais([], [])', expectedOutput: 'true', testFunction: 'return vetoresIguais([], []) === true;' },
    ],
    explanation:
      'Em JS/TS, [1, 2] === [1, 2] é false: === em arrays compara se são o mesmo objeto na memória, não o conteúdo. Por isso comparar vetores exige um laço. Sem o teste de tamanho, [1, 2] e [1, 2, 3] pareceriam iguais (o laço só olharia as duas primeiras posições).',
  }),

  // Índice nº 74 — Nomes acima da média
  logica({
    id: 'logica-074-nomes-acima-da-media',
    difficulty: 'intermediario',
    topic,
    title: 'Nomes Acima da Média',
    summary: 'Com dois vetores paralelos (nomes e notas), liste quem ficou acima da média.',
    realWorldContext:
      'Planilhas exportadas costumam vir em colunas: uma de nomes, outra de notas, alinhadas pela linha. Relacionar as duas pela posição é a técnica de "vetores paralelos".',
    description:
      'Implemente alunosAcimaDaMedia(nomes, notas). nomes[i] é o aluno que tirou notas[i]. Retorne os nomes dos alunos com nota maior que a média da turma, na ordem original. Turma vazia → [].',
    goal: 'Usar o mesmo índice para acessar dois vetores relacionados.',
    signature: {
      javascript: 'function alunosAcimaDaMedia(nomes, notas)',
      typescript: 'function alunosAcimaDaMedia(nomes: string[], notas: number[]): string[]',
    },
    body: `  const selecionados = [];
  if (notas.length === 0) {
    return selecionados;
  }
  let soma = 0;
  for (const nota of notas) {
    soma += nota;
  }
  const media = soma / notas.length;
  for (let i = 0; i < notas.length; i++) {
    if (notas[i] > media) {
      selecionados.push(nomes[i]);
    }
  }
  return selecionados;`,
    tsBody: `  const selecionados: string[] = [];
  if (notas.length === 0) {
    return selecionados;
  }
  let soma = 0;
  for (const nota of notas) {
    soma += nota;
  }
  const media = soma / notas.length;
  for (let i = 0; i < notas.length; i++) {
    if (notas[i] > media) {
      selecionados.push(nomes[i]);
    }
  }
  return selecionados;`,
    hints: [
      'Calcule a média das notas. Depois percorra por índice: se notas[i] passa da média, o nome é nomes[i].',
      'O segundo laço precisa ser com índice — com for...of nas notas você perderia a ligação com o nome.',
    ],
    testCases: [
      { description: 'Turma comum', input: "alunosAcimaDaMedia(['Ana', 'Bia', 'Caio'], [9, 5, 7])", expectedOutput: '["Ana"]', testFunction: "return JSON.stringify(alunosAcimaDaMedia(['Ana', 'Bia', 'Caio'], [9, 5, 7])) === '[\"Ana\"]';" },
      { description: 'Mais de um', input: "alunosAcimaDaMedia(['Ana', 'Bia', 'Caio', 'Davi'], [8, 4, 9, 3])", expectedOutput: '["Ana", "Caio"]', testFunction: "return JSON.stringify(alunosAcimaDaMedia(['Ana', 'Bia', 'Caio', 'Davi'], [8, 4, 9, 3])) === '[\"Ana\",\"Caio\"]';" },
      { description: 'Todos iguais', input: "alunosAcimaDaMedia(['Ana', 'Bia'], [7, 7])", expectedOutput: '[]', testFunction: "return alunosAcimaDaMedia(['Ana', 'Bia'], [7, 7]).length === 0;" },
      { description: 'Turma vazia', input: 'alunosAcimaDaMedia([], [])', expectedOutput: '[]', testFunction: 'return alunosAcimaDaMedia([], []).length === 0;' },
    ],
    explanation:
      'Vetores paralelos funcionam, mas são frágeis: se alguém ordenar um vetor e esquecer o outro, os dados se desalinham. Por isso, em código real, o mais comum é um vetor de objetos — [{ nome: "Ana", nota: 9 }, ...] — como no exercício 66.',
  }),

  // Índice nº 75 — Ordenação crescente
  logica({
    id: 'logica-075-ordenacao-crescente',
    difficulty: 'avancado',
    topic,
    title: 'Ordenação Crescente',
    summary: 'Ordene um vetor em ordem crescente implementando o Bubble Sort, sem usar sort().',
    realWorldContext:
      'Ordenar é uma das operações mais estudadas da computação: rankings, listas por preço, contatos por nome. Implementar um algoritmo de ordenação à mão é o rito de passagem de quem aprende lógica.',
    description:
      'Implemente ordenar(valores), que retorna um NOVO vetor com os elementos em ordem crescente. Não use sort() e não altere o vetor recebido. Sugestão: Bubble Sort — percorra o vetor trocando vizinhos fora de ordem, e repita até não haver mais trocas.',
    goal: 'Implementar um algoritmo de ordenação com laços aninhados e trocas.',
    signature: { javascript: 'function ordenar(valores)', typescript: 'function ordenar(valores: number[]): number[]' },
    body: `  const v = [...valores];
  for (let fim = v.length - 1; fim > 0; fim--) {
    for (let i = 0; i < fim; i++) {
      if (v[i] > v[i + 1]) {
        const auxiliar = v[i];
        v[i] = v[i + 1];
        v[i + 1] = auxiliar;
      }
    }
  }
  return v;`,
    hints: [
      'Copie o vetor antes de mexer: const v = [...valores]. Assim o original fica intacto.',
      'Uma "passada" compara cada par vizinho (v[i] e v[i + 1]) e troca se estiver fora de ordem — isso leva o maior para o fim. Repita as passadas, cada uma um pouco mais curta (laço externo).',
    ],
    testCases: [
      { description: 'Desordenado', input: 'ordenar([5, 2, 9, 1, 3])', expectedOutput: '[1, 2, 3, 5, 9]', testFunction: 'return JSON.stringify(ordenar([5, 2, 9, 1, 3])) === "[1,2,3,5,9]";' },
      { description: 'Ordem inversa', input: 'ordenar([4, 3, 2, 1])', expectedOutput: '[1, 2, 3, 4]', testFunction: 'return JSON.stringify(ordenar([4, 3, 2, 1])) === "[1,2,3,4]";' },
      { description: 'Repetidos e negativos', input: 'ordenar([3, -1, 3, 0, -1])', expectedOutput: '[-1, -1, 0, 3, 3]', testFunction: 'return JSON.stringify(ordenar([3, -1, 3, 0, -1])) === "[-1,-1,0,3,3]";' },
      { description: 'Números com mais de um dígito', input: 'ordenar([10, 9, 100, 1])', expectedOutput: '[1, 9, 10, 100]', testFunction: 'return JSON.stringify(ordenar([10, 9, 100, 1])) === "[1,9,10,100]";' },
      { description: 'Não altera o original', input: 'const v = [2, 1]; ordenar(v); v', expectedOutput: '[2, 1]', testFunction: 'const v = [2, 1]; ordenar(v); return JSON.stringify(v) === "[2,1]";' },
    ],
    explanation:
      'Cada passada do Bubble Sort "borbulha" o maior elemento restante até o fim, então a passada seguinte pode parar uma posição antes. São cerca de n² comparações — ótimo para aprender, lento para listas grandes (por isso a linguagem usa algoritmos melhores). Atenção ao sort() da linguagem: sem argumento ele ordena como texto, e [10, 9, 100, 1].sort() dá [1, 10, 100, 9]. O certo é sort((a, b) => a - b).',
  }),

  // Índice nº 76 — Leitura de matriz 3 x 3
  logica({
    id: 'logica-076-leitura-de-matriz-3-x-3',
    difficulty: 'intermediario',
    topic,
    title: 'Leitura de Matriz 3 x 3',
    summary: 'Monte uma matriz N × N preenchida com 1, 2, 3, … linha por linha.',
    realWorldContext:
      'Tabuleiros de jogos, planilhas, imagens (pixels em linhas e colunas) e assentos de cinema são matrizes. Montar uma é o primeiro passo para trabalhar com dados em duas dimensões.',
    description:
      'Implemente matrizSequencial(n), que retorna uma matriz n × n (um vetor de n linhas, cada uma com n números) preenchida em sequência a partir de 1. Ex.: n = 3 → [[1, 2, 3], [4, 5, 6], [7, 8, 9]].',
    goal: 'Usar dois laços aninhados: um para as linhas e outro para as colunas.',
    signature: { javascript: 'function matrizSequencial(n)', typescript: 'function matrizSequencial(n: number): number[][]' },
    body: `  const matriz = [];
  let proximo = 1;
  for (let linha = 0; linha < n; linha++) {
    const valoresDaLinha = [];
    for (let coluna = 0; coluna < n; coluna++) {
      valoresDaLinha.push(proximo);
      proximo++;
    }
    matriz.push(valoresDaLinha);
  }
  return matriz;`,
    tsBody: `  const matriz: number[][] = [];
  let proximo = 1;
  for (let linha = 0; linha < n; linha++) {
    const valoresDaLinha: number[] = [];
    for (let coluna = 0; coluna < n; coluna++) {
      valoresDaLinha.push(proximo);
      proximo++;
    }
    matriz.push(valoresDaLinha);
  }
  return matriz;`,
    hints: [
      'Uma matriz é um vetor de vetores. O laço de fora cria cada linha; o de dentro preenche as colunas dessa linha.',
      'Um contador (proximo) que começa em 1 e sobe a cada célula gera a sequência. Crie o vetor da linha dentro do laço de fora.',
    ],
    testCases: [
      { description: '3 × 3', input: 'matrizSequencial(3)', expectedOutput: '[[1, 2, 3], [4, 5, 6], [7, 8, 9]]', testFunction: 'return JSON.stringify(matrizSequencial(3)) === "[[1,2,3],[4,5,6],[7,8,9]]";' },
      { description: '1 × 1', input: 'matrizSequencial(1)', expectedOutput: '[[1]]', testFunction: 'return JSON.stringify(matrizSequencial(1)) === "[[1]]";' },
      { description: '4 × 4: último é 16', input: 'matrizSequencial(4)[3][3]', expectedOutput: '16', testFunction: 'const m = matrizSequencial(4); return m.length === 4 && m[3].length === 4 && m[3][3] === 16 && m[1][0] === 5;' },
    ],
    explanation:
      'm[linha][coluna] acessa uma célula: primeiro escolhe-se a linha (um vetor), depois a posição dentro dela. Criar o vetor da linha dentro do laço de fora é essencial — se ele fosse criado uma vez só, fora dos laços, todas as linhas seriam o mesmo vetor.',
  }),

  // Índice nº 77 — Soma dos elementos da matriz
  logica({
    id: 'logica-077-soma-dos-elementos-da-matriz',
    difficulty: 'intermediario',
    topic,
    title: 'Soma dos Elementos da Matriz',
    summary: 'Some todos os números de uma matriz.',
    realWorldContext:
      'Uma planilha de vendas por loja (linhas) e por mês (colunas) tem um total geral no canto. Calculá-lo é percorrer todas as células da matriz.',
    description:
      'Implemente somaMatriz(matriz), que retorna a soma de todos os elementos. As linhas podem ter tamanhos diferentes.',
    goal: 'Percorrer todas as células com laços aninhados.',
    signature: { javascript: 'function somaMatriz(matriz)', typescript: 'function somaMatriz(matriz: number[][]): number' },
    body: `  let soma = 0;
  for (const linha of matriz) {
    for (const valor of linha) {
      soma += valor;
    }
  }
  return soma;`,
    hints: [
      'O laço de fora visita cada linha (um vetor); o de dentro visita cada número dessa linha.',
      'Para aceitar linhas de tamanhos diferentes, o laço de dentro deve usar o tamanho da própria linha — com for...of isso já acontece.',
    ],
    testCases: [
      { description: '2 × 3', input: 'somaMatriz([[1, 2, 3], [4, 5, 6]])', expectedOutput: '21', testFunction: 'return somaMatriz([[1, 2, 3], [4, 5, 6]]) === 21;' },
      { description: 'Com negativos', input: 'somaMatriz([[10, -10], [5, 0]])', expectedOutput: '5', testFunction: 'return somaMatriz([[10, -10], [5, 0]]) === 5;' },
      { description: 'Linhas de tamanhos diferentes', input: 'somaMatriz([[1], [2, 3], [4, 5, 6]])', expectedOutput: '21', testFunction: 'return somaMatriz([[1], [2, 3], [4, 5, 6]]) === 21;' },
      { description: 'Matriz vazia', input: 'somaMatriz([])', expectedOutput: '0', testFunction: 'return somaMatriz([]) === 0;' },
    ],
    explanation:
      'Laços aninhados executam o de dentro completo para cada volta do de fora: numa matriz 3 × 4, são 12 visitas. Usar o tamanho de cada linha (e não um número fixo) torna o código correto também para matrizes "irregulares".',
  }),

  // Índice nº 78 — Diagonal principal
  logica({
    id: 'logica-078-diagonal-principal',
    difficulty: 'intermediario',
    topic,
    title: 'Diagonal Principal',
    summary: 'Extraia os elementos da diagonal principal de uma matriz quadrada.',
    realWorldContext:
      'Em jogos de tabuleiro, verificar a diagonal decide uma partida de jogo da velha. Em matemática e computação gráfica, a diagonal de uma matriz tem significado especial.',
    description:
      'Implemente diagonalPrincipal(matriz), que retorna um vetor com os elementos em que a linha é igual à coluna (m[0][0], m[1][1], …) de uma matriz quadrada.',
    goal: 'Perceber que um laço só basta quando linha e coluna andam juntas.',
    signature: { javascript: 'function diagonalPrincipal(matriz)', typescript: 'function diagonalPrincipal(matriz: number[][]): number[]' },
    body: `  const diagonal = [];
  for (let i = 0; i < matriz.length; i++) {
    diagonal.push(matriz[i][i]);
  }
  return diagonal;`,
    tsBody: `  const diagonal: number[] = [];
  for (let i = 0; i < matriz.length; i++) {
    diagonal.push(matriz[i][i]);
  }
  return diagonal;`,
    hints: [
      'Na diagonal principal, linha === coluna. Você não precisa de dois laços: um índice i serve para os dois.',
      'O elemento da diagonal na linha i é matriz[i][i].',
    ],
    testCases: [
      { description: '3 × 3', input: 'diagonalPrincipal([[1, 2, 3], [4, 5, 6], [7, 8, 9]])', expectedOutput: '[1, 5, 9]', testFunction: 'return JSON.stringify(diagonalPrincipal([[1, 2, 3], [4, 5, 6], [7, 8, 9]])) === "[1,5,9]";' },
      { description: '2 × 2', input: 'diagonalPrincipal([[7, 0], [0, 3]])', expectedOutput: '[7, 3]', testFunction: 'return JSON.stringify(diagonalPrincipal([[7, 0], [0, 3]])) === "[7,3]";' },
      { description: '1 × 1', input: 'diagonalPrincipal([[42]])', expectedOutput: '[42]', testFunction: 'return JSON.stringify(diagonalPrincipal([[42]])) === "[42]";' },
    ],
    explanation:
      'Percorrer a matriz inteira com dois laços e um if (linha === coluna) também funciona, mas faz n² visitas para usar só n delas. Enxergar o padrão dos índices permite resolver com um laço. A diagonal secundária segue a mesma ideia: matriz[i][n - 1 - i].',
  }),

  // Índice nº 79 — Soma de cada linha e coluna
  logica({
    id: 'logica-079-soma-de-cada-linha-e-coluna',
    difficulty: 'avancado',
    topic,
    title: 'Soma de Cada Linha e Coluna',
    summary: 'Calcule o total de cada linha e de cada coluna de uma matriz.',
    realWorldContext:
      'Uma planilha de despesas por categoria (linhas) e mês (colunas) mostra o total de cada categoria e o total de cada mês. São dois acumuladores em duas dimensões, calculados ao mesmo tempo.',
    description:
      'Implemente totaisLinhasEColunas(matriz), para uma matriz retangular com pelo menos uma linha. Retorne { linhas, colunas }: linhas[i] é a soma da linha i e colunas[j] é a soma da coluna j.',
    goal: 'Acumular em dois vetores ao mesmo tempo, usando os dois índices.',
    signature: {
      javascript: 'function totaisLinhasEColunas(matriz)',
      typescript: 'function totaisLinhasEColunas(matriz: number[][]): { linhas: number[]; colunas: number[] }',
    },
    body: `  const linhas = [];
  const colunas = [];
  for (let j = 0; j < matriz[0].length; j++) {
    colunas.push(0);
  }
  for (let i = 0; i < matriz.length; i++) {
    let somaDaLinha = 0;
    for (let j = 0; j < matriz[i].length; j++) {
      somaDaLinha += matriz[i][j];
      colunas[j] += matriz[i][j];
    }
    linhas.push(somaDaLinha);
  }
  return { linhas, colunas };`,
    tsBody: `  const linhas: number[] = [];
  const colunas: number[] = [];
  for (let j = 0; j < matriz[0].length; j++) {
    colunas.push(0);
  }
  for (let i = 0; i < matriz.length; i++) {
    let somaDaLinha = 0;
    for (let j = 0; j < matriz[i].length; j++) {
      somaDaLinha += matriz[i][j];
      colunas[j] += matriz[i][j];
    }
    linhas.push(somaDaLinha);
  }
  return { linhas, colunas };`,
    hints: [
      'A soma de cada linha é um acumulador que zera a cada linha nova (declarado dentro do laço de fora).',
      'As colunas precisam de um acumulador por coluna: crie um vetor com zeros (um por coluna) antes dos laços e, em cada célula, some em colunas[j].',
    ],
    testCases: [
      { description: '2 × 3', input: 'totaisLinhasEColunas([[1, 2, 3], [4, 5, 6]])', expectedOutput: '{ linhas: [6, 15], colunas: [5, 7, 9] }', testFunction: 'const t = totaisLinhasEColunas([[1, 2, 3], [4, 5, 6]]); return JSON.stringify(t.linhas) === "[6,15]" && JSON.stringify(t.colunas) === "[5,7,9]";' },
      { description: '3 × 2', input: 'totaisLinhasEColunas([[1, 1], [2, 2], [3, 3]])', expectedOutput: '{ linhas: [2, 4, 6], colunas: [6, 6] }', testFunction: 'const t = totaisLinhasEColunas([[1, 1], [2, 2], [3, 3]]); return JSON.stringify(t.linhas) === "[2,4,6]" && JSON.stringify(t.colunas) === "[6,6]";' },
      { description: 'Uma linha', input: 'totaisLinhasEColunas([[5, -5, 10]])', expectedOutput: '{ linhas: [10], colunas: [5, -5, 10] }', testFunction: 'const t = totaisLinhasEColunas([[5, -5, 10]]); return JSON.stringify(t.linhas) === "[10]" && JSON.stringify(t.colunas) === "[5,-5,10]";' },
    ],
    explanation:
      'Onde o acumulador é declarado define o que ele soma: somaDaLinha nasce dentro do laço de fora (zera a cada linha); o vetor colunas nasce antes de tudo (acumula através das linhas). Uma única varredura da matriz preenche os dois. Sem inicializar colunas com zeros, colunas[j] += ... daria NaN (undefined + número).',
  }),

  // Índice nº 80 — Maior elemento da matriz
  logica({
    id: 'logica-080-maior-elemento-da-matriz',
    difficulty: 'intermediario',
    topic,
    title: 'Maior Elemento da Matriz',
    summary: 'Encontre o maior valor de uma matriz e em que linha e coluna ele está.',
    realWorldContext:
      'O ponto mais quente num mapa de calor, o pixel mais claro de uma imagem, a célula de maior valor numa planilha: achar o máximo em duas dimensões é a mesma busca do vetor, com dois índices.',
    description:
      'Implemente maiorDaMatriz(matriz), para uma matriz com pelo menos um elemento. Retorne { valor, linha, coluna } do maior elemento; em caso de empate, o primeiro encontrado percorrendo linha por linha.',
    goal: 'Aplicar o padrão do "campeão" com laços aninhados, guardando os dois índices.',
    signature: {
      javascript: 'function maiorDaMatriz(matriz)',
      typescript: 'function maiorDaMatriz(matriz: number[][]): { valor: number; linha: number; coluna: number }',
    },
    body: `  let maior = { valor: matriz[0][0], linha: 0, coluna: 0 };
  for (let i = 0; i < matriz.length; i++) {
    for (let j = 0; j < matriz[i].length; j++) {
      if (matriz[i][j] > maior.valor) {
        maior = { valor: matriz[i][j], linha: i, coluna: j };
      }
    }
  }
  return maior;`,
    hints: [
      'Comece com o elemento [0][0] como campeão, guardando valor, linha e coluna.',
      'Percorra todas as células com dois laços e substitua o campeão quando achar um valor estritamente maior (> mantém o primeiro em caso de empate).',
    ],
    testCases: [
      { description: 'Matriz 3 × 3', input: 'maiorDaMatriz([[3, 8, 1], [9, 2, 4], [5, 7, 6]])', expectedOutput: '{ valor: 9, linha: 1, coluna: 0 }', testFunction: 'const m = maiorDaMatriz([[3, 8, 1], [9, 2, 4], [5, 7, 6]]); return m.valor === 9 && m.linha === 1 && m.coluna === 0;' },
      { description: 'Todos negativos', input: 'maiorDaMatriz([[-5, -3], [-8, -4]])', expectedOutput: '{ valor: -3, linha: 0, coluna: 1 }', testFunction: 'const m = maiorDaMatriz([[-5, -3], [-8, -4]]); return m.valor === -3 && m.linha === 0 && m.coluna === 1;' },
      { description: 'Empate fica com o primeiro', input: 'maiorDaMatriz([[1, 7], [7, 2]])', expectedOutput: '{ valor: 7, linha: 0, coluna: 1 }', testFunction: 'const m = maiorDaMatriz([[1, 7], [7, 2]]); return m.valor === 7 && m.linha === 0 && m.coluna === 1;' },
      { description: 'Maior no canto final', input: 'maiorDaMatriz([[1, 2], [3, 99]])', expectedOutput: '{ valor: 99, linha: 1, coluna: 1 }', testFunction: 'const m = maiorDaMatriz([[1, 2], [3, 99]]); return m.valor === 99 && m.linha === 1 && m.coluna === 1;' },
    ],
    explanation:
      'É o exercício 67 em duas dimensões: o campeão agora carrega dois índices. Guardar tudo num objeto mantém valor e posição sempre consistentes — eles mudam juntos, numa única atribuição.',
  }),
];
