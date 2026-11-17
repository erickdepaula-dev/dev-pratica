import { TsExercise } from '../../types/exercise';

/**
 * Trilha TypeScript — nível básico.
 * Tipos primitivos, inferência, type vs interface, arrays/tuplas, union/literal,
 * enums, funções tipadas, parâmetros opcionais e padrão.
 * IDs: `ts-basico-<slug>` (checado pelo tipo TsExercise<'basico'>).
 * Todo o código assume `strict: true`.
 */
export const tsBasicExercises: TsExercise<'basico'>[] = [
  // 1
  {
    id: 'ts-basico-tipos-primitivos',
    language: 'typescript',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Tipos Primitivos',
    title: 'Anotando os Tipos de um Produto',
    summary: 'Anote explicitamente os tipos primitivos string, number e boolean em variáveis de um cadastro.',
    realWorldContext:
      'Em um painel de e-commerce, o nome do produto, o preço e a disponibilidade em estoque vêm de formulários. Anotar os tipos impede que alguém guarde "19,90" (texto) onde o sistema espera um número.',
    description:
      'Complete as anotações de tipo das três variáveis do produto. Em TypeScript, a anotação vem depois do nome da variável, separada por dois-pontos.',
    goal: 'Usar os tipos primitivos string, number e boolean.',
    templateCode: `const nomeProduto: {{blank_0}} = 'Teclado Mecânico';
const precoEmReais: {{blank_1}} = 349.9;
const emEstoque: {{blank_2}} = true;

console.log(nomeProduto, precoEmReais, emEstoque);
`,
    blanks: [
      { id: 'blank_0', label: 'Tipo do nome', expectedAnswers: ['string'], hint: 'Textos usam o tipo primitivo em minúsculas, não o objeto String.' },
      { id: 'blank_1', label: 'Tipo do preço', expectedAnswers: ['number'], hint: 'TypeScript não separa inteiros de decimais: há um único tipo numérico.' },
      { id: 'blank_2', label: 'Tipo da disponibilidade', expectedAnswers: ['boolean'], hint: 'Verdadeiro ou falso.' },
    ],
    solutionCode: `const nomeProduto: string = 'Teclado Mecânico';
const precoEmReais: number = 349.9;
const emEstoque: boolean = true;

console.log(nomeProduto, precoEmReais, emEstoque);
`,
    hints: [
      'A sintaxe é nome: tipo = valor.',
      'Use os tipos em minúsculas (string, number, boolean). String, Number e Boolean com maiúscula são os objetos "embrulhadores" do JavaScript e devem ser evitados como tipo.',
    ],
    testCases: [{ description: 'As três variáveis estão anotadas com tipos primitivos', expectedOutput: 'Teclado Mecânico 349.9 true' }],
    explanation:
      'string, number e boolean são os tipos primitivos mais usados. Não existe int/float em TypeScript: number cobre ambos. Os tipos com inicial maiúscula (String, Number) representam objetos wrapper e quase nunca são o que você quer.',
  },
  // 2
  {
    id: 'ts-basico-inferencia-as-const',
    language: 'typescript',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Inferência & Literal Types',
    title: 'Inferência de Tipos e Congelamento com as const',
    summary: 'Entenda quando o TypeScript infere o tipo sozinho e use as const para preservar valores literais.',
    realWorldContext:
      'Configurações de ambiente (ex.: o nome de um tema ou a moeda padrão) não devem mudar. Com as const, o TypeScript trata esses valores como literais exatos e impede reatribuições acidentais.',
    description:
      'A variável moeda já tem o tipo inferido pelo TypeScript, sem anotação. Complete a declaração de config para que suas propriedades virem readonly e literais (o tipo de config.tema deve ser exatamente "escuro", e não string).',
    goal: 'Usar const para inferência literal e a asserção as const em um objeto.',
    templateCode: `// Inferência: o tipo de moeda é o literal "BRL" (const não pode ser reatribuída)
{{blank_0}} moeda = 'BRL';

const config = {
  tema: 'escuro',
  idioma: 'pt-BR',
} {{blank_1}};

console.log(moeda, config.tema);
`,
    blanks: [
      { id: 'blank_0', label: 'Palavra-chave de declaração imutável', expectedAnswers: ['const'], hint: 'Com let o tipo inferido seria string; com esta palavra-chave, é o literal "BRL".' },
      { id: 'blank_1', label: 'Asserção que congela o objeto', expectedAnswers: ['as const'], hint: 'É uma asserção de tipo que começa com "as".' },
    ],
    solutionCode: `const moeda = 'BRL';

const config = {
  tema: 'escuro',
  idioma: 'pt-BR',
} as const;

console.log(moeda, config.tema);
`,
    typeAssertions: `const temaLiteral: 'escuro' = config.tema;
// @ts-expect-error — com as const as propriedades são readonly
config.tema = 'claro';`,
    hints: [
      'let x = "a" infere string; const x = "a" infere o literal "a".',
      'Objetos declarados com const ainda têm propriedades mutáveis. A asserção "as const" torna tudo readonly e literal.',
    ],
    testCases: [{ description: 'config.tema tem o tipo literal "escuro" e é readonly', expectedOutput: 'BRL escuro' }],
    explanation:
      'O TypeScript infere tipos a partir do valor inicial. Com const em primitivos, o tipo inferido é o próprio literal. Em objetos, as propriedades continuam alargadas (string) e mutáveis, a menos que você use "as const", que aplica readonly e mantém os literais em todos os níveis.',
  },
  // 3
  {
    id: 'ts-basico-interface-usuario',
    language: 'typescript',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Interfaces & Propriedades Opcionais',
    title: 'Modelando um Usuário com interface',
    summary: 'Declare uma interface com propriedade opcional e use-a para tipar um objeto.',
    realWorldContext:
      'Cadastros reais têm campos obrigatórios (nome, e-mail) e opcionais (telefone). Modelar isso no tipo evita que o sistema aceite um usuário sem e-mail ou exija um telefone que nem todo mundo informa.',
    description:
      'Complete a declaração da interface Usuario e marque telefone como opcional. Depois, anote o tipo da constante ana.',
    goal: 'Declarar uma interface com uma propriedade opcional e usá-la como tipo.',
    templateCode: `{{blank_0}} Usuario {
  nome: string;
  email: string;
  telefone{{blank_1}} string;
}

const ana: {{blank_2}} = {
  nome: 'Ana Souza',
  email: 'ana@exemplo.com',
};

console.log(ana.nome, ana.telefone ?? 'sem telefone');
`,
    blanks: [
      { id: 'blank_0', label: 'Palavra-chave de declaração', expectedAnswers: ['interface'], hint: 'Declara a "forma" de um objeto e pode ser estendida depois.' },
      { id: 'blank_1', label: 'Marcador de opcional', expectedAnswers: ['?:'], hint: 'Um caractere antes dos dois-pontos torna a propriedade opcional.' },
      { id: 'blank_2', label: 'Tipo da constante', expectedAnswers: ['Usuario'], hint: 'O nome da interface que você acabou de declarar.' },
    ],
    solutionCode: `interface Usuario {
  nome: string;
  email: string;
  telefone?: string;
}

const ana: Usuario = {
  nome: 'Ana Souza',
  email: 'ana@exemplo.com',
};

console.log(ana.nome, ana.telefone ?? 'sem telefone');
`,
    typeAssertions: `// @ts-expect-error — email é obrigatório
const semEmail: Usuario = { nome: 'Bia' };`,
    hints: [
      'A palavra-chave começa com "inter".',
      'Propriedades opcionais usam ? antes dos dois-pontos: campo?: tipo. O tipo efetivo passa a ser string | undefined.',
    ],
    testCases: [{ description: 'Objeto sem telefone é aceito; sem email é rejeitado', expectedOutput: 'Ana Souza sem telefone' }],
    explanation:
      'Interfaces descrevem a forma de objetos. O "?" torna a propriedade opcional: ela pode faltar, e seu tipo passa a incluir undefined — por isso o código usa ?? para dar um valor padrão na exibição.',
  },
  // 4
  {
    id: 'ts-basico-union-literal-status',
    language: 'typescript',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Union & Literal Types',
    title: 'Status de Pagamento com Union de Literais',
    summary: 'Crie um type alias que só aceita alguns textos específicos.',
    realWorldContext:
      'Status de pagamento costumam ser guardados como texto ("pago", "pendente"). Com uma union de literais, um erro de digitação como "pagu" vira erro de compilação, e não um bug em produção.',
    description:
      'Complete o alias StatusPagamento para aceitar apenas "pendente", "pago" ou "estornado". Use a palavra-chave de alias de tipo e o operador de união.',
    goal: 'Declarar um type alias com uma union de string literals.',
    templateCode: `{{blank_0}} StatusPagamento = 'pendente' {{blank_1}} 'pago' | 'estornado';

function descreverStatus(status: StatusPagamento): string {
  return 'Pagamento ' + status;
}

console.log(descreverStatus('pago'));
`,
    blanks: [
      { id: 'blank_0', label: 'Palavra-chave de alias', expectedAnswers: ['type'], hint: 'Cria um nome para qualquer tipo, inclusive uniões.' },
      { id: 'blank_1', label: 'Operador de união', expectedAnswers: ['|'], hint: 'O mesmo caractere do "ou" bit a bit.' },
    ],
    solutionCode: `type StatusPagamento = 'pendente' | 'pago' | 'estornado';

function descreverStatus(status: StatusPagamento): string {
  return 'Pagamento ' + status;
}

console.log(descreverStatus('pago'));
`,
    typeAssertions: `// @ts-expect-error — "cancelado" não faz parte da união
descreverStatus('cancelado');`,
    hints: [
      'Aliases de tipo começam com a palavra "type".',
      'Cada alternativa da união é separada por |.',
    ],
    testCases: [{ description: 'Aceita apenas os três status previstos', expectedOutput: 'Pagamento pago' }],
    explanation:
      'Uma union de literal types restringe o valor a um conjunto fechado. É a forma idiomática em TypeScript de representar estados finitos — mais leve que um enum e sem código gerado em runtime.',
  },
  // 5
  {
    id: 'ts-basico-arrays-tipados',
    language: 'typescript',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Arrays Tipados',
    title: 'Listas Tipadas: T[] e Array<T>',
    summary: 'Tipe arrays nas duas sintaxes equivalentes e veja o compilador proteger a lista.',
    realWorldContext:
      'Uma lista de notas de alunos só deve conter números. Se um texto entrar ali por engano, a média sai errada (ou vira concatenação de strings).',
    description:
      'Complete as anotações: notas é uma lista de números na sintaxe com colchetes e alunos é uma lista de textos na sintaxe genérica Array<...>.',
    goal: 'Anotar arrays com number[] e Array<string>.',
    templateCode: `const notas: {{blank_0}} = [8.5, 7, 9.25];
const alunos: {{blank_1}} = ['Ana', 'Bruno', 'Carla'];

const media = notas.reduce((soma, n) => soma + n, 0) / notas.length;
console.log(alunos.length, media.toFixed(2));
`,
    blanks: [
      { id: 'blank_0', label: 'Lista de números (colchetes)', expectedAnswers: ['number[]'], hint: 'Tipo do elemento seguido de [].' },
      { id: 'blank_1', label: 'Lista de textos (genérico)', expectedAnswers: ['Array<string>'], hint: 'O tipo genérico Array recebe o tipo do elemento entre < >.' },
    ],
    solutionCode: `const notas: number[] = [8.5, 7, 9.25];
const alunos: Array<string> = ['Ana', 'Bruno', 'Carla'];

const media = notas.reduce((soma, n) => soma + n, 0) / notas.length;
console.log(alunos.length, media.toFixed(2));
`,
    typeAssertions: `// @ts-expect-error — texto não entra em number[]
notas.push('10');`,
    hints: [
      'number[] e Array<number> são exatamente o mesmo tipo.',
      'A forma genérica usa sinais de menor e maior: Array<tipo>.',
    ],
    testCases: [{ description: 'Arrays aceitam só o tipo declarado', expectedOutput: '3 8.25' }],
    explanation:
      'T[] e Array<T> são sinônimos. A forma com colchetes é a mais comum; a genérica aparece mais em tipos complexos (ex.: Array<string | number>). Com a anotação, push de um tipo errado vira erro de compilação.',
  },
  // 6
  {
    id: 'ts-basico-tuplas-coordenada',
    language: 'typescript',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Tuplas',
    title: 'Tuplas: Posição e Tipo Fixos',
    summary: 'Use uma tupla para retornar dois valores de tipos diferentes em posições fixas.',
    realWorldContext:
      'Hooks como o useState do React retornam uma tupla [valor, função]. Saber tipar tuplas é essencial para ler e escrever esse tipo de API.',
    description:
      'A função dividirComResto deve retornar uma tupla com o quociente e o resto, ambos numéricos. Complete o tipo de retorno e a desestruturação.',
    goal: 'Declarar uma tupla [number, number] e desestruturá-la.',
    templateCode: `function dividirComResto(dividendo: number, divisor: number): {{blank_0}} {
  return [Math.floor(dividendo / divisor), dividendo % divisor];
}

const {{blank_1}} = dividirComResto(17, 5);
console.log(quociente, resto);
`,
    blanks: [
      { id: 'blank_0', label: 'Tipo da tupla de retorno', expectedAnswers: ['[number, number]'], hint: 'Entre colchetes, o tipo de cada posição separado por vírgula.' },
      { id: 'blank_1', label: 'Desestruturação', expectedAnswers: ['[quociente, resto]'], hint: 'Os nomes que aparecem no console.log, entre colchetes.' },
    ],
    solutionCode: `function dividirComResto(dividendo: number, divisor: number): [number, number] {
  return [Math.floor(dividendo / divisor), dividendo % divisor];
}

const [quociente, resto] = dividirComResto(17, 5);
console.log(quociente, resto);
`,
    typeAssertions: `const r = dividirComResto(1, 1);
// @ts-expect-error — a tupla tem só duas posições
r[2];`,
    hints: [
      'Uma tupla é escrita como [tipo1, tipo2].',
      'Diferente de number[], a tupla fixa o tamanho: acessar a posição 2 é erro.',
    ],
    testCases: [{ description: 'Retorna quociente e resto em tupla', expectedOutput: '3 2' }],
    explanation:
      'Tuplas são arrays com tamanho e tipo por posição definidos. São ideais para retornar pares de valores sem criar um objeto — mas, quando há mais de 2 ou 3 posições, um objeto com nomes costuma ser mais legível.',
  },
  // 7
  {
    id: 'ts-basico-enum-pedido',
    language: 'typescript',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Enums',
    title: 'Enum de String para Etapas do Pedido',
    summary: 'Declare um enum de strings e acesse seus membros.',
    realWorldContext:
      'Sistemas de logística acompanham pedidos por etapas fixas. Um enum dá nomes legíveis a essas etapas e garante que o valor gravado no banco seja sempre um dos previstos.',
    description:
      'Complete a declaração do enum EtapaPedido e a atribuição da etapa atual do pedido para "Enviado".',
    goal: 'Declarar um enum de string e acessar um membro com Enum.Membro.',
    templateCode: `{{blank_0}} EtapaPedido {
  Recebido = 'RECEBIDO',
  Separado = 'SEPARADO',
  Enviado = 'ENVIADO',
}

const etapaAtual: EtapaPedido = {{blank_1}};
console.log(etapaAtual);
`,
    blanks: [
      { id: 'blank_0', label: 'Palavra-chave do enum', expectedAnswers: ['enum'], hint: 'Quatro letras.' },
      { id: 'blank_1', label: 'Acesso ao membro', expectedAnswers: ['EtapaPedido.Enviado'], hint: 'NomeDoEnum.NomeDoMembro.' },
    ],
    solutionCode: `enum EtapaPedido {
  Recebido = 'RECEBIDO',
  Separado = 'SEPARADO',
  Enviado = 'ENVIADO',
}

const etapaAtual: EtapaPedido = EtapaPedido.Enviado;
console.log(etapaAtual);
`,
    typeAssertions: `// @ts-expect-error — enums de string não aceitam o texto cru
const cru: EtapaPedido = 'ENVIADO';`,
    hints: [
      'A palavra-chave é enum.',
      'O valor de EtapaPedido.Enviado em runtime é a string "ENVIADO".',
    ],
    testCases: [{ description: 'Etapa atual recebe o membro Enviado', expectedOutput: 'ENVIADO' }],
    explanation:
      'Enums de string geram um objeto real no JavaScript emitido, com valores legíveis em logs e no banco. Note que o TypeScript não aceita o texto cru "ENVIADO" onde se espera o enum — é preciso usar o membro. Muitas equipes preferem union de literais pela simplicidade; enums brilham quando você quer um objeto em runtime para iterar ou exibir.',
  },
  // 8
  {
    id: 'ts-basico-funcao-assinatura',
    language: 'typescript',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Funções Tipadas',
    title: 'Parâmetros e Retorno Tipados',
    summary: 'Anote os parâmetros e o tipo de retorno de duas funções, incluindo void.',
    realWorldContext:
      'Em uma calculadora de juros, a função de cálculo devolve um número e a de log apenas registra algo na tela. Explicitar o retorno documenta a intenção e pega erros como esquecer o return.',
    description:
      'Complete o tipo do parâmetro taxa, o tipo de retorno de calcularJuros e o tipo de retorno de registrar (que não devolve nada).',
    goal: 'Tipar parâmetros e retornos, incluindo funções sem retorno (void).',
    templateCode: `function calcularJuros(capital: number, taxa: {{blank_0}}, meses: number){{blank_1}} {
  return capital * taxa * meses;
}

function registrar(mensagem: string): {{blank_2}} {
  console.log('[juros] ' + mensagem);
}

registrar('Total: ' + calcularJuros(1000, 0.02, 3));
`,
    blanks: [
      { id: 'blank_0', label: 'Tipo da taxa', expectedAnswers: ['number'], hint: 'A taxa é decimal (0.02).' },
      { id: 'blank_1', label: 'Anotação de retorno', expectedAnswers: [': number'], validationRegex: '^:\\s*number$', hint: 'Dois-pontos e o tipo, depois do fecha-parênteses.' },
      { id: 'blank_2', label: 'Retorno de função sem return', expectedAnswers: ['void'], hint: 'Tipo usado para funções que não devolvem valor.' },
    ],
    solutionCode: `function calcularJuros(capital: number, taxa: number, meses: number): number {
  return capital * taxa * meses;
}

function registrar(mensagem: string): void {
  console.log('[juros] ' + mensagem);
}

registrar('Total: ' + calcularJuros(1000, 0.02, 3));
`,
    typeAssertions: `const j: number = calcularJuros(1, 1, 1);
// @ts-expect-error — capital precisa ser number
calcularJuros('1000', 0.02, 3);`,
    hints: [
      'O tipo de retorno fica após os parâmetros: function f(a: number): number { ... }',
      'void indica que a função não retorna nada útil.',
    ],
    testCases: [{ description: 'Funções com parâmetros e retornos tipados', expectedOutput: '[juros] Total: 60' }],
    explanation:
      'Anotar o retorno não é obrigatório (o TypeScript infere), mas em funções públicas é uma boa prática: se alguém mudar a implementação e o retorno mudar de tipo, o erro aparece na própria função, e não nos lugares que a chamam.',
  },
  // 9
  {
    id: 'ts-basico-parametros-opcionais-padrao',
    language: 'typescript',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Parâmetros Opcionais & Padrão',
    title: 'Parâmetro Opcional e Valor Padrão',
    summary: 'Torne um parâmetro opcional e outro com valor padrão em uma função de preço.',
    realWorldContext:
      'Nem todo produto tem cupom de desconto, e o frete padrão é grátis. Parâmetros opcionais e com valor padrão evitam ter que passar undefined manualmente em toda chamada.',
    description:
      'Complete a função: cupom deve ser um parâmetro opcional do tipo string e frete deve valer 0 quando não for informado.',
    goal: 'Declarar um parâmetro opcional (?) e um com valor padrão (=).',
    templateCode: `function precoFinal(preco: number, cupom{{blank_0}} string, frete {{blank_1}}): number {
  const desconto = cupom === 'DEV10' ? 0.1 : 0;
  return preco * (1 - desconto) + frete;
}

console.log(precoFinal(100), precoFinal(100, 'DEV10', 15));
`,
    blanks: [
      { id: 'blank_0', label: 'Parâmetro opcional', expectedAnswers: ['?:'], hint: 'O mesmo marcador usado em propriedades opcionais.' },
      { id: 'blank_1', label: 'Valor padrão do frete', expectedAnswers: ['= 0'], validationRegex: '^=\\s*0$', hint: 'Igual e o valor; o tipo number é inferido do padrão.' },
    ],
    solutionCode: `function precoFinal(preco: number, cupom?: string, frete = 0): number {
  const desconto = cupom === 'DEV10' ? 0.1 : 0;
  return preco * (1 - desconto) + frete;
}

console.log(precoFinal(100), precoFinal(100, 'DEV10', 15));
`,
    typeAssertions: `// @ts-expect-error — frete é number (inferido do padrão)
precoFinal(100, undefined, 'grátis');`,
    hints: [
      'Opcional: nome?: tipo. Dentro da função o tipo vira string | undefined.',
      'Com valor padrão você nem precisa anotar o tipo: frete = 0 já infere number.',
    ],
    testCases: [{ description: 'Chamadas com e sem os parâmetros opcionais', expectedOutput: '100 105' }],
    explanation:
      'Parâmetros opcionais (?) e com padrão (=) só podem vir depois dos obrigatórios. Com padrão, o TypeScript infere o tipo do valor e, dentro da função, o parâmetro nunca é undefined.',
  },
  // 10
  {
    id: 'ts-basico-tipo-de-funcao',
    language: 'typescript',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Tipos de Função',
    title: 'Tipando uma Função como Valor',
    summary: 'Crie um tipo para funções e use-o para tipar callbacks.',
    realWorldContext:
      'Relatórios financeiros exibem valores em formatos diferentes (moeda, porcentagem). Definir um tipo Formatador permite trocar a estratégia de formatação sem mudar o resto do código.',
    description:
      'Complete o alias Formatador: uma função que recebe um number e devolve uma string. Depois, use-o para tipar o parâmetro da função exibir.',
    goal: 'Declarar um function type com a sintaxe (param: Tipo) => Retorno.',
    templateCode: `type Formatador = (valor: number) {{blank_0}};

const comoPorcentagem: Formatador = valor => (valor * 100).toFixed(1) + '%';

function exibir(valor: number, formatar: {{blank_1}}): string {
  return 'Resultado: ' + formatar(valor);
}

console.log(exibir(0.256, comoPorcentagem));
`,
    blanks: [
      { id: 'blank_0', label: 'Seta e tipo de retorno', expectedAnswers: ['=> string'], validationRegex: '^=>\\s*string$', hint: 'Em tipos de função, o retorno vem depois de uma seta.' },
      { id: 'blank_1', label: 'Tipo do callback', expectedAnswers: ['Formatador'], hint: 'O alias declarado na primeira linha.' },
    ],
    solutionCode: `type Formatador = (valor: number) => string;

const comoPorcentagem: Formatador = valor => (valor * 100).toFixed(1) + '%';

function exibir(valor: number, formatar: Formatador): string {
  return 'Resultado: ' + formatar(valor);
}

console.log(exibir(0.256, comoPorcentagem));
`,
    typeAssertions: `// @ts-expect-error — o formatador precisa devolver string
exibir(1, valor => valor * 2);`,
    hints: [
      'Function types usam seta: (a: number) => string.',
      'Repare que comoPorcentagem nem precisou anotar valor: o tipo veio do alias (tipagem contextual).',
    ],
    testCases: [{ description: 'Callback tipado com o alias Formatador', expectedOutput: 'Resultado: 25.6%' }],
    explanation:
      'Funções são valores, e seus tipos se escrevem como (params) => retorno. Ao tipar uma variável ou parâmetro com esse alias, o TypeScript infere os parâmetros da arrow function automaticamente (tipagem contextual).',
  },
  // 11
  {
    id: 'ts-basico-debug-texto-como-numero',
    language: 'typescript',
    difficulty: 'basico',
    type: 'corrigir_erros',
    topic: 'Tipos Primitivos',
    title: 'Depuração: Texto de Formulário Usado como Número',
    summary: 'O compilador reclama que uma string está sendo passada onde se espera number. Converta o valor.',
    realWorldContext:
      'Valores de inputs HTML sempre chegam como texto, mesmo em campos numéricos. Em JavaScript, "10" + 5 vira "105" silenciosamente; o TypeScript pega isso antes de chegar ao usuário.',
    description:
      'A função somarItens espera números, mas quantidadeDigitada vem de um formulário como string. Corrija a chamada convertendo o texto para número.',
    goal: 'Converter a string para number antes de passar para a função.',
    bugDescription: "Argument of type 'string' is not assignable to parameter of type 'number'.",
    buggyLineNumbers: [6],
    initialBuggyCode: `function somarItens(atual: number, adicionar: number): number {
  return atual + adicionar;
}

const quantidadeDigitada: string = '3';
const total = somarItens(10, quantidadeDigitada);
console.log(total);
`,
    templateCode: `function somarItens(atual: number, adicionar: number): number {
  return atual + adicionar;
}

const quantidadeDigitada: string = '3';
const total = somarItens(10, quantidadeDigitada);
console.log(total);
`,
    solutionCode: `function somarItens(atual: number, adicionar: number): number {
  return atual + adicionar;
}

const quantidadeDigitada: string = '3';
const total = somarItens(10, Number(quantidadeDigitada));
console.log(total);
`,
    hints: [
      'Leia a mensagem do compilador: qual argumento está com o tipo errado?',
      'Use Number(texto) para converter. Não troque o tipo do parâmetro para string: a função faz conta.',
    ],
    testCases: [
      { description: 'A soma é numérica (13), não concatenação ("103")', expectedOutput: '13', testFunction: `return somarItens(10, Number('3')) === 13 && total === 13;` },
    ],
    explanation:
      'O TypeScript impede misturar string e number sem conversão explícita. Converter na borda (onde o dado entra no sistema) mantém o resto do código trabalhando com o tipo correto.',
    validationRules: [{ id: 'rule-number', type: 'regex', target: 'Number\\(|parseInt\\(|parseFloat\\(|\\+quantidadeDigitada', description: 'Converte a string para número' }],
  },
  // 12
  {
    id: 'ts-basico-prever-tipos-apagados',
    language: 'typescript',
    difficulty: 'basico',
    type: 'prever_saida',
    topic: 'Tipos em Runtime',
    title: 'Previsão de Saída: Tipos Não Existem em Runtime',
    summary: 'Descubra o que acontece quando a anotação de tipo "mente" sobre um dado vindo de fora.',
    realWorldContext:
      'Respostas de API chegam via JSON.parse, que devolve any. Anotar o resultado como number não converte nada: as anotações somem no JavaScript gerado.',
    description:
      'O valor foi anotado como number, mas veio de um JSON com texto. Qual é a saída do console.log?',
    goal: 'Entender que anotações de tipo são apagadas na compilação.',
    codeToPredict: `const idade: number = JSON.parse('"30"');

console.log(typeof idade, idade + 1);
`,
    templateCode: `const idade: number = JSON.parse('"30"');

console.log(typeof idade, idade + 1);
`,
    expectedOutputPrediction: 'string 301',
    acceptableOutputPredictions: ['string, 301'],
    solutionCode: `const idade: number = JSON.parse('"30"');

console.log(typeof idade, idade + 1);
`,
    hints: [
      'JSON.parse retorna any, e any aceita qualquer anotação sem checar.',
      'Em runtime, "30" + 1 é concatenação.',
    ],
    testCases: [],
    explanation:
      'TypeScript faz checagem estática e apaga os tipos ao gerar JavaScript. Como JSON.parse retorna any, a anotação number não foi verificada: em runtime o valor continua sendo a string "30", e "30" + 1 resulta em "301". Para dados externos, valide em runtime (ou use unknown, visto no intermediário).',
  },
  // 13
  {
    id: 'ts-basico-livre-calcular-frete',
    language: 'typescript',
    difficulty: 'basico',
    type: 'codigo_livre',
    topic: 'Funções Tipadas',
    title: 'Código Livre: Cálculo de Frete por Região',
    summary: 'Implemente uma função tipada que calcula o frete a partir da região e do peso.',
    realWorldContext:
      'Lojas virtuais cobram frete diferente por região e por peso. Com a região tipada como união de literais, o compilador garante que nenhuma região inexistente entre no cálculo.',
    description:
      'Implemente calcularFrete(regiao, pesoKg). Tarifa base: Nordeste 15, Sudeste 10, Sul 12. Some 2 reais por kg. Pesos acima de 30 kg têm acréscimo fixo de 50. Mantenha as anotações de tipo.',
    goal: 'Retornar o valor numérico do frete de acordo com as regras.',
    templateCode: `type Regiao = 'Nordeste' | 'Sudeste' | 'Sul';

function calcularFrete(regiao: Regiao, pesoKg: number): number {
  // Implemente aqui
  return 0;
}

console.log(calcularFrete('Nordeste', 2));
`,
    solutionCode: `type Regiao = 'Nordeste' | 'Sudeste' | 'Sul';

function calcularFrete(regiao: Regiao, pesoKg: number): number {
  let base = 0;
  if (regiao === 'Nordeste') base = 15;
  else if (regiao === 'Sudeste') base = 10;
  else base = 12;

  const adicionalPeso = pesoKg > 30 ? 50 : 0;
  return base + pesoKg * 2 + adicionalPeso;
}

console.log(calcularFrete('Nordeste', 2));
`,
    typeAssertions: `const valor: number = calcularFrete('Sul', 1);
// @ts-expect-error — "Norte" não é uma Regiao
calcularFrete('Norte', 1);`,
    hints: [
      'Escolha a tarifa base com if/else ou switch sobre a região.',
      'Some pesoKg * 2 e, se pesoKg > 30, mais 50.',
      'Não mude a assinatura: o tipo Regiao é o que garante as regiões válidas.',
    ],
    testCases: [
      { description: 'Nordeste com 2 kg custa 19', expectedOutput: '19', testFunction: `return calcularFrete('Nordeste', 2) === 19;` },
      { description: 'Sudeste com 10 kg custa 30', expectedOutput: '30', testFunction: `return calcularFrete('Sudeste', 10) === 30;` },
      { description: 'Sul com 31 kg recebe acréscimo (124)', expectedOutput: '124', testFunction: `return calcularFrete('Sul', 31) === 124;` },
    ],
    explanation:
      'A união Regiao fecha o domínio de entradas: o compilador recusa regiões desconhecidas e, num switch, ajuda a garantir que todas foram tratadas. A lógica em si é JavaScript comum — os tipos só tornam o contrato explícito.',
    validationRules: [{ id: 'rule-no-any', type: 'not_contains', target: ': any', description: 'Não usa any' }],
  },
];
