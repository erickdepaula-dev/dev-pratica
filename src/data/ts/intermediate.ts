import { TsExercise } from '../../types/exercise';

/**
 * Trilha TypeScript — nível intermediário.
 * Type guards (typeof, in, instanceof), narrowing, unknown, generics em funções,
 * utility types (Partial, Pick, Omit, Record), readonly, classes com modificadores.
 * IDs: `ts-intermediario-<slug>` (checado pelo tipo TsExercise<'intermediario'>).
 * Todo o código assume `strict: true`.
 */
export const tsIntermediateExercises: TsExercise<'intermediario'>[] = [
  // 1
  {
    id: 'ts-intermediario-typeof-guard',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Type Guards & Narrowing',
    title: 'Narrowing com typeof',
    summary: 'Use typeof para separar os casos de uma união string | number.',
    realWorldContext:
      'Campos de planilha podem chegar como número (1500) ou texto ("1.500,00"). Antes de formatar, é preciso saber qual dos dois você recebeu — e o TypeScript acompanha essa checagem.',
    description:
      'Complete o type guard para que, dentro do if, valor seja tratado como number (e no else, como string).',
    goal: 'Estreitar uma união usando typeof.',
    templateCode: `function normalizarValor(valor: string | number): number {
  if ({{blank_0}} valor === {{blank_1}}) {
    // aqui valor é number
    return valor;
  }
  // aqui valor é string
  return Number(valor.replace('.', '').replace(',', '.'));
}

console.log(normalizarValor(1500), normalizarValor('1.500,50'));
`,
    blanks: [
      { id: 'blank_0', label: 'Operador de tipo em runtime', expectedAnswers: ['typeof'], hint: 'O operador do JavaScript que devolve o nome do tipo primitivo.' },
      { id: 'blank_1', label: 'Nome do tipo comparado', expectedAnswers: ["'number'"], validationRegex: '^["\']number["\']$', hint: 'O nome do tipo, como string entre aspas.' },
    ],
    solutionCode: `function normalizarValor(valor: string | number): number {
  if (typeof valor === 'number') {
    return valor;
  }
  return Number(valor.replace('.', '').replace(',', '.'));
}

console.log(normalizarValor(1500), normalizarValor('1.500,50'));
`,
    hints: [
      'typeof x === "number" é reconhecido pelo TypeScript como type guard.',
      'Repare que, no else, você pode chamar .replace sem erro: o TypeScript sabe que só sobrou string.',
    ],
    testCases: [{ description: 'Número passa direto; texto é convertido', expectedOutput: '1500 1500.5' }],
    explanation:
      'Narrowing é o TypeScript refinando o tipo de uma variável a partir de checagens de runtime. typeof funciona para primitivos (string, number, boolean, bigint, symbol, undefined, function, object).',
  },
  // 2
  {
    id: 'ts-intermediario-in-guard',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Type Guards & Narrowing',
    title: 'Narrowing com o Operador in',
    summary: 'Diferencie dois formatos de objeto checando a existência de uma propriedade.',
    realWorldContext:
      'Um endereço de entrega pode ser físico (rua e número) ou um ponto de retirada (código do locker). O operador in identifica qual formato chegou.',
    description:
      'Complete a checagem que identifica se o destino é um Locker, olhando se a propriedade "codigoLocker" existe no objeto.',
    goal: 'Estreitar uma união de objetos usando o operador in.',
    templateCode: `interface Endereco { rua: string; numero: number }
interface Locker { codigoLocker: string }

function descreverDestino(destino: Endereco | Locker): string {
  if ({{blank_0}} {{blank_1}} destino) {
    return 'Retirar no locker ' + destino.codigoLocker;
  }
  return 'Entregar em ' + destino.rua + ', ' + destino.numero;
}

console.log(descreverDestino({ codigoLocker: 'L-17' }));
`,
    blanks: [
      { id: 'blank_0', label: 'Nome da propriedade (string)', expectedAnswers: ["'codigoLocker'"], validationRegex: '^["\']codigoLocker["\']$', hint: 'O nome da propriedade entre aspas.' },
      { id: 'blank_1', label: 'Operador', expectedAnswers: ['in'], hint: 'Operador do JavaScript que testa se uma chave existe no objeto.' },
    ],
    solutionCode: `interface Endereco { rua: string; numero: number }
interface Locker { codigoLocker: string }

function descreverDestino(destino: Endereco | Locker): string {
  if ('codigoLocker' in destino) {
    return 'Retirar no locker ' + destino.codigoLocker;
  }
  return 'Entregar em ' + destino.rua + ', ' + destino.numero;
}

console.log(descreverDestino({ codigoLocker: 'L-17' }));
`,
    hints: [
      'A sintaxe é "propriedade" in objeto.',
      'typeof não serve aqui: os dois formatos são "object".',
    ],
    testCases: [{ description: 'Locker é reconhecido pela propriedade', expectedOutput: 'Retirar no locker L-17' }],
    explanation:
      'O operador in é um type guard para uniões de objetos: se a chave existe, o TypeScript estreita para os membros da união que a declaram. Fora do if, só sobra Endereco.',
  },
  // 3
  {
    id: 'ts-intermediario-instanceof-erro',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'unknown & Tratamento de Erros',
    title: 'Erros Tipados com instanceof',
    summary: 'Trate o erro do catch, que é unknown, usando instanceof.',
    realWorldContext:
      'Qualquer coisa pode ser lançada em JavaScript (até uma string). Por isso, com strict, o erro do catch é unknown — e você precisa confirmar que é um Error antes de ler .message.',
    description:
      'Complete o type guard para acessar erro.message apenas quando o valor lançado for uma instância de Error.',
    goal: 'Estreitar unknown com instanceof.',
    templateCode: `function dividir(a: number, b: number): number {
  if (b === 0) throw new Error('Divisão por zero');
  return a / b;
}

try {
  dividir(10, 0);
} catch (erro) {
  if (erro {{blank_0}} {{blank_1}}) {
    console.log('Falhou: ' + erro.message);
  } else {
    console.log('Erro desconhecido');
  }
}
`,
    blanks: [
      { id: 'blank_0', label: 'Operador', expectedAnswers: ['instanceof'], hint: 'Testa se um objeto foi criado por uma classe.' },
      { id: 'blank_1', label: 'Classe', expectedAnswers: ['Error'], hint: 'A classe base de erros do JavaScript.' },
    ],
    solutionCode: `function dividir(a: number, b: number): number {
  if (b === 0) throw new Error('Divisão por zero');
  return a / b;
}

try {
  dividir(10, 0);
} catch (erro) {
  if (erro instanceof Error) {
    console.log('Falhou: ' + erro.message);
  } else {
    console.log('Erro desconhecido');
  }
}
`,
    hints: [
      'Com strict, a variável do catch é unknown (useUnknownInCatchVariables).',
      'valor instanceof Classe estreita para o tipo da classe.',
    ],
    testCases: [{ description: 'Mensagem lida só após confirmar Error', expectedOutput: 'Falhou: Divisão por zero' }],
    explanation:
      'unknown é o "any seguro": aceita qualquer valor, mas não deixa usar nada até você provar o tipo. instanceof é o guard natural para classes, incluindo Error e suas subclasses.',
  },
  // 4
  {
    id: 'ts-intermediario-unknown-json',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'unknown & Tratamento de Erros',
    title: 'unknown em vez de any para Dados Externos',
    summary: 'Receba um JSON como unknown e valide antes de usar.',
    realWorldContext:
      'Webhooks e APIs de terceiros podem mudar o formato sem aviso. Tipar a entrada como unknown obriga a validar antes de confiar no dado.',
    description:
      'Complete o tipo do parâmetro (o "any seguro") e a checagem que exclui null — lembre que typeof null é "object" em JavaScript.',
    goal: 'Usar unknown e estreitá-lo até um objeto com a propriedade esperada.',
    templateCode: `function extrairId(payload: {{blank_0}}): number | null {
  if (typeof payload === 'object' && payload !== {{blank_1}} && 'id' in payload) {
    const id = payload.id;
    return typeof id === 'number' ? id : null;
  }
  return null;
}

console.log(extrairId(JSON.parse('{"id": 7}')), extrairId('texto'));
`,
    blanks: [
      { id: 'blank_0', label: 'Tipo seguro para dados desconhecidos', expectedAnswers: ['unknown'], hint: 'Não é any.' },
      { id: 'blank_1', label: 'Valor a excluir', expectedAnswers: ['null'], hint: 'typeof desse valor também é "object".' },
    ],
    solutionCode: `function extrairId(payload: unknown): number | null {
  if (typeof payload === 'object' && payload !== null && 'id' in payload) {
    const id = payload.id;
    return typeof id === 'number' ? id : null;
  }
  return null;
}

console.log(extrairId(JSON.parse('{"id": 7}')), extrairId('texto'));
`,
    typeAssertions: `function semValidar(payload: unknown) {
  // @ts-expect-error — unknown não permite acesso direto
  return payload.id;
}`,
    hints: [
      'any desligaria a checagem; unknown obriga a validar.',
      'typeof null === "object" é uma pegadinha histórica do JavaScript.',
    ],
    testCases: [{ description: 'Só devolve id numérico de objetos válidos', expectedOutput: '7 null' }],
    explanation:
      'Com unknown, o TypeScript só libera o acesso a payload.id depois de três provas: é objeto, não é null e tem a chave "id". Mesmo assim id continua unknown, então ainda checamos se é number.',
  },
  // 5
  {
    id: 'ts-intermediario-generic-primeiro',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Generics',
    title: 'Primeira Função Genérica',
    summary: 'Escreva uma função que funciona para qualquer tipo de lista sem perder o tipo do elemento.',
    realWorldContext:
      'Funções utilitárias (primeiro, ultimo, agrupar) são usadas com listas de produtos, usuários, pedidos... Generics evitam reescrever a mesma função para cada tipo — e sem cair no any.',
    description:
      'Complete o parâmetro de tipo da função e o tipo da lista. O retorno deve ser do mesmo tipo dos elementos (ou undefined se a lista estiver vazia).',
    goal: 'Declarar uma função genérica com parâmetro de tipo T.',
    templateCode: `function primeiro{{blank_0}}(lista: {{blank_1}}): T | undefined {
  return lista[0];
}

const nome = primeiro(['Ana', 'Bia']);
const preco = primeiro([9.9, 19.9]);
console.log(nome?.toUpperCase(), preco?.toFixed(2));
`,
    blanks: [
      { id: 'blank_0', label: 'Parâmetro de tipo', expectedAnswers: ['<T>'], hint: 'Entre < >, logo após o nome da função.' },
      { id: 'blank_1', label: 'Tipo da lista', expectedAnswers: ['T[]'], validationRegex: '^(T\\[\\]|Array<T>)$', hint: 'Uma lista de T.' },
    ],
    solutionCode: `function primeiro<T>(lista: T[]): T | undefined {
  return lista[0];
}

const nome = primeiro(['Ana', 'Bia']);
const preco = primeiro([9.9, 19.9]);
console.log(nome?.toUpperCase(), preco?.toFixed(2));
`,
    typeAssertions: `const n: string | undefined = primeiro(['a']);
// @ts-expect-error — o tipo do elemento é preservado: number não vira string
const s: string | undefined = primeiro([1, 2]);`,
    hints: [
      'O parâmetro de tipo é declarado assim: function f<T>(...).',
      'Na chamada, T é inferido a partir do argumento: primeiro(["Ana"]) faz T = string.',
    ],
    testCases: [{ description: 'Tipo do elemento é preservado', expectedOutput: 'ANA 9.90' }],
    explanation:
      'Generics são "parâmetros para tipos". T é inferido em cada chamada, então primeiro(["Ana"]) devolve string | undefined e primeiro([9.9]) devolve number | undefined. Com any, você perderia o autocompletar e a checagem.',
  },
  // 6
  {
    id: 'ts-intermediario-partial-atualizacao',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Utility Types',
    title: 'Atualização Parcial com Partial<T>',
    summary: 'Use Partial para aceitar só os campos que mudaram.',
    realWorldContext:
      'Rotas PATCH de APIs recebem apenas os campos alterados. Partial<T> descreve exatamente isso sem duplicar a interface com todos os campos opcionais.',
    description:
      'Complete o tipo do parâmetro mudancas para que todas as propriedades de Produto sejam opcionais.',
    goal: 'Usar o utility type Partial<T>.',
    templateCode: `interface Produto {
  nome: string;
  preco: number;
  estoque: number;
}

function atualizar(produto: Produto, mudancas: {{blank_0}}): Produto {
  return { ...produto, ...mudancas };
}

const caneta: Produto = { nome: 'Caneta', preco: 2.5, estoque: 100 };
console.log(atualizar(caneta, { preco: 3 }).preco);
`,
    blanks: [
      { id: 'blank_0', label: 'Tipo com tudo opcional', expectedAnswers: ['Partial<Produto>'], hint: 'Utility type que torna todas as propriedades opcionais.' },
    ],
    solutionCode: `interface Produto {
  nome: string;
  preco: number;
  estoque: number;
}

function atualizar(produto: Produto, mudancas: Partial<Produto>): Produto {
  return { ...produto, ...mudancas };
}

const caneta: Produto = { nome: 'Caneta', preco: 2.5, estoque: 100 };
console.log(atualizar(caneta, { preco: 3 }).preco);
`,
    typeAssertions: `atualizar(caneta, {});
// @ts-expect-error — Partial não aceita propriedades que não existem
atualizar(caneta, { cor: 'azul' });`,
    hints: [
      'Partial<T> marca todas as propriedades de T como opcionais.',
      'Ele não aceita chaves inventadas: só as que existem em T.',
    ],
    testCases: [{ description: 'Atualiza só o preço', expectedOutput: '3' }],
    explanation:
      'Partial<T> é um mapped type embutido: { [K in keyof T]?: T[K] }. Ele mantém os tipos de cada campo e recusa propriedades desconhecidas, então { cor: "azul" } é erro.',
  },
  // 7
  {
    id: 'ts-intermediario-pick-omit',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Utility Types',
    title: 'Derivando Tipos com Pick e Omit',
    summary: 'Crie versões de um tipo com apenas alguns campos, ou sem alguns campos.',
    realWorldContext:
      'O registro do usuário no banco tem senha; a resposta da API nunca deve ter. Derivar o tipo público com Omit garante isso sem copiar a interface.',
    description:
      'Complete os dois aliases: UsuarioPublico é Usuario sem a senha; Credenciais tem só email e senha.',
    goal: 'Usar Omit<T, K> e Pick<T, K>.',
    templateCode: `interface Usuario {
  id: number;
  email: string;
  senha: string;
  nome: string;
}

type UsuarioPublico = {{blank_0}}<Usuario, 'senha'>;
type Credenciais = {{blank_1}}<Usuario, 'email' | 'senha'>;

const publico: UsuarioPublico = { id: 1, email: 'ana@ex.com', nome: 'Ana' };
const login: Credenciais = { email: 'ana@ex.com', senha: '123456' };
console.log(Object.keys(publico).length, Object.keys(login).length);
`,
    blanks: [
      { id: 'blank_0', label: 'Remove chaves', expectedAnswers: ['Omit'], hint: 'Omite as chaves listadas.' },
      { id: 'blank_1', label: 'Seleciona chaves', expectedAnswers: ['Pick'], hint: '"Escolhe" só as chaves listadas.' },
    ],
    solutionCode: `interface Usuario {
  id: number;
  email: string;
  senha: string;
  nome: string;
}

type UsuarioPublico = Omit<Usuario, 'senha'>;
type Credenciais = Pick<Usuario, 'email' | 'senha'>;

const publico: UsuarioPublico = { id: 1, email: 'ana@ex.com', nome: 'Ana' };
const login: Credenciais = { email: 'ana@ex.com', senha: '123456' };
console.log(Object.keys(publico).length, Object.keys(login).length);
`,
    typeAssertions: `// @ts-expect-error — UsuarioPublico não tem senha
const vazado: UsuarioPublico = { id: 1, email: 'a', nome: 'b', senha: 'x' };`,
    hints: [
      'Omit<T, "chave"> remove chaves; Pick<T, "a" | "b"> mantém só as listadas.',
      'Várias chaves se passam como união de literais.',
    ],
    testCases: [{ description: 'Tipos derivados com 3 e 2 campos', expectedOutput: '3 2' }],
    explanation:
      'Pick e Omit derivam tipos novos a partir de um existente. Se Usuario ganhar um campo, os derivados acompanham automaticamente — ao contrário de interfaces copiadas à mão.',
  },
  // 8
  {
    id: 'ts-intermediario-record-planos',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Utility Types',
    title: 'Tabela de Preços com Record',
    summary: 'Use Record para garantir uma entrada para cada chave de uma união.',
    realWorldContext:
      'Ao criar um plano novo ("enterprise"), é fácil esquecer de cadastrar o preço. Com Record<Plano, number>, o compilador acusa a chave faltando.',
    description:
      'Complete o tipo da tabela: um objeto que tem exatamente uma chave para cada Plano, com valor numérico.',
    goal: 'Usar Record<K, V> com uma união de literais como chaves.',
    templateCode: `type Plano = 'gratis' | 'pro' | 'equipe';

const precoMensal: {{blank_0}} = {
  gratis: 0,
  pro: 39,
  equipe: 129,
};

function custoAnual(plano: Plano): number {
  return precoMensal[plano] * 12;
}

console.log(custoAnual('pro'));
`,
    blanks: [
      { id: 'blank_0', label: 'Tipo da tabela', expectedAnswers: ['Record<Plano, number>'], hint: 'Record<Chaves, Valor>.' },
    ],
    solutionCode: `type Plano = 'gratis' | 'pro' | 'equipe';

const precoMensal: Record<Plano, number> = {
  gratis: 0,
  pro: 39,
  equipe: 129,
};

function custoAnual(plano: Plano): number {
  return precoMensal[plano] * 12;
}

console.log(custoAnual('pro'));
`,
    typeAssertions: `// @ts-expect-error — faltam as chaves pro e equipe
const incompleta: Record<Plano, number> = { gratis: 0 };`,
    hints: [
      'O primeiro parâmetro do Record são as chaves; o segundo, o tipo dos valores.',
      'Com uma união como chave, todas as chaves são obrigatórias.',
    ],
    testCases: [{ description: 'Custo anual do plano pro', expectedOutput: '468' }],
    explanation:
      'Record<K, V> cria um objeto com as chaves K e valores V. Quando K é uma união de literais, cada literal vira uma propriedade obrigatória — e o acesso precoMensal[plano] já é tipado como number.',
  },
  // 9
  {
    id: 'ts-intermediario-readonly',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'readonly & Imutabilidade',
    title: 'Propriedades e Arrays readonly',
    summary: 'Impeça alterações acidentais em configuração compartilhada.',
    realWorldContext:
      'Uma configuração lida no início da aplicação é compartilhada por vários módulos. Se um deles modificar a lista de origens permitidas, o bug aparece em outro lugar, muito depois.',
    description:
      'Complete a interface: versao não pode ser reatribuída e origensPermitidas deve ser um array somente leitura de strings.',
    goal: 'Usar o modificador readonly em propriedade e em array.',
    templateCode: `interface ConfigApi {
  {{blank_0}} versao: string;
  origensPermitidas: {{blank_1}};
}

const config: ConfigApi = {
  versao: 'v2',
  origensPermitidas: ['https://app.exemplo.com'],
};

console.log(config.versao, config.origensPermitidas.length);
`,
    blanks: [
      { id: 'blank_0', label: 'Modificador', expectedAnswers: ['readonly'], hint: 'Impede reatribuir a propriedade.' },
      { id: 'blank_1', label: 'Array somente leitura', expectedAnswers: ['readonly string[]'], validationRegex: '^(readonly\\s+string\\[\\]|ReadonlyArray<string>)$', hint: 'O mesmo modificador antes de string[] (ou ReadonlyArray<string>).' },
    ],
    solutionCode: `interface ConfigApi {
  readonly versao: string;
  origensPermitidas: readonly string[];
}

const config: ConfigApi = {
  versao: 'v2',
  origensPermitidas: ['https://app.exemplo.com'],
};

console.log(config.versao, config.origensPermitidas.length);
`,
    typeAssertions: `// @ts-expect-error — versao é readonly
config.versao = 'v3';
// @ts-expect-error — arrays readonly não têm push
config.origensPermitidas.push('http://malicioso.com');`,
    hints: [
      'readonly antes do nome da propriedade impede a reatribuição.',
      'readonly string[] remove os métodos que alteram o array (push, splice, sort...).',
    ],
    testCases: [{ description: 'Configuração somente leitura', expectedOutput: 'v2 1' }],
    explanation:
      'readonly é uma checagem de compilação: impede reatribuições e mutações pelo tipo. Ele não congela o objeto em runtime (para isso existe Object.freeze), mas impede que o seu código o modifique por engano.',
  },
  // 10
  {
    id: 'ts-intermediario-classe-modificadores',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Classes & Modificadores de Acesso',
    title: 'Classe com private e Parameter Properties',
    summary: 'Proteja o saldo de uma conta e declare propriedades direto no construtor.',
    realWorldContext:
      'O saldo de uma conta só deve mudar por operações controladas (depósito, saque). Se qualquer parte do código pudesse escrever conta.saldo, regras de negócio seriam contornadas.',
    description:
      'Complete: saldo deve ser acessível só dentro da classe; titular deve ser declarado como propriedade pública e somente leitura direto no construtor.',
    goal: 'Usar private e parameter properties (public readonly no construtor).',
    templateCode: `class ContaBancaria {
  {{blank_0}} saldo = 0;

  constructor({{blank_1}} titular: string) {}

  depositar(valor: number): void {
    if (valor <= 0) throw new Error('Valor inválido');
    this.saldo += valor;
  }

  extrato(): string {
    return this.titular + ': R$ ' + this.saldo.toFixed(2);
  }
}

const conta = new ContaBancaria('Ana');
conta.depositar(150);
console.log(conta.extrato());
`,
    blanks: [
      { id: 'blank_0', label: 'Modificador de acesso', expectedAnswers: ['private'], hint: 'Só a própria classe enxerga.' },
      { id: 'blank_1', label: 'Parameter property', expectedAnswers: ['public readonly'], validationRegex: '^(public\\s+)?readonly$', hint: 'Dois modificadores: visibilidade pública e somente leitura.' },
    ],
    solutionCode: `class ContaBancaria {
  private saldo = 0;

  constructor(public readonly titular: string) {}

  depositar(valor: number): void {
    if (valor <= 0) throw new Error('Valor inválido');
    this.saldo += valor;
  }

  extrato(): string {
    return this.titular + ': R$ ' + this.saldo.toFixed(2);
  }
}

const conta = new ContaBancaria('Ana');
conta.depositar(150);
console.log(conta.extrato());
`,
    typeAssertions: `// @ts-expect-error — saldo é private
conta.saldo = 1000000;
// @ts-expect-error — titular é readonly
conta.titular = 'Outro';`,
    hints: [
      'private restringe o acesso ao corpo da classe.',
      'Um modificador no parâmetro do construtor (public, private, readonly) cria e atribui a propriedade automaticamente.',
    ],
    testCases: [{ description: 'Saldo só muda por depósito', expectedOutput: 'Ana: R$ 150.00' }],
    explanation:
      'Parameter properties economizam a declaração + atribuição no construtor. private e readonly são checagens do TypeScript; para privacidade real em runtime, o JavaScript tem campos #privados.',
  },
  // 11
  {
    id: 'ts-intermediario-debug-find-undefined',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'corrigir_erros',
    topic: 'Type Guards & Narrowing',
    title: 'Depuração: Resultado de find Pode Ser undefined',
    summary: 'O código usa o retorno de find como se o item sempre existisse.',
    realWorldContext:
      'Buscar um produto por código que não existe derruba a página com "Cannot read properties of undefined". O tipo de retorno de find avisa sobre isso.',
    description:
      'precoDoProduto quebra quando o código não existe. Corrija para retornar 0 nesse caso, sem usar o operador ! (non-null assertion).',
    goal: 'Tratar o caso undefined do retorno de find.',
    bugDescription: "'produto' is possibly 'undefined'.",
    buggyLineNumbers: [10],
    initialBuggyCode: `interface Produto {
  codigo: string;
  preco: number;
}

const catalogo: Produto[] = [{ codigo: 'A1', preco: 10 }, { codigo: 'B2', preco: 25 }];

function precoDoProduto(codigo: string): number {
  const produto = catalogo.find(p => p.codigo === codigo);
  return produto.preco;
}

console.log(precoDoProduto('B2'), precoDoProduto('ZZ'));
`,
    templateCode: `interface Produto {
  codigo: string;
  preco: number;
}

const catalogo: Produto[] = [{ codigo: 'A1', preco: 10 }, { codigo: 'B2', preco: 25 }];

function precoDoProduto(codigo: string): number {
  const produto = catalogo.find(p => p.codigo === codigo);
  return produto.preco;
}

console.log(precoDoProduto('B2'), precoDoProduto('ZZ'));
`,
    solutionCode: `interface Produto {
  codigo: string;
  preco: number;
}

const catalogo: Produto[] = [{ codigo: 'A1', preco: 10 }, { codigo: 'B2', preco: 25 }];

function precoDoProduto(codigo: string): number {
  const produto = catalogo.find(p => p.codigo === codigo);
  return produto?.preco ?? 0;
}

console.log(precoDoProduto('B2'), precoDoProduto('ZZ'));
`,
    hints: [
      'O tipo de produto é Produto | undefined.',
      'Use produto?.preco ?? 0, ou um if (!produto) return 0.',
      'O operador ! apenas silencia o compilador: o erro em runtime continuaria.',
    ],
    testCases: [
      { description: 'Produto existente', expectedOutput: '25', testFunction: `return precoDoProduto('B2') === 25;` },
      { description: 'Produto inexistente retorna 0', expectedOutput: '0', testFunction: `return precoDoProduto('ZZ') === 0;` },
    ],
    explanation:
      'Array.prototype.find devolve T | undefined. Com strict, o TypeScript exige tratar o undefined. Optional chaining (?.) com ?? é a forma mais concisa; o non-null assertion (!) só esconderia o problema.',
    validationRules: [{ id: 'rule-no-bang', type: 'not_contains', target: 'produto!', description: 'Não usa non-null assertion' }],
  },
  // 12
  {
    id: 'ts-intermediario-prever-private-runtime',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'prever_saida',
    topic: 'Classes & Modificadores de Acesso',
    title: 'Previsão de Saída: private Não Esconde em Runtime',
    summary: 'Descubra o que JSON.stringify mostra de uma classe com propriedade private.',
    realWorldContext:
      'Serializar um objeto para log ou resposta de API pode vazar dados "privados": o private do TypeScript só existe na compilação.',
    description: 'A classe tem uma propriedade pública e uma private, ambas criadas no construtor. Qual é a saída?',
    goal: 'Entender que private é só uma checagem de compilação.',
    codeToPredict: `class Funcionario {
  constructor(public nome: string, private salario: number) {}
}

const f = new Funcionario('Ana', 5000);
console.log(JSON.stringify(f));
`,
    templateCode: `class Funcionario {
  constructor(public nome: string, private salario: number) {}
}

const f = new Funcionario('Ana', 5000);
console.log(JSON.stringify(f));
`,
    expectedOutputPrediction: '{"nome":"Ana","salario":5000}',
    solutionCode: `class Funcionario {
  constructor(public nome: string, private salario: number) {}
}

const f = new Funcionario('Ana', 5000);
console.log(JSON.stringify(f));
`,
    hints: [
      'Parameter properties viram propriedades comuns no JavaScript emitido.',
      'O TypeScript apaga private ao compilar.',
    ],
    testCases: [],
    explanation:
      'private impede o acesso apenas no código TypeScript. No JavaScript gerado, salario é uma propriedade normal e aparece no JSON. Para esconder de verdade, use campos #privados (que JSON.stringify ignora) ou um método toJSON.',
  },
  // 13
  {
    id: 'ts-intermediario-livre-agrupar-por',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'codigo_livre',
    topic: 'Generics',
    title: 'Código Livre: Função Genérica agruparPor',
    summary: 'Implemente uma função genérica que agrupa itens por uma chave calculada.',
    realWorldContext:
      'Relatórios agrupam pedidos por status, despesas por categoria, alunos por turma. Uma única função genérica serve para todos esses casos.',
    description:
      'Implemente agruparPor(itens, chave): para cada item, calcule chave(item) e coloque o item na lista dessa chave. A ordem dos itens dentro de cada grupo deve ser preservada.',
    goal: 'Retornar um Record<string, T[]> com os itens agrupados.',
    templateCode: `function agruparPor<T>(itens: T[], chave: (item: T) => string): Record<string, T[]> {
  // Implemente aqui
  return {};
}
`,
    solutionCode: `function agruparPor<T>(itens: T[], chave: (item: T) => string): Record<string, T[]> {
  const grupos: Record<string, T[]> = {};
  for (const item of itens) {
    const k = chave(item);
    if (!grupos[k]) grupos[k] = [];
    grupos[k].push(item);
  }
  return grupos;
}
`,
    typeAssertions: `interface Pedido { id: number; status: string }
const g: Record<string, Pedido[]> = agruparPor([{ id: 1, status: 'pago' }], p => p.status);
// @ts-expect-error — a função de chave precisa devolver string
agruparPor([1, 2], n => n * 2);`,
    hints: [
      'Comece com um objeto vazio do tipo Record<string, T[]>.',
      'Se o grupo ainda não existe, crie um array vazio antes do push.',
      'Note que, ao chamar, p em p => p.status é inferido como Pedido graças ao T.',
    ],
    testCases: [
      { description: 'Agrupa números por paridade', expectedOutput: '{ par: [2, 4], impar: [1, 3] }', testFunction: `const g = agruparPor([1, 2, 3, 4], n => (n % 2 === 0 ? 'par' : 'impar')); return g.par.join() === '2,4' && g.impar.join() === '1,3';` },
      { description: 'Lista vazia gera objeto vazio', expectedOutput: '{}', testFunction: `return Object.keys(agruparPor([], x => String(x))).length === 0;` },
      { description: 'Preserva a ordem dentro do grupo', expectedOutput: 'b1,b2', testFunction: `const g = agruparPor([{ n: 'b1', t: 'b' }, { n: 'a1', t: 'a' }, { n: 'b2', t: 'b' }], i => i.t); return g.b.map(i => i.n).join() === 'b1,b2';` },
    ],
    explanation:
      'O T conecta os tipos: o que entra em itens é o que a função de chave recebe e o que sai nos grupos. Sem generics, a assinatura seria any[] e o autocompletar em p.status desapareceria.',
    validationRules: [{ id: 'rule-no-any', type: 'not_contains', target: 'any', description: 'Não usa any' }],
  },
];
