import { TsExercise } from '../../types/exercise';
import { erroDeTipo } from './typeErrorFactory';

/**
 * Trilha TypeScript — 'prever_erro_de_tipo', nível intermediário (10 exercícios).
 * Cada trecho tem exatamente um erro; linha e código são conferidos por `npm run check:ts`.
 */
export const tsIntermediateTypeErrors: TsExercise<'intermediario'>[] = [
  erroDeTipo({
    id: 'ts-intermediario-erro-unknown-sem-narrowing',
    difficulty: 'intermediario',
    topic: 'unknown & Tratamento de Erros',
    title: 'Erro de Tipo: Usando unknown sem Validar',
    summary: 'Um método é chamado diretamente em um valor do tipo unknown.',
    realWorldContext: 'Dados de APIs externas tipados como unknown obrigam a validação. Pular essa etapa é exatamente o que o tipo existe para impedir.',
    code: `function formatarValor(valor: unknown): string {
  console.log('Formatando...');
  return valor.toFixed(2);
}

console.log(formatarValor(3.14159));
`,
    fixedCode: `function formatarValor(valor: unknown): string {
  console.log('Formatando...');
  return typeof valor === 'number' ? valor.toFixed(2) : String(valor);
}

console.log(formatarValor(3.14159));
`,
    challenge: {
      errorLine: 3,
      errorCode: 18046,
      reasonOptions: [
        'toFixed só aceita inteiros.',
        'valor é unknown: é preciso estreitar o tipo antes de usar seus métodos.',
        'Funções com parâmetro unknown não podem retornar string.',
        'console.log antes do return muda o tipo de valor.',
      ],
      correctReason: 1,
    },
    hints: ['O que o TypeScript sabe sobre um valor unknown?', 'typeof valor === "number" liberaria o toFixed.'],
    explanation: 'TS18046: \'valor\' is of type \'unknown\'. unknown aceita qualquer valor, mas não permite usá-lo até que um type guard prove o tipo.',
  }),
  erroDeTipo({
    id: 'ts-intermediario-erro-readonly-atribuicao',
    difficulty: 'intermediario',
    topic: 'readonly & Imutabilidade',
    title: 'Erro de Tipo: Alterando uma Propriedade readonly',
    summary: 'Uma propriedade marcada como readonly recebe um novo valor.',
    realWorldContext: 'O id de uma entidade nunca deve mudar depois de criado. readonly transforma essa regra em verificação de compilação.',
    code: `interface Pedido {
  readonly id: number;
  status: string;
}

const pedido: Pedido = { id: 101, status: 'novo' };
pedido.status = 'pago';
pedido.id = 102;
console.log(pedido);
`,
    fixedCode: `interface Pedido {
  readonly id: number;
  status: string;
}

const pedido: Pedido = { id: 101, status: 'novo' };
pedido.status = 'pago';
console.log(pedido);
`,
    challenge: {
      errorLine: 8,
      errorCode: 2540,
      reasonOptions: [
        'pedido foi declarado com const, então nenhuma propriedade pode mudar.',
        'status não aceita o valor "pago".',
        'id é readonly e não pode ser reatribuído.',
        'Interfaces não podem ter propriedades readonly.',
      ],
      correctReason: 2,
    },
    hints: ['A linha 7 também altera o objeto. Por que ela é aceita?', 'const impede reatribuir a variável, não as propriedades.'],
    explanation: 'TS2540: Cannot assign to \'id\' because it is a read-only property. const protege a variável; readonly protege a propriedade.',
  }),
  erroDeTipo({
    id: 'ts-intermediario-erro-private-fora-da-classe',
    difficulty: 'intermediario',
    topic: 'Classes & Modificadores de Acesso',
    title: 'Erro de Tipo: Acesso a Membro private',
    summary: 'Código externo lê uma propriedade private de uma classe.',
    realWorldContext: 'Encapsular o token de autenticação numa classe impede que outros módulos o leiam ou registrem em logs por engano.',
    code: `class SessaoUsuario {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  estaAutenticado(): boolean {
    return this.token.length > 0;
  }
}

const sessao = new SessaoUsuario('abc123');
console.log(sessao.estaAutenticado(), sessao.token);
`,
    fixedCode: `class SessaoUsuario {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  estaAutenticado(): boolean {
    return this.token.length > 0;
  }
}

const sessao = new SessaoUsuario('abc123');
console.log(sessao.estaAutenticado());
`,
    challenge: {
      errorLine: 14,
      errorCode: 2341,
      reasonOptions: [
        'token é private e só pode ser acessado dentro da classe.',
        'estaAutenticado deveria ser estático.',
        'O construtor não pode atribuir propriedades private.',
        'this.token.length pode ser undefined.',
      ],
      correctReason: 0,
    },
    hints: ['Dentro da classe, this.token é usado sem problema. E fora?', 'Procure o acesso feito pela variável sessao.'],
    explanation: 'TS2341: Property \'token\' is private and only accessible within class \'SessaoUsuario\'. (Lembre: private só existe na compilação; para privacidade em runtime, use #token.)',
  }),
  erroDeTipo({
    id: 'ts-intermediario-erro-uniao-sem-narrowing',
    difficulty: 'intermediario',
    topic: 'Type Guards & Narrowing',
    title: 'Erro de Tipo: Método de string em string | number',
    summary: 'Um método que só strings têm é chamado numa união sem narrowing.',
    realWorldContext: 'Códigos de produto podem vir como número (1042) ou texto ("A-1042"). Tratar tudo como texto sem checar quebra para os numéricos.',
    code: `function normalizarCodigo(codigo: string | number): string {
  const limpo = codigo.toUpperCase();
  return 'SKU-' + limpo;
}

console.log(normalizarCodigo('a-1042'));
`,
    fixedCode: `function normalizarCodigo(codigo: string | number): string {
  const limpo = String(codigo).toUpperCase();
  return 'SKU-' + limpo;
}

console.log(normalizarCodigo('a-1042'));
`,
    challenge: {
      errorLine: 2,
      errorCode: 2339,
      reasonOptions: [
        'toUpperCase não existe em number, e codigo pode ser number.',
        'Concatenar \'SKU-\' com string é proibido.',
        'O retorno deveria ser string | number.',
        'const não pode guardar o retorno de um método.',
      ],
      correctReason: 0,
    },
    hints: ['Numa união, só é possível usar o que todos os membros têm.', 'typeof ou String() resolveriam.'],
    explanation: 'TS2339: Property \'toUpperCase\' does not exist on type \'string | number\'. Estreite com typeof ou converta com String() antes.',
  }),
  erroDeTipo({
    id: 'ts-intermediario-erro-generic-explicito',
    difficulty: 'intermediario',
    topic: 'Generics',
    title: 'Erro de Tipo: Argumento Incompatível com o Generic Explícito',
    summary: 'Uma função genérica recebe um parâmetro de tipo explícito que não bate com o argumento.',
    realWorldContext: 'Passar o tipo genérico explicitamente é útil, mas transforma o tipo em uma exigência: o argumento precisa obedecer.',
    code: `function ultimo<T>(lista: T[]): T | undefined {
  return lista[lista.length - 1];
}

const notas = [7.5, 8, 9.25];
const maisRecente = ultimo<string>(notas);
console.log(maisRecente);
`,
    fixedCode: `function ultimo<T>(lista: T[]): T | undefined {
  return lista[lista.length - 1];
}

const notas = [7.5, 8, 9.25];
const maisRecente = ultimo(notas);
console.log(maisRecente);
`,
    challenge: {
      errorLine: 6,
      errorCode: 2345,
      reasonOptions: [
        'lista[lista.length - 1] pode ser undefined.',
        'Funções genéricas não aceitam arrays.',
        'T foi fixado como string, mas notas é number[].',
        'notas deveria ser declarado com let.',
      ],
      correctReason: 2,
    },
    hints: ['O que está entre < > na chamada?', 'Sem o <string>, o TypeScript inferiria T sozinho.'],
    explanation: 'TS2345: Argument of type \'number[]\' is not assignable to parameter of type \'string[]\'. Na maioria das chamadas, deixe o TypeScript inferir T.',
  }),
  erroDeTipo({
    id: 'ts-intermediario-erro-partial-como-completo',
    difficulty: 'intermediario',
    topic: 'Utility Types',
    title: 'Erro de Tipo: Partial Usado onde se Espera o Tipo Completo',
    summary: 'Um objeto Partial<T> é atribuído a uma variável do tipo T.',
    realWorldContext: 'Dados de um formulário em edição (Partial) não podem ser salvos como se fossem a entidade completa — algum campo pode faltar.',
    code: `interface Endereco {
  rua: string;
  cidade: string;
}

const rascunho: Partial<Endereco> = { rua: 'Av. Beira Mar' };
const confirmado: Endereco = rascunho;
console.log(confirmado.rua);
`,
    fixedCode: `interface Endereco {
  rua: string;
  cidade: string;
}

const rascunho: Partial<Endereco> = { rua: 'Av. Beira Mar' };
const confirmado: Endereco = { rua: rascunho.rua ?? '', cidade: rascunho.cidade ?? 'Fortaleza' };
console.log(confirmado.rua);
`,
    challenge: {
      errorLine: 7,
      errorCode: 2322,
      reasonOptions: [
        'Partial<Endereco> não pode ter só uma propriedade.',
        'Partial<Endereco> pode não ter rua ou cidade, e Endereco exige as duas.',
        'Interfaces não funcionam com Partial.',
        'rua deveria ser opcional na interface.',
      ],
      correctReason: 1,
    },
    hints: ['Qual é a diferença entre Partial<Endereco> e Endereco?', 'A linha 6 está correta: rascunhos podem ser incompletos.'],
    explanation: 'TS2322: Type \'Partial<Endereco>\' is not assignable to type \'Endereco\'. Ao "promover" um rascunho, preencha ou valide os campos que faltam.',
  }),
  erroDeTipo({
    id: 'ts-intermediario-erro-omit-campo-removido',
    difficulty: 'intermediario',
    topic: 'Utility Types',
    title: 'Erro de Tipo: Lendo um Campo Removido com Omit',
    summary: 'O código tenta ler uma propriedade que foi removida do tipo com Omit.',
    realWorldContext: 'A versão pública do usuário (sem senha) existe justamente para que a senha nunca chegue à tela ou aos logs.',
    code: `interface Usuario {
  id: number;
  email: string;
  senha: string;
}

type UsuarioPublico = Omit<Usuario, 'senha'>;

function exibir(u: UsuarioPublico): string {
  return u.email + ' / ' + u.senha;
}

console.log(exibir({ id: 1, email: 'ana@ex.com' }));
`,
    fixedCode: `interface Usuario {
  id: number;
  email: string;
  senha: string;
}

type UsuarioPublico = Omit<Usuario, 'senha'>;

function exibir(u: UsuarioPublico): string {
  return u.email + ' (#' + u.id + ')';
}

console.log(exibir({ id: 1, email: 'ana@ex.com' }));
`,
    challenge: {
      errorLine: 10,
      errorCode: 2339,
      reasonOptions: [
        'Omit também remove o campo email.',
        'A chamada de exibir não passa a senha.',
        'senha foi removida do tipo UsuarioPublico pelo Omit.',
        'Tipos derivados com Omit não podem ser usados em parâmetros.',
      ],
      correctReason: 2,
    },
    hints: ['Quais campos UsuarioPublico tem?', 'A chamada na última linha está correta.'],
    explanation: 'TS2339: Property \'senha\' does not exist on type \'UsuarioPublico\'. É o tipo protegendo um dado sensível.',
  }),
  erroDeTipo({
    id: 'ts-intermediario-erro-record-incompleto',
    difficulty: 'intermediario',
    topic: 'Utility Types',
    title: 'Erro de Tipo: Record sem Todas as Chaves',
    summary: 'Um Record indexado por uma união não tem uma das chaves.',
    realWorldContext: 'Ao adicionar um idioma novo, todos os dicionários de tradução precisam da entrada correspondente — Record lembra você disso.',
    code: `type Idioma = 'pt' | 'en' | 'es';

const saudacoes: Record<Idioma, string> = {
  pt: 'Olá',
  en: 'Hello',
};

console.log(saudacoes.pt);
`,
    fixedCode: `type Idioma = 'pt' | 'en' | 'es';

const saudacoes: Record<Idioma, string> = {
  pt: 'Olá',
  en: 'Hello',
  es: 'Hola',
};

console.log(saudacoes.pt);
`,
    challenge: {
      errorLine: 3,
      errorCode: 2741,
      reasonOptions: [
        'Record só aceita chaves do tipo string, não uniões.',
        'Falta a chave es, obrigatória porque está na união Idioma.',
        'Os valores deveriam ser do tipo Idioma.',
        'saudacoes.pt não existe.',
      ],
      correctReason: 1,
    },
    hints: ['Quantos idiomas a união tem? E o objeto?', 'Com uma união como chave, cada membro vira propriedade obrigatória.'],
    explanation: 'TS2741: Property \'es\' is missing in type ... but required in type \'Record<Idioma, string>\'.',
  }),
  erroDeTipo({
    id: 'ts-intermediario-erro-readonly-array',
    difficulty: 'intermediario',
    topic: 'readonly & Imutabilidade',
    title: 'Erro de Tipo: push em um Array readonly',
    summary: 'Um método que altera o array é chamado em uma lista somente leitura.',
    realWorldContext: 'Listas recebidas do estado de uma aplicação React não devem ser alteradas no lugar — o componente não perceberia a mudança.',
    code: `function adicionarFavorito(favoritos: readonly string[], novo: string): string[] {
  const copia = [...favoritos];
  copia.push(novo);
  favoritos.push(novo);
  return copia;
}

console.log(adicionarFavorito(['ts'], 'react'));
`,
    fixedCode: `function adicionarFavorito(favoritos: readonly string[], novo: string): string[] {
  const copia = [...favoritos];
  copia.push(novo);
  return copia;
}

console.log(adicionarFavorito(['ts'], 'react'));
`,
    challenge: {
      errorLine: 4,
      errorCode: 2339,
      reasonOptions: [
        'copia também é readonly, então a linha 3 é que falha.',
        'O spread não funciona com arrays readonly.',
        'favoritos é readonly string[], que não tem o método push.',
        'A função deveria retornar readonly string[].',
      ],
      correctReason: 2,
    },
    hints: ['A cópia feita com spread é um array comum.', 'Qual linha altera o array recebido por parâmetro?'],
    explanation: 'TS2339: Property \'push\' does not exist on type \'readonly string[]\'. A cópia com spread é mutável; o parâmetro não.',
  }),
  erroDeTipo({
    id: 'ts-intermediario-erro-classe-abstrata',
    difficulty: 'intermediario',
    topic: 'Classes & Modificadores de Acesso',
    title: 'Erro de Tipo: Instanciando uma Classe Abstrata',
    summary: 'O código tenta criar uma instância de uma classe abstract.',
    realWorldContext: 'Classes abstratas definem um contrato (ex.: todo meio de pagamento calcula taxa) sem fazer sentido sozinhas.',
    code: `abstract class MeioPagamento {
  abstract taxa(valor: number): number;
}

class Pix extends MeioPagamento {
  taxa(): number {
    return 0;
  }
}

const generico = new MeioPagamento();
console.log(new Pix().taxa());
`,
    fixedCode: `abstract class MeioPagamento {
  abstract taxa(valor: number): number;
}

class Pix extends MeioPagamento {
  taxa(): number {
    return 0;
  }
}

const pix: MeioPagamento = new Pix();
console.log(pix.taxa(100));
`,
    challenge: {
      errorLine: 11,
      errorCode: 2511,
      reasonOptions: [
        'Pix não implementa o parâmetro valor de taxa.',
        'Classes abstratas não podem ser instanciadas diretamente.',
        'abstract só pode ser usado em interfaces.',
        'new Pix() precisa de argumentos.',
      ],
      correctReason: 1,
    },
    hints: ['Um método com menos parâmetros é compatível em TypeScript.', 'Procure um "new" de uma classe abstract.'],
    explanation: 'TS2511: Cannot create an instance of an abstract class. Só as subclasses concretas (como Pix) podem ser instanciadas.',
  }),
];
