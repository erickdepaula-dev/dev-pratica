import { LogicExercise } from '../../types/exercise';
import { logica } from './logicFactory';

const topic = 'Estruturas de Repetição';

/**
 * Trilha de Lógica — Módulo 03: Estruturas de Repetição (índice: exercícios 36 a 60, completo).
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
  // Índice nº 41 — Tabuada de um número
  logica({
    id: 'logica-041-tabuada-de-um-numero',
    difficulty: 'basico',
    topic,
    title: 'Tabuada de um Número',
    summary: 'Monte as 10 linhas da tabuada de um número, no formato "7 x 3 = 21".',
    realWorldContext:
      'Gerar linhas de texto a partir de um modelo é o que fazem relatórios, extratos e e-mails automáticos: o mesmo formato repetido, mudando só os valores de cada linha.',
    description:
      'Implemente tabuada(n), que retorna um array com 10 textos, de "n x 1 = …" até "n x 10 = …". Ex.: tabuada(7)[2] é "7 x 3 = 21".',
    goal: 'Repetir de 1 a 10 montando um texto com os valores de cada volta.',
    signature: { javascript: 'function tabuada(n)', typescript: 'function tabuada(n: number): string[]' },
    body: `  const linhas = [];
  for (let i = 1; i <= 10; i++) {
    linhas.push(\`\${n} x \${i} = \${n * i}\`);
  }
  return linhas;`,
    tsBody: `  const linhas: string[] = [];
  for (let i = 1; i <= 10; i++) {
    linhas.push(\`\${n} x \${i} = \${n * i}\`);
  }
  return linhas;`,
    hints: [
      'O multiplicador vai de 1 a 10: é o i do laço. O resultado de cada linha é n * i.',
      'Template strings (entre crases) encaixam valores no texto: `${n} x ${i} = ${n * i}`.',
    ],
    testCases: [
      { description: '10 linhas', input: 'tabuada(7).length', expectedOutput: '10', testFunction: 'return tabuada(7).length === 10;' },
      { description: 'Primeira linha', input: 'tabuada(7)[0]', expectedOutput: '"7 x 1 = 7"', testFunction: "return tabuada(7)[0] === '7 x 1 = 7';" },
      { description: 'Terceira linha', input: 'tabuada(7)[2]', expectedOutput: '"7 x 3 = 21"', testFunction: "return tabuada(7)[2] === '7 x 3 = 21';" },
      { description: 'Última linha', input: 'tabuada(9)[9]', expectedOutput: '"9 x 10 = 90"', testFunction: "return tabuada(9)[9] === '9 x 10 = 90';" },
    ],
    explanation:
      'Dentro do laço, i muda a cada volta e n fica fixo: é essa combinação que gera as dez linhas diferentes. Template strings evitam concatenações longas como n + " x " + i + " = " + (n * i) — e os parênteses que elas exigiriam.',
  }),

  // Índice nº 42 — Tabuada com início e fim
  logica({
    id: 'logica-042-tabuada-com-inicio-e-fim',
    difficulty: 'basico',
    topic,
    title: 'Tabuada com Início e Fim',
    summary: 'Calcule os produtos de um número por um intervalo de multiplicadores.',
    realWorldContext:
      'Tabelas de preço por quantidade ("de 5 a 20 unidades") usam a mesma ideia: um valor fixo multiplicado por uma faixa escolhida pelo usuário.',
    description:
      'Implemente tabuadaIntervalo(n, inicio, fim), que retorna os resultados de n × inicio até n × fim (inclusive). Se inicio for maior que fim, retorne um array vazio.',
    goal: 'Usar os dois parâmetros como limites do laço.',
    signature: {
      javascript: 'function tabuadaIntervalo(n, inicio, fim)',
      typescript: 'function tabuadaIntervalo(n: number, inicio: number, fim: number): number[]',
    },
    body: `  const resultados = [];
  for (let i = inicio; i <= fim; i++) {
    resultados.push(n * i);
  }
  return resultados;`,
    tsBody: `  const resultados: number[] = [];
  for (let i = inicio; i <= fim; i++) {
    resultados.push(n * i);
  }
  return resultados;`,
    hints: [
      'O laço começa em inicio (não em 1) e vai até fim.',
      'Se inicio > fim, a condição do for já é falsa na primeira volta e o array sai vazio.',
    ],
    testCases: [
      { description: '3 × (4 a 6)', input: 'tabuadaIntervalo(3, 4, 6)', expectedOutput: '[12, 15, 18]', testFunction: 'return JSON.stringify(tabuadaIntervalo(3, 4, 6)) === "[12,15,18]";' },
      { description: 'Intervalo de um só', input: 'tabuadaIntervalo(5, 2, 2)', expectedOutput: '[10]', testFunction: 'return JSON.stringify(tabuadaIntervalo(5, 2, 2)) === "[10]";' },
      { description: 'Início maior que o fim', input: 'tabuadaIntervalo(5, 8, 3)', expectedOutput: '[]', testFunction: 'return JSON.stringify(tabuadaIntervalo(5, 8, 3)) === "[]";' },
    ],
    explanation:
      'Laços não precisam começar em 0 ou 1: o início, o fim e o passo podem vir de parâmetros. Pensar no caso "intervalo vazio" (inicio > fim) antes de rodar evita surpresas — aqui, o próprio for já o trata.',
  }),

  // Índice nº 43 — Somatório de 1 até N
  logica({
    id: 'logica-043-somatorio-de-1-ate-n',
    difficulty: 'basico',
    topic,
    title: 'Somatório de 1 até N',
    summary: 'Some todos os números de 1 até N usando um acumulador.',
    realWorldContext:
      'Totalizar é a tarefa mais comum de um laço: somar as vendas do dia, os minutos de ligação do mês, os pontos de uma partida. O padrão sempre é o mesmo — começar em zero e ir acumulando.',
    description:
      'Implemente somatorio(n), que retorna 1 + 2 + … + n. Para n menor que 1, retorne 0.',
    goal: 'Usar uma variável acumuladora dentro de um laço.',
    signature: { javascript: 'function somatorio(n)', typescript: 'function somatorio(n: number): number' },
    body: `  let soma = 0;
  for (let i = 1; i <= n; i++) {
    soma += i;
  }
  return soma;`,
    hints: [
      'Crie let soma = 0 antes do laço. Dentro dele, some o i da volta: soma += i.',
      'O acumulador começa em 0 porque somar zero não altera nada — e assim n < 1 já devolve 0.',
    ],
    testCases: [
      { description: 'Até 5', input: 'somatorio(5)', expectedOutput: '15', testFunction: 'return somatorio(5) === 15;' },
      { description: 'Até 100', input: 'somatorio(100)', expectedOutput: '5050', testFunction: 'return somatorio(100) === 5050;' },
      { description: 'Até 1', input: 'somatorio(1)', expectedOutput: '1', testFunction: 'return somatorio(1) === 1;' },
      { description: 'N = 0', input: 'somatorio(0)', expectedOutput: '0', testFunction: 'return somatorio(0) === 0;' },
    ],
    explanation:
      'O acumulador é declarado fora do laço (senão seria zerado a cada volta) e atualizado dentro dele. Curiosidade: existe a fórmula n * (n + 1) / 2, que dá o mesmo resultado sem laço — atribuída a Gauss, que teria somado de 1 a 100 de cabeça quando criança.',
  }),

  // Índice nº 44 — Fatorial
  logica({
    id: 'logica-044-fatorial',
    difficulty: 'intermediario',
    topic,
    title: 'Fatorial',
    summary: 'Calcule o fatorial de um número inteiro não negativo.',
    realWorldContext:
      'O fatorial conta de quantas formas dá para ordenar coisas: 5 pessoas numa fila podem ficar em 120 ordens diferentes. Ele aparece em probabilidade, estatística e em análise de algoritmos.',
    description:
      'Implemente fatorial(n), que retorna n! = 1 × 2 × … × n. Por definição, 0! = 1.',
    goal: 'Acumular um produto num laço (o acumulador começa em 1).',
    signature: { javascript: 'function fatorial(n)', typescript: 'function fatorial(n: number): number' },
    body: `  let resultado = 1;
  for (let i = 2; i <= n; i++) {
    resultado *= i;
  }
  return resultado;`,
    hints: [
      'É como o somatório, mas multiplicando: resultado *= i.',
      'Um acumulador de produto começa em 1 (começar em 0 zeraria tudo). Com ele em 1, 0! e 1! já saem certos sem nenhum if.',
    ],
    testCases: [
      { description: '5!', input: 'fatorial(5)', expectedOutput: '120', testFunction: 'return fatorial(5) === 120;' },
      { description: '0!', input: 'fatorial(0)', expectedOutput: '1', testFunction: 'return fatorial(0) === 1;' },
      { description: '1!', input: 'fatorial(1)', expectedOutput: '1', testFunction: 'return fatorial(1) === 1;' },
      { description: '10!', input: 'fatorial(10)', expectedOutput: '3628800', testFunction: 'return fatorial(10) === 3628800;' },
    ],
    explanation:
      'O valor inicial do acumulador é o "elemento neutro" da operação: 0 para soma, 1 para multiplicação. O fatorial cresce muito rápido — 20! já passa de 2 quintilhões; acima de 170!, number vira Infinity, e para valores exatos maiores usa-se BigInt.',
  }),

  // Índice nº 45 — Sequência de Fibonacci
  logica({
    id: 'logica-045-sequencia-de-fibonacci',
    difficulty: 'intermediario',
    topic,
    title: 'Sequência de Fibonacci',
    summary: 'Gere os N primeiros termos da sequência de Fibonacci.',
    realWorldContext:
      'Fibonacci aparece na natureza (espirais de girassóis), em estimativas ágeis (pontos 1, 2, 3, 5, 8) e é o exemplo clássico de "cada valor depende dos anteriores" — o que exige guardar estado entre as voltas.',
    description:
      'Implemente fibonacci(n), que retorna um array com os n primeiros termos: 0, 1, 1, 2, 3, 5, 8, … Cada termo, a partir do terceiro, é a soma dos dois anteriores. Para n = 0, retorne [].',
    goal: 'Manter os dois últimos termos em variáveis e atualizá-los a cada volta.',
    signature: { javascript: 'function fibonacci(n)', typescript: 'function fibonacci(n: number): number[]' },
    body: `  const termos = [];
  let anterior = 0;
  let atual = 1;
  for (let i = 0; i < n; i++) {
    termos.push(anterior);
    const proximo = anterior + atual;
    anterior = atual;
    atual = proximo;
  }
  return termos;`,
    tsBody: `  const termos: number[] = [];
  let anterior = 0;
  let atual = 1;
  for (let i = 0; i < n; i++) {
    termos.push(anterior);
    const proximo = anterior + atual;
    anterior = atual;
    atual = proximo;
  }
  return termos;`,
    hints: [
      'Guarde os dois últimos termos em duas variáveis (comece com 0 e 1). A cada volta, registre um e avance os dois.',
      'Para avançar sem perder valor, calcule o próximo numa variável temporária antes de sobrescrever — é a troca de valores do exercício 14.',
    ],
    testCases: [
      { description: '8 termos', input: 'fibonacci(8)', expectedOutput: '[0, 1, 1, 2, 3, 5, 8, 13]', testFunction: 'return JSON.stringify(fibonacci(8)) === "[0,1,1,2,3,5,8,13]";' },
      { description: '1 termo', input: 'fibonacci(1)', expectedOutput: '[0]', testFunction: 'return JSON.stringify(fibonacci(1)) === "[0]";' },
      { description: '2 termos', input: 'fibonacci(2)', expectedOutput: '[0, 1]', testFunction: 'return JSON.stringify(fibonacci(2)) === "[0,1]";' },
      { description: '0 termos', input: 'fibonacci(0)', expectedOutput: '[]', testFunction: 'return JSON.stringify(fibonacci(0)) === "[]";' },
    ],
    explanation:
      'O laço guarda "estado" entre voltas: as variáveis anterior e atual carregam o que importa da volta anterior. A variável temporária proximo evita o erro de atualizar uma antes de usá-la para calcular a outra.',
  }),

  // Índice nº 46 — Soma de cinco valores
  logica({
    id: 'logica-046-soma-de-cinco-valores',
    difficulty: 'basico',
    topic,
    title: 'Soma de Cinco Valores',
    summary: 'Percorra uma lista de valores e devolva a soma.',
    realWorldContext:
      'Em vez de ler cinco valores do teclado, programas reais recebem listas: as cinco notas de um aluno, os itens de um pedido. Percorrer a lista com um laço funciona para 5 itens ou para 5 milhões.',
    description:
      'Implemente somarValores(valores), que recebe um array de números (por exemplo, cinco valores informados) e retorna a soma de todos. Use um laço — não use reduce.',
    goal: 'Percorrer um array com for...of acumulando a soma.',
    signature: { javascript: 'function somarValores(valores)', typescript: 'function somarValores(valores: number[]): number' },
    body: `  let soma = 0;
  for (const valor of valores) {
    soma += valor;
  }
  return soma;`,
    hints: [
      'for (const valor of valores) { ... } visita cada elemento do array, um por volta.',
      'Use um acumulador começando em 0, como no somatório. Uma lista vazia deve dar 0.',
    ],
    testCases: [
      { description: 'Cinco valores', input: 'somarValores([3, 7, 1, 9, 5])', expectedOutput: '25', testFunction: 'return somarValores([3, 7, 1, 9, 5]) === 25;' },
      { description: 'Com negativos', input: 'somarValores([10, -4, 2, -8, 0])', expectedOutput: '0', testFunction: 'return somarValores([10, -4, 2, -8, 0]) === 0;' },
      { description: 'Lista vazia', input: 'somarValores([])', expectedOutput: '0', testFunction: 'return somarValores([]) === 0;' },
    ],
    explanation:
      'O for...of percorre os elementos sem você precisar controlar o índice. Escrever a função para "uma lista de qualquer tamanho", e não para exatamente cinco variáveis, é o que torna o algoritmo reaproveitável.',
  }),

  // Índice nº 47 — Média de dez notas
  logica({
    id: 'logica-047-media-de-dez-notas',
    difficulty: 'basico',
    topic,
    title: 'Média de Dez Notas',
    summary: 'Calcule a média de uma lista de notas, tratando a lista vazia.',
    realWorldContext:
      'A média da turma no sistema escolar soma todas as notas e divide pela quantidade. Se a turma ainda não tem notas lançadas, dividir por zero mostraria "NaN" no boletim — um clássico de tela quebrada.',
    description:
      'Implemente mediaDasNotas(notas), que retorna a média aritmética das notas do array (por exemplo, dez notas). Se o array estiver vazio, retorne 0.',
    goal: 'Somar com um laço e dividir pela quantidade, protegendo a divisão por zero.',
    signature: { javascript: 'function mediaDasNotas(notas)', typescript: 'function mediaDasNotas(notas: number[]): number' },
    body: `  if (notas.length === 0) {
    return 0;
  }
  let soma = 0;
  for (const nota of notas) {
    soma += nota;
  }
  return soma / notas.length;`,
    hints: [
      'A quantidade de notas é notas.length. Some todas e divida pela quantidade.',
      'Com o array vazio, soma / notas.length é 0 / 0, que dá NaN. Trate esse caso antes.',
    ],
    testCases: [
      { description: 'Dez notas', input: 'mediaDasNotas([7, 8, 6, 9, 10, 5, 7, 8, 6, 4])', expectedOutput: '7', testFunction: 'return mediaDasNotas([7, 8, 6, 9, 10, 5, 7, 8, 6, 4]) === 7;' },
      { description: 'Média decimal', input: 'mediaDasNotas([7, 8])', expectedOutput: '7.5', testFunction: 'return mediaDasNotas([7, 8]) === 7.5;' },
      { description: 'Sem notas', input: 'mediaDasNotas([])', expectedOutput: '0', testFunction: 'return mediaDasNotas([]) === 0;' },
    ],
    explanation:
      'Em JS/TS, 0 / 0 não gera erro: devolve NaN ("not a number"), que se espalha por todas as contas seguintes. Proteger a divisão no começo da função (uma "cláusula de guarda") é mais claro do que tentar consertar o NaN depois.',
  }),

  // Índice nº 48 — Positivos, negativos e zeros
  logica({
    id: 'logica-048-positivos-negativos-e-zeros',
    difficulty: 'basico',
    topic,
    title: 'Positivos, Negativos e Zeros',
    summary: 'Conte quantos valores de uma lista são positivos, negativos e zeros.',
    realWorldContext:
      'Um relatório financeiro conta quantos dias fecharam com lucro, com prejuízo e no zero a zero. São três contadores atualizados numa única passada pelos dados.',
    description:
      'Implemente contarSinais(valores), que retorna { positivos, negativos, zeros } com a quantidade de cada tipo no array.',
    goal: 'Manter vários contadores e decidir qual incrementar com if / else if / else.',
    signature: {
      javascript: 'function contarSinais(valores)',
      typescript: 'function contarSinais(valores: number[]): { positivos: number; negativos: number; zeros: number }',
    },
    body: `  let positivos = 0;
  let negativos = 0;
  let zeros = 0;
  for (const valor of valores) {
    if (valor > 0) {
      positivos++;
    } else if (valor < 0) {
      negativos++;
    } else {
      zeros++;
    }
  }
  return { positivos, negativos, zeros };`,
    hints: [
      'Crie três contadores começando em 0, antes do laço.',
      'Dentro do laço, use a classificação do exercício 16 para escolher qual contador aumentar (contador++).',
    ],
    testCases: [
      { description: 'Lista mista', input: 'contarSinais([3, -1, 0, 7, -5, 0, 2])', expectedOutput: '{ positivos: 3, negativos: 2, zeros: 2 }', testFunction: 'const c = contarSinais([3, -1, 0, 7, -5, 0, 2]); return c.positivos === 3 && c.negativos === 2 && c.zeros === 2;' },
      { description: 'Só positivos', input: 'contarSinais([1, 2, 3])', expectedOutput: '{ positivos: 3, negativos: 0, zeros: 0 }', testFunction: 'const c = contarSinais([1, 2, 3]); return c.positivos === 3 && c.negativos === 0 && c.zeros === 0;' },
      { description: 'Lista vazia', input: 'contarSinais([])', expectedOutput: '{ positivos: 0, negativos: 0, zeros: 0 }', testFunction: 'const c = contarSinais([]); return c.positivos === 0 && c.negativos === 0 && c.zeros === 0;' },
    ],
    explanation:
      'Contar é acumular de 1 em 1: contador++. Com vários contadores, um if / else if / else garante que cada valor entra em exatamente uma categoria. Uma única passada pela lista resolve as três contagens.',
  }),

  // Índice nº 49 — Pares e ímpares
  logica({
    id: 'logica-049-pares-e-impares',
    difficulty: 'basico',
    topic,
    title: 'Pares e Ímpares',
    summary: 'Conte quantos números de uma lista são pares e quantos são ímpares.',
    realWorldContext:
      'Sorteios, rodízios de placa e distribuição de tarefas por número de matrícula dividem as pessoas por paridade. Contar quantos caem em cada grupo ajuda a ver se a divisão ficou equilibrada.',
    description:
      'Implemente contarParesEImpares(valores), que retorna { pares, impares } com a quantidade de números pares e ímpares do array. Considere também números negativos.',
    goal: 'Combinar o teste de paridade com dois contadores.',
    signature: {
      javascript: 'function contarParesEImpares(valores)',
      typescript: 'function contarParesEImpares(valores: number[]): { pares: number; impares: number }',
    },
    body: `  let pares = 0;
  let impares = 0;
  for (const valor of valores) {
    if (valor % 2 === 0) {
      pares++;
    } else {
      impares++;
    }
  }
  return { pares, impares };`,
    hints: [
      'Use valor % 2 === 0 para identificar os pares. Todo o resto é ímpar.',
      'Lembre do exercício 17: -3 % 2 é -1. Por isso, teste o par, não "=== 1".',
    ],
    testCases: [
      { description: 'Lista mista', input: 'contarParesEImpares([1, 2, 3, 4, 5])', expectedOutput: '{ pares: 2, impares: 3 }', testFunction: 'const c = contarParesEImpares([1, 2, 3, 4, 5]); return c.pares === 2 && c.impares === 3;' },
      { description: 'Com negativos e zero', input: 'contarParesEImpares([-3, -2, 0, 7])', expectedOutput: '{ pares: 2, impares: 2 }', testFunction: 'const c = contarParesEImpares([-3, -2, 0, 7]); return c.pares === 2 && c.impares === 2;' },
      { description: 'Lista vazia', input: 'contarParesEImpares([])', expectedOutput: '{ pares: 0, impares: 0 }', testFunction: 'const c = contarParesEImpares([]); return c.pares === 0 && c.impares === 0;' },
    ],
    explanation:
      'Juntar um laço com uma condição é o padrão "contar quem satisfaz X". Com só duas categorias, um if / else basta — e a soma pares + impares sempre bate com valores.length, um bom jeito de conferir o resultado.',
  }),

  // Índice nº 50 — Maior valor informado
  logica({
    id: 'logica-050-maior-valor-informado',
    difficulty: 'intermediario',
    topic,
    title: 'Maior Valor Informado',
    summary: 'Encontre o maior valor de uma lista, sem usar Math.max.',
    realWorldContext:
      'O recorde do dia, o maior pedido do mês, o pico de acessos: achar o máximo é uma das buscas mais comuns. E o bug clássico aparece quando todos os valores são negativos.',
    description:
      'Implemente maiorValor(valores), que retorna o maior número de um array com pelo menos um elemento. Resolva com um laço, sem Math.max.',
    goal: 'Inicializar o "campeão" com o primeiro elemento e comparar com os demais.',
    signature: { javascript: 'function maiorValor(valores)', typescript: 'function maiorValor(valores: number[]): number' },
    body: `  let maior = valores[0];
  for (const valor of valores) {
    if (valor > maior) {
      maior = valor;
    }
  }
  return maior;`,
    hints: [
      'Comece supondo que o primeiro elemento (valores[0]) é o maior. Depois percorra e troque sempre que achar alguém maior.',
      'Não comece com maior = 0: se todos os valores forem negativos, a resposta sairia 0, que nem está na lista.',
    ],
    testCases: [
      { description: 'Lista comum', input: 'maiorValor([4, 17, 9, 2])', expectedOutput: '17', testFunction: 'return maiorValor([4, 17, 9, 2]) === 17;' },
      { description: 'Maior no fim', input: 'maiorValor([1, 2, 3, 99])', expectedOutput: '99', testFunction: 'return maiorValor([1, 2, 3, 99]) === 99;' },
      { description: 'Todos negativos', input: 'maiorValor([-8, -3, -12])', expectedOutput: '-3', testFunction: 'return maiorValor([-8, -3, -12]) === -3;' },
      { description: 'Um elemento', input: 'maiorValor([42])', expectedOutput: '42', testFunction: 'return maiorValor([42]) === 42;' },
    ],
    explanation:
      'Inicializar com um elemento real da lista é o que torna o algoritmo correto para qualquer entrada. Começar com 0 (ou qualquer "número mágico") funciona nos testes fáceis e falha justamente no caso que ninguém testou — aqui, todos negativos.',
  }),

  // Índice nº 51 — Maior e menor valor
  logica({
    id: 'logica-051-maior-e-menor-valor',
    difficulty: 'intermediario',
    topic,
    title: 'Maior e Menor Valor',
    summary: 'Encontre o maior e o menor valor de uma lista numa única passada.',
    realWorldContext:
      'Gráficos de cotação mostram a máxima e a mínima do dia; apps de clima, a maior e a menor temperatura. Os dois extremos saem do mesmo laço.',
    description:
      'Implemente extremos(valores), que retorna { maior, menor } de um array com pelo menos um elemento, percorrendo a lista uma única vez.',
    goal: 'Atualizar dois "campeões" no mesmo laço.',
    signature: {
      javascript: 'function extremos(valores)',
      typescript: 'function extremos(valores: number[]): { maior: number; menor: number }',
    },
    body: `  let maior = valores[0];
  let menor = valores[0];
  for (const valor of valores) {
    if (valor > maior) maior = valor;
    if (valor < menor) menor = valor;
  }
  return { maior, menor };`,
    hints: [
      'Os dois começam com valores[0]. No laço, compare cada valor com o maior e, separadamente, com o menor.',
      'Não comece o menor com 0 (nem o maior): com uma lista só de positivos, o menor sairia 0, que nem está na lista. Os dois começam com um elemento real.',
    ],
    testCases: [
      { description: 'Lista comum', input: 'extremos([5, 1, 9, 3])', expectedOutput: '{ maior: 9, menor: 1 }', testFunction: 'const e = extremos([5, 1, 9, 3]); return e.maior === 9 && e.menor === 1;' },
      { description: 'Ordem decrescente', input: 'extremos([10, 8, 6, 4])', expectedOutput: '{ maior: 10, menor: 4 }', testFunction: 'const e = extremos([10, 8, 6, 4]); return e.maior === 10 && e.menor === 4;' },
      { description: 'Todos negativos', input: 'extremos([-2, -9, -4])', expectedOutput: '{ maior: -2, menor: -9 }', testFunction: 'const e = extremos([-2, -9, -4]); return e.maior === -2 && e.menor === -9;' },
      { description: 'Um elemento', input: 'extremos([7])', expectedOutput: '{ maior: 7, menor: 7 }', testFunction: 'const e = extremos([7]); return e.maior === 7 && e.menor === 7;' },
    ],
    explanation:
      'É o exercício 19 generalizado para uma lista de qualquer tamanho. Como os dois extremos começam no mesmo elemento real, um valor nunca é ao mesmo tempo maior que o maior e menor que o menor — por isso tanto dois if quanto if / else if funcionam. O que quebra o algoritmo é inicializar com 0: falha com listas só de positivos (menor) ou só de negativos (maior).',
  }),

  // Índice nº 52 — Pesquisa de idades
  logica({
    id: 'logica-052-pesquisa-de-idades',
    difficulty: 'intermediario',
    topic,
    title: 'Pesquisa de Idades',
    summary: 'Resuma uma pesquisa: média de idade e quantos são maiores e menores de idade.',
    realWorldContext:
      'Formulários de pesquisa viram painéis com indicadores: média, contagens por faixa. Um único laço pode calcular vários indicadores ao mesmo tempo.',
    description:
      'Implemente pesquisaIdades(idades), que retorna { media, maiores, menores }: a média das idades, quantas pessoas têm 18 anos ou mais e quantas têm menos de 18. Com a lista vazia, todos os valores são 0.',
    goal: 'Calcular soma e contagens no mesmo laço.',
    signature: {
      javascript: 'function pesquisaIdades(idades)',
      typescript: 'function pesquisaIdades(idades: number[]): { media: number; maiores: number; menores: number }',
    },
    body: `  let soma = 0;
  let maiores = 0;
  let menores = 0;
  for (const idade of idades) {
    soma += idade;
    if (idade >= 18) {
      maiores++;
    } else {
      menores++;
    }
  }
  const media = idades.length > 0 ? soma / idades.length : 0;
  return { media, maiores, menores };`,
    hints: [
      'No mesmo laço: some a idade (para a média) e incremente o contador da faixa certa.',
      'A média é calculada depois do laço. Proteja a divisão quando a lista estiver vazia.',
    ],
    testCases: [
      { description: 'Turma mista', input: 'pesquisaIdades([15, 22, 17, 30])', expectedOutput: '{ media: 21, maiores: 2, menores: 2 }', testFunction: 'const p = pesquisaIdades([15, 22, 17, 30]); return p.media === 21 && p.maiores === 2 && p.menores === 2;' },
      { description: '18 é maior de idade', input: 'pesquisaIdades([18, 18])', expectedOutput: '{ media: 18, maiores: 2, menores: 0 }', testFunction: 'const p = pesquisaIdades([18, 18]); return p.media === 18 && p.maiores === 2 && p.menores === 0;' },
      { description: 'Lista vazia', input: 'pesquisaIdades([])', expectedOutput: '{ media: 0, maiores: 0, menores: 0 }', testFunction: 'const p = pesquisaIdades([]); return p.media === 0 && p.maiores === 0 && p.menores === 0;' },
    ],
    explanation:
      'Uma passada, vários indicadores: soma e contadores são atualizados juntos, e o que depende do total (a média) fica para depois do laço. Isso é mais eficiente do que percorrer a lista uma vez para cada indicador.',
  }),

  // Índice nº 53 — Pesquisa de alturas
  logica({
    id: 'logica-053-pesquisa-de-alturas',
    difficulty: 'intermediario',
    topic,
    title: 'Pesquisa de Alturas',
    summary: 'Calcule a altura média e quantas pessoas estão acima dela.',
    realWorldContext:
      'Algumas perguntas exigem duas passadas pelos dados: para saber quem está "acima da média", primeiro é preciso conhecer a média. Relatórios de desempenho fazem isso o tempo todo.',
    description:
      'Implemente pesquisaAlturas(alturas), que retorna { media, acimaDaMedia }: a altura média e quantas pessoas são mais altas que a média. Com a lista vazia, retorne { media: 0, acimaDaMedia: 0 }.',
    goal: 'Usar dois laços: um para a média e outro para contar quem passa dela.',
    signature: {
      javascript: 'function pesquisaAlturas(alturas)',
      typescript: 'function pesquisaAlturas(alturas: number[]): { media: number; acimaDaMedia: number }',
    },
    body: `  if (alturas.length === 0) {
    return { media: 0, acimaDaMedia: 0 };
  }
  let soma = 0;
  for (const altura of alturas) {
    soma += altura;
  }
  const media = soma / alturas.length;
  let acimaDaMedia = 0;
  for (const altura of alturas) {
    if (altura > media) {
      acimaDaMedia++;
    }
  }
  return { media, acimaDaMedia };`,
    hints: [
      'Você não sabe quem está acima da média antes de terminar de somar. Faça um laço para a média e outro para a contagem.',
      '"Acima da média" é estritamente maior (>). Trate a lista vazia antes de dividir.',
    ],
    testCases: [
      { description: 'Quatro pessoas', input: 'pesquisaAlturas([1.6, 1.7, 1.8, 1.9])', expectedOutput: '{ media: 1.75, acimaDaMedia: 2 }', testFunction: 'const p = pesquisaAlturas([1.6, 1.7, 1.8, 1.9]); return Math.abs(p.media - 1.75) < 1e-9 && p.acimaDaMedia === 2;' },
      { description: 'Todos iguais', input: 'pesquisaAlturas([1.7, 1.7, 1.7])', expectedOutput: '{ media: 1.7, acimaDaMedia: 0 }', testFunction: 'const p = pesquisaAlturas([1.7, 1.7, 1.7]); return Math.abs(p.media - 1.7) < 1e-9 && p.acimaDaMedia === 0;' },
      { description: 'Um muito alto', input: 'pesquisaAlturas([1.5, 1.5, 1.5, 2.1])', expectedOutput: '{ media: 1.65, acimaDaMedia: 1 }', testFunction: 'const p = pesquisaAlturas([1.5, 1.5, 1.5, 2.1]); return Math.abs(p.media - 1.65) < 1e-9 && p.acimaDaMedia === 1;' },
      { description: 'Lista vazia', input: 'pesquisaAlturas([])', expectedOutput: '{ media: 0, acimaDaMedia: 0 }', testFunction: 'const p = pesquisaAlturas([]); return p.media === 0 && p.acimaDaMedia === 0;' },
    ],
    explanation:
      'Quando um cálculo depende de um resultado sobre a lista inteira, uma passada só não basta: a primeira produz o dado (a média), a segunda o usa. O caso "todos iguais" mostra a diferença entre > e >= — ninguém está acima da média, todos estão nela.',
  }),

  // Índice nº 54 — Soma dos múltiplos de 3
  logica({
    id: 'logica-054-soma-dos-multiplos-de-3',
    difficulty: 'basico',
    topic,
    title: 'Soma dos Múltiplos de 3',
    summary: 'Some os múltiplos de 3 de 1 até um limite.',
    realWorldContext:
      'Filtrar e acumular ao mesmo tempo é o "total de vendas só do cartão" ou "horas só dos fins de semana". O filtro aqui é ser múltiplo de 3.',
    description:
      'Implemente somaMultiplosDe3(limite), que retorna a soma de todos os múltiplos de 3 entre 1 e limite (inclusive).',
    goal: 'Combinar filtro (%) e acumulador no mesmo laço.',
    signature: { javascript: 'function somaMultiplosDe3(limite)', typescript: 'function somaMultiplosDe3(limite: number): number' },
    body: `  let soma = 0;
  for (let i = 3; i <= limite; i += 3) {
    soma += i;
  }
  return soma;`,
    hints: [
      'Um número é múltiplo de 3 quando i % 3 === 0. Some só esses.',
      'Alternativa: comece em 3 e ande de 3 em 3 — todo número visitado já é múltiplo.',
    ],
    testCases: [
      { description: 'Até 10', input: 'somaMultiplosDe3(10)', expectedOutput: '18', testFunction: 'return somaMultiplosDe3(10) === 18;' },
      { description: 'Até 9 (inclusive)', input: 'somaMultiplosDe3(9)', expectedOutput: '18', testFunction: 'return somaMultiplosDe3(9) === 18;' },
      { description: 'Até 2', input: 'somaMultiplosDe3(2)', expectedOutput: '0', testFunction: 'return somaMultiplosDe3(2) === 0;' },
      { description: 'Até 100', input: 'somaMultiplosDe3(100)', expectedOutput: '1683', testFunction: 'return somaMultiplosDe3(100) === 1683;' },
    ],
    explanation:
      '3 + 6 + 9 = 18. Percorrer de 3 em 3 faz um terço das voltas de testar número por número — a mesma ideia do exercício 40. Para filtros que não seguem um passo fixo, o if dentro do laço continua sendo a ferramenta.',
  }),

  // Índice nº 55 — Progressão aritmética
  logica({
    id: 'logica-055-progressao-aritmetica',
    difficulty: 'basico',
    topic,
    title: 'Progressão Aritmética',
    summary: 'Gere os termos de uma PA a partir do primeiro termo e da razão.',
    realWorldContext:
      'Parcelas com aumento fixo, numeração de senhas de 5 em 5, horários de ônibus a cada 15 minutos: tudo isso é uma progressão aritmética — começa num valor e soma sempre a mesma razão.',
    description:
      'Implemente progressaoAritmetica(primeiro, razao, quantidade), que retorna um array com os quantidade primeiros termos da PA.',
    goal: 'Gerar cada termo somando a razão ao anterior.',
    signature: {
      javascript: 'function progressaoAritmetica(primeiro, razao, quantidade)',
      typescript: 'function progressaoAritmetica(primeiro: number, razao: number, quantidade: number): number[]',
    },
    body: `  const termos = [];
  let termo = primeiro;
  for (let i = 0; i < quantidade; i++) {
    termos.push(termo);
    termo += razao;
  }
  return termos;`,
    tsBody: `  const termos: number[] = [];
  let termo = primeiro;
  for (let i = 0; i < quantidade; i++) {
    termos.push(termo);
    termo += razao;
  }
  return termos;`,
    hints: [
      'O laço controla quantos termos gerar (quantidade voltas); uma variável separada guarda o termo atual.',
      'A cada volta, registre o termo e some a razão. Ou use a fórmula: termo i = primeiro + i * razao.',
    ],
    testCases: [
      { description: 'PA de razão 3', input: 'progressaoAritmetica(2, 3, 5)', expectedOutput: '[2, 5, 8, 11, 14]', testFunction: 'return JSON.stringify(progressaoAritmetica(2, 3, 5)) === "[2,5,8,11,14]";' },
      { description: 'Razão negativa', input: 'progressaoAritmetica(10, -2, 4)', expectedOutput: '[10, 8, 6, 4]', testFunction: 'return JSON.stringify(progressaoAritmetica(10, -2, 4)) === "[10,8,6,4]";' },
      { description: 'Razão zero', input: 'progressaoAritmetica(7, 0, 3)', expectedOutput: '[7, 7, 7]', testFunction: 'return JSON.stringify(progressaoAritmetica(7, 0, 3)) === "[7,7,7]";' },
      { description: 'Nenhum termo', input: 'progressaoAritmetica(1, 1, 0)', expectedOutput: '[]', testFunction: 'return JSON.stringify(progressaoAritmetica(1, 1, 0)) === "[]";' },
    ],
    explanation:
      'O contador do laço (i) e o valor gerado (termo) são coisas diferentes: um diz quantas vezes repetir, o outro é o dado que muda. Separar os dois papéis deixa o laço fácil de ler e de alterar.',
  }),

  // Índice nº 56 — Validação de nota
  logica({
    id: 'logica-056-validacao-de-nota',
    difficulty: 'intermediario',
    topic,
    title: 'Validação de Nota',
    summary: 'Percorra as tentativas de digitação e devolva a primeira nota válida.',
    realWorldContext:
      'Formulários pedem de novo até o usuário digitar algo válido. Aqui as tentativas chegam numa lista, e o algoritmo para assim que encontra a primeira aceitável — sem olhar o resto.',
    description:
      'Implemente primeiraNotaValida(tentativas), que retorna a primeira nota entre 0 e 10 (inclusive) do array. Se nenhuma for válida, retorne null.',
    goal: 'Interromper o laço assim que a condição for satisfeita.',
    signature: {
      javascript: 'function primeiraNotaValida(tentativas)',
      typescript: 'function primeiraNotaValida(tentativas: number[]): number | null',
    },
    body: `  for (const nota of tentativas) {
    if (nota >= 0 && nota <= 10) {
      return nota;
    }
  }
  return null;`,
    typeAssertions: `// @ts-expect-error — o resultado pode ser null: é preciso tratar antes de usar como número
const dobro: number = primeiraNotaValida([5]) * 2;`,
    hints: [
      'Um return dentro do laço encerra a função na hora — é o jeito mais direto de "parar quando achar".',
      'Se o laço terminar sem achar nenhuma, o código continua depois dele: é ali que vai o return null.',
    ],
    testCases: [
      { description: 'Válida no meio', input: 'primeiraNotaValida([-1, 12, 8, 3])', expectedOutput: '8', testFunction: 'return primeiraNotaValida([-1, 12, 8, 3]) === 8;' },
      { description: 'Primeira já é válida', input: 'primeiraNotaValida([10, 5])', expectedOutput: '10', testFunction: 'return primeiraNotaValida([10, 5]) === 10;' },
      { description: 'Zero é válido', input: 'primeiraNotaValida([11, 0])', expectedOutput: '0', testFunction: 'return primeiraNotaValida([11, 0]) === 0;' },
      { description: 'Nenhuma válida', input: 'primeiraNotaValida([15, -3])', expectedOutput: 'null', testFunction: 'return primeiraNotaValida([15, -3]) === null;' },
    ],
    explanation:
      'O laço de busca termina de dois jeitos: achou (return no meio) ou não achou (o código depois do laço). No TypeScript, o retorno number | null obriga quem chama a tratar o "não achou" — o compilador recusa usar o resultado direto numa conta.',
  }),

  // Índice nº 57 — Leitura até zero
  logica({
    id: 'logica-057-leitura-ate-zero',
    difficulty: 'intermediario',
    topic,
    title: 'Leitura até Zero',
    summary: 'Some os valores até aparecer um zero, que encerra a leitura.',
    realWorldContext:
      'Máquinas de caixa antigas e muitos formulários usam um "valor sentinela" para encerrar a entrada: digita-se 0 para fechar. Tudo que vem depois da sentinela é ignorado.',
    description:
      'Implemente somarAteZero(valores), que soma os valores do array na ordem, parando no primeiro 0 (o zero e o que vier depois dele não entram). Se não houver zero, some todos.',
    goal: 'Usar while (ou break) para parar ao encontrar a sentinela.',
    signature: { javascript: 'function somarAteZero(valores)', typescript: 'function somarAteZero(valores: number[]): number' },
    body: `  let soma = 0;
  let i = 0;
  while (i < valores.length && valores[i] !== 0) {
    soma += valores[i];
    i++;
  }
  return soma;`,
    hints: [
      'O while repete enquanto a condição for verdadeira: continue enquanto houver elementos e o atual não for 0.',
      'Outra forma: for...of com if (valor === 0) break; antes de somar.',
    ],
    testCases: [
      { description: 'Para no zero', input: 'somarAteZero([5, 3, 0, 10])', expectedOutput: '8', testFunction: 'return somarAteZero([5, 3, 0, 10]) === 8;' },
      { description: 'Sem zero', input: 'somarAteZero([1, 2, 3])', expectedOutput: '6', testFunction: 'return somarAteZero([1, 2, 3]) === 6;' },
      { description: 'Zero no início', input: 'somarAteZero([0, 4, 4])', expectedOutput: '0', testFunction: 'return somarAteZero([0, 4, 4]) === 0;' },
      { description: 'Com negativos', input: 'somarAteZero([-2, 7, 0, -100])', expectedOutput: '5', testFunction: 'return somarAteZero([-2, 7, 0, -100]) === 5;' },
    ],
    explanation:
      'O while é o laço para "repita até acontecer algo", quando o número de voltas não é conhecido antes. A condição tem duas partes: não passar do fim da lista e não ter chegado à sentinela — esquecer a primeira faz o laço ler além do array.',
  }),

  // Índice nº 58 — Idades até valor negativo
  logica({
    id: 'logica-058-idades-ate-valor-negativo',
    difficulty: 'intermediario',
    topic,
    title: 'Idades até Valor Negativo',
    summary: 'Calcule a média das idades informadas até chegar um valor negativo.',
    realWorldContext:
      'Na triagem de um evento, o atendente registra idades até digitar -1 para encerrar o lote. A média só deve considerar as idades de verdade, nunca o valor de encerramento.',
    description:
      'Implemente mediaAteNegativo(idades), que calcula a média das idades do array até encontrar o primeiro valor negativo (que encerra a leitura e não entra na conta). Se nenhuma idade for considerada, retorne 0.',
    goal: 'Contar e somar até a sentinela, e só então dividir.',
    signature: { javascript: 'function mediaAteNegativo(idades)', typescript: 'function mediaAteNegativo(idades: number[]): number' },
    body: `  let soma = 0;
  let quantidade = 0;
  for (const idade of idades) {
    if (idade < 0) {
      break;
    }
    soma += idade;
    quantidade++;
  }
  return quantidade > 0 ? soma / quantidade : 0;`,
    hints: [
      'Você precisa de dois acumuladores: a soma e a quantidade de idades válidas. Não dá para usar idades.length, porque parte da lista é ignorada.',
      'Ao encontrar um negativo, use break para sair do laço. Depois, divida protegendo o caso quantidade === 0.',
    ],
    testCases: [
      { description: 'Para no -1', input: 'mediaAteNegativo([20, 30, 40, -1, 90])', expectedOutput: '30', testFunction: 'return mediaAteNegativo([20, 30, 40, -1, 90]) === 30;' },
      { description: 'Sem negativo', input: 'mediaAteNegativo([10, 20])', expectedOutput: '15', testFunction: 'return mediaAteNegativo([10, 20]) === 15;' },
      { description: 'Negativo logo no início', input: 'mediaAteNegativo([-1, 50])', expectedOutput: '0', testFunction: 'return mediaAteNegativo([-1, 50]) === 0;' },
      { description: 'Idade zero conta', input: 'mediaAteNegativo([0, 4, -5])', expectedOutput: '2', testFunction: 'return mediaAteNegativo([0, 4, -5]) === 2;' },
    ],
    explanation:
      'O break sai do laço imediatamente. Como parte da lista é descartada, a quantidade de itens válidos precisa ser contada à parte — dividir por idades.length daria uma média errada. E o 0 é uma idade válida (um bebê): a sentinela é "negativo", não "falso".',
  }),

  // Índice nº 59 — Senha até acertar
  logica({
    id: 'logica-059-senha-ate-acertar',
    difficulty: 'intermediario',
    topic,
    title: 'Senha até Acertar',
    summary: 'Descubra em qual tentativa o usuário acertou a senha.',
    realWorldContext:
      'Sistemas de login registram quantas tentativas o usuário precisou — e bloqueiam a conta depois de muitas erradas. Contar tentativas até acertar é o coração dessa regra.',
    description:
      'Implemente tentativasAteAcertar(senhaCorreta, tentativas), que retorna o número da tentativa (começando em 1) em que a senha foi digitada corretamente. Se nenhuma tentativa acertar, retorne -1.',
    goal: 'Percorrer com índice e parar na primeira tentativa correta.',
    signature: {
      javascript: 'function tentativasAteAcertar(senhaCorreta, tentativas)',
      typescript: 'function tentativasAteAcertar(senhaCorreta: string, tentativas: string[]): number',
    },
    body: `  for (let i = 0; i < tentativas.length; i++) {
    if (tentativas[i] === senhaCorreta) {
      return i + 1;
    }
  }
  return -1;`,
    hints: [
      'Use um for com índice: você precisa saber em qual posição acertou, não só se acertou.',
      'Índices de array começam em 0, mas tentativas são contadas a partir de 1: retorne i + 1.',
    ],
    testCases: [
      { description: 'Acerta na 3ª', input: "tentativasAteAcertar('abc', ['123', 'abd', 'abc'])", expectedOutput: '3', testFunction: "return tentativasAteAcertar('abc', ['123', 'abd', 'abc']) === 3;" },
      { description: 'Acerta de primeira', input: "tentativasAteAcertar('x9', ['x9', 'x9'])", expectedOutput: '1', testFunction: "return tentativasAteAcertar('x9', ['x9', 'x9']) === 1;" },
      { description: 'Maiúsculas importam', input: "tentativasAteAcertar('Senha', ['senha', 'SENHA'])", expectedOutput: '-1', testFunction: "return tentativasAteAcertar('Senha', ['senha', 'SENHA']) === -1;" },
      { description: 'Sem tentativas', input: "tentativasAteAcertar('a', [])", expectedOutput: '-1', testFunction: "return tentativasAteAcertar('a', []) === -1;" },
    ],
    explanation:
      'Converter índice (0, 1, 2…) em posição humana (1ª, 2ª, 3ª…) é um +1 que aparece em todo lugar. O -1 como "não encontrado" é uma convenção comum (o indexOf usa a mesma); no TypeScript, outra opção seria retornar number | null.',
  }),

  // Índice nº 60 — Caixa de compras
  logica({
    id: 'logica-060-caixa-de-compras',
    difficulty: 'intermediario',
    topic,
    title: 'Caixa de Compras',
    summary: 'Feche a conta de um carrinho: quantidade de itens, subtotal, desconto e total.',
    realWorldContext:
      'O caixa do supermercado passa cada produto, soma quantidades e valores e, no fim, aplica as promoções. Este exercício junta tudo do módulo: laço, acumuladores, condição e um resultado com vários campos.',
    description:
      'Implemente fecharCaixa(itens), onde cada item é { preco, quantidade }. Retorne { quantidadeDeItens, subtotal, desconto, total }: a soma das quantidades, a soma de preco × quantidade, um desconto de 10% se o subtotal passar de R$ 100 (senão 0) e o total (subtotal − desconto).',
    goal: 'Acumular dois valores no laço e aplicar a regra de desconto no fim.',
    signature: {
      javascript: 'function fecharCaixa(itens)',
      typescript:
        'function fecharCaixa(itens: { preco: number; quantidade: number }[]): { quantidadeDeItens: number; subtotal: number; desconto: number; total: number }',
    },
    body: `  let quantidadeDeItens = 0;
  let subtotal = 0;
  for (const item of itens) {
    quantidadeDeItens += item.quantidade;
    subtotal += item.preco * item.quantidade;
  }
  const desconto = subtotal > 100 ? subtotal * 0.1 : 0;
  const total = subtotal - desconto;
  return { quantidadeDeItens, subtotal, desconto, total };`,
    hints: [
      'No laço, acumule duas coisas: a quantidade de itens e o valor (preco * quantidade) de cada linha do carrinho.',
      'O desconto depende do subtotal final, então é decidido depois do laço. "Passar de R$ 100" é > 100.',
    ],
    testCases: [
      { description: 'Com desconto', input: 'fecharCaixa([{ preco: 30, quantidade: 2 }, { preco: 50, quantidade: 1 }])', expectedOutput: '{ quantidadeDeItens: 3, subtotal: 110, desconto: 11, total: 99 }', testFunction: 'const c = fecharCaixa([{ preco: 30, quantidade: 2 }, { preco: 50, quantidade: 1 }]); return c.quantidadeDeItens === 3 && Math.abs(c.subtotal - 110) < 0.001 && Math.abs(c.desconto - 11) < 0.001 && Math.abs(c.total - 99) < 0.001;' },
      { description: 'Sem desconto', input: 'fecharCaixa([{ preco: 9.9, quantidade: 3 }])', expectedOutput: '{ quantidadeDeItens: 3, subtotal: 29.7, desconto: 0, total: 29.7 }', testFunction: 'const c = fecharCaixa([{ preco: 9.9, quantidade: 3 }]); return c.quantidadeDeItens === 3 && Math.abs(c.subtotal - 29.7) < 0.001 && c.desconto === 0 && Math.abs(c.total - 29.7) < 0.001;' },
      { description: 'Exatamente R$ 100', input: 'fecharCaixa([{ preco: 25, quantidade: 4 }])', expectedOutput: '{ quantidadeDeItens: 4, subtotal: 100, desconto: 0, total: 100 }', testFunction: 'const c = fecharCaixa([{ preco: 25, quantidade: 4 }]); return c.quantidadeDeItens === 4 && c.subtotal === 100 && c.desconto === 0 && c.total === 100;' },
      { description: 'Carrinho vazio', input: 'fecharCaixa([])', expectedOutput: '{ quantidadeDeItens: 0, subtotal: 0, desconto: 0, total: 0 }', testFunction: 'const c = fecharCaixa([]); return c.quantidadeDeItens === 0 && c.subtotal === 0 && c.desconto === 0 && c.total === 0;' },
    ],
    explanation:
      'O algoritmo tem três fases: acumular (laço), decidir (desconto) e montar o resultado. No TypeScript, o tipo { preco: number; quantidade: number }[] descreve exatamente o formato de cada item — no módulo 05 você daria um nome a ele com type ou interface.',
  }),
];
