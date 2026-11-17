import { TsExercise } from '../../types/exercise';

/**
 * Trilha TypeScript — projetos DEV com projectBrief completo.
 * Sem DOM nem rede: dependências externas (transporte HTTP, relógio) são injetadas
 * por parâmetro, o que também é a prática recomendada para código testável.
 * IDs: `ts-dev-<slug>` (checado pelo tipo TsExercise<'dev'>).
 * Todo o código assume `strict: true`.
 */
export const tsDevProjects: TsExercise<'dev'>[] = [
  // 1 — Resposta de API com dados parciais e validação em runtime
  {
    id: 'ts-dev-validacao-api-consultas',
    language: 'typescript',
    difficulty: 'dev',
    type: 'codigo_livre',
    topic: 'Projeto: Validação de Resposta de API em Runtime',
    title: 'Validador de Respostas da API de Consultas Médicas',
    summary: 'Transforme o JSON instável de uma API legada em dados tipados, separando registros válidos dos inválidos.',
    realWorldContext:
      'APIs legadas devolvem campos faltando, datas mal formatadas e status desconhecidos. Tipar a resposta com uma interface não protege nada em runtime: é preciso validar a partir de unknown.',
    description:
      'O PO da "SaúdeJá Telemedicina" precisa que o painel de agenda nunca quebre por causa de registros malformados. Implemente validarConsulta (unknown → Result<Consulta>) e processarLote, que separa as consultas válidas e conta as rejeitadas por motivo.',
    goal: 'Implementar validarConsulta e processarLote sem usar any nem type assertions sobre o dado bruto.',
    projectBrief: {
      clientName: 'SaúdeJá Telemedicina',
      poName: 'Marina Albuquerque (PO — Agenda & Integrações)',
      businessContext:
        'A agenda médica consome uma API legada de um parceiro hospitalar. Em produção, cerca de 3% dos registros chegam incompletos e hoje derrubam a tela inteira. A diretoria quer que a agenda mostre todas as consultas válidas e registre, por motivo, quantas foram descartadas.',
      userStories: [
        { asA: 'Médico', iWant: 'ver minha agenda mesmo quando alguns registros vierem quebrados', soThat: 'eu não perca as consultas que estão corretas.' },
        { asA: 'Time de Integrações', iWant: 'saber quantos registros foram descartados e por qual motivo', soThat: 'eu possa cobrar o parceiro com dados concretos.' },
        { asA: 'Desenvolvedor do painel', iWant: 'receber objetos já tipados como Consulta', soThat: 'eu não precise revalidar campos em cada componente.' },
      ],
      functionalRequirements: [
        'RF01: validarConsulta(dado: unknown) retorna { ok: true, valor: Consulta } ou { ok: false, erro: MotivoRejeicao }.',
        'RF02: id deve ser string não vazia; senão, motivo "id_invalido".',
        'RF03: paciente deve ser objeto com nome string não vazio; email é opcional, mas se vier precisa ser string com "@". Falha: "paciente_invalido".',
        'RF04: status deve ser "agendada", "realizada" ou "cancelada"; senão, "status_invalido".',
        'RF05: inicio deve ser string de data válida (Date.parse não retorna NaN); senão, "data_invalida".',
        'RF06: processarLote(dados: unknown) aceita só arrays (outro valor → lote vazio) e retorna { validas, rejeitadas }, onde rejeitadas conta por motivo.',
      ],
      nonFunctionalRequirements: [
        'RNF01: Proibido any e "as" sobre o dado bruto: a validação deve estreitar unknown passo a passo.',
        'RNF02: A primeira regra violada (na ordem RF02 → RF05) define o motivo.',
        'RNF03: O objeto Consulta retornado deve ser novo (não reaproveitar o objeto bruto), sem campos extras.',
      ],
      acceptanceCriteria: [
        { id: 'ac-1', label: 'Registro completo é aceito e retornado como Consulta.' },
        { id: 'ac-2', label: 'Paciente sem email é aceito; email sem "@" é rejeitado.' },
        { id: 'ac-3', label: 'Status desconhecido e data inválida são rejeitados com o motivo correto.' },
        { id: 'ac-4', label: 'processarLote conta rejeições por motivo e ignora entradas que não são array.' },
      ],
      databaseSchema: `// Contrato esperado (após validação)
interface Consulta {
  id: string;
  paciente: { nome: string; email?: string };
  status: 'agendada' | 'realizada' | 'cancelada';
  inicio: string; // ISO 8601
}

// Exemplo de payload bruto da API legada
[
  { "id": "c1", "paciente": { "nome": "Ana" }, "status": "agendada", "inicio": "2026-11-20T09:00:00Z" },
  { "id": "",   "paciente": { "nome": "Bia" }, "status": "agendada", "inicio": "2026-11-20T10:00:00Z" },
  { "id": "c3", "paciente": { "nome": "Caio" }, "status": "remarcada", "inicio": "2026-11-20T11:00:00Z" }
]`,
      architectureNotes:
        'Crie pequenos type guards reutilizáveis (ehObjeto, ehStringNaoVazia, ehStatus) e componha-os. Isole a validação na borda: depois de processarLote, o restante do sistema só enxerga Consulta.',
    },
    templateCode: `type Status = 'agendada' | 'realizada' | 'cancelada';

interface Consulta {
  id: string;
  paciente: { nome: string; email?: string };
  status: Status;
  inicio: string;
}

type MotivoRejeicao = 'id_invalido' | 'paciente_invalido' | 'status_invalido' | 'data_invalida';
type Result<T> = { ok: true; valor: T } | { ok: false; erro: MotivoRejeicao };

function ehObjeto(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function validarConsulta(dado: unknown): Result<Consulta> {
  // Implemente as regras RF02 a RF05, nessa ordem
  return { ok: false, erro: 'id_invalido' };
}

function processarLote(dados: unknown): { validas: Consulta[]; rejeitadas: Record<MotivoRejeicao, number> } {
  // Implemente RF06
  return {
    validas: [],
    rejeitadas: { id_invalido: 0, paciente_invalido: 0, status_invalido: 0, data_invalida: 0 },
  };
}
`,
    solutionCode: `type Status = 'agendada' | 'realizada' | 'cancelada';

interface Consulta {
  id: string;
  paciente: { nome: string; email?: string };
  status: Status;
  inicio: string;
}

type MotivoRejeicao = 'id_invalido' | 'paciente_invalido' | 'status_invalido' | 'data_invalida';
type Result<T> = { ok: true; valor: T } | { ok: false; erro: MotivoRejeicao };

const STATUS_VALIDOS: readonly Status[] = ['agendada', 'realizada', 'cancelada'];

function ehObjeto(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function ehStringNaoVazia(v: unknown): v is string {
  return typeof v === 'string' && v.trim() !== '';
}

function ehStatus(v: unknown): v is Status {
  return typeof v === 'string' && STATUS_VALIDOS.some(s => s === v);
}

function validarPaciente(v: unknown): Consulta['paciente'] | null {
  if (!ehObjeto(v) || !ehStringNaoVazia(v.nome)) return null;
  if (v.email === undefined) return { nome: v.nome };
  if (typeof v.email !== 'string' || !v.email.includes('@')) return null;
  return { nome: v.nome, email: v.email };
}

function validarConsulta(dado: unknown): Result<Consulta> {
  if (!ehObjeto(dado) || !ehStringNaoVazia(dado.id)) return { ok: false, erro: 'id_invalido' };
  const paciente = validarPaciente(dado.paciente);
  if (!paciente) return { ok: false, erro: 'paciente_invalido' };
  if (!ehStatus(dado.status)) return { ok: false, erro: 'status_invalido' };
  if (typeof dado.inicio !== 'string' || Number.isNaN(Date.parse(dado.inicio))) {
    return { ok: false, erro: 'data_invalida' };
  }
  return { ok: true, valor: { id: dado.id, paciente, status: dado.status, inicio: dado.inicio } };
}

function processarLote(dados: unknown): { validas: Consulta[]; rejeitadas: Record<MotivoRejeicao, number> } {
  const rejeitadas: Record<MotivoRejeicao, number> = {
    id_invalido: 0,
    paciente_invalido: 0,
    status_invalido: 0,
    data_invalida: 0,
  };
  const validas: Consulta[] = [];
  if (!Array.isArray(dados)) return { validas, rejeitadas };

  for (const item of dados) {
    const r = validarConsulta(item);
    if (r.ok) validas.push(r.valor);
    else rejeitadas[r.erro]++;
  }
  return { validas, rejeitadas };
}
`,
    typeAssertions: `const r = validarConsulta(JSON.parse('{}'));
if (r.ok) {
  const status: 'agendada' | 'realizada' | 'cancelada' = r.valor.status;
}
// @ts-expect-error — valor só existe quando ok é true
r.valor;`,
    hints: [
      'Comece pelos type guards pequenos: ehStringNaoVazia(v): v is string e ehStatus(v): v is Status.',
      'Depois de ehObjeto(dado), dado.id é unknown: passe-o por ehStringNaoVazia para virar string.',
      'Para o email opcional: undefined é aceito; qualquer outro valor precisa ser string com "@".',
      'Monte um objeto novo no retorno, copiando só os campos do contrato.',
    ],
    testCases: [
      { description: 'Aceita consulta completa', expectedOutput: 'ok', testFunction: `const r = validarConsulta({ id: 'c1', paciente: { nome: 'Ana', email: 'ana@x.com' }, status: 'agendada', inicio: '2026-11-20T09:00:00Z' }); return r.ok && r.valor.paciente.email === 'ana@x.com';` },
      { description: 'Aceita paciente sem email', expectedOutput: 'ok', testFunction: `return validarConsulta({ id: 'c1', paciente: { nome: 'Ana' }, status: 'realizada', inicio: '2026-11-20' }).ok === true;` },
      { description: 'Rejeita id vazio', expectedOutput: 'id_invalido', testFunction: `const r = validarConsulta({ id: ' ', paciente: { nome: 'Ana' }, status: 'agendada', inicio: '2026-11-20' }); return !r.ok && r.erro === 'id_invalido';` },
      { description: 'Rejeita email sem @', expectedOutput: 'paciente_invalido', testFunction: `const r = validarConsulta({ id: 'c1', paciente: { nome: 'Ana', email: 'ana' }, status: 'agendada', inicio: '2026-11-20' }); return !r.ok && r.erro === 'paciente_invalido';` },
      { description: 'Rejeita status desconhecido', expectedOutput: 'status_invalido', testFunction: `const r = validarConsulta({ id: 'c1', paciente: { nome: 'Ana' }, status: 'remarcada', inicio: '2026-11-20' }); return !r.ok && r.erro === 'status_invalido';` },
      { description: 'Rejeita data inválida', expectedOutput: 'data_invalida', testFunction: `const r = validarConsulta({ id: 'c1', paciente: { nome: 'Ana' }, status: 'agendada', inicio: 'amanhã' }); return !r.ok && r.erro === 'data_invalida';` },
      { description: 'Não copia campos extras', expectedOutput: 'sem campo extra', testFunction: `const r = validarConsulta({ id: 'c1', paciente: { nome: 'Ana' }, status: 'agendada', inicio: '2026-11-20', senhaInterna: 'x' }); return r.ok && !('senhaInterna' in r.valor);` },
      { description: 'processarLote separa e conta por motivo', expectedOutput: '1 válida, 1 id_invalido, 1 status_invalido', testFunction: `const r = processarLote([{ id: 'c1', paciente: { nome: 'Ana' }, status: 'agendada', inicio: '2026-11-20' }, { id: '', paciente: { nome: 'Bia' }, status: 'agendada', inicio: '2026-11-20' }, { id: 'c3', paciente: { nome: 'Caio' }, status: 'remarcada', inicio: '2026-11-20' }]); return r.validas.length === 1 && r.rejeitadas.id_invalido === 1 && r.rejeitadas.status_invalido === 1 && r.rejeitadas.data_invalida === 0;` },
      { description: 'processarLote ignora entrada que não é array', expectedOutput: 'lote vazio', testFunction: `const r = processarLote({ dados: [] }); return r.validas.length === 0 && r.rejeitadas.id_invalido === 0;` },
    ],
    explanation:
      'A borda do sistema recebe unknown e devolve tipos confiáveis. Cada type guard estreita um pedaço do dado, e o Result carrega o motivo da rejeição na assinatura. Depois de processarLote, nenhum componente precisa desconfiar dos dados — é o mesmo princípio de bibliotecas como zod e valibot, implementado à mão.',
    validationRules: [
      { id: 'rule-no-any', type: 'not_contains', target: 'any', description: 'Não usa any' },
      { id: 'rule-no-as', type: 'not_contains', target: ' as ', description: 'Não usa type assertion' },
    ],
  },

  // 2 — Formulário genérico tipado
  {
    id: 'ts-dev-formulario-generico',
    language: 'typescript',
    difficulty: 'dev',
    type: 'codigo_livre',
    topic: 'Projeto: Formulário Genérico Tipado',
    title: 'Motor de Validação de Formulários Genérico e Tipado',
    summary: 'Construa validadores componíveis cujo tipo acompanha o tipo de cada campo do formulário.',
    realWorldContext:
      'Cada formulário novo costuma repetir a mesma lógica de "obrigatório", "mínimo de caracteres", "idade mínima". Um motor genérico elimina a repetição — e os tipos impedem aplicar um validador de texto a um campo numérico.',
    description:
      'A "CodaAcademy" vai lançar cadastro, checkout e perfil, todos com validação. Implemente as fábricas de validadores (obrigatorio, minCaracteres, entre, combinar) e validarFormulario, que aplica um esquema tipado aos valores e retorna os erros por campo.',
    goal: 'Implementar os validadores e o motor de validação genérico.',
    projectBrief: {
      clientName: 'CodaAcademy — Cursos Online de Programação',
      poName: 'Thiago Reis (PO — Growth & Onboarding)',
      businessContext:
        'Hoje cada tela valida campos de um jeito, e as mensagens de erro são inconsistentes. O time de Growth quer um motor único: o esquema de validação de cada formulário deve ser declarado uma vez, com checagem de tipos, e reaproveitado no frontend e em testes.',
      userStories: [
        { asA: 'Aluno se cadastrando', iWant: 'ver mensagens de erro claras ao lado de cada campo', soThat: 'eu saiba exatamente o que corrigir.' },
        { asA: 'Desenvolvedor', iWant: 'declarar o esquema de validação com tipos', soThat: 'o compilador impeça usar um validador de texto em um campo numérico.' },
        { asA: 'QA', iWant: 'testar a validação sem renderizar a tela', soThat: 'a regressão seja rápida e confiável.' },
      ],
      functionalRequirements: [
        'RF01: Validador<V> = (valor: V) => string | null (null significa válido).',
        'RF02: obrigatorio(msg?) falha para string vazia (após trim), null ou undefined. Mensagem padrão: "Campo obrigatório".',
        'RF03: minCaracteres(n) falha se o texto tiver menos de n caracteres: "Mínimo de <n> caracteres".',
        'RF04: entre(min, max) falha para números fora do intervalo fechado: "Deve estar entre <min> e <max>".',
        'RF05: combinar(...validadores) executa em ordem e retorna o primeiro erro.',
        'RF06: validarFormulario(valores, esquema) retorna { valido, erros }, com erros só para os campos inválidos.',
      ],
      nonFunctionalRequirements: [
        'RNF01: Esquema<T> = { [K in keyof T]?: Validador<T[K]> } — campos sem validador são aceitos.',
        'RNF02: As fábricas devem ser genéricas o suficiente para serem reaproveitadas em qualquer formulário.',
        'RNF03: Sem any.',
      ],
      acceptanceCriteria: [
        { id: 'ac-1', label: 'Formulário válido retorna valido: true e erros vazio.' },
        { id: 'ac-2', label: 'Cada campo inválido aparece em erros com a mensagem do primeiro validador que falhou.' },
        { id: 'ac-3', label: 'combinar respeita a ordem dos validadores.' },
        { id: 'ac-4', label: 'Usar minCaracteres em um campo numérico é erro de compilação.' },
      ],
      databaseSchema: `// Exemplo de esquema para o cadastro
interface Cadastro { nome: string; email: string; idade: number }

const esquema: Esquema<Cadastro> = {
  nome: combinar(obrigatorio(), minCaracteres(3)),
  email: obrigatorio('Informe o e-mail'),
  idade: entre(16, 120),
};`,
      architectureNotes:
        'Fábricas de validadores são funções que retornam funções (closures). O tipo Esquema<T> é um mapped type: é ele que conecta cada campo ao tipo do valor que o validador recebe.',
    },
    templateCode: `type Validador<V> = (valor: V) => string | null;
type Esquema<T> = { [K in keyof T]?: Validador<T[K]> };
type ResultadoValidacao<T> = { valido: boolean; erros: Partial<Record<keyof T, string>> };

function obrigatorio(mensagem = 'Campo obrigatório'): Validador<string | null | undefined> {
  // Implemente aqui
  return () => null;
}

function minCaracteres(n: number): Validador<string> {
  // Implemente aqui
  return () => null;
}

function entre(min: number, max: number): Validador<number> {
  // Implemente aqui
  return () => null;
}

function combinar<V>(...validadores: Validador<V>[]): Validador<V> {
  // Implemente aqui
  return () => null;
}

function validarFormulario<T>(valores: T, esquema: Esquema<T>): ResultadoValidacao<T> {
  // Implemente aqui
  return { valido: true, erros: {} };
}
`,
    solutionCode: `type Validador<V> = (valor: V) => string | null;
type Esquema<T> = { [K in keyof T]?: Validador<T[K]> };
type ResultadoValidacao<T> = { valido: boolean; erros: Partial<Record<keyof T, string>> };

function obrigatorio(mensagem = 'Campo obrigatório'): Validador<string | null | undefined> {
  return valor => (valor === null || valor === undefined || valor.trim() === '' ? mensagem : null);
}

function minCaracteres(n: number): Validador<string> {
  return valor => (valor.length < n ? 'Mínimo de ' + n + ' caracteres' : null);
}

function entre(min: number, max: number): Validador<number> {
  return valor => (valor < min || valor > max ? 'Deve estar entre ' + min + ' e ' + max : null);
}

function combinar<V>(...validadores: Validador<V>[]): Validador<V> {
  return valor => {
    for (const validar of validadores) {
      const erro = validar(valor);
      if (erro !== null) return erro;
    }
    return null;
  };
}

function validarFormulario<T>(valores: T, esquema: Esquema<T>): ResultadoValidacao<T> {
  const erros: Partial<Record<keyof T, string>> = {};
  for (const campo in esquema) {
    const validar = esquema[campo];
    if (!validar) continue;
    const erro = validar(valores[campo]);
    if (erro !== null) erros[campo] = erro;
  }
  return { valido: Object.keys(erros).length === 0, erros };
}
`,
    typeAssertions: `interface Cadastro { nome: string; email: string; idade: number }
const esquema: Esquema<Cadastro> = {
  nome: combinar(obrigatorio(), minCaracteres(3)),
  email: obrigatorio('Informe o e-mail'),
  idade: entre(16, 120),
};
const resultado = validarFormulario({ nome: 'Ana', email: 'a@b.c', idade: 30 }, esquema);
const erroNome: string | undefined = resultado.erros.nome;
// @ts-expect-error — minCaracteres valida texto, não número
const errado: Esquema<Cadastro> = { idade: minCaracteres(2) };`,
    hints: [
      'Cada fábrica retorna uma arrow function que recebe o valor e devolve a mensagem ou null.',
      'Em combinar, percorra os validadores e retorne o primeiro erro diferente de null.',
      'Em validarFormulario, use for...in sobre o esquema: campo é keyof T, então valores[campo] tem o tipo certo para o validador.',
      'Repare que obrigatorio aceita string | null | undefined, então serve para campos string (parâmetros de função são contravariantes).',
    ],
    testCases: [
      { description: 'obrigatorio rejeita vazio e espaços', expectedOutput: 'Campo obrigatório', testFunction: `const v = obrigatorio(); return v('') === 'Campo obrigatório' && v('   ') === 'Campo obrigatório' && v(undefined) === 'Campo obrigatório' && v('x') === null;` },
      { description: 'Mensagem personalizada', expectedOutput: 'Informe o e-mail', testFunction: `return obrigatorio('Informe o e-mail')('') === 'Informe o e-mail';` },
      { description: 'minCaracteres e entre', expectedOutput: 'mensagens corretas', testFunction: `return minCaracteres(3)('ab') === 'Mínimo de 3 caracteres' && minCaracteres(3)('abc') === null && entre(16, 120)(15) === 'Deve estar entre 16 e 120' && entre(16, 120)(120) === null;` },
      { description: 'combinar retorna o primeiro erro', expectedOutput: 'Campo obrigatório', testFunction: `const v = combinar(obrigatorio(), minCaracteres(3)); return v('') === 'Campo obrigatório' && v('ab') === 'Mínimo de 3 caracteres' && v('abc') === null;` },
      { description: 'Formulário válido', expectedOutput: '{ valido: true, erros: {} }', testFunction: `const r = validarFormulario({ nome: 'Ana', idade: 30 }, { nome: minCaracteres(3), idade: entre(16, 120) }); return r.valido === true && Object.keys(r.erros).length === 0;` },
      { description: 'Erros por campo', expectedOutput: '{ nome, idade }', testFunction: `const r = validarFormulario({ nome: 'Al', idade: 10, bio: '' }, { nome: minCaracteres(3), idade: entre(16, 120) }); return r.valido === false && r.erros.nome === 'Mínimo de 3 caracteres' && r.erros.idade === 'Deve estar entre 16 e 120' && !('bio' in r.erros);` },
    ],
    explanation:
      'O mapped type Esquema<T> amarra cada campo ao seu validador: Validador<T["idade"]> é Validador<number>, então minCaracteres (Validador<string>) não encaixa. As fábricas são closures que capturam a configuração (n, min, max, mensagem) — padrão usado por bibliotecas como yup, zod e react-hook-form.',
    validationRules: [{ id: 'rule-no-any', type: 'not_contains', target: 'any', description: 'Não usa any' }],
  },

  // 3 — Store com actions discriminadas e reducer exaustivo
  {
    id: 'ts-dev-reducer-carrinho',
    language: 'typescript',
    difficulty: 'dev',
    type: 'codigo_livre',
    topic: 'Projeto: Store com Actions Discriminadas',
    title: 'Reducer Exaustivo do Carrinho de Compras',
    summary: 'Implemente um reducer imutável com actions discriminadas e checagem de exaustividade com never.',
    realWorldContext:
      'Carrinhos de compra em React costumam usar useReducer ou Redux. Com actions como discriminated union, adicionar uma ação nova sem tratá-la no reducer vira erro de compilação.',
    description:
      'A "Feira Digital" está migrando o carrinho para useReducer. Implemente o reducer carrinhoReducer (adicionar, remover, alterarQuantidade, aplicarCupom, limpar) e o seletor calcularTotal. O reducer é uma função pura e não pode mutar o estado recebido.',
    goal: 'Implementar o reducer e o seletor respeitando imutabilidade e exaustividade.',
    projectBrief: {
      clientName: 'Feira Digital — Marketplace de Produtores Locais',
      poName: 'Larissa Moura (PO — Checkout)',
      businessContext:
        'O carrinho atual tem bugs de quantidade (itens duplicados) e o cupom às vezes é aplicado duas vezes. O time decidiu concentrar todas as mudanças de estado em um reducer puro e tipado, fácil de testar sem interface.',
      userStories: [
        { asA: 'Cliente', iWant: 'adicionar o mesmo produto mais de uma vez e ver a quantidade somar', soThat: 'meu carrinho não fique com linhas duplicadas.' },
        { asA: 'Cliente', iWant: 'aplicar um cupom válido e ver o desconto no total', soThat: 'eu saiba quanto vou pagar.' },
        { asA: 'Desenvolvedor', iWant: 'que o compilador avise quando uma action nova não for tratada', soThat: 'nenhuma ação seja silenciosamente ignorada.' },
      ],
      functionalRequirements: [
        'RF01: adicionar — se o produto já existe, soma a quantidade; senão, inclui com a quantidade informada.',
        'RF02: remover — retira o item pelo id do produto.',
        'RF03: alterarQuantidade — define a quantidade; quantidade <= 0 remove o item.',
        'RF04: aplicarCupom — "FEIRA10" dá 10% de desconto; código desconhecido mantém o estado (mesmo objeto).',
        'RF05: limpar — volta ao estado inicial (sem itens e sem cupom).',
        'RF06: calcularTotal(estado) — soma preco × quantidade, aplica o desconto do cupom e arredonda para 2 casas.',
      ],
      nonFunctionalRequirements: [
        'RNF01: O reducer nunca muta o estado nem os arrays recebidos (estado é readonly).',
        'RNF02: O switch sobre action.tipo deve ter um default com checagem de exaustividade (never).',
        'RNF03: Sem any.',
      ],
      acceptanceCriteria: [
        { id: 'ac-1', label: 'Adicionar produto existente soma a quantidade em vez de duplicar a linha.' },
        { id: 'ac-2', label: 'Quantidade zero ou negativa remove o item.' },
        { id: 'ac-3', label: 'Cupom FEIRA10 aplica 10% no total; cupom inválido não altera o estado.' },
        { id: 'ac-4', label: 'O estado original permanece inalterado após qualquer action.' },
      ],
      architectureNotes:
        'Modele Action como discriminated union pelo campo "tipo". Use spread e map/filter para gerar novos arrays. O seletor calcularTotal fica fora do reducer: estado guarda dados, seletores derivam valores.',
    },
    templateCode: `interface Produto { id: string; nome: string; preco: number }
interface ItemCarrinho { produto: Produto; quantidade: number }

interface EstadoCarrinho {
  readonly itens: readonly ItemCarrinho[];
  readonly cupom: 'FEIRA10' | null;
}

type Action =
  | { tipo: 'adicionar'; produto: Produto; quantidade: number }
  | { tipo: 'remover'; produtoId: string }
  | { tipo: 'alterarQuantidade'; produtoId: string; quantidade: number }
  | { tipo: 'aplicarCupom'; codigo: string }
  | { tipo: 'limpar' };

const estadoInicial: EstadoCarrinho = { itens: [], cupom: null };

function carrinhoReducer(estado: EstadoCarrinho, action: Action): EstadoCarrinho {
  switch (action.tipo) {
    // Implemente os cases aqui
    default: {
      const naoTratada: never = action;
      return estado;
    }
  }
}

function calcularTotal(estado: EstadoCarrinho): number {
  // Implemente aqui
  return 0;
}
`,
    solutionCode: `interface Produto { id: string; nome: string; preco: number }
interface ItemCarrinho { produto: Produto; quantidade: number }

interface EstadoCarrinho {
  readonly itens: readonly ItemCarrinho[];
  readonly cupom: 'FEIRA10' | null;
}

type Action =
  | { tipo: 'adicionar'; produto: Produto; quantidade: number }
  | { tipo: 'remover'; produtoId: string }
  | { tipo: 'alterarQuantidade'; produtoId: string; quantidade: number }
  | { tipo: 'aplicarCupom'; codigo: string }
  | { tipo: 'limpar' };

const estadoInicial: EstadoCarrinho = { itens: [], cupom: null };

function carrinhoReducer(estado: EstadoCarrinho, action: Action): EstadoCarrinho {
  switch (action.tipo) {
    case 'adicionar': {
      const existe = estado.itens.some(i => i.produto.id === action.produto.id);
      const itens = existe
        ? estado.itens.map(i =>
            i.produto.id === action.produto.id ? { ...i, quantidade: i.quantidade + action.quantidade } : i
          )
        : [...estado.itens, { produto: action.produto, quantidade: action.quantidade }];
      return { ...estado, itens };
    }
    case 'remover':
      return { ...estado, itens: estado.itens.filter(i => i.produto.id !== action.produtoId) };
    case 'alterarQuantidade':
      if (action.quantidade <= 0) {
        return { ...estado, itens: estado.itens.filter(i => i.produto.id !== action.produtoId) };
      }
      return {
        ...estado,
        itens: estado.itens.map(i => (i.produto.id === action.produtoId ? { ...i, quantidade: action.quantidade } : i)),
      };
    case 'aplicarCupom':
      return action.codigo === 'FEIRA10' ? { ...estado, cupom: 'FEIRA10' } : estado;
    case 'limpar':
      return estadoInicial;
    default: {
      const naoTratada: never = action;
      return estado;
    }
  }
}

function calcularTotal(estado: EstadoCarrinho): number {
  const bruto = estado.itens.reduce((soma, i) => soma + i.produto.preco * i.quantidade, 0);
  const desconto = estado.cupom === 'FEIRA10' ? 0.1 : 0;
  return Number((bruto * (1 - desconto)).toFixed(2));
}
`,
    typeAssertions: `const e1 = carrinhoReducer(estadoInicial, { tipo: 'limpar' });
// @ts-expect-error — action inexistente
carrinhoReducer(estadoInicial, { tipo: 'finalizar' });
// @ts-expect-error — remover exige produtoId
carrinhoReducer(estadoInicial, { tipo: 'remover' });
// @ts-expect-error — o estado é readonly
estadoInicial.itens.push({ produto: { id: 'x', nome: 'x', preco: 1 }, quantidade: 1 });`,
    hints: [
      'Em "adicionar", use some para saber se o produto já existe e map para somar a quantidade.',
      'Para remover, filter mantendo os itens com id diferente.',
      'Nunca use push/splice: o estado é readonly e o reducer deve devolver objetos novos.',
      'Cupom inválido: retorne o próprio estado (mesmo objeto) para o React saber que nada mudou.',
    ],
    testCases: [
      { description: 'Adicionar soma quantidade de produto existente', expectedOutput: '1 linha, quantidade 3', testFunction: `const p = { id: 'p1', nome: 'Mel', preco: 20 }; let s = carrinhoReducer(estadoInicial, { tipo: 'adicionar', produto: p, quantidade: 1 }); s = carrinhoReducer(s, { tipo: 'adicionar', produto: p, quantidade: 2 }); return s.itens.length === 1 && s.itens[0].quantidade === 3;` },
      { description: 'Quantidade zero remove o item', expectedOutput: '0 itens', testFunction: `const p = { id: 'p1', nome: 'Mel', preco: 20 }; let s = carrinhoReducer(estadoInicial, { tipo: 'adicionar', produto: p, quantidade: 1 }); s = carrinhoReducer(s, { tipo: 'alterarQuantidade', produtoId: 'p1', quantidade: 0 }); return s.itens.length === 0;` },
      { description: 'Remover retira pelo id', expectedOutput: 'só p2', testFunction: `let s = carrinhoReducer(estadoInicial, { tipo: 'adicionar', produto: { id: 'p1', nome: 'A', preco: 1 }, quantidade: 1 }); s = carrinhoReducer(s, { tipo: 'adicionar', produto: { id: 'p2', nome: 'B', preco: 1 }, quantidade: 1 }); s = carrinhoReducer(s, { tipo: 'remover', produtoId: 'p1' }); return s.itens.length === 1 && s.itens[0].produto.id === 'p2';` },
      { description: 'Cupom FEIRA10 aplica 10%', expectedOutput: '54', testFunction: `let s = carrinhoReducer(estadoInicial, { tipo: 'adicionar', produto: { id: 'p1', nome: 'Queijo', preco: 30 }, quantidade: 2 }); s = carrinhoReducer(s, { tipo: 'aplicarCupom', codigo: 'FEIRA10' }); return calcularTotal(s) === 54;` },
      { description: 'Cupom inválido mantém o mesmo estado', expectedOutput: 'mesma referência', testFunction: `const s = carrinhoReducer(estadoInicial, { tipo: 'adicionar', produto: { id: 'p1', nome: 'A', preco: 1 }, quantidade: 1 }); return carrinhoReducer(s, { tipo: 'aplicarCupom', codigo: 'XYZ' }) === s;` },
      { description: 'Não muta o estado anterior', expectedOutput: 'estado anterior intacto', testFunction: `const s1 = carrinhoReducer(estadoInicial, { tipo: 'adicionar', produto: { id: 'p1', nome: 'A', preco: 1 }, quantidade: 1 }); const s2 = carrinhoReducer(s1, { tipo: 'adicionar', produto: { id: 'p1', nome: 'A', preco: 1 }, quantidade: 4 }); return s1.itens[0].quantidade === 1 && s2.itens[0].quantidade === 5 && estadoInicial.itens.length === 0;` },
      { description: 'Limpar volta ao estado inicial', expectedOutput: 'vazio e sem cupom', testFunction: `let s = carrinhoReducer(estadoInicial, { tipo: 'adicionar', produto: { id: 'p1', nome: 'A', preco: 1 }, quantidade: 1 }); s = carrinhoReducer(s, { tipo: 'aplicarCupom', codigo: 'FEIRA10' }); s = carrinhoReducer(s, { tipo: 'limpar' }); return s.itens.length === 0 && s.cupom === null;` },
    ],
    explanation:
      'A discriminated union Action dá narrowing automático em cada case (action.produto só existe em "adicionar") e o default com never garante exaustividade. Os tipos readonly tornam qualquer mutação um erro de compilação — exatamente o que o React precisa para detectar mudanças por referência.',
    validationRules: [
      { id: 'rule-never', type: 'contains', target: ': never', description: 'Checagem de exaustividade com never' },
      { id: 'rule-no-any', type: 'not_contains', target: 'any', description: 'Não usa any' },
    ],
  },

  // 4 — Cliente HTTP genérico com inferência por endpoint
  {
    id: 'ts-dev-cliente-http-tipado',
    language: 'typescript',
    difficulty: 'dev',
    type: 'codigo_livre',
    topic: 'Projeto: Cliente HTTP Genérico',
    title: 'Cliente HTTP com Tipo de Resposta Inferido por Endpoint',
    summary: 'Construa um cliente de API cujo tipo de retorno e corpo são deduzidos a partir da rota chamada.',
    realWorldContext:
      'Em times grandes, é comum o frontend chamar uma rota esperando um formato que o backend não devolve. Um mapa de endpoints tipado faz o compilador conhecer o contrato de cada rota.',
    description:
      'A "Rota Certa Logística" quer um cliente único para a sua API. Implemente requisitar: ele recebe a rota no formato "MÉTODO /caminho", separa método e caminho, chama o transporte injetado e retenta UMA vez em caso de falha de rede, mas só para GET. O tipo do corpo e da resposta vêm do mapa ApiLogistica.',
    goal: 'Implementar o cliente genérico com separação de rota, transporte injetado e retentativa.',
    projectBrief: {
      clientName: 'Rota Certa Logística',
      poName: 'Daniel Okoye (PO — Plataforma de Entregas)',
      businessContext:
        'O app dos entregadores consome dezenas de rotas. Bugs recentes vieram de chamadas com o corpo errado e de leituras de campos que a rota não devolve. A plataforma quer um cliente tipado a partir de um único mapa de contratos, testável sem rede (transporte injetado).',
      userStories: [
        { asA: 'Desenvolvedor do app', iWant: 'que o retorno de cliente.requisitar("GET /entregas") já venha tipado', soThat: 'eu não precise escrever casts nem consultar a documentação a cada chamada.' },
        { asA: 'Entregador', iWant: 'que uma oscilação de rede não faça a lista de entregas falhar', soThat: 'eu continue trabalhando em áreas com sinal fraco.' },
        { asA: 'Tech Lead', iWant: 'que requisições que alteram dados (POST) nunca sejam repetidas automaticamente', soThat: 'não criemos entregas duplicadas.' },
      ],
      functionalRequirements: [
        'RF01: requisitar(rota, corpo?) separa a rota "GET /entregas" em método ("GET") e caminho ("/entregas").',
        'RF02: Chama transporte(metodo, caminho, corpo) e devolve a resposta com o tipo do mapa ApiLogistica.',
        'RF03: Rotas cujo corpo é undefined não exigem o segundo argumento; as demais exigem.',
        'RF04: Se o transporte rejeitar em um GET, tenta mais UMA vez; se falhar de novo, propaga o erro.',
        'RF05: POST nunca é retentado: a primeira falha é propagada.',
      ],
      nonFunctionalRequirements: [
        'RNF01: O transporte é injetado no construtor (permite testes sem rede).',
        'RNF02: O tipo de resposta é inferido pela rota: nenhum cast na chamada.',
        'RNF03: O único "as" permitido é na conversão do retorno do transporte (unknown) para a resposta do contrato.',
      ],
      acceptanceCriteria: [
        { id: 'ac-1', label: 'GET /entregas devolve Entrega[] sem cast na chamada.' },
        { id: 'ac-2', label: 'POST /entregas sem corpo é erro de compilação.' },
        { id: 'ac-3', label: 'GET com uma falha de rede seguida de sucesso devolve os dados.' },
        { id: 'ac-4', label: 'POST com falha é chamado uma única vez e propaga o erro.' },
      ],
      databaseSchema: `// Mapa de contratos da API (fonte única de verdade)
interface ApiLogistica {
  'GET /entregas':  { corpo: undefined;    resposta: Entrega[] };
  'POST /entregas': { corpo: NovaEntrega;  resposta: Entrega };
  'GET /status':    { corpo: undefined;    resposta: { online: boolean } };
}`,
      architectureNotes:
        'Use tipos auxiliares: CorpoDe<R> = ApiLogistica[R]["corpo"] e RespostaDe<R> = ApiLogistica[R]["resposta"]. Para tornar o corpo opcional só quando for undefined, use uma tupla condicional nos parâmetros rest: ...args: CorpoDe<R> extends undefined ? [] : [CorpoDe<R>].',
    },
    templateCode: `interface Entrega { id: number; endereco: string; status: 'pendente' | 'entregue' }
interface NovaEntrega { endereco: string }

interface ApiLogistica {
  'GET /entregas': { corpo: undefined; resposta: Entrega[] };
  'POST /entregas': { corpo: NovaEntrega; resposta: Entrega };
  'GET /status': { corpo: undefined; resposta: { online: boolean } };
}

type Rota = keyof ApiLogistica;
type CorpoDe<R extends Rota> = ApiLogistica[R]['corpo'];
type RespostaDe<R extends Rota> = ApiLogistica[R]['resposta'];
type Metodo = 'GET' | 'POST';
type Transporte = (metodo: Metodo, caminho: string, corpo?: unknown) => Promise<unknown>;

class ClienteApi {
  constructor(private transporte: Transporte) {}

  async requisitar<R extends Rota>(
    rota: R,
    ...args: CorpoDe<R> extends undefined ? [] : [CorpoDe<R>]
  ): Promise<RespostaDe<R>> {
    // Implemente aqui: separar método/caminho, chamar o transporte e retentar GET uma vez
    throw new Error('Não implementado');
  }
}
`,
    solutionCode: `interface Entrega { id: number; endereco: string; status: 'pendente' | 'entregue' }
interface NovaEntrega { endereco: string }

interface ApiLogistica {
  'GET /entregas': { corpo: undefined; resposta: Entrega[] };
  'POST /entregas': { corpo: NovaEntrega; resposta: Entrega };
  'GET /status': { corpo: undefined; resposta: { online: boolean } };
}

type Rota = keyof ApiLogistica;
type CorpoDe<R extends Rota> = ApiLogistica[R]['corpo'];
type RespostaDe<R extends Rota> = ApiLogistica[R]['resposta'];
type Metodo = 'GET' | 'POST';
type Transporte = (metodo: Metodo, caminho: string, corpo?: unknown) => Promise<unknown>;

function separarRota(rota: Rota): { metodo: Metodo; caminho: string } {
  const espaco = rota.indexOf(' ');
  const metodo = rota.slice(0, espaco) === 'POST' ? 'POST' : 'GET';
  return { metodo, caminho: rota.slice(espaco + 1) };
}

class ClienteApi {
  constructor(private transporte: Transporte) {}

  async requisitar<R extends Rota>(
    rota: R,
    ...args: CorpoDe<R> extends undefined ? [] : [CorpoDe<R>]
  ): Promise<RespostaDe<R>> {
    const { metodo, caminho } = separarRota(rota);
    const corpo: unknown = args[0];
    const tentativas = metodo === 'GET' ? 2 : 1;
    let ultimoErro: unknown;
    for (let i = 0; i < tentativas; i++) {
      try {
        const resposta = await this.transporte(metodo, caminho, corpo);
        return resposta as RespostaDe<R>;
      } catch (erro) {
        ultimoErro = erro;
      }
    }
    throw ultimoErro;
  }
}
`,
    typeAssertions: `async function usoTipado(cliente: ClienteApi) {
  const entregas: Entrega[] = await cliente.requisitar('GET /entregas');
  const criada: Entrega = await cliente.requisitar('POST /entregas', { endereco: 'Rua A, 10' });
  const status: boolean = (await cliente.requisitar('GET /status')).online;
  // @ts-expect-error — POST exige corpo
  await cliente.requisitar('POST /entregas');
  // @ts-expect-error — GET não aceita corpo
  await cliente.requisitar('GET /entregas', { endereco: 'x' });
  // @ts-expect-error — rota inexistente
  await cliente.requisitar('DELETE /entregas');
}`,
    hints: [
      'A rota é "MÉTODO /caminho": separe no primeiro espaço.',
      'args é [] ou [corpo]; args[0] é o corpo (ou undefined).',
      'Use um loop com 2 tentativas para GET e 1 para POST, guardando o último erro.',
      'O transporte devolve unknown; a conversão para RespostaDe<R> é o único ponto em que o contrato é assumido.',
    ],
    testCases: [
      { description: 'Separa método e caminho', expectedOutput: 'GET /entregas', testFunction: `let chamada = ''; const c = new ClienteApi(async (m, p) => { chamada = m + ' ' + p; return []; }); return c.requisitar('GET /entregas').then(() => chamada === 'GET /entregas');` },
      { description: 'Envia o corpo no POST', expectedOutput: 'Rua A', testFunction: `let corpoRecebido = null; const c = new ClienteApi(async (m, p, corpo) => { corpoRecebido = corpo; return { id: 1, endereco: 'Rua A', status: 'pendente' }; }); return c.requisitar('POST /entregas', { endereco: 'Rua A' }).then(r => corpoRecebido.endereco === 'Rua A' && r.id === 1);` },
      { description: 'GET retenta uma vez e tem sucesso', expectedOutput: '2 chamadas', testFunction: `let n = 0; const c = new ClienteApi(async () => { n++; if (n === 1) throw new Error('rede'); return { online: true }; }); return c.requisitar('GET /status').then(r => r.online === true && n === 2);` },
      { description: 'GET falha duas vezes e propaga o erro', expectedOutput: 'erro após 2 tentativas', testFunction: `let n = 0; const c = new ClienteApi(async () => { n++; throw new Error('rede'); }); return c.requisitar('GET /status').then(() => false, e => e.message === 'rede' && n === 2);` },
      { description: 'POST nunca é retentado', expectedOutput: '1 chamada', testFunction: `let n = 0; const c = new ClienteApi(async () => { n++; throw new Error('timeout'); }); return c.requisitar('POST /entregas', { endereco: 'x' }).then(() => false, e => e.message === 'timeout' && n === 1);` },
    ],
    explanation:
      'O mapa ApiLogistica é a fonte única do contrato: R extends keyof ApiLogistica faz cada chamada ser checada (rota existente, corpo certo) e o retorno ser inferido via indexed access. A tupla condicional nos parâmetros rest torna o corpo obrigatório só quando a rota exige. Injetar o transporte separa a regra de negócio (retentativa só em GET, idempotente) da rede real — e torna tudo testável.',
  },
];
