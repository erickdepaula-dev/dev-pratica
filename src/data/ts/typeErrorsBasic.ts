import { TsExercise } from '../../types/exercise';
import { erroDeTipo } from './typeErrorFactory';

/**
 * Trilha TypeScript — 'prever_erro_de_tipo', nível básico (10 exercícios).
 * Cada trecho tem exatamente um erro; linha e código são conferidos por `npm run check:ts`.
 */
export const tsBasicTypeErrors: TsExercise<'basico'>[] = [
  erroDeTipo({
    id: 'ts-basico-erro-string-em-number',
    difficulty: 'basico',
    topic: 'Tipos Primitivos',
    title: 'Erro de Tipo: Texto em uma Variável Numérica',
    summary: 'Uma variável anotada como number recebe um texto.',
    realWorldContext: 'Idades e quantidades vindas de inputs chegam como texto. Atribuí-las direto a um number é o erro mais comum de quem começa com TypeScript.',
    code: `let idade: number = 30;
console.log('Idade atual:', idade);

idade = '31';
console.log('Nova idade:', idade);
`,
    fixedCode: `let idade: number = 30;
console.log('Idade atual:', idade);

idade = 31;
console.log('Nova idade:', idade);
`,
    challenge: {
      errorLine: 4,
      errorCode: 2322,
      reasonOptions: [
        'Variáveis declaradas com let não podem ser reatribuídas.',
        'idade é do tipo number, e \'31\' é uma string.',
        'console.log não aceita dois argumentos.',
        'O tipo number não aceita valores maiores que o inicial.',
      ],
      correctReason: 1,
    },
    hints: ['Procure uma atribuição em que o valor não combina com a anotação.', 'Aspas transformam o valor em string.'],
    explanation: 'TS2322: Type \'string\' is not assignable to type \'number\'. let permite reatribuir, mas sempre com valores do tipo declarado.',
  }),
  erroDeTipo({
    id: 'ts-basico-erro-propriedade-faltando',
    difficulty: 'basico',
    topic: 'Interfaces & Propriedades Opcionais',
    title: 'Erro de Tipo: Objeto Incompleto',
    summary: 'Um objeto anotado com uma interface não tem uma propriedade obrigatória.',
    realWorldContext: 'Criar entidades sem um campo obrigatório (como o preço de um produto) quebra telas e relatórios lá na frente.',
    code: `interface Produto {
  nome: string;
  preco: number;
}

const caderno: Produto = { nome: 'Caderno' };
console.log(caderno.nome);
`,
    fixedCode: `interface Produto {
  nome: string;
  preco: number;
}

const caderno: Produto = { nome: 'Caderno', preco: 24.9 };
console.log(caderno.nome);
`,
    challenge: {
      errorLine: 6,
      errorCode: 2741,
      reasonOptions: [
        'A interface Produto não foi exportada.',
        'nome deveria ser number.',
        'Falta a propriedade obrigatória preco no objeto.',
        'Objetos não podem ser anotados com interfaces, só com type.',
      ],
      correctReason: 2,
    },
    hints: ['Compare as propriedades da interface com as do objeto.', 'Propriedades sem "?" são obrigatórias.'],
    explanation: 'TS2741: Property \'preco\' is missing. Toda propriedade sem "?" na interface precisa estar presente no objeto.',
  }),
  erroDeTipo({
    id: 'ts-basico-erro-propriedade-a-mais',
    difficulty: 'basico',
    topic: 'Interfaces & Propriedades Opcionais',
    title: 'Erro de Tipo: Propriedade Digitada Errado',
    summary: 'Um objeto literal tem uma propriedade que a interface não declara.',
    realWorldContext: 'Erros de digitação em nomes de campo ("emial") fazem o dado sumir silenciosamente em JavaScript. Em TypeScript, objetos literais são checados contra o tipo.',
    code: `interface Contato {
  nome: string;
  email?: string;
}

const contato: Contato = {
  nome: 'Paula',
  emial: 'paula@exemplo.com',
};
console.log(contato.nome);
`,
    fixedCode: `interface Contato {
  nome: string;
  email?: string;
}

const contato: Contato = {
  nome: 'Paula',
  email: 'paula@exemplo.com',
};
console.log(contato.nome);
`,
    challenge: {
      errorLine: 8,
      errorCode: 2561,
      reasonOptions: [
        'emial não existe em Contato: objetos literais só podem ter propriedades conhecidas.',
        'email é opcional, então não pode ser preenchido.',
        'Falta a propriedade obrigatória email.',
        'Strings com @ precisam ser escapadas.',
      ],
      correctReason: 0,
    },
    hints: ['Leia o nome de cada propriedade do objeto com atenção.', 'Como email é opcional, faltar email não é erro.'],
    explanation: 'TS2561: Object literal may only specify known properties, but \'emial\' does not exist in type \'Contato\'. Did you mean to write \'email\'? Em objetos literais, o TypeScript recusa propriedades que o tipo não declara (excess property check) — e, quando o nome é parecido com um existente, ainda sugere a correção.',
  }),
  erroDeTipo({
    id: 'ts-basico-erro-quantidade-de-argumentos',
    difficulty: 'basico',
    topic: 'Funções Tipadas',
    title: 'Erro de Tipo: Argumento Faltando na Chamada',
    summary: 'Uma função é chamada com menos argumentos do que exige.',
    realWorldContext: 'Em JavaScript, um argumento esquecido vira undefined e o cálculo resulta em NaN. TypeScript confere a quantidade de argumentos.',
    code: `function calcularDesconto(preco: number, percentual: number): number {
  return preco * (percentual / 100);
}

const desconto = calcularDesconto(200);
console.log(desconto);
`,
    fixedCode: `function calcularDesconto(preco: number, percentual: number): number {
  return preco * (percentual / 100);
}

const desconto = calcularDesconto(200, 10);
console.log(desconto);
`,
    challenge: {
      errorLine: 5,
      errorCode: 2554,
      reasonOptions: [
        'O retorno de calcularDesconto deveria ser string.',
        'A função foi chamada com 1 argumento, mas exige 2.',
        'const não pode receber o retorno de uma função.',
        'percentual / 100 pode dar divisão por zero.',
      ],
      correctReason: 1,
    },
    hints: ['Conte os parâmetros da função e os argumentos da chamada.', 'Parâmetros sem "?" e sem valor padrão são obrigatórios.'],
    explanation: 'TS2554: Expected 2 arguments, but got 1. Para tornar o segundo parâmetro opcional, seria preciso "percentual?: number" ou um valor padrão.',
  }),
  erroDeTipo({
    id: 'ts-basico-erro-propriedade-inexistente',
    difficulty: 'basico',
    topic: 'Interfaces & Propriedades Opcionais',
    title: 'Erro de Tipo: Lendo um Campo que Não Existe',
    summary: 'O código lê uma propriedade que a interface não declara.',
    realWorldContext: 'Supor que um objeto tem um campo (como "idade") sem que o tipo diga isso é a origem de muitos "undefined" na tela.',
    code: `interface Aluno {
  nome: string;
  matricula: string;
}

const aluno: Aluno = { nome: 'Rafa', matricula: '2026-001' };
console.log(aluno.nome, aluno.idade);
`,
    fixedCode: `interface Aluno {
  nome: string;
  matricula: string;
}

const aluno: Aluno = { nome: 'Rafa', matricula: '2026-001' };
console.log(aluno.nome, aluno.matricula);
`,
    challenge: {
      errorLine: 7,
      errorCode: 2339,
      reasonOptions: [
        'matricula deveria ser number.',
        'console.log não aceita propriedades de objetos.',
        'A propriedade idade não existe no tipo Aluno.',
        'aluno deveria ser declarado com let.',
      ],
      correctReason: 2,
    },
    hints: ['Quais propriedades a interface Aluno declara?', 'O erro está no acesso, não na criação do objeto.'],
    explanation: 'TS2339: Property \'idade\' does not exist on type \'Aluno\'. O TypeScript só permite acessar o que o tipo declara.',
  }),
  erroDeTipo({
    id: 'ts-basico-erro-opcional-sem-checar',
    difficulty: 'basico',
    topic: 'Parâmetros Opcionais & Padrão',
    title: 'Erro de Tipo: Usando um Parâmetro Opcional sem Checar',
    summary: 'Um método é chamado em um parâmetro que pode ser undefined.',
    realWorldContext: '"Cannot read properties of undefined" em produção costuma vir de um valor opcional usado sem checagem — o strict mode antecipa isso.',
    code: `function saudacao(nome: string, sobrenome?: string): string {
  const inicial = sobrenome.charAt(0);
  return nome + ' ' + inicial + '.';
}

console.log(saudacao('Ana', 'Lima'));
`,
    fixedCode: `function saudacao(nome: string, sobrenome?: string): string {
  const inicial = sobrenome ? sobrenome.charAt(0) + '.' : '';
  return (nome + ' ' + inicial).trim();
}

console.log(saudacao('Ana', 'Lima'));
`,
    challenge: {
      errorLine: 2,
      errorCode: 18048,
      reasonOptions: [
        'sobrenome é opcional, então pode ser undefined.',
        'charAt não existe em strings.',
        'Parâmetros opcionais precisam vir antes dos obrigatórios.',
        'O retorno deveria ser void.',
      ],
      correctReason: 0,
    },
    hints: ['Qual é o tipo de sobrenome dentro da função?', 'string | undefined não tem charAt garantido.'],
    explanation: 'TS18048: \'sobrenome\' is possibly \'undefined\'. Com strict, parâmetros opcionais precisam ser checados (if, ?? ou ?.) antes do uso.',
  }),
  erroDeTipo({
    id: 'ts-basico-erro-literal-maiusculo',
    difficulty: 'basico',
    topic: 'Union & Literal Types',
    title: 'Erro de Tipo: Literal com Letra Maiúscula',
    summary: 'Um valor não pertence à união de literais por causa de maiúsculas.',
    realWorldContext: 'Status gravados como "Cancelado" e "cancelado" viram dois estados diferentes no banco. Literais são comparados letra por letra.',
    code: `type StatusPedido = 'aberto' | 'pago' | 'cancelado';

function cancelar(): StatusPedido {
  console.log('Cancelando pedido...');
  return 'Cancelado';
}

console.log(cancelar());
`,
    fixedCode: `type StatusPedido = 'aberto' | 'pago' | 'cancelado';

function cancelar(): StatusPedido {
  console.log('Cancelando pedido...');
  return 'cancelado';
}

console.log(cancelar());
`,
    challenge: {
      errorLine: 5,
      errorCode: 2820,
      reasonOptions: [
        'Funções não podem retornar uniões de literais.',
        'Falta o parâmetro com o id do pedido.',
        'console.log dentro da função altera o tipo de retorno.',
        '\'Cancelado\' (com C maiúsculo) não é um dos literais de StatusPedido.',
      ],
      correctReason: 3,
    },
    hints: ['Compare o texto retornado com os literais da união.', 'Literais diferenciam maiúsculas de minúsculas.'],
    explanation: 'TS2820: Type \'"Cancelado"\' is not assignable to type \'StatusPedido\'. Did you mean \'"cancelado"\'? Literal types são comparados exatamente; quando o valor é parecido com um membro da união, o compilador sugere qual.',
  }),
  erroDeTipo({
    id: 'ts-basico-erro-tupla-tamanho',
    difficulty: 'basico',
    topic: 'Tuplas',
    title: 'Erro de Tipo: Tupla com Elementos Demais',
    summary: 'Uma tupla de duas posições recebe três valores.',
    realWorldContext: 'Coordenadas [latitude, longitude] com um terceiro valor indicam um dado errado (talvez altitude) que quebraria o mapa.',
    code: `type Coordenada = [number, number];

const escritorio: Coordenada = [-3.7319, -38.5267, 21];
const [lat, lng] = escritorio;
console.log(lat, lng);
`,
    fixedCode: `type Coordenada = [number, number];

const escritorio: Coordenada = [-3.7319, -38.5267];
const [lat, lng] = escritorio;
console.log(lat, lng);
`,
    challenge: {
      errorLine: 3,
      errorCode: 2322,
      reasonOptions: [
        'Números negativos não são aceitos em number.',
        'A tupla Coordenada tem 2 posições, e o valor tem 3 elementos.',
        'A desestruturação precisa de 3 variáveis.',
        'Tuplas só podem conter strings.',
      ],
      correctReason: 1,
    },
    hints: ['Quantas posições Coordenada declara?', 'Diferente de number[], uma tupla tem tamanho fixo.'],
    explanation: 'TS2322: Source has 3 element(s) but target allows only 2. O tamanho faz parte do tipo da tupla.',
  }),
  erroDeTipo({
    id: 'ts-basico-erro-const-reatribuida',
    difficulty: 'basico',
    topic: 'Inferência & Literal Types',
    title: 'Erro de Tipo: Reatribuindo uma Constante',
    summary: 'Uma variável declarada com const recebe um novo valor.',
    realWorldContext: 'Usar const por padrão deixa claro o que nunca muda. Tentar reatribuir é um sinal de que a variável deveria ser let — ou de um bug.',
    code: `const itens = [10, 20, 30];
const total = 0;

for (const valor of itens) {
  total = total + valor;
}

console.log(total);
`,
    fixedCode: `const itens = [10, 20, 30];
let total = 0;

for (const valor of itens) {
  total = total + valor;
}

console.log(total);
`,
    challenge: {
      errorLine: 5,
      errorCode: 2588,
      reasonOptions: [
        'total foi declarado com const e não pode ser reatribuído.',
        'for...of não funciona com arrays de números.',
        'valor deveria ser declarado com let.',
        'O tipo de total é string.',
      ],
      correctReason: 0,
    },
    hints: ['Qual variável recebe um novo valor dentro do laço?', 'Repare em como ela foi declarada.'],
    explanation: 'TS2588: Cannot assign to \'total\' because it is a constant. O "const valor" do laço está certo: cada volta cria uma nova variável.',
  }),
  erroDeTipo({
    id: 'ts-basico-erro-retorno-incompativel',
    difficulty: 'basico',
    topic: 'Funções Tipadas',
    title: 'Erro de Tipo: Retorno Diferente do Declarado',
    summary: 'A função promete devolver string, mas devolve um número.',
    realWorldContext: 'Uma função de formatação que às vezes devolve o número cru faz a tela exibir "1500" em vez de "R$ 1.500,00".',
    code: `function formatarPreco(valor: number): string {
  if (valor === 0) {
    return 'Grátis';
  }
  return valor * 1;
}

console.log(formatarPreco(1500));
`,
    fixedCode: `function formatarPreco(valor: number): string {
  if (valor === 0) {
    return 'Grátis';
  }
  return 'R$ ' + valor.toFixed(2);
}

console.log(formatarPreco(1500));
`,
    challenge: {
      errorLine: 5,
      errorCode: 2322,
      reasonOptions: [
        'O primeiro return deveria ser um número.',
        'Funções com if não podem ter tipo de retorno.',
        'valor * 1 é number, mas a função declara retorno string.',
        'Falta um else antes do segundo return.',
      ],
      correctReason: 2,
    },
    hints: ['Os dois returns devolvem o mesmo tipo?', 'O tipo declarado depois dos parênteses vale para todos os returns.'],
    explanation: 'TS2322: Type \'number\' is not assignable to type \'string\'. Anotar o retorno faz o compilador conferir cada return.',
  }),
];
