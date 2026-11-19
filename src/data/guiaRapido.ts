import type {
  AnatomyLegendItem,
  AnatomySegment,
  QuickFunction,
  QuickGuideLanguage,
  QuickOperator,
  QuickSyntax,
} from '../types/reference';

/**
 * Conteúdo do Guia rápido (janela aberta com Ctrl / dentro dos exercícios): operadores,
 * precedência, sintaxe Portugol × PHP × JS × TS, funções prontas e "montar uma função".
 * Escrito do zero (os guias em PDF do material de apoio são comerciais). Protótipo aprovado
 * pelo usuário em 2026-11-19.
 */

export const QUICK_OPERATORS: QuickOperator[] = [
  { id: 'soma', name: 'Soma', jsts: '+', php: '+', portugol: '+', example: '7 + 2', result: '9' },
  { id: 'concat', name: 'Juntar textos', jsts: '+   ou   `Oi, ${nome}`', php: '.   ou   "Oi, $nome"', portugol: '+', example: "'2' + '3'", result: "JS: '23' · PHP: 5", pitfall: 'Em PHP o + soma números até em texto ("2" + "3" = 5). Para juntar textos, use o ponto: "2" . "3" = "23".' },
  { id: 'div', name: 'Divisão', jsts: '/', php: '/', portugol: '/', example: '7 / 2', result: '3.5' },
  { id: 'divint', name: 'Divisão inteira', jsts: 'Math.floor(a / b)', php: 'intdiv($a, $b)', portugol: '\\   ou   div', example: '7 dividido por 2', result: '3' },
  { id: 'resto', name: 'Resto da divisão', jsts: '%', php: '%', portugol: '%   ou   mod', example: '7 % 2', result: '1', pitfall: 'O resto mantém o sinal: -7 % 2 é -1. Para testar par, compare com 0 (n % 2 === 0), nunca com 1.' },
  { id: 'pot', name: 'Potência', jsts: '**', php: '**', portugol: '^', example: '2 ** 3', result: '8' },
  { id: 'igual', name: 'Igual (valor e tipo)', jsts: '===', php: '===', portugol: '=', example: '5 === 5', result: 'true', pitfall: '== converte tipos ("5" == 5 é true). Prefira === nas duas linguagens.' },
  { id: 'dif', name: 'Diferente', jsts: '!==', php: '!==', portugol: '<>', example: '5 !== 3', result: 'true' },
  { id: 'comp', name: 'Maior / menor', jsts: '>   >=   <   <=', php: '>   >=   <   <=', portugol: '>   >=   <   <=', example: '5 >= 5', result: 'true', pitfall: '1 <= n <= 10 não funciona: escreva n >= 1 && n <= 10.' },
  { id: 'e', name: 'E lógico', jsts: '&&', php: '&&', portugol: 'e', example: 'true && false', result: 'false' },
  { id: 'ou', name: 'OU lógico', jsts: '||', php: '||', portugol: 'ou', example: 'true || false', result: 'true' },
  { id: 'nao', name: 'NÃO lógico', jsts: '!', php: '!', portugol: 'nao', example: '!true', result: 'false' },
  { id: 'atrib', name: 'Atribuir', jsts: '=', php: '=', portugol: '<-', example: 'x = 5', result: 'x vale 5', pitfall: 'Não confunda = (guarda um valor) com === (compara).' },
  { id: 'inc', name: 'Somar e atribuir', jsts: '+=   ++', php: '+=   ++   .=', portugol: 'x <- x + 1', example: 'x += 2 (com x = 5)', result: 'x vale 7' },
  { id: 'nulo', name: 'Valor padrão se nulo', jsts: '??', php: '??', portugol: '—', example: 'nome ?? "anônimo"', result: '"anônimo"' },
];

export const QUICK_PRECEDENCE: { operators: string; name: string }[] = [
  { operators: '( )', name: 'parênteses' },
  { operators: '!  ++  --  -x', name: 'unários' },
  { operators: '**', name: 'potência' },
  { operators: '*  /  %', name: 'multiplicação, divisão, resto' },
  { operators: '+  -  .', name: 'soma e subtração (. junta texto no PHP)' },
  { operators: '<  <=  >  >=', name: 'comparação' },
  { operators: '===  !==  ==', name: 'igualdade' },
  { operators: '&&', name: 'E lógico' },
  { operators: '||', name: 'OU lógico' },
  { operators: '??', name: 'valor padrão' },
  { operators: '? :', name: 'ternário' },
  { operators: '=  +=  -=', name: 'atribuição (por último)' },
];

export const QUICK_PRECEDENCE_EXAMPLE = {
  expression: '2 + 3 * 4 > 10 && !false',
  steps: [
    { calc: '!false  →  true', why: 'unário vem antes' },
    { calc: '3 * 4  →  12', why: 'multiplicação antes da soma' },
    { calc: '2 + 12  →  14', why: 'soma' },
    { calc: '14 > 10  →  true', why: 'comparação' },
    { calc: 'true && true  →  true', why: 'E lógico por último' },
  ],
};

export const QUICK_SYNTAX: QuickSyntax[] = [
  { id: 'var', group: 'Variáveis e saída', name: 'Declarar variável', portugol: 'var idade: inteiro', php: '$idade = 0;', js: 'let idade = 0;', ts: 'let idade: number = 0;' },
  { id: 'const', group: 'Variáveis e saída', name: 'Constante', portugol: '—', php: 'const TAXA = 0.1;', js: 'const TAXA = 0.1;', ts: 'const TAXA: number = 0.1;' },
  { id: 'print', group: 'Variáveis e saída', name: 'Mostrar na tela', portugol: 'escreval("Oi")', php: 'echo "Oi";', js: 'console.log("Oi");', ts: 'console.log("Oi");' },
  { id: 'if', group: 'Condicionais', name: 'Se / senão', portugol: 'se x > 0 entao ... senao ... fimse', php: 'if ($x > 0) { ... } else { ... }', js: 'if (x > 0) { ... } else { ... }', ts: 'if (x > 0) { ... } else { ... }' },
  { id: 'elseif', group: 'Condicionais', name: 'Senão se', portugol: 'senao se x < 0 entao', php: 'elseif ($x < 0) { ... }', js: 'else if (x < 0) { ... }', ts: 'else if (x < 0) { ... }', pitfall: 'Em PHP é elseif, junto. Em JS/TS são duas palavras: else if.' },
  { id: 'ternario', group: 'Condicionais', name: 'Se numa linha (ternário)', portugol: '—', php: "$n % 2 === 0 ? 'par' : 'ímpar'", js: "n % 2 === 0 ? 'par' : 'ímpar'", ts: "n % 2 === 0 ? 'par' : 'ímpar'" },
  { id: 'escolha', group: 'Condicionais', name: 'Escolha / caso', portugol: 'escolha dia caso 1 ... fimescolha', php: "match ($dia) { 1 => 'dom', default => '?' }", js: 'switch (dia) { case 1: ...; break; }', ts: 'switch (dia) { case 1: ...; break; }', pitfall: 'No switch, esquecer o break faz cair no caso seguinte.' },
  { id: 'para', group: 'Laços', name: 'Para (contado)', portugol: 'para i de 1 ate 10 faca', php: 'for ($i = 1; $i <= 10; $i++) { ... }', js: 'for (let i = 1; i <= 10; i++) { ... }', ts: 'for (let i = 1; i <= 10; i++) { ... }' },
  { id: 'cada', group: 'Laços', name: 'Percorrer um vetor', portugol: 'para i de 1 ate 5 faca ... v[i]', php: 'foreach ($v as $item) { ... }', js: 'for (const item of v) { ... }', ts: 'for (const item of v) { ... }', pitfall: 'for...in percorre os ÍNDICES em JS; para os valores, use for...of.' },
  { id: 'enquanto', group: 'Laços', name: 'Enquanto', portugol: 'enquanto x > 0 faca', php: 'while ($x > 0) { ... }', js: 'while (x > 0) { ... }', ts: 'while (x > 0) { ... }' },
  { id: 'repita', group: 'Laços', name: 'Repita até', portugol: 'repita ... ate x = 0', php: 'do { ... } while ($x !== 0);', js: 'do { ... } while (x !== 0);', ts: 'do { ... } while (x !== 0);' },
  { id: 'vetor', group: 'Estruturas', name: 'Vetor (lista)', portugol: 'v: vetor[1..5] de inteiro', php: '$v = [1, 2, 3];', js: 'const v = [1, 2, 3];', ts: 'const v: number[] = [1, 2, 3];', pitfall: 'Portugol começa em v[1]; PHP e JS/TS começam em v[0].' },
  { id: 'obj', group: 'Estruturas', name: 'Registro (chave: valor)', portugol: '—', php: "$p = ['nome' => 'Ana', 'idade' => 20];", js: "const p = { nome: 'Ana', idade: 20 };", ts: "const p: { nome: string; idade: number } = { nome: 'Ana', idade: 20 };" },
  { id: 'func', group: 'Funções', name: 'Declarar e retornar', portugol: 'funcao dobro(n: inteiro): inteiro ... retorne n * 2 ... fimfuncao', php: 'function dobro(int $n): int { return $n * 2; }', js: 'function dobro(n) { return n * 2; }', ts: 'function dobro(n: number): number { return n * 2; }', pitfall: 'Esqueceu o return? A função devolve undefined (JS/TS) ou null (PHP) — o erro mais comum ao montar funções.' },
  { id: 'chamar', group: 'Funções', name: 'Chamar e guardar o resultado', portugol: 'resultado <- dobro(21)', php: '$resultado = dobro(21);', js: 'const resultado = dobro(21);', ts: 'const resultado: number = dobro(21);' },
  { id: 'padrao', group: 'Funções', name: 'Parâmetro com valor padrão', portugol: '—', php: "function saudar(string $nome = 'aluno'): string", js: "function saudar(nome = 'aluno')", ts: "function saudar(nome: string = 'aluno'): string", pitfall: 'Parâmetros com valor padrão vão por último na lista.' },
  { id: 'opcional', group: 'Funções', name: 'Parâmetro opcional', portugol: '—', php: 'function f(?int $n = null): int', js: 'function f(n) { /* n é undefined se faltar */ }', ts: 'function f(n?: number): number' },
  { id: 'void', group: 'Funções', name: 'Sem retorno (só faz algo)', portugol: 'procedimento mostrar(t: caractere) ... fimprocedimento', php: 'function mostrar(string $t): void { echo $t; }', js: 'function mostrar(t) { console.log(t); }', ts: 'function mostrar(t: string): void { console.log(t); }' },
  { id: 'varios', group: 'Funções', name: 'Devolver vários valores', portugol: '—', php: 'return [$min, $max];   [$min, $max] = extremos($v);', js: 'return { min, max };   const { min, max } = extremos(v);', ts: 'function extremos(v: number[]): { min: number; max: number }', pitfall: 'Uma função tem um só return: para devolver vários valores, junte-os num vetor ou objeto.' },
  { id: 'arrow', group: 'Funções', name: 'Função curta (arrow)', portugol: '—', php: 'fn($n) => $n * 2', js: '(n) => n * 2', ts: '(n: number): number => n * 2' },
  { id: 'callback', group: 'Funções', name: 'Função como argumento', portugol: '—', php: 'array_map(fn($x) => $x * 2, $v)', js: 'v.map((x) => x * 2)', ts: 'v.map((x: number) => x * 2)' },
  { id: 'tiporet', group: 'Funções', name: 'Retorno com opções fixas', portugol: '—', php: 'function f(int $n): string', js: '(sem tipo: documente no nome)', ts: "function f(n: number): 'par' | 'ímpar'" },
];

export const QUICK_FUNCTIONS: QuickFunction[] = [
  { id: 'len', group: 'Textos', name: 'Tamanho do texto', php: 'strlen($s)', jsts: 's.length', pitfall: 'Com acentos em PHP, use mb_strlen($s): strlen conta bytes ("é" vale 2).' },
  { id: 'upper', group: 'Textos', name: 'Maiúsculas / minúsculas', php: 'strtoupper($s)   strtolower($s)', jsts: 's.toUpperCase()   s.toLowerCase()' },
  { id: 'contem', group: 'Textos', name: 'Contém um trecho?', php: "str_contains($s, 'ab')", jsts: "s.includes('ab')" },
  { id: 'posTexto', group: 'Textos', name: 'Posição de um trecho', php: "strpos($s, 'a')", jsts: "s.indexOf('a')", pitfall: 'Se não achar: PHP devolve false, JS devolve -1. Em PHP, compare com === false (a posição 0 também é "falsa").' },
  { id: 'recortar', group: 'Textos', name: 'Recortar', php: 'substr($s, 0, 3)', jsts: 's.slice(0, 3)' },
  { id: 'trocar', group: 'Textos', name: 'Trocar trecho', php: "str_replace('a', 'b', $s)", jsts: "s.replaceAll('a', 'b')" },
  { id: 'dividir', group: 'Textos', name: 'Dividir em lista', php: "explode(',', $s)", jsts: "s.split(',')" },
  { id: 'juntar', group: 'Textos', name: 'Juntar lista em texto', php: "implode(', ', $v)", jsts: "v.join(', ')" },
  { id: 'trim', group: 'Textos', name: 'Tirar espaços das pontas', php: 'trim($s)', jsts: 's.trim()' },
  { id: 'count', group: 'Vetores', name: 'Tamanho do vetor', php: 'count($v)', jsts: 'v.length' },
  { id: 'push', group: 'Vetores', name: 'Adicionar no fim', php: '$v[] = 4;   array_push($v, 4);', jsts: 'v.push(4);' },
  { id: 'pop', group: 'Vetores', name: 'Remover do fim', php: 'array_pop($v)', jsts: 'v.pop()' },
  { id: 'inarr', group: 'Vetores', name: 'Contém um valor?', php: 'in_array(4, $v)', jsts: 'v.includes(4)' },
  { id: 'posVetor', group: 'Vetores', name: 'Posição de um valor', php: 'array_search(4, $v)', jsts: 'v.indexOf(4)', pitfall: 'Se não achar: PHP devolve false, JS devolve -1.' },
  { id: 'sort', group: 'Vetores', name: 'Ordenar números', php: 'sort($v);', jsts: 'v.sort((a, b) => a - b);', pitfall: 'Em JS, v.sort() sem função ordena como texto: [10, 9, 1] vira [1, 10, 9]. Nas duas linguagens, sort altera o próprio vetor.' },
  { id: 'filter', group: 'Vetores', name: 'Filtrar', php: 'array_filter($v, fn($x) => $x > 0)', jsts: 'v.filter((x) => x > 0)' },
  { id: 'map', group: 'Vetores', name: 'Transformar cada item', php: 'array_map(fn($x) => $x * 2, $v)', jsts: 'v.map((x) => x * 2)', pitfall: 'A ordem dos argumentos é diferente: em PHP a função vem primeiro.' },
  { id: 'sum', group: 'Vetores', name: 'Somar todos', php: 'array_sum($v)', jsts: 'v.reduce((s, x) => s + x, 0)' },
  { id: 'max', group: 'Vetores', name: 'Maior / menor', php: 'max($v)   min($v)', jsts: 'Math.max(...v)   Math.min(...v)' },
  { id: 'round', group: 'Números', name: 'Arredondar', php: 'round($n, 2)', jsts: 'Math.round(n)   n.toFixed(2)', pitfall: 'toFixed devolve TEXTO ("3.14"), não número.' },
  { id: 'floor', group: 'Números', name: 'Parte inteira', php: 'floor($n)   intdiv($a, $b)', jsts: 'Math.floor(n)   Math.trunc(n)' },
  { id: 'abs', group: 'Números', name: 'Valor absoluto', php: 'abs($n)', jsts: 'Math.abs(n)' },
  { id: 'rand', group: 'Números', name: 'Sorteio de 1 a 6', php: 'random_int(1, 6)', jsts: 'Math.floor(Math.random() * 6) + 1' },
  { id: 'num', group: 'Números', name: 'Texto para número', php: '(int) $s   (float) $s', jsts: 'Number(s)   parseInt(s, 10)' },
];

/** "Montar uma função": o mesmo exemplo em cada linguagem, com as partes numeradas (1–7). */
export const FUNCTION_ANATOMY: Record<QuickGuideLanguage, AnatomySegment[][]> = {
  php: [
    [{ text: 'function ', part: 1 }, { text: 'calcularMedia', part: 2 }, { text: '(float $a, float $b)', part: 3 }, { text: ': float', part: 4 }, { text: ' {' }],
    [{ text: '    $media = ($a + $b) / 2;', part: 5 }],
    [{ text: '    return $media;', part: 6 }],
    [{ text: '}' }],
    [],
    [{ text: '$nota = calcularMedia(7, 8.5);', part: 7 }, { text: '  // 7.75' }],
  ],
  js: [
    [{ text: 'function ', part: 1 }, { text: 'calcularMedia', part: 2 }, { text: '(a, b)', part: 3 }, { text: ' {' }],
    [{ text: '  const media = (a + b) / 2;', part: 5 }],
    [{ text: '  return media;', part: 6 }],
    [{ text: '}' }],
    [],
    [{ text: 'const nota = calcularMedia(7, 8.5);', part: 7 }, { text: '  // 7.75' }],
  ],
  ts: [
    [{ text: 'function ', part: 1 }, { text: 'calcularMedia', part: 2 }, { text: '(a: number, b: number)', part: 3 }, { text: ': number', part: 4 }, { text: ' {' }],
    [{ text: '  const media = (a + b) / 2;', part: 5 }],
    [{ text: '  return media;', part: 6 }],
    [{ text: '}' }],
    [],
    [{ text: 'const nota = calcularMedia(7, 8.5);', part: 7 }, { text: '  // 7.75' }],
  ],
};

export function anatomyLegend(language: QuickGuideLanguage): AnatomyLegendItem[] {
  return [
    { part: 1, name: 'Palavra-chave', description: 'avisa que é uma função' },
    { part: 2, name: 'Nome', description: 'um verbo: o que ela faz' },
    { part: 3, name: 'Parâmetros', description: language === 'js' ? 'o que ENTRA' : 'o que ENTRA, com tipo' },
    { part: 4, name: 'Tipo de retorno', description: language === 'js' ? 'JS não declara (o TS sim)' : 'o que SAI' },
    { part: 5, name: 'Corpo', description: 'a conta ou regra' },
    { part: 6, name: 'return', description: 'devolve e encerra' },
    { part: 7, name: 'Chamada', description: 'usar e guardar o resultado' },
  ];
}

export const FUNCTION_QUESTIONS: { question: string; answer: string }[] = [
  { question: 'O que entra?', answer: 'Vira os parâmetros (3).' },
  { question: 'O que sai?', answer: 'Vira o tipo de retorno (4) e o return (6).' },
  { question: 'Que verbo descreve?', answer: 'Vira o nome (2): calcularMedia, ehPar, contarVogais.' },
  { question: 'Qual a regra?', answer: 'Vira o corpo (5). Em todo caminho do if precisa ter return.' },
  { question: 'Funciona?', answer: 'Chame com um valor que você sabe a resposta (7).' },
];

/**
 * Atalhos de busca "Neste exercício", a partir do tópico do exercício (texto livre do catálogo).
 * Cada par é [rótulo do botão, termo buscado].
 */
export function quickGuideSuggestions(topic: string): [string, string][] {
  const t = topic.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  if (/condicion|decis|if/.test(t)) return [['senão se', 'senao se'], ['%', 'resto'], ['===', 'igual'], ['ternário', 'ternario']];
  if (/repeti|laco|loop/.test(t)) return [['para', 'para'], ['enquanto', 'enquanto'], ['percorrer', 'percorrer'], ['%', 'resto']];
  if (/vetor|array|matriz|lista/.test(t)) return [['tamanho', 'tamanho'], ['adicionar', 'adicionar'], ['percorrer', 'percorrer'], ['ordenar', 'ordenar']];
  if (/string|texto|caracter/.test(t)) return [['tamanho', 'tamanho do texto'], ['dividir', 'dividir'], ['trocar', 'trocar'], ['contém', 'contem']];
  if (/funca|funco/.test(t)) return [['função', 'funcao'], ['return', 'return'], ['padrão', 'padrao'], ['vários valores', 'varios']];
  return [['função', 'funcao'], ['senão se', 'senao se'], ['%', 'resto'], ['tamanho', 'tamanho']];
}
