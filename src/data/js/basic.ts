import { Exercise } from '../../types/exercise';

export const jsBasicExercises: Exercise[] = [
  // 1
  {
    id: 'js-basico-01',
    language: 'javascript',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Funções & Template Literals',
    title: 'Formatador de Preço em Moeda Brasileira',
    summary: 'Construa uma arrow function moderna que formata valores numéricos para o padrão monetário BRL.',
    realWorldContext: 'Em frontends de e-commerce e dashboards, números brutos (ex: 1250.5) precisam ser exibidos com vírgula e símbolo de Real (R$ 1.250,50).',
    description: 'Complete a função com a sintaxe de arrow function e a chamada ao método format de Intl.NumberFormat.',
    goal: 'Preencher a declaração da arrow function e o método format().',
    templateCode: `// 1. Arrow function que recebe o valor numérico
const formatarMoeda = (valor) {{blank_0}} {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  
  // 2. Retorna a string formatada
  return formatter.{{blank_1}}(valor);
};

console.log(formatarMoeda(1250.5)); // Esperado: "R$ 1.250,50"
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Seta da arrow function',
        expectedAnswers: ['=>'],
        hint: 'Símbolo padrão para definir arrow functions no JavaScript.',
      },
      {
        id: 'blank_1',
        label: 'Método de formatação do Intl',
        expectedAnswers: ['format'],
        hint: 'Método de instâncias de Intl.NumberFormat que recebe o número e devolve a string.',
      },
    ],
    solutionCode: `const formatarMoeda = (valor) => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  return formatter.format(valor);
};

console.log(formatarMoeda(1250.5));`,
    hints: [
      'Dica 1: A sintaxe de arrow function utiliza a seta => entre os parâmetros e o corpo.',
      'Dica 2: A API nativa Intl.NumberFormat provê o método format().',
    ],
    testCases: [
      {
        description: 'Formata número decimal para Real brasileiro',
        expectedOutput: 'R$ 1.250,50',
      },
    ],
    explanation: 'Intl.NumberFormat é a API nativa recomendada para internacionalização monetária, garantindo espaçamento e separadores de acordo com a localidade.',
  },

  // 2
  {
    id: 'js-basico-02',
    language: 'javascript',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Desestruturação & Parâmetros Padrão',
    title: 'Desestruturação de Objeto de Configuração',
    summary: 'Extraia propriedades de um objeto de preferências com valores padrão caso o usuário não informe.',
    realWorldContext: 'Funções de inicialização em bibliotecas e componentes React recebem opções onde muitas chaves são opcionais.',
    description: 'Use a sintaxe de desestruturação com valores default para definir tema e notificações.',
    goal: 'Desestruturar propriedades do objeto com fallbacks.',
    templateCode: `function configurarUsuario(opcoes) {
  // Desestruturação com valores padrão
  const { {{blank_0}}, notificacoes = true } = opcoes;
  
  return \`Tema: \${tema} | Notificações: \${notificacoes ? 'Ativas' : 'Desativadas'}\`;
}

console.log(configurarUsuario({})); // Esperado: Tema: dark | Notificações: Ativas
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Desestruturação com valor padrão dark',
        expectedAnswers: [
          'tema = "dark"',
          "tema = 'dark'",
          'tema="dark"',
          "tema='dark'",
        ],
        hint: 'Defina a variável tema atribuindo o valor default "dark".',
      },
    ],
    solutionCode: `function configurarUsuario(opcoes) {
  const { tema = 'dark', notificacoes = true } = opcoes;
  return \`Tema: \${tema} | Notificações: \${notificacoes ? 'Ativas' : 'Desativadas'}\`;
}

console.log(configurarUsuario({}));`,
    hints: [
      'Dica 1: No destructuring, atribua o valor default com o operador de igual: { chave = "padrao" }.',
    ],
    testCases: [
      {
        description: 'Aplica valor padrão dark quando opções está vazio',
        expectedOutput: 'Tema: dark | Notificações: Ativas',
      },
    ],
    explanation: 'A desestruturação com valores padrão evita condicionais verbosas com undefined e melhora a legibilidade do código.',
  },

  // 3
  {
    id: 'js-basico-03',
    language: 'javascript',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Manipulação de Arrays (filter & map)',
    title: 'Filtro e Extração de Nomes de Produtos em Estoque',
    summary: 'Filtre apenas os produtos disponíveis e extraia um array contendo somente seus títulos em maiúsculas.',
    realWorldContext: 'Operação clássica em listas de e-commerce para exibir catálogo de itens ativos para o comprador.',
    description: 'Combine encadeamento dos métodos filter() e map() em um array de objetos.',
    goal: 'Encadear filter para estoque > 0 e map para transformar o nome.',
    templateCode: `const produtos = [
  { id: 1, nome: 'Teclado Mecânico', estoque: 5 },
  { id: 2, nome: 'Mouse sem Fio', estoque: 0 },
  { id: 3, nome: 'Monitor 4K', estoque: 2 },
];

const disponiveisEmCaixaAlta = produtos
  .{{blank_0}}(p => p.estoque > 0)
  .{{blank_1}}(p => p.nome.toUpperCase());

console.log(disponiveisEmCaixaAlta); // ['TECLADO MECÂNICO', 'MONITOR 4K']
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Método para filtrar itens',
        expectedAnswers: ['filter'],
        hint: 'Método que cria um novo array com todos os elementos que passarem no teste.',
      },
      {
        id: 'blank_1',
        label: 'Método para mapear e transformar itens',
        expectedAnswers: ['map'],
        hint: 'Método que invoca a função de callback para cada elemento e devolve o novo array.',
      },
    ],
    solutionCode: `const produtos = [
  { id: 1, nome: 'Teclado Mecânico', estoque: 5 },
  { id: 2, nome: 'Mouse sem Fio', estoque: 0 },
  { id: 3, nome: 'Monitor 4K', estoque: 2 },
];

const disponiveisEmCaixaAlta = produtos
  .filter(p => p.estoque > 0)
  .map(p => p.nome.toUpperCase());

console.log(disponiveisEmCaixaAlta);`,
    hints: [
      'Dica 1: filter() remove itens que não atendem à condição.',
      'Dica 2: map() projeta cada elemento filtrado em uma nova forma.',
    ],
    testCases: [
      {
        description: 'Retorna array com itens em maiúsculas filtrados por estoque positivo',
        expectedOutput: "['TECLADO MECÂNICO', 'MONITOR 4K']",
      },
    ],
    explanation: 'Programação funcional com métodos imutáveis de Array é o padrão na maioria dos frameworks modernos como React e Vue.',
  },

  // 4
  {
    id: 'js-basico-04',
    language: 'javascript',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Operadores Modernos (?? e ?.)',
    title: 'Acesso Seguro a Propriedades com Optional Chaining e Nullish Coalescing',
    summary: 'Acesse dados aninhados sem erro de TypeError (Cannot read properties of undefined).',
    realWorldContext: 'Respostas de APIs externas frequentemente omitem campos opcionais, como endereços secundários ou perfis de usuário.',
    description: 'Use ?. para navegação segura e ?? para fallback quando o valor for nulo ou indefinido.',
    goal: 'Preencher os operadores ?. e ?? na expressão.',
    templateCode: `const usuario = {
  id: 101,
  nome: 'Lucas Silva',
  // endereco ausente intencionalmente
};

// Se rua não existir, deve retornar 'Não informado'
const rua = usuario.endereco{{blank_0}}rua {{blank_1}} 'Não informado';

console.log(rua); // 'Não informado'
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Operador de encadeamento opcional',
        expectedAnswers: ['?.'],
        hint: 'Símbolo do Optional Chaining.',
      },
      {
        id: 'blank_1',
        label: 'Operador de coalescência nula',
        expectedAnswers: ['??'],
        hint: 'Operador que devolve o operando direito somente quando o esquerdo for null ou undefined.',
      },
    ],
    solutionCode: `const usuario = {
  id: 101,
  nome: 'Lucas Silva',
};

const rua = usuario.endereco?.rua ?? 'Não informado';
console.log(rua);`,
    hints: [
      'Dica 1: usuario.endereco?.rua avalia para undefined sem disparar erro em tempo de execução.',
      'Dica 2: ?? difere de || porque não substitui 0 ou strings vazias, apenas null ou undefined.',
    ],
    testCases: [
      {
        description: 'Retorna fallback sem erro em objeto incompleto',
        expectedOutput: 'Não informado',
      },
    ],
    explanation: 'Optional chaining e Nullish coalescing tornam o código muito mais seguro e eliminam checagens verbosas do tipo if (a && a.b && a.b.c).',
  },

  // 5
  {
    id: 'js-basico-05',
    language: 'javascript',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Web APIs & URLSearchParams',
    title: 'Construção Segura de Query Strings com URLSearchParams',
    summary: 'Crie uma string de busca segura para requisições GET sem concatenação manual com risco de bugs.',
    realWorldContext: 'Ao buscar dados em APIs de produtos ou clientes, filtros como "busca" e "pagina" precisam de encoding seguro (ex: espaços viram + ou %20).',
    description: 'Use a classe nativa URLSearchParams para definir parâmetros e gerar a query string.',
    goal: 'Instanciar URLSearchParams e invocar toString().',
    templateCode: `function montarUrlBusca(termo, pagina) {
  const params = {{blank_0}}({
    q: termo,
    page: pagina,
  });

  return \`https://api.exemplo.com/busca?\${params.{{blank_1}}()}\`;
}

console.log(montarUrlBusca('notebook dell gamer', 1));
// Esperado: https://api.exemplo.com/busca?q=notebook+dell+gamer&page=1
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Instanciação de URLSearchParams',
        expectedAnswers: [
          'new URLSearchParams',
        ],
        hint: 'Crie uma nova instância da classe nativa URLSearchParams com a palavra new.',
      },
      {
        id: 'blank_1',
        label: 'Método para converter em query string',
        expectedAnswers: ['toString'],
        hint: 'Método que formata os parâmetros em string codificada com & e =.',
      },
    ],
    solutionCode: `function montarUrlBusca(termo, pagina) {
  const params = new URLSearchParams({
    q: termo,
    page: pagina,
  });

  return \`https://api.exemplo.com/busca?\${params.toString()}\`;
}

console.log(montarUrlBusca('notebook dell gamer', 1));`,
    hints: [
      'Dica 1: new URLSearchParams(objeto) aceita diretamente um objeto com chaves e valores.',
      'Dica 2: toString() codifica caracteres especiais como acentos e espaços automaticamente.',
    ],
    testCases: [
      {
        description: 'Gera URL com query string codificada',
        expectedOutput: 'https://api.exemplo.com/busca?q=notebook+dell+gamer&page=1',
      },
    ],
    explanation: 'URLSearchParams é amplamente suportada em todos os navegadores modernos e no Node.js.',
  },

  // 6
  {
    id: 'js-basico-06',
    language: 'javascript',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Imutabilidade & Spread Operator',
    title: 'Atualização Imutável de Estado com Spread Operator',
    summary: 'Atualize o carrinho adicionando um novo item sem alterar o array original diretamente.',
    realWorldContext: 'Em React, Redux ou Zustand, mutar arrays com push() quebra o sistema de re-renderização.',
    description: 'Retorne um novo array contendo os itens antigos e o novo item adicionado ao final.',
    goal: 'Utilizar o operador spread (...) para criar uma nova lista imutável.',
    templateCode: `function adicionarItemAoCarrinho(carrinhoAtual, novoItem) {
  // Retorna um novo array imutável
  return [{{blank_0}}carrinhoAtual, novoItem];
}

const carrinho = [{ id: 1, nome: 'Mouse' }];
const atualizado = adicionarItemAoCarrinho(carrinho, { id: 2, nome: 'Teclado' });

console.log(atualizado.length); // 2
console.log(carrinho.length);   // 1 (original preservado)
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Operador spread',
        expectedAnswers: ['...'],
        hint: 'Os três pontos do operador de espalhamento.',
      },
    ],
    solutionCode: `function adicionarItemAoCarrinho(carrinhoAtual, novoItem) {
  return [...carrinhoAtual, novoItem];
}

const carrinho = [{ id: 1, nome: 'Mouse' }];
const atualizado = adicionarItemAoCarrinho(carrinho, { id: 2, nome: 'Teclado' });`,
    hints: [
      'Dica 1: O operador spread [...] desempacota os elementos do array em uma nova instância.',
    ],
    testCases: [
      {
        description: 'Preserva array original e retorna novo array com elemento adicionado',
        expectedOutput: '2 itens no novo array',
      },
    ],
    explanation: 'Imutabilidade garante previsibilidade de estado, facilita testes e previne bugs de efeitos colaterais.',
  },

  // 7
  {
    id: 'js-basico-07',
    language: 'javascript',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Arrays (find & some)',
    title: 'Busca e Verificação de Existência em Lista de Usuários',
    summary: 'Encontre o primeiro usuário ativo com permissão de administrador usando find e some.',
    realWorldContext: 'Controles de acesso e busca rápida de entidades em listas carregadas no frontend.',
    description: 'Complete as funções usando find() para obter o objeto e some() para verificar existência.',
    goal: 'Preencher find e some nos locais indicados.',
    templateCode: `const usuarios = [
  { id: 1, nome: 'Ana', cargo: 'editor', ativo: true },
  { id: 2, nome: 'Carlos', cargo: 'admin', ativo: true },
  { id: 3, nome: 'Beatriz', cargo: 'leitor', ativo: false },
];

// 1. Encontrar o objeto do primeiro admin
const primeiroAdmin = usuarios.{{blank_0}}(u => u.cargo === 'admin');

// 2. Verificar se existe algum usuário inativo
const temInativo = usuarios.{{blank_1}}(u => !u.ativo);

console.log(primeiroAdmin.nome); // 'Carlos'
console.log(temInativo);          // true
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Método para localizar item',
        expectedAnswers: ['find'],
        hint: 'Método que retorna o primeiro elemento correspondente ou undefined.',
      },
      {
        id: 'blank_1',
        label: 'Método para testar se ao menos um satisfaz',
        expectedAnswers: ['some'],
        hint: 'Método booleano que retorna true se pelo menos um elemento cumprir o predicado.',
      },
    ],
    solutionCode: `const usuarios = [
  { id: 1, nome: 'Ana', cargo: 'editor', ativo: true },
  { id: 2, nome: 'Carlos', cargo: 'admin', ativo: true },
  { id: 3, nome: 'Beatriz', cargo: 'leitor', ativo: false },
];

const primeiroAdmin = usuarios.find(u => u.cargo === 'admin');
const temInativo = usuarios.some(u => !u.ativo);`,
    hints: [
      'Dica 1: find() para quando encontra a primeira correspondência.',
      'Dica 2: some() retorna um booleano (true/false).',
    ],
    testCases: [
      {
        description: 'Localiza Carlos e detecta usuário inativo',
        expectedOutput: 'Carlos, true',
      },
    ],
    explanation: 'find() e some() são otimizados para interromper o loop assim que encontram o primeiro resultado positivo.',
  },

  // 8
  {
    id: 'js-basico-08',
    language: 'javascript',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Conversão & Tipagem',
    title: 'Sanitização de Quantidade com Number.isNaN e parseInt',
    summary: 'Converta entradas de formulário em inteiros válidos com valor padrão de fallback.',
    realWorldContext: 'Campos de input HTML sempre devolvem strings no value (ex: "3" ou "abc").',
    description: 'Use parseInt com base 10 e valide com Number.isNaN para evitar que NaN quebre a aplicação.',
    goal: 'Fazer o parsing com base 10 e testar com Number.isNaN.',
    templateCode: `function sanitizarQuantidade(valorEntrada, padrao = 1) {
  // 1. Converte para inteiro na base decimal
  const numero = {{blank_0}}(valorEntrada, 10);

  // 2. Verifica se a conversão falhou
  if ({{blank_1}}(numero) || numero <= 0) {
    return padrao;
  }

  return numero;
}

console.log(sanitizarQuantidade("15"));  // 15
console.log(sanitizarQuantidade("abc")); // 1 (fallback)
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Função de parsing para inteiro',
        expectedAnswers: ['parseInt', 'Number.parseInt'],
        hint: 'Função que analisa um argumento string e retorna um inteiro na base especificada.',
      },
      {
        id: 'blank_1',
        label: 'Verificação segura de NaN',
        expectedAnswers: ['Number.isNaN', 'isNaN'],
        hint: 'Método estático de Number para testar se o valor é NaN.',
      },
    ],
    solutionCode: `function sanitizarQuantidade(valorEntrada, padrao = 1) {
  const numero = parseInt(valorEntrada, 10);

  if (Number.isNaN(numero) || numero <= 0) {
    return padrao;
  }

  return numero;
}

console.log(sanitizarQuantidade("15"));
console.log(sanitizarQuantidade("abc"));`,
    hints: [
      'Dica 1: Sempre passe 10 como segundo parâmetro do parseInt para forçar base decimal.',
      'Dica 2: Number.isNaN(x) não faz coerção implícita e é mais seguro que o isNaN global.',
    ],
    testCases: [
      {
        description: 'Converte 15 corretamente e retorna fallback 1 para string inválida',
        expectedOutput: '15 e 1',
      },
    ],
    explanation: 'Number.isNaN é robusto porque nunca converte strings para números antes de testar.',
  },

  // 9
  {
    id: 'js-basico-09',
    language: 'javascript',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Assincronismo & Promises',
    title: 'Função Utilitária de Espera (sleep / delay)',
    summary: 'Construa uma Promise com setTimeout para pausar a execução assíncrona.',
    realWorldContext: 'Muitas rotinas precisam de espera temporizada, como retentativas com backoff ou animações sequenciais.',
    description: 'Retorne uma nova Promise que resolve após o número especificado de milissegundos.',
    goal: 'Instanciar a Promise passando resolve no setTimeout.',
    templateCode: `function delay(ms) {
  // Retorna uma Promise que resolve após ms milissegundos
  return {{blank_0}}((resolve) => {
    {{blank_1}}(resolve, ms);
  });
}

// Exemplo de uso com async/await:
async function executar() {
  console.log('Iniciando...');
  await delay(100);
  console.log('Concluído após 100ms!');
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Instanciação de Promise',
        expectedAnswers: ['new Promise'],
        hint: 'Crie a promessa com a palavra-chave new.',
      },
      {
        id: 'blank_1',
        label: 'Temporizador nativo',
        expectedAnswers: ['setTimeout'],
        hint: 'Função global do JavaScript que agenda execução após tempo determinado.',
      },
    ],
    solutionCode: `function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function executar() {
  console.log('Iniciando...');
  await delay(100);
  console.log('Concluído após 100ms!');
}`,
    hints: [
      'Dica 1: new Promise((resolve, reject) => { ... }) é o construtor padrão.',
      'Dica 2: setTimeout(resolve, ms) dispara a resolução quando o tempo expira.',
    ],
    testCases: [
      {
        description: 'Promise resolve após tempo determinado',
        expectedOutput: 'Concluído',
      },
    ],
    explanation: 'Encapsular setTimeout em uma Promise transforma callbacks legados em Promises consumíveis com await limpo.',
  },

  // 10
  {
    id: 'js-basico-10',
    language: 'javascript',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Manipulação de Strings & Busca',
    title: 'Busca Case-Insensitive com trim e includes',
    summary: 'Normalize termos digitados pelo usuário e filtre registros ignorando maiúsculas e espaços extras.',
    realWorldContext: 'Barras de pesquisa em aplicações web recebem termos com espaços acidentais e capitalizações variadas.',
    description: 'Remova espaços com trim(), converta para minúsculo com toLowerCase() e use includes().',
    goal: 'Aplicar trim, toLowerCase e includes na busca.',
    templateCode: `function contemTermo(textoBase, termoBusca) {
  const base = textoBase.toLowerCase();
  // Limpa espaços no início/fim e converte para minúsculas
  const termo = termoBusca.{{blank_0}}().{{blank_1}}();

  // Verifica se o termo está contido no texto base
  return base.{{blank_2}}(termo);
}

console.log(contemTermo('Desenvolvedor Full Stack PHP e JavaScript', '  full stack  ')); // true
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Remoção de espaços nas extremidades',
        expectedAnswers: ['trim'],
        hint: 'Método que remove espaços em branco do início e do final da string.',
      },
      {
        id: 'blank_1',
        label: 'Conversão para minúsculas',
        expectedAnswers: ['toLowerCase'],
        hint: 'Método que transforma todos os caracteres em letras minúsculas.',
      },
      {
        id: 'blank_2',
        label: 'Checagem de substring',
        expectedAnswers: ['includes'],
        hint: 'Método que determina se uma string pode ser encontrada dentro de outra.',
      },
    ],
    solutionCode: `function contemTermo(textoBase, termoBusca) {
  const base = textoBase.toLowerCase();
  const termo = termoBusca.trim().toLowerCase();
  return base.includes(termo);
}

console.log(contemTermo('Desenvolvedor Full Stack PHP e JavaScript', '  full stack  '));`,
    hints: [
      'Dica 1: trim() remove espaços acidentais.',
      'Dica 2: toLowerCase() normaliza para comparação sem distinção entre maiúsculas/minúsculas.',
      'Dica 3: includes() retorna true se encontrar a substring.',
    ],
    testCases: [
      {
        description: 'Encontra termo com espaços extras e maiúsculas',
        expectedOutput: 'true',
      },
    ],
    explanation: 'A sanitização prévia com trim() e toLowerCase() é o primeiro passo para buscas preditivas precisas no cliente.',
  },

  // 11 - Prever a Saída
  {
    id: 'js-basico-prever-01',
    language: 'javascript',
    difficulty: 'basico',
    type: 'prever_saida',
    topic: 'Tipos & Operadores',
    title: 'Previsão de Saída: Coerção Implícita de Tipos em JavaScript',
    summary: 'Descubra como o motor do JavaScript converte tipos ao misturar números, booleanos e strings com operadores aritméticos.',
    realWorldContext: 'Coerção implícita de tipos é fonte recorrente de bugs em formulários web onde campos de input (que sempre vêm como string) são somados diretamente a números.',
    description: 'Observe com atenção o código JavaScript abaixo. Sem rodar no console, preveja a saída exata impressa pelo console.log.',
    goal: 'Prever a saída com precisão de conversão de tipos.',
    templateCode: `const a = true + true;
const b = 10 + "5" - 2;

console.log(a + " | " + b);
`,
    codeToPredict: `const a = true + true;
const b = 10 + "5" - 2;

console.log(a + " | " + b);`,
    expectedOutputPrediction: '2 | 103',
    acceptableOutputPredictions: ['2 | 103', '2|103'],
    solutionCode: `const a = true + true; // true se torna 1: 1 + 1 = 2
const b = 10 + "5" - 2; // 10 + "5" = "105" (concatenação); "105" - 2 = 103 (o operador - força número)

console.log(a + " | " + b); // "2 | 103"`,
    hints: [
      'Dica 1: Em operações aritméticas, o booleano true é convertido no número 1.',
      'Dica 2: O operador "+" com string faz concatenação: 10 + "5" resulta em "105".',
      'Dica 3: O operador "-" não existe para strings, então força a conversão de "105" para número: 105 - 2 = 103.',
    ],
    testCases: [
      {
        description: 'Imprime "2 | 103"',
        expectedOutput: '2 | 103',
      },
    ],
    explanation: 'Em JS, true se converte em 1 na adição (1 + 1 = 2). Na expressão seguinte, a adição com string "5" gera "105", mas a subtração subsequente "-" não opera em strings e converte "105" para número: 105 - 2 = 103. Resultado: "2 | 103".',
  },

  // 12 - Corrigir Erros
  {
    id: 'js-basico-debug-01',
    language: 'javascript',
    difficulty: 'basico',
    type: 'corrigir_erros',
    topic: 'Escopo & Variáveis',
    title: 'Depuração: Escopo de Variável em Laço com var vs let',
    summary: 'Corrija um vazamento de escopo clássico onde callbacks capturam a mesma referência compartilhada da variável.',
    realWorldContext: 'Antes do ES6, usar var dentro de loops de eventos ou timers causava o problema de todos os handlers executarem com o valor final do contador. Com let, cada iteração cria seu próprio escopo léxico.',
    description: 'A função `criarContadores` cria um array de funções que deveriam retornar seu respectivo índice (0, 1, 2). Porém, todas estão retornando 3! Corrija a declaração da variável no laço for.',
    goal: 'Substituir "var i" por "let i" para que cada iteração preserve seu próprio binding de escopo.',
    bugDescription: 'O uso de var compartilha o mesmo escopo de função, fazendo todos os callbacks retornarem 3 no final do loop.',
    buggyLineNumbers: [4],
    initialBuggyCode: `function criarContadores() {
    const funcoes = [];

    // BUG: "var" não possui escopo de bloco!
    for (var i = 0; i < 3; i++) {
        funcoes.push(() => i);
    }

    return funcoes.map(fn => fn());
}

// Esperado: [0, 1, 2]. Atual com bug: [3, 3, 3]
console.log(criarContadores());
`,
    templateCode: `function criarContadores() {
    const funcoes = [];

    // Corrija a declaração do contador no loop for:
    for (let i = 0; i < 3; i++) {
        funcoes.push(() => i);
    }

    return funcoes.map(fn => fn());
}

console.log(criarContadores());
`,
    solutionCode: `function criarContadores() {
    const funcoes = [];

    for (let i = 0; i < 3; i++) {
        funcoes.push(() => i);
    }

    return funcoes.map(fn => fn());
}

console.log(criarContadores());`,
    hints: [
      'Dica 1: Troque a palavra-chave "var" por "let" no cabeçalho do laço for.',
      'Dica 2: "let" cria uma nova vinculação de variável para cada iteração do laço.',
    ],
    testCases: [
      {
        description: 'Retorna array com índices corretos [0, 1, 2]',
        expectedOutput: '[0, 1, 2]',
        testFunction: `
          const res = criarContadores();
          return Array.isArray(res) && res[0] === 0 && res[1] === 1 && res[2] === 2;
        `,
      },
    ],
    validationRules: [
      {
        id: 'rule-let',
        description: 'Declaração do contador com let i = 0',
        type: 'contains',
        target: 'let i',
      },
      {
        id: 'rule-no-var',
        description: 'Sem var i no laço for',
        type: 'not_contains',
        target: 'var i',
      },
    ],
    explanation: 'Diferente de "var" que é içada (hoisted) ao topo da função, "let" possui escopo de bloco. O JavaScript cria uma nova instância de "i" para cada iteração do laço, preservando o valor correto para a closure da arrow function.',
  },

  // 13 - Desafio Prático
  {
    id: 'js-basico-desafio-01',
    language: 'javascript',
    difficulty: 'basico',
    type: 'desafio_pratico',
    topic: 'Strings & Formatação',
    title: 'Desafio Prático: Formatação de Telefone Brasileiro com DDD',
    summary: 'Construa uma função de sanitização e máscara que aceita tanto telefones fixos (10 dígitos) quanto celulares (11 dígitos).',
    realWorldContext: 'Sistemas de checkout e CRM recebem telefones em múltiplos formatos ((11) 98888-7777, 11988887777, etc.). O backend e frontend devem normalizar os dígitos e aplicar a máscara padrão.',
    description: 'Crie a função `formatarTelefone(telefoneBruto)` que:\n1. Remove todos os caracteres não numéricos com regex (`/\\D/g`).\n2. Se tiver 11 dígitos (celular), formata como "(XX) 9XXXX-XXXX".\n3. Se tiver 10 dígitos (fixo), formata como "(XX) XXXX-XXXX".\n4. Se tiver quantidade diferente de dígitos, retorna string vazia "".',
    goal: 'Sanitizar caracteres não numéricos e aplicar a máscara correspondente ao tamanho.',
    practicalRequirements: [
      'Remover caracteres não numéricos usando replace(/\\D/g, "")',
      'Formatar celular de 11 dígitos: (XX) XXXXX-XXXX',
      'Formatar fixo de 10 dígitos: (XX) XXXX-XXXX',
      'Retornar string vazia caso o número de dígitos seja inválido',
    ],
    templateCode: `function formatarTelefone(telefoneBruto) {
    // 1. Limpar dígitos
    
    // 2. Verificar se tem 10 ou 11 dígitos e aplicar máscara
    
    // 3. Retornar formatado ou vazio
}

// Testes:
console.log(formatarTelefone("11987654321")); // (11) 98765-4321
console.log(formatarTelefone("(85) 3211-4400")); // (85) 3211-4400
console.log(formatarTelefone("123")); // ""
`,
    solutionCode: `function formatarTelefone(telefoneBruto) {
    if (!telefoneBruto) return "";
    const digitos = String(telefoneBruto).replace(/\\D/g, "");

    if (digitos.length === 11) {
        return \`(\${digitos.slice(0, 2)}) \${digitos.slice(2, 7)}-\${digitos.slice(7)}\`;
    }
    if (digitos.length === 10) {
        return \`(\${digitos.slice(0, 2)}) \${digitos.slice(2, 6)}-\${digitos.slice(6)}\`;
    }
    return "";
}

console.log(formatarTelefone("11987654321"));
console.log(formatarTelefone("(85) 3211-4400"));`,
    hints: [
      'Dica 1: String(telefoneBruto).replace(/\\D/g, "") extrai apenas os números.',
      'Dica 2: digitos.length === 11 indica celular com o nono dígito.',
      'Dica 3: Use slice() ou substrings com template literals para montar a string com parênteses e traço.',
    ],
    testCases: [
      {
        description: 'Formata celular 11 dígitos corretamente',
        expectedOutput: '(11) 98765-4321',
        testFunction: `return formatarTelefone("11987654321") === "(11) 98765-4321";`,
      },
      {
        description: 'Formata fixo 10 dígitos corretamente',
        expectedOutput: '(85) 3211-4400',
        testFunction: `return formatarTelefone("8532114400") === "(85) 3211-4400";`,
      },
      {
        description: 'Retorna string vazia para entrada com dígitos insuficientes',
        expectedOutput: '""',
        testFunction: `return formatarTelefone("12345") === "";`,
      },
    ],
    validationRules: [
      {
        id: 'rule-replace',
        description: 'Extração de dígitos com regex \\D',
        type: 'contains',
        target: 'replace',
      },
      {
        id: 'rule-slice',
        description: 'Fatiamento de dígitos com slice ou substring',
        type: 'contains',
        target: 'slice',
      },
    ],
    explanation: 'Normalizar previamente strings retirando caracteres não numéricos previne erros de validação e assegura que máscaras de apresentação funcionem uniformemente tanto na web quanto no mobile.',
  },
];

