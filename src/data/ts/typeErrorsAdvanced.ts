import { TsExercise } from '../../types/exercise';
import { erroDeTipo } from './typeErrorFactory';

/**
 * Trilha TypeScript — 'prever_erro_de_tipo', nível avançado (10 exercícios).
 * Cada trecho tem exatamente um erro; linha e código são conferidos por `npm run check:ts`.
 */
export const tsAdvancedTypeErrors: TsExercise<'avancado'>[] = [
  erroDeTipo({
    id: 'ts-avancado-erro-keyof-chave-invalida',
    difficulty: 'avancado',
    topic: 'keyof & Indexed Access Types',
    title: 'Erro de Tipo: Chave que Não Existe em keyof T',
    summary: 'Um getter tipado com keyof recebe uma chave inexistente.',
    realWorldContext: 'Colunas de tabela escolhidas por nome são um alvo clássico de erros de digitação. Com keyof, o compilador lista as válidas.',
    code: `function obterCampo<T, K extends keyof T>(obj: T, chave: K): T[K] {
  return obj[chave];
}

const livro = { titulo: 'Refatoração', paginas: 456 };
console.log(obterCampo(livro, 'titulo'));
console.log(obterCampo(livro, 'autor'));
`,
    fixedCode: `function obterCampo<T, K extends keyof T>(obj: T, chave: K): T[K] {
  return obj[chave];
}

const livro = { titulo: 'Refatoração', paginas: 456 };
console.log(obterCampo(livro, 'titulo'));
console.log(obterCampo(livro, 'paginas'));
`,
    challenge: {
      errorLine: 7,
      errorCode: 2345,
      reasonOptions: [
        '"autor" não é uma chave de livro: K precisa ser "titulo" | "paginas".',
        'T[K] não pode ser usado como tipo de retorno.',
        'obterCampo precisa receber o tipo genérico explicitamente.',
        'console.log não aceita o retorno de funções genéricas.',
      ],
      correctReason: 0,
    },
    hints: ['A primeira chamada compila. O que muda na segunda?', 'keyof typeof livro = "titulo" | "paginas".'],
    explanation: 'TS2345: Argument of type \'"autor"\' is not assignable to parameter of type \'"titulo" | "paginas"\'.',
  }),
  erroDeTipo({
    id: 'ts-avancado-erro-constraint-nao-satisfeita',
    difficulty: 'avancado',
    topic: 'Generics com Constraints',
    title: 'Erro de Tipo: Constraint de Generic Não Satisfeita',
    summary: 'Uma função genérica com constraint recebe um tipo que não a cumpre.',
    realWorldContext: 'Um repositório genérico exige entidades com id. Passar uma lista de textos violaria essa premissa.',
    code: `function indexarPorId<T extends { id: number }>(itens: T[]): Map<number, T> {
  return new Map(itens.map(item => [item.id, item]));
}

const produtos = [{ id: 1, nome: 'Café' }];
const indice = indexarPorId(produtos);
const tags = indexarPorId(['promo']);
console.log(indice.size, tags.size);
`,
    fixedCode: `function indexarPorId<T extends { id: number }>(itens: T[]): Map<number, T> {
  return new Map(itens.map(item => [item.id, item]));
}

const produtos = [{ id: 1, nome: 'Café' }];
const indice = indexarPorId(produtos);
const tags = indexarPorId([{ id: 1, nome: 'promo' }]);
console.log(indice.size, tags.size);
`,
    challenge: {
      errorLine: 7,
      errorCode: 2322,
      reasonOptions: [
        'Map não aceita chaves numéricas.',
        'produtos tem a propriedade nome, que a constraint não prevê.',
        'Strings não têm a propriedade id exigida pela constraint T extends { id: number }.',
        'O retorno de indexarPorId deveria ser um array.',
      ],
      correctReason: 2,
    },
    hints: ['Propriedades a mais não violam uma constraint (produtos compila).', 'O que falta em uma string?'],
    explanation: 'TS2322: Type \'string\' is not assignable to type \'{ id: number }\'. A constraint é uma exigência mínima: o tipo pode ter mais campos, nunca menos.',
  }),
  erroDeTipo({
    id: 'ts-avancado-erro-exaustividade-never',
    difficulty: 'avancado',
    topic: 'Discriminated Unions',
    title: 'Erro de Tipo: Checagem de Exaustividade Acionada',
    summary: 'Um membro novo da união não foi tratado no switch e chega ao never.',
    realWorldContext: 'É assim que o compilador avisa que um switch esqueceu um caso: a checagem com never deixa de compilar.',
    code: `type Evento =
  | { tipo: 'login'; usuario: string }
  | { tipo: 'logout'; usuario: string }
  | { tipo: 'compra'; valor: number };

function descrever(e: Evento): string {
  switch (e.tipo) {
    case 'login':
      return e.usuario + ' entrou';
    case 'logout':
      return e.usuario + ' saiu';
    default: {
      const naoTratado: never = e;
      return naoTratado;
    }
  }
}

console.log(descrever({ tipo: 'login', usuario: 'ana' }));
`,
    fixedCode: `type Evento =
  | { tipo: 'login'; usuario: string }
  | { tipo: 'logout'; usuario: string }
  | { tipo: 'compra'; valor: number };

function descrever(e: Evento): string {
  switch (e.tipo) {
    case 'login':
      return e.usuario + ' entrou';
    case 'logout':
      return e.usuario + ' saiu';
    case 'compra':
      return 'Compra de R$ ' + e.valor;
    default: {
      const naoTratado: never = e;
      return naoTratado;
    }
  }
}

console.log(descrever({ tipo: 'login', usuario: 'ana' }));
`,
    challenge: {
      errorLine: 13,
      errorCode: 2322,
      reasonOptions: [
        'never não pode ser retornado como string.',
        'O caso "compra" não foi tratado, então e não é never no default.',
        'Os cases de login e logout acessam e.usuario sem narrowing.',
        'switch não funciona com propriedades de objetos.',
      ],
      correctReason: 1,
    },
    hints: ['Quais valores de tipo chegam ao default?', 'never é atribuível a qualquer tipo, então o return está correto.'],
    explanation: 'TS2322: Type \'{ tipo: "compra"; valor: number; }\' is not assignable to type \'never\'. O erro aponta para a checagem, mas a correção é tratar o caso esquecido.',
  }),
  erroDeTipo({
    id: 'ts-avancado-erro-discriminante-nao-checado',
    difficulty: 'avancado',
    topic: 'Discriminated Unions',
    title: 'Erro de Tipo: Campo de uma Variante sem Checar o Discriminante',
    summary: 'O código acessa um campo que só existe em um dos membros da união.',
    realWorldContext: 'Respostas de API do tipo { status: "ok", dados } | { status: "erro", mensagem } exigem checar o status antes de ler os dados.',
    code: `type Resposta =
  | { status: 'ok'; dados: string[] }
  | { status: 'erro'; mensagem: string };

function contarItens(r: Resposta): number {
  if (r.status === 'erro') {
    console.log(r.mensagem);
  }
  return r.dados.length;
}

console.log(contarItens({ status: 'ok', dados: ['a', 'b'] }));
`,
    fixedCode: `type Resposta =
  | { status: 'ok'; dados: string[] }
  | { status: 'erro'; mensagem: string };

function contarItens(r: Resposta): number {
  if (r.status === 'erro') {
    console.log(r.mensagem);
    return 0;
  }
  return r.dados.length;
}

console.log(contarItens({ status: 'ok', dados: ['a', 'b'] }));
`,
    challenge: {
      errorLine: 9,
      errorCode: 2339,
      reasonOptions: [
        'r.mensagem não existe quando status é "erro".',
        'O if não retorna, então depois dele r ainda pode ser a variante de erro, que não tem dados.',
        'dados deveria ser readonly.',
        'Uniões discriminadas não podem ter arrays.',
      ],
      correctReason: 1,
    },
    hints: ['Dentro do if, r é a variante de erro. E depois do if?', 'Um return dentro do if mudaria o narrowing.'],
    explanation: 'TS2339: Property \'dados\' does not exist on type \'Resposta\'. Como o if não termina a função, após ele r continua sendo a união inteira.',
  }),
  erroDeTipo({
    id: 'ts-avancado-erro-template-literal',
    difficulty: 'avancado',
    topic: 'Template Literal Types',
    title: 'Erro de Tipo: Texto Fora do Padrão de um Template Literal Type',
    summary: 'Um valor não segue o formato descrito por um template literal type.',
    realWorldContext: 'Identificadores com prefixo ("ped_123", "cli_45") evitam misturar ids de entidades diferentes.',
    code: `type IdPedido = \`ped_\${number}\`;

function buscarPedido(id: IdPedido): string {
  return 'Buscando ' + id;
}

console.log(buscarPedido('ped_123'));
console.log(buscarPedido('cli_45'));
`,
    fixedCode: `type IdPedido = \`ped_\${number}\`;

function buscarPedido(id: IdPedido): string {
  return 'Buscando ' + id;
}

console.log(buscarPedido('ped_123'));
console.log(buscarPedido('ped_45'));
`,
    challenge: {
      errorLine: 8,
      errorCode: 2345,
      reasonOptions: [
        'Template literal types não aceitam number dentro.',
        '"ped_123" deveria ser um número.',
        '"cli_45" não começa com "ped_", então não é um IdPedido.',
        'Funções não podem receber template literal types.',
      ],
      correctReason: 2,
    },
    hints: ['A primeira chamada compila normalmente.', 'O tipo exige o prefixo ped_ seguido de um número.'],
    explanation: 'TS2345: Argument of type \'"cli_45"\' is not assignable to parameter of type \'`ped_${number}`\'.',
  }),
  erroDeTipo({
    id: 'ts-avancado-erro-satisfies',
    difficulty: 'avancado',
    topic: 'satisfies',
    title: 'Erro de Tipo: Objeto que Não Satisfaz o Tipo',
    summary: 'Um objeto checado com satisfies tem um valor fora do permitido.',
    realWorldContext: 'satisfies valida configurações sem perder a inferência — e aponta exatamente o valor inválido.',
    code: `interface Rota {
  metodo: 'GET' | 'POST';
  caminho: string;
}

const rotas = {
  listar: { metodo: 'GET', caminho: '/produtos' },
  atualizar: { metodo: 'PUT', caminho: '/produtos/:id' },
} satisfies Record<string, Rota>;

console.log(rotas.listar.caminho);
`,
    fixedCode: `interface Rota {
  metodo: 'GET' | 'POST';
  caminho: string;
}

const rotas = {
  listar: { metodo: 'GET', caminho: '/produtos' },
  atualizar: { metodo: 'POST', caminho: '/produtos/:id' },
} satisfies Record<string, Rota>;

console.log(rotas.listar.caminho);
`,
    challenge: {
      errorLine: 8,
      errorCode: 2322,
      reasonOptions: [
        'satisfies não pode ser usado com Record.',
        'O caminho com ":id" não é uma string válida.',
        'listar deveria usar POST.',
        '"PUT" não está entre os métodos permitidos em Rota.',
      ],
      correctReason: 3,
    },
    hints: ['Compare cada metodo com a união da interface.', 'O erro aparece na propriedade inválida, não no satisfies.'],
    explanation: 'TS2322: Type \'"PUT"\' is not assignable to type \'"GET" | "POST"\'. satisfies valida cada propriedade e aponta a linha exata.',
  }),
  erroDeTipo({
    id: 'ts-avancado-erro-conditional-type',
    difficulty: 'avancado',
    topic: 'Conditional Types',
    title: 'Erro de Tipo: Valor Removido por um Conditional Type',
    summary: 'Um valor é atribuído a um tipo que o conditional type excluiu.',
    realWorldContext: 'Depois de validar um formulário, os campos não podem mais ser null. Um tipo condicional descreve esse "depois" — e recusa null.',
    code: `type SemNulo<T> = T extends null | undefined ? never : T;
type Campo = string | number | null;

const valido: SemNulo<Campo> = 'ok';
const tambemValido: SemNulo<Campo> = 42;
const invalido: SemNulo<Campo> = null;

console.log(valido, tambemValido, invalido);
`,
    fixedCode: `type SemNulo<T> = T extends null | undefined ? never : T;
type Campo = string | number | null;

const valido: SemNulo<Campo> = 'ok';
const tambemValido: SemNulo<Campo> = 42;
const campoOriginal: Campo = null;

console.log(valido, tambemValido, campoOriginal);
`,
    challenge: {
      errorLine: 6,
      errorCode: 2322,
      reasonOptions: [
        'SemNulo<Campo> é string | number: o null foi removido pelo conditional type.',
        'Conditional types não funcionam com uniões.',
        'never não pode aparecer em um alias de tipo.',
        'O número 42 não é aceito porque Campo é string.',
      ],
      correctReason: 0,
    },
    hints: ['Aplique o tipo condicional a cada membro da união Campo.', 'never desaparece de uniões.'],
    explanation: 'TS2322: Type \'null\' is not assignable to type \'string | number\'. O conditional type é distributivo: null vira never e some.',
  }),
  erroDeTipo({
    id: 'ts-avancado-erro-readonly-mapeado',
    difficulty: 'avancado',
    topic: 'Mapped Types',
    title: 'Erro de Tipo: Escrita em um Tipo Readonly<T>',
    summary: 'Uma propriedade de um objeto Readonly<T> recebe um novo valor.',
    realWorldContext: 'Estados congelados (como a configuração carregada na inicialização) usam Readonly<T> para impedir alterações acidentais.',
    code: `interface Config {
  tema: 'claro' | 'escuro';
  idioma: string;
}

function aplicar(config: Readonly<Config>): string {
  config.tema = 'escuro';
  return config.idioma;
}

console.log(aplicar({ tema: 'claro', idioma: 'pt-BR' }));
`,
    fixedCode: `interface Config {
  tema: 'claro' | 'escuro';
  idioma: string;
}

function aplicar(config: Readonly<Config>): Config {
  return { ...config, tema: 'escuro' };
}

console.log(aplicar({ tema: 'claro', idioma: 'pt-BR' }));
`,
    challenge: {
      errorLine: 7,
      errorCode: 2540,
      reasonOptions: [
        '"escuro" não faz parte da união do tema.',
        'Readonly<Config> torna todas as propriedades somente leitura.',
        'Parâmetros de função nunca podem ser alterados.',
        'idioma deveria ser readonly na interface.',
      ],
      correctReason: 1,
    },
    hints: ['Readonly<T> é um mapped type: { readonly [K in keyof T]: T[K] }.', 'Para "alterar", crie um objeto novo com spread.'],
    explanation: 'TS2540: Cannot assign to \'tema\' because it is a read-only property. Readonly<T> aplica readonly em todas as chaves.',
  }),
  erroDeTipo({
    id: 'ts-avancado-erro-as-const-mutacao',
    difficulty: 'avancado',
    topic: 'Inferência & Literal Types',
    title: 'Erro de Tipo: Alterando uma Tupla as const',
    summary: 'Um método que altera o array é chamado em uma lista declarada com as const.',
    realWorldContext: 'Listas de opções fixas (planos, tamanhos) declaradas com as const viram tuplas readonly de literais — ideais para derivar tipos.',
    code: `const TAMANHOS = ['P', 'M', 'G'] as const;
type Tamanho = (typeof TAMANHOS)[number];

const escolhido: Tamanho = 'M';
TAMANHOS.push('GG');
console.log(escolhido, TAMANHOS.length);
`,
    fixedCode: `const TAMANHOS = ['P', 'M', 'G', 'GG'] as const;
type Tamanho = (typeof TAMANHOS)[number];

const escolhido: Tamanho = 'M';
console.log(escolhido, TAMANHOS.length);
`,
    challenge: {
      errorLine: 5,
      errorCode: 2339,
      reasonOptions: [
        '(typeof TAMANHOS)[number] não é uma sintaxe válida.',
        '"M" não é um Tamanho.',
        'as const gera uma tupla readonly, que não tem push.',
        'Constantes em maiúsculas não podem ser arrays.',
      ],
      correctReason: 2,
    },
    hints: ['O tipo de TAMANHOS é readonly ["P", "M", "G"].', 'A linha 2 deriva a união "P" | "M" | "G" — e está correta.'],
    explanation: 'TS2339: Property \'push\' does not exist on type \'readonly ["P", "M", "G"]\'. Para incluir um tamanho, edite a lista original.',
  }),
  erroDeTipo({
    id: 'ts-avancado-erro-returntype-infer',
    difficulty: 'avancado',
    topic: 'infer',
    title: 'Erro de Tipo: Objeto Incompatível com o ReturnType',
    summary: 'Um objeto é tipado com o ReturnType de uma função, mas um campo tem o tipo errado.',
    realWorldContext: 'Quando uma biblioteca exporta só a função, ReturnType (construído com infer) deriva o tipo do retorno — e passa a conferir objetos montados à mão.',
    code: `function criarSessao(usuario: string) {
  return { usuario, expiraEm: Date.now() + 3600000, ativa: true };
}

type Sessao = ReturnType<typeof criarSessao>;

const sessaoTeste: Sessao = {
  usuario: 'qa',
  expiraEm: 'amanhã',
  ativa: true,
};

console.log(sessaoTeste.usuario);
`,
    fixedCode: `function criarSessao(usuario: string) {
  return { usuario, expiraEm: Date.now() + 3600000, ativa: true };
}

type Sessao = ReturnType<typeof criarSessao>;

const sessaoTeste: Sessao = {
  usuario: 'qa',
  expiraEm: Date.now() + 86400000,
  ativa: true,
};

console.log(sessaoTeste.usuario);
`,
    challenge: {
      errorLine: 9,
      errorCode: 2322,
      reasonOptions: [
        'ReturnType só funciona com funções que têm retorno anotado.',
        'expiraEm é number no retorno de criarSessao, e "amanhã" é string.',
        'typeof não pode ser usado com funções.',
        'ativa deveria ser false em sessões de teste.',
      ],
      correctReason: 1,
    },
    hints: ['Qual é o tipo de Date.now() + 3600000?', 'Sessao foi inferido a partir do return.'],
    explanation: 'TS2322: Type \'string\' is not assignable to type \'number\'. ReturnType<T> = T extends (...args: any) => infer R ? R : any.',
  }),
];
