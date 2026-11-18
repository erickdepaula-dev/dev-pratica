import type { DeskCheckGuideStep, EquivalenceRow, OperatorGroup } from '../types/reference';

/**
 * Material de referência da trilha de Lógica, escrito do zero (os guias em PDF do material de
 * apoio são comerciais). Usado pelo StudyGuide e pela consulta rápida dentro do workspace.
 */

export const OPERATOR_GROUPS: OperatorGroup[] = [
  {
    title: 'Aritméticos',
    rows: [
      { operator: '+', portugol: '+', meaning: 'Soma (e concatenação de textos)', example: '7 + 2', result: '9' },
      { operator: '-', portugol: '-', meaning: 'Subtração', example: '7 - 2', result: '5' },
      { operator: '*', portugol: '*', meaning: 'Multiplicação', example: '7 * 2', result: '14' },
      { operator: '/', portugol: '/', meaning: 'Divisão (sempre com decimais)', example: '7 / 2', result: '3.5' },
      { operator: 'Math.floor(a / b)', portugol: '\\ ou div', meaning: 'Divisão inteira', example: 'Math.floor(7 / 2)', result: '3' },
      { operator: '%', portugol: '% ou mod', meaning: 'Resto da divisão', example: '7 % 2', result: '1' },
      { operator: '**', portugol: '^', meaning: 'Potência', example: '2 ** 3', result: '8' },
    ],
    note: 'O resto mantém o sinal do primeiro número: -7 % 2 é -1. Para testar par, use n % 2 === 0.',
  },
  {
    title: 'Relacionais (comparação)',
    rows: [
      { operator: '===', portugol: '=', meaning: 'Igual (valor e tipo)', example: '5 === 5', result: 'true' },
      { operator: '!==', portugol: '<>', meaning: 'Diferente', example: '5 !== 3', result: 'true' },
      { operator: '>', portugol: '>', meaning: 'Maior que', example: '5 > 5', result: 'false' },
      { operator: '>=', portugol: '>=', meaning: 'Maior ou igual', example: '5 >= 5', result: 'true' },
      { operator: '<', portugol: '<', meaning: 'Menor que', example: '3 < 5', result: 'true' },
      { operator: '<=', portugol: '<=', meaning: 'Menor ou igual', example: '6 <= 5', result: 'false' },
    ],
    note: 'Prefira === a ==: o == converte tipos ("5" == 5 é true). E 1 <= n <= 10 não funciona: use n >= 1 && n <= 10.',
  },
  {
    title: 'Lógicos',
    rows: [
      { operator: '&&', portugol: 'e', meaning: 'E: verdadeiro se os dois forem', example: 'true && false', result: 'false' },
      { operator: '||', portugol: 'ou', meaning: 'OU: verdadeiro se um deles for', example: 'true || false', result: 'true' },
      { operator: '!', portugol: 'nao', meaning: 'NÃO: inverte', example: '!true', result: 'false' },
    ],
    note: '&& e || param assim que sabem a resposta: em false && f(), f() nem é chamada.',
  },
  {
    title: 'Atribuição',
    rows: [
      { operator: '=', portugol: '<-', meaning: 'Atribui um valor', example: 'x = 5', result: 'x vale 5' },
      { operator: '+=', portugol: 'x <- x + 2', meaning: 'Soma e atribui', example: 'x += 2', result: 'x vale 7' },
      { operator: '-=', portugol: 'x <- x - 2', meaning: 'Subtrai e atribui', example: 'x -= 2', result: 'x vale 3' },
      { operator: '*=', portugol: 'x <- x * 2', meaning: 'Multiplica e atribui', example: 'x *= 2', result: 'x vale 10' },
      { operator: '++ / --', portugol: 'x <- x + 1', meaning: 'Soma ou subtrai 1', example: 'x++', result: 'x vale 6' },
    ],
    note: 'Os exemplos partem de x = 5. Não confunda = (atribui) com === (compara).',
  },
];

/** Precedência, da maior para a menor (o que é avaliado primeiro). */
export const OPERATOR_PRECEDENCE: string[] = [
  '( ) parênteses',
  '! e - (sinal)',
  '**',
  '* / %',
  '+ -',
  '< <= > >=',
  '=== !==',
  '&&',
  '||',
  '= += -= (atribuição, por último)',
];

export const LANGUAGE_EQUIVALENCE: EquivalenceRow[] = [
  { concept: 'Declarar variável', portugol: 'var idade: inteiro', python: 'idade = 0', javascript: 'let idade = 0;' },
  { concept: 'Constante', portugol: '—', python: 'TAXA = 0.1  # por convenção', javascript: 'const TAXA = 0.1;' },
  { concept: 'Atribuir', portugol: 'idade <- 18', python: 'idade = 18', javascript: 'idade = 18;' },
  { concept: 'Mostrar na tela', portugol: 'escreval("Oi")', python: 'print("Oi")', javascript: 'console.log("Oi");' },
  { concept: 'Ler do teclado', portugol: 'leia(idade)', python: 'idade = int(input())', javascript: 'aqui: parâmetro da função' },
  { concept: 'Se / senão', portugol: 'se x > 0 entao ... senao ... fimse', python: 'if x > 0:\n    ...\nelse:\n    ...', javascript: 'if (x > 0) { ... } else { ... }' },
  { concept: 'Senão se', portugol: 'senao se ... entao', python: 'elif x < 0:', javascript: 'else if (x < 0) { ... }' },
  { concept: 'Escolha / caso', portugol: 'escolha dia caso 1 ... fimescolha', python: 'match dia:\n    case 1: ...', javascript: 'switch (dia) { case 1: ... break; }' },
  { concept: 'Para (contado)', portugol: 'para i de 1 ate 10 faca ... fimpara', python: 'for i in range(1, 11):', javascript: 'for (let i = 1; i <= 10; i++) { ... }' },
  { concept: 'Enquanto', portugol: 'enquanto x > 0 faca ... fimenquanto', python: 'while x > 0:', javascript: 'while (x > 0) { ... }' },
  { concept: 'Repita até', portugol: 'repita ... ate x = 0', python: 'while True: ... if x == 0: break', javascript: 'do { ... } while (x !== 0);' },
  { concept: 'Vetor', portugol: 'v: vetor[1..5] de inteiro', python: 'v = [0] * 5', javascript: 'const v = [0, 0, 0, 0, 0];' },
  { concept: 'Primeira posição', portugol: 'v[1]', python: 'v[0]', javascript: 'v[0]' },
  { concept: 'Tamanho', portugol: '(fixo na declaração)', python: 'len(v)', javascript: 'v.length' },
  { concept: 'Função', portugol: 'funcao dobro(n: inteiro): inteiro ... retorne n * 2', python: 'def dobro(n):\n    return n * 2', javascript: 'function dobro(n) { return n * 2; }' },
  { concept: 'Verdadeiro / falso', portugol: 'verdadeiro / falso', python: 'True / False', javascript: 'true / false' },
];

export const DESK_CHECK_GUIDE: DeskCheckGuideStep[] = [
  {
    title: '1. Uma coluna por variável',
    text: 'Desenhe uma tabela com uma coluna para cada variável que muda (e para condições importantes, como "trocou?"). Na plataforma, as colunas já vêm prontas.',
  },
  {
    title: '2. Comece pelos valores iniciais',
    text: 'Antes de qualquer laço, anote o valor de cada variável. Muitos erros estão aqui: um acumulador de produto que começa em 0, um "maior" que começa em 0 com números negativos.',
  },
  {
    title: '3. Uma instrução por vez',
    text: 'Execute linha a linha, como o computador. Só a variável à esquerda do = muda; as outras mantêm o valor da linha anterior. Não pule etapas "de cabeça".',
  },
  {
    title: '4. Teste a condição antes de cada volta',
    text: 'No for e no while, a condição é conferida antes de entrar na volta. Quando ela fica falsa, o laço para — e nada dentro dele roda de novo.',
  },
  {
    title: '5. Registre no momento certo',
    text: 'Anote uma linha sempre no mesmo ponto do código (aqui, a cada anotar(...)). Registrar antes ou depois de uma atualização muda a tabela inteira.',
  },
  {
    title: '6. Confira o resultado com o enunciado',
    text: 'Na última linha, as variáveis devem conter a resposta esperada. Se não contiverem, a primeira linha "estranha" da tabela aponta onde o algoritmo erra.',
  },
];
