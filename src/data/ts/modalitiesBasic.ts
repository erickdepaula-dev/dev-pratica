import { TsExercise } from '../../types/exercise';

/**
 * Trilha TypeScript — modalidades do nível básico:
 * 5 corrigir_erros, 5 prever_saida, 5 desafio_pratico.
 * IDs: `ts-basico-<slug>` (checado pelo tipo TsExercise<'basico'>).
 * Todo o código assume `strict: true`.
 */
export const tsBasicModalities: TsExercise<'basico'>[] = [
  // ==========================================
  // CORRIGIR ERROS (5)
  // ==========================================
  {
    id: 'ts-basico-debug-propriedade-obrigatoria',
    language: 'typescript',
    difficulty: 'basico',
    type: 'corrigir_erros',
    topic: 'Interfaces & Propriedades Opcionais',
    title: 'Depuração: Propriedade Obrigatória Ausente',
    summary: 'Um objeto não satisfaz a interface porque falta um campo obrigatório.',
    realWorldContext:
      'Ao criar um cliente sem e-mail, o sistema de notificações quebraria lá na frente. O TypeScript barra o objeto incompleto no momento da criação.',
    description:
      'O objeto novoCliente não compila porque a interface Cliente exige email. Corrija o objeto (não a interface) adicionando o e-mail "carla@exemplo.com".',
    goal: 'Completar o objeto para satisfazer a interface.',
    bugDescription: "Property 'email' is missing in type '{ id: number; nome: string; }' but required in type 'Cliente'.",
    buggyLineNumbers: [7],
    initialBuggyCode: `interface Cliente {
  id: number;
  nome: string;
  email: string;
}

const novoCliente: Cliente = {
  id: 42,
  nome: 'Carla Lima',
};

console.log(novoCliente.nome + ' <' + novoCliente.email + '>');
`,
    templateCode: `interface Cliente {
  id: number;
  nome: string;
  email: string;
}

const novoCliente: Cliente = {
  id: 42,
  nome: 'Carla Lima',
};

console.log(novoCliente.nome + ' <' + novoCliente.email + '>');
`,
    solutionCode: `interface Cliente {
  id: number;
  nome: string;
  email: string;
}

const novoCliente: Cliente = {
  id: 42,
  nome: 'Carla Lima',
  email: 'carla@exemplo.com',
};

console.log(novoCliente.nome + ' <' + novoCliente.email + '>');
`,
    typeAssertions: `// @ts-expect-error — a interface continua exigindo email
const outro: Cliente = { id: 1, nome: 'X' };`,
    hints: [
      'O erro aponta a declaração do objeto: qual propriedade a interface exige e o objeto não tem?',
      'Não torne email opcional na interface: a regra de negócio exige e-mail.',
    ],
    testCases: [
      { description: 'O cliente tem e-mail preenchido', expectedOutput: 'carla@exemplo.com', testFunction: `return novoCliente.email === 'carla@exemplo.com';` },
    ],
    explanation:
      'Ao anotar um objeto com uma interface, o TypeScript exige todas as propriedades obrigatórias. "Consertar" afrouxando o tipo (email?: string) só empurra o problema para quem usa o dado depois.',
  },
  {
    id: 'ts-basico-debug-literal-digitado-errado',
    language: 'typescript',
    difficulty: 'basico',
    type: 'corrigir_erros',
    topic: 'Union & Literal Types',
    title: 'Depuração: Status Digitado Errado',
    summary: 'Um erro de digitação em um literal é recusado pela união de status.',
    realWorldContext:
      'Num sistema de chamados, um status "fechdo" nunca bateria com os filtros "fechado" e o chamado sumiria das listas. Com union de literais, o erro aparece na compilação.',
    description:
      'A chamada atualizarChamado usa um status que não existe na união StatusChamado. Corrija o literal.',
    goal: 'Usar um literal válido da união.',
    bugDescription: 'Argument of type \'"fechdo"\' is not assignable to parameter of type \'StatusChamado\'.',
    buggyLineNumbers: [7],
    initialBuggyCode: `type StatusChamado = 'aberto' | 'em_andamento' | 'fechado';

function atualizarChamado(id: number, status: StatusChamado): string {
  return 'Chamado #' + id + ': ' + status;
}

const mensagem = atualizarChamado(7, 'fechdo');
console.log(mensagem);
`,
    templateCode: `type StatusChamado = 'aberto' | 'em_andamento' | 'fechado';

function atualizarChamado(id: number, status: StatusChamado): string {
  return 'Chamado #' + id + ': ' + status;
}

const mensagem = atualizarChamado(7, 'fechdo');
console.log(mensagem);
`,
    solutionCode: `type StatusChamado = 'aberto' | 'em_andamento' | 'fechado';

function atualizarChamado(id: number, status: StatusChamado): string {
  return 'Chamado #' + id + ': ' + status;
}

const mensagem = atualizarChamado(7, 'fechado');
console.log(mensagem);
`,
    hints: [
      'Compare letra por letra o literal usado com os da união.',
      'Editores com TypeScript sugerem os literais válidos no autocompletar (Ctrl + Espaço).',
    ],
    testCases: [
      { description: 'A mensagem usa o status "fechado"', expectedOutput: 'Chamado #7: fechado', testFunction: `return mensagem === 'Chamado #7: fechado';` },
    ],
    explanation:
      'Unions de literais transformam erros de digitação em erros de compilação. Além disso, o editor passa a autocompletar os valores válidos.',
  },
  {
    id: 'ts-basico-debug-retorno-faltando',
    language: 'typescript',
    difficulty: 'basico',
    type: 'corrigir_erros',
    topic: 'Funções Tipadas',
    title: 'Depuração: Caminho Sem Return',
    summary: 'A função promete devolver string, mas um dos caminhos não retorna nada.',
    realWorldContext:
      'Uma função de classificação de risco que às vezes devolve undefined faz a tela exibir "undefined" para o cliente. Anotar o retorno revela o caminho esquecido.',
    description:
      'classificarRisco declara retorno string, mas quando o score é maior ou igual a 700 nada é retornado. Corrija retornando "baixo" nesse caso.',
    goal: 'Garantir que todos os caminhos da função retornem string.',
    bugDescription: 'Function lacks ending return statement and return type does not include \'undefined\'.',
    buggyLineNumbers: [1],
    initialBuggyCode: `function classificarRisco(score: number): string {
  if (score < 400) {
    return 'alto';
  } else if (score < 700) {
    return 'medio';
  }
}

console.log(classificarRisco(820));
`,
    templateCode: `function classificarRisco(score: number): string {
  if (score < 400) {
    return 'alto';
  } else if (score < 700) {
    return 'medio';
  }
}

console.log(classificarRisco(820));
`,
    solutionCode: `function classificarRisco(score: number): string {
  if (score < 400) {
    return 'alto';
  } else if (score < 700) {
    return 'medio';
  }
  return 'baixo';
}

console.log(classificarRisco(820));
`,
    hints: [
      'O que a função devolve quando score é 820?',
      'Adicione um return no final, depois do if/else if.',
    ],
    testCases: [
      { description: 'Score 820 é risco baixo', expectedOutput: 'baixo', testFunction: `return classificarRisco(820) === 'baixo';` },
      { description: 'Score 300 continua alto', expectedOutput: 'alto', testFunction: `return classificarRisco(300) === 'alto';` },
    ],
    explanation:
      'Com o retorno anotado, o TypeScript analisa o fluxo de controle e acusa caminhos que terminam sem return (TS2366). Sem a anotação, o retorno seria inferido como string | undefined e o bug passaria.',
  },
  {
    id: 'ts-basico-debug-opcional-indefinido',
    language: 'typescript',
    difficulty: 'basico',
    type: 'corrigir_erros',
    topic: 'Parâmetros Opcionais & Padrão',
    title: 'Depuração: Parâmetro Opcional Pode Ser undefined',
    summary: 'Um método de string é chamado em um parâmetro opcional sem checar se ele existe.',
    realWorldContext:
      '"Cannot read properties of undefined" é um dos erros mais comuns em produção. Com strict ligado, o TypeScript obriga a tratar o caso em que o valor não foi informado.',
    description:
      'apelido é opcional, mas o código chama apelido.toUpperCase() direto. Corrija para usar o nome quando o apelido não for informado (o resultado deve ficar em maiúsculas nos dois casos).',
    goal: 'Tratar o caso undefined antes de usar o parâmetro opcional.',
    bugDescription: "'apelido' is possibly 'undefined'.",
    buggyLineNumbers: [2],
    initialBuggyCode: `function cracha(nome: string, apelido?: string): string {
  return apelido.toUpperCase();
}

console.log(cracha('Fernanda'), cracha('Roberto', 'Beto'));
`,
    templateCode: `function cracha(nome: string, apelido?: string): string {
  return apelido.toUpperCase();
}

console.log(cracha('Fernanda'), cracha('Roberto', 'Beto'));
`,
    solutionCode: `function cracha(nome: string, apelido?: string): string {
  return (apelido ?? nome).toUpperCase();
}

console.log(cracha('Fernanda'), cracha('Roberto', 'Beto'));
`,
    hints: [
      'Dentro da função, o tipo de apelido é string | undefined.',
      'O operador ?? escolhe o valor da direita quando o da esquerda é null ou undefined: (apelido ?? nome).',
    ],
    testCases: [
      { description: 'Sem apelido usa o nome', expectedOutput: 'FERNANDA', testFunction: `return cracha('Fernanda') === 'FERNANDA';` },
      { description: 'Com apelido usa o apelido', expectedOutput: 'BETO', testFunction: `return cracha('Roberto', 'Beto') === 'BETO';` },
    ],
    explanation:
      'Com strictNullChecks (parte do strict), undefined não é mais aceito silenciosamente. O TypeScript exige que você "estreite" o tipo — com ??, if, ou ?. — antes de usar métodos de string.',
  },
  {
    id: 'ts-basico-debug-tupla-invertida',
    language: 'typescript',
    difficulty: 'basico',
    type: 'corrigir_erros',
    topic: 'Tuplas',
    title: 'Depuração: Ordem da Tupla Invertida',
    summary: 'Os elementos de uma tupla foram passados na ordem errada.',
    realWorldContext:
      'APIs de mapas recebem [latitude, longitude] ou [nome, valor] em posições fixas. Inverter a ordem coloca o marcador no lugar errado — a tupla tipada impede isso.',
    description:
      'Cada item do estoque é uma tupla [nomeDoProduto, quantidade]. Um dos itens foi escrito na ordem inversa. Corrija-o.',
    goal: 'Respeitar a ordem de tipos da tupla.',
    bugDescription: "Type 'number' is not assignable to type 'string'.",
    buggyLineNumbers: [5],
    initialBuggyCode: `type ItemEstoque = [string, number];

const estoque: ItemEstoque[] = [
  ['Caneta', 120],
  [35, 'Caderno'],
  ['Borracha', 60],
];

const totalUnidades = estoque.reduce((soma, [, qtd]) => soma + qtd, 0);
console.log(totalUnidades);
`,
    templateCode: `type ItemEstoque = [string, number];

const estoque: ItemEstoque[] = [
  ['Caneta', 120],
  [35, 'Caderno'],
  ['Borracha', 60],
];

const totalUnidades = estoque.reduce((soma, [, qtd]) => soma + qtd, 0);
console.log(totalUnidades);
`,
    solutionCode: `type ItemEstoque = [string, number];

const estoque: ItemEstoque[] = [
  ['Caneta', 120],
  ['Caderno', 35],
  ['Borracha', 60],
];

const totalUnidades = estoque.reduce((soma, [, qtd]) => soma + qtd, 0);
console.log(totalUnidades);
`,
    hints: [
      'A tupla é [string, number]: primeiro o nome, depois a quantidade.',
      'Só a segunda linha do array está invertida.',
    ],
    testCases: [
      { description: 'Total de unidades é 215', expectedOutput: '215', testFunction: `return totalUnidades === 215;` },
    ],
    explanation:
      'Em tuplas, cada posição tem seu próprio tipo. Trocar a ordem gera erro de tipo na posição exata, enquanto num array comum (Array<string | number>) a troca passaria despercebida e o total sairia errado.',
  },

  // ==========================================
  // PREVER SAÍDA (5)
  // ==========================================
  {
    id: 'ts-basico-prever-enum-numerico',
    language: 'typescript',
    difficulty: 'basico',
    type: 'prever_saida',
    topic: 'Enums',
    title: 'Previsão de Saída: Enum Numérico e Mapeamento Reverso',
    summary: 'Preveja os valores de um enum numérico com auto-incremento.',
    realWorldContext:
      'Enums numéricos são comuns em códigos legados e protocolos (ex.: níveis de prioridade gravados como 1, 2, 3). Saber como os números são atribuídos evita surpresas ao ler o banco.',
    description:
      'O enum começa em 1 e os próximos membros não têm valor explícito. Enums numéricos também geram mapeamento reverso (do número para o nome). Qual é a saída?',
    goal: 'Entender o auto-incremento e o mapeamento reverso de enums numéricos.',
    codeToPredict: `enum Prioridade {
  Baixa = 1,
  Media,
  Alta,
}

console.log(Prioridade.Alta, Prioridade[2]);
`,
    templateCode: `enum Prioridade {
  Baixa = 1,
  Media,
  Alta,
}

console.log(Prioridade.Alta, Prioridade[2]);
`,
    expectedOutputPrediction: '3 Media',
    acceptableOutputPredictions: ['3, Media'],
    solutionCode: `enum Prioridade {
  Baixa = 1,
  Media,
  Alta,
}

console.log(Prioridade.Alta, Prioridade[2]);
`,
    hints: [
      'Membros sem valor recebem o anterior + 1.',
      'Prioridade[2] faz o caminho inverso: qual membro vale 2?',
    ],
    testCases: [],
    explanation:
      'Baixa = 1, então Media = 2 e Alta = 3. Enums numéricos geram um objeto com as duas direções (nome → número e número → nome), por isso Prioridade[2] devolve "Media". Enums de string não têm mapeamento reverso.',
  },
  {
    id: 'ts-basico-prever-enum-string',
    language: 'typescript',
    difficulty: 'basico',
    type: 'prever_saida',
    topic: 'Enums',
    title: 'Previsão de Saída: Enum de String no Objeto Gerado',
    summary: 'Descubra o que Object.keys e Object.values retornam para um enum de string.',
    realWorldContext:
      'É comum popular um <select> com os valores de um enum. Para isso é preciso saber o que o objeto gerado contém.',
    description: 'O enum de string vira um objeto JavaScript comum. Qual é a saída?',
    goal: 'Entender o objeto que um enum de string gera em runtime.',
    codeToPredict: `enum Tema {
  Claro = 'light',
  Escuro = 'dark',
}

console.log(Object.keys(Tema).length, Object.values(Tema).join('/'));
`,
    templateCode: `enum Tema {
  Claro = 'light',
  Escuro = 'dark',
}

console.log(Object.keys(Tema).length, Object.values(Tema).join('/'));
`,
    expectedOutputPrediction: '2 light/dark',
    acceptableOutputPredictions: ['2, light/dark'],
    solutionCode: `enum Tema {
  Claro = 'light',
  Escuro = 'dark',
}

console.log(Object.keys(Tema).length, Object.values(Tema).join('/'));
`,
    hints: [
      'Enums de string NÃO têm mapeamento reverso.',
      'O objeto gerado é { Claro: "light", Escuro: "dark" }.',
    ],
    testCases: [],
    explanation:
      'Ao contrário dos numéricos, enums de string geram só a direção nome → valor. Por isso há 2 chaves, e os valores são as strings atribuídas. Em um enum numérico, Object.keys devolveria o dobro de chaves por causa do mapeamento reverso.',
  },
  {
    id: 'ts-basico-prever-parametro-padrao',
    language: 'typescript',
    difficulty: 'basico',
    type: 'prever_saida',
    topic: 'Parâmetros Opcionais & Padrão',
    title: 'Previsão de Saída: Padrão com undefined Explícito',
    summary: 'Veja quando o valor padrão de um parâmetro é aplicado.',
    realWorldContext:
      'Funções de saudação, formatação e paginação usam parâmetros com padrão. Saber que undefined explícito também aciona o padrão (e null não) evita bugs sutis.',
    description: 'Três chamadas: sem o segundo argumento, com undefined e com uma string. Qual é a saída?',
    goal: 'Entender quando o parâmetro padrão é usado.',
    codeToPredict: `function saudar(nome: string, saudacao = 'Olá'): string {
  return saudacao + ', ' + nome;
}

console.log(saudar('Ana'));
console.log(saudar('Bia', undefined));
console.log(saudar('Caio', 'Oi'));
`,
    templateCode: `function saudar(nome: string, saudacao = 'Olá'): string {
  return saudacao + ', ' + nome;
}

console.log(saudar('Ana'));
console.log(saudar('Bia', undefined));
console.log(saudar('Caio', 'Oi'));
`,
    expectedOutputPrediction: 'Olá, Ana\nOlá, Bia\nOi, Caio',
    solutionCode: `function saudar(nome: string, saudacao = 'Olá'): string {
  return saudacao + ', ' + nome;
}

console.log(saudar('Ana'));
console.log(saudar('Bia', undefined));
console.log(saudar('Caio', 'Oi'));
`,
    hints: [
      'O padrão é aplicado quando o argumento é omitido.',
      'Passar undefined explicitamente tem o mesmo efeito que omitir.',
    ],
    testCases: [],
    explanation:
      'Parâmetros com padrão usam o valor padrão sempre que recebem undefined — seja por omissão ou passado explicitamente. Já null é um valor e não aciona o padrão (e, com strict, nem seria aceito aqui).',
  },
  {
    id: 'ts-basico-prever-tupla-desestruturada',
    language: 'typescript',
    difficulty: 'basico',
    type: 'prever_saida',
    topic: 'Tuplas',
    title: 'Previsão de Saída: Desestruturando uma Tupla',
    summary: 'Preveja o resultado de operações sobre os elementos de uma tupla.',
    realWorldContext:
      'Tuplas aparecem em hooks, em Object.entries e em retornos de funções utilitárias. Desestruturá-las é o dia a dia de qualquer código TypeScript.',
    description: 'Qual é a saída do console.log?',
    goal: 'Entender desestruturação e o length de tuplas.',
    codeToPredict: `const par: [string, number] = ['ab', 2];
const [texto, vezes] = par;

console.log(texto.repeat(vezes + 1), par.length);
`,
    templateCode: `const par: [string, number] = ['ab', 2];
const [texto, vezes] = par;

console.log(texto.repeat(vezes + 1), par.length);
`,
    expectedOutputPrediction: 'ababab 2',
    acceptableOutputPredictions: ['ababab, 2'],
    solutionCode: `const par: [string, number] = ['ab', 2];
const [texto, vezes] = par;

console.log(texto.repeat(vezes + 1), par.length);
`,
    hints: [
      'texto recebe "ab" e vezes recebe 2.',
      'repeat(3) repete a string três vezes.',
    ],
    testCases: [],
    explanation:
      'A desestruturação segue as posições: texto = "ab", vezes = 2. "ab".repeat(3) = "ababab". Em runtime a tupla é um array comum de 2 elementos, então length é 2.',
  },
  {
    id: 'ts-basico-prever-literal-com-let',
    language: 'typescript',
    difficulty: 'basico',
    type: 'prever_saida',
    topic: 'Inferência & Literal Types',
    title: 'Previsão de Saída: Conversões em um Array Tipado',
    summary: 'Preveja o resultado de map com conversões explícitas de tipo.',
    realWorldContext:
      'Ao importar planilhas, os números chegam como texto. Converter com Number e somar é tarefa diária — e o resultado depende de cada conversão.',
    description:
      'O array tem textos numéricos e um texto inválido. Number("") é 0 e Number("abc") é NaN. Qual é a saída?',
    goal: 'Prever conversões numéricas e o efeito de NaN em uma soma.',
    codeToPredict: `const brutos: string[] = ['10', '', '5'];
const numeros: number[] = brutos.map(Number);
const soma = numeros.reduce((acc, n) => acc + n, 0);

console.log(numeros.join(','), soma);
console.log(Number('abc') + soma);
`,
    templateCode: `const brutos: string[] = ['10', '', '5'];
const numeros: number[] = brutos.map(Number);
const soma = numeros.reduce((acc, n) => acc + n, 0);

console.log(numeros.join(','), soma);
console.log(Number('abc') + soma);
`,
    expectedOutputPrediction: '10,0,5 15\nNaN',
    solutionCode: `const brutos: string[] = ['10', '', '5'];
const numeros: number[] = brutos.map(Number);
const soma = numeros.reduce((acc, n) => acc + n, 0);

console.log(numeros.join(','), soma);
console.log(Number('abc') + soma);
`,
    hints: [
      'Number("") vale 0.',
      'Qualquer conta com NaN resulta em NaN — e NaN é do tipo number.',
    ],
    testCases: [],
    explanation:
      'O tipo number inclui NaN, então o TypeScript não acusa nada aqui: a checagem de tipos não substitui validação de dados. Number("") vira 0 (uma armadilha comum em formulários) e Number("abc") vira NaN, que "contamina" qualquer soma.',
  },

  // ==========================================
  // DESAFIOS PRÁTICOS (5)
  // ==========================================
  {
    id: 'ts-basico-desafio-total-carrinho',
    language: 'typescript',
    difficulty: 'basico',
    type: 'desafio_pratico',
    topic: 'Interfaces & Arrays',
    title: 'Desafio Prático: Total do Carrinho de Compras',
    summary: 'Modele um item de carrinho e calcule o total com desconto por quantidade.',
    realWorldContext:
      'Todo e-commerce precisa calcular o total do carrinho. Com os itens tipados, fica impossível somar um preço que veio como texto.',
    description:
      'Implemente totalCarrinho(itens). Cada item tem preco unitário e quantidade. Itens com quantidade a partir de 10 recebem 5% de desconto no subtotal do item. Arredonde o total final para 2 casas com Number(x.toFixed(2)).',
    goal: 'Retornar o total numérico do carrinho respeitando as regras.',
    practicalRequirements: [
      'Manter a interface ItemCarrinho e a assinatura (itens: ItemCarrinho[]) => number.',
      'Subtotal do item = preco * quantidade.',
      'Itens com quantidade >= 10 têm 5% de desconto no seu subtotal.',
      'Carrinho vazio retorna 0.',
      'O total é arredondado para 2 casas decimais.',
    ],
    templateCode: `interface ItemCarrinho {
  nome: string;
  preco: number;
  quantidade: number;
}

function totalCarrinho(itens: ItemCarrinho[]): number {
  // Implemente aqui
  return 0;
}
`,
    solutionCode: `interface ItemCarrinho {
  nome: string;
  preco: number;
  quantidade: number;
}

function totalCarrinho(itens: ItemCarrinho[]): number {
  const total = itens.reduce((soma, item) => {
    const subtotal = item.preco * item.quantidade;
    const desconto = item.quantidade >= 10 ? 0.05 : 0;
    return soma + subtotal * (1 - desconto);
  }, 0);
  return Number(total.toFixed(2));
}
`,
    typeAssertions: `const t: number = totalCarrinho([]);
// @ts-expect-error — preco precisa ser number
totalCarrinho([{ nome: 'X', preco: '10', quantidade: 1 }]);`,
    hints: [
      'Use reduce começando em 0.',
      'O desconto é por item, não sobre o total do carrinho.',
      'Number(valor.toFixed(2)) arredonda para 2 casas e devolve number.',
    ],
    testCases: [
      { description: 'Carrinho vazio custa 0', expectedOutput: '0', testFunction: `return totalCarrinho([]) === 0;` },
      { description: 'Soma subtotais sem desconto', expectedOutput: '35.5', testFunction: `return totalCarrinho([{ nome: 'A', preco: 10.5, quantidade: 1 }, { nome: 'B', preco: 12.5, quantidade: 2 }]) === 35.5;` },
      { description: 'Aplica 5% em item com 10 unidades', expectedOutput: '95', testFunction: `return totalCarrinho([{ nome: 'C', preco: 10, quantidade: 10 }]) === 95;` },
    ],
    explanation:
      'A interface documenta o formato do item e o compilador garante que preco e quantidade sejam números em toda chamada. O arredondamento com toFixed evita resíduos de ponto flutuante como 35.50000000001.',
    validationRules: [{ id: 'rule-no-any', type: 'not_contains', target: ': any', description: 'Não usa any' }],
  },
  {
    id: 'ts-basico-desafio-formatar-cpf',
    language: 'typescript',
    difficulty: 'basico',
    type: 'desafio_pratico',
    topic: 'Union & Literal Types',
    title: 'Desafio Prático: Formatar CPF ou Retornar null',
    summary: 'Formate um CPF e use string | null para sinalizar entrada inválida.',
    realWorldContext:
      'Formulários aceitam CPF com ou sem pontuação. A função de formatação precisa avisar quando a entrada é inválida — e o tipo de retorno deixa isso explícito para quem chama.',
    description:
      'Implemente formatarCpf(entrada). Remova tudo que não for dígito. Se sobrarem exatamente 11 dígitos, retorne no formato 000.000.000-00; senão, retorne null. Não é preciso validar os dígitos verificadores.',
    goal: 'Retornar o CPF formatado ou null.',
    practicalRequirements: [
      'Assinatura: (entrada: string) => string | null.',
      'Remover qualquer caractere que não seja dígito.',
      'Exatamente 11 dígitos: retornar no formato 000.000.000-00.',
      'Qualquer outra quantidade de dígitos: retornar null.',
    ],
    templateCode: `function formatarCpf(entrada: string): string | null {
  // Implemente aqui
  return null;
}
`,
    solutionCode: `function formatarCpf(entrada: string): string | null {
  const digitos = entrada.replace(/\\D/g, '');
  if (digitos.length !== 11) return null;
  return digitos.slice(0, 3) + '.' + digitos.slice(3, 6) + '.' + digitos.slice(6, 9) + '-' + digitos.slice(9);
}
`,
    typeAssertions: `const r = formatarCpf('1');
// @ts-expect-error — o retorno pode ser null; precisa ser tratado antes de usar como string
r.length;`,
    hints: [
      'replace(/\\D/g, "") remove tudo que não é dígito.',
      'Use slice para pegar os blocos de 3, 3, 3 e 2 dígitos.',
      'O retorno string | null obriga quem chama a tratar o null.',
    ],
    testCases: [
      { description: 'Formata CPF só com dígitos', expectedOutput: '123.456.789-09', testFunction: `return formatarCpf('12345678909') === '123.456.789-09';` },
      { description: 'Aceita CPF já pontuado', expectedOutput: '123.456.789-09', testFunction: `return formatarCpf('123.456.789-09') === '123.456.789-09';` },
      { description: 'Retorna null com 10 dígitos', expectedOutput: 'null', testFunction: `return formatarCpf('1234567890') === null;` },
    ],
    explanation:
      'string | null é uma união: o compilador obriga quem chama a checar o null antes de usar o resultado como string (o typeAssertion comprova isso). É uma alternativa explícita a lançar exceção para entradas inválidas.',
    validationRules: [{ id: 'rule-no-any', type: 'not_contains', target: ': any', description: 'Não usa any' }],
  },
  {
    id: 'ts-basico-desafio-rotulo-status',
    language: 'typescript',
    difficulty: 'basico',
    type: 'desafio_pratico',
    topic: 'Union & Literal Types',
    title: 'Desafio Prático: Rótulo e Cor por Status',
    summary: 'Use switch sobre uma união de literais para devolver um objeto de exibição.',
    realWorldContext:
      'Painéis administrativos exibem badges coloridos por status. Centralizar o mapeamento em uma função tipada evita cores inconsistentes entre telas.',
    description:
      'Implemente exibicaoStatus(status) retornando { rotulo, cor }: "rascunho" → Rascunho/cinza, "publicado" → Publicado/verde, "arquivado" → Arquivado/vermelho.',
    goal: 'Retornar o objeto de exibição correto para cada status.',
    practicalRequirements: [
      'Manter o tipo StatusArtigo e a interface Exibicao.',
      'Retornar exatamente os rótulos e cores especificados.',
      'Tratar todos os três status (use switch).',
    ],
    templateCode: `type StatusArtigo = 'rascunho' | 'publicado' | 'arquivado';

interface Exibicao {
  rotulo: string;
  cor: 'cinza' | 'verde' | 'vermelho';
}

function exibicaoStatus(status: StatusArtigo): Exibicao {
  // Implemente aqui
}
`,
    solutionCode: `type StatusArtigo = 'rascunho' | 'publicado' | 'arquivado';

interface Exibicao {
  rotulo: string;
  cor: 'cinza' | 'verde' | 'vermelho';
}

function exibicaoStatus(status: StatusArtigo): Exibicao {
  switch (status) {
    case 'rascunho':
      return { rotulo: 'Rascunho', cor: 'cinza' };
    case 'publicado':
      return { rotulo: 'Publicado', cor: 'verde' };
    case 'arquivado':
      return { rotulo: 'Arquivado', cor: 'vermelho' };
  }
}
`,
    typeAssertions: `const e: Exibicao = exibicaoStatus('publicado');
// @ts-expect-error — "removido" não é um StatusArtigo
exibicaoStatus('removido');`,
    hints: [
      'Faça um switch(status) com um case para cada literal.',
      'Se os três casos retornam, o TypeScript entende que a função sempre retorna (não precisa de default).',
      'A cor também é uma união: "azul" seria erro de compilação.',
    ],
    testCases: [
      { description: 'Publicado é verde', expectedOutput: 'Publicado/verde', testFunction: `const e = exibicaoStatus('publicado'); return e.rotulo === 'Publicado' && e.cor === 'verde';` },
      { description: 'Arquivado é vermelho', expectedOutput: 'Arquivado/vermelho', testFunction: `const e = exibicaoStatus('arquivado'); return e.rotulo === 'Arquivado' && e.cor === 'vermelho';` },
      { description: 'Rascunho é cinza', expectedOutput: 'Rascunho/cinza', testFunction: `const e = exibicaoStatus('rascunho'); return e.rotulo === 'Rascunho' && e.cor === 'cinza';` },
    ],
    explanation:
      'Quando um switch cobre todos os membros de uma união e cada caso retorna, o TypeScript sabe que a função sempre retorna Exibicao. Se alguém adicionar um status novo, o compilador acusa que a função pode terminar sem retorno.',
  },
  {
    id: 'ts-basico-desafio-media-notas',
    language: 'typescript',
    difficulty: 'basico',
    type: 'desafio_pratico',
    topic: 'Arrays Tipados',
    title: 'Desafio Prático: Média e Situação do Aluno',
    summary: 'Calcule a média de notas e devolva a situação usando uma união de literais.',
    realWorldContext:
      'Sistemas escolares calculam médias e situações (aprovado, recuperação, reprovado). Tipar a situação como união impede que a interface exiba um status inventado.',
    description:
      'Implemente situacaoAluno(notas). Média >= 7: "aprovado"; >= 5: "recuperacao"; menor que 5: "reprovado". Lista vazia: "reprovado".',
    goal: 'Retornar a situação correta a partir da média.',
    practicalRequirements: [
      'Assinatura: (notas: number[]) => Situacao.',
      'Média >= 7 → "aprovado"; >= 5 → "recuperacao"; abaixo de 5 → "reprovado".',
      'Lista vazia → "reprovado" (sem dividir por zero).',
    ],
    templateCode: `type Situacao = 'aprovado' | 'recuperacao' | 'reprovado';

function situacaoAluno(notas: number[]): Situacao {
  // Implemente aqui
  return 'reprovado';
}
`,
    solutionCode: `type Situacao = 'aprovado' | 'recuperacao' | 'reprovado';

function situacaoAluno(notas: number[]): Situacao {
  if (notas.length === 0) return 'reprovado';
  const media = notas.reduce((soma, n) => soma + n, 0) / notas.length;
  if (media >= 7) return 'aprovado';
  if (media >= 5) return 'recuperacao';
  return 'reprovado';
}
`,
    typeAssertions: `const s: Situacao = situacaoAluno([7]);
// @ts-expect-error — só aceita lista de números
situacaoAluno(['7']);`,
    hints: [
      'Trate a lista vazia primeiro.',
      'Use reduce para somar e divida por notas.length.',
      'Compare do maior limite para o menor.',
    ],
    testCases: [
      { description: 'Média 8 → aprovado', expectedOutput: 'aprovado', testFunction: `return situacaoAluno([7, 9]) === 'aprovado';` },
      { description: 'Média 5.5 → recuperacao', expectedOutput: 'recuperacao', testFunction: `return situacaoAluno([5, 6]) === 'recuperacao';` },
      { description: 'Lista vazia → reprovado', expectedOutput: 'reprovado', testFunction: `return situacaoAluno([]) === 'reprovado';` },
    ],
    explanation:
      'O retorno tipado como Situacao faz o compilador recusar qualquer texto fora da união (ex.: "aprovada"). A checagem de lista vazia evita a divisão por zero que produziria NaN.',
  },
  {
    id: 'ts-basico-desafio-min-max',
    language: 'typescript',
    difficulty: 'basico',
    type: 'desafio_pratico',
    topic: 'Tuplas',
    title: 'Desafio Prático: Menor e Maior Valor em uma Tupla',
    summary: 'Retorne o mínimo e o máximo de uma lista como tupla, ou null se estiver vazia.',
    realWorldContext:
      'Gráficos precisam do menor e do maior valor para definir a escala do eixo. Retornar uma tupla deixa a chamada concisa: const [min, max] = minMax(valores).',
    description:
      'Implemente minMax(valores) retornando [menor, maior]. Para lista vazia, retorne null. Não use Math.min(...valores) com listas vazias (o resultado seria Infinity).',
    goal: 'Retornar [min, max] ou null.',
    practicalRequirements: [
      'Assinatura: (valores: number[]) => [number, number] | null.',
      'Lista vazia retorna null.',
      'Lista com um elemento retorna [x, x].',
    ],
    templateCode: `function minMax(valores: number[]): [number, number] | null {
  // Implemente aqui
  return null;
}
`,
    solutionCode: `function minMax(valores: number[]): [number, number] | null {
  if (valores.length === 0) return null;
  let menor = valores[0];
  let maior = valores[0];
  for (const v of valores) {
    if (v < menor) menor = v;
    if (v > maior) maior = v;
  }
  return [menor, maior];
}
`,
    typeAssertions: `const r: [number, number] | null = minMax([1]);
if (r) {
  const [a, b] = r;
  const soma: number = a + b;
}
// @ts-expect-error — retorno pode ser null
minMax([1])[0];`,
    hints: [
      'Trate a lista vazia primeiro, retornando null.',
      'Comece menor e maior com o primeiro elemento e percorra a lista.',
      'Math.min(...valores) também funciona, desde que a lista não esteja vazia.',
    ],
    testCases: [
      { description: 'Lista mista', expectedOutput: '[-3, 12]', testFunction: `const r = minMax([4, -3, 12, 0]); return r !== null && r[0] === -3 && r[1] === 12;` },
      { description: 'Um elemento', expectedOutput: '[7, 7]', testFunction: `const r = minMax([7]); return r !== null && r[0] === 7 && r[1] === 7;` },
      { description: 'Lista vazia retorna null', expectedOutput: 'null', testFunction: `return minMax([]) === null;` },
    ],
    explanation:
      'O tipo [number, number] | null comunica dois fatos: quando há resultado, ele tem exatamente 2 números; e pode não haver resultado. O compilador força quem chama a tratar o null antes de desestruturar.',
  },
];
