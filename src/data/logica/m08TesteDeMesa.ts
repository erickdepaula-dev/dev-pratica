import { LogicExercise } from '../../types/exercise';
import { testeDeMesa } from './logicFactory';

const topic = 'Teste de Mesa';

/**
 * Trilha de Lógica — Teste de Mesa (Fase 4.5). Modalidade 'teste_de_mesa': o aluno executa o
 * código "no papel" e preenche a tabela com o valor das variáveis a cada `anotar(...)`.
 * O gabarito é gerado executando o código (src/services/deskCheck.ts) e conferido por
 * `npm run check:ts`. IDs: `logica-t<nn>-<slug>`.
 */
export const logicModule08: LogicExercise[] = [
  testeDeMesa({
    id: 'logica-t01-acumulador-de-soma',
    difficulty: 'basico',
    topic,
    title: 'Teste de Mesa: Acumulador de Soma',
    summary: 'Acompanhe, volta a volta, como um acumulador de soma cresce.',
    realWorldContext:
      'Antes de confiar num laço, programadores experientes "rodam o código na cabeça" com uma tabela de variáveis. É o jeito mais rápido de achar um erro de lógica sem depurador.',
    description:
      'Execute o código mentalmente. Cada vez que a execução passar por anotar(i, soma), preencha uma linha da tabela com os valores de i e soma naquele momento.',
    goal: 'Preencher a tabela com os valores de i e soma no fim de cada volta.',
    deskCheck: {
      code: `let soma = 0;
for (let i = 1; i <= 5; i++) {
  soma = soma + i;
  anotar(i, soma);
}`,
      columns: ['i', 'soma'],
    },
    hints: [
      'Na primeira volta, i vale 1 e soma passa de 0 para 0 + 1 = 1 — é a linha de exemplo.',
      'A cada volta, i aumenta 1 e soma recebe o valor antigo dela mais o novo i.',
    ],
    explanation:
      'O acumulador guarda o resultado parcial: em cada linha, soma é a soma da linha anterior mais o i atual (1, 3, 6, 10, 15). Ler a tabela de cima para baixo mostra o algoritmo funcionando — e, se uma linha "pular", você sabe exatamente onde está o erro.',
  }),

  testeDeMesa({
    id: 'logica-t02-contagem-com-passo',
    difficulty: 'basico',
    topic,
    title: 'Teste de Mesa: Contagem com Passo',
    summary: 'Siga um laço while que diminui de 3 em 3 até deixar de ser positivo.',
    realWorldContext:
      'Laços while são os que mais escondem erros de parada: um passo errado e o laço roda uma vez a mais (ou para cedo). A tabela mostra exatamente quantas voltas acontecem.',
    description:
      'Execute o código e preencha uma linha a cada anotar(n). Atenção à condição do while: ela é testada antes de cada volta.',
    goal: 'Descobrir quantas voltas o laço dá e o valor de n em cada uma.',
    deskCheck: {
      code: `let n = 10;
while (n > 0) {
  anotar(n);
  n = n - 3;
}`,
      columns: ['n'],
    },
    hints: [
      'O anotar vem ANTES da subtração: a linha registra o valor de n no começo da volta.',
      'Depois de 1, n vira -2 — e -2 > 0 é falso, então o laço para sem anotar o -2.',
    ],
    explanation:
      'São 4 voltas: 10, 7, 4 e 1. O valor -2 nunca aparece porque a condição n > 0 é testada antes de entrar na volta. A posição do anotar (antes ou depois da atualização) muda a tabela inteira — o mesmo vale para um console.log ao depurar.',
  }),

  testeDeMesa({
    id: 'logica-t03-troca-com-auxiliar',
    difficulty: 'basico',
    topic,
    title: 'Teste de Mesa: Troca com Auxiliar',
    summary: 'Registre o estado de três variáveis em cada passo de uma troca de valores.',
    realWorldContext:
      'Teste de mesa não é só para laços: em sequências de atribuições ele mostra o momento exato em que um valor seria perdido — por isso a troca precisa de uma variável auxiliar.',
    description:
      'Preencha uma linha a cada anotar(a, b, aux), com o valor das três variáveis naquele ponto. Antes de receber valor, aux vale 0.',
    goal: 'Ver a troca acontecer instrução por instrução.',
    deskCheck: {
      code: `let a = 5;
let b = 8;
let aux = 0;
anotar(a, b, aux);
aux = a;
anotar(a, b, aux);
a = b;
anotar(a, b, aux);
b = aux;
anotar(a, b, aux);`,
      columns: ['a', 'b', 'aux'],
    },
    hints: [
      'Cada atribuição muda só a variável à esquerda do =. As outras continuam com o valor anterior.',
      'Depois de a = b, a e b ficam iguais por um instante — o valor original de a só sobrevive em aux.',
    ],
    explanation:
      'A linha 3 da tabela (a = 8, b = 8) é o momento crítico: sem aux, o 5 teria sumido. A última linha confirma a troca: a = 8, b = 5. Escrever o estado depois de cada instrução é a forma mais simples de teste de mesa.',
  }),

  testeDeMesa({
    id: 'logica-t04-fatorial',
    difficulty: 'basico',
    topic,
    title: 'Teste de Mesa: Fatorial',
    summary: 'Acompanhe o acumulador de produto no cálculo de 5!.',
    realWorldContext:
      'Valores que crescem rápido são fáceis de errar de cabeça. Anotar cada passo do produto evita confundir 4! com 5! — e mostra por que o acumulador começa em 1.',
    description: 'Preencha uma linha a cada anotar(i, fatorial).',
    goal: 'Registrar i e o produto acumulado em cada volta.',
    deskCheck: {
      code: `let fatorial = 1;
for (let i = 1; i <= 5; i++) {
  fatorial = fatorial * i;
  anotar(i, fatorial);
}`,
      columns: ['i', 'fatorial'],
    },
    hints: [
      'O acumulador começa em 1 (começar em 0 zeraria todos os produtos).',
      'Cada linha multiplica o fatorial da linha anterior pelo i atual: 1, 2, 6, …',
    ],
    explanation:
      'A sequência é 1, 2, 6, 24, 120. Cada linha depende da anterior, por isso um erro numa linha se propaga para todas as seguintes — no teste de mesa, corrija sempre a partir da primeira linha errada.',
  }),

  testeDeMesa({
    id: 'logica-t05-maior-valor',
    difficulty: 'intermediario',
    topic,
    title: 'Teste de Mesa: Maior Valor',
    summary: 'Siga a busca do maior valor de uma lista, posição por posição.',
    realWorldContext:
      'O padrão do "campeão" (guardar o melhor até agora) aparece em rankings, recordes e buscas. A tabela mostra quando o campeão troca — e quando um empate não troca nada.',
    description: 'Preencha uma linha a cada anotar(i, valores[i], maior).',
    goal: 'Registrar a posição, o valor visitado e o maior até ali.',
    deskCheck: {
      code: `const valores = [3, 9, 2, 9, 5];
let maior = valores[0];
for (let i = 1; i < valores.length; i++) {
  if (valores[i] > maior) {
    maior = valores[i];
  }
  anotar(i, valores[i], maior);
}`,
      columns: ['i', 'valores[i]', 'maior'],
    },
    hints: [
      'O laço começa em i = 1: a posição 0 já foi usada para inicializar maior.',
      'A comparação é > (estritamente maior): quando aparece outro 9, maior não muda.',
    ],
    explanation:
      'maior vira 9 na posição 1 e não muda mais: o segundo 9 não é maior que 9. A tabela também mostra que a posição 0 nunca é visitada pelo laço — ela já está "dentro" do valor inicial de maior.',
  }),

  testeDeMesa({
    id: 'logica-t06-contando-pares',
    difficulty: 'intermediario',
    topic,
    title: 'Teste de Mesa: Contando Pares',
    summary: 'Registre o teste de paridade e o contador para cada número da lista.',
    realWorldContext:
      'Condições dentro de laços são onde mais se erra: o contador só muda em algumas voltas. Anotar o resultado da condição (true/false) deixa claro em quais.',
    description:
      'Preencha uma linha a cada anotar(numero, ehPar, pares). ehPar é true ou false.',
    goal: 'Ver em quais voltas o contador aumenta.',
    deskCheck: {
      code: `const numeros = [4, 7, 10, -3, 0];
let pares = 0;
for (const numero of numeros) {
  const ehPar = numero % 2 === 0;
  if (ehPar) {
    pares++;
  }
  anotar(numero, ehPar, pares);
}`,
      columns: ['numero', 'ehPar', 'pares'],
    },
    hints: [
      'numero % 2 === 0 é true para os pares. Lembre: -3 % 2 é -1, então -3 é ímpar.',
      'Zero é par: 0 % 2 é 0.',
    ],
    explanation:
      'O contador termina em 3 (4, 10 e 0). Nas voltas com ehPar false, a linha repete o valor anterior de pares — é isso que a tabela deixa visível: a variável "parada" enquanto a condição não é satisfeita.',
  }),

  testeDeMesa({
    id: 'logica-t07-fibonacci',
    difficulty: 'intermediario',
    topic,
    title: 'Teste de Mesa: Fibonacci',
    summary: 'Acompanhe as três variáveis que geram a sequência de Fibonacci.',
    realWorldContext:
      'Algoritmos que guardam estado entre voltas (o termo anterior, o atual) são os mais difíceis de acompanhar de cabeça. Uma coluna por variável resolve.',
    description: 'Preencha uma linha a cada anotar(i, anterior, atual, proximo).',
    goal: 'Ver como anterior e atual "andam" a cada volta.',
    deskCheck: {
      code: `let anterior = 0;
let atual = 1;
for (let i = 1; i <= 5; i++) {
  const proximo = anterior + atual;
  anotar(i, anterior, atual, proximo);
  anterior = atual;
  atual = proximo;
}`,
      columns: ['i', 'anterior', 'atual', 'proximo'],
    },
    hints: [
      'O anotar acontece ANTES de anterior e atual avançarem.',
      'Na volta seguinte, anterior recebe o atual antigo e atual recebe o proximo antigo.',
    ],
    explanation:
      'Linha a linha, o par (anterior, atual) desliza pela sequência: (0, 1), (1, 1), (1, 2), (2, 3), (3, 5). Perceber esse "deslizamento" é o que torna o algoritmo óbvio — e mostra por que a ordem das duas atribuições no fim importa.',
  }),

  testeDeMesa({
    id: 'logica-t08-divisao-por-subtracoes',
    difficulty: 'intermediario',
    topic,
    title: 'Teste de Mesa: Divisão por Subtrações',
    summary: 'Descubra quociente e resto subtraindo o divisor repetidamente.',
    realWorldContext:
      'Processadores antigos dividiam assim, e o mesmo raciocínio aparece em troco de cédulas e em distribuição de tarefas. O teste de mesa mostra o quociente sendo contado.',
    description: 'Preencha uma linha a cada anotar(resto, quociente).',
    goal: 'Acompanhar quantas subtrações cabem em 17 ÷ 5.',
    deskCheck: {
      code: `const divisor = 5;
let resto = 17;
let quociente = 0;
anotar(resto, quociente);
while (resto >= divisor) {
  resto = resto - divisor;
  quociente = quociente + 1;
  anotar(resto, quociente);
}`,
      columns: ['resto', 'quociente'],
    },
    hints: [
      'A primeira linha é o estado antes do laço: resto 17, quociente 0.',
      'O laço continua enquanto resto >= 5. Quando resto vira 2, ele para.',
    ],
    explanation:
      'Foram 3 subtrações: 17 ÷ 5 = 3, resto 2 — os mesmos valores de Math.floor(17 / 5) e 17 % 5. Anotar o estado antes do laço (linha 1) é útil para conferir os valores iniciais, fonte comum de erro.',
  }),

  testeDeMesa({
    id: 'logica-t09-invertendo-digitos',
    difficulty: 'intermediario',
    topic,
    title: 'Teste de Mesa: Invertendo Dígitos',
    summary: 'Inverta 1234 com resto e divisão inteira, anotando cada dígito.',
    realWorldContext:
      'Separar dígitos com % 10 e Math.floor(n / 10) é a base de validações como dígito verificador de CPF e cartões. Fazer na tabela fixa o padrão.',
    description: 'Preencha uma linha a cada anotar(n, digito, invertido), com os valores no fim da volta.',
    goal: 'Ver os dígitos saírem de n e entrarem em invertido.',
    deskCheck: {
      code: `let n = 1234;
let invertido = 0;
while (n > 0) {
  const digito = n % 10;
  invertido = invertido * 10 + digito;
  n = Math.floor(n / 10);
  anotar(n, digito, invertido);
}`,
      columns: ['n', 'digito', 'invertido'],
    },
    hints: [
      'n % 10 é o último dígito de n; Math.floor(n / 10) remove esse dígito.',
      'invertido * 10 "abre espaço" à direita para o novo dígito: 4 → 43 → 432 → 4321.',
    ],
    explanation:
      'Cada volta move um dígito do fim de n para o fim de invertido. Quando n chega a 0, o laço para. A tabela mostra as duas variáveis evoluindo em sentidos opostos — um padrão difícil de enxergar só lendo o código.',
  }),

  testeDeMesa({
    id: 'logica-t10-classificando-notas',
    difficulty: 'basico',
    topic,
    title: 'Teste de Mesa: Classificando Notas',
    summary: 'Registre a situação de cada aluno numa escada de if / else if.',
    realWorldContext:
      'Condições encadeadas falham nas fronteiras. Testar com valores exatamente no limite (7 e 5) é o que o teste de mesa faz de melhor.',
    description:
      'Preencha uma linha a cada anotar(nota, situacao). A situação é um texto: escreva sem aspas (ex.: aprovado).',
    goal: 'Aplicar as faixas a cada nota, incluindo as de fronteira.',
    deskCheck: {
      code: `const notas = [8, 7, 6.5, 5, 4];
for (const nota of notas) {
  let situacao;
  if (nota >= 7) {
    situacao = 'aprovado';
  } else if (nota >= 5) {
    situacao = 'recuperação';
  } else {
    situacao = 'reprovado';
  }
  anotar(nota, situacao);
}`,
      columns: ['nota', 'situacao'],
    },
    hints: [
      'A nota 7 satisfaz nota >= 7: aprovado.',
      'Só chega ao else if quem não passou no primeiro if. 5 satisfaz nota >= 5: recuperação.',
    ],
    explanation:
      'As notas 7 e 5 são as fronteiras: com > no lugar de >=, as duas mudariam de faixa. Escolher valores de fronteira para o teste de mesa é o que revela esse tipo de erro.',
  }),

  testeDeMesa({
    id: 'logica-t11-uma-passada-do-bubble-sort',
    difficulty: 'avancado',
    topic,
    title: 'Teste de Mesa: Uma Passada do Bubble Sort',
    summary: 'Acompanhe as comparações e trocas de uma passada de ordenação.',
    realWorldContext:
      'Algoritmos de ordenação são o exemplo clássico de teste de mesa em provas e entrevistas: o examinador quer ver o vetor mudando a cada comparação.',
    description:
      'Preencha uma linha a cada anotar(i, trocou, vetor). trocou é true ou false; o vetor pode ser escrito como [4, 2, 3, 1] (os espaços não importam).',
    goal: 'Registrar o vetor depois de cada comparação da primeira passada.',
    deskCheck: {
      code: `const vetor = [4, 2, 3, 1];
for (let i = 0; i < vetor.length - 1; i++) {
  let trocou = false;
  if (vetor[i] > vetor[i + 1]) {
    const aux = vetor[i];
    vetor[i] = vetor[i + 1];
    vetor[i + 1] = aux;
    trocou = true;
  }
  anotar(i, trocou, vetor);
}`,
      columns: ['i', 'trocou', 'vetor'],
    },
    hints: [
      'Em cada volta, compare as posições i e i + 1 do vetor COMO ELE ESTÁ AGORA (com as trocas anteriores).',
      'O 4 vai sendo empurrado para a direita a cada troca, até chegar ao fim.',
    ],
    explanation:
      'Uma passada leva o maior elemento (4) para o fim: [2, 4, 3, 1] → [2, 3, 4, 1] → [2, 3, 1, 4]. O vetor ainda não está ordenado — por isso o Bubble Sort repete passadas. O erro mais comum é comparar com o vetor original em vez do vetor já alterado.',
  }),

  testeDeMesa({
    id: 'logica-t12-mdc-de-euclides',
    difficulty: 'avancado',
    topic,
    title: 'Teste de Mesa: MDC de Euclides',
    summary: 'Calcule o máximo divisor comum de 48 e 18 pelo algoritmo de Euclides.',
    realWorldContext:
      'O algoritmo de Euclides tem mais de 2 mil anos e ainda é usado para simplificar frações e em criptografia. Ele é curto, mas só fica claro quando se acompanha a tabela.',
    description:
      'Preencha uma linha a cada anotar(a, b, resto), com os valores depois das atribuições de cada volta.',
    goal: 'Ver os pares (a, b) diminuírem até b chegar a 0.',
    deskCheck: {
      code: `let a = 48;
let b = 18;
while (b !== 0) {
  const resto = a % b;
  a = b;
  b = resto;
  anotar(a, b, resto);
}`,
      columns: ['a', 'b', 'resto'],
      givenRows: 0,
    },
    hints: [
      'Primeira volta: 48 % 18 = 12. Depois, a recebe 18 e b recebe 12.',
      'O laço para quando b vira 0; o MDC é o valor final de a.',
    ],
    explanation:
      'Os pares encolhem rápido: (18, 12), (12, 6), (6, 0). Quando b chega a 0, a = 6 é o MDC de 48 e 18. Este exercício vem sem linha de exemplo: montar a primeira linha sozinho é a parte mais importante de um teste de mesa.',
  }),
];
