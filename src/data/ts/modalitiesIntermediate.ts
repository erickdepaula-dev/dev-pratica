import { TsExercise } from '../../types/exercise';

/**
 * Trilha TypeScript — modalidades do nível intermediário:
 * 5 corrigir_erros, 5 prever_saida, 5 desafio_pratico.
 * IDs: `ts-intermediario-<slug>` (checado pelo tipo TsExercise<'intermediario'>).
 * Todo o código assume `strict: true`.
 */
export const tsIntermediateModalities: TsExercise<'intermediario'>[] = [
  // ==========================================
  // CORRIGIR ERROS (5)
  // ==========================================
  {
    id: 'ts-intermediario-debug-acesso-private',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'corrigir_erros',
    topic: 'Classes & Modificadores de Acesso',
    title: 'Depuração: Acesso Direto a Propriedade private',
    summary: 'Código externo tenta ler um campo private da classe.',
    realWorldContext:
      'Encapsular o estoque numa classe garante que só operações válidas o alterem. Ler o valor de fora deve passar por um método público.',
    description:
      'O relatório tenta ler estoque.quantidade, que é private. A classe já oferece um método público para isso. Corrija o relatório para usar o método, sem mudar a visibilidade do campo.',
    goal: 'Respeitar o encapsulamento usando o método público.',
    bugDescription: "Property 'quantidade' is private and only accessible within class 'Estoque'.",
    buggyLineNumbers: [16],
    initialBuggyCode: `class Estoque {
  private quantidade = 0;

  entrada(qtd: number): void {
    this.quantidade += qtd;
  }

  disponivel(): number {
    return this.quantidade;
  }
}

const estoque = new Estoque();
estoque.entrada(40);

const relatorio = 'Disponível: ' + estoque.quantidade;
console.log(relatorio);
`,
    templateCode: `class Estoque {
  private quantidade = 0;

  entrada(qtd: number): void {
    this.quantidade += qtd;
  }

  disponivel(): number {
    return this.quantidade;
  }
}

const estoque = new Estoque();
estoque.entrada(40);

const relatorio = 'Disponível: ' + estoque.quantidade;
console.log(relatorio);
`,
    solutionCode: `class Estoque {
  private quantidade = 0;

  entrada(qtd: number): void {
    this.quantidade += qtd;
  }

  disponivel(): number {
    return this.quantidade;
  }
}

const estoque = new Estoque();
estoque.entrada(40);

const relatorio = 'Disponível: ' + estoque.disponivel();
console.log(relatorio);
`,
    typeAssertions: `// @ts-expect-error — o campo continua private
estoque.quantidade;`,
    hints: [
      'Qual método público da classe devolve a quantidade?',
      'Não troque private por public: o encapsulamento é intencional.',
    ],
    testCases: [
      { description: 'Relatório mostra 40 unidades', expectedOutput: 'Disponível: 40', testFunction: `return relatorio === 'Disponível: 40';` },
    ],
    explanation:
      'O erro TS2341 protege o encapsulamento: a classe decide como seu estado é exposto. Usar o método público mantém a liberdade de mudar a implementação interna depois.',
  },
  {
    id: 'ts-intermediario-debug-uniao-sem-narrowing',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'corrigir_erros',
    topic: 'Type Guards & Narrowing',
    title: 'Depuração: Método que Só Existe em um Lado da União',
    summary: 'Um método é chamado em uma união sem antes identificar qual membro chegou.',
    realWorldContext:
      'Pagamentos podem ser por cartão (com parcelas) ou Pix (com chave). Chamar a lógica de parcelamento num Pix é um bug que o TypeScript bloqueia.',
    description:
      'descricao acessa pagamento.parcelas, que só existe em Cartao. Corrija usando um type guard com o operador in: cartões mostram "Cartão em Nx" e Pix mostra "Pix para <chave>".',
    goal: 'Estreitar a união antes de acessar propriedades específicas.',
    bugDescription: "Property 'parcelas' does not exist on type 'Cartao | Pix'.",
    buggyLineNumbers: [5],
    initialBuggyCode: `interface Cartao { numero: string; parcelas: number }
interface Pix { chave: string }

function descricao(pagamento: Cartao | Pix): string {
  return 'Cartão em ' + pagamento.parcelas + 'x';
}

console.log(descricao({ chave: 'ana@ex.com' }));
`,
    templateCode: `interface Cartao { numero: string; parcelas: number }
interface Pix { chave: string }

function descricao(pagamento: Cartao | Pix): string {
  return 'Cartão em ' + pagamento.parcelas + 'x';
}

console.log(descricao({ chave: 'ana@ex.com' }));
`,
    solutionCode: `interface Cartao { numero: string; parcelas: number }
interface Pix { chave: string }

function descricao(pagamento: Cartao | Pix): string {
  if ('parcelas' in pagamento) {
    return 'Cartão em ' + pagamento.parcelas + 'x';
  }
  return 'Pix para ' + pagamento.chave;
}

console.log(descricao({ chave: 'ana@ex.com' }));
`,
    hints: [
      'Numa união, só dá para acessar diretamente o que é comum a todos os membros.',
      'if ("parcelas" in pagamento) estreita para Cartao; depois do if, sobra Pix.',
    ],
    testCases: [
      { description: 'Pix mostra a chave', expectedOutput: 'Pix para ana@ex.com', testFunction: `return descricao({ chave: 'ana@ex.com' }) === 'Pix para ana@ex.com';` },
      { description: 'Cartão mostra as parcelas', expectedOutput: 'Cartão em 3x', testFunction: `return descricao({ numero: '4111', parcelas: 3 }) === 'Cartão em 3x';` },
    ],
    explanation:
      'O TypeScript só permite acessar membros presentes em todos os tipos da união. Um type guard (in, typeof, instanceof ou um discriminante) estreita o tipo e libera as propriedades específicas.',
  },
  {
    id: 'ts-intermediario-debug-catch-unknown',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'corrigir_erros',
    topic: 'unknown & Tratamento de Erros',
    title: 'Depuração: Lendo .message de um Erro unknown',
    summary: 'O catch acessa erro.message sem confirmar que o valor lançado é um Error.',
    realWorldContext:
      'Bibliotecas às vezes lançam strings ou objetos simples. Um handler que assume Error quebra justamente quando mais precisamos dele: no meio de uma falha.',
    description:
      'Corrija o catch: se o valor for um Error, use a mensagem dele; caso contrário, use String(erro).',
    goal: 'Estreitar o erro unknown antes de acessar .message.',
    bugDescription: "'erro' is of type 'unknown'.",
    buggyLineNumbers: [6],
    initialBuggyCode: `function mensagemDeFalha(acao: () => void): string {
  try {
    acao();
    return 'ok';
  } catch (erro) {
    return 'Falha: ' + erro.message;
  }
}

console.log(mensagemDeFalha(() => { throw 'timeout'; }));
`,
    templateCode: `function mensagemDeFalha(acao: () => void): string {
  try {
    acao();
    return 'ok';
  } catch (erro) {
    return 'Falha: ' + erro.message;
  }
}

console.log(mensagemDeFalha(() => { throw 'timeout'; }));
`,
    solutionCode: `function mensagemDeFalha(acao: () => void): string {
  try {
    acao();
    return 'ok';
  } catch (erro) {
    const texto = erro instanceof Error ? erro.message : String(erro);
    return 'Falha: ' + texto;
  }
}

console.log(mensagemDeFalha(() => { throw 'timeout'; }));
`,
    hints: [
      'Com strict, o erro do catch é unknown.',
      'erro instanceof Error ? erro.message : String(erro)',
    ],
    testCases: [
      { description: 'String lançada vira mensagem', expectedOutput: 'Falha: timeout', testFunction: `return mensagemDeFalha(() => { throw 'timeout'; }) === 'Falha: timeout';` },
      { description: 'Error usa a mensagem', expectedOutput: 'Falha: sem rede', testFunction: `return mensagemDeFalha(() => { throw new Error('sem rede'); }) === 'Falha: sem rede';` },
      { description: 'Sem erro retorna ok', expectedOutput: 'ok', testFunction: `return mensagemDeFalha(() => {}) === 'ok';` },
    ],
    explanation:
      'Na versão bugada, se o compilador deixasse passar, throw "timeout" geraria "Falha: undefined". O tipo unknown força a tratar os dois casos.',
  },
  {
    id: 'ts-intermediario-debug-record-chave-faltando',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'corrigir_erros',
    topic: 'Utility Types',
    title: 'Depuração: Record com Chave Faltando',
    summary: 'Um novo status foi criado, mas o mapa de ícones não foi atualizado.',
    realWorldContext:
      'Ao adicionar "suspenso" aos status de assinatura, a tela de listagem mostraria um ícone vazio. Com Record<Status, string>, o compilador lembra de todos os lugares que precisam ser atualizados.',
    description: 'O mapa de ícones não tem a chave "suspenso". Adicione-a com o ícone "⏸".',
    goal: 'Completar o Record com todas as chaves da união.',
    bugDescription: "Property 'suspenso' is missing in type '{ ativo: string; cancelado: string; }' but required in type 'Record<StatusAssinatura, string>'.",
    buggyLineNumbers: [3],
    initialBuggyCode: `type StatusAssinatura = 'ativo' | 'suspenso' | 'cancelado';

const icones: Record<StatusAssinatura, string> = {
  ativo: '✅',
  cancelado: '⛔',
};

console.log(icones.suspenso);
`,
    templateCode: `type StatusAssinatura = 'ativo' | 'suspenso' | 'cancelado';

const icones: Record<StatusAssinatura, string> = {
  ativo: '✅',
  cancelado: '⛔',
};

console.log(icones.suspenso);
`,
    solutionCode: `type StatusAssinatura = 'ativo' | 'suspenso' | 'cancelado';

const icones: Record<StatusAssinatura, string> = {
  ativo: '✅',
  suspenso: '⏸',
  cancelado: '⛔',
};

console.log(icones.suspenso);
`,
    hints: [
      'Record com união de literais exige todas as chaves.',
      'Adicione suspenso: "⏸" ao objeto.',
    ],
    testCases: [
      { description: 'Ícone de suspenso definido', expectedOutput: '⏸', testFunction: `return icones.suspenso === '⏸';` },
    ],
    explanation:
      'Esse é um dos maiores ganhos de usar Record com uniões: ao estender a união, todos os mapas incompletos viram erros de compilação, em vez de undefined na tela.',
  },
  {
    id: 'ts-intermediario-debug-readonly-push',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'corrigir_erros',
    topic: 'readonly & Imutabilidade',
    title: 'Depuração: push em Array readonly',
    summary: 'Uma função tenta modificar uma lista somente leitura recebida por parâmetro.',
    realWorldContext:
      'Em React e Redux, o estado é imutável: alterar o array original faz a tela não atualizar. readonly no tipo deixa essa regra explícita.',
    description:
      'adicionarTag recebe tags como readonly string[] e tenta usar push. Corrija para retornar um NOVO array com a tag no final, sem alterar o original.',
    goal: 'Produzir um novo array em vez de mutar o recebido.',
    bugDescription: "Property 'push' does not exist on type 'readonly string[]'.",
    buggyLineNumbers: [2],
    initialBuggyCode: `function adicionarTag(tags: readonly string[], nova: string): readonly string[] {
  tags.push(nova);
  return tags;
}

const originais = ['ts', 'react'];
const novas = adicionarTag(originais, 'vite');
console.log(originais.length, novas.length);
`,
    templateCode: `function adicionarTag(tags: readonly string[], nova: string): readonly string[] {
  tags.push(nova);
  return tags;
}

const originais = ['ts', 'react'];
const novas = adicionarTag(originais, 'vite');
console.log(originais.length, novas.length);
`,
    solutionCode: `function adicionarTag(tags: readonly string[], nova: string): readonly string[] {
  return [...tags, nova];
}

const originais = ['ts', 'react'];
const novas = adicionarTag(originais, 'vite');
console.log(originais.length, novas.length);
`,
    hints: [
      'Arrays readonly não têm métodos que mutam (push, pop, splice...).',
      'O spread [...tags, nova] cria um array novo.',
    ],
    testCases: [
      { description: 'O original continua com 2 itens', expectedOutput: '2 3', testFunction: `return originais.length === 2 && novas.length === 3 && novas[2] === 'vite';` },
    ],
    explanation:
      'readonly string[] (ou ReadonlyArray<string>) remove os métodos mutáveis do tipo. A correção idiomática é criar um array novo — o que também deixa a função pura e previsível.',
  },

  // ==========================================
  // PREVER SAÍDA (5)
  // ==========================================
  {
    id: 'ts-intermediario-prever-optional-chaining',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'prever_saida',
    topic: 'Type Guards & Narrowing',
    title: 'Previsão de Saída: Optional Chaining e ??',
    summary: 'Preveja o resultado de acessos encadeados em dados opcionais.',
    realWorldContext:
      'Perfis de usuário costumam ter dados aninhados opcionais (endereço, preferências). ?. e ?? substituem cadeias de if.',
    description: 'Atenção à diferença entre ?? e || com o número 0. Qual é a saída?',
    goal: 'Entender ?. e a diferença entre ?? e ||.',
    codeToPredict: `interface Perfil {
  nome: string;
  endereco?: { cidade?: string };
  pontos?: number;
}

const perfil: Perfil = { nome: 'Ana', endereco: {}, pontos: 0 };

console.log(perfil.endereco?.cidade ?? 'Sem cidade');
console.log(perfil.pontos ?? 10, perfil.pontos || 10);
`,
    templateCode: `interface Perfil {
  nome: string;
  endereco?: { cidade?: string };
  pontos?: number;
}

const perfil: Perfil = { nome: 'Ana', endereco: {}, pontos: 0 };

console.log(perfil.endereco?.cidade ?? 'Sem cidade');
console.log(perfil.pontos ?? 10, perfil.pontos || 10);
`,
    expectedOutputPrediction: 'Sem cidade\n0 10',
    solutionCode: `interface Perfil {
  nome: string;
  endereco?: { cidade?: string };
  pontos?: number;
}

const perfil: Perfil = { nome: 'Ana', endereco: {}, pontos: 0 };

console.log(perfil.endereco?.cidade ?? 'Sem cidade');
console.log(perfil.pontos ?? 10, perfil.pontos || 10);
`,
    hints: [
      'endereco existe, mas cidade é undefined.',
      '?? só substitui null/undefined; || substitui qualquer valor falsy, inclusive 0.',
    ],
    testCases: [],
    explanation:
      'endereco?.cidade é undefined, então ?? usa "Sem cidade". Já pontos vale 0: ?? mantém o 0 (não é null/undefined), enquanto || troca por 10 porque 0 é falsy. Para valores opcionais numéricos, ?? quase sempre é o correto.',
  },
  {
    id: 'ts-intermediario-prever-instanceof-heranca',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'prever_saida',
    topic: 'Classes & Modificadores de Acesso',
    title: 'Previsão de Saída: instanceof com Herança',
    summary: 'Preveja instanceof em uma hierarquia de classes de erro.',
    realWorldContext:
      'APIs bem estruturadas criam erros específicos (ErroValidacao, ErroAutenticacao) que estendem Error. O tratamento depende de instanceof funcionar ao longo da herança.',
    description: 'Qual é a saída?',
    goal: 'Entender instanceof em classes que estendem Error.',
    codeToPredict: `class ErroApp extends Error {}
class ErroValidacao extends ErroApp {
  constructor(public campo: string) {
    super('Campo inválido: ' + campo);
  }
}

const e = new ErroValidacao('email');
console.log(e instanceof Error, e instanceof ErroApp, e instanceof ErroValidacao);
console.log(e.message);
`,
    templateCode: `class ErroApp extends Error {}
class ErroValidacao extends ErroApp {
  constructor(public campo: string) {
    super('Campo inválido: ' + campo);
  }
}

const e = new ErroValidacao('email');
console.log(e instanceof Error, e instanceof ErroApp, e instanceof ErroValidacao);
console.log(e.message);
`,
    expectedOutputPrediction: 'true true true\nCampo inválido: email',
    solutionCode: `class ErroApp extends Error {}
class ErroValidacao extends ErroApp {
  constructor(public campo: string) {
    super('Campo inválido: ' + campo);
  }
}

const e = new ErroValidacao('email');
console.log(e instanceof Error, e instanceof ErroApp, e instanceof ErroValidacao);
console.log(e.message);
`,
    hints: [
      'instanceof percorre toda a cadeia de protótipos.',
      'A mensagem é a passada para super().',
    ],
    testCases: [],
    explanation:
      'Uma instância de ErroValidacao também é ErroApp e Error, porque instanceof checa a cadeia de protótipos inteira. Com target ES2015+ (aqui, ES2022), estender Error funciona corretamente; em ES5 seria preciso ajustar o protótipo manualmente.',
  },
  {
    id: 'ts-intermediario-prever-spread-partial',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'prever_saida',
    topic: 'Utility Types',
    title: 'Previsão de Saída: Spread de um Partial com undefined',
    summary: 'Descubra o efeito de uma propriedade explicitamente undefined em uma mesclagem.',
    realWorldContext:
      'Formulários de edição costumam enviar campos vazios como undefined. Mesclar isso com spread pode apagar dados existentes — um bug clássico de PATCH.',
    description: 'O objeto de mudanças tem nome: undefined explicitamente. Qual é a saída?',
    goal: 'Entender que spread copia propriedades com valor undefined.',
    codeToPredict: `interface Contato {
  nome: string;
  telefone: string;
}

const atual: Contato = { nome: 'Ana', telefone: '9999-0000' };
const mudancas: Partial<Contato> = { nome: undefined, telefone: '8888-1111' };

const resultado = { ...atual, ...mudancas };
console.log(resultado.nome, resultado.telefone);
`,
    templateCode: `interface Contato {
  nome: string;
  telefone: string;
}

const atual: Contato = { nome: 'Ana', telefone: '9999-0000' };
const mudancas: Partial<Contato> = { nome: undefined, telefone: '8888-1111' };

const resultado = { ...atual, ...mudancas };
console.log(resultado.nome, resultado.telefone);
`,
    expectedOutputPrediction: 'undefined 8888-1111',
    solutionCode: `interface Contato {
  nome: string;
  telefone: string;
}

const atual: Contato = { nome: 'Ana', telefone: '9999-0000' };
const mudancas: Partial<Contato> = { nome: undefined, telefone: '8888-1111' };

const resultado = { ...atual, ...mudancas };
console.log(resultado.nome, resultado.telefone);
`,
    hints: [
      'Uma propriedade ausente é diferente de uma propriedade com valor undefined.',
      'O spread copia a chave nome, mesmo com valor undefined.',
    ],
    testCases: [],
    explanation:
      'Partial<T> permite { nome: undefined }, e o spread copia essa chave por cima do valor atual. Resultado: o nome é apagado. Para evitar, filtre chaves undefined antes de mesclar, ou ative exactOptionalPropertyTypes, que diferencia "ausente" de "undefined".',
  },
  {
    id: 'ts-intermediario-prever-typeof-array',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'prever_saida',
    topic: 'Type Guards & Narrowing',
    title: 'Previsão de Saída: Narrowing em um map',
    summary: 'Preveja o resultado de um map que trata cada tipo de uma união de forma diferente.',
    realWorldContext:
      'Importações de CSV produzem colunas com tipos mistos. Tratar cada tipo separadamente é um uso diário de narrowing.',
    description: 'Cada elemento é tratado de acordo com seu tipo. Qual é a saída?',
    goal: 'Seguir o narrowing com typeof em cada elemento.',
    codeToPredict: `const celulas: (string | number | boolean)[] = ['abc', 4, true, '', 0];

const normalizadas = celulas.map(c => {
  if (typeof c === 'string') return c.length;
  if (typeof c === 'number') return c * 2;
  return c ? 1 : 0;
});

console.log(normalizadas.join(','));
`,
    templateCode: `const celulas: (string | number | boolean)[] = ['abc', 4, true, '', 0];

const normalizadas = celulas.map(c => {
  if (typeof c === 'string') return c.length;
  if (typeof c === 'number') return c * 2;
  return c ? 1 : 0;
});

console.log(normalizadas.join(','));
`,
    expectedOutputPrediction: '3,8,1,0,0',
    solutionCode: `const celulas: (string | number | boolean)[] = ['abc', 4, true, '', 0];

const normalizadas = celulas.map(c => {
  if (typeof c === 'string') return c.length;
  if (typeof c === 'number') return c * 2;
  return c ? 1 : 0;
});

console.log(normalizadas.join(','));
`,
    hints: [
      'Strings viram o comprimento; números são dobrados; booleanos viram 1 ou 0.',
      'A string vazia tem comprimento 0; o número 0 dobrado continua 0.',
    ],
    testCases: [],
    explanation:
      '"abc" → 3, 4 → 8, true → 1, "" → 0 (comprimento) e 0 → 0. Repare que o último return só recebe boolean: depois dos dois ifs, o TypeScript já eliminou string e number.',
  },
  {
    id: 'ts-intermediario-prever-generic-inferencia',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'prever_saida',
    topic: 'Generics',
    title: 'Previsão de Saída: Generics São Apagados',
    summary: 'Preveja a saída de uma função genérica chamada com tipos diferentes.',
    realWorldContext:
      'Generics dão segurança em tempo de compilação, mas o código gerado é o mesmo para qualquer T. Entender isso evita tentar "ler" o tipo genérico em runtime.',
    description: 'A mesma função genérica é chamada com uma string e com um array. Qual é a saída?',
    goal: 'Entender que generics não existem em runtime.',
    codeToPredict: `function duplicar<T>(valor: T): T[] {
  return [valor, valor];
}

const a = duplicar('ab');
const b = duplicar([1, 2]);

console.log(a.join(''), b.length, b[0] === b[1]);
`,
    templateCode: `function duplicar<T>(valor: T): T[] {
  return [valor, valor];
}

const a = duplicar('ab');
const b = duplicar([1, 2]);

console.log(a.join(''), b.length, b[0] === b[1]);
`,
    expectedOutputPrediction: 'abab 2 true',
    acceptableOutputPredictions: ['abab, 2, true'],
    solutionCode: `function duplicar<T>(valor: T): T[] {
  return [valor, valor];
}

const a = duplicar('ab');
const b = duplicar([1, 2]);

console.log(a.join(''), b.length, b[0] === b[1]);
`,
    hints: [
      'a é ["ab", "ab"].',
      'b contém o MESMO array duas vezes (mesma referência).',
    ],
    testCases: [],
    explanation:
      'O JavaScript gerado é simplesmente function duplicar(valor) { return [valor, valor]; }. Para b, as duas posições apontam para o mesmo array, então b[0] === b[1] é true. Generics descrevem relações entre tipos — não copiam nem transformam valores.',
  },

  // ==========================================
  // DESAFIOS PRÁTICOS (5)
  // ==========================================
  {
    id: 'ts-intermediario-desafio-type-predicate',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'desafio_pratico',
    topic: 'Type Guards & Narrowing',
    title: 'Desafio Prático: Type Guard Personalizado',
    summary: 'Escreva uma função com type predicate e use-a para filtrar uma lista mista.',
    realWorldContext:
      'Um catálogo mistura produtos físicos (com peso) e digitais (com link de download). Para calcular o frete, é preciso filtrar só os físicos — e o resultado deve ser tipado como tal.',
    description:
      'Implemente ehFisico(p) com o retorno "p is ProdutoFisico" e use-o em pesoTotal para somar o peso só dos produtos físicos. O filter com o type guard deve devolver ProdutoFisico[].',
    goal: 'Criar um type predicate e usá-lo com filter.',
    practicalRequirements: [
      'ehFisico deve ter o retorno anotado como p is ProdutoFisico.',
      'Um produto é físico se tiver a propriedade pesoKg.',
      'pesoTotal soma pesoKg apenas dos produtos físicos.',
      'Não usar type assertions (as) nem any.',
    ],
    templateCode: `interface ProdutoFisico { nome: string; pesoKg: number }
interface ProdutoDigital { nome: string; linkDownload: string }
type Produto = ProdutoFisico | ProdutoDigital;

function ehFisico(p: Produto): p is ProdutoFisico {
  // Implemente aqui
  return false;
}

function pesoTotal(produtos: Produto[]): number {
  // Use produtos.filter(ehFisico)
  return 0;
}
`,
    solutionCode: `interface ProdutoFisico { nome: string; pesoKg: number }
interface ProdutoDigital { nome: string; linkDownload: string }
type Produto = ProdutoFisico | ProdutoDigital;

function ehFisico(p: Produto): p is ProdutoFisico {
  return 'pesoKg' in p;
}

function pesoTotal(produtos: Produto[]): number {
  return produtos.filter(ehFisico).reduce((soma, p) => soma + p.pesoKg, 0);
}
`,
    typeAssertions: `const lista: Produto[] = [];
const fisicos: ProdutoFisico[] = lista.filter(ehFisico);`,
    hints: [
      'O corpo do guard é uma checagem comum: "pesoKg" in p.',
      'O retorno "p is ProdutoFisico" ensina o filter a estreitar o tipo do array resultante.',
      'Depois do filter, p.pesoKg é acessível sem cast.',
    ],
    testCases: [
      { description: 'Identifica produto físico', expectedOutput: 'true', testFunction: `return ehFisico({ nome: 'Livro', pesoKg: 0.5 }) === true && ehFisico({ nome: 'Ebook', linkDownload: 'x' }) === false;` },
      { description: 'Soma só os físicos', expectedOutput: '2.5', testFunction: `return pesoTotal([{ nome: 'A', pesoKg: 2 }, { nome: 'B', linkDownload: 'x' }, { nome: 'C', pesoKg: 0.5 }]) === 2.5;` },
      { description: 'Lista sem físicos pesa 0', expectedOutput: '0', testFunction: `return pesoTotal([{ nome: 'B', linkDownload: 'x' }]) === 0;` },
    ],
    explanation:
      'Um type predicate (p is T) transforma uma função booleana em type guard reutilizável. O filter usa essa assinatura para devolver T[] — sem ela, o resultado continuaria Produto[] e p.pesoKg seria erro.',
    validationRules: [
      { id: 'rule-predicate', type: 'regex', target: 'p\\s+is\\s+ProdutoFisico', description: 'Retorno anotado como type predicate' },
      { id: 'rule-no-as', type: 'not_contains', target: ' as ', description: 'Não usa type assertion' },
    ],
  },
  {
    id: 'ts-intermediario-desafio-cache-generico',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'desafio_pratico',
    topic: 'Generics',
    title: 'Desafio Prático: Classe Genérica de Cache com Expiração',
    summary: 'Implemente um cache genérico que guarda valores de qualquer tipo com tempo de vida.',
    realWorldContext:
      'Cachear respostas de API (cotações, CEPs, perfis) reduz chamadas de rede. Um cache genérico serve para todos esses casos mantendo o tipo de cada um.',
    description:
      'Complete a classe Cache<T>. definir(chave, valor, agora, ttlMs) guarda o valor com validade até agora + ttlMs. obter(chave, agora) devolve o valor se ainda for válido, senão remove a entrada e devolve undefined. O "agora" é recebido por parâmetro para facilitar os testes.',
    goal: 'Implementar um cache genérico com expiração.',
    practicalRequirements: [
      'A classe deve ser genérica: Cache<T>.',
      'O mapa interno deve ser private.',
      'obter retorna T | undefined.',
      'Entradas expiradas (agora >= expiraEm) são removidas ao serem lidas.',
      'tamanho() retorna quantas entradas existem no mapa.',
    ],
    templateCode: `class Cache<T> {
  private entradas = new Map<string, { valor: T; expiraEm: number }>();

  definir(chave: string, valor: T, agora: number, ttlMs: number): void {
    // Implemente aqui
  }

  obter(chave: string, agora: number): T | undefined {
    // Implemente aqui
    return undefined;
  }

  tamanho(): number {
    return this.entradas.size;
  }
}
`,
    solutionCode: `class Cache<T> {
  private entradas = new Map<string, { valor: T; expiraEm: number }>();

  definir(chave: string, valor: T, agora: number, ttlMs: number): void {
    this.entradas.set(chave, { valor, expiraEm: agora + ttlMs });
  }

  obter(chave: string, agora: number): T | undefined {
    const entrada = this.entradas.get(chave);
    if (!entrada) return undefined;
    if (agora >= entrada.expiraEm) {
      this.entradas.delete(chave);
      return undefined;
    }
    return entrada.valor;
  }

  tamanho(): number {
    return this.entradas.size;
  }
}
`,
    typeAssertions: `const precos = new Cache<number>();
const p: number | undefined = precos.obter('x', 0);
// @ts-expect-error — um Cache<number> não aceita string
precos.definir('x', 'caro', 0, 10);`,
    hints: [
      'Use this.entradas.set(chave, { valor, expiraEm: agora + ttlMs }).',
      'Em obter: se não existe, undefined; se expirou, delete e undefined; senão, o valor.',
      'O T da classe vale para todos os métodos.',
    ],
    testCases: [
      { description: 'Lê valor dentro do prazo', expectedOutput: '42', testFunction: `const c = new Cache(); c.definir('a', 42, 1000, 500); return c.obter('a', 1200) === 42;` },
      { description: 'Expira e remove a entrada', expectedOutput: 'undefined, tamanho 0', testFunction: `const c = new Cache(); c.definir('a', 42, 1000, 500); return c.obter('a', 1500) === undefined && c.tamanho() === 0;` },
      { description: 'Chave inexistente retorna undefined', expectedOutput: 'undefined', testFunction: `const c = new Cache(); return c.obter('nada', 0) === undefined;` },
    ],
    explanation:
      'Classes genéricas fixam o tipo T na criação (new Cache<number>()), e todos os métodos passam a respeitá-lo. Receber "agora" como parâmetro (em vez de chamar Date.now() dentro) torna a classe determinística e testável.',
  },
  {
    id: 'ts-intermediario-desafio-atualizar-perfil',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'desafio_pratico',
    topic: 'Utility Types',
    title: 'Desafio Prático: Atualização Segura de Perfil',
    summary: 'Combine Partial e Omit para permitir atualizar tudo, menos o id.',
    realWorldContext:
      'Em uma API de perfil, o cliente pode atualizar nome e bio, mas nunca o id. Expressar isso no tipo é mais confiável do que lembrar de checar em runtime.',
    description:
      'Implemente atualizarPerfil(perfil, mudancas). mudancas é Partial<Omit<Perfil, "id">>. Aplique só as propriedades que NÃO forem undefined (para não apagar dados — veja o exercício de previsão sobre spread). Retorne um novo objeto, sem mutar o original.',
    goal: 'Mesclar mudanças ignorando valores undefined e sem permitir mudar o id.',
    practicalRequirements: [
      'Assinatura: (perfil: Perfil, mudancas: Partial<Omit<Perfil, "id">>) => Perfil.',
      'Propriedades com valor undefined em mudancas são ignoradas.',
      'O objeto original não pode ser alterado.',
      'Tentar passar id em mudancas deve ser erro de compilação.',
    ],
    templateCode: `interface Perfil {
  id: number;
  nome: string;
  bio: string;
}

function atualizarPerfil(perfil: Perfil, mudancas: Partial<Omit<Perfil, 'id'>>): Perfil {
  // Implemente aqui
  return perfil;
}
`,
    solutionCode: `interface Perfil {
  id: number;
  nome: string;
  bio: string;
}

function atualizarPerfil(perfil: Perfil, mudancas: Partial<Omit<Perfil, 'id'>>): Perfil {
  const atualizado: Perfil = { ...perfil };
  if (mudancas.nome !== undefined) atualizado.nome = mudancas.nome;
  if (mudancas.bio !== undefined) atualizado.bio = mudancas.bio;
  return atualizado;
}
`,
    typeAssertions: `const base: Perfil = { id: 1, nome: 'a', bio: 'b' };
atualizarPerfil(base, { bio: 'nova' });
// @ts-expect-error — id não pode ser alterado
atualizarPerfil(base, { id: 2 });`,
    hints: [
      'Comece copiando o perfil: { ...perfil }.',
      'Copie cada campo de mudancas só se for diferente de undefined.',
      'Omit<Perfil, "id"> remove o id; Partial torna o resto opcional.',
    ],
    testCases: [
      { description: 'Atualiza só a bio', expectedOutput: 'Ana / Dev TS', testFunction: `const p = atualizarPerfil({ id: 1, nome: 'Ana', bio: 'Dev' }, { bio: 'Dev TS' }); return p.nome === 'Ana' && p.bio === 'Dev TS' && p.id === 1;` },
      { description: 'Ignora undefined explícito', expectedOutput: 'nome preservado', testFunction: `const p = atualizarPerfil({ id: 1, nome: 'Ana', bio: 'Dev' }, { nome: undefined }); return p.nome === 'Ana';` },
      { description: 'Não muta o original', expectedOutput: 'original intacto', testFunction: `const o = { id: 1, nome: 'Ana', bio: 'Dev' }; atualizarPerfil(o, { nome: 'Bia' }); return o.nome === 'Ana';` },
    ],
    explanation:
      'Utility types se combinam: Omit remove o id e Partial deixa o resto opcional. O tipo impede mudar o id; a checagem de undefined resolve a pegadinha do spread, que o tipo sozinho não cobre.',
  },
  {
    id: 'ts-intermediario-desafio-contar-categorias',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'desafio_pratico',
    topic: 'Utility Types',
    title: 'Desafio Prático: Contagem por Categoria com Record',
    summary: 'Conte despesas por categoria garantindo que todas as categorias apareçam no resultado.',
    realWorldContext:
      'Gráficos de gastos precisam de todas as categorias, mesmo as zeradas, para manter cores e legendas estáveis. Record<Categoria, number> obriga a inicializar todas.',
    description:
      'Implemente totalPorCategoria(despesas) que soma o valor das despesas de cada categoria. Todas as categorias devem estar no resultado, com 0 quando não houver despesas.',
    goal: 'Retornar um Record<Categoria, number> completo.',
    practicalRequirements: [
      'Assinatura: (despesas: Despesa[]) => Record<Categoria, number>.',
      'Todas as categorias aparecem no resultado, mesmo com 0.',
      'Somar o campo valor das despesas de cada categoria.',
    ],
    templateCode: `type Categoria = 'mercado' | 'transporte' | 'lazer';

interface Despesa {
  categoria: Categoria;
  valor: number;
}

function totalPorCategoria(despesas: Despesa[]): Record<Categoria, number> {
  // Implemente aqui
}
`,
    solutionCode: `type Categoria = 'mercado' | 'transporte' | 'lazer';

interface Despesa {
  categoria: Categoria;
  valor: number;
}

function totalPorCategoria(despesas: Despesa[]): Record<Categoria, number> {
  const totais: Record<Categoria, number> = { mercado: 0, transporte: 0, lazer: 0 };
  for (const d of despesas) {
    totais[d.categoria] += d.valor;
  }
  return totais;
}
`,
    typeAssertions: `const t: Record<Categoria, number> = totalPorCategoria([]);
// @ts-expect-error — "saude" não é uma Categoria
totalPorCategoria([{ categoria: 'saude', valor: 1 }]);`,
    hints: [
      'Inicialize o objeto com todas as categorias valendo 0 — o compilador recusa se faltar alguma.',
      'totais[d.categoria] += d.valor funciona porque d.categoria é Categoria.',
    ],
    testCases: [
      { description: 'Soma por categoria', expectedOutput: '{ mercado: 150, transporte: 20, lazer: 0 }', testFunction: `const t = totalPorCategoria([{ categoria: 'mercado', valor: 100 }, { categoria: 'transporte', valor: 20 }, { categoria: 'mercado', valor: 50 }]); return t.mercado === 150 && t.transporte === 20 && t.lazer === 0;` },
      { description: 'Lista vazia zera tudo', expectedOutput: '{ mercado: 0, transporte: 0, lazer: 0 }', testFunction: `const t = totalPorCategoria([]); return t.mercado === 0 && t.transporte === 0 && t.lazer === 0;` },
    ],
    explanation:
      'Record<Categoria, number> com uma união como chave obriga o objeto inicial a ter todas as categorias. Se uma categoria nova entrar na união, o compilador aponta esta função imediatamente.',
  },
  {
    id: 'ts-intermediario-desafio-ler-porta-unknown',
    language: 'typescript',
    difficulty: 'intermediario',
    type: 'desafio_pratico',
    topic: 'unknown & Tratamento de Erros',
    title: 'Desafio Prático: Validar Configuração Desconhecida',
    summary: 'Extraia uma porta válida de uma configuração do tipo unknown.',
    realWorldContext:
      'Arquivos de configuração e variáveis de ambiente podem vir com qualquer formato. Validar a partir de unknown impede que um servidor suba na porta "abc".',
    description:
      'Implemente lerPorta(config: unknown). Se config for um objeto (não null) com a propriedade porta sendo um inteiro entre 1 e 65535, retorne-a; em qualquer outro caso, retorne 3000.',
    goal: 'Estreitar unknown até um número válido, sem usar any nem as.',
    practicalRequirements: [
      'O parâmetro deve continuar sendo unknown.',
      'Aceitar apenas inteiros de 1 a 65535 (use Number.isInteger).',
      'Qualquer outro caso retorna 3000.',
      'Não usar any nem type assertions (as).',
    ],
    templateCode: `function lerPorta(config: unknown): number {
  // Implemente aqui
  return 3000;
}
`,
    solutionCode: `function lerPorta(config: unknown): number {
  if (typeof config === 'object' && config !== null && 'porta' in config) {
    const porta = config.porta;
    if (typeof porta === 'number' && Number.isInteger(porta) && porta >= 1 && porta <= 65535) {
      return porta;
    }
  }
  return 3000;
}
`,
    hints: [
      'typeof config === "object" && config !== null && "porta" in config.',
      'Depois disso, config.porta ainda é unknown: cheque typeof === "number".',
      'Number.isInteger rejeita 8080.5.',
    ],
    testCases: [
      { description: 'Porta válida', expectedOutput: '8080', testFunction: `return lerPorta({ porta: 8080 }) === 8080;` },
      { description: 'Porta como texto usa o padrão', expectedOutput: '3000', testFunction: `return lerPorta({ porta: '8080' }) === 3000;` },
      { description: 'Fora do intervalo usa o padrão', expectedOutput: '3000', testFunction: `return lerPorta({ porta: 70000 }) === 3000 && lerPorta({ porta: 0 }) === 3000;` },
      { description: 'null e valores soltos usam o padrão', expectedOutput: '3000', testFunction: `return lerPorta(null) === 3000 && lerPorta(42) === 3000;` },
    ],
    explanation:
      'Com unknown, cada passo da validação também é um passo de narrowing: objeto → não nulo → tem "porta" → é number → é inteiro no intervalo. Ao fim, o TypeScript sabe que porta é number sem nenhum cast.',
    validationRules: [
      { id: 'rule-no-any', type: 'not_contains', target: 'any', description: 'Não usa any' },
      { id: 'rule-no-as', type: 'not_contains', target: ' as ', description: 'Não usa type assertion' },
    ],
  },
];
