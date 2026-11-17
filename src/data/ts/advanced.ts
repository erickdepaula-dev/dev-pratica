import { TsExercise } from '../../types/exercise';

/**
 * Trilha TypeScript — nível avançado.
 * Constraints, keyof/indexed access, conditional types, infer, mapped types,
 * template literal types, discriminated unions, exaustividade com never, satisfies.
 * IDs: `ts-avancado-<slug>` (checado pelo tipo TsExercise<'avancado'>).
 * Todo o código assume `strict: true`.
 */
export const tsAdvancedExercises: TsExercise<'avancado'>[] = [
  // 1
  {
    id: 'ts-avancado-generic-constraint',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Generics com Constraints',
    title: 'Generics com extends: Exigindo um id',
    summary: 'Restrinja um parâmetro genérico para aceitar só objetos que tenham id.',
    realWorldContext:
      'Repositórios genéricos (de usuários, pedidos, produtos) precisam buscar por id. A constraint garante que qualquer tipo usado tenha esse campo — sem abrir mão do tipo específico no retorno.',
    description:
      'Complete a constraint para que T seja qualquer objeto com id numérico. O retorno continua sendo T (com todos os campos do tipo original).',
    goal: 'Usar T extends { ... } para restringir um generic.',
    templateCode: `function buscarPorId<T {{blank_0}} { id: number }>(itens: T[], id: number): {{blank_1}} | undefined {
  return itens.find(item => item.id === id);
}

const pedidos = [{ id: 1, total: 99.9 }, { id: 2, total: 15 }];
const pedido = buscarPorId(pedidos, 2);
console.log(pedido?.total);
`,
    blanks: [
      { id: 'blank_0', label: 'Palavra da constraint', expectedAnswers: ['extends'], hint: 'A mesma palavra usada em herança de classes.' },
      { id: 'blank_1', label: 'Tipo de retorno', expectedAnswers: ['T'], hint: 'O retorno preserva o tipo específico recebido.' },
    ],
    solutionCode: `function buscarPorId<T extends { id: number }>(itens: T[], id: number): T | undefined {
  return itens.find(item => item.id === id);
}

const pedidos = [{ id: 1, total: 99.9 }, { id: 2, total: 15 }];
const pedido = buscarPorId(pedidos, 2);
console.log(pedido?.total);
`,
    typeAssertions: `const total: number | undefined = buscarPorId(pedidos, 1)?.total;
// @ts-expect-error — strings não têm id
buscarPorId(['a', 'b'], 1);`,
    hints: [
      'T extends X significa "T precisa ser compatível com X".',
      'Dentro da função você pode usar item.id; fora, o retorno é o tipo completo (com total).',
    ],
    testCases: [{ description: 'Retorna o pedido com o tipo completo', expectedOutput: '15' }],
    explanation:
      'Sem a constraint, item.id seria erro (T poderia ser qualquer coisa). Com { id: number } como interface mínima, a função aceita qualquer tipo que tenha id e devolve o tipo original — diferente de tipar o parâmetro como { id: number }[], que perderia o campo total.',
  },
  // 2
  {
    id: 'ts-avancado-keyof-indexed-access',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'keyof & Indexed Access Types',
    title: 'Acesso Tipado a Propriedades com keyof e T[K]',
    summary: 'Escreva um getter genérico cujo retorno depende da chave escolhida.',
    realWorldContext:
      'Tabelas e formulários genéricos leem colunas por nome. Com keyof e T[K], o compilador sabe que a coluna "preco" é number e "nome" é string.',
    description:
      'Complete a constraint de K (precisa ser uma das chaves de T) e o tipo de retorno (o tipo da propriedade K em T).',
    goal: 'Combinar K extends keyof T com o indexed access type T[K].',
    templateCode: `function obterCampo<T, K extends {{blank_0}}>(obj: T, chave: K): {{blank_1}} {
  return obj[chave];
}

const livro = { titulo: 'Clean Code', paginas: 464 };
const paginas = obterCampo(livro, 'paginas');
console.log(paginas + 1);
`,
    blanks: [
      { id: 'blank_0', label: 'Chaves de T', expectedAnswers: ['keyof T'], hint: 'Operador que produz a união das chaves de um tipo.' },
      { id: 'blank_1', label: 'Tipo da propriedade', expectedAnswers: ['T[K]'], hint: 'Indexed access: o tipo T acessado na chave K.' },
    ],
    solutionCode: `function obterCampo<T, K extends keyof T>(obj: T, chave: K): T[K] {
  return obj[chave];
}

const livro = { titulo: 'Clean Code', paginas: 464 };
const paginas = obterCampo(livro, 'paginas');
console.log(paginas + 1);
`,
    typeAssertions: `const t: string = obterCampo(livro, 'titulo');
const p: number = obterCampo(livro, 'paginas');
// @ts-expect-error — "autor" não é chave de livro
obterCampo(livro, 'autor');`,
    hints: [
      'keyof T para o livro é "titulo" | "paginas".',
      'T[K] com K = "paginas" resolve para number.',
    ],
    testCases: [{ description: 'Retorno tipado pela chave', expectedOutput: '465' }],
    explanation:
      'keyof T gera a união das chaves e T[K] busca o tipo de uma chave específica. Juntos, fazem o retorno variar conforme o argumento — é assim que bibliotecas como lodash.get e ORMs tipam acessos dinâmicos.',
  },
  // 3
  {
    id: 'ts-avancado-conditional-type',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Conditional Types',
    title: 'Conditional Types: Removendo null e undefined',
    summary: 'Escreva um tipo condicional que filtra membros de uma união.',
    realWorldContext:
      'Depois de validar um formulário, os campos antes opcionais passam a ser garantidos. Um tipo que remove null/undefined descreve esse "depois da validação".',
    description:
      'Complete o tipo SemNulo<T>: se T for null ou undefined, o resultado é o tipo vazio; senão, é o próprio T. Aplicado a uma união, ele distribui sobre cada membro.',
    goal: 'Usar a sintaxe T extends U ? X : Y e o tipo never.',
    templateCode: `type SemNulo<T> = T {{blank_0}} null | undefined ? {{blank_1}} : T;

type Entrada = string | number | null | undefined;
type Validada = SemNulo<Entrada>; // string | number

const valores: Validada[] = ['a', 1];
console.log(valores.length);
`,
    blanks: [
      { id: 'blank_0', label: 'Teste do tipo condicional', expectedAnswers: ['extends'], hint: 'Condicionais de tipo usam a mesma palavra das constraints.' },
      { id: 'blank_1', label: 'Tipo vazio', expectedAnswers: ['never'], hint: 'O tipo que não tem nenhum valor — some ao entrar numa união.' },
    ],
    solutionCode: `type SemNulo<T> = T extends null | undefined ? never : T;

type Entrada = string | number | null | undefined;
type Validada = SemNulo<Entrada>;

const valores: Validada[] = ['a', 1];
console.log(valores.length);
`,
    typeAssertions: `const ok: Validada = 'x';
// @ts-expect-error — null foi removido
const nulo: Validada = null;`,
    hints: [
      'A forma é: T extends Condicao ? SeSim : SeNao.',
      'Conditional types distribuem sobre uniões: cada membro é testado separadamente, e never desaparece da união final.',
    ],
    testCases: [{ description: 'null e undefined removidos da união', expectedOutput: '2' }],
    explanation:
      'Quando T é uma união, o conditional type é avaliado membro a membro (distributivo). string → string, number → number, null → never, undefined → never. Como never some das uniões, o resultado é string | number. É assim que o NonNullable<T> nativo é implementado.',
  },
  // 4
  {
    id: 'ts-avancado-infer',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'infer',
    title: 'Extraindo Tipos com infer',
    summary: 'Use infer para capturar o tipo do elemento de um array e o valor de uma Promise.',
    realWorldContext:
      'Quando uma biblioteca exporta só a função (e não o tipo do que ela devolve), infer permite derivar o tipo a partir da assinatura — sem duplicá-lo à mão.',
    description:
      'Complete os dois tipos: ElementoDe extrai o tipo dos itens de um array; Desembrulhar extrai o valor de dentro de uma Promise (ou devolve T se não for Promise).',
    goal: 'Declarar uma variável de tipo com infer dentro de um conditional type.',
    templateCode: `type ElementoDe<T> = T extends ({{blank_0}})[] ? E : never;
type Desembrulhar<T> = T extends Promise<{{blank_1}}> ? V : T;

const tags = ['ts', 'react'];
type Tag = ElementoDe<typeof tags>;           // string
type Resposta = Desembrulhar<Promise<number>>; // number

const tag: Tag = 'vite';
const status: Resposta = 200;
console.log(tag, status);
`,
    blanks: [
      { id: 'blank_0', label: 'Captura do elemento', expectedAnswers: ['infer E'], hint: 'infer + o nome usado depois do "?".' },
      { id: 'blank_1', label: 'Captura do valor', expectedAnswers: ['infer V'], hint: 'Mesmo padrão, com o nome usado no ramo verdadeiro.' },
    ],
    solutionCode: `type ElementoDe<T> = T extends (infer E)[] ? E : never;
type Desembrulhar<T> = T extends Promise<infer V> ? V : T;

const tags = ['ts', 'react'];
type Tag = ElementoDe<typeof tags>;
type Resposta = Desembrulhar<Promise<number>>;

const tag: Tag = 'vite';
const status: Resposta = 200;
console.log(tag, status);
`,
    typeAssertions: `const n: Desembrulhar<string> = 'continua string';
// @ts-expect-error — Resposta é number
const errado: Resposta = '200';`,
    hints: [
      'infer só pode aparecer na parte "extends" de um conditional type.',
      'infer E "declara" E e o TypeScript preenche com o tipo encontrado naquela posição.',
    ],
    testCases: [{ description: 'Tipos extraídos com infer', expectedOutput: 'vite 200' }],
    explanation:
      'infer introduz uma variável de tipo que o compilador preenche por casamento de padrão. ReturnType, Parameters e Awaited, da biblioteca padrão, são construídos assim.',
  },
  // 5
  {
    id: 'ts-avancado-mapped-type',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Mapped Types',
    title: 'Mapped Types: Criando Flags de Validação',
    summary: 'Gere um tipo novo percorrendo as chaves de outro com [K in keyof T].',
    realWorldContext:
      'Um formulário de cadastro precisa de um objeto "erros" com uma entrada para cada campo. Derivar esse tipo do modelo garante que nenhum campo fique de fora.',
    description:
      'Complete o mapped type ErrosDe<T>: para cada chave K de T, a propriedade é opcional e do tipo string (a mensagem de erro).',
    goal: 'Escrever um mapped type com [K in keyof T] e modificador opcional.',
    templateCode: `type ErrosDe<T> = {
  [K {{blank_0}} keyof T]{{blank_1}} string;
};

interface Cadastro {
  nome: string;
  email: string;
  idade: number;
}

const erros: ErrosDe<Cadastro> = { email: 'E-mail inválido' };
console.log(Object.keys(erros).join(','));
`,
    blanks: [
      { id: 'blank_0', label: 'Iteração sobre chaves', expectedAnswers: ['in'], hint: 'A mesma palavra do for...in.' },
      { id: 'blank_1', label: 'Opcional + tipo', expectedAnswers: ['?:'], hint: 'Cada campo pode ou não ter erro.' },
    ],
    solutionCode: `type ErrosDe<T> = {
  [K in keyof T]?: string;
};

interface Cadastro {
  nome: string;
  email: string;
  idade: number;
}

const erros: ErrosDe<Cadastro> = { email: 'E-mail inválido' };
console.log(Object.keys(erros).join(','));
`,
    typeAssertions: `// @ts-expect-error — "telefone" não é campo de Cadastro
const invalido: ErrosDe<Cadastro> = { telefone: 'x' };`,
    hints: [
      '[K in keyof T] percorre cada chave de T.',
      'O ? depois do colchete torna cada propriedade opcional.',
    ],
    testCases: [{ description: 'Mapa de erros derivado do modelo', expectedOutput: 'email' }],
    explanation:
      'Mapped types são "loops" sobre chaves no nível de tipos. Partial, Readonly e Record são mapped types da biblioteca padrão. Aqui, se Cadastro ganhar um campo, ErrosDe<Cadastro> acompanha automaticamente.',
  },
  // 6
  {
    id: 'ts-avancado-mapped-modificadores',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Mapped Types',
    title: 'Removendo Modificadores com -readonly e -?',
    summary: 'Crie tipos que tornam propriedades mutáveis e obrigatórias.',
    realWorldContext:
      'Um rascunho de pedido tem tudo opcional e imutável; na hora de fechar, todos os campos precisam existir. Mapped types podem remover modificadores para expressar essa transição.',
    description:
      'Complete os dois tipos: Mutavel remove o readonly de todas as propriedades; Completo remove o opcional (o equivalente ao Required nativo).',
    goal: 'Usar os modificadores -readonly e -? em mapped types.',
    templateCode: `type Mutavel<T> = { {{blank_0}} [K in keyof T]: T[K] };
type Completo<T> = { [K in keyof T]{{blank_1}} T[K] };

interface Rascunho {
  readonly cliente?: string;
  readonly total?: number;
}

const pedido: Mutavel<Completo<Rascunho>> = { cliente: 'Ana', total: 0 };
pedido.total = 120;
console.log(pedido.cliente, pedido.total);
`,
    blanks: [
      { id: 'blank_0', label: 'Remover readonly', expectedAnswers: ['-readonly'], hint: 'Um sinal de menos antes do modificador.' },
      { id: 'blank_1', label: 'Remover opcional', expectedAnswers: ['-?:'], hint: 'Sinal de menos antes do ?, seguido dos dois-pontos.' },
    ],
    solutionCode: `type Mutavel<T> = { -readonly [K in keyof T]: T[K] };
type Completo<T> = { [K in keyof T]-?: T[K] };

interface Rascunho {
  readonly cliente?: string;
  readonly total?: number;
}

const pedido: Mutavel<Completo<Rascunho>> = { cliente: 'Ana', total: 0 };
pedido.total = 120;
console.log(pedido.cliente, pedido.total);
`,
    typeAssertions: `// @ts-expect-error — total agora é obrigatório
const incompleto: Completo<Rascunho> = { cliente: 'Bia' };`,
    hints: [
      '-readonly vai antes do colchete; -? vai depois.',
      'Também existem +readonly e +? (o + é implícito quando omitido).',
    ],
    testCases: [{ description: 'Campos obrigatórios e mutáveis', expectedOutput: 'Ana 120' }],
    explanation:
      'Em mapped types, + e - adicionam ou removem os modificadores readonly e ?. O Required<T> nativo é exatamente { [K in keyof T]-?: T[K] }.',
  },
  // 7
  {
    id: 'ts-avancado-template-literal-types',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Template Literal Types',
    title: 'Template Literal Types para Nomes de Eventos',
    summary: 'Gere nomes de handlers ("onSalvar") a partir de uma união de ações.',
    realWorldContext:
      'Componentes expõem callbacks como onSalvar e onExcluir. Gerar esses nomes a partir das ações garante que os dois lados nunca fiquem dessincronizados.',
    description:
      'Complete o tipo Handler: para cada ação, o nome é "on" seguido da ação com a primeira letra maiúscula (use o utilitário intrínseco Capitalize).',
    goal: 'Combinar template literal types com Capitalize.',
    templateCode: `type Acao = 'salvar' | 'excluir';
type Handler = \`on\${{{blank_0}}<Acao>}\`; // "onSalvar" | "onExcluir"

const handlers: Record<Handler, () => string> = {
  onSalvar: () => 'salvo',
  onExcluir: () => 'excluído',
};

const nome: {{blank_1}} = 'onSalvar';
console.log(handlers[nome]());
`,
    blanks: [
      { id: 'blank_0', label: 'Utilitário de maiúscula', expectedAnswers: ['Capitalize'], hint: 'Tipo intrínseco que deixa a primeira letra maiúscula.' },
      { id: 'blank_1', label: 'Tipo da variável', expectedAnswers: ['Handler'], hint: 'O tipo gerado na segunda linha.' },
    ],
    solutionCode: `type Acao = 'salvar' | 'excluir';
type Handler = \`on\${Capitalize<Acao>}\`;

const handlers: Record<Handler, () => string> = {
  onSalvar: () => 'salvo',
  onExcluir: () => 'excluído',
};

const nome: Handler = 'onSalvar';
console.log(handlers[nome]());
`,
    typeAssertions: `// @ts-expect-error — "onsalvar" (minúsculo) não é um Handler
const errado: Handler = 'onsalvar';`,
    hints: [
      'Template literal types usam a mesma sintaxe de crase das template strings.',
      'Quando há uma união dentro do template, o resultado é a união de todas as combinações.',
    ],
    testCases: [{ description: 'Handler gerado a partir da ação', expectedOutput: 'salvo' }],
    explanation:
      'Template literal types montam literais de string no nível de tipos e distribuem sobre uniões. Capitalize, Uncapitalize, Uppercase e Lowercase são utilitários intrínsecos que transformam o texto.',
  },
  // 8
  {
    id: 'ts-avancado-discriminated-union',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Discriminated Unions',
    title: 'Discriminated Union de Notificações',
    summary: 'Use uma propriedade literal comum para diferenciar os membros de uma união.',
    realWorldContext:
      'Uma central de notificações recebe e-mails, SMS e push, cada um com campos próprios. O campo "canal" diz qual formato chegou — e o TypeScript estreita o tipo a partir dele.',
    description:
      'Complete o switch sobre o discriminante e o case do SMS. Dentro de cada case, só os campos daquele canal ficam disponíveis.',
    goal: 'Estreitar uma discriminated union com switch sobre o discriminante.',
    templateCode: `type Notificacao =
  | { canal: 'email'; destinatario: string; assunto: string }
  | { canal: 'sms'; telefone: string }
  | { canal: 'push'; dispositivoId: string };

function destino(n: Notificacao): string {
  switch (n.{{blank_0}}) {
    case 'email':
      return n.destinatario;
    case {{blank_1}}:
      return n.telefone;
    case 'push':
      return n.dispositivoId;
  }
}

console.log(destino({ canal: 'sms', telefone: '+55 85 99999-0000' }));
`,
    blanks: [
      { id: 'blank_0', label: 'Discriminante', expectedAnswers: ['canal'], hint: 'A propriedade literal presente em todos os membros.' },
      { id: 'blank_1', label: 'Literal do SMS', expectedAnswers: ["'sms'"], validationRegex: '^["\']sms["\']$', hint: 'O valor do discriminante, entre aspas.' },
    ],
    solutionCode: `type Notificacao =
  | { canal: 'email'; destinatario: string; assunto: string }
  | { canal: 'sms'; telefone: string }
  | { canal: 'push'; dispositivoId: string };

function destino(n: Notificacao): string {
  switch (n.canal) {
    case 'email':
      return n.destinatario;
    case 'sms':
      return n.telefone;
    case 'push':
      return n.dispositivoId;
  }
}

console.log(destino({ canal: 'sms', telefone: '+55 85 99999-0000' }));
`,
    typeAssertions: `// @ts-expect-error — sms não tem assunto
const invalida: Notificacao = { canal: 'sms', telefone: '1', assunto: 'x' };`,
    hints: [
      'O discriminante é a propriedade com um literal diferente em cada membro.',
      'Em case "sms", n é estreitado para { canal: "sms"; telefone: string }.',
    ],
    testCases: [{ description: 'SMS devolve o telefone', expectedOutput: '+55 85 99999-0000' }],
    explanation:
      'Discriminated unions (ou tagged unions) são o padrão mais importante de modelagem em TypeScript: cada variante carrega só os seus campos, e o switch no discriminante dá narrowing automático e checagem de exaustividade.',
  },
  // 9
  {
    id: 'ts-avancado-exaustividade-never',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Discriminated Unions',
    title: 'Checagem de Exaustividade com never',
    summary: 'Garanta em tempo de compilação que todos os casos de uma união foram tratados.',
    realWorldContext:
      'Quando alguém adiciona um novo meio de pagamento, todos os switches precisam ser atualizados. A checagem com never transforma cada switch esquecido em erro de compilação.',
    description:
      'Complete o default: atribua o valor a uma constante do tipo que não aceita nenhum valor. Se algum caso ficar sem tratamento, essa linha deixa de compilar.',
    goal: 'Usar never no default de um switch para checar exaustividade.',
    templateCode: `type Pagamento = { tipo: 'pix' } | { tipo: 'boleto'; vencimento: string } | { tipo: 'cartao'; parcelas: number };

function taxa(p: Pagamento): number {
  switch (p.tipo) {
    case 'pix':
      return 0;
    case 'boleto':
      return 3.5;
    case 'cartao':
      return p.parcelas > 1 ? 4.99 : 2.99;
    default: {
      const naoTratado: {{blank_0}} = {{blank_1}};
      throw new Error('Pagamento não tratado: ' + JSON.stringify(naoTratado));
    }
  }
}

console.log(taxa({ tipo: 'cartao', parcelas: 3 }));
`,
    blanks: [
      { id: 'blank_0', label: 'Tipo sem valores', expectedAnswers: ['never'], hint: 'Depois de todos os cases, sobrou "nada".' },
      { id: 'blank_1', label: 'Valor atribuído', expectedAnswers: ['p'], hint: 'O parâmetro que está sendo analisado.' },
    ],
    solutionCode: `type Pagamento = { tipo: 'pix' } | { tipo: 'boleto'; vencimento: string } | { tipo: 'cartao'; parcelas: number };

function taxa(p: Pagamento): number {
  switch (p.tipo) {
    case 'pix':
      return 0;
    case 'boleto':
      return 3.5;
    case 'cartao':
      return p.parcelas > 1 ? 4.99 : 2.99;
    default: {
      const naoTratado: never = p;
      throw new Error('Pagamento não tratado: ' + JSON.stringify(naoTratado));
    }
  }
}

console.log(taxa({ tipo: 'cartao', parcelas: 3 }));
`,
    hints: [
      'No default, depois de tratar os três tipos, o TypeScript estreita p para never.',
      'Se um tipo novo for adicionado e não tratado, p não será never e a atribuição falha.',
    ],
    testCases: [{ description: 'Todos os casos tratados', expectedOutput: '4.99' }],
    explanation:
      'never é o tipo vazio. Depois que todos os membros da união foram eliminados pelos cases, só sobra never no default. Atribuir p a uma variável never compila apenas nesse cenário — e o throw ainda protege em runtime contra dados inesperados.',
  },
  // 10
  {
    id: 'ts-avancado-satisfies',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'satisfies',
    title: 'satisfies: Validar sem Perder a Inferência',
    summary: 'Cheque um objeto contra um tipo mantendo os tipos literais de cada propriedade.',
    realWorldContext:
      'Em um mapa de rotas, cada rota precisa ter método e caminho válidos. Com uma anotação, você perde quais rotas existem; com satisfies, o objeto é validado e as chaves continuam conhecidas.',
    description:
      'Complete com o operador que valida o objeto contra Record<string, Rota> sem alargar o tipo inferido (rotas.listar continua existindo no tipo).',
    goal: 'Usar o operador satisfies.',
    templateCode: `interface Rota {
  metodo: 'GET' | 'POST';
  caminho: string;
}

const rotas = {
  listar: { metodo: 'GET', caminho: '/pedidos' },
  criar: { metodo: 'POST', caminho: '/pedidos' },
} {{blank_0}} Record<string, Rota>;

// Com uma anotação ": Record<string, Rota>", rotas.listar seria Rota | undefined.
console.log(rotas.listar.metodo, rotas.criar.caminho);
`,
    blanks: [
      { id: 'blank_0', label: 'Operador', expectedAnswers: ['satisfies'], hint: 'Operador do TS 4.9 que "satisfaz" um tipo sem mudar a inferência.' },
    ],
    solutionCode: `interface Rota {
  metodo: 'GET' | 'POST';
  caminho: string;
}

const rotas = {
  listar: { metodo: 'GET', caminho: '/pedidos' },
  criar: { metodo: 'POST', caminho: '/pedidos' },
} satisfies Record<string, Rota>;

console.log(rotas.listar.metodo, rotas.criar.caminho);
`,
    typeAssertions: `const m: 'GET' = rotas.listar.metodo;
// @ts-expect-error — "remover" não existe no objeto (as chaves foram preservadas)
rotas.remover;`,
    hints: [
      'A sintaxe é: valor satisfies Tipo.',
      'Diferente de "as", satisfies não força nada: se o objeto não for compatível, é erro.',
    ],
    testCases: [{ description: 'Objeto validado e com chaves conhecidas', expectedOutput: 'GET /pedidos' }],
    explanation:
      'satisfies verifica a compatibilidade com o tipo, mas mantém o tipo inferido do valor: as chaves listar e criar continuam conhecidas e metodo mantém o literal "GET". Uma anotação alargaria para Record<string, Rota>; "as" pularia a verificação.',
  },
  // 11
  {
    id: 'ts-avancado-debug-constraint-faltando',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'corrigir_erros',
    topic: 'Generics com Constraints',
    title: 'Depuração: Generic Sem Constraint',
    summary: 'Uma função genérica acessa .length em um T qualquer.',
    realWorldContext:
      'Validações de tamanho mínimo servem para strings e arrays. Uma função genérica para isso precisa dizer ao compilador que T tem length.',
    description:
      'maiorQue usa valor.length, mas T pode ser qualquer tipo. Adicione uma constraint para que T tenha a propriedade length numérica. Não troque T por any.',
    goal: 'Adicionar a constraint correta ao parâmetro de tipo.',
    bugDescription: "Property 'length' does not exist on type 'T'.",
    buggyLineNumbers: [2],
    initialBuggyCode: `function maiorQue<T>(valor: T, minimo: number): boolean {
  return valor.length > minimo;
}

console.log(maiorQue('typescript', 5), maiorQue([1, 2], 5));
`,
    templateCode: `function maiorQue<T>(valor: T, minimo: number): boolean {
  return valor.length > minimo;
}

console.log(maiorQue('typescript', 5), maiorQue([1, 2], 5));
`,
    solutionCode: `function maiorQue<T extends { length: number }>(valor: T, minimo: number): boolean {
  return valor.length > minimo;
}

console.log(maiorQue('typescript', 5), maiorQue([1, 2], 5));
`,
    typeAssertions: `// @ts-expect-error — number não tem length
maiorQue(10, 5);`,
    hints: [
      'Um T sem constraint pode ser number, que não tem length.',
      'Use <T extends { length: number }>.',
    ],
    testCases: [
      { description: 'String longa', expectedOutput: 'true', testFunction: `return maiorQue('typescript', 5) === true;` },
      { description: 'Array curto', expectedOutput: 'false', testFunction: `return maiorQue([1, 2], 5) === false;` },
    ],
    explanation:
      'Sem constraint, T é tratado como desconhecido e nenhuma propriedade é permitida. { length: number } é uma interface estrutural: strings, arrays e qualquer objeto com length satisfazem.',
    validationRules: [{ id: 'rule-no-any', type: 'not_contains', target: 'any', description: 'Não usa any' }],
  },
  // 12
  {
    id: 'ts-avancado-prever-declaration-merging',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'prever_saida',
    topic: 'Declaration Merging',
    title: 'Previsão de Saída: Função + Namespace com o Mesmo Nome',
    summary: 'Preveja a saída quando um namespace se funde a uma função.',
    realWorldContext:
      'Bibliotecas antigas (e tipos de bibliotecas como jQuery) usam declaration merging para expor uma função que também tem propriedades, como $.ajax.',
    description:
      'Uma função e um namespace com o mesmo nome se fundem: o namespace adiciona propriedades à função. Qual é a saída?',
    goal: 'Entender o declaration merging de função com namespace.',
    codeToPredict: `function formatar(valor: number): string {
  return formatar.simbolo + ' ' + valor.toFixed(formatar.casas);
}

namespace formatar {
  export const simbolo = 'R$';
  export const casas = 2;
}

console.log(formatar(7.5), typeof formatar);
`,
    templateCode: `function formatar(valor: number): string {
  return formatar.simbolo + ' ' + valor.toFixed(formatar.casas);
}

namespace formatar {
  export const simbolo = 'R$';
  export const casas = 2;
}

console.log(formatar(7.5), typeof formatar);
`,
    expectedOutputPrediction: 'R$ 7.50 function',
    solutionCode: `function formatar(valor: number): string {
  return formatar.simbolo + ' ' + valor.toFixed(formatar.casas);
}

namespace formatar {
  export const simbolo = 'R$';
  export const casas = 2;
}

console.log(formatar(7.5), typeof formatar);
`,
    hints: [
      'O namespace vira código que adiciona simbolo e casas como propriedades da função.',
      'formatar continua sendo uma função.',
    ],
    testCases: [],
    explanation:
      'Declarações com o mesmo nome podem se fundir. Interfaces se fundem só no nível de tipos; um namespace fundido a uma função gera código real que pendura propriedades na função. typeof continua "function". Em código novo, prefira módulos ES, mas é útil reconhecer o padrão em arquivos .d.ts.',
  },
  // 13
  {
    id: 'ts-avancado-livre-emissor-tipado',
    language: 'typescript',
    difficulty: 'avancado',
    type: 'codigo_livre',
    topic: 'keyof & Indexed Access Types',
    title: 'Código Livre: Emissor de Eventos Totalmente Tipado',
    summary: 'Implemente um event emitter em que cada evento tem o seu próprio tipo de payload.',
    realWorldContext:
      'Barramentos de eventos são comuns em frontends (ex.: "carrinho:atualizado" com o total). Sem tipagem, um handler pode esperar um campo que o emissor nunca envia.',
    description:
      'Implemente os métodos on e emit da classe Emissor<E>. on registra um handler para o evento K; emit chama, na ordem de registro, todos os handlers do evento com o payload. on deve devolver uma função que remove aquele handler.',
    goal: 'Implementar on/emit respeitando o mapa de eventos E.',
    templateCode: `class Emissor<E extends object> {
  private handlers: { [K in keyof E]?: Array<(payload: E[K]) => void> } = {};

  on<K extends keyof E>(evento: K, handler: (payload: E[K]) => void): () => void {
    // Implemente aqui
    return () => {};
  }

  emit<K extends keyof E>(evento: K, payload: E[K]): void {
    // Implemente aqui
  }
}
`,
    solutionCode: `class Emissor<E extends object> {
  private handlers: { [K in keyof E]?: Array<(payload: E[K]) => void> } = {};

  on<K extends keyof E>(evento: K, handler: (payload: E[K]) => void): () => void {
    const lista = this.handlers[evento] ?? [];
    lista.push(handler);
    this.handlers[evento] = lista;
    return () => {
      this.handlers[evento] = (this.handlers[evento] ?? []).filter(h => h !== handler);
    };
  }

  emit<K extends keyof E>(evento: K, payload: E[K]): void {
    for (const handler of this.handlers[evento] ?? []) {
      handler(payload);
    }
  }
}
`,
    typeAssertions: `interface EventosLoja {
  'carrinho:atualizado': { total: number };
  'usuario:saiu': undefined;
}
const loja = new Emissor<EventosLoja>();
loja.on('carrinho:atualizado', p => { const t: number = p.total; });
loja.emit('carrinho:atualizado', { total: 10 });
// @ts-expect-error — payload errado para o evento
loja.emit('carrinho:atualizado', { quantidade: 1 });
// @ts-expect-error — evento inexistente
loja.on('pedido:criado', () => {});`,
    hints: [
      'Busque a lista do evento (ou []), faça push e salve de volta em this.handlers[evento].',
      'A função de remoção pode filtrar a lista mantendo só os handlers diferentes do registrado.',
      'Em emit, percorra this.handlers[evento] ?? [] chamando cada handler.',
    ],
    testCases: [
      { description: 'Entrega o payload aos handlers', expectedOutput: '10', testFunction: `const e = new Emissor(); let recebido = 0; e.on('x', p => { recebido = p.total; }); e.emit('x', { total: 10 }); return recebido === 10;` },
      { description: 'Mantém a ordem de registro', expectedOutput: 'ab', testFunction: `const e = new Emissor(); let s = ''; e.on('x', () => { s += 'a'; }); e.on('x', () => { s += 'b'; }); e.emit('x', null); return s === 'ab';` },
      { description: 'A função devolvida remove o handler', expectedOutput: '1', testFunction: `const e = new Emissor(); let n = 0; const sair = e.on('x', () => { n++; }); e.emit('x', null); sair(); e.emit('x', null); return n === 1;` },
    ],
    explanation:
      'O mapa de eventos E liga cada nome de evento ao seu payload. Com K extends keyof E e E[K], o compilador garante que on e emit usem o mesmo formato para o mesmo evento — um contrato que bibliotecas como mitt e o EventEmitter tipado do Node usam. A constraint é "E extends object", e não Record<string, unknown>: interfaces não têm index signature implícita, então uma interface de eventos seria recusada por Record<string, unknown>.',
  },
];
