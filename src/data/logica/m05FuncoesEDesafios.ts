import { LogicExercise } from '../../types/exercise';
import { logica } from './logicFactory';

const topic = 'Funções e Desafios Combinados';

/**
 * Trilha de Lógica — Módulo 05: Funções e Desafios Combinados (índice: exercícios 81 a 100).
 * Enunciados escritos do zero; a especificação (regra, fronteiras e valores de teste) vem de
 * docs/material-apoio/BANCO_EXERCICIOS.md.
 *
 * O módulo fecha a trilha juntando tudo: o aluno deixa de resolver "um problema" e passa a
 * montar uma solução com várias funções pequenas que se chamam entre si (nº 96 a 100).
 * Os procedimentos do material original (que exibiam na tela) devolvem os dados aqui — o
 * enunciado explica por quê: função pura é testável, e quem chama decide como exibir.
 */
export const logicModule05: LogicExercise[] = [
  // Índice nº 81 — Função para somar
  logica({
    id: 'logica-081-funcao-para-somar',
    difficulty: 'basico',
    topic,
    title: 'Função para Somar',
    summary: 'Escreva a função que soma dois números e devolve o resultado.',
    realWorldContext:
      'É o primeiro exercício da trilha outra vez, agora com outra pergunta: antes importava achar a soma, aqui importa quem fica com ela. A função calcula e devolve; mostrar na tela é problema de quem chamou. Essa separação é o que permite reaproveitar o cálculo numa tela, num relatório e num teste.',
    description:
      'Implemente soma(a, b), que recebe dois números e retorna a soma. A função não deve exibir nada — apenas retornar o valor.',
    goal: 'Retornar o resultado em vez de exibi-lo.',
    signature: {
      javascript: 'function soma(a, b)',
      typescript: 'function soma(a: number, b: number): number',
    },
    body: '  return a + b;',
    hints: [
      'O cálculo é o mesmo de sempre: a + b.',
      'A diferença está no return. Uma função que só imprime devolve undefined, e não dá para somar, comparar nem testar um undefined.',
    ],
    testCases: [
      { description: 'Dois positivos', input: 'soma(8, 5)', expectedOutput: '13', testFunction: 'return soma(8, 5) === 13;' },
      { description: 'Com negativo', input: 'soma(-3, 7)', expectedOutput: '4', testFunction: 'return soma(-3, 7) === 4;' },
      { description: 'Com decimais', input: 'soma(2.5, 1.5)', expectedOutput: '4', testFunction: 'return soma(2.5, 1.5) === 4;' },
      { description: 'O retorno é usado em outro cálculo', input: 'soma(soma(1, 2), 3)', expectedOutput: '6', testFunction: 'return soma(soma(1, 2), 3) === 6;' },
    ],
    explanation:
      'O último teste é o que justifica o exercício: soma(soma(1, 2), 3) só funciona porque a função devolve o valor. Se ela imprimisse, o resultado morreria na tela e a chamada de fora receberia undefined. Daqui em diante todo exercício do módulo devolve dados.',
  }),

  // Índice nº 82 — Função maior
  logica({
    id: 'logica-082-funcao-maior',
    difficulty: 'basico',
    topic,
    title: 'Função Maior',
    summary: 'Devolva o maior entre dois números.',
    realWorldContext:
      'Um teto de desconto, o maior lance de um leilão, o prazo mais longo entre dois fornecedores: comparar dois valores e ficar com um deles é uma decisão que aparece em qualquer sistema, e vale isolar numa função.',
    description:
      'Implemente maior(a, b), que recebe dois números e retorna o maior deles. Quando os dois forem iguais, retorne esse valor.',
    goal: 'Devolver um valor escolhido por comparação, tratando o empate.',
    signature: {
      javascript: 'function maior(a, b)',
      typescript: 'function maior(a: number, b: number): number',
    },
    body: `  if (a >= b) {
    return a;
  }
  return b;`,
    hints: [
      'Compare os dois e retorne o vencedor. Não precisa de variável auxiliar: o return já encerra a função.',
      'Pense no empate antes de escrever a comparação: com >= o caso a === b devolve a, e com > devolve b. Os dois estão certos aqui, porque o valor é o mesmo — mas em outros exercícios essa escolha muda o resultado.',
    ],
    testCases: [
      { description: 'O primeiro é maior', input: 'maior(8, 3)', expectedOutput: '8', testFunction: 'return maior(8, 3) === 8;' },
      { description: 'O segundo é maior', input: 'maior(4, 11)', expectedOutput: '11', testFunction: 'return maior(4, 11) === 11;' },
      { description: 'Dois negativos', input: 'maior(-2, -7)', expectedOutput: '-2', testFunction: 'return maior(-2, -7) === -2;' },
      { description: 'Empate', input: 'maior(5, 5)', expectedOutput: '5', testFunction: 'return maior(5, 5) === 5;' },
    ],
    explanation:
      'Com dois negativos, -2 é o maior: o sinal inverte a intuição de "o número maior é o mais longe de zero". Quem escreve maior = 0 e depois compara erra justamente aqui — é por isso que a comparação é sempre entre os valores recebidos, nunca contra um valor inventado.',
  }),

  // Índice nº 83 — Menor de três valores
  logica({
    id: 'logica-083-menor-de-tres-valores',
    difficulty: 'basico',
    topic,
    title: 'Menor de Três Valores',
    summary: 'Devolva o menor entre três números.',
    realWorldContext:
      'Três fornecedores mandam orçamento e você quer o mais barato. Com três valores já não dá para resolver com um if só — e a solução que escala para três é a mesma que escala para mil.',
    description:
      'Implemente menor3(a, b, c), que recebe três números e retorna o menor deles.',
    goal: 'Aplicar o padrão do "campeão" com um candidato inicial e comparações sucessivas.',
    signature: {
      javascript: 'function menor3(a, b, c)',
      typescript: 'function menor3(a: number, b: number, c: number): number',
    },
    body: `  let menor = a;
  if (b < menor) {
    menor = b;
  }
  if (c < menor) {
    menor = c;
  }
  return menor;`,
    hints: [
      'Comece assumindo que o primeiro é o menor e depois confira os outros dois contra ele.',
      'Guarde o candidato numa variável (let menor = a) e substitua quando achar algo menor. Esse é o mesmo padrão do maior de um vetor — aqui com três valores soltos.',
    ],
    testCases: [
      { description: 'O menor está no meio', input: 'menor3(8, 3, 5)', expectedOutput: '3', testFunction: 'return menor3(8, 3, 5) === 3;' },
      { description: 'Todos negativos', input: 'menor3(-1, -7, -2)', expectedOutput: '-7', testFunction: 'return menor3(-1, -7, -2) === -7;' },
      { description: 'Empate entre os dois primeiros', input: 'menor3(4, 4, 9)', expectedOutput: '4', testFunction: 'return menor3(4, 4, 9) === 4;' },
      { description: 'O menor é o último', input: 'menor3(10, 20, 1)', expectedOutput: '1', testFunction: 'return menor3(10, 20, 1) === 1;' },
      { description: 'A ordem dos parâmetros não muda a resposta', input: 'menor3(5, 2, 9) e menor3(9, 5, 2)', expectedOutput: 'os dois devolvem 2', testFunction: 'return menor3(5, 2, 9) === 2 && menor3(9, 5, 2) === 2 && menor3(2, 9, 5) === 2;' },
    ],
    explanation:
      'O último teste chama a função com os mesmos três números em ordens diferentes e espera sempre 2. Uma solução com ifs encadeados mal montados (if (a < b) return a; else if (b < c) return b;) passa em alguns casos e falha nessa troca de ordem — o padrão do campeão não tem esse problema porque todos os valores passam pela mesma comparação.',
  }),

  // Índice nº 84 — Função par ou ímpar
  logica({
    id: 'logica-084-funcao-par-ou-impar',
    difficulty: 'basico',
    topic,
    title: 'Função Par ou Ímpar',
    summary: 'Devolva true quando o número for par.',
    realWorldContext:
      'Alternar a cor das linhas de uma tabela, dividir uma lista em duas colunas, decidir quem joga em casa no rodízio de um campeonato: tudo isso pergunta "é par?". Uma função que devolve true ou false encaixa direto num if.',
    description:
      'Implemente ehPar(n), que recebe um número inteiro e retorna true quando ele for par e false quando for ímpar. Zero e negativos pares também são pares.',
    goal: 'Retornar o resultado de uma comparação, sem if.',
    signature: {
      javascript: 'function ehPar(n)',
      typescript: 'function ehPar(n: number): boolean',
    },
    body: '  return n % 2 === 0;',
    typeAssertions: `// @ts-expect-error — o parâmetro é número: texto não entra
ehPar('8');
const resultado: boolean = ehPar(8);
// @ts-expect-error — o retorno é boolean, não number
const comoNumero: number = ehPar(8);`,
    hints: [
      'O operador % devolve o resto da divisão. Um número é par quando o resto da divisão por 2 é zero.',
      'A comparação n % 2 === 0 já vale true ou false. Escrever if (...) return true; else return false; funciona, mas é o caminho longo para a mesma coisa.',
    ],
    testCases: [
      { description: 'Par positivo', input: 'ehPar(8)', expectedOutput: 'true', testFunction: 'return ehPar(8) === true;' },
      { description: 'Ímpar', input: 'ehPar(13)', expectedOutput: 'false', testFunction: 'return ehPar(13) === false;' },
      { description: 'Zero é par', input: 'ehPar(0)', expectedOutput: 'true', testFunction: 'return ehPar(0) === true;' },
      { description: 'Negativo par', input: 'ehPar(-4)', expectedOutput: 'true', testFunction: 'return ehPar(-4) === true;' },
      { description: 'Negativo ímpar', input: 'ehPar(-3)', expectedOutput: 'false', testFunction: 'return ehPar(-3) === false;' },
    ],
    explanation:
      'Os dois últimos testes pegam a armadilha: em JavaScript -3 % 2 vale -1, não 1. Quem escreve n % 2 === 1 acerta os positivos e erra todo ímpar negativo. Comparar o resto com 0 funciona para os dois sinais, porque só o zero não tem sinal.',
  }),

  // Índice nº 85 — Função de média
  logica({
    id: 'logica-085-funcao-de-media',
    difficulty: 'basico',
    topic,
    title: 'Função de Média',
    summary: 'Calcule a média aritmética de três notas.',
    realWorldContext:
      'A média do boletim some num detalhe que confunde muita gente: arredondar para duas casas é coisa da exibição, não do cálculo. Se você arredonda dentro da função, perde precisão em todo cálculo que vier depois.',
    description:
      'Implemente media3(a, b, c), que recebe três notas e retorna a média aritmética delas. Retorne o valor completo, sem arredondar — a formatação com duas casas é responsabilidade de quem exibe.',
    goal: 'Separar o cálculo da formatação.',
    signature: {
      javascript: 'function media3(a, b, c)',
      typescript: 'function media3(a: number, b: number, c: number): number',
    },
    body: '  return (a + b + c) / 3;',
    hints: [
      'Some os três e divida por 3. Os parênteses são obrigatórios: sem eles, só o último valor seria dividido.',
      'Não use toFixed nem arredondamentos. toFixed devolve texto, e o exercício pede um número — quem chamar a função é que decide quantas casas mostrar.',
    ],
    testCases: [
      { description: 'Média exata', input: 'media3(8, 7, 6)', expectedOutput: '7', testFunction: 'return media3(8, 7, 6) === 7;' },
      { description: 'Outra média exata', input: 'media3(10, 9, 8)', expectedOutput: '9', testFunction: 'return media3(10, 9, 8) === 9;' },
      { description: 'Média com dízima', input: 'media3(5.5, 6.5, 7)', expectedOutput: '6.333...', testFunction: 'return Math.abs(media3(5.5, 6.5, 7) - 6.333333333333333) < 1e-9;' },
      { description: 'O retorno é número, não texto', input: 'typeof media3(1, 2, 3)', expectedOutput: 'number', testFunction: 'return typeof media3(1, 2, 3) === "number";' },
      { description: 'Precedência: a divisão não vale só para o último', input: 'media3(9, 9, 9)', expectedOutput: '9', testFunction: 'return media3(9, 9, 9) === 9;' },
    ],
    explanation:
      'A média de 5,5, 6,5 e 7 é uma dízima, e por isso o teste compara com tolerância (1e-9) em vez de usar ===: ponto flutuante binário não representa 6,3333... exatamente. O teste de typeof barra a solução que devolve toFixed(2) — ela mostraria "6.33" na tela, mas quebraria qualquer conta feita em cima do retorno.',
  }),

  // Índice nº 86 — Função de conversão de temperatura
  logica({
    id: 'logica-086-funcao-de-conversao-de-temperatura',
    difficulty: 'basico',
    topic,
    title: 'Conversão de Temperatura em Função',
    summary: 'Converta uma temperatura de Celsius para Fahrenheit.',
    realWorldContext:
      'Um app de previsão do tempo guarda a temperatura em uma unidade e mostra na que o usuário escolheu. A conversão fica numa função porque é usada em vários lugares — e porque uma fórmula escrita uma vez só erra uma vez.',
    description:
      'Implemente celsiusParaFahrenheit(celsius), que retorna a temperatura equivalente em Fahrenheit. A fórmula é F = C × 9 / 5 + 32.',
    goal: 'Traduzir uma fórmula respeitando a ordem das operações.',
    signature: {
      javascript: 'function celsiusParaFahrenheit(celsius)',
      typescript: 'function celsiusParaFahrenheit(celsius: number): number',
    },
    body: '  return celsius * 9 / 5 + 32;',
    hints: [
      'Multiplicação e divisão acontecem antes da soma, então celsius * 9 / 5 + 32 já resolve na ordem certa.',
      'Cuidado em dividir por 5 antes de multiplicar por 9 em divisão inteira. Em JavaScript não há esse risco (9 / 5 vale 1.8), mas escrever * 9 / 5 deixa a intenção clara.',
    ],
    testCases: [
      { description: 'Água congelando', input: 'celsiusParaFahrenheit(0)', expectedOutput: '32', testFunction: 'return celsiusParaFahrenheit(0) === 32;' },
      { description: 'Dia quente', input: 'celsiusParaFahrenheit(25)', expectedOutput: '77', testFunction: 'return celsiusParaFahrenheit(25) === 77;' },
      { description: 'O ponto em que as escalas se cruzam', input: 'celsiusParaFahrenheit(-40)', expectedOutput: '-40', testFunction: 'return celsiusParaFahrenheit(-40) === -40;' },
      { description: 'Água fervendo', input: 'celsiusParaFahrenheit(100)', expectedOutput: '212', testFunction: 'return celsiusParaFahrenheit(100) === 212;' },
      { description: 'Valor com decimal', input: 'celsiusParaFahrenheit(37.5)', expectedOutput: '99.5', testFunction: 'return Math.abs(celsiusParaFahrenheit(37.5) - 99.5) < 1e-9;' },
    ],
    explanation:
      '-40 °C é exatamente -40 °F: é o único ponto em que as duas escalas coincidem, e por isso serve de teste cruel para a fórmula. Quem soma 32 antes de multiplicar passa no teste do zero (32 está certo por acidente) e erra em todos os outros — um caso que acerta sozinho esconde o erro, e é por isso que um teste só nunca basta.',
  }),

  // Índice nº 87 — Função fatorial
  logica({
    id: 'logica-087-funcao-fatorial',
    difficulty: 'intermediario',
    topic,
    title: 'Função Fatorial',
    summary: 'Calcule o fatorial de um número inteiro não negativo.',
    realWorldContext:
      'Fatorial conta de quantas maneiras dá para organizar um conjunto: a ordem de largada de uma corrida, as combinações de uma senha. Cresce tão rápido que 13! já passa do que um inteiro comum guarda com segurança — daí o enunciado limitar a entrada.',
    description:
      'Implemente fatorial(n), que recebe um inteiro de 0 a 12 e retorna n! — o produto de todos os inteiros de 1 até n. Por definição, 0! vale 1.',
    goal: 'Acumular um produto, com o acumulador começando no valor neutro.',
    signature: {
      javascript: 'function fatorial(n)',
      typescript: 'function fatorial(n: number): number',
    },
    body: `  let resultado = 1;
  for (let i = 2; i <= n; i++) {
    resultado = resultado * i;
  }
  return resultado;`,
    hints: [
      'O acumulador de uma multiplicação começa em 1, não em 0. Começando em 0, todo produto dá 0.',
      'Não precisa de caso especial para 0 e 1: se o laço começa em 2, ele simplesmente não roda nenhuma vez e a função devolve o 1 inicial.',
    ],
    testCases: [
      { description: 'Zero fatorial', input: 'fatorial(0)', expectedOutput: '1', testFunction: 'return fatorial(0) === 1;' },
      { description: 'Um fatorial', input: 'fatorial(1)', expectedOutput: '1', testFunction: 'return fatorial(1) === 1;' },
      { description: 'Cinco fatorial', input: 'fatorial(5)', expectedOutput: '120', testFunction: 'return fatorial(5) === 120;' },
      { description: 'Seis fatorial', input: 'fatorial(6)', expectedOutput: '720', testFunction: 'return fatorial(6) === 720;' },
      { description: 'O limite do enunciado', input: 'fatorial(12)', expectedOutput: '479001600', testFunction: 'return fatorial(12) === 479001600;' },
    ],
    explanation:
      '0! e 1! saem de graça quando o laço começa em 2 — é a inicialização em 1 que responde pelos dois, não um if. Esse é o truque do valor neutro: 1 na multiplicação, 0 na soma. Trocar os dois é o erro mais comum de acumulador, e dá um resultado zerado que parece bug do laço.',
  }),

  // Índice nº 88 — N-ésimo termo de Fibonacci
  logica({
    id: 'logica-088-n-esimo-termo-de-fibonacci',
    difficulty: 'intermediario',
    topic,
    title: 'N-ésimo Termo de Fibonacci',
    summary: 'Devolva o termo de índice N da sequência de Fibonacci.',
    realWorldContext:
      'Fibonacci aparece na disposição das folhas de uma planta e em estruturas de dados que balanceiam a si mesmas. Aqui o que importa é mais prosaico: a função recebe uma posição e devolve só aquele termo, sem montar a sequência inteira.',
    description:
      'Implemente fibonacci(n), que recebe um índice n (a partir de 0) e retorna o termo correspondente. A convenção é fibonacci(0) = 0 e fibonacci(1) = 1; cada termo seguinte é a soma dos dois anteriores.',
    goal: 'Avançar dois valores a cada passo, guardando apenas o necessário.',
    signature: {
      javascript: 'function fibonacci(n)',
      typescript: 'function fibonacci(n: number): number',
    },
    body: `  if (n === 0) {
    return 0;
  }
  let anterior = 0;
  let atual = 1;
  for (let i = 2; i <= n; i++) {
    const proximo = anterior + atual;
    anterior = atual;
    atual = proximo;
  }
  return atual;`,
    hints: [
      'Não guarde a sequência toda: dois valores bastam, o anterior e o atual. A cada passo os dois andam uma casa para a frente.',
      'A ordem das atribuições importa. Calcule a soma numa terceira variável antes de sobrescrever: se você fizer anterior = atual primeiro, o valor antigo de anterior já se perdeu.',
    ],
    testCases: [
      { description: 'Índice 0', input: 'fibonacci(0)', expectedOutput: '0', testFunction: 'return fibonacci(0) === 0;' },
      { description: 'Índice 1', input: 'fibonacci(1)', expectedOutput: '1', testFunction: 'return fibonacci(1) === 1;' },
      { description: 'Índice 6', input: 'fibonacci(6)', expectedOutput: '8', testFunction: 'return fibonacci(6) === 8;' },
      { description: 'Índice 10', input: 'fibonacci(10)', expectedOutput: '55', testFunction: 'return fibonacci(10) === 55;' },
      { description: 'Os primeiros termos em sequência', input: 'fibonacci(0) até fibonacci(7)', expectedOutput: '0, 1, 1, 2, 3, 5, 8, 13', testFunction: 'const esperado = [0, 1, 1, 2, 3, 5, 8, 13]; for (let i = 0; i < esperado.length; i++) { if (fibonacci(i) !== esperado[i]) return false; } return true;' },
    ],
    explanation:
      'O último teste varre os índices de 0 a 7 de uma vez e é o que pega o erro de convenção: uma solução que trate fibonacci(1) como 0, ou que comece a contar do 1, acerta os termos grandes e erra o começo. Guardar só duas variáveis em vez do array inteiro é o que torna a função barata — a memória não cresce com n.',
  }),

  // Índice nº 89 — Validação de nota
  logica({
    id: 'logica-089-validacao-de-nota',
    difficulty: 'basico',
    topic,
    title: 'Validação de Nota',
    summary: 'Diga se uma nota está no intervalo válido de 0 a 10.',
    realWorldContext:
      'Validar entrada é a primeira linha de defesa de qualquer sistema. Um diário de classe que aceita nota 150 ou -3 corrompe a média de toda a turma, e o erro só aparece no fechamento do bimestre.',
    description:
      'Implemente notaValida(nota), que retorna true quando a nota estiver entre 0 e 10, incluindo os extremos, e false fora disso.',
    goal: 'Combinar duas comparações com E lógico, respeitando os limites inclusivos.',
    signature: {
      javascript: 'function notaValida(nota)',
      typescript: 'function notaValida(nota: number): boolean',
    },
    body: '  return nota >= 0 && nota <= 10;',
    hints: [
      'São duas condições ao mesmo tempo: não pode ser menor que 0 e não pode ser maior que 10. O operador && exige que as duas valham.',
      'Os extremos são válidos, então use >= e <=. Com > e < as notas 0 e 10 seriam recusadas.',
    ],
    testCases: [
      { description: 'Nota no meio do intervalo', input: 'notaValida(7.5)', expectedOutput: 'true', testFunction: 'return notaValida(7.5) === true;' },
      { description: 'Limite inferior', input: 'notaValida(0)', expectedOutput: 'true', testFunction: 'return notaValida(0) === true;' },
      { description: 'Limite superior', input: 'notaValida(10)', expectedOutput: 'true', testFunction: 'return notaValida(10) === true;' },
      { description: 'Abaixo do intervalo', input: 'notaValida(-1)', expectedOutput: 'false', testFunction: 'return notaValida(-1) === false;' },
      { description: 'Acima do intervalo', input: 'notaValida(10.5)', expectedOutput: 'false', testFunction: 'return notaValida(10.5) === false;' },
    ],
    explanation:
      'Os testes dos limites (0 e 10) são o coração do exercício: trocar >= por > quebra exatamente esses dois casos e nenhum outro. Note também que 0 <= nota <= 10, escrito assim numa linha, compila em JavaScript mas dá o resultado errado — a primeira comparação vira true ou false, e aí é esse booleano que se compara com 10.',
  }),

  // Índice nº 90 — Procedimento para mostrar a tabuada
  logica({
    id: 'logica-090-linhas-da-tabuada',
    difficulty: 'basico',
    topic,
    title: 'Linhas da Tabuada',
    summary: 'Monte as dez linhas da tabuada de um número.',
    realWorldContext:
      'No material original este exercício é um procedimento: ele imprime a tabuada e não devolve nada. Aqui a função monta as linhas e entrega a lista, porque é isso que torna o resultado testável — e porque quem chama pode mostrar na tela, salvar num arquivo ou mandar numa mensagem.',
    description:
      'Implemente linhasDaTabuada(n), que retorna um array com as dez linhas da tabuada de n, de 1 a 10, cada uma no formato "4 x 1 = 4" (com espaços em volta do x e do sinal de igual).',
    goal: 'Transformar um procedimento que exibe em uma função que devolve.',
    signature: {
      javascript: 'function linhasDaTabuada(n)',
      typescript: 'function linhasDaTabuada(n: number): string[]',
    },
    body: `  const linhas = [];
  for (let i = 1; i <= 10; i++) {
    linhas.push(n + ' x ' + i + ' = ' + n * i);
  }
  return linhas;`,
    tsBody: `  const linhas: string[] = [];
  for (let i = 1; i <= 10; i++) {
    linhas.push(n + ' x ' + i + ' = ' + n * i);
  }
  return linhas;`,
    hints: [
      'Em vez de exibir dentro do laço, monte o texto de cada linha e guarde no array com push.',
      'Preste atenção ao formato: "4 x 1 = 4" tem espaço antes e depois do x e do =. Um espaço sobrando ou faltando reprova o teste.',
    ],
    testCases: [
      { description: 'Dez linhas', input: 'linhasDaTabuada(4).length', expectedOutput: '10', testFunction: 'return linhasDaTabuada(4).length === 10;' },
      { description: 'Primeira linha', input: 'linhasDaTabuada(4)[0]', expectedOutput: '"4 x 1 = 4"', testFunction: 'return linhasDaTabuada(4)[0] === "4 x 1 = 4";' },
      { description: 'Última linha', input: 'linhasDaTabuada(4)[9]', expectedOutput: '"4 x 10 = 40"', testFunction: 'return linhasDaTabuada(4)[9] === "4 x 10 = 40";' },
      { description: 'Tabuada do zero', input: 'linhasDaTabuada(0)[4]', expectedOutput: '"0 x 5 = 0"', testFunction: 'return linhasDaTabuada(0)[4] === "0 x 5 = 0";' },
      { description: 'Tabuada completa do 7', input: 'linhasDaTabuada(7)', expectedOutput: 'de "7 x 1 = 7" a "7 x 10 = 70"', testFunction: 'const t = linhasDaTabuada(7); for (let i = 1; i <= 10; i++) { if (t[i - 1] !== "7 x " + i + " = " + (7 * i)) return false; } return true;' },
    ],
    explanation:
      'O teste da última linha é o que pega o off-by-one: um laço com i < 10 devolve nove linhas e para em "4 x 9 = 36". Como a tabuada vai de 1 a 10, a condição é i <= 10. E note que o índice do array (0 a 9) não é o multiplicador (1 a 10) — por isso a linha de i está em t[i - 1].',
  }),

  // Índice nº 91 — Contar positivos no vetor
  logica({
    id: 'logica-091-contar-positivos-no-vetor',
    difficulty: 'basico',
    topic,
    title: 'Contar Positivos no Vetor',
    summary: 'Conte quantos elementos de um vetor são maiores que zero.',
    realWorldContext:
      'Quantos dias do mês tiveram lucro, quantos sensores leram variação, quantas contas fecharam no azul. A pergunta é sempre a mesma: percorrer tudo e contar quem passa num critério.',
    description:
      'Implemente contarPositivos(valores), que recebe um array de números e retorna quantos deles são maiores que zero. Zero não é positivo.',
    goal: 'Contar ocorrências que satisfazem uma condição.',
    signature: {
      javascript: 'function contarPositivos(valores)',
      typescript: 'function contarPositivos(valores: number[]): number',
    },
    body: `  let total = 0;
  for (let i = 0; i < valores.length; i++) {
    if (valores[i] > 0) {
      total = total + 1;
    }
  }
  return total;`,
    hints: [
      'O contador começa em 0 e sobe 1 a cada elemento que passa no teste — some 1, não o valor do elemento.',
      'Zero não é positivo nem negativo, então a comparação é > 0 e não >= 0.',
    ],
    testCases: [
      { description: 'Mistura de sinais e zero', input: 'contarPositivos([5, -2, 0, 8, -1])', expectedOutput: '2', testFunction: 'return contarPositivos([5, -2, 0, 8, -1]) === 2;' },
      { description: 'Todos positivos', input: 'contarPositivos([1, 2, 3])', expectedOutput: '3', testFunction: 'return contarPositivos([1, 2, 3]) === 3;' },
      { description: 'Nenhum positivo', input: 'contarPositivos([-1, -2, -3])', expectedOutput: '0', testFunction: 'return contarPositivos([-1, -2, -3]) === 0;' },
      { description: 'Só zeros', input: 'contarPositivos([0, 0, 0])', expectedOutput: '0', testFunction: 'return contarPositivos([0, 0, 0]) === 0;' },
      { description: 'Vetor vazio', input: 'contarPositivos([])', expectedOutput: '0', testFunction: 'return contarPositivos([]) === 0;' },
    ],
    explanation:
      'O vetor de zeros separa quem escreveu > 0 de quem escreveu >= 0 — o resultado muda de 0 para 3. Repare também que o contador soma 1 e não valores[i]: somar o elemento daria o total acumulado, que é outro exercício. E o vetor vazio devolve 0 sem nenhum tratamento especial, porque o laço não roda.',
  }),

  // Índice nº 92 — Média dos elementos do vetor
  logica({
    id: 'logica-092-media-dos-elementos-do-vetor',
    difficulty: 'basico',
    topic,
    title: 'Média dos Elementos do Vetor',
    summary: 'Calcule a média dos valores de um vetor.',
    realWorldContext:
      'Tempo médio de atendimento, gasto médio por cliente, nota média de uma avaliação. A diferença em relação à média de três notas é que agora a quantidade de valores só se descobre em tempo de execução.',
    description:
      'Implemente mediaVetor(valores), que recebe um array com pelo menos um número e retorna a média dos elementos.',
    goal: 'Dividir um acumulado pela quantidade de elementos lidos.',
    signature: {
      javascript: 'function mediaVetor(valores)',
      typescript: 'function mediaVetor(valores: number[]): number',
    },
    body: `  let soma = 0;
  for (let i = 0; i < valores.length; i++) {
    soma = soma + valores[i];
  }
  return soma / valores.length;`,
    hints: [
      'São duas etapas: acumular a soma dentro do laço e dividir depois que ele terminar.',
      'A divisão fica fora do laço. Dividindo a cada passo, você calcula médias parciais e o resultado final sai errado.',
    ],
    testCases: [
      { description: 'Quatro valores', input: 'mediaVetor([2, 4, 6, 8])', expectedOutput: '5', testFunction: 'return mediaVetor([2, 4, 6, 8]) === 5;' },
      { description: 'Valores iguais', input: 'mediaVetor([10, 10, 10])', expectedOutput: '10', testFunction: 'return mediaVetor([10, 10, 10]) === 10;' },
      { description: 'Positivo e negativo se anulam', input: 'mediaVetor([-5, 5])', expectedOutput: '0', testFunction: 'return mediaVetor([-5, 5]) === 0;' },
      { description: 'Um elemento', input: 'mediaVetor([7])', expectedOutput: '7', testFunction: 'return mediaVetor([7]) === 7;' },
      { description: 'Média com dízima', input: 'mediaVetor([1, 2, 2])', expectedOutput: '1.666...', testFunction: 'return Math.abs(mediaVetor([1, 2, 2]) - 5 / 3) < 1e-9;' },
    ],
    explanation:
      'Com um elemento só, a média é o próprio valor — e isso cai de graça, porque soma / 1 é soma. O divisor é valores.length, lido do vetor: um número fixo (dividir sempre por 10, por exemplo) funcionaria num caso e quebraria em todos os outros.',
  }),

  // Índice nº 93 — Maior valor do vetor
  logica({
    id: 'logica-093-maior-valor-do-vetor',
    difficulty: 'basico',
    topic,
    title: 'Maior Valor do Vetor',
    summary: 'Encontre o maior elemento de um vetor não vazio.',
    realWorldContext:
      'O pico de acessos do dia, a maior venda do mês, a temperatura máxima da semana. É a busca pelo máximo — e o detalhe que derruba a maioria das primeiras tentativas é por onde começar a comparação.',
    description:
      'Implemente maiorVetor(valores), que recebe um array com pelo menos um número e retorna o maior elemento. Comece a comparação pelo primeiro elemento do vetor.',
    goal: 'Inicializar o campeão com um valor que existe nos dados.',
    signature: {
      javascript: 'function maiorVetor(valores)',
      typescript: 'function maiorVetor(valores: number[]): number',
    },
    body: `  let maior = valores[0];
  for (let i = 1; i < valores.length; i++) {
    if (valores[i] > maior) {
      maior = valores[i];
    }
  }
  return maior;`,
    hints: [
      'Comece com maior = valores[0] e percorra a partir do índice 1 — o primeiro já é o campeão inicial, não precisa ser comparado consigo mesmo.',
      'Não inicialize o campeão com 0 nem com um número que você escolheu: ele precisa ser um valor que está no vetor.',
    ],
    testCases: [
      { description: 'Maior no meio', input: 'maiorVetor([4, 7, 2, 9, 5])', expectedOutput: '9', testFunction: 'return maiorVetor([4, 7, 2, 9, 5]) === 9;' },
      { description: 'Todos negativos', input: 'maiorVetor([-8, -2, -5])', expectedOutput: '-2', testFunction: 'return maiorVetor([-8, -2, -5]) === -2;' },
      { description: 'Valores iguais', input: 'maiorVetor([3, 3, 3])', expectedOutput: '3', testFunction: 'return maiorVetor([3, 3, 3]) === 3;' },
      { description: 'Maior na primeira posição', input: 'maiorVetor([100, 1, 2])', expectedOutput: '100', testFunction: 'return maiorVetor([100, 1, 2]) === 100;' },
      { description: 'Um elemento', input: 'maiorVetor([-42])', expectedOutput: '-42', testFunction: 'return maiorVetor([-42]) === -42;' },
    ],
    explanation:
      'O vetor todo negativo é o teste que importa: quem inicializa maior = 0 devolve 0, um valor que não está nos dados. Começar pelo primeiro elemento resolve isso de uma vez e funciona para qualquer faixa de valores. O caso de um elemento só confirma o laço começando em 1 — ele não roda, e a função devolve o campeão inicial.',
  }),

  // Índice nº 94 — Posições de um valor
  logica({
    id: 'logica-094-posicoes-de-um-valor',
    difficulty: 'intermediario',
    topic,
    title: 'Posições de um Valor',
    summary: 'Devolva todas as posições em que um valor aparece no vetor.',
    realWorldContext:
      'Marcar no texto todas as ocorrências de uma palavra, destacar as linhas de uma planilha que batem com o filtro. Não basta saber se o valor existe nem quantas vezes: é preciso saber onde.',
    description:
      'Implemente buscarPosicoes(valores, procurado), que retorna um array com todos os índices (contados a partir de zero) em que procurado aparece em valores. Quando não houver nenhuma ocorrência, retorne um array vazio.',
    goal: 'Acumular resultados num array em vez de devolver um só valor.',
    signature: {
      javascript: 'function buscarPosicoes(valores, procurado)',
      typescript: 'function buscarPosicoes(valores: number[], procurado: number): number[]',
    },
    body: `  const posicoes = [];
  for (let i = 0; i < valores.length; i++) {
    if (valores[i] === procurado) {
      posicoes.push(i);
    }
  }
  return posicoes;`,
    tsBody: `  const posicoes: number[] = [];
  for (let i = 0; i < valores.length; i++) {
    if (valores[i] === procurado) {
      posicoes.push(i);
    }
  }
  return posicoes;`,
    hints: [
      'O que entra no array de resposta é o índice i, não o valor valores[i] — o valor você já conhece, é o procurado.',
      'Não pare no primeiro encontrado: o laço precisa varrer o vetor inteiro, porque o valor pode aparecer mais de uma vez.',
    ],
    testCases: [
      { description: 'Duas ocorrências', input: 'buscarPosicoes([4, 7, 2, 7, 9], 7)', expectedOutput: '[1, 3]', testFunction: 'return JSON.stringify(buscarPosicoes([4, 7, 2, 7, 9], 7)) === "[1,3]";' },
      { description: 'Todas as posições', input: 'buscarPosicoes([5, 5, 5], 5)', expectedOutput: '[0, 1, 2]', testFunction: 'return JSON.stringify(buscarPosicoes([5, 5, 5], 5)) === "[0,1,2]";' },
      { description: 'Nenhuma ocorrência', input: 'buscarPosicoes([1, 3, 5], 2)', expectedOutput: '[]', testFunction: 'const r = buscarPosicoes([1, 3, 5], 2); return Array.isArray(r) && r.length === 0;' },
      { description: 'Uma ocorrência, no fim', input: 'buscarPosicoes([1, 2, 3], 3)', expectedOutput: '[2]', testFunction: 'return JSON.stringify(buscarPosicoes([1, 2, 3], 3)) === "[2]";' },
      { description: 'Índices, não valores', input: 'buscarPosicoes([10, 20, 10], 10)', expectedOutput: '[0, 2]', testFunction: 'return JSON.stringify(buscarPosicoes([10, 20, 10], 10)) === "[0,2]";' },
    ],
    explanation:
      'O último teste existe para pegar quem guardou o valor no lugar do índice: com [10, 20, 10] procurando 10, a resposta certa é [0, 2] e a errada é [10, 10] — as duas têm dois elementos, então contar o tamanho não bastaria. Quando não há ocorrência o retorno é um array vazio, não null nem -1: o tipo da resposta não muda com os dados.',
  }),

  // Índice nº 95 — Contar ocorrências em função
  logica({
    id: 'logica-095-contar-ocorrencias-em-funcao',
    difficulty: 'basico',
    topic,
    title: 'Contar Ocorrências em Função',
    summary: 'Conte quantas vezes um valor aparece no vetor.',
    realWorldContext:
      'Quantas vezes um produto foi vendido, quantos votos um candidato recebeu, quantas vezes o mesmo erro apareceu no log. É a mesma varredura do exercício anterior com uma resposta mais simples: um número.',
    description:
      'Implemente contarOcorrencias(valores, procurado), que retorna quantas vezes procurado aparece em valores. Se não aparecer, retorne 0.',
    goal: 'Distinguir uma contagem de uma coleção de resultados.',
    signature: {
      javascript: 'function contarOcorrencias(valores, procurado)',
      typescript: 'function contarOcorrencias(valores: number[], procurado: number): number',
    },
    body: `  let total = 0;
  for (let i = 0; i < valores.length; i++) {
    if (valores[i] === procurado) {
      total = total + 1;
    }
  }
  return total;`,
    hints: [
      'É o contador de sempre: começa em 0 e sobe 1 a cada acerto.',
      'A ausência do valor resulta em 0, que é um número — não um array vazio nem null.',
    ],
    testCases: [
      { description: 'Três ocorrências', input: 'contarOcorrencias([3, 5, 3, 8, 3], 3)', expectedOutput: '3', testFunction: 'return contarOcorrencias([3, 5, 3, 8, 3], 3) === 3;' },
      { description: 'Valor ausente', input: 'contarOcorrencias([1, 2, 3], 4)', expectedOutput: '0', testFunction: 'return contarOcorrencias([1, 2, 3], 4) === 0;' },
      { description: 'Todos iguais ao procurado', input: 'contarOcorrencias([7, 7, 7, 7], 7)', expectedOutput: '4', testFunction: 'return contarOcorrencias([7, 7, 7, 7], 7) === 4;' },
      { description: 'Procurando zero', input: 'contarOcorrencias([0, 1, 0], 0)', expectedOutput: '2', testFunction: 'return contarOcorrencias([0, 1, 0], 0) === 2;' },
      { description: 'O retorno é número', input: 'typeof contarOcorrencias([1], 9)', expectedOutput: 'number', testFunction: 'return typeof contarOcorrencias([1], 9) === "number";' },
    ],
    explanation:
      'Procurar o zero é o teste traiçoeiro: numa comparação frouxa como if (valores[i]) o zero seria tratado como falso e nunca contado. Com === a comparação é entre os valores, e 0 === 0 é verdadeiro. Juntos, este exercício e o anterior mostram a escolha de projeto: a mesma varredura responde "quantos" ou "onde", dependendo do que você acumula.',
  }),

  // Índice nº 96 — Estatísticas de vendas
  logica({
    id: 'logica-096-estatisticas-de-vendas',
    difficulty: 'intermediario',
    topic,
    title: 'Estatísticas de Vendas',
    summary: 'Calcule total, média, maior venda e quantas ficaram acima da média.',
    realWorldContext:
      'É o primeiro exercício em que uma resposta depende de outra: para saber quantas vendas ficaram acima da média, você precisa da média — e para ter a média, do total. É assim que um relatório de verdade se monta, uma função chamando a anterior.',
    description:
      'Implemente estatisticasVendas(vendas), que recebe um array com pelo menos uma venda e retorna { total, media, maiorVenda, acimaDaMedia }. Em acimaDaMedia conte apenas as vendas estritamente maiores que a média. Quebre a solução em funções auxiliares dentro do seu código.',
    goal: 'Compor um resultado a partir de cálculos que dependem uns dos outros.',
    signature: {
      javascript: 'function estatisticasVendas(vendas)',
      typescript: 'function estatisticasVendas(vendas: number[]): { total: number; media: number; maiorVenda: number; acimaDaMedia: number }',
    },
    body: `  function total(valores) {
    let soma = 0;
    for (let i = 0; i < valores.length; i++) {
      soma = soma + valores[i];
    }
    return soma;
  }

  function maior(valores) {
    let maiorValor = valores[0];
    for (let i = 1; i < valores.length; i++) {
      if (valores[i] > maiorValor) {
        maiorValor = valores[i];
      }
    }
    return maiorValor;
  }

  const somaDasVendas = total(vendas);
  const media = somaDasVendas / vendas.length;

  let acimaDaMedia = 0;
  for (let i = 0; i < vendas.length; i++) {
    if (vendas[i] > media) {
      acimaDaMedia = acimaDaMedia + 1;
    }
  }

  return { total: somaDasVendas, media, maiorVenda: maior(vendas), acimaDaMedia };`,
    tsBody: `  function total(valores: number[]): number {
    let soma = 0;
    for (let i = 0; i < valores.length; i++) {
      soma = soma + valores[i];
    }
    return soma;
  }

  function maior(valores: number[]): number {
    let maiorValor = valores[0];
    for (let i = 1; i < valores.length; i++) {
      if (valores[i] > maiorValor) {
        maiorValor = valores[i];
      }
    }
    return maiorValor;
  }

  const somaDasVendas = total(vendas);
  const media = somaDasVendas / vendas.length;

  let acimaDaMedia = 0;
  for (let i = 0; i < vendas.length; i++) {
    if (vendas[i] > media) {
      acimaDaMedia = acimaDaMedia + 1;
    }
  }

  return { total: somaDasVendas, media, maiorVenda: maior(vendas), acimaDaMedia };`,
    hints: [
      'A média reaproveita o total: calcule o total uma vez, guarde numa variável e divida pelo tamanho. Não vale percorrer o vetor de novo só para somar outra vez.',
      'A contagem de "acima da média" só pode rodar depois que a média estiver pronta — são duas passadas pelo vetor, nessa ordem.',
    ],
    testCases: [
      { description: 'Conjunto do enunciado', input: 'estatisticasVendas([100, 250, 80, 300, 270])', expectedOutput: '{ total: 1000, media: 200, maiorVenda: 300, acimaDaMedia: 3 }', testFunction: 'const e = estatisticasVendas([100, 250, 80, 300, 270]); return e.total === 1000 && e.media === 200 && e.maiorVenda === 300 && e.acimaDaMedia === 3;' },
      { description: 'Valores iguais: nenhum acima da média', input: 'estatisticasVendas([50, 50, 50])', expectedOutput: '{ total: 150, media: 50, maiorVenda: 50, acimaDaMedia: 0 }', testFunction: 'const e = estatisticasVendas([50, 50, 50]); return e.total === 150 && e.media === 50 && e.maiorVenda === 50 && e.acimaDaMedia === 0;' },
      { description: 'Uma venda só', input: 'estatisticasVendas([400])', expectedOutput: '{ total: 400, media: 400, maiorVenda: 400, acimaDaMedia: 0 }', testFunction: 'const e = estatisticasVendas([400]); return e.total === 400 && e.media === 400 && e.maiorVenda === 400 && e.acimaDaMedia === 0;' },
      { description: 'Exatamente na média não conta', input: 'estatisticasVendas([10, 20, 30])', expectedOutput: 'media 20 e acimaDaMedia 1', testFunction: 'const e = estatisticasVendas([10, 20, 30]); return e.media === 20 && e.acimaDaMedia === 1;' },
    ],
    explanation:
      'Dois testes atacam a mesma fronteira: o vetor de valores iguais e o [10, 20, 30]. Nos dois há venda exatamente igual à média, e ela não conta — por isso a comparação é > e não >=. Trocar o sinal faz o primeiro caso devolver 3 em vez de 0. O vetor com uma venda só é o lembrete de que a única venda é a própria média, logo não está acima dela.',
  }),

  // Índice nº 97 — Estatísticas da turma
  logica({
    id: 'logica-097-estatisticas-da-turma',
    difficulty: 'intermediario',
    topic,
    title: 'Estatísticas da Turma',
    summary: 'Com nomes e notas em vetores paralelos, devolva média, extremos e quem está acima da média.',
    realWorldContext:
      'Dois vetores paralelos são a planilha de um diário de classe: a coluna dos nomes e a coluna das notas, ligadas pela linha. Perder essa ligação é o bug clássico — o relatório sai com a nota certa no aluno errado.',
    description:
      'Implemente estatisticasTurma(nomes, notas), em que nomes[i] e notas[i] são do mesmo aluno. Retorne { media, maiorNota, menorNota, acimaDaMedia }, onde acimaDaMedia é um array com os nomes dos alunos cuja nota é estritamente maior que a média, na ordem em que aparecem.',
    goal: 'Preservar a associação entre dois vetores paralelos.',
    signature: {
      javascript: 'function estatisticasTurma(nomes, notas)',
      typescript: 'function estatisticasTurma(nomes: string[], notas: number[]): { media: number; maiorNota: number; menorNota: number; acimaDaMedia: string[] }',
    },
    body: `  let soma = 0;
  let maiorNota = notas[0];
  let menorNota = notas[0];
  for (let i = 0; i < notas.length; i++) {
    soma = soma + notas[i];
    if (notas[i] > maiorNota) {
      maiorNota = notas[i];
    }
    if (notas[i] < menorNota) {
      menorNota = notas[i];
    }
  }
  const media = soma / notas.length;

  const acimaDaMedia = [];
  for (let i = 0; i < notas.length; i++) {
    if (notas[i] > media) {
      acimaDaMedia.push(nomes[i]);
    }
  }

  return { media, maiorNota, menorNota, acimaDaMedia };`,
    tsBody: `  let soma = 0;
  let maiorNota = notas[0];
  let menorNota = notas[0];
  for (let i = 0; i < notas.length; i++) {
    soma = soma + notas[i];
    if (notas[i] > maiorNota) {
      maiorNota = notas[i];
    }
    if (notas[i] < menorNota) {
      menorNota = notas[i];
    }
  }
  const media = soma / notas.length;

  const acimaDaMedia: string[] = [];
  for (let i = 0; i < notas.length; i++) {
    if (notas[i] > media) {
      acimaDaMedia.push(nomes[i]);
    }
  }

  return { media, maiorNota, menorNota, acimaDaMedia };`,
    hints: [
      'O índice i é o que mantém nome e nota juntos: quando a nota notas[i] passa no critério, o nome que entra na lista é nomes[i], com o mesmo i.',
      'Soma, maior e menor podem sair numa única passada pelo vetor. A lista de acima da média precisa de uma segunda, porque depende da média já calculada.',
    ],
    testCases: [
      { description: 'Turma do enunciado', input: "estatisticasTurma(['Ana', 'Bruno', 'Carla', 'Diego', 'Eva'], [8, 6, 9, 7, 5])", expectedOutput: '{ media: 7, maiorNota: 9, menorNota: 5, acimaDaMedia: ["Ana", "Carla"] }', testFunction: 'const e = estatisticasTurma(["Ana", "Bruno", "Carla", "Diego", "Eva"], [8, 6, 9, 7, 5]); return e.media === 7 && e.maiorNota === 9 && e.menorNota === 5 && JSON.stringify(e.acimaDaMedia) === \'["Ana","Carla"]\';' },
      { description: 'Quem está na média não entra', input: "a nota 7 de Diego é igual à média", expectedOutput: 'Diego fora da lista', testFunction: 'const e = estatisticasTurma(["Ana", "Bruno", "Carla", "Diego", "Eva"], [8, 6, 9, 7, 5]); return e.acimaDaMedia.indexOf("Diego") === -1;' },
      { description: 'Notas iguais: lista vazia', input: "estatisticasTurma(['A', 'B'], [5, 5])", expectedOutput: 'acimaDaMedia []', testFunction: 'const e = estatisticasTurma(["A", "B"], [5, 5]); return e.media === 5 && e.acimaDaMedia.length === 0;' },
      { description: 'A ligação nome–nota se mantém', input: "estatisticasTurma(['X', 'Y', 'Z'], [1, 10, 2])", expectedOutput: 'acimaDaMedia ["Y"]', testFunction: 'const e = estatisticasTurma(["X", "Y", "Z"], [1, 10, 2]); return JSON.stringify(e.acimaDaMedia) === \'["Y"]\';' },
      { description: 'Um aluno', input: "estatisticasTurma(['Só'], [6])", expectedOutput: 'media 6, extremos 6, lista vazia', testFunction: 'const e = estatisticasTurma(["Só"], [6]); return e.media === 6 && e.maiorNota === 6 && e.menorNota === 6 && e.acimaDaMedia.length === 0;' },
    ],
    explanation:
      'O teste com ["X", "Y", "Z"] e [1, 10, 2] é o que denuncia o desalinhamento: a média é 4,33 e só Y passa. Uma solução que guarde a nota e depois procure o nome por outro caminho — ou que use dois índices diferentes — devolve "X" ou "Z" aqui. Diego, com nota exatamente 7 numa média de 7, cobre a outra fronteira: acima da média é estritamente maior.',
  }),

  // Índice nº 98 — Temperaturas da semana
  logica({
    id: 'logica-098-temperaturas-da-semana',
    difficulty: 'intermediario',
    topic,
    title: 'Temperaturas da Semana',
    summary: 'Resuma sete temperaturas em média, extremos e dias acima da média.',
    realWorldContext:
      'O resumo que um app de clima mostra no fim da semana. O conjunto tem tamanho fixo — sete dias — mas a função não deve depender disso: no mês seguinte vão ser trinta.',
    description:
      'Implemente estatisticasSemana(temperaturas), que recebe as temperaturas dos sete dias e retorna { media, maior, menor, diasAcimaDaMedia }. Conte em diasAcimaDaMedia apenas os dias estritamente acima da média. Não use o número 7 fixo no código: tire a quantidade do próprio array.',
    goal: 'Escrever um resumo que não depende da quantidade de dados.',
    signature: {
      javascript: 'function estatisticasSemana(temperaturas)',
      typescript: 'function estatisticasSemana(temperaturas: number[]): { media: number; maior: number; menor: number; diasAcimaDaMedia: number }',
    },
    body: `  let soma = 0;
  let maior = temperaturas[0];
  let menor = temperaturas[0];
  for (let i = 0; i < temperaturas.length; i++) {
    soma = soma + temperaturas[i];
    if (temperaturas[i] > maior) {
      maior = temperaturas[i];
    }
    if (temperaturas[i] < menor) {
      menor = temperaturas[i];
    }
  }
  const media = soma / temperaturas.length;

  let diasAcimaDaMedia = 0;
  for (let i = 0; i < temperaturas.length; i++) {
    if (temperaturas[i] > media) {
      diasAcimaDaMedia = diasAcimaDaMedia + 1;
    }
  }

  return { media, maior, menor, diasAcimaDaMedia };`,
    hints: [
      'Use temperaturas.length em todo lugar, inclusive na divisão da média. Assim a mesma função resume uma semana ou um mês.',
      'Maior e menor começam no primeiro elemento. Começar maior em 0 quebraria numa semana de temperaturas negativas.',
    ],
    testCases: [
      { description: 'Semana do enunciado', input: 'estatisticasSemana([22, 25, 19, 28, 24, 26, 20])', expectedOutput: 'media 23.43, maior 28, menor 19, 4 dias acima', testFunction: 'const e = estatisticasSemana([22, 25, 19, 28, 24, 26, 20]); return Math.abs(e.media - 164 / 7) < 1e-9 && e.maior === 28 && e.menor === 19 && e.diasAcimaDaMedia === 4;' },
      { description: 'Temperaturas negativas', input: 'estatisticasSemana([-5, -1, -8])', expectedOutput: 'maior -1, menor -8', testFunction: 'const e = estatisticasSemana([-5, -1, -8]); return e.maior === -1 && e.menor === -8;' },
      { description: 'Todas iguais', input: 'estatisticasSemana([20, 20, 20])', expectedOutput: 'media 20 e 0 dias acima', testFunction: 'const e = estatisticasSemana([20, 20, 20]); return e.media === 20 && e.diasAcimaDaMedia === 0;' },
      { description: 'Funciona com outra quantidade de dias', input: 'estatisticasSemana([10, 20])', expectedOutput: 'media 15 e 1 dia acima', testFunction: 'const e = estatisticasSemana([10, 20]); return e.media === 15 && e.diasAcimaDaMedia === 1;' },
    ],
    explanation:
      'A média da semana do enunciado é 164 / 7 = 23,4285…, uma dízima — daí o teste comparar com tolerância em vez de usar o 23,43 arredondado. O caso com duas temperaturas é o que pega o 7 fixo no código: dividir por 7 um array de 2 elementos dá média 4,28 e nenhum dia acima, em vez de 15 e um dia.',
  }),

  // Índice nº 99 — Controle de estoque
  logica({
    id: 'logica-099-controle-de-estoque',
    difficulty: 'avancado',
    topic,
    title: 'Controle de Estoque',
    summary: 'Com três vetores paralelos, calcule o valor do estoque e ache o produto de maior valor.',
    realWorldContext:
      'O valor parado no estoque não está na etiqueta de preço nem na contagem: é o produto dos dois. Um item caro com uma unidade pesa menos que um item barato com cem — e é por isso que o gerente pergunta pelo valor, não pela quantidade.',
    description:
      'Implemente analisarEstoque(nomes, quantidades, precos), três vetores paralelos do mesmo produto no mesmo índice. Retorne { valorTotal, estoqueBaixo, produtoMaiorValor }, em que valorTotal é a soma de quantidade × preço de todos os produtos, estoqueBaixo é quantos produtos têm quantidade menor que 5, e produtoMaiorValor é { nome, valor } do produto com maior valor em estoque. Em caso de empate, fique com o primeiro.',
    goal: 'Comparar por um valor calculado, não por um campo dos dados.',
    signature: {
      javascript: 'function analisarEstoque(nomes, quantidades, precos)',
      typescript: 'function analisarEstoque(nomes: string[], quantidades: number[], precos: number[]): { valorTotal: number; estoqueBaixo: number; produtoMaiorValor: { nome: string; valor: number } }',
    },
    body: `  let valorTotal = 0;
  let estoqueBaixo = 0;
  let produtoMaiorValor = { nome: nomes[0], valor: quantidades[0] * precos[0] };

  for (let i = 0; i < nomes.length; i++) {
    const valorDoProduto = quantidades[i] * precos[i];
    valorTotal = valorTotal + valorDoProduto;
    if (quantidades[i] < 5) {
      estoqueBaixo = estoqueBaixo + 1;
    }
    if (valorDoProduto > produtoMaiorValor.valor) {
      produtoMaiorValor = { nome: nomes[i], valor: valorDoProduto };
    }
  }

  return { valorTotal, estoqueBaixo, produtoMaiorValor };`,
    hints: [
      'Calcule quantidade × preço numa variável no começo de cada volta: o mesmo valor serve para somar no total e para comparar com o campeão.',
      'O campeão é o maior valor em estoque, não o maior preço nem a maior quantidade. Guarde nome e valor juntos num objeto, para os dois mudarem na mesma atribuição.',
    ],
    testCases: [
      { description: 'Estoque do enunciado', input: "analisarEstoque(['Teclado', 'Mouse', 'Cabo', 'Headset'], [3, 10, 2, 5], [120, 50, 20, 200])", expectedOutput: '{ valorTotal: 1900, estoqueBaixo: 2, produtoMaiorValor: { nome: "Headset", valor: 1000 } }', testFunction: 'const e = analisarEstoque(["Teclado", "Mouse", "Cabo", "Headset"], [3, 10, 2, 5], [120, 50, 20, 200]); return e.valorTotal === 1900 && e.estoqueBaixo === 2 && e.produtoMaiorValor.nome === "Headset" && e.produtoMaiorValor.valor === 1000;' },
      { description: 'Maior valor não é o maior preço', input: "analisarEstoque(['Caro', 'Barato'], [1, 100], [500, 50])", expectedOutput: 'produtoMaiorValor Barato, 5000', testFunction: 'const e = analisarEstoque(["Caro", "Barato"], [1, 100], [500, 50]); return e.produtoMaiorValor.nome === "Barato" && e.produtoMaiorValor.valor === 5000;' },
      { description: 'Maior valor não é a maior quantidade', input: "analisarEstoque(['Muitos', 'Poucos'], [100, 2], [1, 1000])", expectedOutput: 'produtoMaiorValor Poucos, 2000', testFunction: 'const e = analisarEstoque(["Muitos", "Poucos"], [100, 2], [1, 1000]); return e.produtoMaiorValor.nome === "Poucos" && e.produtoMaiorValor.valor === 2000;' },
      { description: 'Fronteira do estoque baixo: 5 não é menor que 5', input: "analisarEstoque(['A', 'B', 'C'], [4, 5, 6], [10, 10, 10])", expectedOutput: 'estoqueBaixo 1', testFunction: 'const e = analisarEstoque(["A", "B", "C"], [4, 5, 6], [10, 10, 10]); return e.estoqueBaixo === 1;' },
      { description: 'Empate fica com o primeiro', input: "analisarEstoque(['Primeiro', 'Segundo'], [2, 4], [100, 50])", expectedOutput: 'produtoMaiorValor Primeiro, 200', testFunction: 'const e = analisarEstoque(["Primeiro", "Segundo"], [2, 4], [100, 50]); return e.produtoMaiorValor.nome === "Primeiro" && e.produtoMaiorValor.valor === 200;' },
    ],
    explanation:
      'Os dois testes do meio existem para derrubar o atalho: comparar precos[i] elege o "Caro", comparar quantidades[i] elege os "Muitos", e as duas respostas estão erradas. O campeão tem de ser o produto das duas colunas. A fronteira do estoque baixo é "menor que 5", então 5 fica de fora — e com > na comparação do campeão, o empate fica naturalmente com o primeiro, porque ninguém depois dele é estritamente maior.',
  }),

  // Índice nº 100 — Desafio final: análise de uma turma
  logica({
    id: 'logica-100-desafio-final-analise-de-uma-turma',
    difficulty: 'avancado',
    topic,
    title: 'Desafio Final: Análise de uma Turma',
    summary: 'O relatório completo de uma turma a partir de nomes, idades e notas.',
    realWorldContext:
      'O último exercício da trilha é o relatório que uma secretaria de escola emite de verdade: seis respostas tiradas dos mesmos dados, cada uma com seu critério. É aqui que se vê se os padrões dos 99 exercícios anteriores viraram ferramenta.',
    description:
      'Implemente analisarTurma(nomes, idades, notas), três vetores paralelos do mesmo aluno no mesmo índice. Retorne { media, maiorNota, menorNota, aprovados, maisVelho, acimaDaMedia }: media é a média das notas; maiorNota e menorNota são { nome, nota }; aprovados é quantos têm nota maior ou igual a 7; maisVelho é { nome, idade }; e acimaDaMedia é um array com os nomes de nota estritamente maior que a média. Em empates, fique com o primeiro.',
    goal: 'Montar um relatório com vários critérios, cada um na sua fronteira.',
    signature: {
      javascript: 'function analisarTurma(nomes, idades, notas)',
      typescript: 'function analisarTurma(nomes: string[], idades: number[], notas: number[]): { media: number; maiorNota: { nome: string; nota: number }; menorNota: { nome: string; nota: number }; aprovados: number; maisVelho: { nome: string; idade: number }; acimaDaMedia: string[] }',
    },
    body: `  let soma = 0;
  let aprovados = 0;
  let maiorNota = { nome: nomes[0], nota: notas[0] };
  let menorNota = { nome: nomes[0], nota: notas[0] };
  let maisVelho = { nome: nomes[0], idade: idades[0] };

  for (let i = 0; i < nomes.length; i++) {
    soma = soma + notas[i];
    if (notas[i] >= 7) {
      aprovados = aprovados + 1;
    }
    if (notas[i] > maiorNota.nota) {
      maiorNota = { nome: nomes[i], nota: notas[i] };
    }
    if (notas[i] < menorNota.nota) {
      menorNota = { nome: nomes[i], nota: notas[i] };
    }
    if (idades[i] > maisVelho.idade) {
      maisVelho = { nome: nomes[i], idade: idades[i] };
    }
  }

  const media = soma / notas.length;

  const acimaDaMedia = [];
  for (let i = 0; i < nomes.length; i++) {
    if (notas[i] > media) {
      acimaDaMedia.push(nomes[i]);
    }
  }

  return { media, maiorNota, menorNota, aprovados, maisVelho, acimaDaMedia };`,
    tsBody: `  let soma = 0;
  let aprovados = 0;
  let maiorNota = { nome: nomes[0], nota: notas[0] };
  let menorNota = { nome: nomes[0], nota: notas[0] };
  let maisVelho = { nome: nomes[0], idade: idades[0] };

  for (let i = 0; i < nomes.length; i++) {
    soma = soma + notas[i];
    if (notas[i] >= 7) {
      aprovados = aprovados + 1;
    }
    if (notas[i] > maiorNota.nota) {
      maiorNota = { nome: nomes[i], nota: notas[i] };
    }
    if (notas[i] < menorNota.nota) {
      menorNota = { nome: nomes[i], nota: notas[i] };
    }
    if (idades[i] > maisVelho.idade) {
      maisVelho = { nome: nomes[i], idade: idades[i] };
    }
  }

  const media = soma / notas.length;

  const acimaDaMedia: string[] = [];
  for (let i = 0; i < nomes.length; i++) {
    if (notas[i] > media) {
      acimaDaMedia.push(nomes[i]);
    }
  }

  return { media, maiorNota, menorNota, aprovados, maisVelho, acimaDaMedia };`,
    hints: [
      'Duas fronteiras diferentes no mesmo exercício: aprovado é nota >= 7 (o 7 passa) e acima da média é nota > media (o valor igual não passa). Confira cada sinal.',
      'Soma, aprovados, extremos e mais velho saem numa passada só. A lista de acima da média precisa de uma segunda passada, depois da média pronta.',
    ],
    testCases: [
      { description: 'Turma do enunciado', input: "analisarTurma(['Ana', 'Bruno', 'Carla', 'Diego', 'Eva'], [19, 22, 18, 25, 20], [8, 6, 9, 7, 5])", expectedOutput: 'media 7, maior Carla 9, menor Eva 5, 3 aprovados, mais velho Diego 25, acima: Ana e Carla', testFunction: 'const t = analisarTurma(["Ana", "Bruno", "Carla", "Diego", "Eva"], [19, 22, 18, 25, 20], [8, 6, 9, 7, 5]); return t.media === 7 && t.maiorNota.nome === "Carla" && t.maiorNota.nota === 9 && t.menorNota.nome === "Eva" && t.menorNota.nota === 5 && t.aprovados === 3 && t.maisVelho.nome === "Diego" && t.maisVelho.idade === 25 && JSON.stringify(t.acimaDaMedia) === \'["Ana","Carla"]\';' },
      { description: 'Nota 7 aprova, mas não está acima da média 7', input: 'Diego tem nota 7 na turma do enunciado', expectedOutput: 'conta em aprovados e não em acimaDaMedia', testFunction: 'const t = analisarTurma(["Ana", "Bruno", "Carla", "Diego", "Eva"], [19, 22, 18, 25, 20], [8, 6, 9, 7, 5]); return t.aprovados === 3 && t.acimaDaMedia.indexOf("Diego") === -1;' },
      { description: 'O mais velho não é quem tem a maior nota', input: "analisarTurma(['Jovem', 'Velho'], [18, 60], [10, 2])", expectedOutput: 'maisVelho Velho, maiorNota Jovem', testFunction: 'const t = analisarTurma(["Jovem", "Velho"], [18, 60], [10, 2]); return t.maisVelho.nome === "Velho" && t.maiorNota.nome === "Jovem";' },
      { description: 'Turma toda com a mesma nota', input: "analisarTurma(['A', 'B'], [20, 30], [7, 7])", expectedOutput: '2 aprovados e nenhum acima da média', testFunction: 'const t = analisarTurma(["A", "B"], [20, 30], [7, 7]); return t.aprovados === 2 && t.acimaDaMedia.length === 0 && t.media === 7;' },
      { description: 'Turma toda reprovada', input: "analisarTurma(['A', 'B', 'C'], [20, 21, 22], [6.9, 3, 5])", expectedOutput: '0 aprovados, menor nota C... na verdade B com 3', testFunction: 'const t = analisarTurma(["A", "B", "C"], [20, 21, 22], [6.9, 3, 5]); return t.aprovados === 0 && t.menorNota.nome === "B" && t.maiorNota.nome === "A";' },
    ],
    explanation:
      'A turma com notas 7 e 7 é o resumo da trilha: os dois são aprovados (>= 7 inclui o 7) e nenhum está acima da média (que também é 7, e > exige ser maior). Dois critérios, duas fronteiras, um sinal de diferença — e a nota 6,9 do último teste mostra que "quase 7" não aprova. Três vetores paralelos e cinco campeões diferentes saem de uma única passada, porque cada um guarda seu próprio candidato; o que os mantém corretos é o índice i ser o mesmo para nome, idade e nota.',
  }),
];
