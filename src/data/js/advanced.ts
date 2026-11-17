import { Exercise } from '../../types/exercise';

export const jsAdvancedExercises: Exercise[] = [
  // 1
  {
    id: 'js-avancado-01',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Metaprogramação & Proxy API',
    title: 'Sistema Reativo de Estado com Proxy API',
    summary: 'Crie uma camada reativa (como no Vue 3 / MobX) que intercepta modificações de propriedades e notifica ouvintes.',
    realWorldContext: 'Sistemas reativos modernos usam Proxy nativo para detectar mudanças em propriedades de objetos em vez de Object.defineProperty antigo.',
    description: 'Implemente o trap set do handler de Proxy garantindo o uso de Reflect.set e invocação do callback de notificação.',
    goal: 'Preencher Reflect.set e retornar booleano no trap set.',
    templateCode: `function criarEstadoReativo(estadoInicial, aoMudar) {
  return new {{blank_0}}(estadoInicial, {
    set(target, propriedade, valor, receiver) {
      // 1. Aplica a alteração usando a API Reflect
      const sucesso = {{blank_1}}(target, propriedade, valor, receiver);

      if (sucesso) {
        // Notifica observadores
        aoMudar(propriedade, valor);
      }

      return sucesso;
    }
  });
}

const estado = criarEstadoReativo({ saldo: 100 }, (prop, val) => {
  console.log(\`Propriedade \${prop} atualizada para: \${val}\`);
});

estado.saldo = 250; // Dispara callback automaticamente
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Construtor da Proxy API',
        expectedAnswers: ['Proxy'],
        hint: 'Classe nativa para envolver objetos e interceptar operações fundamentais.',
      },
      {
        id: 'blank_1',
        label: 'Aplicação com Reflect',
        expectedAnswers: [
          'Reflect.set',
        ],
        hint: 'Método estático de Reflect que espelha o comportamento padrão de atribuição.',
      },
    ],
    solutionCode: `function criarEstadoReativo(estadoInicial, aoMudar) {
  return new Proxy(estadoInicial, {
    set(target, propriedade, valor, receiver) {
      const sucesso = Reflect.set(target, propriedade, valor, receiver);
      if (sucesso) {
        aoMudar(propriedade, valor);
      }
      return sucesso;
    }
  });
}`,
    hints: [
      'Dica 1: new Proxy(target, handler) intercepta leitura (get), escrita (set), deleção (deleteProperty), etc.',
      'Dica 2: Sempre use Reflect dentro dos traps do Proxy para preservar o contexto de receiver e protótipos.',
    ],
    testCases: [
      {
        description: 'Intercepta alteração e executa callback de notificação',
        expectedOutput: 'Propriedade saldo atualizada para: 250',
      },
    ],
    explanation: 'A Proxy API combinada com Reflect forma o núcleo dos motores de reatividade modernos (como Vue 3 e Solid.js).',
  },

  // 2
  {
    id: 'js-avancado-02',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Geradores Assíncronos & Streaming',
    title: 'Streaming de Paginação com Async Generators e for await...of',
    summary: 'Consuma páginas de uma API como um fluxo contínuo de dados sem precisar carregar todas as páginas de uma só vez na memória.',
    realWorldContext: 'Baixar centenas de milhares de linhas de um relatório em lote esgota a memória do navegador. Com streaming paginado, você consome sob demanda.',
    description: 'Use a sintaxe de async generator `async function*` e emita itens individuais com `yield`.',
    goal: 'Declarar o async generator e emitir cada item com yield.',
    templateCode: `// 1. Função geradora assíncrona
{{blank_0}} paginarRegistros(buscarPaginaFn) {
  let paginaAtual = 1;
  let temMais = true;

  while (temMais) {
    const { itens, totalPaginas } = await buscarPaginaFn(paginaAtual);

    for (const item of itens) {
      // 2. Emite o item individualmente para quem consome
      {{blank_1}} item;
    }

    paginaAtual++;
    temMais = paginaAtual <= totalPaginas;
  }
}

// Consumo elegante com for await...of:
// for await (const registro of paginarRegistros(fetchPage)) { ... }
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Declaração de gerador assíncrono',
        expectedAnswers: [
          'async function*',
        ],
        hint: 'Palavras-chave async function com asterisco para geradores.',
      },
      {
        id: 'blank_1',
        label: 'Operador de emissão de valor',
        expectedAnswers: ['yield'],
        hint: 'Palavra-chave usada para pausar e retornar um valor do gerador.',
      },
    ],
    solutionCode: `async function* paginarRegistros(buscarPaginaFn) {
  let paginaAtual = 1;
  let temMais = true;

  while (temMais) {
    const { itens, totalPaginas } = await buscarPaginaFn(paginaAtual);

    for (const item of itens) {
      yield item;
    }

    paginaAtual++;
    temMais = paginaAtual <= totalPaginas;
  }
}`,
    hints: [
      'Dica 1: async function* define um gerador que pode pausar tanto com await quanto com yield.',
      'Dica 2: Quem itera com for await...of recebe cada item assim que ele fica disponível sem bloquear a thread.',
    ],
    testCases: [
      {
        description: 'Itera sobre múltiplas páginas sob demanda',
        expectedOutput: 'Itens consumidos continuamente',
      },
    ],
    explanation: 'Async generators transformam APIs paginadas em fluxos reativos puros e com consumo de memória estritamente constante.',
  },

  // 3
  {
    id: 'js-avancado-03',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Concorrência & Promise Pool',
    title: 'Limitador de Concorrência de Promises (Promise Pool)',
    summary: 'Processe uma fila de 100 requisições executando no máximo N tarefas simultâneas para não estourar rate-limits.',
    realWorldContext: 'Fazer 500 downloads simultâneos derruba conexões de rede e dispara HTTP 429 Too Many Requests no servidor.',
    description: 'Implemente um pool de concorrência com limite de tarefas ativas usando um array de workers.',
    goal: 'Criar workers paralelos que puxam tarefas da fila até esgotar.',
    templateCode: `async function executarComLimite(tarefas, limiteConcorrencia = 3) {
  const resultados = [];
  const fila = [...tarefas.entries()]; // [indice, tarefa]

  async function trabalhador() {
    while (fila.length > 0) {
      // 1. Remove a próxima tarefa da fila
      const [indice, tarefa] = fila.{{blank_0}}();
      resultados[indice] = await tarefa();
    }
  }

  // 2. Dispara workers simultâneos limitados
  const workers = Array.from({ length: limiteConcorrencia }, () => trabalhador());
  await {{blank_1}}(workers);

  return resultados;
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Remoção do início da fila',
        expectedAnswers: ['shift'],
        hint: 'Método de array que remove e devolve o primeiro elemento.',
      },
      {
        id: 'blank_1',
        label: 'Aguardar todos os workers',
        expectedAnswers: ['Promise.all'],
        hint: 'Método estático para aguardar a resolução de todos os workers.',
      },
    ],
    solutionCode: `async function executarComLimite(tarefas, limiteConcorrencia = 3) {
  const resultados = [];
  const fila = [...tarefas.entries()];

  async function trabalhador() {
    while (fila.length > 0) {
      const [indice, tarefa] = fila.shift();
      resultados[indice] = await tarefa();
    }
  }

  const workers = Array.from({ length: limiteConcorrencia }, () => trabalhador());
  await Promise.all(workers);

  return resultados;
}`,
    hints: [
      'Dica 1: Cada trabalhador pega uma tarefa com fila.shift() até a lista esvaziar.',
      'Dica 2: Promise.all(workers) aguarda todos os workers terminarem suas rotinas.',
    ],
    testCases: [
      {
        description: 'Executa todas as tarefas mantendo concorrência máxima de N',
        expectedOutput: 'Resultados completos preservando índices originais',
      },
    ],
    explanation: 'O padrão Concurrency Pool é indispensável para web scrapers, uploaders em lote e sincronizações em massa.',
  },

  // 4
  {
    id: 'js-avancado-04',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Arquitetura de Middleware',
    title: 'Pipeline de Middlewares Assíncronos no Estilo Koa/Express',
    summary: 'Construa um motor de execução em camadas (Onion Architecture) onde middlewares interceptam a entrada e a saída.',
    realWorldContext: 'Frameworks backend em Node.js (Koa, Express, Fastify) e frontend (Redux) são inteiramente baseados nesse algoritmo de encadeamento.',
    description: 'Complete o despachante recursivo `dispatch(i)` que compõe a pilha de middlewares.',
    goal: 'Retornar Promise resolvida com a chamada do middleware atual e seu next.',
    templateCode: `class MiddlewarePipeline {
  constructor() {
    this.middlewares = [];
  }

  use(fn) {
    this.middlewares.push(fn);
    return this;
  }

  compose(contexto) {
    let index = -1;

    const dispatch = (i) => {
      if (i <= index) return Promise.reject(new Error('next() chamado multiplas vezes'));
      index = i;

      const fn = this.middlewares[i];
      if (!fn) return {{blank_0}}.resolve();

      try {
        return Promise.resolve(
          {{blank_1}}(contexto, () => dispatch(i + 1))
        );
      } catch (err) {
        return Promise.reject(err);
      }
    };

    return dispatch(0);
  }
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Resolução da promessa de encerramento',
        expectedAnswers: ['Promise'],
        hint: 'Classe nativa de Promise.',
      },
      {
        id: 'blank_1',
        label: 'Invocação do middleware atual',
        expectedAnswers: ['fn'],
        hint: 'Função do middleware atual que recebe contexto e o próximo callback.',
      },
    ],
    solutionCode: `class MiddlewarePipeline {
  constructor() {
    this.middlewares = [];
  }

  use(fn) {
    this.middlewares.push(fn);
    return this;
  }

  compose(contexto) {
    let index = -1;

    const dispatch = (i) => {
      if (i <= index) return Promise.reject(new Error('next() chamado multiplas vezes'));
      index = i;

      const fn = this.middlewares[i];
      if (!fn) return Promise.resolve();

      try {
        return Promise.resolve(
          fn(contexto, () => dispatch(i + 1))
        );
      } catch (err) {
        return Promise.reject(err);
      }
    };

    return dispatch(0);
  }
}`,
    hints: [
      'Dica 1: Cada middleware tem a assinatura async (ctx, next) => { await next(); }.',
      'Dica 2: dispatch(i + 1) passa o controle para a próxima função na pilha.',
    ],
    testCases: [
      {
        description: 'Executa middlewares em ordem de entrada e saída concêntrica',
        expectedOutput: 'Pipeline concluído com sucesso',
      },
    ],
    explanation: 'Esse é o algoritmo exato do koa-compose, consagrado na arquitetura de servidores Node.js.',
  },

  // 5
  {
    id: 'js-avancado-05',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Web APIs (IntersectionObserver)',
    title: 'Carregamento Sob Demanda com IntersectionObserver',
    summary: 'Dispare o carregamento de imagens ou novos lotes de dados somente quando o elemento entrar na viewport do usuário.',
    realWorldContext: 'Garante score máximo no Google PageSpeed (Core Web Vitals) evitando carregar imagens pesadas que o usuário ainda não rolou para ver.',
    description: 'Instancie o IntersectionObserver checando entry.isIntersecting e desregistre o elemento com unobserve após o carregamento.',
    goal: 'Verificar isIntersecting e invocar unobserve.',
    templateCode: `function observarElementoVisivel(elemento, aoEntrarNaTela) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      // 1. Verifica se o elemento cruzou o limite da viewport
      if (entry.{{blank_0}}) {
        aoEntrarNaTela(entry.target);
        // 2. Para de observar o elemento já carregado
        obs.{{blank_1}}(entry.target);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(elemento);
  return observer;
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Propriedade booleana de interseção',
        expectedAnswers: ['isIntersecting'],
        hint: 'Propriedade de IntersectionObserverEntry que indica se o elemento está visível.',
      },
      {
        id: 'blank_1',
        label: 'Método para desregistrar elemento',
        expectedAnswers: ['unobserve'],
        hint: 'Método que para de observar um elemento específico.',
      },
    ],
    solutionCode: `function observarElementoVisivel(elemento, aoEntrarNaTela) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        aoEntrarNaTela(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(elemento);
  return observer;
}`,
    hints: [
      'Dica 1: entry.isIntersecting avalia para true assim que o elemento atinge a margem estipulada.',
      'Dica 2: unobserve() evita que o callback dispare novamente em rolagens futuras.',
    ],
    testCases: [
      {
        description: 'Dispara callback e desregistra elemento',
        expectedOutput: 'Elemento carregado e unobserved',
      },
    ],
    explanation: 'IntersectionObserver roda na thread do compositor do navegador e consome drasticamente menos CPU do que ouvintes de scroll tradicionais.',
  },

  // 6
  {
    id: 'js-avancado-06',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Padrão Observable / PubSub',
    title: 'Barramento de Eventos Tipado com Inscrição e Desinscrição Segura',
    summary: 'Construa um EventEmitter com retorno de método unsubscribe para prevenir vazamentos de memória (memory leaks).',
    realWorldContext: 'Em SPAs (React, Vue), componentes que registram listeners em barramentos globais precisam cancelar a inscrição ao serem desmontados.',
    description: 'Implemente o método emit() com Set de ouvintes e retorne a função de cleanup no subscribe.',
    goal: 'Iterar sobre o Set de ouvintes e retornar a função unsubscribe.',
    templateCode: `class BarramentoEventos {
  #eventos = new Map();

  subscribe(evento, listener) {
    if (!this.#eventos.has(evento)) {
      this.#eventos.set(evento, new Set());
    }

    const listeners = this.#eventos.get(evento);
    listeners.add(listener);

    // Retorna função de desinscrição (cleanup)
    return () => {
      listeners.{{blank_0}}(listener);
    };
  }

  emit(evento, payload) {
    const listeners = this.#eventos.get(evento);
    if (!listeners) return;

    // Dispara para cada ouvinte registrado
    {{blank_1}}
  }
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Remoção do ouvinte no Set',
        expectedAnswers: ['delete'],
        hint: 'Método de Set para remover um item específico.',
      },
      {
        id: 'blank_1',
        label: 'Iteração sobre os listeners',
        expectedAnswers: [
          'listeners.forEach(fn => fn(payload));',
          'for (const fn of listeners) { fn(payload); }',
        ],
        hint: 'Percorra listeners e invoque cada função com payload.',
      },
    ],
    solutionCode: `class BarramentoEventos {
  #eventos = new Map();

  subscribe(evento, listener) {
    if (!this.#eventos.has(evento)) {
      this.#eventos.set(evento, new Set());
    }

    const listeners = this.#eventos.get(evento);
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  emit(evento, payload) {
    const listeners = this.#eventos.get(evento);
    if (!listeners) return;

    listeners.forEach(fn => fn(payload));
  }
}`,
    hints: [
      'Dica 1: O método Set.delete(item) remove a referência do ouvinte.',
      'Dica 2: Retornar uma closure () => listeners.delete(listener) permite ao React usar como retorno do useEffect.',
    ],
    testCases: [
      {
        description: 'Notifica ouvintes e cancela inscrição com cleanup',
        expectedOutput: 'Ouvinte notificado e removido',
      },
    ],
    explanation: 'Armazenar listeners em Set elimina duplicatas acidentais e simplifica a remoção em O(1).',
  },

  // 7
  {
    id: 'js-avancado-07',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Gerenciamento de Memória (WeakMap)',
    title: 'Cache Sem Vazamento de Memória com WeakMap',
    summary: 'Associe metadados a objetos de DOM ou modelos de negócio sem impedir a coleta de lixo (Garbage Collector).',
    realWorldContext: 'Se você guardar objetos em um Map comum, eles nunca serão liberados pelo Garbage Collector, gerando lentidão progressiva no navegador.',
    description: 'Use a classe nativa WeakMap cujas chaves mantêm apenas referências fracas.',
    goal: 'Instanciar WeakMap e verificar existência com has.',
    templateCode: `// Cache fraco que permite ao Garbage Collector limpar instâncias órfãs
const metadadosCache = {{blank_0}}();

function anexarMetadados(objeto, dados) {
  metadadosCache.set(objeto, dados);
}

function obterMetadados(objeto) {
  if (!metadadosCache.{{blank_1}}(objeto)) {
    return null;
  }
  return metadadosCache.get(objeto);
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Instanciação da estrutura de referência fraca',
        expectedAnswers: ['new WeakMap'],
        hint: 'Crie uma nova instância da classe WeakMap.',
      },
      {
        id: 'blank_1',
        label: 'Verificação no WeakMap',
        expectedAnswers: ['has'],
        hint: 'Método para checar se a chave existe na coleção.',
      },
    ],
    solutionCode: `const metadadosCache = new WeakMap();

function anexarMetadados(objeto, dados) {
  metadadosCache.set(objeto, dados);
}

function obterMetadados(objeto) {
  if (!metadadosCache.has(objeto)) {
    return null;
  }
  return metadadosCache.get(objeto);
}`,
    hints: [
      'Dica 1: As chaves de um WeakMap DEVEM ser objetos.',
      'Dica 2: Quando o objeto-chave for desalocado no restante do app, sua entrada no WeakMap é liberada automaticamente.',
    ],
    testCases: [
      {
        description: 'Guarda e recupera metadados sem criar retenção forte de memória',
        expectedOutput: 'Metadados recuperados',
      },
    ],
    explanation: 'WeakMap é a estrutura ideal para bibliotecas e frameworks armazenarem dados privados ou estados transitórios de elementos da UI.',
  },

  // 8
  {
    id: 'js-avancado-08',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Criptografia Web Crypto API',
    title: 'Geração de Hash SHA-256 no Navegador com crypto.subtle',
    summary: 'Calcule a assinatura criptográfica SHA-256 de uma string usando a API de alto desempenho do navegador.',
    realWorldContext: 'Geração de checksums de arquivos e verificação de integridade de dados antes de uploads em nuvem.',
    description: 'Use TextEncoder para transformar string em buffer e chame crypto.subtle.digest.',
    goal: 'Codificar o texto e invocar crypto.subtle.digest com "SHA-256".',
    templateCode: `async function gerarHashSha256(mensagem) {
  // 1. Converte a string UTF-8 em Uint8Array
  const codificador = new TextEncoder();
  const dados = codificador.{{blank_0}}(mensagem);

  // 2. Calcula o hash criptográfico com Web Crypto API
  const hashBuffer = await crypto.subtle.{{blank_1}}('SHA-256', dados);

  // Converte ArrayBuffer para string hexadecimal
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Método do TextEncoder para codificar',
        expectedAnswers: ['encode'],
        hint: 'Método de instâncias de TextEncoder que devolve um Uint8Array.',
      },
      {
        id: 'blank_1',
        label: 'Método de digest criptográfico',
        expectedAnswers: ['digest'],
        hint: 'Método da API crypto.subtle para calcular hashes.',
      },
    ],
    solutionCode: `async function gerarHashSha256(mensagem) {
  const codificador = new TextEncoder();
  const dados = codificador.encode(mensagem);

  const hashBuffer = await crypto.subtle.digest('SHA-256', dados);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}`,
    hints: [
      'Dica 1: TextEncoder().encode(str) produz o buffer binário necessário.',
      'Dica 2: crypto.subtle.digest("SHA-256", buffer) executa de forma acelerada por hardware.',
    ],
    testCases: [
      {
        description: 'Retorna hash hexadecimal de 64 caracteres',
        expectedOutput: 'Hash SHA-256 válido',
      },
    ],
    explanation: 'A Web Crypto API é nativa, segura contra vulnerabilidades de bibliotecas terceiras e muito mais rápida que pacotes JS de hashing.',
  },

  // 9
  {
    id: 'js-avancado-09',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Estruturas de Dados & Diffing',
    title: 'Cálculo de Diferenças Estruturais (Object Diff)',
    summary: 'Construa uma função que compara dois objetos e retorna apenas os campos que foram alterados ou adicionados.',
    realWorldContext: 'Em formulários complexos e requisições PATCH, enviar apenas os campos modificados economiza banda e previne sobrescrita acidental no banco de dados.',
    description: 'Percorra as chaves do objeto modificado e filtre onde o valor difere do original.',
    goal: 'Identificar propriedades alteradas e montar o objeto de patch.',
    templateCode: `function calcularDiff(original, modificado) {
  const patch = {};

  for (const [chave, valor] of Object.{{blank_0}}(modificado)) {
    // Se o valor for estritamente diferente ou não existir no original
    if (original[chave] {{blank_1}} valor) {
      patch[chave] = valor;
    }
  }

  return patch;
}

const antes = { nome: 'Ana', email: 'ana@teste.com', ativo: true };
const depois = { nome: 'Ana Silva', email: 'ana@teste.com', ativo: false };
console.log(calcularDiff(antes, depois)); // { nome: 'Ana Silva', ativo: false }
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Método para extrair pares [chave, valor]',
        expectedAnswers: ['entries'],
        hint: 'Método estático de Object que retorna um array de tuplas [key, value].',
      },
      {
        id: 'blank_1',
        label: 'Comparador de desigualdade estrita',
        expectedAnswers: ['!=='],
        hint: 'Operador que testa se dois valores diferem em tipo ou conteúdo.',
      },
    ],
    solutionCode: `function calcularDiff(original, modificado) {
  const patch = {};

  for (const [chave, valor] of Object.entries(modificado)) {
    if (original[chave] !== valor) {
      patch[chave] = valor;
    }
  }

  return patch;
}`,
    hints: [
      'Dica 1: Object.entries(objeto) desestrutura cada par facilmente.',
      'Dica 2: !== evita coerções de tipo bizarras.',
    ],
    testCases: [
      {
        description: 'Gera patch contendo apenas nome e ativo modificados',
        expectedOutput: "{ nome: 'Ana Silva', ativo: false }",
      },
    ],
    explanation: 'Calcular patches no cliente é fundamental para requisições HTTP PATCH eficientes e auditoria de formulários.',
  },

  // 10
  {
    id: 'js-avancado-10',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'lacunas',
    topic: 'Paralelismo & Web Workers',
    title: 'Comunicação Bidirecional com Web Worker',
    summary: 'Envie dados pesados para processamento em segundo plano sem congelar a interface do usuário.',
    realWorldContext: 'Processar 50.000 linhas de planilha ou aplicar filtros em fotos na thread principal congela animações e botões.',
    description: 'Instancie o Worker e use postMessage para enviar e onmessage para escutar a resposta.',
    goal: 'Preencher postMessage e o listener onmessage.',
    templateCode: `function processarEmWorker(scriptUrl, dados) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(scriptUrl);

    // 1. Escuta a resposta processada pelo worker
    worker.{{blank_0}} = (evento) => {
      resolve(evento.data);
      worker.terminate();
    };

    worker.onerror = (erro) => {
      reject(erro);
      worker.terminate();
    };

    // 2. Envia a carga de trabalho para a thread paralela
    worker.{{blank_1}}(dados);
  });
}
`,
    blanks: [
      {
        id: 'blank_0',
        label: 'Propriedade de recepção de mensagem',
        expectedAnswers: ['onmessage'],
        hint: 'Manipulador de eventos disparado quando o worker envia dados de volta.',
      },
      {
        id: 'blank_1',
        label: 'Método de envio para o worker',
        expectedAnswers: ['postMessage'],
        hint: 'Método para despachar uma mensagem clonada para o worker.',
      },
    ],
    solutionCode: `function processarEmWorker(scriptUrl, dados) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(scriptUrl);

    worker.onmessage = (evento) => {
      resolve(evento.data);
      worker.terminate();
    };

    worker.onerror = (erro) => {
      reject(erro);
      worker.terminate();
    };

    worker.postMessage(dados);
  });
}`,
    hints: [
      'Dica 1: worker.onmessage recebe o evento com os dados em evento.data.',
      'Dica 2: worker.postMessage() copia ou transfere o payload para a thread separada.',
    ],
    testCases: [
      {
        description: 'Comunicação assíncrona com encerramento do worker via terminate()',
        expectedOutput: 'Resultado do worker resolvido na Promise',
      },
    ],
    explanation: 'Web Workers permitem verdadeiro paralelismo multi-core na web, mantendo 60fps constantes na thread de renderização da UI.',
  },

  // 11 - Corrigir Erros (Promise.allSettled)
  {
    id: 'js-avancado-debug-01',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'corrigir_erros',
    topic: 'Promises & Resiliência',
    title: 'Depuração: Promise.all Falha Tudo em Lote vs Promise.allSettled',
    summary: 'Corrija um comportamento frágil onde uma única falha em requisições paralelas descarta todos os outros dados carregados com sucesso.',
    realWorldContext: 'Em dashboards que carregam widgets de múltiplos microsserviços, se o widget de clima falhar, o relatório financeiro e os dados do usuário não devem quebrar. Promise.allSettled isola as falhas.',
    description: 'A função `carregarLoteDeAPIs` usa `Promise.all`. Quando qualquer uma das Promises é rejeitada, a função inteira cai no catch e perde as respostas que deram certo! Refatore para usar `Promise.allSettled` e retornar apenas os valores dos resultados com status "fulfilled".',
    goal: 'Substituir Promise.all por Promise.allSettled e filtrar apenas os resultados com sucesso.',
    bugDescription: 'Promise.all falha rápido (fail-fast) ao primeiro erro, perdendo todas as requisições bem-sucedidas.',
    buggyLineNumbers: [4],
    initialBuggyCode: `async function carregarLoteDeAPIs(promises) {
    // BUG: Se uma promise falhar, Promise.all descarta todo o resto!
    const respostas = await Promise.all(promises);
    return respostas;
}
`,
    templateCode: `async function carregarLoteDeAPIs(promises) {
    // Corrija usando Promise.allSettled e retorne apenas os valores com status "fulfilled":
    const resultados = await Promise.allSettled(promises);
    return resultados
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);
}
`,
    solutionCode: `async function carregarLoteDeAPIs(promises) {
    const resultados = await Promise.allSettled(promises);
    return resultados
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value);
}
`,
    hints: [
      'Dica 1: Promise.allSettled() nunca rejeita; retorna um array de objetos { status: "fulfilled" | "rejected", value/reason }.',
      'Dica 2: Filtre por r.status === "fulfilled" e mapeie para extrair r.value.',
    ],
    testCases: [
      {
        description: 'Recupera valores bem-sucedidos ignorando a promise rejeitada',
        expectedOutput: '[10, 30]',
        testFunction: `
          const p1 = Promise.resolve(10);
          const p2 = Promise.reject(new Error("Falha na API 2"));
          const p3 = Promise.resolve(30);
          return carregarLoteDeAPIs([p1, p2, p3]).then(res => {
            return Array.isArray(res) && res.length === 2 && res[0] === 10 && res[1] === 30;
          });
        `,
      },
    ],
    validationRules: [
      {
        id: 'rule-allsettled',
        description: 'Uso de Promise.allSettled()',
        type: 'contains',
        target: 'allSettled',
      },
      {
        id: 'rule-fulfilled',
        description: 'Filtro por status "fulfilled"',
        type: 'contains',
        target: 'fulfilled',
      },
    ],
    explanation: 'Promise.allSettled() aguarda a conclusão de todas as promessas, independentemente de sucesso ou falha, permitindo que a aplicação degrade graciosamente sem bloquear os fluxos que funcionaram.',
  },

  // 12 - Prever a Saída (this e Arrow Functions)
  {
    id: 'js-avancado-prever-01',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'prever_saida',
    topic: 'Escopo Léxico & this',
    title: 'Previsão de Saída: Escopo do "this" em Métodos vs Arrow Functions',
    summary: 'Preveja a saída produzida pela resolução do "this" em métodos tradicionais versus arrow functions em objetos literais.',
    realWorldContext: 'Muitos desenvolvedores caem na armadilha de declarar métodos de objetos literais como arrow functions, descobrindo em produção que this.propriedade é undefined.',
    description: 'Analise o objeto `usuario`. O método `dizerOla` é uma função tradicional e `dizerTchau` é uma arrow function. Preveja a saída exata impressa.',
    goal: 'Prever como o this é resolvido dinamicamente vs lexicamente.',
    templateCode: `const usuario = {
    nome: "Carlos",
    dizerOla: function() {
        return "Olá, " + this.nome;
    },
    dizerTchau: () => {
        return "Tchau, " + (typeof this?.nome !== 'undefined' ? this.nome : "indefinido");
    }
};

console.log(usuario.dizerOla() + " | " + usuario.dizerTchau());
`,
    codeToPredict: `const usuario = {
    nome: "Carlos",
    dizerOla: function() {
        return "Olá, " + this.nome;
    },
    dizerTchau: () => {
        return "Tchau, " + (typeof this?.nome !== 'undefined' ? this.nome : "indefinido");
    }
};

console.log(usuario.dizerOla() + " | " + usuario.dizerTchau());`,
    expectedOutputPrediction: 'Olá, Carlos | Tchau, indefinido',
    acceptableOutputPredictions: ['Olá, Carlos | Tchau, indefinido', 'Ola, Carlos | Tchau, indefinido'],
    solutionCode: `// dizerOla() tem o "this" vinculado ao objeto usuario ("Carlos")
// dizerTchau() é arrow function, portanto herda o "this" do escopo global externo (não tem "nome")
console.log(usuario.dizerOla() + " | " + usuario.dizerTchau()); // "Olá, Carlos | Tchau, indefinido"`,
    hints: [
      'Dica 1: Funções tradicionais (function) vinculam "this" ao objeto que faz a invocação antes do ponto (usuario).',
      'Dica 2: Arrow functions NÃO possuem seu próprio "this"; elas capturam lexicamente o escopo que as envolve (neste caso, o escopo global ou de módulo).',
      'Dica 3: O separador é " | ".',
    ],
    testCases: [
      {
        description: 'Imprime "Olá, Carlos | Tchau, indefinido"',
        expectedOutput: 'Olá, Carlos | Tchau, indefinido',
      },
    ],
    explanation: 'Arrow functions não criam seu próprio contexto de "this". Em objetos literais, as chaves {} não criam escopo de bloco para o this, fazendo com que a arrow function capture o "this" do módulo externo (window ou {} no Node/ESM), onde this.nome não existe.',
  },

  // 13 - Desafio Prático
  {
    id: 'js-avancado-desafio-01',
    language: 'javascript',
    difficulty: 'avancado',
    type: 'desafio_pratico',
    topic: 'Concorrência & Filas Assíncronas',
    title: 'Desafio Prático: Limitador de Concorrência Assíncrona (Task Queue Pool)',
    summary: 'Implemente um pool de concorrência que executa uma lista de tarefas assíncronas com no máximo N promessas ativas ao mesmo tempo.',
    realWorldContext: 'Fazer 1.000 requisições simultâneas com Promise.all derruba o servidor da API (erro 429 Too Many Requests). Um limitador de concorrência executa em lotes controlados (ex: 3 por vez).',
    description: 'Implemente a função `executarComLimite(tarefas, limite)`:\n- `tarefas` é um array de funções assíncronas `() => Promise<any>`.\n- `limite` é a quantidade máxima de tarefas executando simultaneamente (ex: 2).\n- Retorna uma Promise que resolve em um array com todos os resultados na mesma ordem das tarefas originais.',
    goal: 'Controlar a concorrência assíncrona mantendo a fila em fluxo contínuo.',
    practicalRequirements: [
      'Executar no máximo "limite" tarefas simultaneamente',
      'Manter os resultados na ordem original correspondente ao array de tarefas',
      'Retornar uma Promise que resolve quando todas as tarefas forem concluídas',
    ],
    templateCode: `async function executarComLimite(tarefas, limite) {
    const resultados = [];
    let indice = 0;

    async function trabalhador() {
        while (indice < tarefas.length) {
            const atual = indice++;
            resultados[atual] = await tarefas[atual]();
        }
    }

    const trabalhadores = [];
    for (let i = 0; i < Math.min(limite, tarefas.length); i++) {
        trabalhadores.push(trabalhador());
    }

    await Promise.all(trabalhadores);
    return resultados;
}

// Teste rápido:
const t1 = () => new Promise(res => setTimeout(() => res("A"), 20));
const t2 = () => new Promise(res => setTimeout(() => res("B"), 10));
const t3 = () => new Promise(res => setTimeout(() => res("C"), 15));

executarComLimite([t1, t2, t3], 2).then(console.log); // ['A', 'B', 'C']
`,
    solutionCode: `async function executarComLimite(tarefas, limite) {
    const resultados = [];
    let indice = 0;

    async function trabalhador() {
        while (indice < tarefas.length) {
            const atual = indice++;
            resultados[atual] = await tarefas[atual]();
        }
    }

    const trabalhadores = [];
    for (let i = 0; i < Math.min(limite, tarefas.length); i++) {
        trabalhadores.push(trabalhador());
    }

    await Promise.all(trabalhadores);
    return resultados;
}
`,
    hints: [
      'Dica 1: O padrão "worker pool" usa N funções trabalhadoras que pegam o próximo item enquanto houver tarefas na fila.',
      'Dica 2: Armazenar resultados[atual] garante que o índice original seja preservado independentemente de qual terminou primeiro.',
    ],
    testCases: [
      {
        description: 'Executa todas as tarefas preservando a ordem dos resultados',
        expectedOutput: '["A", "B", "C"]',
        testFunction: `
          const t1 = () => new Promise(res => setTimeout(() => res("A"), 20));
          const t2 = () => new Promise(res => setTimeout(() => res("B"), 10));
          const t3 = () => new Promise(res => setTimeout(() => res("C"), 15));
          return executarComLimite([t1, t2, t3], 2).then(res => {
            return JSON.stringify(res) === JSON.stringify(["A", "B", "C"]);
          });
        `,
      },
    ],
    validationRules: [
      {
        id: 'rule-loop',
        description: 'Controle de fila com loop e Promise.all dos workers',
        type: 'contains',
        target: 'Promise.all',
      },
    ],
    explanation: 'O padrão Worker Pool cria um número fixo de promessas ativas ("trabalhadores"). Cada trabalhador consome atomicamente a próxima tarefa da fila e guarda seu resultado no índice correto, evitando sobrecarga de conexões e rate limits.',
  },
];

