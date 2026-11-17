import { Exercise } from '../types/exercise';

export const jsExercises: Exercise[] = [
  // BÁSICO 1: Arrow Functions e Template Literals
  {
    id: 'js-basico-01',
    language: 'javascript',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Funções & Template Literals',
    title: 'Formatador de Preço em Moeda Brasileira',
    summary: 'Construa uma arrow function moderna que formata valores numéricos para o padrão monetário BRL.',
    realWorldContext: 'Em qualquer frontend de checkout ou listagem de produtos, números brutos (ex: 149.9) precisam ser exibidos com vírgula e símbolo de Real (R$ 149,90).',
    description: 'Complete a função com a sintaxe de arrow function e a chamada ao construtor nativo `Intl.NumberFormat`.',
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
        placeholder: '=>',
        expectedAnswers: ['=>'],
        hint: 'Símbolo padrão para definir arrow functions no JavaScript.',
      },
      {
        id: 'blank_1',
        label: 'Método de formatação do Intl',
        placeholder: 'format',
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
      'Dica 1: A sintaxe de arrow function utiliza a seta => entre os parâmetros e o corpo {}.',
      'Dica 2: A API nativa do navegador/Node Intl.NumberFormat provê o método format().',
    ],
    testCases: [
      {
        description: 'Formata número decimal para Real brasileiro',
        input: '1250.5',
        expectedOutput: 'R$ 1.250,50',
        testFunction: `
          const fn = {{USER_CODE}};
          const res = fn(1250.5).replace(/\\s/g, ' ');
          return res.includes('1.250,50');
        `,
      },
    ],
    explanation: 'A API `Intl.NumberFormat` é a forma padrão da especificação ECMAScript para internacionalização de moedas, eliminando a necessidade de bibliotecas externas pesadas.',
  },

  // BÁSICO 2: Desestruturação de Objetos e Parâmetros Default
  {
    id: 'js-basico-02',
    language: 'javascript',
    difficulty: 'basico',
    type: 'lacunas',
    topic: 'Desestruturação & Objetos',
    title: 'Desestruturação de Perfil de Usuário com Fallbacks',
    summary: 'Extraia propriedades de um objeto com valores padrão caso os campos estejam ausentes.',
    realWorldContext: 'Ao receber dados de APIs REST, muitas propriedades de usuário são opcionais (como avatar ou telefone). A desestruturação com fallbacks evita erros de "undefined".',
    description: 'Complete a desestruturação do objeto `usuario`, extraindo `nome`, `email` e definindo o valor padrão `"cliente"` para `cargo`.',
    goal: 'Aplicar a sintaxe de desestruturação com fallback const { a, b, c = "default" } = obj.',
    templateCode: `const usuarioApi = {
  nome: 'Mariana Costa',
  email: 'mariana@exemplo.com',
  // cargo não enviado na resposta
};

// Desestrutura extraindo nome, email e cargo com valor padrão 'cliente'
const { nome, email, {{blank_0}} = 'cliente' } = {{blank_1}};

console.log(\`\${nome} (\${cargo}) - \${email}\`);
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Nome da propriedade a desestruturar',
        placeholder: 'cargo',
        expectedAnswers: ['cargo'],
        hint: 'A propriedade que recebe o valor default \'cliente\'.',
      },
      {
        id: 'blank_1',
        label: 'Objeto de origem',
        placeholder: 'usuarioApi',
        expectedAnswers: ['usuarioApi'],
        hint: 'O nome da variável que contém os dados da API.',
      },
    ],
    solutionCode: `const usuarioApi = {
  nome: 'Mariana Costa',
  email: 'mariana@exemplo.com',
};

const { nome, email, cargo = 'cliente' } = usuarioApi;
console.log(\`\${nome} (\${cargo}) - \${email}\`);`,
    hints: [
      'Dica 1: A sintaxe de desestruturação com default é: { propriedade = "fallback" } = objeto.',
      'Dica 2: A variável de origem é usuarioApi.',
    ],
    testCases: [
      {
        description: 'Extrai propriedades e assume default "cliente"',
        expectedOutput: 'Mariana Costa (cliente) - mariana@exemplo.com',
        testFunction: `
          const usuarioApi = { nome: 'Mariana Costa', email: 'mariana@exemplo.com' };
          const { nome, email, cargo = 'cliente' } = usuarioApi;
          return cargo === 'cliente' && nome === 'Mariana Costa';
        `,
      },
    ],
    explanation: 'A desestruturação no ES6+ limpa a leitura do código e dispensa verificações manuais repetitivas como `const cargo = usuario.cargo || "cliente";`.',
  },

  // INTERMEDIÁRIO 1: Métodos de Array Modernos (filter, map, reduce)
  {
    id: 'js-inter-01',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Métodos de Arrays',
    title: 'Cálculo de Faturamento com Filter e Reduce',
    summary: 'Processe uma lista de transações: filtre apenas as aprovadas e some o valor total.',
    realWorldContext: 'Dashboards financeiros calculam métricas em tempo real sobre coleções de pedidos sem alterar o array original (imutabilidade).',
    description: 'Complete o pipeline funcional usando `filter` para selecionar transações com `status === "pago"` e `reduce` para somar os valores.',
    goal: 'Compor array.filter() e array.reduce() com acumulador numérico.',
    templateCode: `const transacoes = [
  { id: 1, valor: 150.0, status: 'pago' },
  { id: 2, valor: 80.0,  status: 'cancelado' },
  { id: 3, valor: 320.0, status: 'pago' },
  { id: 4, valor: 45.0,  status: 'pendente' },
];

const totalAprovado = transacoes
  // 1. Filtra apenas transações com status 'pago'
  .{{blank_0}}(item => item.status === 'pago')
  // 2. Reduz somando o valor ao acumulador iniciando em 0
  .{{blank_1}}((acumulador, item) => acumulador + item.valor, 0);

console.log('Total recebido:', totalAprovado);
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Método de filtragem',
        placeholder: 'filter',
        expectedAnswers: ['filter'],
        hint: 'Método imutável de Array que filtra elementos com base em condição booleana.',
      },
      {
        id: 'blank_1',
        label: 'Método de acumulação',
        placeholder: 'reduce',
        expectedAnswers: ['reduce'],
        hint: 'Método que acumula todos os valores do array em um único resultado.',
      },
    ],
    solutionCode: `const transacoes = [
  { id: 1, valor: 150.0, status: 'pago' },
  { id: 2, valor: 80.0,  status: 'cancelado' },
  { id: 3, valor: 320.0, status: 'pago' },
  { id: 4, valor: 45.0,  status: 'pendente' },
];

const totalAprovado = transacoes
  .filter(item => item.status === 'pago')
  .reduce((acumulador, item) => acumulador + item.valor, 0);

console.log('Total recebido:', totalAprovado); // 470`,
    hints: [
      'Dica 1: O método filter() devolve um novo array contendo apenas os itens que retornam true.',
      'Dica 2: O método reduce() recebe uma função (acc, item) e um valor inicial como segundo parâmetro.',
    ],
    testCases: [
      {
        description: 'Soma apenas 150.0 + 320.0 = 470.0',
        expectedOutput: '470',
        testFunction: `
          const transacoes = [
            { id: 1, valor: 150.0, status: 'pago' },
            { id: 2, valor: 80.0,  status: 'cancelado' },
            { id: 3, valor: 320.0, status: 'pago' },
          ];
          const total = transacoes.filter(i => i.status === 'pago').reduce((a, b) => a + b.valor, 0);
          return total === 470;
        `,
      },
    ],
    explanation: 'O encadeamento de métodos funcionais (`filter().reduce()`) é padrão na programação JavaScript moderna pois preserva a imutabilidade dos dados originais.',
  },

  // INTERMEDIÁRIO 2: Async / Await e Tratamento de Erros
  {
    id: 'js-inter-02',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Assincronismo & Promises',
    title: 'Requisição Assíncrona com Async / Await e Fetch',
    summary: 'Consuma uma API REST utilizando async/await, validação de status ok e tratamento de exceções com try-catch.',
    realWorldContext: 'A maioria dos bugs de frontend decorre de não tratar erros de rede ou respostas HTTP 4xx/5xx que não rejeitam a promise do fetch automaticamente.',
    description: 'Complete a função assíncrona que faz a requisição com `await fetch()`, verifica se a resposta foi bem-sucedida com `res.ok`, e converte para JSON.',
    goal: 'Escrever as palavras-chave async, await e o método .json().',
    templateCode: `// 1. Declara a função assíncrona
{{blank_0}} function buscarDadosCep(cep) {
  try {
    // 2. Aguarda a requisição HTTP
    const resposta = {{blank_1}} fetch(\`https://viacep.com.br/ws/\${cep}/json/\`);
    
    if (!resposta.ok) {
      throw new Error(\`Erro HTTP: \${resposta.status}\`);
    }

    // 3. Aguarda a conversão do corpo da resposta para JSON
    const dados = await resposta.{{blank_2}}();
    return dados;
  } catch (erro) {
    console.error('Falha ao consultar CEP:', erro.message);
    return null;
  }
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Palavra-chave de função assíncrona',
        placeholder: 'async',
        expectedAnswers: ['async'],
        hint: 'Palavra-chave colocada antes de function para permitir o uso de await.',
      },
      {
        id: 'blank_1',
        label: 'Palavra-chave de espera da Promise',
        placeholder: 'await',
        expectedAnswers: ['await'],
        hint: 'Pausa a execução até que a Promise do fetch seja resolvida.',
      },
      {
        id: 'blank_2',
        label: 'Método de parsing do corpo',
        placeholder: 'json',
        expectedAnswers: ['json'],
        hint: 'Método assíncrono do objeto Response que decodifica JSON.',
      },
    ],
    solutionCode: `async function buscarDadosCep(cep) {
  try {
    const resposta = await fetch(\`https://viacep.com.br/ws/\${cep}/json/\`);
    if (!resposta.ok) {
      throw new Error(\`Erro HTTP: \${resposta.status}\`);
    }
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error('Falha ao consultar CEP:', erro.message);
    return null;
  }
}`,
    hints: [
      'Dica 1: Toda função que utiliza "await" internamente precisa ser declarada com "async".',
      'Dica 2: fetch() retorna uma Promise que deve ser aguardada com "await".',
      'Dica 3: Para ler o corpo JSON, chame await resposta.json().',
    ],
    testCases: [
      {
        description: 'Função declarada com async/await e tratamento try-catch',
        expectedOutput: 'objeto de dados parseado ou null em caso de erro',
      },
    ],
    explanation: 'Diferente de axios ou jquery, a API nativa `fetch` NÃO rejeita a Promise em status 404 ou 500. A checagem `if (!resposta.ok)` é obrigatória para capturar erros de servidor.',
  },

  // AVANÇADO 1: POO ES6 Classes e Getters
  {
    id: 'js-avancado-01',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Classes & POO no ES6',
    title: 'Carrinho de Compras Orientado a Objetos com Getter',
    summary: 'Construa uma classe para gerenciar itens de carrinho de compras com propriedades privadas e getters calculados.',
    realWorldContext: 'Gerenciadores de estado no frontend organizam a lógica de negócios em classes de modelo para evitar poluição dos componentes de interface.',
    description: 'Complete a classe `Carrinho`. Ela deve ter o campo privado `#itens` e um getter `total` que calcula o somatório em tempo real sem permitir que a propriedade seja alterada diretamente.',
    goal: 'Utilizar a sintaxe de propriedade privada com hash (#) e a palavra reservada get.',
    templateCode: `class Carrinho {
  // 1. Campo privado no JavaScript moderno
  {{blank_0}} = [];

  adicionarItem(produto, preco, quantidade = 1) {
    this.#itens.push({ produto, preco, quantidade });
  }

  // 2. Propriedade getter calculada
  {{blank_1}} total() {
    return this.#itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  }

  get quantidadeItens() {
    return this.#itens.length;
  }
}

const meuCarrinho = new Carrinho();
meuCarrinho.adicionarItem('Camisa Dev', 59.90, 2);
console.log('Total a pagar:', meuCarrinho.total);
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Declaração de campo privado',
        placeholder: '#itens',
        expectedAnswers: ['#itens'],
        hint: 'No JavaScript ES2022+, campos privados são declarados com o prefixo cerquilha (#).',
      },
      {
        id: 'blank_1',
        label: 'Palavra-chave para getter',
        placeholder: 'get',
        expectedAnswers: ['get'],
        hint: 'Palavra-chave para criar uma propriedade de leitura calculada.',
      },
    ],
    solutionCode: `class Carrinho {
  #itens = [];

  adicionarItem(produto, preco, quantidade = 1) {
    this.#itens.push({ produto, preco, quantidade });
  }

  get total() {
    return this.#itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  }

  get quantidadeItens() {
    return this.#itens.length;
  }
}

const meuCarrinho = new Carrinho();
meuCarrinho.adicionarItem('Camisa Dev', 59.90, 2);
console.log('Total a pagar:', meuCarrinho.total);`,
    hints: [
      'Dica 1: O JavaScript moderno suporta privacidade real de campos através do caractere # (#itens).',
      'Dica 2: Um getter permite acessar um método como se fosse uma propriedade comum: objeto.total.',
    ],
    testCases: [
      {
        description: 'Calcula o total através do getter sem expor a lista privada',
        expectedOutput: 'Total a pagar: 119.8',
        testFunction: `
          const c = new Carrinho();
          c.adicionarItem('A', 50, 2);
          return c.total === 100;
        `,
      },
    ],
    explanation: 'Ao usar campos privados `#` do ECMAScript oficial, nenhum código externo consegue acidentalmente resetar ou corromper a lista de itens do carrinho.',
  },

  // AVANÇADO 2: Função Utilitária Debounce
  {
    id: 'js-avancado-02',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'codigo_livre',
    topic: 'Closures & Performance',
    title: 'Implementação de Função Utilitária Debounce',
    summary: 'Crie uma função de debounce com closures para otimizar campos de busca e eventos repetitivos.',
    realWorldContext: 'Em campos de busca com autocompletar, disparar requisições a cada tecla digitada sobrecarrega o servidor. O debounce aguarda o usuário parar de digitar por X milissegundos.',
    description: 'Implemente a função `debounce(fn, delay)` que recebe uma função de callback e um tempo de espera em milissegundos. Ela deve retornar uma nova função que adia a chamada usando `setTimeout` e cancela chamadas anteriores com `clearTimeout`.',
    goal: 'Construir a closure de debounce padrão da indústria.',
    templateCode: `/**
 * Retorna uma versão debounced da função passada,
 * postergando sua execução até que passem 'delay' milissegundos
 * desde a última invocação.
 */
function debounce(fn, delay = 300) {
  let timerId = null;

  return function (...args) {
    // Escreva sua implementação aqui
    // 1. Limpe o timeout anterior com clearTimeout
    // 2. Crie um novo setTimeout que execute fn(...args)
    
  };
}
`,
    solutionCode: `function debounce(fn, delay = 300) {
  let timerId = null;

  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}`,
    hints: [
      'Dica 1: A variável timerId é mantida na closure da função externa.',
      'Dica 2: Se timerId existir, chame clearTimeout(timerId).',
      'Dica 3: Use setTimeout(() => fn(...args), delay) para agendar a nova chamada.',
    ],
    testCases: [
      {
        description: 'Debounce agrupa múltiplas chamadas consecutivas em uma única',
        expectedOutput: 'Executado apenas uma vez após o delay',
        testFunction: `
          let contagem = 0;
          const fn = debounce(() => { contagem++; }, 50);
          fn();
          fn();
          fn();
          return new Promise(resolve => {
            setTimeout(() => {
              resolve(contagem === 1);
            }, 100);
          });
        `,
      },
    ],
    explanation: 'O padrão Debounce é uma das perguntas e necessidades mais frequentes em entrevistas e projetos front-end para evitar requisições redundantes de busca e redimensionamento de janela.',
  },

  // AVANÇADO 3: Agrupamento de Dados (Object.groupBy / Reduce)
  {
    id: 'js-avancado-03',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Manipulação de Dados',
    title: 'Agrupamento de Pedidos por Categoria com Reduce',
    summary: 'Agrupe uma lista plana de produtos em um objeto indexado por categorias.',
    realWorldContext: 'Para exibir vitrines organizadas por seções ("Eletrônicos", "Moda", "Livros"), o frontend agrupa arrays de dados recebidos de APIs planas.',
    description: 'Complete a função de agrupamento com `reduce`. Se a chave da categoria ainda não existir no acumulador, inicialize-a com um array vazio `[]` antes de fazer o push.',
    goal: 'Preencher a inicialização da chave e a inserção do item no grupo.',
    templateCode: `const produtos = [
  { id: 1, nome: 'Monitor', categoria: 'tecnologia' },
  { id: 2, nome: 'Teclado', categoria: 'tecnologia' },
  { id: 3, nome: 'Camiseta', categoria: 'vestuario' },
  { id: 4, nome: 'Mochila', categoria: 'acessorios' },
];

const agrupados = produtos.reduce((acc, produto) => {
  const chave = produto.categoria;
  
  // 1. Inicializa o array caso a categoria ainda não exista no acumulador
  if (!acc[chave]) {
    {{blank_0}} = [];
  }
  
  // 2. Insere o produto no array da categoria
  acc[chave].{{blank_1}}(produto);
  
  return acc;
}, {});

console.log(agrupados);
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Inicialização da propriedade no acumulador',
        placeholder: 'acc[chave]',
        expectedAnswers: ['acc[chave]'],
        hint: 'Acesse a propriedade dinâmica usando a variável chave.',
      },
      {
        id: 'blank_1',
        label: 'Método para inserir no array',
        placeholder: 'push',
        expectedAnswers: ['push'],
        hint: 'Método padrão de arrays para adicionar um novo elemento ao final.',
      },
    ],
    solutionCode: `const produtos = [
  { id: 1, nome: 'Monitor', categoria: 'tecnologia' },
  { id: 2, nome: 'Teclado', categoria: 'tecnologia' },
  { id: 3, nome: 'Camiseta', categoria: 'vestuario' },
  { id: 4, nome: 'Mochila', categoria: 'acessorios' },
];

const agrupados = produtos.reduce((acc, produto) => {
  const chave = produto.categoria;
  if (!acc[chave]) {
    acc[chave] = [];
  }
  acc[chave].push(produto);
  return acc;
}, {});`,
    hints: [
      'Dica 1: Para criar uma chave dinâmica em um objeto, use colchetes: acc[chave] = [].',
      'Dica 2: O método para empurrar um item para dentro de um array é push().',
    ],
    testCases: [
      {
        description: 'Agrupa 4 produtos em 3 chaves de categoria',
        expectedOutput: '{ tecnologia: [2], vestuario: [1], acessorios: [1] }',
      },
    ],
    explanation: 'Agrupar dados via `reduce` é a técnica mais compatível em navegadores e servidores para construir tabelas agrupadas e relatórios analíticos.',
  },
];
