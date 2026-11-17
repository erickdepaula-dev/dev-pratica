import { Exercise } from '../../types/exercise';

export const jsIntermediateExercises: Exercise[] = [
  // 1
  {
    id: 'js-inter-01',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Array.reduce & Agrupamento',
    title: 'Agrupamento de Vendas por Categoria com Array.reduce',
    summary: 'Construa uma função de agrupamento (groupBy) sem bibliotecas externas usando reduce.',
    realWorldContext: 'Dashboards e relatórios frequentemente precisam transformar listas planas de pedidos em coleções agrupadas por status ou departamento.',
    description: 'Use reduce iniciando com um objeto vazio {} para indexar as vendas pela propriedade categoria.',
    goal: 'Preencher a chamada do reduce e a atribuição no acumulador.',
    templateCode: `const vendas = [
  { id: 1, item: 'Mouse', categoria: 'Informatica', valor: 90 },
  { id: 2, item: 'Cadeira', categoria: 'Moveis', valor: 850 },
  { id: 3, item: 'Teclado', categoria: 'Informatica', valor: 250 },
];

function agruparPorCategoria(lista) {
  return lista.{{blank_0}}((acc, venda) => {
    const chave = venda.categoria;
    // Se a categoria ainda não foi inicializada, cria array vazio
    if (!acc[chave]) {
      acc[chave] = [];
    }
    // Adiciona a venda ao grupo
    acc[chave].push(venda);
    return acc;
  }, {{blank_1}});
}

console.log(agruparPorCategoria(vendas));
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Método acumulador de Array',
        expectedAnswers: ['reduce'],
        hint: 'Método funcional para transformar um array em um único valor ou objeto agregado.',
      },
      {
        id: 'blank_1',
        label: 'Valor inicial do acumulador',
        expectedAnswers: ['{}'],
        hint: 'Objeto literal vazio como ponto de partida da acumulação.',
      },
    ],
    solutionCode: `function agruparPorCategoria(lista) {
  return lista.reduce((acc, venda) => {
    const chave = venda.categoria;
    if (!acc[chave]) {
      acc[chave] = [];
    }
    acc[chave].push(venda);
    return acc;
  }, {});
}`,
    hints: [
      'Dica 1: reduce() recebe a função redutora e o valor inicial do acumulador.',
      'Dica 2: Passar {} garante que acc comece como um objeto vazio.',
    ],
    testCases: [
      {
        description: 'Agrupa vendas de Informatica e Moveis corretamente',
        expectedOutput: 'Objeto com chaves Informatica e Moveis',
      },
    ],
    explanation: 'Array.reduce é a ferramenta canônica para agregar e remodelar estruturas de dados complexas em JavaScript.',
  },

  // 2
  {
    id: 'js-inter-02',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Closures & Otimização',
    title: 'Função Utilitária de Debounce para Busca em Tempo Real',
    summary: 'Evite chamadas excessivas de API enquanto o usuário ainda está digitando no input.',
    realWorldContext: 'Sem debounce, uma busca com a palavra "computador" dispara 10 requisições seguidas para o servidor, sobrecarregando o backend.',
    description: 'Implemente o utilitário debounce que limpa o timer anterior com clearTimeout e agenda a nova execução.',
    goal: 'Usar clearTimeout e setTimeout preservando o contexto dos argumentos.',
    templateCode: `function debounce(fn, delayMs) {
  let timeoutId;

  return function (...args) {
    // 1. Cancela o timeout pendente anterior
    {{blank_0}}(timeoutId);

    // 2. Agenda a nova chamada da função
    timeoutId = {{blank_1}}(() => {
      fn.apply(this, args);
    }, delayMs);
  };
}

// Exemplo:
const buscarNaApi = (termo) => console.log('Buscando:', termo);
const buscaOtimizada = debounce(buscarNaApi, 300);
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Cancelamento do timer pendente',
        expectedAnswers: ['clearTimeout'],
        hint: 'Função nativa para cancelar um timeout antes de sua execução.',
      },
      {
        id: 'blank_1',
        label: 'Agendamento do novo timer',
        expectedAnswers: ['setTimeout'],
        hint: 'Função nativa para agendar a execução do callback.',
      },
    ],
    solutionCode: `function debounce(fn, delayMs) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delayMs);
  };
}`,
    hints: [
      'Dica 1: O debounce aproveita closures para manter timeoutId na memória entre chamadas.',
      'Dica 2: clearTimeout(timeoutId) impede a execução caso o usuário digite novamente antes de decorrido delayMs.',
    ],
    testCases: [
      {
        description: 'Chama a função apenas uma vez após pausa de digitação',
        expectedOutput: 'Execução única atrasada',
      },
    ],
    explanation: 'Debounce é uma técnica clássica e crucial em aplicações web para economizar largura de banda e reduzir carga em APIs.',
  },

  // 3
  {
    id: 'js-inter-03',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Assincronismo & AbortController',
    title: 'Cancelamento de Requisição Fetch com AbortController',
    summary: 'Cancele requisições HTTP caso ultrapassem o limite de timeout para não travar o app.',
    realWorldContext: 'Se uma API demorar mais de 5 segundos, a requisição deve ser cancelada para evitar vazamento de memória e informar o usuário com elegância.',
    description: 'Instancie AbortController e vincule a propriedade signal nas opções da chamada fetch.',
    goal: 'Criar AbortController e passar seu signal para o fetch.',
    templateCode: `async function buscarComTimeout(url, limiteMs = 3000) {
  const controller = {{blank_0}}();
  const timer = setTimeout(() => controller.abort(), limiteMs);

  try {
    const resposta = await fetch(url, {
      {{blank_1}}: controller.signal,
    });
    clearTimeout(timer);
    return await resposta.json();
  } catch (erro) {
    clearTimeout(timer);
    if (erro.name === 'AbortError') {
      throw new Error('Tempo limite excedido (Timeout)');
    }
    throw erro;
  }
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Instanciação do AbortController',
        expectedAnswers: ['new AbortController'],
        hint: 'Instancie a classe nativa AbortController.',
      },
      {
        id: 'blank_1',
        label: 'Propriedade de sinal nas opções',
        expectedAnswers: ['signal'],
        hint: 'Nome da propriedade que recebe o controlador de aborto no fetch.',
      },
    ],
    solutionCode: `async function buscarComTimeout(url, limiteMs = 3000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), limiteMs);

  try {
    const resposta = await fetch(url, {
      signal: controller.signal,
    });
    clearTimeout(timer);
    return await resposta.json();
  } catch (erro) {
    clearTimeout(timer);
    if (erro.name === 'AbortError') {
      throw new Error('Tempo limite excedido (Timeout)');
    }
    throw erro;
  }
}`,
    hints: [
      'Dica 1: new AbortController() cria um sinal que pode ser cancelado via controller.abort().',
      'Dica 2: No fetch, { signal: controller.signal } permite interromper a conexão TCP imediatamente.',
    ],
    testCases: [
      {
        description: 'Lança erro amigável quando requisição é abortada por tempo',
        expectedOutput: 'Tempo limite excedido (Timeout)',
      },
    ],
    explanation: 'AbortController é essencial para cancelar requisições obsoletas (ex: autocomplete ao mudar de busca) e evitar condições de corrida (race conditions).',
  },

  // 4
  {
    id: 'js-inter-04',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Cópia Profunda (Deep Clone)',
    title: 'Clonagem Profunda de Objetos com structuredClone',
    summary: 'Crie uma cópia 100% independente de objetos e arrays aninhados sem recorrer a JSON.parse(JSON.stringify).',
    realWorldContext: 'JSON.stringify perde Dates, Maps, Sets e dá erro em referências circulares. structuredClone é a solução nativa moderna.',
    description: 'Invoque a função nativa structuredClone para duplicar o objeto com total isolamento de referências.',
    goal: 'Preencher a chamada de structuredClone.',
    templateCode: `const pedidoOriginal = {
  id: 'ORD-982',
  cliente: { nome: 'Julia', email: 'julia@teste.com' },
  itens: [{ sku: 'SKU-1', qtd: 2 }],
  data: new Date(),
};

// Cria clone profundo isolado
const pedidoCopia = {{blank_0}}(pedidoOriginal);

// Modificação não deve afetar o original
pedidoCopia.cliente.nome = 'Julia Santos';
console.log(pedidoOriginal.cliente.nome); // 'Julia'
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Função nativa de cópia profunda',
        expectedAnswers: ['structuredClone'],
        hint: 'Função global do padrão ECMAScript/HTML5 para clonagem profunda.',
      },
    ],
    solutionCode: `const pedidoCopia = structuredClone(pedidoOriginal);`,
    hints: [
      'Dica 1: structuredClone() copia estruturas aninhadas, buffers e instâncias de Date.',
    ],
    testCases: [
      {
        description: 'Modificar a cópia não reflete no objeto original',
        expectedOutput: 'Julia (original inalterado)',
      },
    ],
    explanation: 'structuredClone é nativa no Node 17+ e em todos os navegadores modernos, substituindo de vez bibliotecas como lodash.cloneDeep para a maioria dos casos.',
  },

  // 5
  {
    id: 'js-inter-05',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Classes ES6 & Campos Privados',
    title: 'Encapsulamento com Campos Privados (#) em Classes',
    summary: 'Proteja dados confidenciais (como saldo bancário) de alterações externas diretas usando #.',
    realWorldContext: 'Garantir que regras de negócio (como não permitir saldo negativo) não sejam burladas por atribuições acidentais como conta.saldo = -500.',
    description: 'Declare o campo privado com o prefixo # e defina o getter correspondente.',
    goal: 'Declarar #saldo e acessá-lo internamente.',
    templateCode: `class ContaBancaria {
  // 1. Campo privado verdadeiro
  {{blank_0}} = 0;

  constructor(saldoInicial) {
    if (saldoInicial > 0) {
      this.#saldo = saldoInicial;
    }
  }

  depositar(valor) {
    if (valor <= 0) throw new Error('Valor inválido');
    this.#saldo += valor;
  }

  // 2. Getter público somente leitura
  get saldo() {
    return this.{{blank_1}};
  }
}

const conta = new ContaBancaria(100);
conta.depositar(50);
console.log(conta.saldo); // 150
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Declaração do campo privado',
        expectedAnswers: ['#saldo'],
        hint: 'Use a cerquilha # na frente do nome da propriedade.',
      },
      {
        id: 'blank_1',
        label: 'Acesso interno ao campo privado',
        expectedAnswers: ['#saldo'],
        hint: 'Acesse a propriedade privada com this.#saldo.',
      },
    ],
    solutionCode: `class ContaBancaria {
  #saldo = 0;

  constructor(saldoInicial) {
    if (saldoInicial > 0) {
      this.#saldo = saldoInicial;
    }
  }

  depositar(valor) {
    if (valor <= 0) throw new Error('Valor inválido');
    this.#saldo += valor;
  }

  get saldo() {
    return this.#saldo;
  }
}`,
    hints: [
      'Dica 1: O símbolo # garante encapsulamento estrito em tempo de execução no motor V8.',
      'Dica 2: Tentar acessar conta.#saldo fora da classe gera erro de sintaxe imediato.',
    ],
    testCases: [
      {
        description: 'Permite leitura via getter mas protege atribuição direta',
        expectedOutput: '150',
      },
    ],
    explanation: 'Campos privados com # oferecem verdadeiro encapsulamento em JavaScript, sem necessidade de convenções fracas como _saldo.',
  },

  // 6
  {
    id: 'js-inter-06',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Promises & Concorrência',
    title: 'Disparo Concorrente Resiliente com Promise.allSettled',
    summary: 'Consuma múltiplas APIs simultaneamente garantindo que o fracasso de uma não anule as outras.',
    realWorldContext: 'Em um painel do cliente, você busca clima, notificações e saldo. Se a API de clima falhar, o restante dos dados ainda deve ser exibido com sucesso.',
    description: 'Use Promise.allSettled para aguardar todas as Promises e processe o status de cada resultado.',
    goal: 'Preencher Promise.allSettled e verificar status === "fulfilled".',
    templateCode: `async function carregarPainel(promises) {
  // Aguarda a resolução de todas as promises sem falhar se uma rejeitar
  const resultados = await {{blank_0}}(promises);

  const dadosValidos = resultados
    .filter(r => r.status === '{{blank_1}}')
    .map(r => r.value);

  return dadosValidos;
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Método concorrente resiliente',
        expectedAnswers: ['Promise.allSettled'],
        hint: 'Método estático de Promise que retorna o resultado de cada promessa, seja resolvida ou rejeitada.',
      },
      {
        id: 'blank_1',
        label: 'Status de sucesso da promessa',
        expectedAnswers: ['fulfilled'],
        hint: 'String que identifica promessas resolvidas com sucesso no allSettled.',
      },
    ],
    solutionCode: `async function carregarPainel(promises) {
  const resultados = await Promise.allSettled(promises);

  const dadosValidos = resultados
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value);

  return dadosValidos;
}`,
    hints: [
      'Dica 1: Diferente de Promise.all (que faz fail-fast no primeiro erro), allSettled espera todas terminarem.',
      'Dica 2: Objetos retornados têm status: "fulfilled" (com r.value) ou status: "rejected" (com r.reason).',
    ],
    testCases: [
      {
        description: 'Extrai apenas dados de promises cumpridas',
        expectedOutput: 'Array com valores fulfilled',
      },
    ],
    explanation: 'Promise.allSettled é a abordagem recomendada para dashboards e agregadores onde falhas parciais são toleradas.',
  },

  // 7
  {
    id: 'js-inter-07',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Estruturas de Dados (Set & Map)',
    title: 'Deduplicação e Contagem Rápida com Set e Map',
    summary: 'Elimine duplicatas em tempo recorde com Set e conte frequências de acessos com Map.',
    realWorldContext: 'Processar logs de IPs ou tags de produtos evitando repetições e calculando estatísticas com complexidade O(1).',
    description: 'Use new Set() com spread para deduplicar e os métodos has/set do Map para contagem.',
    goal: 'Criar array de únicos com Set e incrementar contagem no Map.',
    templateCode: `function extrairTagsUnicas(todasTags) {
  // 1. Remove duplicatas usando Set
  return [{{blank_0}}new Set(todasTags)];
}

function contarFrequencia(itens) {
  const contagem = new Map();

  for (const item of itens) {
    const atual = contagem.{{blank_1}}(item) ? contagem.get(item) : 0;
    contagem.set(item, atual + 1);
  }

  return contagem;
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Spread operator no Set',
        expectedAnswers: ['...'],
        hint: 'Operador de espalhamento para transformar a coleção Set em array.',
      },
      {
        id: 'blank_1',
        label: 'Método para checar existência no Map',
        expectedAnswers: ['has'],
        hint: 'Método que verifica se a chave existe na instância de Map.',
      },
    ],
    solutionCode: `function extrairTagsUnicas(todasTags) {
  return [...new Set(todasTags)];
}

function contarFrequencia(itens) {
  const contagem = new Map();

  for (const item of itens) {
    const atual = contagem.has(item) ? contagem.get(item) : 0;
    contagem.set(item, atual + 1);
  }

  return contagem;
}`,
    hints: [
      'Dica 1: [...new Set(array)] é o padrão da indústria para deduplicar arrays primitivos.',
      'Dica 2: Map.has(key) e Map.get(key) operam em tempo constante O(1).',
    ],
    testCases: [
      {
        description: 'Remove duplicatas e conta ocorrências de itens',
        expectedOutput: 'Lista única e contagem precisa',
      },
    ],
    explanation: 'Set e Map são otimizados especificamente para coleções com frequentes inserções e buscas por chave.',
  },

  // 8
  {
    id: 'js-inter-08',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Manipulação de Objetos',
    title: 'Imutabilidade de Estruturas com Object.freeze Profundo',
    summary: 'Construa uma função recursiva de deep freeze para impedir modificações acidentais em configurações.',
    realWorldContext: 'Constantes globais de regras de negócio em sistemas financeiros não podem ser alteradas por nenhum script terceiro.',
    description: 'Aplique Object.freeze recursivamente em todas as propriedades que forem objetos.',
    goal: 'Usar Object.freeze e Object.keys para congelar em profundidade.',
    templateCode: `function congelarProfundo(obj) {
  // 1. Obtém as chaves das propriedades
  const chaves = Object.keys(obj);

  for (const chave of chaves) {
    const valor = obj[chave];
    if (valor && typeof valor === 'object') {
      congelarProfundo(valor);
    }
  }

  // 2. Congela o objeto atual
  return Object.{{blank_0}}(obj);
}

const config = congelarProfundo({ api: { endpoint: 'https://api.com' } });
// Tentativa de mutação falha silenciosamente ou lança TypeError em strict mode
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Método nativo de congelamento',
        expectedAnswers: ['freeze'],
        hint: 'Método estático de Object que impede adição, remoção e alteração de propriedades.',
      },
    ],
    solutionCode: `function congelarProfundo(obj) {
  const chaves = Object.keys(obj);

  for (const chave of chaves) {
    const valor = obj[chave];
    if (valor && typeof valor === 'object') {
      congelarProfundo(valor);
    }
  }

  return Object.freeze(obj);
}`,
    hints: [
      'Dica 1: Object.freeze() por padrão é raso (shallow freeze). A recursão garante proteção profunda.',
    ],
    testCases: [
      {
        description: 'Objeto aninhado torna-se imutável',
        expectedOutput: 'Objeto congelado',
      },
    ],
    explanation: 'Deep freeze é uma prática excelente para garantir integridade absoluta de dicionários de configuração e esquemas constantes.',
  },

  // 9
  {
    id: 'js-inter-09',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Eventos Customizados no DOM',
    title: 'Comunicação Desacoplada com CustomEvent e dispatchEvent',
    summary: 'Emita eventos customizados no window ou elemento DOM com payload detalhado.',
    realWorldContext: 'Micro-frontends ou componentes vanilla que precisam notificar outros componentes (ex: "carrinho:atualizado") sem acoplamento direto.',
    description: 'Instancie CustomEvent com a propriedade detail e dispare com dispatchEvent.',
    goal: 'Criar CustomEvent passando detail e despachar no target.',
    templateCode: `function notificarCarrinhoAtualizado(target, totalItens, valorTotal) {
  // 1. Cria o evento com payload no objeto detail
  const evento = new {{blank_0}}('carrinho:atualizado', {
    bubbles: true,
    detail: { totalItens, valorTotal }
  });

  // 2. Dispara o evento
  target.{{blank_1}}(evento);
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Classe de evento customizado',
        expectedAnswers: ['CustomEvent'],
        hint: 'Classe nativa para criação de eventos com dados arbitrários.',
      },
      {
        id: 'blank_1',
        label: 'Método de disparo no alvo',
        expectedAnswers: ['dispatchEvent'],
        hint: 'Método em EventTarget para disparar um evento síncrono.',
      },
    ],
    solutionCode: `function notificarCarrinhoAtualizado(target, totalItens, valorTotal) {
  const evento = new CustomEvent('carrinho:atualizado', {
    bubbles: true,
    detail: { totalItens, valorTotal }
  });

  target.dispatchEvent(evento);
}`,
    hints: [
      'Dica 1: CustomEvent recebe o nome do evento e um objeto de opções contendo detail.',
      'Dica 2: Os ouvintes escutam via target.addEventListener("carrinho:atualizado", (e) => console.log(e.detail)).',
    ],
    testCases: [
      {
        description: 'Dispara CustomEvent com dados em e.detail',
        expectedOutput: 'Evento despachado',
      },
    ],
    explanation: 'CustomEvent é a forma canônica de implementar publish-subscribe diretamente na arquitetura de eventos do navegador.',
  },

  // 10
  {
    id: 'js-inter-10',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'lacunas',
    topic: 'Assincronismo & Resiliência',
    title: 'Retentativas com Backoff Exponencial (Retry Pattern)',
    summary: 'Construa um executor de operações assíncronas com retentativas e tempo de espera crescente.',
    realWorldContext: 'Falhas transitórias de rede (ex: instabilidade temporária no 4G) são resolvidas ao retentar a chamada após 500ms, 1000ms, 2000ms.',
    description: 'Execute em loop de tentativas usando Math.pow para calcular a espera exponencial.',
    goal: 'Implementar a lógica de retentativa e cálculo de backoff.',
    templateCode: `async function executarComRetry(operacaoAsync, maxTentativas = 3, atrasoBaseMs = 300) {
  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    try {
      return await operacaoAsync();
    } catch (erro) {
      if (tentativa === maxTentativas) {
        throw erro;
      }
      // Cálculo de backoff exponencial: atrasoBase * 2^(tentativa - 1)
      const espera = atrasoBaseMs * {{blank_0}}(2, tentativa - 1);
      await new Promise(res => setTimeout(res, espera));
    }
  }
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Função de potência matemática',
        expectedAnswers: ['Math.pow'],
        hint: 'Método estático de Math para cálculo de potências.',
      },
    ],
    solutionCode: `async function executarComRetry(operacaoAsync, maxTentativas = 3, atrasoBaseMs = 300) {
  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    try {
      return await operacaoAsync();
    } catch (erro) {
      if (tentativa === maxTentativas) {
        throw erro;
      }
      const espera = atrasoBaseMs * Math.pow(2, tentativa - 1);
      await new Promise(res => setTimeout(res, espera));
    }
  }
}`,
    hints: [
      'Dica 1: Math.pow(2, x) ou 2 ** x dobra o tempo a cada falha subsequente.',
      'Dica 2: Se atingir o número máximo de tentativas, o erro é relançado.',
    ],
    testCases: [
      {
        description: 'Recupera com sucesso após falha temporária',
        expectedOutput: 'Resultado da operação retornado',
      },
    ],
    explanation: 'Backoff exponencial com jitter é o padrão da indústria (recomendado por AWS, Stripe e Google) para comunicação resiliente.',
  },

  // 11 - Corrigir Erros (Mutação de Array)
  {
    id: 'js-inter-debug-01',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'corrigir_erros',
    topic: 'Imutabilidade & Métodos de Array',
    title: 'Depuração: Mutação Involuntária do Array Original com sort()',
    summary: 'Corrija um bug grave de efeito colateral onde ordenar uma lista altera permanentemente o array passado como argumento.',
    realWorldContext: 'No React, Vue e arquiteturas Redux, mutar arrays recebidos via props quebra o rastreamento de mudanças (shallow compare) e introduz bugs visuais misteriosos.',
    description: 'A função `obterMenorPreco` deveria retornar uma cópia ordenada dos preços sem alterar o array original `precosOriginais`. No entanto, como `Array.prototype.sort()` é destrutivo (muta in-place), o array original está sendo corrompido! Corrija para ordenar uma cópia imutável.',
    goal: 'Criar uma cópia rasa do array com [...precos] ou slice() antes de chamar sort().',
    bugDescription: 'A função chama precos.sort() diretamente, mutando o array original por referência.',
    buggyLineNumbers: [3],
    initialBuggyCode: `function obterPrecosOrdenados(precos) {
    // BUG: sort() muta o array original!
    return precos.sort((a, b) => a - b);
}

const produtos = [120, 45, 89];
const ordenados = obterPrecosOrdenados(produtos);
console.log("Ordenados:", ordenados);
console.log("Original permaneceu intacto?:", produtos[0] === 120);
`,
    templateCode: `function obterPrecosOrdenados(precos) {
    // Corrija para não mutar o array "precos" original:
    return [...precos].sort((a, b) => a - b);
}

const produtos = [120, 45, 89];
const ordenados = obterPrecosOrdenados(produtos);
console.log("Original permaneceu intacto?:", produtos[0] === 120);
`,
    solutionCode: `function obterPrecosOrdenados(precos) {
    return [...precos].sort((a, b) => a - b);
}

const produtos = [120, 45, 89];
const ordenados = obterPrecosOrdenados(produtos);`,
    hints: [
      'Dica 1: O operador spread [...precos] ou precos.slice() cria uma nova referência em memória.',
      'Dica 2: No ECMAScript moderno, também existe o método toSorted() que é imutável por padrão.',
    ],
    testCases: [
      {
        description: 'Ordena números sem alterar o array original',
        expectedOutput: 'Original permanece [120, 45, 89] e ordenados é [45, 89, 120]',
        testFunction: `
          const orig = [120, 45, 89];
          const ord = obterPrecosOrdenados(orig);
          return orig[0] === 120 && ord[0] === 45 && ord[2] === 120;
        `,
      },
    ],
    validationRules: [
      {
        id: 'rule-immutable',
        description: 'Uso de [...precos], precos.slice() ou toSorted()',
        type: 'regex',
        target: '(\\[\\.\\.\\.|slice\\(\\)|toSorted)',
      },
    ],
    explanation: 'O método sort() nativo do JavaScript ordena o array original in-place. Criar uma cópia rasa prévia com [...array] garante a pureza da função e evita efeitos colaterais em toda a aplicação.',
  },

  // 12 - Prever a Saída (Event Loop & Microtasks)
  {
    id: 'js-inter-prever-01',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'prever_saida',
    topic: 'Event Loop & Promises',
    title: 'Previsão de Saída: Ordem de Execução do Event Loop (Microtasks vs Macrotasks)',
    summary: 'Preveja a ordem exata de saída no terminal envolvendo código síncrono, setTimeout e Promise.',
    realWorldContext: 'Entender a fila de microtasks (Promises) e macrotasks (setTimeout, setInterval) é fundamental para depurar timing issues, renderização e requisições assíncronas no browser e no Node.js.',
    description: 'Analise a sequência de comandos abaixo. Sem executar, determine a ordem exata das mensagens impressas.',
    goal: 'Prever a sequência correta de saídas do console.',
    templateCode: `console.log("1");

setTimeout(() => {
    console.log("2");
}, 0);

Promise.resolve().then(() => {
    console.log("3");
});

console.log("4");
`,
    codeToPredict: `console.log("1");

setTimeout(() => {
    console.log("2");
}, 0);

Promise.resolve().then(() => {
    console.log("3");
});

console.log("4");`,
    expectedOutputPrediction: '1 4 3 2',
    acceptableOutputPredictions: ['1 4 3 2', '1, 4, 3, 2', '1\n4\n3\n2', '1432'],
    solutionCode: `// 1. Código síncrono executa primeiro: "1" e depois "4"
// 2. Microtasks (Promise.then) executam assim que o código síncrono termina: "3"
// 3. Macrotasks (setTimeout) executam na próxima volta do event loop: "2"
// Ordem final: 1 4 3 2`,
    hints: [
      'Dica 1: O código síncrono no call stack executa primeiro em ordem ("1" e "4").',
      'Dica 2: Promises entram na fila de Microtasks, que tem prioridade máxima assim que o call stack esvazia.',
      'Dica 3: setTimeout entra na fila de Macrotasks (Task Queue) e só roda depois das microtasks.',
    ],
    testCases: [
      {
        description: 'Ordem de execução 1, 4, 3, 2',
        expectedOutput: '1 4 3 2',
      },
    ],
    explanation: 'O Event Loop do JavaScript primeiro esgota a pilha de execução síncrona (1 e 4). Antes de pegar o próximo evento da fila de timers (macrotask), ele esvazia integralmente a fila de microtarefas (microtask queue), executando o callback da Promise (3), e por fim o callback do setTimeout (2).',
  },

  // 13 - Desafio Prático
  {
    id: 'js-inter-desafio-01',
    language: 'javascript',
    difficulty: 'intermediario',
    type: 'desafio_pratico',
    topic: 'Manipulação de Objetos & Carrinho',
    title: 'Desafio Prático: Atualizador Imutável de Quantidade em Carrinho de Compras',
    summary: 'Construa uma função pura que atualiza a quantidade de um item no carrinho de compras ou o remove se a quantidade for zerada.',
    realWorldContext: 'Manipulação de estado de carrinho é o coração de qualquer aplicação e-commerce. As atualizações devem ser 100% imutáveis para garantir previsibilidade.',
    description: 'Crie a função `atualizarCarrinho(carrinho, produtoId, delta)` onde:\n- `carrinho` é um array de objetos `{ id: number, nome: string, qtd: number, preco: number }`.\n- `delta` é um número inteiro (ex: +1 para adicionar, -1 para subtrair).\nRegras:\n1. Não mutar o array nem os objetos do carrinho original.\n2. Encontrar o item pelo `id`. Se não encontrar, retornar uma nova cópia do array sem alterações.\n3. Somar `delta` à quantidade atual (`qtd + delta`).\n4. Se a nova quantidade for menor ou igual a 0 (`<= 0`), o item deve ser REMOVIDO do array.\n5. Se a nova quantidade for maior que 0, retornar o array com o objeto atualizado imutavelmente.',
    goal: 'Combinar map e filter para produzir um novo estado de carrinho consistente.',
    practicalRequirements: [
      'Não mutar o carrinho original',
      'Aumentar ou diminuir quantidade somando delta',
      'Remover item se a quantidade final for <= 0',
      'Preservar os demais itens sem alteração',
    ],
    templateCode: `function atualizarCarrinho(carrinho, produtoId, delta) {
    // Implemente a lógica pura de atualização aqui
}

// Testes:
const inicial = [
    { id: 1, nome: "Teclado", qtd: 2, preco: 150 },
    { id: 2, nome: "Mouse", qtd: 1, preco: 80 },
];

const adicionouUm = atualizarCarrinho(inicial, 1, 1); // qtd do Teclado passa a 3
const removeuMouse = atualizarCarrinho(inicial, 2, -1); // Mouse removido (qtd virou 0)
`,
    solutionCode: `function atualizarCarrinho(carrinho, produtoId, delta) {
    return carrinho
        .map(item => {
            if (item.id === produtoId) {
                return { ...item, qtd: item.qtd + delta };
            }
            return item;
        })
        .filter(item => item.qtd > 0);
}

const inicial = [
    { id: 1, nome: "Teclado", qtd: 2, preco: 150 },
    { id: 2, nome: "Mouse", qtd: 1, preco: 80 },
];`,
    hints: [
      'Dica 1: Use carrinho.map() para criar novos objetos apenas para o item cujo id é produtoId.',
      'Dica 2: Em seguida encadeie .filter(item => item.qtd > 0) para eliminar itens cuja quantidade zerou.',
    ],
    testCases: [
      {
        description: 'Incrementa quantidade do produto com sucesso',
        expectedOutput: 'Teclado com qtd 3',
        testFunction: `
          const c = [{ id: 1, nome: "Teclado", qtd: 2, preco: 150 }];
          const res = atualizarCarrinho(c, 1, 1);
          return res[0].qtd === 3 && c[0].qtd === 2;
        `,
      },
      {
        description: 'Remove item quando quantidade chega a 0',
        expectedOutput: 'Item removido do array',
        testFunction: `
          const c = [{ id: 2, nome: "Mouse", qtd: 1, preco: 80 }];
          const res = atualizarCarrinho(c, 2, -1);
          return res.length === 0;
        `,
      },
    ],
    validationRules: [
      {
        id: 'rule-map',
        description: 'Uso de map para transformação imutável',
        type: 'contains',
        target: 'map',
      },
      {
        id: 'rule-filter',
        description: 'Uso de filter para remoção condicional',
        type: 'contains',
        target: 'filter',
      },
    ],
    explanation: 'A composição de .map() com .filter() é a forma mais elegante e idiomática no ecossistema JavaScript moderno para transformar coleções de forma puramente declarativa e imutável.',
  },
];

